import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import Product from "../../domain/product.entity";
import ProductGateway from "../../gateway/product.gateway";
import { AddProductUseCaseInputDTO, AddProductUseCaseOutputDTO } from "./add.product.dto";

export default class AddProductsUseCase implements UseCaseInterface {
    constructor(private productRepository: ProductGateway) {}

    async execute(input: AddProductUseCaseInputDTO): Promise<AddProductUseCaseOutputDTO> {
        const product = new Product({
            id: new Id(input.id),
            name: input.name,
            salesPrice: input.salesPrice,
            description: input.description,
        })
        await this.productRepository.add(product);
        return {};
    }
}