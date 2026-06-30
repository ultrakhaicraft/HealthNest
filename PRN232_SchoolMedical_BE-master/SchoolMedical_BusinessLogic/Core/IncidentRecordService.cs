using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Enums;
using SchoolMedical_DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Core;

public class IncidentRecordService : IIncidentRecordService
{
	private readonly IUnitOfWork _unitOfWork;

	public IncidentRecordService(IUnitOfWork unitOfWork)
	{
		_unitOfWork = unitOfWork;
	}

	public async Task<IEnumerable<IncidentRecordViewModel>> GetAllIncidentRecordsAsync()
	{
		var repository = _unitOfWork.GetRepository<Incidentrecord>();
		var incidents = await repository.GetAllAsync();

		return incidents.Select(i => new IncidentRecordViewModel
		{
			Id = i.Id,
			StudentId = i.StudentId,
			StudentName = i.Student.FullName,
			IncidentType = i.IncidentType,
			DateOccurred = i.DateOccurred,
			Status = i.Status
		});
	}

	public async Task<IncidentRecordDetailModel> GetIncidentRecordDetailByIdAsync(string incidentId)
	{
		var repository = _unitOfWork.GetRepository<Incidentrecord>();
		var incident = await repository.GetByIdAsync(incidentId);

		if (incident == null)
			return null;

		return new IncidentRecordDetailModel
		{
			Id = incident.Id,
			StudentId = incident.StudentId,
			HandleBy = incident.HandleBy,
			HandleByName = incident.HandleByNavigation.FullName,
			IncidentType = incident.IncidentType,
			Description = incident.Description,
			DateOccurred = incident.DateOccurred,
			Status = incident.Status
		};
	}

	public async Task<IncidentRecordDetailModel> CreateIncidentRecordAsync(IncidentRecordCreateRequest request, string currentUserId)
	{
		var repository = _unitOfWork.GetRepository<Incidentrecord>();

		var newIncident = new Incidentrecord
		{
			Id = Guid.NewGuid().ToString(),
			StudentId = request.StudentId,
			HandleBy = currentUserId,
			IncidentType = request.IncidentType,
			Description = request.Description,
			DateOccurred = request.DateOccurred,
			Status = request.Status
		};

		await repository.InsertAsync(newIncident);
		await _unitOfWork.SaveAsync();

		return await GetIncidentRecordDetailByIdAsync(newIncident.Id);
	}

	public async Task<IncidentRecordDetailModel> UpdateIncidentRecordAsync(IncidentRecordUpdateRequest request, string incidentId)
	{
		var repository = _unitOfWork.GetRepository<Incidentrecord>();
		var existingIncident = await repository.GetByIdAsync(incidentId);

		if (existingIncident == null)
			return null;

		existingIncident.StudentId = request.StudentId;
		existingIncident.HandleBy = request.HandleBy;
		existingIncident.IncidentType = request.IncidentType;
		existingIncident.Description = request.Description;
		existingIncident.DateOccurred = request.DateOccurred;
		existingIncident.Status = request.Status;

		await repository.UpdateAsync(existingIncident);
		await _unitOfWork.SaveAsync();

		return await GetIncidentRecordDetailByIdAsync(incidentId);
	}

	public async Task<bool> SoftDeleteIncidentRecordAsync(string incidentId)
	{
		try
		{
			var repository = _unitOfWork.GetRepository<Incidentrecord>();
			var incident = await repository.GetByIdAsync(incidentId);

			if (incident == null)
				return false;

			incident.Status = RecordStatus.Inactive.ToString();
			await repository.UpdateAsync(incident);
			await _unitOfWork.SaveAsync();

			return true;
		}
		catch (Exception e) 
		{

			Console.WriteLine(e.Message);
			Console.WriteLine(e.StackTrace);
			return false;
		}
	}

	public async Task<bool> ChangeStatusRecord(string id, string status)
	{
		try
		{
			var repository = _unitOfWork.GetRepository<Incidentrecord>();
			var incident = await repository.GetByIdAsync(id);

			if (incident == null)
				return false;

			incident.Status = status;
			await repository.UpdateAsync(incident);
			await _unitOfWork.SaveAsync();

			return true;
		}
		catch (Exception e)
		{

			Console.WriteLine(e.Message);
			Console.WriteLine(e.StackTrace);
			return false;
		}
	}
}