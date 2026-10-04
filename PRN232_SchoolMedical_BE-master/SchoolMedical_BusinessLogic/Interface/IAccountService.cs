using HealthNest_DAO.DTOModels;
using HealthNest_DAO.DTOModels.Accounts;
using HealthNest_DAO.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Interface;

/// <summary>
/// IAccountService interface defines the contract for account-related operations.
///
/// </summary>
public interface IAccountService
{
	public Task<AccountDetailModel> GetAccountDetailById(string userId);
	public Task<PagingModel<AccountViewModel>> GetAllAccount(AccountQuery request);
	public Task<string> CreateNewAccount(AccountCreateRequest request);
	public Task UpdateAccount(string userId, AccountUpdateRequest request);
	public Task SoftDeleteAccount(string userId);
	public Task ChangeAccountStatus(string userId, AccountStatus status);
	public Task<PagingModel<AccountViewModel>> getStudentsByParentId(string parentId, AccountQuery request);
	public Task<bool> AssignStudentToParent(string parentId, string studentId);
	public Task<List<AccountViewModel>> GetAllStudentAccounts();

}
