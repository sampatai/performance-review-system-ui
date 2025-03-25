export class Role{
    constructor(public id:number,public name:string){}
    static Admin = new Role(1, 'Admin');
    static Reviewer = new Role(2, 'Reviewer');
    static Appraisee = new Role(3, 'Appraisee');
  
    static allRoles = [
      Role.Admin,
      Role.Reviewer,
      Role.Appraisee
    ];
}