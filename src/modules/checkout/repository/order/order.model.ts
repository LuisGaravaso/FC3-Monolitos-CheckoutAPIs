import { Table, Column, Model, PrimaryKey, ForeignKey, HasMany, BelongsTo } from "sequelize-typescript";
import { ClientModel } from "../../../client-adm/repository/client.model";
import { ProductCatalogModel } from "../../../store-catalog/repository/product.model";


@Table({ tableName: "orders", timestamps: false })
export class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @ForeignKey(() => ClientModel)
    @Column({ allowNull: false })
    clientId: string;

    @BelongsTo(() => ClientModel)
    client: ClientModel;

    @HasMany(() => OrderProductModel)
    products: OrderProductModel[];

    @Column({ allowNull: true })
    status: string;
}

@Table({ tableName: "order_products", timestamps: false })
export class OrderProductModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    orderItemsId: string;

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    orderId: string;

    @BelongsTo(() => OrderModel)
    order: OrderModel;

    @ForeignKey(() => ProductCatalogModel)
    @Column({ allowNull: false })
    productId: string;

    @BelongsTo(() => ProductCatalogModel)
    product: ProductCatalogModel;
}