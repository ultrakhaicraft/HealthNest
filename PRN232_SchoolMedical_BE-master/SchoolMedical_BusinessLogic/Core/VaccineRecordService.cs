using HealthNest_BusinessLogic.Interface;
using HealthNest_BusinessLogic.Utility;
using HealthNest_DAO.DTOModels;
using HealthNest_DAO.Entities;
using HealthNest_DAO.Enums;
using HealthNest_DAO.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Core;

public class VaccineRecordService : IVaccineRecordService
{
	private readonly IUnitOfWork _unitOfWork;
	

	public VaccineRecordService(IUnitOfWork unitOfWork)
	{
		_unitOfWork = unitOfWork;
	}

	public async Task AddVaccineRecordsByStudentHealthRecordIdAsync(List<VaccineRecordCreateModel> requests,string studentHealthRecordId)
	{
		var studentHealthRecord = await _unitOfWork.GetRepository<Studenthealthrecord>().GetByIdAsync(studentHealthRecordId);

		if(studentHealthRecord == null)
		{
			throw new NotFoundException("Student Health Record", studentHealthRecordId);
		}


		//Convert to DTO
		List<Vaccinerecord> newRecords = requests.Select(request => new Vaccinerecord
		{
			Status = RecordStatus.Active.ToString(),
			Description = request.Description,
			StudentHealthRecordId = studentHealthRecordId,
			Id = Guid.NewGuid().ToString(),
			RecordDate = DateTime.Now,
			VaccineTitle = request.VaccineTitle

		}).ToList();

		//Add Range
		await _unitOfWork.GetRepository<Vaccinerecord>().InsertRangeAsync(newRecords);
		await _unitOfWork.SaveAsync();

	}


	public async Task<PagingModel<VaccineRecordViewModel>> GetAllVaccineRecordAsync(VaccineRecordQuery request)
	{

		//Perform Pagination in Database itself
		var query = _unitOfWork.GetRepository<Vaccinerecord>().GetQueryable();

		//Apply filtering and sorting
		query = ApplyFilter(query, request.Status, request.VaccineTitle);

		var entity = query.Include(x => x.StudentHealthRecord)
				.Include(x => x.StudentHealthRecord.Student)
				.Include(x => x.StudentHealthRecord.Student.Account)
				.Skip((request.PageIndex - 1) * request.PageSize)
				.Take(request.PageSize)
				.ToList();

		var totalCount=entity.Count();

		List<VaccineRecordViewModel> viewData = entity.Select(x => new VaccineRecordViewModel
		{
			Id = x.Id,
			StudentHealthRecordId = x.StudentHealthRecordId,
			Description = x.Description,
			StudentId = x.StudentHealthRecord.StudentId,
			StudentName = x.StudentHealthRecord.Student.Account.FullName,
			RecordDate = x.RecordDate,
			Status = x.Status,
			VaccineTitle = x.VaccineTitle
		}).ToList();



		var pagedResult = await PagingExtension.ToPagingModel(viewData, request.PageIndex, request.PageSize, totalCount);

		return pagedResult;
	}



	public async Task<VaccineRecordViewModel> GetVaccineRecordByIdAsync(string id)
	{
		var entity = await _unitOfWork.GetRepository<Vaccinerecord>()
				.Include(x => x.StudentHealthRecord)
				.Include(x => x.StudentHealthRecord.Student)
				.Include(x => x.StudentHealthRecord.Student.Account)
				.Where(x => x.Id == id)
				.FirstOrDefaultAsync();

		if (entity == null)
			throw new NotFoundException("Student Health Record", id);

		return new VaccineRecordViewModel
		{
			Id = entity.Id,
			StudentHealthRecordId = entity.StudentHealthRecordId,
			Description = entity.Description,
			StudentId = entity.StudentHealthRecord.StudentId,
			StudentName = entity.StudentHealthRecord.Student.Account.FullName,
			RecordDate = entity.RecordDate,
			Status = entity.Status,
			VaccineTitle = entity.VaccineTitle	
		};
	}

	public async Task RemoveVaccineRecordAsync(string id)
	{
		var entity = await _unitOfWork.GetRepository<Vaccinerecord>().GetByIdAsync(id);
		if (entity == null)
			throw new NotFoundException("Vaccine record", id);

		await _unitOfWork.GetRepository<Vaccinerecord>().DeleteAsync(entity);
		await _unitOfWork.SaveAsync();
	}

	
	/// <summary>
	/// Update Vaccine Record Info without updating student health record Id
	/// </summary>
	/// <param name="request"></param>
	/// <param name="vaccineRecord"></param>
	/// <returns></returns>
	/// <exception cref="NotFoundException"></exception>
	public async Task UpdateVaccineRecordAsync(VaccineRecordUpdateModel request, string vaccineRecordId)
	{
		var entity = await _unitOfWork.GetRepository<Vaccinerecord>().GetByIdAsync(vaccineRecordId);
		if (entity == null)
			throw new NotFoundException("Vaccine record", vaccineRecordId);

		entity.Status = request.Status;
		entity.Description = request.Description;
		entity.VaccineTitle = request.VaccineTitle;

		await _unitOfWork.GetRepository<Vaccinerecord>().UpdateAsync(entity);
		await _unitOfWork.SaveAsync();
	}

	private IQueryable<Vaccinerecord> ApplySorting(IQueryable<Vaccinerecord> query, bool SortByNameIsDescending)
	{

		return SortByNameIsDescending
			? query.OrderByDescending(m => m.VaccineTitle)
			: query.OrderBy(m => m.VaccineTitle);
	}

	private IQueryable<Vaccinerecord> ApplyFilter(IQueryable<Vaccinerecord> query, string status, string VaccineTitle)
	{

		// Apply filters search by name and availability
		if (!string.IsNullOrEmpty(VaccineTitle))
		{
			query = query.Where(m => m.VaccineTitle!.ToLower().Contains(VaccineTitle.ToLower()));
		}

		if (!string.IsNullOrEmpty(status))
		{
			if (status.Equals("Active", StringComparison.OrdinalIgnoreCase))
			{
				query = query.Where(m => m.Status == RecordStatus.Active.ToString());
			}

			if (status.Equals("Inactive", StringComparison.OrdinalIgnoreCase))
			{
				query = query.Where(m => m.Status == RecordStatus.Inactive.ToString());
			}
		}

		return query;

	}
}
