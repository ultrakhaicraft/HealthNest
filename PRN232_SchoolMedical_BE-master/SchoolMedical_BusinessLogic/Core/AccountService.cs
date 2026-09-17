using Org.BouncyCastle.Asn1.Ocsp;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_BusinessLogic.Utility;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Enums;
using SchoolMedical_DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace SchoolMedical_BusinessLogic.Core;

public class AccountService : IAccountService
{
	private readonly IUnitOfWork _unitOfWork;
	

	public AccountService(IUnitOfWork unitOfWork)
	{
		_unitOfWork = unitOfWork;
		
	}

	public Task ChangeAccountStatus(string userId, AccountStatus status)
	{
		
			var account = _unitOfWork.GetRepository<Account>().Find(user => user.Id == userId && user.Status != AccountStatus.Inactive.ToString());
			if (account == null)
			{
				throw new NotFoundException("Account not found or already inactive with Id: "+userId);
			}
			account.Status = status.ToString();
			_unitOfWork.GetRepository<Account>().Update(account);
			_unitOfWork.Save();
			return Task.CompletedTask;
		
	}

	public async Task<string> CreateNewAccount(AccountCreateRequest request)
	{
		
			if (!IsValid(request.Password))
			{
				throw new BadRequestException("Password does not meet the required criteria: \n" +
					"1. Must have length greater than 8\n" +
					"2. Must have letters numbers, and special characters");
			}

			var account = new Account
			{
				Id = Guid.NewGuid().ToString(),
				FullName = request.FullName,
				Email = request.Email,
				PhoneNumber = request.PhoneNumber,
				Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
				Address = request.Address,
				Role = request.Role,
				Status = AccountStatus.Active.ToString(),
				
			};
			
			await _unitOfWork.GetRepository<Account>().InsertAsync(account);
			await _unitOfWork.SaveAsync();
			return account.Id;
		
	}

	public async Task<AccountDetailModel> GetAccountDetailById(string userId)
	{
		
			var accounts= await  _unitOfWork.GetRepository<Account>().FindAsync(user => user.Id == userId);
			if (accounts == null)
			{
				throw new NotFoundException("Account not found with Id: "+userId);
			}
			if (accounts.Status == AccountStatus.Inactive.ToString())
			{
				throw new BadRequestException("Account is inactive with Id: "+userId);
			}

			var detail= new AccountDetailModel
			{
				Id = accounts.Id,
				FullName = accounts.FullName,
				Email = accounts.Email,
				PhoneNumber = accounts.PhoneNumber,
				Address = accounts.Address,
				Role = accounts.Role,
				Status = accounts.Status,
				
			};

			//If the role is either parent or student, assign additional data depend on these 2 role. If not, skip and return detail
			if (accounts.Role == AccountRole.Parent.ToString())
			{
				(string studentId, string studentName) studentData = await FindStudentByParentId(accounts.Id);
				detail.StudentId=studentData.studentId;
				detail.StudentName=studentData.studentName;
			}
			else if(accounts.Role==AccountRole.Student.ToString())
			{
				detail.ParentName = accounts.Parent != null ? accounts.FullName : null;
			}

			return detail;

		
	}

	public async Task<PagingModel<AccountViewModel>> GetAllAccount(AccountQuery request)
	{
		
			var query = await _unitOfWork.GetRepository<Account>().GetQueryableAsync();
			
			query = ApplyFilters(query, request);

			if (query == null || !query.Any())
			{
				throw new NotFoundException("Unable to found account given the filter request");
			}

			var accountViews = query.Select(account => new AccountViewModel
			{
				Id = account.Id,
				FullName = account.FullName,
				Email = account.Email,
				Role = account.Role,
				Status = account.Status,
			});

			var pagingModel = await PagingExtension.ToPagingModel<AccountViewModel>(accountViews, request.PageNumber, request.PageSize); // Default page index and size

			return new PagingModel<AccountViewModel>
			{
				PageIndex = pagingModel.PageIndex,
				PageSize = pagingModel.PageSize,
				TotalCount = pagingModel.TotalCount,
				TotalPages = pagingModel.TotalPages,
				Data = pagingModel.Data
			};
		
	}

	public async Task SoftDeleteAccount(string userId)
	{
		

			var account = await _unitOfWork.GetRepository<Account>().FindAsync(user => user.Id == userId && user.Status != AccountStatus.Inactive.ToString());
			if (account == null)
			{
				throw new NotFoundException("Account not found or already inactive with Id: "+userId);
			}
			account.Status = AccountStatus.Inactive.ToString();
			_unitOfWork.GetRepository<Account>().Update(account);
			_unitOfWork.Save();
			
		
	}

	public async Task UpdateAccount(string userId, AccountUpdateRequest request)
	{
		
			var account = await _unitOfWork.GetRepository<Account>().FindAsync(user => user.Id == userId && user.Status != AccountStatus.Inactive.ToString());
			if (account == null)
			{
				throw new NotFoundException("Account not found or already inactive with Id: " + userId);
			}
			account.FullName = request.FullName;
			account.Email = request.Email;
			account.PhoneNumber = request.PhoneNumber;
			account.Address = request.Address;
			account.Role = request.Role;
			_unitOfWork.GetRepository<Account>().Update(account);
			_unitOfWork.Save();
			
		
	}

