using HealthNest_DAO.DTOModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Interface;

public interface IVaccineEventStudentService
{
	public Task SignUpStudentAsync(CreateVaccineEventStudentModel request, string parentId);
	public Task CompleteStudentVaccineEventAsync(string eventId,string studentId, string checkedById, string ResultSummary);
	public Task ApproveStudentToVaccineEventAsync(string eventId, string studentId, string checkedById);
	public Task RejectStudentFromVaccineEventAsync(string eventId, string studentId, string checkedById);
	public Task CancelSignUp(string eventId, string studentId);
	public Task UpdateNote(string eventId, string studentId, string note);



	public Task<ViewVaccineEventStudentDetailModel> ViewVaccineEventStudentDetail(string eventId, string studentId);
	public Task<PagingModel<ViewVaccineEventStudentModel>> FindVaccineEventStudentByEventId(string eventId,VaccineEventStudentQuery query);
	public Task<PagingModel<ViewVaccineEventStudentModel>> FindVaccineEventStudentByParentId(string parentId, VaccineEventStudentQuery query);
	public Task<PagingModel<ViewVaccineEventStudentModel>> FindVaccineEventStudentByStudentId(string studentId, VaccineEventStudentQuery request);

}
