import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import { CheckoutFacadeInterface, PlaceOrderFacadeInputDTO, PlaceOrderFacadeOutputDTO } from "./checkout.facade.interface";

export interface UseCaseProps {
    placeOrderUseCase: UseCaseInterface;
}

export default class CheckoutFacade implements CheckoutFacadeInterface {
    private _placeOrderUseCase: UseCaseInterface;

    constructor(props: UseCaseProps) {
        this._placeOrderUseCase = props.placeOrderUseCase;
    }

    async placeOrder(input: PlaceOrderFacadeInputDTO): Promise<PlaceOrderFacadeOutputDTO> {
        return await this._placeOrderUseCase.execute(input);
    }
}