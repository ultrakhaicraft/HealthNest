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

namespace SchoolMedical_BusinessLogic.Core
{
	public class HealthCheckupEventService : IHealthCheckupEventService
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly IDistributedCache _cache;
		private readonly IHubContext<MyHub> _hubContext;
		private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10);

		public HealthCheckupEventService(IUnitOfWork unitOfWork, IDistributedCache cache, IHubContext<MyHub> hubContext)
		{
			_unitOfWork = unitOfWork;
			_cache = cache;
			_hubContext = hubContext;
		}

		public async Task<PagingModel<ViewHealthCheckupEventDTO>> GetAllHealthCheckupEvent(HealthCheckupEventQuery request)
		{
			//Get the data from cache if available, otherwise fetch from the database and cache it for future requests
			const string cacheKey = "all_health_checkup_event";

			var cachedData = await _cache.GetStringAsync(cacheKey);
			if (cachedData != null)
			{
				var cachedHealthCheckupEvent = JsonSerializer.Deserialize<List<ViewHealthCheckupEventDTO>>(cachedData)!;
				var pagedData = await PagingExtension.ToPagingModel(
					FilterByUpcomingAndSortByLatestOccurredDate(cachedHealthCheckupEvent, request), request.PageIndex, request.PageSize);
				return pagedData;
			}


			var repository = _unitOfWork.GetRepository<Healthcheckupevent>();
			IQueryable<Healthcheckupevent> incidents = await repository.GetQueryableAsync();

			List<ViewHealthCheckupEventDTO> viewHealthCheckupEvents = incidents.Select(i => new ViewHealthCheckupEventDTO
			{
				Id = i.Id,
				Title=i.Title,
				DateOccurred = i.DateOccurred,
				DateSignupStart = i.DateSignupStart,
				DateSignupEnd = i.DateSignupEnd,
				Status = i.Status
			}).ToList();

			// Cache the data for future requests
			await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(viewHealthCheckupEvents), new DistributedCacheEntryOptions
			{
				AbsoluteExpirationRelativeToNow = CacheDuration
			});

			var pagedResult = await PagingExtension.ToPagingModel(
				FilterByUpcomingAndSortByLatestOccurredDate(viewHealthCheckupEvents, request), request.PageIndex, request.PageSize);

			return pagedResult;
		}

		private List<ViewHealthCheckupEventDTO> FilterByUpcomingAndSortByLatestOccurredDate(List<ViewHealthCheckupEventDTO> data, HealthCheckupEventQuery request)
		{
			if (request.SortByLatestDateOccurred)
			{
				data = data.OrderByDescending(e => e.DateOccurred).ToList();
			}

			if (request.Status == EventStatus.Upcoming.ToString())
			{
				data = data.Where(e => e.Status == EventStatus.Upcoming.ToString()).ToList();
			}

			return data;
		}

		public async Task<int> CountUpcomingHealthCheckup()
		{

			var repository = _unitOfWork.GetRepository<Healthcheckupevent>();

			return await repository.GetQueryable()
				.Where(x => x.Status == EventStatus.Upcoming.ToString())
				.CountAsync();


		}
	}
}
