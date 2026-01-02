export enum OperationStatus {
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface OperationSchedule {
    id: string;
    patientId: string;
    patient: {
        name: string;
        id: string;
    };
    doctorId: string;
    doctor: {
        user: {
            name: string;
        }
    };
    theaterName: string;
    procedureName: string;
    startTime: string; // ISO date string
    endTime: string;   // ISO date string
    status: OperationStatus;
    notes?: string;
}
