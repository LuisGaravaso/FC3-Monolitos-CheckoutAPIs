import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindAllProductsUseCase from "./find-all-products.usecase";

const product = new Product({
    id: new Id("1"),
    name: "product",
    salesPrice: 10,
    description: "description",
});

const product2 = new Product({
    id: new Id("2"),
    name: "product 2",
    salesPrice: 20,
    description: "description 2",
});


const mockProductRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2])),
        add: jest.fn(),
    };
};

describe('FindAllProductsUsecase', () => {

    it("should find all products", async () => {
        
        const productRepository = mockProductRepository();
        const findAllProductsUsecase = new FindAllProductsUseCase(productRepository);
        const products = await findAllProductsUsecase.execute({});

        expect(productRepository.findAll).toHaveBeenCalledTimes(1);
        expect(products).toEqual({
            products: [
            {
                id: "1",
                name: "product",
                salesPrice: 10,
                description: "description",
            },
            {
                id: "2",
                name: "product 2",
                salesPrice: 20,
                description: "description 2",
            }
        ]
    });
    });

    it("should return an empty list if there are no products", async () => {
        
        const productRepository = mockProductRepository();
        productRepository.findAll = jest.fn().mockReturnValue(Promise.resolve([]));
        const findAllProductsUsecase = new FindAllProductsUseCase(productRepository);
        const products = await findAllProductsUsecase.execute({});

        expect(productRepository.findAll).toHaveBeenCalledTimes(1);
        expect(products).toEqual({ products: [] });
    });
});