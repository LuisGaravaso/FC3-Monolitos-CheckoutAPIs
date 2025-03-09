import ClientAdmFacade from "../../client-adm/facade/client-adm.facade";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/facade.factory";
import PaymentFactory from "../../payment/factory/payment.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutFacade from "../facade/checkout.facade";
import OrderRepository from "../repository/order/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutFacadeFactory {
    static create() {

        const placeOrderUseCase = new PlaceOrderUseCase(
            ClientAdmFacadeFactory.create(),
            ProductAdmFacadeFactory.create(),
            StoreCatalogFacadeFactory.create(),
            new OrderRepository(),
            PaymentFactory.create(),
            InvoiceFacadeFactory.create(),
        );

        const facade = new CheckoutFacade({placeOrderUseCase});

        return facade
    }
}