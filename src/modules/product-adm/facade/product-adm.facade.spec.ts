import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import ProductAdmFacadeFactory from "../factory/facade.factory";

describe("ProductAdmFacade test", () => {

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

        const productAdmFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10
        }

        await productAdmFacade.addProduct(input);

        const productDb = await ProductModel.findOne({ where: { id: input.id } });

        expect(productDb).toBeDefined();
        expect(productDb.id).toBe(input.id);
        expect(productDb.name).toBe(input.name);
        expect(productDb.description).toBe(input.description);
        expect(productDb.purchasePrice).toBe(input.purchasePrice);
        expect(productDb.stock).toBe(input.stock);
    });

    it("should check stock", async () => {

        const productAdmFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10
        }

        await productAdmFacade.addProduct(input);

        const result = await productAdmFacade.checkStock({ productId: input.id });

        expect(result.productId).toBe(input.id);
        expect(result.stock).toBe(input.stock);
    });
});