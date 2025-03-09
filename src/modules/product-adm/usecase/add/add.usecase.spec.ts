import AddProductUseCase from "./add.usecase";

const MockProductRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    };
};

describe("Add Product usecase unit tests", () => {

    it("should add a product", async () => {
        const productRepository = MockProductRepository();
        const usecase = new AddProductUseCase(productRepository);

        // Arrange
        const input = {
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10
        };

        // Act
        const result = await usecase.execute(input);

        // Assert
        expect(productRepository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toBe(input.name);
        expect(result.description).toBe(input.description);
        expect(result.purchasePrice).toBe(input.purchasePrice);
        expect(result.stock).toBe(input.stock);
        expect(result.createdAt).toBeDefined();
        expect(result.updatedAt).toBeDefined();
        
    });

});