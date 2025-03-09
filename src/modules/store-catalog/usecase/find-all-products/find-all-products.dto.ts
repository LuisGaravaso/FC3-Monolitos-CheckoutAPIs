type ProductDto = {
    id: string;
    name: string;
    salesPrice: number;
    description: string;
}

export interface FindAllProductsInputDto {}

export interface FindAllProductsOutputDto {
  products: ProductDto[];
}