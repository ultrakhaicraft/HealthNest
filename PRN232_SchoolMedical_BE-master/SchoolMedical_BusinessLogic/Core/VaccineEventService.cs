using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
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
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Core;

public class VaccineEventService : IVaccineEventService
{
	private readonly IUnitOfWork _unitOfWork;
	private readonly IDistributedCache _cache;
	private readonly IHubContext<MyHub> _hubContext;
	private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10);

	public VaccineEventService(IUnitOfWork unitOfWork, IDistributedCache cache, IHubContext<MyHub> hubContext)
	{
		_unitOfWork = unitOfWork;
		_cache = cache;
		_hubContext = hubContext;
	}

	public async Task<PagingModel<ViewVaccineEventDTO>> GetAllVaccineEvents(VaccineEventQuery request)
	{
		//Get the data from cache if available, otherwise fetch from the database and cache it for future requests
		const string cacheKey = "all_vaccine_event";

		var cachedData = await _cache.GetStringAsync(cacheKey);
		if (cachedData != null)
		{
			var cachedVaccineEvent = JsonSerializer.Deserialize<List<ViewVaccineEventDTO>>(cachedData)!;
			var pagedData = await PagingExtension.ToPagingModel(
				FilterByUpcomingAndSortByLatestOccurredDate(cachedVaccineEvent, request), request.PageIndex, request.PageSize);
			return pagedData;
		}


		var repository = _unitOfWork.GetRepository<Vaccineevent>();
		IQueryable<Vaccineevent> incidents = await repository.GetQueryableAsync();

		List<ViewVaccineEventDTO> viewVaccineEvents = incidents.Select(i => new ViewVaccineEventDTO
		{
			Id = i.Id,
			Title = i.Title,
			DateOccurred = i.DateOccurred,
			DateSignupStart = i.DateSignupStart,
			DateSignupEnd = i.DateSignupEnd,
			Status = i.Status
		}).ToList();

		// Cache the data for future requests
		await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(viewVaccineEvents), new DistributedCacheEntryOptions
		{
			AbsoluteExpirationRelativeToNow = CacheDuration
		});

		var pagedResult = await PagingExtension.ToPagingModel(
			FilterByUpcomingAndSortByLatestOccurredDate(viewVaccineEvents, request), request.PageIndex, request.PageSize);

		return pagedResult;
	}

	private List<ViewVaccineEventDTO> FilterByUpcomingAndSortByLatestOccurredDate(List<ViewVaccineEventDTO> data, VaccineEventQuery request)
	{
		if(request.SortByLatestDateOccurred)
		{
			data = data.OrderByDescending(e => e.DateOccurred).ToList();
		}

		if(request.Status == EventStatus.Upcoming.ToString())
		{
			data = data.Where(e => e.Status == EventStatus.Upcoming.ToString()).ToList();
		}

		return data;
	}

	public async Task<int> CountUpcomingVaccineEvent()
	{

		var repository = _unitOfWork.GetRepository<Vaccineevent>();

		return await repository.GetQueryable()
			.Where(x => x.Status == EventStatus.Upcoming.ToString())
			.CountAsync();


	}

	public async Task<string> CreateVaccineEventAsync(VaccineEventCreateDTO dto)
	{
		await Task.Delay(100);

		var createdBy = await _unitOfWork.GetRepository<Account>().GetByIdAsync(dto.CreatedBy);
		if (createdBy == null)
		{
			throw new NotFoundException("Unable to find account for creating vaccine with their Id: " + createdBy.Id);
		}

		var vaccineEvent = new Vaccineevent
		{
			Id = Guid.NewGuid().ToString(),
			Title = dto.Title,
			ShortDescription = dto.ShortDescription,
			Content = dto.Content,
			DateOccurred = dto.DateOccurred,
			DateSignupStart = dto.DateSignupStart,
			DateSignupEnd = dto.DateSignupEnd,
			Status = EventStatus.Upcoming.ToString(),
			CreatedBy = createdBy.Id, // Assuming CreatedBy is a property in the create model

		};

		await _unitOfWork.GetRepository<Vaccineevent>().InsertAsync(vaccineEvent);
		await _unitOfWork.SaveAsync();
		return vaccineEvent.Id;
	}

	public async Task DeleteVaccineEvent(string vaccineEventId)
	{
		await Task.Delay(100);
		var vaccineEvent = _unitOfWork.GetRepository<Vaccineevent>().GetById(vaccineEventId);
		if (vaccineEvent == null)
		{
			throw new NotFoundException("Vaccine event", vaccineEventId);
		}
		_unitOfWork.GetRepository<Vaccineevent>().Delete(vaccineEvent);
		await _unitOfWork.SaveAsync(); // Ensure the save operation completes
		return;
	}

	public async Task<string> UpdateVaccineEvent(VaccineEventUpdateDTO dto, string vaccineEventId)
	{
		await Task.Delay(100);

		var createdBy = await _unitOfWork.GetRepository<Account>().GetByIdAsync(dto.CreatedBy);
		if (createdBy == null)
		{
			throw new NotFoundException("Unable to find account for updating vaccine with their Id: " + createdBy.Id);
		}

		var vaccineEvent = _unitOfWork.GetRepository<Vaccineevent>().GetById(vaccineEventId);
		if (vaccineEvent == null)
		{
			throw new NotFoundException("Vaccine Event", vaccineEventId);
		}

		vaccineEvent.Title = dto.Title;
		vaccineEvent.ShortDescription = dto.ShortDescription;
		vaccineEvent.Content = dto.Content;
		vaccineEvent.DateSignupStart = dto.DateSignupStart;
		vaccineEvent.DateSignupEnd = dto.DateSignupEnd;
		vaccineEvent.Status = dto.Status;
		vaccineEvent.CreatedBy = dto.CreatedBy;

		await _unitOfWork.GetRepository<Vaccineevent>().UpdateAsync(vaccineEvent);
		await _unitOfWork.SaveAsync();
		return vaccineEvent.Id;
	}

	public async Task<ViewVaccineEventDetailDTO> GetVaccineEventById(string vaccineEventId)
	{
		var repository = _unitOfWork.GetRepository<Vaccineevent>();
		var healthcheckupevent = await repository
			.GetQueryable()
			.Include(i => i.CreatedBy)
			.FirstOrDefaultAsync(i => i.Id == vaccineEventId);

		if (healthcheckupevent == null)
		{
			throw new NotFoundException("Vaccine Event", vaccineEventId);
		}

		return new ViewVaccineEventDetailDTO
		{
			Id = healthcheckupevent.Id,
			Title = healthcheckupevent.Title,
			DateSignupEnd = healthcheckupevent.DateSignupEnd,
			DateSignupStart = healthcheckupevent.DateSignupStart,
			CreatedBy = healthcheckupevent.CreatedBy,
			DateOccurred = healthcheckupevent.DateOccurred,
			Status = healthcheckupevent.Status
		};
	}
}
