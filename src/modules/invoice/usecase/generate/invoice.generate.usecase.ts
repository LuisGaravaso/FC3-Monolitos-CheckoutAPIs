import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import InvoiceItems from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./invoice.generate.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
  constructor(private invoiceGateway: InvoiceGateway) {}

  async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    const invoice = new Invoice({
        name: input.name,
        document: input.document,
        address: new Address(
            input.street,
            input.number,
            input.complement,
            input.city,
            input.state,
            input.zipCode
        ),
        items: input.items.map((item) => new InvoiceItems({
            id: new Id(item.id),
            name: item.name,
            price: item.price
        })),
    });

    const result = await this.invoiceGateway.generate(invoice);

    return {
        id: result.id.id,
        name: result.name,
        document: result.document,
        street: result.address.street,
        number: result.address.number,
        complement: result.address.complement,
        city: result.address.city,
        state: result.address.state,
        zipCode: result.address.zipCode,
        items: result.items.map((item) => ({
            id: item.id.id,
            name: item.name,
            price: item.price
        })),
        total: result.total,
        createdAt: result.createdAt
    }
  }
}