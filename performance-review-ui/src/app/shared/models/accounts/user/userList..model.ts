import { nameValue } from "../../common/nameValue.model";

export interface staff {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    team: nameValue;
    roles: nameValue; 
}
