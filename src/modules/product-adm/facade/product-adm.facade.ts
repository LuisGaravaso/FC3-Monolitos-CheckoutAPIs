import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add/add.usecase";
import ProductAdmFacadeInterface, { AddProductFacadeInputDTO, AddProductFacadeOutputDTO, CheckStockFacadeInputDTO, CheckStockFacadeOutputDTO } from "./product-adm.facade.interface";

export interface UseCaseProps {
    addUseCase: UseCaseInterface;
    checkStockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
    private _addUseCase: UseCaseInterface;
    private _checkStockUseCase: UseCaseInterface;

    constructor(usecaseProps: UseCaseProps) {
        this._addUseCase = usecaseProps.addUseCase;
        this._checkStockUseCase = usecaseProps.checkStockUseCase;
    }

    async addProduct(input: AddProductFacadeInputDTO): Promise<AddProductFacadeOutputDTO> {
        return await this._addUseCase.execute(input);
    }

    async checkStock(input: CheckStockFacadeInputDTO): Promise<CheckStockFacadeOutputDTO> {
        return await this._checkStockUseCase.execute(input);
    }
}