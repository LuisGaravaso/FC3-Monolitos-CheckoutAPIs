import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";

const transaction = new Transaction({
    id: new Id("1"),
    amount: 100,
    orderId: '123'
});
transaction.process();

const MockRepository = () => {
    return {
        save: jest.fn()
    }
}

describe("ProcessPaymentUseCase", () => {

    it("should process payment", async () => {
        const paymentRepository = MockRepository();
        const processPaymentUseCase = new ProcessPaymentUseCase(paymentRepository);
        const input = {
            amount: 100,
            orderId: '123'
        }
        const transaction = new Transaction({
            id: new Id("1"),
            amount: 100,
            orderId: '123'
        });
        transaction.process();

        paymentRepository.save.mockResolvedValue(transaction);
        const result = await processPaymentUseCase.execute(input);
    
        expect(result.transactionId).toEqual('1');
        expect(result.orderId).toEqual('123');
        expect(result.amount).toEqual(100);
        expect(result.status).toEqual('approved');
    });

    it("should decline payment", async () => {
        const paymentRepository = MockRepository();
        const processPaymentUseCase = new ProcessPaymentUseCase(paymentRepository);
        const input = {
            amount: 50,
            orderId: '123'
        }
        const transaction = new Transaction({
            id: new Id("1"),
            amount: 50,
            orderId: '123'
        });
        transaction.process();

        paymentRepository.save.mockResolvedValue(transaction);
        const result = await processPaymentUseCase.execute(input);
    
        expect(result.transactionId).toEqual('1');
        expect(result.orderId).toEqual('123');
        expect(result.amount).toEqual(50);
        expect(result.status).toEqual('declined');
    });

});