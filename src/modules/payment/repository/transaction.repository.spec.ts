import { Sequelize } from "sequelize-typescript";
import TransactionModel from "./transaction.model";
import TransactionRepository from "./transaction.repository";
import Id from "../../@shared/domain/value-object/id.value-object";
import Transaction from "../domain/transaction";

describe("Payment Repository unit tests", () => {
    
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([TransactionModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should save a transaction", async () => {
        
        const transaction = new Transaction({
            id: new Id("1"),
            orderId: "1",
            amount: 100,
            status: "approved",
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const transactionRepository = new TransactionRepository();
        await transactionRepository.save(transaction);

        const transactionDb = await TransactionModel.findOne({ where: { id: transaction.id.id } });

        expect(transactionDb).toBeDefined();
        expect(transactionDb.id).toBe(transaction.id.id);
        expect(transactionDb.orderId).toBe(transaction.orderId);
        expect(transactionDb.amount).toBe(transaction.amount);
        expect(transactionDb.status).toBe(transaction.status);
        expect(transactionDb.createdAt).toEqual(transaction.createdAt);
        expect(transactionDb.updatedAt).toEqual(transaction.updatedAt);
    });
});