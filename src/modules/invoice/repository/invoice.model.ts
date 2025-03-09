import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceItemsModel from "./invoice-items.model";

@Table({
    tableName: 'invoices',
    timestamps: false
})
export default class InvoiceModel extends Model {
    
    @PrimaryKey
    @Column({ allowNull: false })
    id: string

    @Column({ allowNull: false })
    name: string

    @Column({ allowNull: false })
    document: string

    @Column({ allowNull: false, field: 'address_street' })
    addressStreet: string

    @Column({ allowNull: false, field: 'address_number' })
    addressNumber: string

    @Column({ allowNull: false, field: 'address_complement' })
    addressComplement: string

    @Column({ allowNull: false, field: 'address_city' })
    addressCity: string

    @Column({ allowNull: false, field: 'address_state' })
    addressState: string

    @Column({ allowNull: false, field: 'address_zip_code' })
    addressZipCode: string

    @HasMany(() => InvoiceItemsModel)
    items: InvoiceItemsModel[]

    @Column({ allowNull: false })
    total: number

    @Column({ allowNull: false })
    createdAt: Date

    @Column({ allowNull: false })
    updatedAt: Date
}
