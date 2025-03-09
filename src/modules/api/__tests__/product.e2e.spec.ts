import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for Products API", () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product successfully", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                description: "Product 1 description",
                purchasePrice: 50,
                salesPrice: 100,
                stock: 10
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toEqual("Product added successfully.");
        expect(response.body.productId).toBeDefined();
    });

    it("should return 400 when input is invalid", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                description: "Product 1 description",
                purchasePrice: "Preco",
                //salesPrice: 100, //Missing salesPrice
                stock: 10
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid input format.");
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: "Purchase price must be a number." }),
                expect.objectContaining({ msg: "Sales price must be a number." }),
            ])
        );
    });

    it("should return 500 if there is an internal server error", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs

        // Simulate an internal server error by modifying the factory
        jest.spyOn(ProductAdmFacadeFactory, "create")
            .mockImplementation(() => {
                throw new Error("Unexpected error");
            });

        jest.spyOn(StoreCatalogFacadeFactory, "create")
            .mockImplementation(() => {
                throw new Error("Unexpected error");
            });

        const response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                description: "Product 1 description",
                purchasePrice: 50,
                salesPrice: 100,
                stock: 10
            });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Internal server error." });

        jest.restoreAllMocks(); // Restore mocked functions
    });

});