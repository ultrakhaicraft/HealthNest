using HealthNest_BusinessLogic.Interface;
using HealthNest_BusinessLogic.Utility;
using HealthNest_DAO.DTOModels;
using HealthNest_DAO.DTOModels.Accounts;
using HealthNest_DAO.Entities;
using HealthNest_DAO.Enums;
using HealthNest_DAO.Interfaces;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace HealthNest_BusinessLogic.Core;

public class AccountService : IAccountService
{
	private readonly IUnitOfWork _unitOfWork;
	private readonly Dictionary<string, IAccountModelFactory> _factoriesByRole;

	public AccountService(IUnitOfWork unitOfWork, IEnumerable<IAccountModelFactory> factories)
	{
		_unitOfWork = unitOfWork;
		_factoriesByRole = factories.ToDictionary(f => f.Role, StringComparer.OrdinalIgnoreCase);

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
		
			var account= await  _unitOfWork.GetRepository<Account>().FindAsync(user => user.Id == userId);
			if (account == null)
			{
				throw new NotFoundException("Account not found with Id: "+userId);
			}
			if (account.Status == AccountStatus.Inactive.ToString())
			{
				throw new BadRequestException("Account is inactive with Id: "+userId);
			}

			AccountDetailModel detailModel = new AccountDetailModel();

			//If the role is either parent or student, assign additional data depend on these 2 role.

			if (!_factoriesByRole.TryGetValue(account.Role, out var factory))
			{
				var registered = string.Join(", ", _factoriesByRole.Keys.Select(k => $"'{k}'"));
				throw new BadRequestException(
					$"Unknown account role: '{account.Role}'. Registered roles: [{registered}]");
			}
			

			return await factory.CreateDetailModelAsync(account,_unitOfWork);

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

			var pagingModel = await PagingExtension.ToPagingModel(accountViews, request.PageNumber, request.PageSize); // Default page index and size

			return new PagingModel<AccountViewModel>
			{
				PageIndex = pagingModel.PageIndex,
				PageSize = pagingModel.PageSize,
				TotalCount = pagingModel.TotalCount,
				TotalPages = pagingModel.TotalPages,
				Data = pagingModel.Data
			};
		
	}

	public async Task SoftDeleteAccount(string accountId)
	{
		

			var account = await _unitOfWork.GetRepository<Account>()
				.FindAsync(user => user.Id == accountId && user.Status != AccountStatus.Inactive.ToString());

			if (account == null)
			{
				throw new NotFoundException("Account not found or already inactive with Id: "+ accountId);
			}

			account.Status = AccountStatus.Inactive.ToString();
			await _unitOfWork.GetRepository<Account>().UpdateAsync(account);
			await _unitOfWork.SaveAsync();
			
		
	}

	public async Task UpdateAccount(string userId, AccountUpdateRequest request)
	{
		
			var account = await _unitOfWork.GetRepository<Account>().FindAsync(user => user.Id == userId && user.Status != AccountStatus.Inactive.ToString());
			if (account == null)
			{
				throw new NotFoundException("Account not found or already inactive with Id: " + userId);
			}

			//Only update AvatarUrl if the image file is different or AvatarUrl is null
			if (account.AvatarUrl==null && account.AvatarUrl!.Equals(request.AvatarUrl))
			{
				account.AvatarUrl = request.AvatarUrl;
			}

			account.FullName = request.FullName;
			account.Email = request.Email;
			account.PhoneNumber = request.PhoneNumber;
			account.Address = request.Address;
			account.Role = request.Role;
			_unitOfWork.GetRepository<Account>().Update(account);
			_unitOfWork.Save();
			
		
	}

	/// <summary>
	/// Get list of student by parentId
	/// </summary>
	/// <param name="parentId"></param>
	/// <param name="request"></param>
	/// <returns></returns>
	/// <exception cref="NotFoundException"></exception>
	public async Task<List<StudentDetailModel>> getStudentsByParentId(string parentId)
	{
		var query = await _unitOfWork.GetRepository<Student>().GetQueryableAsync();

		var students = query
			.Include(u=>u.Account)
			.Where(student => student.ParentId == parentId
			&& student.Account.Role== AccountRole.Student.ToString()
			&& student.Account.Status != AccountStatus.Inactive.ToString());

		if (students == null || !students.Any())
		{
			throw new NotFoundException("Accounts associated with ParentId are not found or already inactive with Id or not a student");
		}

		var studentViews = students.Select(account => new StudentDetailModel
		{
			Id = account.Id,
			FullName = account.Account.FullName,
			Email = account.Account.Email,
			Role = account.Account.Role,
			Gender = account.Account.Gender,
			Status = account.Account.Status,
			Address = account.Account.Address,
			AvatarUrl = account.Account.AvatarUrl,
			DateOfBirth = account.Account.DateOfBirth,
			PhoneNumber = account.Account.PhoneNumber,
			AccountCreationDateTime= account.Account.AccountCreationDateTime,
			ParentId = account.ParentId,
			Class = account.Class,
			CurrentHealthStatus = account.CurrentHealthStatus,

		}).ToList();


		return studentViews;

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

	

	public async Task AssignStudentToParent(string parentId, List<string> ListOfStudentId)
	{
		// 1. Normalize input
		var ids = (ListOfStudentId ?? new List<string>())
			.Where(id => !string.IsNullOrWhiteSpace(id))
			.Distinct()
			.ToList();

		if (ids.Count == 0)
			throw new BadRequestException("At least one student id is required.");

		// 2. Parent must exist, be a parent, and be active
		var parent = await _unitOfWork.GetRepository<Account>().FindAsync(a => a.Id == parentId);
		if (parent == null
			|| parent.Role != "Parent"                                   // use your role constant/enum
			|| parent.Status == AccountStatus.Inactive.ToString())
			throw new BadRequestException("Parent account not found or not eligible to link students.");

		// 3. One query for all students
		var students = await _unitOfWork.GetRepository<Student>()
			.Include(s => s.Account)
			.Where(s => ids.Contains(s.Id))
			.ToListAsync();

		// 4. Validate everything up front and report every problem
		var available = students
			.Where(s => s.Account.Status != AccountStatus.Inactive.ToString())
			.Select(s => s.Id);
		var unavailable = ids.Except(available).ToList();
		if (unavailable.Count > 0)
			throw new NotFoundException(
				$"Student account(s) not found or inactive: {string.Join(", ", unavailable)}");

		var alreadyLinked = students
			.Where(s => !string.IsNullOrEmpty(s.ParentId))
			.Select(s => s.Id)
			.ToList();
		if (alreadyLinked.Count > 0)
			throw new BadRequestException(
				$"Student(s) already linked: {string.Join(", ", alreadyLinked)}");

		// 5. Apply changes
		foreach (var student in students)
		{
			student.ParentId = parentId;
			student.Account.Status = AccountStatus.Active.ToString();
		}

		// 6. SaveChanges 
		try
		{
			await _unitOfWork.SaveAsync();
		}
		catch (DbUpdateConcurrencyException)
		{
			throw new BadRequestException(
				"One or more students were linked by someone else while you were submitting. Please refresh and try again.");
		}

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
