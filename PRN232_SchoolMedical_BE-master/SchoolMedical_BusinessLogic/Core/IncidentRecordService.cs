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
			return pagedData;
		}


		var repository = _unitOfWork.GetRepository<Incidentrecord>();
		IQueryable<Incidentrecord> incidents = await repository.GetQueryableAsync();

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
			.GetQueryable()
			.Include(i => i.HandleByNavigation)
			.FirstOrDefaultAsync(i => i.Id == incidentId);

		if (incident == null)
		{
			throw new NotFoundException("Incident Record", incidentId);
		}

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
			Status = IncidentStatus.Active.ToString(), //Always active when created for the first time
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
		{
			throw new NotFoundException("Incident Record", incidentId);

		}

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

	public async Task SoftDeleteIncidentRecordAsync(string incidentId)
	{
	
			var repository = _unitOfWork.GetRepository<Incidentrecord>();
			var incident = await repository.GetByIdAsync(incidentId);

			if (incident == null)
				throw new NotFoundException("Incident Record", incidentId);

			incident.Status = IncidentStatus.Inactive.ToString();
			await repository.UpdateAsync(incident);
			await _unitOfWork.SaveAsync();

			//Notify all connected clients about the deleted incident record
			await _hubContext.Clients.All.SendAsync("IncidentRecordDeleted");


			
		
	}

	public async Task ChangeStatusRecord(string id, string status)
	{
		
			var repository = _unitOfWork.GetRepository<Incidentrecord>();
			var incident = await repository.GetByIdAsync(id);

			if (incident == null)
				throw new NotFoundException("Incident Record", id);

			incident.Status = status;
			await repository.UpdateAsync(incident);
			await _unitOfWork.SaveAsync();
		
	}

	public async Task<int> CountActiveIncidentRecord()
	{
		var repository = _unitOfWork.GetRepository<Incidentrecord>();

		return await repository.GetQueryable()
			.Where(x => x.Status == IncidentStatus.Active.ToString())
			.CountAsync();

	}

	public async Task<IncidentRecordCountPerYear> CountAllIncidentRecordPerYear(int year)
	{
		var repository = _unitOfWork.GetRepository<Incidentrecord>();

		var monthlyCounts = await repository.GetQueryable()
			.Where(x => x.DateOccurred.Year == year)
			.GroupBy(x => x.DateOccurred.Month)
			.Select(g => new { Month = g.Key, Count = g.Count() })
			.ToListAsync();

		// Convert to a dictionary for easy lookup (Month number -> Count)
		var countsByMonth = monthlyCounts.ToDictionary(x => x.Month, x => x.Count);

		return new IncidentRecordCountPerYear
		{
			Year = year,
			January = countsByMonth.GetValueOrDefault(1),
			February = countsByMonth.GetValueOrDefault(2),
			March = countsByMonth.GetValueOrDefault(3),
			April = countsByMonth.GetValueOrDefault(4),
			May = countsByMonth.GetValueOrDefault(5),
			June = countsByMonth.GetValueOrDefault(6),
			July = countsByMonth.GetValueOrDefault(7),
			August = countsByMonth.GetValueOrDefault(8),
			September = countsByMonth.GetValueOrDefault(9),
			October = countsByMonth.GetValueOrDefault(10),
			November = countsByMonth.GetValueOrDefault(11),
			December = countsByMonth.GetValueOrDefault(12)
		};
	}
}