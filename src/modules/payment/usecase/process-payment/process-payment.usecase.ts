import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import Transaction from "../../domain/transaction";
import PaymentGateway from "../../gateway/payment.gateway";
import { ProcessPaymentInputDto, ProcessPaymentOutputDto } from "./process-payment.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface {
    
    private _paymentRepository: PaymentGateway;
    
    constructor(paymentRepository: PaymentGateway) {
        this._paymentRepository = paymentRepository;
    }

    async execute(input: ProcessPaymentInputDto): Promise<ProcessPaymentOutputDto> {
        const transaction = new Transaction({
            amount: input.amount,
            orderId: input.orderId
        });

        transaction.process();
        const savedTransaction = await this._paymentRepository.save(transaction);

        return {
            transactionId: savedTransaction.id.id,
            orderId: savedTransaction.orderId,
            amount: savedTransaction.amount,
            status: savedTransaction.status,
            createdAt: savedTransaction.createdAt,
            updatedAt: savedTransaction.updatedAt
        };
    }
}