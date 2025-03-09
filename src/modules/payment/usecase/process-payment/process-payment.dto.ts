// type TransactionProps = {
//     id?: Id;
//     amount: number;
//     orderId: string;
//     status?: string;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

export interface ProcessPaymentInputDto {
    amount: number;
    orderId: string;
}

export interface ProcessPaymentOutputDto {
    transactionId: string;
    orderId: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}