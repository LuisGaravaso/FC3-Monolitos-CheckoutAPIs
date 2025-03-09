import Id from "../../../@shared/domain/value-object/id.value-object";
import FindInvoiceUseCase from "./invoice.find.usecase";

const MockRepository = () => {
    return {
        find: jest.fn(),
        generate: jest.fn(),
    }
}

describe("Invoice Find Usecase Unit Test", () => {
    it("should find an invoice", async () => {
        const repository = MockRepository();
        const findInvoiceUseCase = new FindInvoiceUseCase(repository);
        const input = {
            id: "1"
        }
        const output = {
            id: new Id("1"),
            name: "Invoice 1",
            document: "123456789",
            address: {
                street: "Rua 1",
                number: "123",
                complement: "Casa",
                city: "São Paulo",
                state: "SP",
                zipCode: "12345678"
            },
            items: [
                {
                    id: new Id("1"),
                    name: "Item 1",
                    price: 100
                },
                {
                    id: new Id("2"),
                    name: "Item 2",
                    price: 200
                }
            ],
            total: 300,
            createdAt: new Date()
        }
        repository.find.mockResolvedValue(output);
        const invoice = await findInvoiceUseCase.execute(input);
        
        expect(invoice.id).toBe(output.id.id);
        expect(invoice.name).toBe(output.name);
        expect(invoice.document).toBe(output.document);
        expect(invoice.address).toEqual(output.address);
        expect(invoice.items[0].id).toBe(output.items[0].id.id);
        expect(invoice.items[0].name).toBe(output.items[0].name);
        expect(invoice.items[0].price).toBe(output.items[0].price);
        expect(invoice.items[1].id).toBe(output.items[1].id.id);
        expect(invoice.items[1].name).toBe(output.items[1].name);
        expect(invoice.items[1].price).toBe(output.items[1].price);
        expect(invoice.total).toBe(output.total);
        expect(invoice.createdAt).toEqual(output.createdAt);
    });

    it("should throw an error when invoice not found", async () => {
        const repository = MockRepository();
        const findInvoiceUseCase = new FindInvoiceUseCase(repository);
        const input = {
            id: "1"
        }
        repository.find.mockResolvedValue(null);
        await expect(findInvoiceUseCase.execute(input)).rejects.toThrow("Invoice not found");
    });
});