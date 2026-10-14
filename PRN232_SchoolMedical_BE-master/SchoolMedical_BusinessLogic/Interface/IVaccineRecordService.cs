using HealthNest_DAO.DTOModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Interface;

public interface IVaccineRecordService
{
	public Task AddVaccineRecordsByStudentHealthRecordIdAsync(List<VaccineRecordCreateModel> requests, string studentHealthRecordId);
	public Task<PagingModel<VaccineRecordViewModel>> GetAllVaccineRecordAsync(VaccineRecordQuery request);
	public Task<VaccineRecordViewModel> GetVaccineRecordByIdAsync(string id);
	public Task RemoveVaccineRecordAsync(string id);
	public Task UpdateVaccineRecordAsync(VaccineRecordUpdateModel request, string vaccineRecordId);

}
