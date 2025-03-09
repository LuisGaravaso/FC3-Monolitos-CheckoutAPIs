import { Sequelize } from "sequelize-typescript";
import { OrderModel, OrderProductModel } from "./order.model";
import { ClientModel } from "../../../client-adm/repository/client.model";
import OrderRepository from "./order.repository";
import Order from "../../domain/order.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import Product from "../../domain/product.entity";
import { ProductCatalogModel } from "../../../store-catalog/repository/product.model";


describe("Order Repository test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([OrderModel, OrderProductModel, ClientModel, ProductCatalogModel])
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

    const newProduct1 = {
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 200,
    }
    await ProductCatalogModel.create(newProduct1)

    const newProduct2 = {
      id: "2",
      name: "Product 2",
      description: "Description 2",
      salesPrice: 200,
    }
    await ProductCatalogModel.create(newProduct2)
  })

  afterEach(async () => {
    await sequelize.close()
  })

  describe("Tests that serve as base for my OrderRepository", () => {
    it("should find a client", async () => {
      const client = await ClientModel.findOne({ where: { id: "1" } })
      expect(client?.id).toBe("1")
    });
  
    it("should find products", async () => {
      const product1 = await ProductCatalogModel.findOne({ where: { id: "1" } })
      const product2 = await ProductCatalogModel.findOne({ where: { id: "2" } })
      expect(product1?.id).toBe("1")
      expect(product2?.id).toBe("2")
    });
  });

  describe("Tests for the addOrder method", () => {
    it("should add an order", async () => {
      const orderRepository = new OrderRepository()

      const productProps1 = {
        id: new Id("1"),
        name: "Product 1",
        salesPrice: 200,
        description: "Description 1",
      }
      const productProps2 = {
        id: new Id("2"),
        name: "Product 2",
        salesPrice: 300,
        description: "Description 2",
      }
      const product1 = new Product(productProps1)
      const product2 = new Product(productProps2)

      const clientProp = {
        id: new Id("1"),
        name: "Client 1",
        email: "x.x",
        document: "123",
        address: "Street 1",
      }
      const orderProps = {
        id: new Id("1"),
        client: new Client(clientProp),
        products: [product1, product2],
        status: "pending"
      }
      const order = new Order(orderProps)

      await orderRepository.addOrder(order)

      const orderDb = await OrderModel.findOne({
        where: { id: order.id.id },
        include: [OrderProductModel]
      })

      expect(orderDb?.id).toBe(order.id.id)
      expect(orderDb?.status).toBe(order.status)
      expect(orderDb?.clientId).toBe(order.client.id.id)
      expect(orderDb?.products.length).toBe(2)
      expect(orderDb?.products[0].productId).toBe(order.products[0].id.id)
      expect(orderDb?.products[1].productId).toBe(order.products[1].id.id)
      expect(orderDb?.products[0].orderId).toBe(order.id.id)
      expect(orderDb?.products[1].orderId).toBe(order.id.id)
      expect(orderDb?.products[0].orderItemsId).not.toBeNull()
      expect(orderDb?.products[1].orderItemsId).not.toBeNull()
    });

    it("should find an order", async () => {

      const orderRepository = new OrderRepository()

      const productProps1 = {
        id: new Id("1"),
        name: "Product 1",
        salesPrice: 200,
        description: "Description 1",
      }
      const productProps2 = {
        id: new Id("2"),
        name: "Product 2",
        salesPrice: 300,
        description: "Description 2",
      }
      const product1 = new Product(productProps1)
      const product2 = new Product(productProps2)

      const clientProp = {
        id: new Id("1"),
        name: "Client 1",
        email: "x.x",
        document: "123",
        address: "Street 1",
      }
      const orderProps = {
        id: new Id("1"),
        client: new Client(clientProp),
        products: [product1, product2],
        status: "pending"
      }
      const order = new Order(orderProps)

      await orderRepository.addOrder(order)

      const orderDb = await orderRepository.findOrder(order.id.id)

      expect(orderDb?.id.id).toBe(order.id.id)
      expect(orderDb?.status).toBe(order.status)
      expect(orderDb?.client.id.id).toBe(order.client.id.id)
      expect(orderDb?.products.length).toBe(2)
      expect(orderDb?.products[0].id.id).toBe(order.products[0].id.id)
      expect(orderDb?.products[1].id.id).toBe(order.products[1].id.id)
    });
  });
});