import Order from "../domain/order.entity";

export default interface CheckoutGatewayInterface {
    addOrder(input: Order): Promise<void>;
    findOrder(id: string): Promise<Order | undefined>;
    
}