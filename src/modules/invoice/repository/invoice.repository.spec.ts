import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItems from "../domain/invoice-items.entity";

describe("Invoice Repository unit tests", () => {
    
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

        // Use the repository to fetch the invoice
        const invoiceRepository = new InvoiceRepository();
        const invoices = await invoiceRepository.find("1");

        expect(invoices).not.toBeNull();
        expect(invoices.id.id).toBe("1");
        expect(invoices.name).toBe("Invoice 1");
        expect(invoices.document).toBe("123456789");
        expect(invoices.address.street).toBe("Rua 1");
        expect(invoices.address.number).toBe("123");
        expect(invoices.address.complement).toBe("Casa");
        expect(invoices.address.city).toBe("São Paulo");
        expect(invoices.address.state).toBe("SP");
        expect(invoices.address.zipCode).toBe("12345678");
        expect(invoices.total).toBe(300);
        expect(invoices.items).toHaveLength(2);
        expect(invoices.items[0].id.id).toBe("1");
        expect(invoices.items[0].name).toBe("Item 1");
        expect(invoices.items[0].price).toBe(100);
        expect(invoices.items[1].id.id).toBe("2");
        expect(invoices.items[1].name).toBe("Item 2");
        expect(invoices.items[1].price).toBe(200);
    });

    it("should throw an error when invoice is not found", async () => {
        const invoiceRepository = new InvoiceRepository();
        await expect(invoiceRepository.find("1")).rejects.toThrow("Invoice with id 1 not found");
    });

    it("should generate an invoice", async () => {

        const invoiceRepository = new InvoiceRepository();

        const item1 = new InvoiceItems({
            id: new Id("1"),
            name: "Item 1",
            price: 100
        })

        const item2 = new InvoiceItems({
            id: new Id("2"),
            name: "Item 2",
            price: 200
        })

        const invoice = new Invoice({
            id: new Id("1"),
            name: "Invoice 1",
            document: "123456789",
            address: new Address(
                "Rua 1",
                "123",
                "Casa",
                "São Paulo",
                "SP",
                "12345678"
            ),
            items: [item1, item2],
            createdAt: new Date()
        });

        await invoiceRepository.generate(invoice);

        const invoiceGenerated = await InvoiceModel.findOne({ 
              where: { id: "1" }, 
              include: [{ model: InvoiceItemsModel, as: 'items'}] 
            });

        expect(invoiceGenerated).not.toBeNull();
        expect(invoiceGenerated.id).toBe("1");
        expect(invoiceGenerated.name).toBe("Invoice 1");
        expect(invoiceGenerated.document).toBe("123456789");
        expect(invoiceGenerated.addressStreet).toBe("Rua 1");
        expect(invoiceGenerated.addressNumber).toBe("123");
        expect(invoiceGenerated.addressComplement).toBe("Casa");
        expect(invoiceGenerated.addressCity).toBe("São Paulo");
        expect(invoiceGenerated.addressState).toBe("SP");
        expect(invoiceGenerated.addressZipCode).toBe("12345678");
        expect(invoiceGenerated.total).toBe(300);
        expect(invoiceGenerated.items).toHaveLength(2);
        expect(invoiceGenerated.items[0].itemId).toBe("1");
        expect(invoiceGenerated.items[0].name).toBe("Item 1");
        expect(invoiceGenerated.items[0].price).toBe(100);
        expect(invoiceGenerated.items[1].itemId).toBe("2");
        expect(invoiceGenerated.items[1].name).toBe("Item 2");
        expect(invoiceGenerated.items[1].price).toBe(200);
        expect(invoiceGenerated.createdAt).not.toBeNull();
        expect(invoiceGenerated.updatedAt).not.toBeNull();
    })
});
