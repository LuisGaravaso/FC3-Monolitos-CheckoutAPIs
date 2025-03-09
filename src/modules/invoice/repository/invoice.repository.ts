import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/invoice-items.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne(
            { 
            where: { id },
            include: [{ model: InvoiceItemsModel, as: 'items'}] 
        });

        if (!invoice) {
            throw new Error("Invoice with id " + id + " not found");
        }

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address(
                invoice.addressStreet,
                invoice.addressNumber,
                invoice.addressComplement,
                invoice.addressCity,
                invoice.addressState,
                invoice.addressZipCode
            ),
            items: invoice.items.map(item => new InvoiceItems({
                id: new Id(item.itemId),
                name: item.name,
                price: item.price,
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        });
    }

    async generate(invoice: Invoice): Promise<Invoice> {
        const invoiceCreated = await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            addressStreet: invoice.address.street,
            addressNumber: invoice.address.number,
            addressComplement: invoice.address.complement,
            addressCity: invoice.address.city,
            addressState: invoice.address.state,
            addressZipCode: invoice.address.zipCode,
            total: invoice.total,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        });

        // Now create items
        for (const item of invoice.items) {
            await InvoiceItemsModel.create({
                invoiceItemId: (new Id()).id,
                invoiceId: invoice.id.id, 
                itemId: item.id.id,
                name: item.name,
                price: item.price
            });
        }

        return invoice;
    }
}