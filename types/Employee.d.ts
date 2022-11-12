declare namespace Employee {
    interface JobPosition {
        positionId: string,
        positionName: string,
        positionSalary: string
    }

    interface Basic {
        id: string
        noInduk : string
        fullname : string
        gender: "L" | "P"
        placeOfBirth: string
        dob: string
        address: string
        religion: string
        noHp : string
        assignmentDate: string
        division: string
        basicSalary: number
    }

    interface Data extends Basic{
        email: string
        role: import('~/helper/enum/EmployeRole').default;
        employeePositionId?: string
        employeePosition: string
    }

    interface FullInfo {
        employee: Basic 
        user: {
            email: string,
            role: import('~/helper/enum/EmployeRole').default;
        }
        employeePosition : JobPosition
    }
}