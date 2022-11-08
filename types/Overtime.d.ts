interface Overtime {
    id?: string,
    date: string,
    startTime?: string,
    endTime?: string,
    time?: string,
    manager?: string,
    employeeName?: string,
    managerName?: string,
    project: string,
    description: string,
    status?: import('~/helper/enum/OvertimeStatus').default
}