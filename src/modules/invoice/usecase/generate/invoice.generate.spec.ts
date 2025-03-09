import Id from "../../../@shared/domain/value-object/id.value-object";
import GenerateInvoiceUseCase from "./invoice.generate.usecase";

const MockRepository = () => {
    return {
        find: jest.fn(),
        generate: jest.fn(),
    }
}

describe("Invoice Generate Usecase Unit Test", () => {

    it("should generate an invoice", async () => {
        const repository = MockRepository();
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository);
        const input = {
            name: "Invoice 1",
            document: "123456789",
            street: "Rua 1",
            number: "123",
            complement: "Casa",
            city: "São Paulo",
            state: "SP",
            zipCode: "12345678",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 100
                },
                {
                    id: "2",
                    name: "Item 2",
                    price: 200
                }
            ]
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
        repository.generate.mockResolvedValue(output);
        const invoice = await generateInvoiceUseCase.execute(input);
        
        expect(invoice.id).toBe(output.id.id);
        expect(invoice.name).toBe(output.name);
        expect(invoice.document).toBe(output.document);
        expect(invoice.street).toBe(output.address.street);
        expect(invoice.number).toBe(output.address.number);
        expect(invoice.complement).toBe(output.address.complement);
        expect(invoice.city).toBe(output.address.city);
        expect(invoice.state).toBe(output.address.state);
        expect(invoice.zipCode).toBe(output.address.zipCode);
        expect(invoice.items[0].id).toBe(output.items[0].id.id);
        expect(invoice.items[0].name).toBe(output.items[0].name);
        expect(invoice.items[0].price).toBe(output.items[0].price);
        expect(invoice.items[1].id).toBe(output.items[1].id.id);
        expect(invoice.items[1].name).toBe(output.items[1].name);
        expect(invoice.items[1].price).toBe(output.items[1].price);
        expect(invoice.total).toBe(output.total);
        expect(invoice.createdAt).toEqual(output.createdAt);
    });
});