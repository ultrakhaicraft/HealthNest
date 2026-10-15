using HealthNest_DAO.DTOModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Interface;

public interface ITreatmentRecordService
{
	public Task AddTreatmentRecordsByStudentHealthRecordIdAsync(List<TreatmentRecordCreateModel> requests, string studentHealthRecordId);
	public Task<PagingModel<TreatmentRecordViewModel>> GetAllTreatmentRecordAsync(TreatmentRecordQuery request);
	public Task<TreatmentRecordViewModel> GetTreatmentRecordByIdAsync(string id);
	public Task RemoveTreatmentRecordAsync(string id);
	public Task UpdateTreatmentRecordAsync(TreatmentRecordUpdateModel request, string treatmentRecordId);


}
