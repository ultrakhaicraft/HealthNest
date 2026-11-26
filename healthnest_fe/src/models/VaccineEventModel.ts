export interface ViewVaccineEventDTO {
    id: string;
    title: string;
    dateOccurred: string;       // ISO date string from JSON, parse with `new Date(...)` when needed
    dateSignupStart?: string | null;
    dateSignupEnd?: string | null;
    status: string;
}

export interface VaccineEventDetailDTO extends ViewVaccineEventDTO {
    createdBy: string;
    shortDescription: string;
    content: string;
}

export interface VaccineEventCreateDTO {
    title: string;
    shortDescription: string;
    content: string;
    dateOccurred: string;       // ISO date string from JSON, parse with `new Date(...)` when needed
    dateSignupStart?: string | null;
    dateSignupEnd?: string | null;
}

export interface VaccineEventUpdateDTO extends VaccineEventCreateDTO {
    
    status?: string | null;

}

export interface VaccineEventQueryParams {
    pageIndex: number;
    pageSize: number;
    sortByLatestDateOccured?: boolean;
    Status?: string | null;
}