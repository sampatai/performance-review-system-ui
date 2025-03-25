export class Team{
    constructor(public id:number,public name:string){}
    
    static Executive = new Team(1, 'Executive');
    static HumanResources = new Team(2, 'Human Resources');
    static Development = new Team(3, 'Development');
    static IT = new Team(4, 'IT');
    static Finance = new Team(5, 'Finance');
    static AdministrativeSupport = new Team(6, 'Administrative Support');
    static Other = new Team(7, 'Other');
     
    static allTeams = [
        Team.Executive,
        Team.HumanResources,
        Team.Development,
        Team.IT,
        Team.Finance,
        Team.AdministrativeSupport,
        Team.Other
      ];
}
