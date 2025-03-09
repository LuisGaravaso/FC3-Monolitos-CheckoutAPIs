import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "./product.model";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductRepository from "./product.repository";

describe("Product Repository unit tests", () => {
    
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should add a product", async () => {
        
        const ProductProps = {
            id: new Id("1"),
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10
        }
        const product = new Product(ProductProps);
        const productRepository = new ProductRepository();
        await productRepository.add(product);

        const productDb = await ProductModel.findOne({ where: { id: product.id.id } });

        expect(productDb).toBeDefined();
        expect(productDb.id).toBe(product.id.id);
        expect(productDb.name).toBe(product.name);
        expect(productDb.description).toBe(product.description);
        expect(productDb.purchasePrice).toBe(product.purchasePrice);
        expect(productDb.stock).toBe(product.stock);
    });

    it("should find a product", async () => {
        
        const ProductProps = {
            id: new Id("1"),
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10
        }
        const product = new Product(ProductProps);
        const productRepository = new ProductRepository();
        await productRepository.add(product);

        const productDb = await productRepository.find(product.id.id);

        expect(productDb).toBeDefined();
        expect(productDb.id.id).toBe(product.id.id);
        expect(productDb.name).toBe(product.name);
        expect(productDb.description).toBe(product.description);
        expect(productDb.purchasePrice).toBe(product.purchasePrice);
        expect(productDb.stock).toBe(product.stock);
    });

    it("should throw an error when product not found", async () => {
        
        const ProductProps = {
            id: new Id("1"),
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10
        }
        const product = new Product(ProductProps);
        const productRepository = new ProductRepository();
        await productRepository.add(product);

        await expect(productRepository.find("2")).rejects.toThrow("Product with id 2 not found");

    });

    
});