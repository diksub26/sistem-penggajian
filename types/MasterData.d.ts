declare namespace MasterData {
    interface EmployeePosition{
        id : string
        name : string
        salary : number
    }
    interface Allowance{
        id : string
        name : string
        amount : number
    }

    interface SalaryCut {
        id : string
        name : string
        amount : number
        type: string   
    }
}