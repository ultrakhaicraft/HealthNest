export interface ViewVaccineEventDTO {
    id: string;
    title: string;
    dateOccurred: string;       // ISO date string from JSON, parse with `new Date(...)` when needed
    dateSignupStart?: string | null;
    dateSignupEnd?: string | null;
    status?: string | null;
}

export interface VaccineEventDetailDTO extends ViewVaccineEventDTO{

}


export const VaccineCheckupEventService = {

}