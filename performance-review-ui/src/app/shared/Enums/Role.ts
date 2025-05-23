export class Role{
    constructor(public id:number,public name:string){}
    static Admin = new Role(1, 'Admin');
    static Manager = new Role(2, 'Manager');
    static Employee = new Role(3, 'Employee');
    static HR = new Role(4, 'HR');
  
    static allRoles = [
      Role.Admin,
      Role.Manager,
      Role.Employee,
      Role.HR
    ];
}