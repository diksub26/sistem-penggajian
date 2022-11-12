interface Attendance {
    id: string
    noInduk? : string
    employeeName? : string
    basicSalary? : number
    attend: number
    leave: number
    permitte: number
    sick: number
    late: number
    salaryStatus?: import('~/helper/enum/SalaryStatus').default
}