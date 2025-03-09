import ProductAdmFacade from "../facade/product-adm.facade";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add/add.usecase";
import CheckStockUseCase from "../usecase/checkstock/check-stock.usecase";

export default class ProductAdmFacadeFactory {
    static create() {
        
        const productRepository = new ProductRepository();
        const addProductUseCase = new AddProductUseCase(productRepository);
        const checkStockUseCase = new CheckStockUseCase(productRepository);

        const productAdmFacade = new ProductAdmFacade({ 
            addUseCase: addProductUseCase, 
            checkStockUseCase: checkStockUseCase 
        });

        return productAdmFacade;
    }
}