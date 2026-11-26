using HealthNest_BusinessLogic.Interface;
using HealthNest_BusinessLogic.SignalRHubs;
using HealthNest_BusinessLogic.Utility;
using HealthNest_DAO.DTOModels;
using HealthNest_DAO.Entities;
using HealthNest_DAO.Enums;
using HealthNest_DAO.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Core;

public class VaccineEventService : IVaccineEventService
{
	private readonly IUnitOfWork _unitOfWork;
	private readonly IHubContext<MyHub> _hubContext;
	private readonly IGenericRepository<Vaccineevent> _vaccineRepository;

	public VaccineEventService(IUnitOfWork unitOfWork, IHubContext<MyHub> hubContext)
	{
		_unitOfWork = unitOfWork;
		_vaccineRepository = _unitOfWork.GetRepository<Vaccineevent>();
		_hubContext = hubContext;
	}

	public async Task<PagingModel<ViewVaccineEventDTO>> GetAllVaccineEvents(VaccineEventQuery request)
	{
	
		var query = _vaccineRepository.GetQueryable();

		if (!string.IsNullOrEmpty(request.Status))
		{
			query = query.Where(s=>s.Status == request.Status);
		}

		query = request.SortByLatestDateOccurred ? query.OrderByDescending(s => s.DateOccurred) : query.OrderBy(s => s.DateOccurred);

		int totalItems = await query.CountAsync();

		query = query.Skip((request.PageIndex - 1) * request.PageSize)
				.Take(request.PageSize);

		List<ViewVaccineEventDTO> viewVaccineEvents = await query.Select(i => new ViewVaccineEventDTO
		{
			Id = i.Id,
			Title = i.Title,
			DateOccurred = i.DateOccurred,
			DateSignupStart = i.DateSignupStart,
			DateSignupEnd = i.DateSignupEnd,
			Status = i.Status

		}).ToListAsync();



		var pagedResult =  PagingExtension.ToPagingModel(viewVaccineEvents, totalCount: totalItems, pageIndex: request.PageIndex, request.PageSize);

		return pagedResult;
	}

	

	public async Task<int> CountUpcomingVaccineEvent()
	{

		return await _vaccineRepository.GetQueryable()
			.Where(x => x.Status == EventStatus.Upcoming.ToString())
			.CountAsync();
	}

	public async Task<string> CreateVaccineEventAsync(VaccineEventCreateDTO dto, string createdBy)
	{

		var resultCreatedBy = await _unitOfWork.GetRepository<Account>().GetByIdAsync(createdBy);
		if (resultCreatedBy == null)
		{
			throw new NotFoundException("Unable to find account for creating vaccine event with their Id: " + createdBy);
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
			Status = EventStatus.Pending.ToString(),
			CreatedBy = createdBy, // Assuming CreatedBy is a property in the create model

		};

		await _vaccineRepository.InsertAsync(vaccineEvent);
		await _unitOfWork.SaveAsync();
		return vaccineEvent.Id;
	}

	public async Task DeleteVaccineEvent(string vaccineEventId)
	{
		var vaccineEvent = _vaccineRepository.GetById(vaccineEventId);
		if (vaccineEvent == null)
		{
			throw new NotFoundException("VaccineTitle event", vaccineEventId);
		}

		bool canCancel = false;
		if (Enum.TryParse<EventStatus>(vaccineEvent.Status, out EventStatus result))
		{
			//Can only cancel if the status is Completed, Cancelled or Pending
			canCancel =  result  == EventStatus.Pending || result == EventStatus.Completed || result == EventStatus.Cancelled;
		}
		else
		{
			throw new BadRequestException("Unable to get event status info from vaccine event data in database");
		}

		if (!canCancel)
		{
			throw new BadRequestException("Unable to delete request that have the following status: 'Ongoing','Completed','Cancelled'");
		}

		await _vaccineRepository.DeleteAsync(vaccineEvent);
		await _unitOfWork.SaveAsync(); // Ensure the save operation completes
		return;
	}

	public async Task CancelVaccineEvent(string vaccineEventId)
	{
		var vaccineEvent = _vaccineRepository.GetById(vaccineEventId);
		if (vaccineEvent == null)
		{
			throw new NotFoundException("VaccineTitle event", vaccineEventId);
		}

		bool canCancel = false;
		if(Enum.TryParse<EventStatus>(vaccineEvent.Status, out EventStatus result)){
			 canCancel = CanCancelVaccinEvent(result);
		}
		else
		{
			throw new BadRequestException("Unable to get event status info from vaccine event data in database");
		}

		if (!canCancel)
		{
			throw new BadRequestException("Unable to cancel request that have the following status: 'Ongoing','Completed','Cancelled'");
		}

		vaccineEvent.Status = EventStatus.Cancelled.ToString();
		await _vaccineRepository.UpdateAsync(vaccineEvent);
		await _unitOfWork.SaveAsync(); // Ensure the save operation completes
		return;
	}

	public async Task<string> UpdateVaccineEvent(VaccineEventUpdateDTO dto, string vaccineEventId)
	{

		var vaccineEvent = _vaccineRepository.GetById(vaccineEventId);
		if (vaccineEvent == null)
		{
			throw new NotFoundException("VaccineTitle Event", vaccineEventId);
		}

		
		// Validate if the status value is suitable for update
		var newStatus = ValidateEventStatus.ParseStatus(dto.Status);
		ValidateEventStatus.ValidateEventStatusTransition(vaccineEvent, newStatus, DateTime.Today);




		vaccineEvent.Title = dto.Title;
		vaccineEvent.ShortDescription = dto.ShortDescription;
		vaccineEvent.Content = dto.Content;
		vaccineEvent.DateSignupStart = dto.DateSignupStart;
		vaccineEvent.DateSignupEnd = dto.DateSignupEnd;
		vaccineEvent.Status = dto.Status;

		await _vaccineRepository.UpdateAsync(vaccineEvent);
		await _unitOfWork.SaveAsync();
		return vaccineEvent.Id;
	}

	public async Task<ViewVaccineEventDetailDTO> GetVaccineEventById(string vaccineEventId)
	{
		var vaccineEvent = await _vaccineRepository
			.GetQueryable()
			.Include(i => i.CreatedByNavigation)
			.FirstOrDefaultAsync(i => i.Id == vaccineEventId);

		if (vaccineEvent == null)
		{
			throw new NotFoundException("VaccineTitle Event", vaccineEventId);
		}

		return new ViewVaccineEventDetailDTO
		{
			Id = vaccineEvent.Id,
			Title = vaccineEvent.Title,
			DateSignupEnd = vaccineEvent.DateSignupEnd,
			DateSignupStart = vaccineEvent.DateSignupStart,
			CreatedBy = vaccineEvent.CreatedBy,
			DateOccurred = vaccineEvent.DateOccurred,
			Status = vaccineEvent.Status,
			Content = vaccineEvent.Content,
			ShortDescription = vaccineEvent.ShortDescription,
		};
	}

	public static bool CanCancelVaccinEvent(EventStatus status)
	{
		switch (status)
		{
			case EventStatus.Pending: return true;
			case EventStatus.Signup: return true;
			case EventStatus.Upcoming: return true;
			case EventStatus.Ongoing: return false;
			case EventStatus.Completed: return false;
			case EventStatus.Cancelled: return false;
			default: return false;
		}
	}

	
}
