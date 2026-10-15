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

public class TreatmentRecordService : ITreatmentRecordService
{
	private readonly IUnitOfWork _unitOfWork;

	public TreatmentRecordService(IUnitOfWork unitOfWork)
	{
		_unitOfWork = unitOfWork;
	}

	public async Task AddTreatmentRecordsByStudentHealthRecordIdAsync(List<TreatmentRecordCreateModel> requests, string studentHealthRecordId)
	{
		var studentHealthRecord = await _unitOfWork.GetRepository<Studenthealthrecord>().GetByIdAsync(studentHealthRecordId);

		if (studentHealthRecord == null)
		{
			throw new NotFoundException("Student Health Record", studentHealthRecordId);
		}


		//Convert to DTO
		List<Treatmentrecord> newRecords = requests.Select(request => new Treatmentrecord
		{
			Status = RecordStatus.Active.ToString(),
			Description = request.Description,
			StudentHealthRecordId = studentHealthRecordId,
			Id = Guid.NewGuid().ToString(),
			RecordDate = DateTime.Now,
			TreatmentTitle = request.TreatmentTitle

		}).ToList();

		//Add Range
		await _unitOfWork.GetRepository<Treatmentrecord>().InsertRangeAsync(newRecords);
		await _unitOfWork.SaveAsync();

	}

	public async Task<PagingModel<TreatmentRecordViewModel>> GetAllTreatmentRecordAsync(TreatmentRecordQuery request)
	{

		//Perform Pagination in Database itself
		var query = _unitOfWork.GetRepository<Treatmentrecord>().GetQueryable();

		//Apply filtering and sorting
		query = ApplyFilter(query, request.Status, request.TreatmentTitle);

		var entity = query.Include(x => x.StudentHealthRecord)
				.Include(x => x.StudentHealthRecord.Student)
				.Include(x => x.StudentHealthRecord.Student.Account)
				.Skip((request.PageIndex - 1) * request.PageSize)
				.Take(request.PageSize)
				.ToList();

		var totalCount = entity.Count();

		List<TreatmentRecordViewModel> viewData = entity.Select(x => new TreatmentRecordViewModel
		{
			Id = x.Id,
			StudentHealthRecordId = x.StudentHealthRecordId,
			Description = x.Description,
			StudentId = x.StudentHealthRecord.StudentId,
			StudentName = x.StudentHealthRecord.Student.Account.FullName,
			RecordDate = x.RecordDate,
			Status = x.Status,
			TreatmentTitle = x.TreatmentTitle,
		}).ToList();



		var pagedResult = await PagingExtension.ToPagingModel(viewData, request.PageIndex, request.PageSize, totalCount);

		return pagedResult;
	}
	public async Task<TreatmentRecordViewModel> GetTreatmentRecordByIdAsync(string id)
	{
		var entity = await _unitOfWork.GetRepository<Treatmentrecord>()
				.Include(x => x.StudentHealthRecord)
				.Include(x => x.StudentHealthRecord.Student)
				.Include(x => x.StudentHealthRecord.Student.Account)
				.Where(x => x.Id == id)
				.FirstOrDefaultAsync();

		if (entity == null)
			throw new NotFoundException("Student Health Record", id);

		return new TreatmentRecordViewModel
		{
			Id = entity.Id,
			StudentHealthRecordId = entity.StudentHealthRecordId,
			Description = entity.Description,
			StudentId = entity.StudentHealthRecord.StudentId,
			StudentName = entity.StudentHealthRecord.Student.Account.FullName,
			RecordDate = entity.RecordDate,
			Status = entity.Status,
			TreatmentTitle = entity.TreatmentTitle
		};
	}

	public async Task RemoveTreatmentRecordAsync(string id)
	{
		var entity = await _unitOfWork.GetRepository<Treatmentrecord>().GetByIdAsync(id);
		if (entity == null)
			throw new NotFoundException("Treatment record", id);

		await _unitOfWork.GetRepository<Treatmentrecord>().DeleteAsync(entity);
		await _unitOfWork.SaveAsync();
	}

	/// <summary>
	/// Update Treatment Record Info without updating student health record Id
	/// </summary>
	/// <param name="request"></param>
	/// <param name="treatmentRecordId"></param>
	/// <returns></returns>
	/// <exception cref="NotFoundException"></exception>
	public async Task UpdateTreatmentRecordAsync(TreatmentRecordUpdateModel request, string treatmentRecordId)
	{
		var entity = await _unitOfWork.GetRepository<Treatmentrecord>().GetByIdAsync(treatmentRecordId);
		if (entity == null)
			throw new NotFoundException("Treatment record", treatmentRecordId);

		entity.Status = request.Status;
		entity.Description = request.Description;
		entity.TreatmentTitle = request.TreatmentTitle;

		await _unitOfWork.GetRepository<Treatmentrecord>().UpdateAsync(entity);
		await _unitOfWork.SaveAsync();
	}


	private IQueryable<Treatmentrecord> ApplyFilter(IQueryable<Treatmentrecord> query, string status, string treatmentTitle)
	{

		// Apply filters search by name and availability
		if (!string.IsNullOrEmpty(treatmentTitle))
		{
			query = query.Where(m => m.TreatmentTitle!.ToLower().Contains(treatmentTitle.ToLower()));
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
