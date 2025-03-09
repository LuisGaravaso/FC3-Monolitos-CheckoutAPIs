import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import { FindAllProductsOutputDto } from "../usecase/find-all-products/find-all-products.dto";
import StoreCatalogFacadeInterface, { AddStoreCatalogFacadeOutputDTO, FindStoreCatalogFacadeInputDTO, FindStoreCatalogFacadeOutputDTO } from "./store-catalog.facade.interface";

export interface UseCaseProps {
    findUseCase: UseCaseInterface;
    findAllUseCase: UseCaseInterface;
    addUseCase: UseCaseInterface;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
    private _findUseCase: UseCaseInterface;
    private _findAllUseCase: UseCaseInterface;
    private _addUseCase: UseCaseInterface;

    constructor(props: UseCaseProps) {
        this._findUseCase = props.findUseCase;
        this._findAllUseCase = props.findAllUseCase;
        this._addUseCase = props.addUseCase;
    }

    async add(input: AddStoreCatalogFacadeOutputDTO): Promise<void> {
        return await this._addUseCase.execute(input);
    }

    async find(id: FindStoreCatalogFacadeInputDTO): Promise<FindStoreCatalogFacadeOutputDTO> {
        return await this._findUseCase.execute(id);
    }

    async findAll(): Promise<FindAllProductsOutputDto> {
        return await this._findAllUseCase.execute({});
    }
}