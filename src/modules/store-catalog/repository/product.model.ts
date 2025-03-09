
import { Model, Table, Column, PrimaryKey, ForeignKey } from 'sequelize-typescript';

@Table({
    tableName: 'products_catalog', 
    timestamps: false
})
export class ProductCatalogModel extends Model{
    
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    description: string;

    @Column({ allowNull: false })
    salesPrice: number;

}