	public async Task<PagingModel<AccountViewModel>> getStudentsByParentId(string parentId, AccountQuery request)
	{

		//Get a potential list of student id through parent id
		var query = await _unitOfWork.GetRepository<Account>().GetQueryableAsync();


		var accounts = query.Where(user => user.Student.ParentId == parentId
		&&user.Role== AccountRole.Student.ToString()
		&&user.Status != AccountStatus.Inactive.ToString());

		if (accounts == null || !accounts.Any())
		{
			throw new NotFoundException("Accounts associated with ParentId are not found or already inactive with Id or not a student");
		}

		var accountViews = accounts.Select(account => new AccountViewModel
		{
			Id = account.Id,
			FullName = account.FullName,
			Email = account.Email,
			Role = account.Role,
			Status = account.Status,
		});

		var pagingModel = await PagingExtension.ToPagingModel<AccountViewModel>(accountViews, request.PageNumber, request.PageSize); // Default page index and size

		return new PagingModel<AccountViewModel>
		{
			PageIndex = pagingModel.PageIndex,
			PageSize = pagingModel.PageSize,
			TotalCount = pagingModel.TotalCount,
			TotalPages = pagingModel.TotalPages,
			Data = pagingModel.Data
		};


	}

	public async Task<List<AccountViewModel>> GetAllStudentAccounts()
	{
		var accounts = await _unitOfWork.GetRepository<Account>().GetQueryableAsync();
		var students = accounts
			.Where(a => a.Role == AccountRole.Student.ToString() && a.Status != AccountStatus.Inactive.ToString())
			.Select(a => new AccountViewModel
			{
				Id = a.Id,
				FullName = a.FullName,
				Email = a.Email,
				Role = a.Role,
				Status = a.Status
			})
			.ToList();
		return students;
	}

	

	public async Task<bool> AssignStudentToParent(string parentId, string studentId)
	{
		
			//Get student Account
			var account = await _unitOfWork.GetRepository<Account>()
				.FindAsync(user => user.Id == studentId && user.Status != AccountStatus.Inactive.ToString());

			

			if (account == null)
			{
				throw new AppException("Account not found or already inactive.");
			}

			Console.WriteLine(account.FullName);

			if (account.Role != AccountRole.Student.ToString())
			{
				throw new AppException("Account is not a student.");
			}

			//If student already assigned to parent 
			/*if (!string.IsNullOrEmpty(account.ParentId))
			{
				throw new AppException("Account already linked");
			}*/

			account.Status = AccountStatus.Active.ToString(); // Set status to Active since it's now linked to a parent
			_unitOfWork.GetRepository<Account>().Update(account);
			_unitOfWork.Save();
			return true;
		
	}




	//private methods
	private bool IsValid(string password)
	{
		if (password.Length < 8) return false;

		if (!Regex.IsMatch(password, @"[a-zA-Z]")) return false;

		if (!Regex.IsMatch(password, @"[0-9]")) return false;

		if (!Regex.IsMatch(password, @"[@#$%^&*!_]")) return false;

		return true;
	}

	private static IQueryable<Account> ApplyFilters(IQueryable<Account> query, AccountQuery request)
	{
		// Filter Based on Status (using string-to-enum conversion)
		if (!string.IsNullOrEmpty(request.Status.ToString()))
		{
			if (Enum.TryParse<AccountStatus>(request.Status.ToString(), true, out var parsedStatus))
			{
				query = query.Where(account => account.Status == parsedStatus.ToString());
			}
		}

		// Filter Based on Role (using string-to-enum conversion)
		if (!string.IsNullOrEmpty(request.Role.ToString()))
		{
			if (Enum.TryParse<AccountRole>(request.Role.ToString(), true, out var parsedRole))
			{
				query = query.Where(account => account.Role == parsedRole.ToString());
			}
		}

		// Search Based on FullName (case-insensitive search using ToLower)
		if (!string.IsNullOrEmpty(request.FullName))
		{
			string nameFilter = request.FullName.ToLower();
			query = query.Where(account => account.FullName != null && account.FullName.ToLower().Contains(nameFilter));
		}

		//Search Based on Email
		if (!string.IsNullOrEmpty(request.Email))
		{
			query = query.Where(account => account.Email != null && account.Email.Equals(request.Email));
		}

		return query;
	}

	private async Task<(string studentId, string studentName)> FindStudentByParentId(string parentId)
	{
		var student= await _unitOfWork.GetRepository<Account>().FindAsync(x=>x.Student.ParentId.Equals(parentId));
		if (student == null) { 
			Console.WriteLine("No student found for this parent ID.");
			return (string.Empty, string.Empty); // Return empty values if no student found
		}
		return (student.Id, student.FullName);
	}

	
}
