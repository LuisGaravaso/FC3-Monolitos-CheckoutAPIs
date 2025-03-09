import { Sequelize } from "sequelize-typescript";
import { ProductCatalogModel } from "./product.model";
import ProductRepository from "./product.repository";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("Product Repository unit tests", () => {
    
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductCatalogModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find all products", async () => {
        const product = new ProductCatalogModel({
            id: "1",
            name: "product",
            salesPrice: 10,
            description: "description",
        });

        const product2 = new ProductCatalogModel({
            id: "2",
            name: "product 2",
            salesPrice: 20,
            description: "description 2",
        });

        await product.save();
        await product2.save();

        const productRepository = new ProductRepository();
        const products = await productRepository.findAll();

        expect(products).toHaveLength(2);
        expect(products[0].id.id).toBe(product.id);
        expect(products[0].name).toBe(product.name);
        expect(products[0].salesPrice).toBe(product.salesPrice);
        expect(products[0].description).toBe(product.description);
        expect(products[1].id.id).toBe(product2.id);
        expect(products[1].name).toBe(product2.name);
        expect(products[1].salesPrice).toBe(product2.salesPrice);
        expect(products[1].description).toBe(product2.description);
    });

    it("should return an empty list if there are no products", async () => {
        const productRepository = new ProductRepository();
        const products = await productRepository.findAll();

        expect(products).toEqual([]);
    });

    it("should find a product by id", async () => {
        const product = new ProductCatalogModel({
            id: "1",
            name: "product",
            salesPrice: 10,
            description: "description",
        });

        await product.save();

        const productRepository = new ProductRepository();
        const productFound = await productRepository.find("1");

        expect(productFound).toBeDefined();
        expect(productFound.id.id).toBe(product.id);
        expect(productFound.name).toBe(product.name);
        expect(productFound.salesPrice).toBe(product.salesPrice);
        expect(productFound.description).toBe(product.description);
    });

    it("should throw an error if product is not found", async () => {
        const productRepository = new ProductRepository();
        
        await expect(productRepository.find("1")).rejects.toThrowError("Product with id 1 not found");
    });

   
});