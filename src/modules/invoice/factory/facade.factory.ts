import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find/invoice.find.usecase";
import GenerateInvoiceUseCase from "../usecase/generate/invoice.generate.usecase";

export default class InvoiceFacadeFactory {
    static create() {
        const invoiceRepository = new InvoiceRepository();
        const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);
        const facade = new InvoiceFacade({
            findUseCase: findInvoiceUseCase, 
            generateUseCase: generateInvoiceUseCase
        });

        return facade
    }
}