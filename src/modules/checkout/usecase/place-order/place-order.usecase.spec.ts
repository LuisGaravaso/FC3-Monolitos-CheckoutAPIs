import e from "express";
import { PlaceOrderInputDTO } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";
import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { CreatedAt } from "sequelize-typescript";
import Address from "../../../@shared/domain/value-object/address";

const mockDate = new Date(2000, 1, 1);

describe('PlaceOrderUsecase Unit Test', () => {

    describe('getProducts method', () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        //@ts-expect-error - force import the class
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw an error when product not found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null)
            }

            //@ts-expect-error - force set the private property
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrowError("Product 0 not found");
        });

        it("should return the product when found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(
                    {
                        id: "0",
                        name: "Product 0",
                        description: "Description 0",
                        salesPrice: 1
                    }
                )
            }

            //@ts-expect-error - force set the private property
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            const result = await placeOrderUseCase["getProduct"]("0");
            expect(result).toEqual(new Product({
                id: new Id("0"),
                name: "Product 0",
                description: "Description 0",
                salesPrice: 1
            }));

            expect(mockCatalogFacade.find).toHaveBeenCalled();
        });
    });

    describe('validateProducts method', () => {
        //@ts-expect-error - force import the class
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw an error when no products are selected", async () => {
            const input: PlaceOrderInputDTO = {
                clientId: "0",
                products: []
            }

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrowError("No products selected");
        });

        it("should throw an error when products are out of stock", async () => {
            const mockProductFacade = {
                checkStock: jest.fn(({productId}: {productId: string}) => 
                    Promise.resolve({
                        productId, 
                        stock: productId === "1" ? 0 : 1
                    })
                )
            }

            //@ts-expect-error - force set the private property
            placeOrderUseCase["_productFacade"] = mockProductFacade;

            let input: PlaceOrderInputDTO = {
                clientId: "0",
                products: [{productId: "1"}]
            };

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrowError("Product 1 is out of stock");

            input = {
                clientId: "0",
                products: [{productId: "0"},{productId: "1"}]
            };

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrowError("Product 1 is out of stock");
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

            input = {
                clientId: "0",
                products: [{productId: "0"},{productId: "1"},{productId: "2"}]
            };

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrowError("Product 1 is out of stock");
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
        });
    });

    describe('execute method', () => {

        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it("should throw an error if the client doesn't exist", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null)
            };

            //@ts-expect-error - force import the class
            const placeOrderUseCase = new PlaceOrderUseCase();
            
            //@ts-expect-error - force set the private property
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDTO = {
                clientId: "0",
                products: []
            }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrowError("Client not found");
        });

        it("should throw an error when products are not valid", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true)
            };

            //@ts-expect-error - force import the class
            const placeOrderUseCase = new PlaceOrderUseCase();
            
            //@ts-expect-error - force set the private property
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const mockValidateProducts = jest
                //@ts-expect-error - spy on the private property
                .spyOn(placeOrderUseCase, "validateProducts")
                //@ts-expect-error - mock the implementation
                .mockRejectedValue(new Error("No products selected"));

            const input: PlaceOrderInputDTO = {
                    clientId: "1",
                    products: []
                }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrowError("No products selected");
            expect(mockValidateProducts).toHaveBeenCalledTimes(1);

        });
    });

    describe("place an order", () => {
        const clientProps = {
            id: "1C",
            name: "Client 0",
            document: "0000",
            email: "client@user.com",
            address: new Address(
                "some address",
                "1",
                "",
                "some city",
                "some state",
                "000")
        };

        const mockClientFacade = {
            find: jest.fn().mockResolvedValue(clientProps)
        };

        const mockPaymentFacade = {
            process: jest.fn()
        }

        const mockCheckoutRepo = {
            addOrder: jest.fn()
        }

        const mockInvoiceFacade = {
            generate: jest.fn().mockResolvedValue({id: "1I"})
        }

        const placeOrderUseCase = new PlaceOrderUseCase(
            mockClientFacade as any,
            null,
            null,
            mockCheckoutRepo as any,
            mockPaymentFacade as any,
            mockInvoiceFacade as any
        );

        const products = {
            "1": new Product({
                id: new Id("1"),
                name: "Product 1",
                description: "some description",
                salesPrice: 40,
            }),
            "2": new Product({
                id: new Id("2"),
                name: "Product 2",
                description: "some description",
                salesPrice: 30,
            }),
        };

        const mockValidateProducts = jest
            //@ts-expect-error - spy on the private property
            .spyOn(placeOrderUseCase, "validateProducts")
            //@ts-expect-error - mock the implementation
            .mockResolvedValue(null);

        const mockGetProduct = jest
            //@ts-expect-error - spy on the private property
            .spyOn(placeOrderUseCase, "getProduct")
            //@ts-expect-error - mock the implementation
            .mockImplementation((productId: keyof typeof products) => {
                return products[productId]
            });
        
        it("should not be approved", async () => {
            mockPaymentFacade.process = mockPaymentFacade.process.mockResolvedValue({
                transactionId: "1T",
                orderId: "1O",
                status: "error",
                amount: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const input: PlaceOrderInputDTO = {
                clientId: "1C",
                products: [{productId: "1"}, {productId: "2"}]
            }

            let output = await placeOrderUseCase.execute(input);

            expect(output.invoiceId).toBe(null);
            expect(output.total).toBe(70);
            expect(output.products).toEqual([{productId: "1"}, {productId: "2"}]);
            expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
            expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1C"});
            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
            expect(mockValidateProducts).toHaveBeenCalledWith(input);
            expect(mockGetProduct).toHaveBeenCalledTimes(2);
            expect(mockGetProduct).toHaveBeenCalledWith("1");
            expect(mockGetProduct).toHaveBeenCalledWith("2");
            expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
            expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                orderId: output.id,
                amount: output.total,
            });
            expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
            expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
        });

        it("should be approved", async () => {
            mockPaymentFacade.process = mockPaymentFacade.process.mockResolvedValue({
                transactionId: "1T",
                orderId: "1O",
                status: "approved",
                amount: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const input: PlaceOrderInputDTO = {
                clientId: "1C",
                products: [{productId: "1"}, {productId: "2"}]
            }

            let output = await placeOrderUseCase.execute(input);

            expect(output.invoiceId).toBe("1I");
            expect(output.total).toBe(70);
            expect(output.products).toEqual([{productId: "1"}, {productId: "2"}]);
            expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
            expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1C"});
            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
            expect(mockValidateProducts).toHaveBeenCalledWith(input);
            expect(mockGetProduct).toHaveBeenCalledTimes(2);
            expect(mockGetProduct).toHaveBeenCalledWith("1");
            expect(mockGetProduct).toHaveBeenCalledWith("2");
            expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
            expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                orderId: output.id,
                amount: output.total,
            });
            expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
            expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
            expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
                name: clientProps.name,
                document: clientProps.document,
                street: clientProps.address.street,
                number: clientProps.address.number,
                complement: clientProps.address.complement,
                city: clientProps.address.city,
                state: clientProps.address.state,
                zipCode: clientProps.address.zipCode,
                items: [
                    {
                        id: "1",
                        name: "Product 1",
                        price: 40
                    },
                    {
                        id: "2",
                        name: "Product 2",
                        price: 30
                    }
                ]
            });

        });
    });
});