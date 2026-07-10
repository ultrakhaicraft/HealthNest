using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Org.BouncyCastle.Asn1.Ocsp;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_BusinessLogic.SignalRHubs;
using SchoolMedical_BusinessLogic.Utility;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Enums;
using SchoolMedical_DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Core;

public class IncidentRecordService : IIncidentRecordService
{
	private readonly IUnitOfWork _unitOfWork;
	private readonly IDistributedCache _cache;
	private readonly IHubContext<MyHub> _hubContext;
	private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10);


	public IncidentRecordService(IUnitOfWork unitOfWork, IHubContext<MyHub> hubContext, IDistributedCache cache)
	{
		_unitOfWork = unitOfWork;
		_hubContext = hubContext;
		_cache = cache;
	}

	public async Task<PagingModel<IncidentRecordViewModel>> GetAllIncidentRecordsAsync(IncidentRecordQuery request)
	{
		//Get the data from cache if available, otherwise fetch from the database and cache it for future requests
		const string cacheKey = "all_incident_record";

		var cachedData = await _cache.GetStringAsync(cacheKey);
		if (cachedData != null)
		{
			var cachedIncidents = JsonSerializer.Deserialize<List<IncidentRecordViewModel>>(cachedData)!;
			var pagedData = await PagingExtension.ToPagingModel(cachedIncidents, request.PageIndex, request.PageSize);
		}


		var repository = _unitOfWork.GetRepository<Incidentrecord>();
		IQueryable<Incidentrecord> incidents = await repository.GetAllAsync();

		List<IncidentRecordViewModel> incidentViewModels = incidents.Select(i => new IncidentRecordViewModel
		{
			Id = i.Id,
			StudentId = i.StudentId,
			StudentName = i.Student.FullName,
			IncidentType = i.IncidentType,
			DateOccurred = i.DateOccurred,
			Status = i.Status
		}).ToList();

		// Cache the data for future requests
		await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(incidentViewModels), new DistributedCacheEntryOptions
		{
			AbsoluteExpirationRelativeToNow = CacheDuration
		});

		var pagedResult = await PagingExtension.ToPagingModel(incidentViewModels, request.PageIndex, request.PageSize);

		return pagedResult;
	}

	public async Task<IncidentRecordDetailModel> GetIncidentRecordDetailByIdAsync(string incidentId)
	{
		var repository = _unitOfWork.GetRepository<Incidentrecord>();
		var incident = await repository
			.GetAll()
			.Include(i => i.HandleByNavigation)
			.FirstOrDefaultAsync(i => i.Id == incidentId);

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

		// Notify all connected clients about the new incident record
		var incidentRecord = await GetIncidentRecordDetailByIdAsync(newIncident.Id);
		await _hubContext.Clients.All.SendAsync("IncidentRecordAdded", incidentRecord);

		return incidentRecord;
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

		//Notify all connected clients about the updated incident record
		var incidentRecord = await GetIncidentRecordDetailByIdAsync(existingIncident.Id);
		await _hubContext.Clients.All.SendAsync("IncidentRecordUpdated", incidentRecord);


		return incidentRecord;
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

			//Notify all connected clients about the deleted incident record
			await _hubContext.Clients.All.SendAsync("IncidentRecordDeleted");


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