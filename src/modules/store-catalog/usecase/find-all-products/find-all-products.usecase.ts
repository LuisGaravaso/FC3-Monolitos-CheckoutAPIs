import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import ProductGateway from "../../gateway/product.gateway";
import { FindAllProductsInputDto, FindAllProductsOutputDto } from "./find-all-products.dto";

export default class FindAllProductsUseCase implements UseCaseInterface {
    constructor(private productRepository: ProductGateway) {}

    async execute(input: FindAllProductsInputDto): Promise<FindAllProductsOutputDto> {
        const products = await this.productRepository.findAll();
        return {
            products: products.map(product => ({
                id: product.id.id,
                name: product.name,
                salesPrice: product.salesPrice,
                description: product.description,
            }))
        };
        
    }
}