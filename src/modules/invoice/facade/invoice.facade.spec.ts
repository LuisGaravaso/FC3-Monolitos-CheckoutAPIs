import { Sequelize } from "sequelize-typescript";
import InvoiceItemsModel from "../repository/invoice-items.model";
import InvoiceModel from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/facade.factory";

describe("Invoice Facade unit tests", () => {
    
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.query("PRAGMA foreign_keys = ON;"); 
        await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find an invoice", async () => {

        // Create Invoice first
        const invoice = await InvoiceModel.create({
            id: "1",
            name: "Invoice 1",
            document: "123456789",
            addressStreet: "Rua 1",
            addressNumber: "123",
            addressComplement: "Casa",
            addressCity: "São Paulo",
            addressState: "SP",
            addressZipCode: "12345678",
            total: 300,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Now create items
        const item1 = await InvoiceItemsModel.create({
            invoiceId: invoice.id, 
            invoiceItemId: "1",
            itemId: "1",
            name: "Item 1",
            price: 100
        });

        const item2 = await InvoiceItemsModel.create({
            invoiceId: invoice.id, 
            invoiceItemId: "2",
            itemId: "2",
            name: "Item 2",
            price: 200
        });

        const facade = InvoiceFacadeFactory.create();

        const invoiceFound = await facade.find({ id: "1" });

        expect(invoiceFound).toBeDefined();
        expect(invoiceFound.id).toBe("1");
        expect(invoiceFound.name).toBe("Invoice 1");
        expect(invoiceFound.document).toBe("123456789");
        expect(invoiceFound.address.street).toBe("Rua 1");
        expect(invoiceFound.address.number).toBe("123");
        expect(invoiceFound.address.complement).toBe("Casa");
        expect(invoiceFound.address.city).toBe("São Paulo");
        expect(invoiceFound.address.state).toBe("SP");
        expect(invoiceFound.address.zipCode).toBe("12345678");
        expect(invoiceFound.total).toBe(300);
        expect(invoiceFound.items.length).toBe(2);
        expect(invoiceFound.items[0].id).toBe("1");
        expect(invoiceFound.items[0].name).toBe("Item 1");
        expect(invoiceFound.items[0].price).toBe(100);
        expect(invoiceFound.items[1].id).toBe("2");
        expect(invoiceFound.items[1].name).toBe("Item 2");
        expect(invoiceFound.items[1].price).toBe(200);
    });

    it("should throw an error when invoice is not found", async () => {

        const facade = InvoiceFacadeFactory.create();

        await expect(facade.find({ id: "1" })).rejects.toThrow("Invoice with id 1 not found");
    });

    it("should generate an invoice", async () => {

        const facade = InvoiceFacadeFactory.create();

        const invoiceGenerated = await facade.generate({
            name: "Invoice 1",
            document: "123456789",
            street: "Rua 1",
            number: "123",
            complement: "Casa",
            city: "São Paulo",
            state: "SP",
            zipCode: "12345678",
            items: [
                { id: "1", name: "Item 1", price: 100 },
                { id: "2", name: "Item 2", price: 200 }
            ]
        });

        expect(invoiceGenerated).toBeDefined();
        expect(invoiceGenerated.id).toBeDefined();
        expect(invoiceGenerated.name).toBe("Invoice 1");
        expect(invoiceGenerated.document).toBe("123456789");
        expect(invoiceGenerated.street).toBe("Rua 1");
        expect(invoiceGenerated.number).toBe("123");
        expect(invoiceGenerated.complement).toBe("Casa");
        expect(invoiceGenerated.city).toBe("São Paulo");
        expect(invoiceGenerated.state).toBe("SP");
        expect(invoiceGenerated.zipCode).toBe("12345678");
        expect(invoiceGenerated.total).toBe(300);
        expect(invoiceGenerated.items.length).toBe(2);
        expect(invoiceGenerated.items[0].id).toBe("1");
        expect(invoiceGenerated.items[0].name).toBe("Item 1");
        expect(invoiceGenerated.items[0].price).toBe(100);
        expect(invoiceGenerated.items[1].id).toBe("2");
        expect(invoiceGenerated.items[1].name).toBe("Item 2");
        expect(invoiceGenerated.items[1].price).toBe(200);
    });
});