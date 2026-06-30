using Microsoft.EntityFrameworkCore;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_BusinessLogic.Utility;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Enums;
using SchoolMedical_DataAccess.Interfaces;
using System.Linq.Expressions;

namespace SchoolMedical_BusinessLogic.Core
{
	public class MedicineRequestService : IMedicineRequestService
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly IGenericRepository<Medicinerequest> _medicineRequestRepository;

		public MedicineRequestService(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_medicineRequestRepository = _unitOfWork.GetRepository<Medicinerequest>();
		}

		public async Task<PagingModel<MedicineRequestResponseDto>> GetMedicineRequestsAsync(MedicineRequestFilterRequestDto request)
		{
			IQueryable<Medicinerequest> query = _medicineRequestRepository
				.Include(mr => mr.RequestByNavigation)
				.Include(mr => mr.ForStudentNavigation);

			// Apply filters
			if (!string.IsNullOrEmpty(request.RequestBy))
			{
				query = query.Where(mr => mr.RequestBy == request.RequestBy);
			}

			if (!string.IsNullOrEmpty(request.ForStudent))
			{
				query = query.Where(mr => mr.ForStudent == request.ForStudent);
			}

			if (request.DateFrom.HasValue)
			{
				query = query.Where(mr => mr.DateSent >= request.DateFrom.Value);
			}

			if (request.DateTo.HasValue)
			{
				query = query.Where(mr => mr.DateSent <= request.DateTo.Value);
			}

			if (request.Status.HasValue)
			{
				query = query.Where(mr => mr.Status == request.Status.Value.ToString());
			}


			// Apply sorting
			query = ApplySorting(query, request.SortBy, request.IsDescending);

			/*
            // Get total count
            var totalCount = await query.CountAsync();

            // Apply paging
            var medicineRequests = await query
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(mr => new MedicineRequestResponseDto
                {
                    Id = mr.Id,
                    RequestBy = mr.RequestBy,
                    RequestByName = mr.RequestByNavigation.FullName ?? "Unknown",
                    ForStudent = mr.ForStudent,
                    ForStudentName = mr.ForStudentNavigation.FullName ?? "Unknown",
                    Description = mr.Description,
                    DateSent = mr.DateSent
                })
                .ToListAsync();

            return new PagingModel<MedicineRequestResponseDto>
            {
                PageIndex = request.PageIndex,
                PageSize = request.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / request.PageSize),
                Data = medicineRequests
            };
            */

			var response = query.Select(mr => new MedicineRequestResponseDto
			{
				Id = mr.Id,
				RequestBy = mr.RequestBy,
				RequestByName = mr.RequestByNavigation.FullName ?? "Unknown",
				ForStudent = mr.ForStudent,
				ForStudentName = mr.ForStudentNavigation.FullName ?? "Unknown",
				Description = mr.Description,
				DateSent = mr.DateSent,
				Status= mr.Status
			});


			var pagedData = await PagingExtension.ToPagingModel(response, request.PageIndex, request.PageSize);

			return pagedData;
		}

		public async Task<MedicineRequestResponseDto?> GetMedicineRequestByIdAsync(string id)
		{
			var medicineRequest = await _medicineRequestRepository
				.Include(mr => mr.RequestByNavigation)
				.Include(mr => mr.ForStudentNavigation)
				.Where(mr => mr.Id == id)
				.Select(mr => new MedicineRequestResponseDto
				{
					Id = mr.Id,
					RequestBy = mr.RequestBy,
					RequestByName = mr.RequestByNavigation.FullName ?? "Unknown",
					ForStudent = mr.ForStudent,
					ForStudentName = mr.ForStudentNavigation.FullName ?? "Unknown",
					Description = mr.Description,
					DateSent = mr.DateSent,
					Status = mr.Status
				})
				.FirstOrDefaultAsync();

			return medicineRequest;
		}

		public async Task<MedicineRequestResponseDto> CreateMedicineRequestAsync(CreateMedicineRequestRequestDto request)
		{
			try
			{
				_unitOfWork.BeginTransaction();

				// Validate that RequestBy and ForStudent exist
				var requester = await _unitOfWork.GetRepository<Account>().GetByIdAsync(request.RequestBy);
				var student = await _unitOfWork.GetRepository<Account>().GetByIdAsync(request.ForStudent);

				if (requester == null)
				{
					throw new KeyNotFoundException("Requester not found");
				}

				if (student == null)
				{
					throw new KeyNotFoundException("Student not found");
				}

				var medicineRequest = new Medicinerequest
				{
					Id = Guid.NewGuid().ToString(),
					RequestBy = request.RequestBy,
					ForStudent = request.ForStudent,
					Description = request.Description,
					DateSent = DateTime.Now,
					Status = RequestStatus.Pending.ToString()
				};

				await _medicineRequestRepository.InsertAsync(medicineRequest);
				await _unitOfWork.SaveAsync();

				_unitOfWork.CommitTransaction();

				// Reload with navigation properties
				var createdRequest = await _medicineRequestRepository
					.Include(mr => mr.RequestByNavigation)
					.Include(mr => mr.ForStudentNavigation)
					.FirstOrDefaultAsync(mr => mr.Id == medicineRequest.Id);

				return new MedicineRequestResponseDto
				{
					Id = createdRequest.Id,
					RequestBy = createdRequest.RequestBy,
					RequestByName = createdRequest.RequestByNavigation?.FullName ?? "Unknown",
					ForStudent = createdRequest.ForStudent,
					ForStudentName = createdRequest.ForStudentNavigation?.FullName ?? "Unknown",
					Description = createdRequest.Description,
					DateSent = createdRequest.DateSent,
					Status = createdRequest.Status
				};
			}
			catch(Exception e)
			{
				_unitOfWork.RollBack();
				Console.WriteLine($"Error creating medicine request: {e.Message}");
				return null;
			}
		}

