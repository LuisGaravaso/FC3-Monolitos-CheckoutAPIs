import Id from "../../../@shared/domain/value-object/id.value-object";
import { ClientModel } from "../../../client-adm/repository/client.model";
import { ProductCatalogModel } from "../../../store-catalog/repository/product.model";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGatewayInterface from "../../gateway/checkout.gateway";
import { OrderModel, OrderProductModel } from "./order.model";

export default class OrderRepository implements CheckoutGatewayInterface {
    async addOrder(input: Order): Promise<void> {
        try {
            await OrderModel.create({
                id: input.id.id,
                clientId: input.client.id.id,
                status: input.status,
            });
        } catch (error) {
            console.error("Error creating order:", error);
            return;
        }
    
        for (const product of input.products) {
            try {
                await OrderProductModel.create({
                    orderItemsId: (new Id()).id,
                    orderId: input.id.id,
                    productId: product.id.id,
                });
            } catch (error) {
                console.error("Error adding product to order:", error);
            }
        }
    }
    
    
    async findOrder(id: string): Promise<Order | undefined> {
        const order = await OrderModel.findOne({
            where: { id },
            include: [
                ClientModel,
                {
                    model: OrderProductModel,
                    include: [ProductCatalogModel],
                }
            ],
        });

        if (!order) return undefined;

        const clientProps = {
            id: new Id(order.client.id),
            name: order.client.name,
            email: order.client.email,
            document: order.client.document,
            address: order.client.street,
        }
        
        const productsPromises = order.products.map(async (product) => {
            const productCatalog = await ProductCatalogModel.findOne({
                where: { id: product.productId },
            });

            const productProps = {
                id: new Id(productCatalog.id),
                name: productCatalog.name,
                salesPrice: productCatalog.salesPrice,
                description: productCatalog.description,
            }
            return new Product(productProps);
        });
        const products = await Promise.all(productsPromises);

        const orderProps = {
            id: new Id(order.id),
            clientId: order.clientId,
            client: new Client(clientProps),
            products: products,
            status: order.status,
        }
        return new Order(orderProps);
    }
}
