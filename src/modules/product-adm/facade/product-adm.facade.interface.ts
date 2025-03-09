export interface AddProductFacadeInputDTO {
    id?: string;
    name: string;
    description: string;
    purchasePrice: number;
    stock: number;
}

export interface AddProductFacadeOutputDTO {
    id: string;
    name: string;
    description: string;
    purchasePrice: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CheckStockFacadeInputDTO {
    productId: string;
}

export interface CheckStockFacadeOutputDTO {
    productId: string;
    stock: number;
}

export default interface ProductAdmFacadeInterface {
    addProduct(input: AddProductFacadeInputDTO): Promise<AddProductFacadeOutputDTO>;
    checkStock(input: CheckStockFacadeInputDTO): Promise<CheckStockFacadeOutputDTO>;
}