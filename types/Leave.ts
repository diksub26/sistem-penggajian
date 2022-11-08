interface Leave {
    id?: string
    employeeName? : string
    manager?: string,
    managerName? : string
    reason: string,
    status?: import('~/helper/enum/LeaveStatus').default,
    type: string | number,
    startDate: string
    endDate: string
    amount?: number
}