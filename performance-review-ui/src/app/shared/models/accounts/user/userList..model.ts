import { nameValue } from "../../common/nameValue.model";

export interface User {
    staffGuid: string;
    firstName: string;
    lastName: string;
    email: string;
    team: nameValue;
    roles: nameValue; 
}
