import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import AddProductsUseCase from "./add.product.usecase";

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

describe('AddProductUseCase unit test', () => {

    it('should add a product', async () => {
        const productRepository = MockProductRepository();
        const addProductUseCase = new AddProductsUseCase(productRepository);
        await addProductUseCase.execute({
            id: "1",
            name: "product",
            salesPrice: 10,
            description: "description",
        });

        expect(productRepository.add).toHaveBeenCalledTimes(1);

    });


});