import apiClient, { ApiResponseWrapper } from "../ApiClient";


export interface DashboardStatistic {
    activeIncidentRecord: number;
    pendingMedicineRequest: number;
    upcomingVaccineEvent:number;
    upcomingHealthCheckup:number;
}

export interface IncidentRecordCountPerYear{
    year: number;
    january: number;
    february: number;
    march: number;
    april: number;
    may: number;
    june: number;
    july: number;
    august: number;
    september: number;
    october: number;
    november: number;
    december: number;
}

export const DashboardService = {
  getStatistic: async (): Promise<DashboardStatistic> => {
    const response = await apiClient.get<ApiResponseWrapper<DashboardStatistic>>('/dashboard/statistics');
    return response.data.data;
  },

  countAllIncidentInAYear: async (year: number): Promise<IncidentRecordCountPerYear> => {
    const response = await apiClient.get<ApiResponseWrapper<IncidentRecordCountPerYear>>(`/dashboard/count-all-incident-per-year`,
      { params: { year } }
    );
    return response.data.data;
  },

 
};