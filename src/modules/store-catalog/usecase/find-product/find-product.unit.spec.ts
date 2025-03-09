import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-product.usecase";

const product = new Product({
    id: new Id("1"),
    name: "product",
    salesPrice: 10,
    description: "description",
});

const MockProductRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        add: jest.fn(),
    };
}

describe('FindProductUseCase unit test', () => {

    it('should find a product by id', async () => {
        const productRepository = MockProductRepository();
        productRepository.find = jest.fn().mockReturnValue(Promise.resolve(product));

        const findProductUseCase = new FindProductUseCase(productRepository);
        const productFound = await findProductUseCase.execute({ id: "1" });

        expect(productRepository.find).toHaveBeenCalledTimes(1);
        expect(productFound).toEqual({
            id: "1",
            name: "product",
            salesPrice: 10,
            description: "description",
        });
    });

    it('should return an error if the product does not exist', async () => {
        const productRepository = MockProductRepository();
        productRepository.find = jest.fn().mockReturnValue(Promise.resolve(null));

        const findProductUseCase = new FindProductUseCase(productRepository);

        await expect(findProductUseCase.execute({ id: "1" })).rejects.toThrowError('Product not found');

    });
});