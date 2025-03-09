export interface FindStoreCatalogFacadeInputDTO {
    id: string;
}

export interface FindStoreCatalogFacadeOutputDTO {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
}  

export interface FindAllStoreCatalogFacadeOutputDTO {
    products: {
        id: string;
        name: string;
        description: string;
        salesPrice: number;
    }[];
}

export interface AddStoreCatalogFacadeOutputDTO {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
}  


export default interface StoreCatalogFacadeInterface {
    add(input: AddStoreCatalogFacadeOutputDTO): Promise<void>;
    find(id: FindStoreCatalogFacadeInputDTO): Promise<FindStoreCatalogFacadeOutputDTO>;
    findAll(): Promise<FindAllStoreCatalogFacadeOutputDTO>;
}