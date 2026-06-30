using SchoolMedical_DataAccess.DTOModels;

namespace SchoolMedical_BusinessLogic.Interface;

public interface IIncidentRecordService
{
    Task<IEnumerable<IncidentRecordViewModel>> GetAllIncidentRecordsAsync();
    Task<IncidentRecordDetailModel> GetIncidentRecordDetailByIdAsync(string incidentId);
    Task<IncidentRecordDetailModel> CreateIncidentRecordAsync(IncidentRecordCreateRequest request, string currentUserId);
    Task<IncidentRecordDetailModel> UpdateIncidentRecordAsync(IncidentRecordUpdateRequest request, string incidentId);
    Task<bool> SoftDeleteIncidentRecordAsync(string incidentId);
    Task<bool> ChangeStatusRecord(string id, string status);
} 