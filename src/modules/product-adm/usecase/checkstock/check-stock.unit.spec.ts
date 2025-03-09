import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUseCase from "./check-stock.usecase";

const product = new Product({
    id: new Id("1"),
    name: "Product 1",
    description: "Product 1 description",
    purchasePrice: 100,
    stock: 10
});

const MockProductRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn()
    };
};

describe("Check Stock Usecase unit test", () => {

    it("should return stock quantity if product exists", async () => {
        const productRepository = MockProductRepository();

        productRepository.find.mockResolvedValue(Promise.resolve(product));

        const usecase = new CheckStockUseCase(productRepository);

        // Arrange
        const input = {
            productId: "1"
        };

        // Act
        const result = await usecase.execute(input);

        // Assert
        expect(productRepository.find).toHaveBeenCalled();
        expect(result.productId).toBe(input.productId);
        expect(result.stock).toBe(product.stock);
    });

    it("should throw an error if product does not exist", async () => {
        const productRepository = MockProductRepository();

        productRepository.find.mockResolvedValue(Promise.resolve(null));

        const usecase = new CheckStockUseCase(productRepository);

        // Arrange
        const input = {
            productId: "1"
        };

        await expect(usecase.execute(input)).rejects.toThrow("Product not found");
    });
});