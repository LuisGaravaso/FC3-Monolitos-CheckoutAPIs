import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import { ProductCatalogModel } from "./product.model";

export default class ProductRepository implements ProductGateway {

    async add(product: Product): Promise<void> {
        await ProductCatalogModel.create({
            id: product.id.id,
            name: product.name,
            salesPrice: product.salesPrice,
            description: product.description,
        });
    }

    async find(id: string): Promise<Product> {
        const product = await ProductCatalogModel.findOne({ where: { id } });

        if (!product) {
            throw new Error("Product with id " + id + " not found");
        }

        const productProps = {
            id: new Id(product.id),
            name: product.name,
            salesPrice: product.salesPrice,
            description: product.description,
        }

        return new Product(productProps);
    }

    async findAll(): Promise<Product[]> {
        const products = await ProductCatalogModel.findAll();

        return products.map(product => new Product({
            id: new Id(product.id),
            name: product.name,
            salesPrice: product.salesPrice,
            description: product.description,
        }));
    }

}