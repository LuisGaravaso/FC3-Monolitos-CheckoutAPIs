import { Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
    tableName: 'invoice_items',
    timestamps: false
})
export default class InvoiceItemsModel extends Model {
    
    @PrimaryKey
    @Column({ allowNull: false })
    invoiceItemId: string

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    invoiceId: string

    @Column({ allowNull: false })
    itemId: string

    @Column({ allowNull: false })
    name: string
    
    @Column({ allowNull: false })
    price: number
}
