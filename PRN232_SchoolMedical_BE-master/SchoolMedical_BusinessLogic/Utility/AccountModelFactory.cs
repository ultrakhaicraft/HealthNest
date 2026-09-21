using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.DTOModels.Accounts;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Enums;
using SchoolMedical_DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Utility;

//A factory of creating AccountDetailModel subclass
public abstract class AccountModelFactory<TModel, TExtension> 
	where TModel : AccountDetailModel, new()
	where TExtension : class
{
	protected TModel MapBaseFields(Account account) 
	{
		return new TModel
		{
			Id = account.Id,
			FullName = account.FullName,
			Email = account.Email,
			PhoneNumber = account.PhoneNumber,
			Address = account.Address,
			Role = account.Role,
			Status = account.Status,
			Gender = account.Gender,
			AvatarUrl = account.AvatarUrl,
			DateOfBirth = account.DateOfBirth,
			AccountCreationDateTime = account.AccountCreationDateTime,
		};
	}
	public abstract AccountDetailModel CreateDetailModel(Account account, TExtension subclassOfAccount);
}

public interface IAccountModelFactory
{
	string Role { get; }
	Task<AccountDetailModel> CreateDetailModelAsync(Account account, IUnitOfWork unitOfWork);
}

public class StudentModelFactory : AccountModelFactory<StudentDetailModel,Student> , IAccountModelFactory
{

	public string Role => AccountRole.Student.ToString();

	public override AccountDetailModel CreateDetailModel(Account account, Student extension)
	{
		var detailModel = MapBaseFields(account);
		detailModel.Class = extension.Class;
		detailModel.CurrentHealthStatus = extension.CurrentHealthStatus;
		detailModel.ParentId = extension.ParentId;
		return detailModel;
	}

	public async Task<AccountDetailModel> CreateDetailModelAsync(Account account, IUnitOfWork unitOfWork)
	{
		var student = await unitOfWork.GetRepository<Student>().GetByIdAsync(account.Id);
		if (student == null)
			throw new NotFoundException("Student Info", account.Id);

		return CreateDetailModel(account, student);
	}
}

public class ParentModelFactory : AccountModelFactory<ParentDetailModel,Parent>, IAccountModelFactory
{

	public string Role => AccountRole.Parent.ToString();


	public override AccountDetailModel CreateDetailModel(Account account, Parent subclassOfAccount)
	{

		var detailModel = MapBaseFields(account);
		detailModel.IncomeLevel =  subclassOfAccount.IncomeLevel;
		detailModel.RelationshipStatus = subclassOfAccount.RelationshipStatus;

		return detailModel;
	}

	public async Task<AccountDetailModel> CreateDetailModelAsync(Account account, IUnitOfWork unitOfWork)
	{
		var parent = await unitOfWork.GetRepository<Parent>().GetByIdAsync(account.Id);
		if (parent == null)
			throw new NotFoundException("Parent Info", account.Id);

		return CreateDetailModel(account, parent);
	}
}

public class NurseModelFactory : AccountModelFactory<NurseDetailModel,Nurse>, IAccountModelFactory
{
	public string Role => AccountRole.SchoolNurse.ToString();

	public override AccountDetailModel CreateDetailModel(Account account, Nurse subclassOfAccount)
	{

		var detailModel = MapBaseFields(account);
		detailModel.Description = subclassOfAccount.Description;

		return detailModel;
	}

	public async Task<AccountDetailModel> CreateDetailModelAsync(Account account, IUnitOfWork unitOfWork)
	{
		var nurse = await unitOfWork.GetRepository<Nurse>().GetByIdAsync(account.Id);
		if (nurse == null)
			throw new NotFoundException("Nurse Info", account.Id);

		return CreateDetailModel(account, nurse);
	}
}

public class AdminModelFactory : AccountModelFactory<AdminDetailModel,Admin>, IAccountModelFactory
{
	public string Role => AccountRole.Admin.ToString();

	public override AccountDetailModel CreateDetailModel(Account account, Admin subclassOfAccount)
	{

		var detailModel = MapBaseFields(account);
		detailModel.Description = subclassOfAccount.Description;


		return detailModel;
	}

	public async Task<AccountDetailModel> CreateDetailModelAsync(Account account, IUnitOfWork unitOfWork)
	{
		var admin = await unitOfWork.GetRepository<Admin>().GetByIdAsync(account.Id);
		if (admin == null)
			throw new NotFoundException("Admin Info", account.Id);

		return CreateDetailModel(account, admin);
	}
}
