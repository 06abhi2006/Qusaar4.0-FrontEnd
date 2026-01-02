export enum BedStatus {
    AVAILABLE = 'AVAILABLE',
    OCCUPIED = 'OCCUPIED',
    MAINTENANCE = 'MAINTENANCE',
    CLEANING = 'CLEANING'
}

export interface Bed {
    id: string;
    wardId: string;
    bedNumber: string;
    status: BedStatus;
    admission?: {
        id: string;
        patientId: string;
        patient: {
            name: string;
            id: string;
        };
        doctor: {
            user: {
                name: string;
            };
        };
        admissionDate: string;
        diagnosis?: string;
        notes?: string;
    }
}

export interface Ward {
    id: string;
    name: string;
    type: string;
    floor: number;
    gender: string;
    capacity: number;
    beds: Bed[];
}
