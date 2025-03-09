import { app, sequelize } from "../express";
import request from "supertest";
import ClientAdmFacadeFactory from '../../client-adm/factory/client-adm.facade.factory';

describe("E2E test for Customer API", () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a customer successfully", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John Doe",
                email: "john.doe@gmail.com",
                document: "123.456.789-00",
                address: {
                    street: "Main St",
                    number: "123",
                    complement: "",
                    city: "Springfield",
                    state: "IL",
                    zipCode: "62701",
                },
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "Client added successfully." });
    });

    it("should return 400 for missing required fields", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                email: "john.doe@gmail.com",
                document: "123.456.789-00",
                address: {
                    street: "Main St",
                    number: "123",
                    complement: "",
                    city: "Springfield",
                    state: "IL",
                    zipCode: "62701",
                },
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid input format.");
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: "Name must be a string." }),
            ])
        );
    });

    it("should return 400 for invalid email format", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John Doe",
                email: "invalid-email",
                document: "123.456.789-00",
                address: {
                    street: "Main St",
                    number: "123",
                    complement: "",
                    city: "Springfield",
                    state: "IL",
                    zipCode: "62701",
                },
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid input format.");
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: "Invalid email format." }),
            ])
        );
    });

    it("should return 400 for invalid address format", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John Doe",
                email: "john.doe@gmail.com",
                document: "123.456.789-00",
                address: "Not an object", // Invalid format
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid input format.");
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: "Address must be an object." }),
            ])
        );
    });

    it("should return 400 for missing address fields", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John Doe",
                email: "john.doe@gmail.com",
                document: "123.456.789-00",
                address: {
                    street: "Main St",
                    number: "123",
                    city: "Springfield",
                    state: "IL",
                    // zipCode missing
                },
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid input format.");
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: "ZipCode must be a string." }),
                expect.objectContaining({ msg: "Complement must be a string." }),
            ])
        );
    });

    it("should return 500 if there is an internal server error", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs

        // Simulate an internal server error by modifying the factory
        jest.spyOn(ClientAdmFacadeFactory, "create")
            .mockImplementation(() => {
                throw new Error("Unexpected error");
            });

        const response = await request(app)
            .post("/customer")
            .send({
                name: "John Doe",
                email: "john.doe@gmail.com",
                document: "123.456.789-00",
                address: {
                    street: "Main St",
                    number: "123",
                    complement: "",
                    city: "Springfield",
                    state: "IL",
                    zipCode: "62701",
                },
            });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Internal server error." });

        jest.restoreAllMocks(); // Restore mocked functions
    });

    it("should return a customer when found", async () => {
        // First, create a customer

        const postRequest = {
            id: "1",
            name: "John Doe",
            email: "john.doe@gmail.com",
            document: "123.456.789-00",
            address: {
                street: "Main St",
                number: "123",
                complement: "",
                city: "Springfield",
                state: "IL",
                zipCode: "62701",
            },
        }
        const createResponse = await request(app)
            .post("/customer")
            .send(postRequest);

        expect(createResponse.status).toBe(201);

        // Now fetch the customer
        const response = await request(app).get(`/customer/1`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(postRequest.id);
        expect(response.body.name).toBe(postRequest.name);
        expect(response.body.email).toBe(postRequest.email);
        expect(response.body.document).toBe(postRequest.document);
        expect(response.body.address.street).toEqual(postRequest.address.street);
        expect(response.body.address.number).toEqual(postRequest.address.number);
        expect(response.body.address.complement).toEqual(postRequest.address.complement);
        expect(response.body.address.city).toEqual(postRequest.address.city);
        expect(response.body.address.state).toEqual(postRequest.address.state);
        expect(response.body.address.zipCode).toEqual(postRequest.address.zipCode);
        expect(response.body).toHaveProperty("createdAt");
        expect(response.body).toHaveProperty("updatedAt");

    });

    it("should return 404 if customer is not found", async () => {
        const response = await request(app).get("/customer/non-existing-id");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Client not found." });
    });

    it("should return 500 if an internal server error occurs", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress error logs

        jest.spyOn(ClientAdmFacadeFactory, "create")
            .mockImplementation(() => {
                throw new Error("Unexpected error");
            });

        const response = await request(app).get("/customer/some-id");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Internal server error." });

        jest.restoreAllMocks(); // Restore original functionality
    });
});
