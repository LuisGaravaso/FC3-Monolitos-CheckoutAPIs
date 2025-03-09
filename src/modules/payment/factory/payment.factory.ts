import PaymentFacade from "../facade/payment.facade";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";

export default class PaymentFactory {
    static create() {
        const repository = new TransactionRepository();
        const usecase = new ProcessPaymentUseCase(repository);
        const facade = new PaymentFacade({ processUseCase: usecase });
        return facade;
    }
}