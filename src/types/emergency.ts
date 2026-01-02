export enum TriageLevel {
    CRITICAL = 'CRITICAL',
    MODERATE = 'MODERATE',
    NORMAL = 'NORMAL'
}

export enum EmergencyStatus {
    TRIAGE = 'TRIAGE',
    TREATMENT = 'TREATMENT',
    ADMITTED = 'ADMITTED',
    DISCHARGED = 'DISCHARGED'
}

export interface EmergencyCase {
    id: string;
    patientId?: string;
    patientName?: string;
    careProviderId?: string;
    triageLevel: TriageLevel;
    status: EmergencyStatus;
    symptoms: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
