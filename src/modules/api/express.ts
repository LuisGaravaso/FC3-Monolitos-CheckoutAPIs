import express from 'express';
import { Express } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../client-adm/repository/client.model';
import InvoiceModel from '../invoice/repository/invoice.model';
import { ProductModel } from '../product-adm/repository/product.model';
import { ProductCatalogModel } from '../store-catalog/repository/product.model';
import { customerRouter } from './routes/customer.route';
import { productRouter } from './routes/products.route';
import { invoiceRouter } from './routes/invoice.route';
import InvoiceItemsModel from '../invoice/repository/invoice-items.model';
import { checkoutRouter } from './routes/checkout.route';
import { OrderModel, OrderProductModel } from '../checkout/repository/order/order.model';
import TransactionModel from '../payment/repository/transaction.model';

export const app: Express = express();
app.use(express.json());
app.use('/customer', customerRouter);
app.use('/product', productRouter);
app.use('/invoice', invoiceRouter);
app.use('/checkout', checkoutRouter);

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        storage: ':memory:',
        dialect: 'sqlite',
        logging: false
    });

    await sequelize.addModels([
        ClientModel,
        ProductModel,
        ProductCatalogModel,
        InvoiceModel,
        InvoiceItemsModel,
        OrderModel, 
        OrderProductModel, 
        TransactionModel,
    ]);
    await sequelize.sync({ force: true });

    // Add initial data
    const newClient = {
      id: "1",
      name: "Client 1",
      email: "x.x",
      document: "123",
      street: "Street 1",
      number: "123",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipcode: "123",
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await ClientModel.create(newClient)

    //Product1 
    const newProduct1 = {
      id: "1",
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10,
      salesPrice: 200,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await ProductCatalogModel.create(newProduct1)
    await ProductModel.create(newProduct1)

    //Product2
    const newProduct2 = {
      id: "2",
      name: "Product 2",
      description: "Description 2",
      purchasePrice: 100,
      stock: 10,
      salesPrice: 200,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await ProductCatalogModel.create(newProduct2)
    await ProductModel.create(newProduct2)

    const noStockProduct = {
      id: "3",
      name: "Product 3",
      description: "Description 3",
      purchasePrice: 100,
      stock: 0,
      salesPrice: 200,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await ProductCatalogModel.create(noStockProduct)
    await ProductModel.create(noStockProduct)
}

setupDb();
