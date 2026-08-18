using SchoolMedical_DataAccess.DTOModels;

namespace SchoolMedical_BusinessLogic.Interface;

public interface IIncidentRecordService
{
    Task<PagingModel<IncidentRecordViewModel>> GetAllIncidentRecordsAsync(IncidentRecordQuery request);
	Task<IncidentRecordDetailModel> GetIncidentRecordDetailByIdAsync(string incidentId);
    Task<IncidentRecordDetailModel> CreateIncidentRecordAsync(IncidentRecordCreateRequest request, string currentUserId);
    Task<IncidentRecordDetailModel> UpdateIncidentRecordAsync(IncidentRecordUpdateRequest request, string incidentId);
    Task SoftDeleteIncidentRecordAsync(string incidentId);
    Task ChangeStatusRecord(string id, string status);
    Task<int> CountActiveIncidentRecord();
    Task<IncidentRecordCountPerYear> CountAllIncidentRecordPerYear(int year);
} 