import { entity } from "../../common/entity.model";
import { nameValue } from "../../common/nameValue.model";

export interface staff extends entity {
    firstName: string;
    lastName: string;
    email: string;
    team: nameValue;
    roles: nameValue; 
}