		public async Task<MedicineRequestResponseDto> UpdateMedicineRequestAsync(UpdateMedicineRequestRequestDto request, string id)
		{
			try
			{
				_unitOfWork.BeginTransaction();

				var medicineRequest = await _medicineRequestRepository.GetByIdAsync(id);
				if (medicineRequest == null)
				{
					throw new KeyNotFoundException("Medicine request not found");
				}

				// Validate that RequestBy and ForStudent exist
				var requester = await _unitOfWork.GetRepository<Account>().GetByIdAsync(request.RequestBy);
				var student = await _unitOfWork.GetRepository<Account>().GetByIdAsync(request.ForStudent);

				if (requester == null)
				{
					throw new KeyNotFoundException("Requester not found");
				}

				if (student == null)
				{
					throw new KeyNotFoundException("Student not found");
				}

				medicineRequest.RequestBy = request.RequestBy;
				medicineRequest.ForStudent = request.ForStudent;
				medicineRequest.Description = request.Description;
				
				if (request.Status.HasValue)
				{
					medicineRequest.Status = request.Status.Value.ToString();
				}
				// Note: DateSent is not updated to preserve original request time

				await _medicineRequestRepository.UpdateAsync(medicineRequest);
				await _unitOfWork.SaveAsync();

				_unitOfWork.CommitTransaction();

				// Reload with navigation properties
				var updatedRequest = await _medicineRequestRepository
					.Include(mr => mr.RequestByNavigation)
					.Include(mr => mr.ForStudentNavigation)
					.FirstOrDefaultAsync(mr => mr.Id == medicineRequest.Id);

				return new MedicineRequestResponseDto
				{
					Id = updatedRequest.Id,
					RequestBy = updatedRequest.RequestBy,
					RequestByName = updatedRequest.RequestByNavigation?.FullName ?? "Unknown",
					ForStudent = updatedRequest.ForStudent,
					ForStudentName = updatedRequest.ForStudentNavigation?.FullName ?? "Unknown",
					Description = updatedRequest.Description,
					DateSent = updatedRequest.DateSent,
					Status = updatedRequest.Status
				};
			}
			catch
			{
				_unitOfWork.RollBack();
				throw;
			}
		}

		public async Task<bool> DeleteMedicineRequestAsync(string id)
		{
			try
			{
				_unitOfWork.BeginTransaction();

				var medicineRequest = await _medicineRequestRepository.GetByIdAsync(id);
				if (medicineRequest == null)
				{
					return false;
				}

				medicineRequest.Status = RequestStatus.Deleted.ToString();
				await _medicineRequestRepository.UpdateAsync(medicineRequest);
				await _unitOfWork.SaveAsync();

				_unitOfWork.CommitTransaction();
				return true;
			}
			catch
			{
				_unitOfWork.RollBack();
				throw;
			}
		}

		public async Task<PagingModel<MedicineRequestResponseDto>> GetMedicineRequestsByStudentAsync(string studentId, int pageIndex = 1, int pageSize = 5)
		{
			var query = _medicineRequestRepository
				.Include(mr => mr.RequestByNavigation)
				.Include(mr => mr.ForStudentNavigation)
				.Where(mr => mr.ForStudent == studentId)
				.OrderByDescending(mr => mr.DateSent)
				.Select(mr => new MedicineRequestResponseDto
				{
					Id = mr.Id,
					RequestBy = mr.RequestBy,
					RequestByName = mr.RequestByNavigation.FullName ?? "Unknown",
					ForStudent = mr.ForStudent,
					ForStudentName = mr.ForStudentNavigation.FullName ?? "Unknown",
					Description = mr.Description,
					DateSent = mr.DateSent,
					Status = mr.Status
				});

			var pagedResult = await PagingExtension.ToPagingModel(query, pageIndex, pageSize);
			return pagedResult;
		}

		public async Task<PagingModel<MedicineRequestResponseDto>> GetMedicineRequestsByRequesterAsync(string requesterId, int pageIndex = 1, int pageSize = 5)
		{
			var query = _medicineRequestRepository
				.Include(mr => mr.RequestByNavigation)
				.Include(mr => mr.ForStudentNavigation)
				.Where(mr => mr.RequestBy == requesterId)
				.OrderByDescending(mr => mr.DateSent)
				.Select(mr => new MedicineRequestResponseDto
				{
					Id = mr.Id,
					RequestBy = mr.RequestBy,
					RequestByName = mr.RequestByNavigation.FullName ?? "Unknown",
					ForStudent = mr.ForStudent,
					ForStudentName = mr.ForStudentNavigation.FullName ?? "Unknown",
					Description = mr.Description,
					DateSent = mr.DateSent,
					Status = mr.Status
				});

			var pagedResult = await PagingExtension.ToPagingModel(query, pageIndex, pageSize);
			return pagedResult;
		}

		private IQueryable<Medicinerequest> ApplySorting(IQueryable<Medicinerequest> query, string? sortBy, bool isDescending)
		{
			if (string.IsNullOrEmpty(sortBy))
				sortBy = "DateSent";

			Expression<Func<Medicinerequest, object>> keySelector = sortBy.ToLower() switch
			{
				"datesent" => mr => mr.DateSent,
				"requestby" => mr => mr.RequestBy,
				"forstudent" => mr => mr.ForStudent,
				_ => mr => mr.DateSent
			};

			return isDescending
				? query.OrderByDescending(keySelector)
				: query.OrderBy(keySelector);
		}
	}
}
