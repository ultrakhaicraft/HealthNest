using HealthNest_DAO.DTOModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Interface;

public interface IStudentLinkRequestService
{
	public Task<List<StudentLinkRequestViewModel>> SubmitAsync(string parentId, LinkRequestCreateModel model);
	public Task<StudentLinkRequestDetailModel> GetStudentLinkRequestModel(string linkRequestId, string accountId);
	public  Task CancelAsync(string parentId, string requestId);
	public Task<PagingModel<StudentLinkRequestViewModel>> GetAllStudentLinkRequest(StudentLinkRequestQuery query);
	public Task ApproveAsync(string nurseId, string requestId);
	public Task<PagingModel<StudentLinkRequestViewModel>> GetMyRequestsAsync(string parentId, StudentLinkRequestQuery query);

	public Task RejectAsync(string nurseId, string requestId, string reason);

	public Task UnlinkAsync(string parentId, string studentId);


}
