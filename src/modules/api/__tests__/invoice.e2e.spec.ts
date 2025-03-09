import InvoiceFacadeFactory from "../../invoice/factory/facade.factory";
import InvoiceRepository from "../../invoice/repository/invoice.repository";
import GenerateInvoiceUseCase from "../../invoice/usecase/generate/invoice.generate.usecase";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for Invoice API", () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should return 404 when invoice is not found", async () => {
        const response = await request(app)
            .get("/invoice/1");

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Invoice not found.");
    });

    it("should return 500 if there is an internal server error", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs

        // Simulate an internal server error by modifying the factory
        jest.spyOn(InvoiceFacadeFactory, "create")
            .mockImplementation(() => {
                throw new Error("Unexpected error");
            });

        const response = await request(app)
            .get("/invoice/1");

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("message", "Internal server error.");

        jest.restoreAllMocks(); // Restore mocked functions
    });

    it("should return the invoice when it is found", async () => {

        const invoice = {
            name: 'John Doe',
            document: '12345678900',
            street: 'Main Street',
            number: '100',
            complement: 'Apt 101',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            items: [
                {
                    id: '1',
                    name: 'Product 1',
                    price: 100
                },
                {
                    id: '2',
                    name: 'Product 2',
                    price: 200
                }
            ]
        }


        const invoiceRepository = new InvoiceRepository();
        const generateUseCase = new GenerateInvoiceUseCase(invoiceRepository);
        const output = await generateUseCase.execute(invoice);

        const response = await request(app)
            .get("/invoice/" + output.id);

        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(output.id);
        expect(response.body.name).toEqual(invoice.name);
        expect(response.body.document).toEqual(invoice.document);
        expect(response.body.address.street).toEqual(invoice.street);
        expect(response.body.address.number).toEqual(invoice.number);
        expect(response.body.address.complement).toEqual(invoice.complement);
        expect(response.body.address.city).toEqual(invoice.city);
        expect(response.body.address.state).toEqual(invoice.state);
        expect(response.body.address.zipCode).toEqual(invoice.zipCode);
        expect(response.body.items.length).toEqual(invoice.items.length);
        expect(response.body.items[0].id).toEqual(invoice.items[0].id);
        expect(response.body.items[0].name).toEqual(invoice.items[0].name);
        expect(response.body.items[0].price).toEqual(invoice.items[0].price);
        expect(response.body.items[1].id).toEqual(invoice.items[1].id);
        expect(response.body.items[1].name).toEqual(invoice.items[1].name);
        expect(response.body.items[1].price).toEqual(invoice.items[1].price);
        expect(response.body.total).toEqual(300);
        expect(response.body.createdAt).toBeDefined();

    });

});