import { User } from "./UserDTO";

export interface Pagination{
    currentPage:number;
    itemPerPage:number;
    totalItems:number;
    totalPages:number;
}
export class PaginatedResult<T>{
    result: any;
    pagination:Pagination={
        currentPage: 0,
        itemPerPage: 0,
        totalItems: 0,
        totalPages: 0,

    }

}