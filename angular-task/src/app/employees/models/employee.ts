export type Employee = {
    Id : string;
    EmployeeName : string;
    StarTimeUtc : string;
    EndTimeUtc : string;
    EntryNotes : string;
}

export type EmployeeView = {
    EmployeeName : string;
    HourDuration : number;
}
