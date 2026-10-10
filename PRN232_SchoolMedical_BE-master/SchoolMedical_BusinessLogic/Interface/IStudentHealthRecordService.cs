using HealthNest_DAO.DTOModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Interface;

public interface IStudentHealthRecordService
{
	Task<PagingModel<StudentHealthRecordViewModel>> GetAllRecords(StudentHealthRecordQuery recordQuery);
	Task<StudentHealthRecordDetailModel> GetRecordByIdAsync(string recordId);
	Task<StudentHealthRecordDetailModel> GetRecordFromStudentIdAsync(string studentId);
	Task<string> CreateRecordAsync(StudentHealthRecordCreateModel record, string createdBy);
	Task UpdateRecordAsync(StudentHealthRecordUpdateModel record, string recordId);
	Task UpdateRecordStatusAsync(string recordId, string status);
	Task DeleteRecordAsync(string recordId);
}
