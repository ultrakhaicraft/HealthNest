using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Interface;

public interface IStudentHealthRecordService
{
	Task<PagingModel<StudentHealthRecordViewModel>> GetAllRecords(StudentHealthRecordQuery recordQuery);
	Task<StudentHealthRecordDetailModel> GetRecordByIdAsync(string recordId);
	Task<StudentHealthRecordDetailModel> GetRecordFromStudentIdAsync(string studentId);
	Task<string> CreateRecordAsync(StudentHealthRecordCreateModel record, string createdBy);
	Task UpdateRecordAsync(StudentHealthRecordUpdateModel record, string recordId);
	Task DeleteRecordAsync(string recordId);
}
