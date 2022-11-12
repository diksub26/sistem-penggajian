interface SalaryWithAttendance {
    id: string
    period: string
    employeeName: string
    noInduk: string
    division: string
    employeePosition: string
    assignmentDate: string
    bankAccNo : string
    dayOfWork: number
    sick: number
    permitte: number
    leave: number
    late: number
    basicSalary: number
    allowances : { name: string, amount: number}[]
    salaryCuts : { name: string, amount: number}[]
    totalSalaryCut: number
    total: number
    salary: number
    status: import('~/helper/enum/SalaryStatus').default
}