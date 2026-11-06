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

	public VaccineEventService(IUnitOfWork unitOfWork, IHubContext<MyHub> hubContext)
	{
		_unitOfWork = unitOfWork;
		_hubContext = hubContext;
	}

	public async Task<PagingModel<ViewVaccineEventDTO>> GetAllVaccineEvents(VaccineEventQuery request)
	{
	
		var query = _unitOfWork.GetRepository<Vaccineevent>().GetQueryable();

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

		var repository = _unitOfWork.GetRepository<Vaccineevent>();

		return await repository.GetQueryable()
			.Where(x => x.Status == EventStatus.Upcoming.ToString())
			.CountAsync();


	}

	public async Task<string> CreateVaccineEventAsync(VaccineEventCreateDTO dto, string createdBy)
	{
		await Task.Delay(100);

		var resultCreatedBy = await _unitOfWork.GetRepository<Account>().GetByIdAsync(createdBy);
		if (resultCreatedBy == null)
		{
			throw new NotFoundException("Unable to find account for creating vaccine with their Id: " + createdBy);
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
			CreatedBy = createdBy, // Assuming CreatedBy is a property in the create model

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
			throw new NotFoundException("VaccineTitle event", vaccineEventId);
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
			throw new NotFoundException("VaccineTitle Event", vaccineEventId);
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
			throw new NotFoundException("VaccineTitle Event", vaccineEventId);
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
