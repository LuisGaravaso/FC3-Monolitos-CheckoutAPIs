import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDTO, GenerateInvoiceFacadeOutputDTO } from "./invoice.facade.interface";

export interface UseCaseProps {
    findUseCase: UseCaseInterface;
    generateUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _findUseCase: UseCaseInterface;
    private _generateUseCase: UseCaseInterface;

    constructor(usecaseProps: UseCaseProps) {
        this._findUseCase = usecaseProps.findUseCase;
        this._generateUseCase = usecaseProps.generateUseCase;
    }

    async find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
        return await this._findUseCase.execute(input);
    }

    async generate(input: GenerateInvoiceFacadeInputDTO): Promise<GenerateInvoiceFacadeOutputDTO> {
        return await this._generateUseCase.execute(input);
    }
}