import Invoice from "../../../invoice/domain/invoice.entity";

export interface PlaceOrderInputDTO {
    clientId: string;
    products: {
        productId: string;
    }[];
}

export interface PlaceOrderOutputDTO {
    id: string;
    invoiceId: string;
    total: number;
    status: string;
    products: {
        productId: string;
    }[];
}