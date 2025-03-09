import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
    id: Id;
    name: string;
    salesPrice: number;
    description: string;
}

export default class Product extends BaseEntity implements AggregateRoot {
    private _name: string;
    private _salesPrice: number;
    private _description: string;

    constructor(props: ProductProps) {
        super(props.id);
        this._name = props.name;
        this._salesPrice = props.salesPrice;
        this._description = props.description;
    }

    get name() {
        return this._name;
    }

    get salesPrice() {
        return this._salesPrice;
    }

    get description() {
        return this._description;
    }
}