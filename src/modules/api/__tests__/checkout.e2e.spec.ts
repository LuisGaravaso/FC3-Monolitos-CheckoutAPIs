import CheckoutFacadeFactory from "../../checkout/factory/checkout.facade.factory";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for Checkout API", () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe("Tests that assert for success", () => {
        it("should place an order successfully", async () => {
            const response = await request(app)
                .post("/checkout")
                .send({
                    clientId: "1",
                    products: [
                        {
                            productId: "1",
                        }
                    ]
                });
    
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "Order placed successfully.");
            expect(response.body).toHaveProperty("order");
            expect(response.body.order.id).toBeDefined();
            expect(response.body.order.invoiceId).toBeDefined();
            expect(response.body.order.total).toBe(200);
            expect(response.body.order.status).toBe("approved");
            expect(response.body.order.products).toHaveLength(1);
            
        });
    });

    describe("Tests that assert for errors", () => {
        it("should return 500 if there is an internal server error", async () => {
            jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
    
            // Simulate an internal server error by modifying the factory
            jest.spyOn(CheckoutFacadeFactory, "create")
                .mockImplementation(() => {
                    throw new Error("Unexpected error");
                });
    
            const response = await request(app)
                .post("/checkout")
                .send({
                    clientId: "1",
                    products: [
                        {
                            productId: "1",
                        }
                    ]
                });
    
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty("message", "Internal server error.");
    
            jest.restoreAllMocks(); // Restore mocked functions
        });
    
        it("should return 400 when input is invalid", async () => {
            const response = await request(app)
                .post("/checkout")
                .send({
                    clientId: 123,
                    products: ""
                });
    
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Invalid input format.");
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ msg: "Client id must be a string." }),
                    expect.objectContaining({ msg: "Products must be a non-empty array." }),
                ])
            );
        });
    
        it("should return 400 when there are no products", async () => {
            const response = await request(app)
                .post("/checkout")
                .send({
                    clientId: "1",
                    products: []
                });
    
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty("message", "Invalid input format.");
                expect(response.body.errors).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ msg: "Products must be a non-empty array."}),
                    ])
                );
        });
    
        it("should return 400 when there are invalid products", async () => {
            const response = await request(app)
                .post("/checkout")
                .send({
                    clientId: "1",
                    products: [
                        {
                            productId: 1,
                        }
                    ]
                });
    
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty("message", "Invalid input format.");
                expect(response.body.errors).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ msg: "Product id must be a string."}),
                    ])
                );
        });

    });

 
});