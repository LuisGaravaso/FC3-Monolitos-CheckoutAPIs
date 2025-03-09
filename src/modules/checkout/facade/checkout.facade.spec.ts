import { Sequelize } from "sequelize-typescript";
import { OrderModel, OrderProductModel } from "../repository/order/order.model";
import { ClientModel } from "../../client-adm/repository/client.model";
import { ProductCatalogModel } from "../../store-catalog/repository/product.model";
import { ProductModel } from "../../product-adm/repository/product.model";
import CheckoutFacadeFactory from "../factory/checkout.facade.factory";
import TransactionModel from "../../payment/repository/transaction.model";
import InvoiceItems from "../../invoice/domain/invoice-items.entity";
import InvoiceModel from "../../invoice/repository/invoice.model";
import InvoiceItemsModel from "../../invoice/repository/invoice-items.model";

describe("Checkout Facade test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([
      OrderModel, 
      OrderProductModel, 
      ClientModel, 
      ProductModel, 
      ProductCatalogModel, 
      TransactionModel,
      InvoiceModel,
      InvoiceItemsModel
    ])
    await sequelize.sync()

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
  })

  afterEach(async () => {
    await sequelize.close()
  })

  describe("Tests that serve as base for my OrderRepository", () => {
    it("should find a client", async () => {
      const client = await ClientModel.findOne({ where: { id: "1" } })
      expect(client?.id).toBe("1")
    });
  
    it("should find products in Catalog", async () => {
      const product1 = await ProductCatalogModel.findOne({ where: { id: "1" } })
      const product2 = await ProductCatalogModel.findOne({ where: { id: "2" } })
      expect(product1?.id).toBe("1")
      expect(product2?.id).toBe("2")
      expect(product1?.salesPrice).toBe(200)
      expect(product2?.salesPrice).toBe(200)
      
    });

    it("should find products in Stock", async () => {
      const product1 = await ProductModel.findOne({ where: { id: "1" } })
      const product2 = await ProductModel.findOne({ where: { id: "2" } })
      expect(product1?.id).toBe("1")
      expect(product2?.id).toBe("2")
      expect(product1?.stock).toBe(10)
      expect(product2?.stock).toBe(10)
    });
  });

  describe("Tests for the Checkout Facade methods", () => {

    it("should add an order", async () => {

      const facade = CheckoutFacadeFactory.create();
      const order = await facade.placeOrder({
        clientId: "1",
        products: [
          {
            productId: "1",
          },
          {
            productId: "2",
          }
        ]
      });

      expect(order.id).toBeDefined();
      expect(order.invoiceId).toBeDefined();
      expect(order.total).toBe(400);
      expect(order.status).toBe("approved");
      expect(order.products).toHaveLength(2);

    });

    it("should not add an order without products", async () => {
      const facade = CheckoutFacadeFactory.create();

      await expect(facade.placeOrder({
        clientId: "1",
        products: []
      })).rejects.toThrow("No products selected");

    });

    it("should not add an order with out of stock products", async () => {
      const facade = CheckoutFacadeFactory.create();

      await expect(facade.placeOrder({
        clientId: "1",
        products: [
          {
            productId: "1",
          },
          {
            productId: "3",
          }
        ]
      })).rejects.toThrow("Product 3 is out of stock");

    });

    it("should not add an order with invalid Client", async () => {
      const facade = CheckoutFacadeFactory.create();

      await expect(facade.placeOrder({
        clientId: "2",
        products: [
          {
            productId: "1",
          },
          {
            productId: "2",
          }
        ]
      })).rejects.toThrow("Client not found");
    });
  });

});