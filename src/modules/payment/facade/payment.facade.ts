import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import PaymentFacadeInterface, { PaymentFacadeInputDTO, PaymentFacadeOutputDTO } from "./payment.facade.interface";

export interface UseCaseProps {
    processUseCase: UseCaseInterface;
}

export default class PaymentFacade implements PaymentFacadeInterface {
    
    private _processUseCase: UseCaseInterface;

    constructor(usecaseProps: UseCaseProps) {
        this._processUseCase = usecaseProps.processUseCase;
    }

    async process(input: PaymentFacadeInputDTO): Promise<PaymentFacadeOutputDTO> {
        return await this._processUseCase.execute(input);
    }
}