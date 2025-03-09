import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/payment.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGatewayInterface from "../../gateway/checkout.gateway";
import { PlaceOrderInputDTO, PlaceOrderOutputDTO } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
    
    private _clientFacade: ClientAdmFacadeInterface;
    private _productFacade: ProductAdmFacadeInterface;
    private _catalogFacade: StoreCatalogFacadeInterface;
    private _repository: CheckoutGatewayInterface;
    private _invoiceFacade: InvoiceFacadeInterface;
    private _paymentFacade: PaymentFacadeInterface;


    constructor(
        clientFacade: ClientAdmFacadeInterface, 
        productFacade: ProductAdmFacadeInterface,
        catalogFacade: StoreCatalogFacadeInterface,
        repository: CheckoutGatewayInterface,
        paymentFacade: PaymentFacadeInterface,
        invoiceFacade: InvoiceFacadeInterface,
    ) {
        this._clientFacade = clientFacade;
        this._productFacade = productFacade;
        this._catalogFacade = catalogFacade;
        this._repository = repository;
        this._paymentFacade = paymentFacade;
        this._invoiceFacade = invoiceFacade;
    }

    async execute(input: PlaceOrderInputDTO): Promise<PlaceOrderOutputDTO> {

        //Buscar o Client. Se não existir, retornar erro.
        const client = await this._clientFacade.find({ id: input.clientId });
        if (!client) {
            throw new Error("Client not found");
        }

        //Validar Produto
        await this.validateProducts(input);

        //Pegar Produtos
        const products = await Promise.all(
            input.products.map(async product => {
                return await this.getProduct(product.productId);
            })
        );

        //Criar o Objeto do Client
        const myClient = new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            address: client.address.city,
        });

        //Criar o Objeto da nossa ordem
        const order = new Order({
            client: myClient,
            products: products
        });

        //Process Payment
        const payment = await this._paymentFacade.process({
            orderId: order.id.id,
            amount: order.total
        });

        //Caso o Pagamento seja aprovado, criar a Invoice
        const invoice = 
            payment.status === "approved" ?
                await this._invoiceFacade.generate({
                    name: client.name,
                    document: client.document,
                    street: client.address.street,
                    number: client.address.number,
                    complement: client.address.complement,
                    city: client.address.city,
                    state: client.address.state,
                    zipCode: client.address.zipCode,
                    items: products.map(product => {
                        return {
                            id: product.id.id,
                            name: product.name,
                            price: product.salesPrice
                        }
                    })
                }) : null

        //Mudar o status da minha ordem para "approved"
        payment.status === "approved" && order.approve();
        await this._repository.addOrder(order);

        //Retornar o DTO

        return {
            id: order.id.id,
            invoiceId: payment.status == "approved"? invoice.id : null,
            total: order.total,
            status: order.status,
            products: order.products.map(product => {
                return {
                    productId: product.id.id,
                }
            }),
        }
    }

    private async validateProducts(input: PlaceOrderInputDTO): Promise<void> {
        if (input.products.length === 0) {
            throw new Error("No products selected");
        }

        for (const product of input.products) {
            const stock = await this._productFacade.checkStock({ productId: product.productId });
            if (stock.stock <= 0) {
                throw new Error(`Product ${product.productId} is out of stock`);
            }
        }
    }

    private async getProduct(productId: string): Promise<Product> {
        const product = await this._catalogFacade.find({ id: productId });
        if (!product) {
            throw new Error(`Product ${productId} not found`);
        }
        const productProps = {
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice
        }

        return new Product(productProps);

    }
}