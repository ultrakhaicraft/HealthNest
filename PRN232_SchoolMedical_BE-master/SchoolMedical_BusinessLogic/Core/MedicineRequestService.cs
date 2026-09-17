using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
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

		//Create an "Apply Filter" function
		public async Task<PagingModel<MedicineRequestResponseDto>> GetMedicineRequestsAsync(MedicineRequestFilterRequestDto request)
		{
			IQueryable<Medicinerequest> query = _medicineRequestRepository
				.Include(mr => mr.RequestByNavigation)
				.Include(mr => mr.ForStudentNavigation);

			// Apply filters
			query= ApplyFilter(query,request);


			// Apply sorting
			query = ApplySorting(query, request.SortByDateSentByDesc);


			var response = query.Select(mr => new MedicineRequestResponseDto
			{
				Id = mr.Id,
				RequestBy = mr.RequestBy,
				RequestByName = mr.RequestByNavigation.Account.FullName ?? "Unknown",
				ForStudent = mr.ForStudent,
				ForStudentName = mr.ForStudentNavigation.Account.FullName ?? "Unknown",
				Description = mr.Description,
				DateSent = mr.DateSent,
				Status= mr.Status
			});

			if (query == null)
			{
				throw new NotFoundException("Unable to found Medicine Request with given filters");
			}

			var pagedData = await PagingExtension.ToPagingModel(response, request.PageIndex, request.PageSize);

			return pagedData;
		}

		public async Task<MedicineRequestResponseDto> GetMedicineRequestByIdAsync(string id)
		{
			var medicineRequest = await _medicineRequestRepository
				.Include(mr => mr.RequestByNavigation)
				.Include(mr => mr.ForStudentNavigation)
				.Where(mr => mr.Id == id)
				.Select(mr => new MedicineRequestResponseDto
				{
					Id = mr.Id,
					RequestBy = mr.RequestBy,
					RequestByName = mr.RequestByNavigation.Account.FullName ?? "Unknown",
					ForStudent = mr.ForStudent,
					ForStudentName = mr.ForStudentNavigation.Account.FullName ?? "Unknown",
					Description = mr.Description,
					DateSent = mr.DateSent,
					Status = mr.Status
				})
				.FirstOrDefaultAsync();

			if (medicineRequest == null)
			{
				throw new NotFoundException("Medicine Request", id);
			}

			return medicineRequest;
		}

		
		public async Task<MedicineRequestResponseDto> CreateMedicineRequestAsync(CreateMedicineRequestRequestDto request)
		{
			
				// Validate that RequestBy and ForStudent exist
				var requester = await _unitOfWork.GetRepository<Account>().GetByIdAsync(request.RequestBy);
				var student = await _unitOfWork.GetRepository<Account>().GetByIdAsync(request.ForStudent);

				if (requester == null)
				{
					throw new NotFoundException("Requester not found");
				}

				if (student == null)
				{
					throw new NotFoundException("Student not found");
				}

				if (student.Student.ParentId != request.RequestBy || student.Student.ParentId == null)
				{
					throw new BadRequestException(
						"This student isn't your children/kids, please pick the child that has parentId as your account id");
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

				// Reload with navigation properties
				var createdRequest = await _medicineRequestRepository
					.Include(mr => mr.RequestByNavigation)
					.Include(mr => mr.ForStudentNavigation)
					.FirstOrDefaultAsync(mr => mr.Id == medicineRequest.Id);

				return new MedicineRequestResponseDto
				{
					Id = createdRequest.Id,
					RequestBy = createdRequest.RequestBy,
					RequestByName = createdRequest.RequestByNavigation?.Account.FullName ?? "Unknown",
					ForStudent = createdRequest.ForStudent,
					ForStudentName = createdRequest.ForStudentNavigation?.Account.FullName ?? "Unknown",
					Description = createdRequest.Description,
					DateSent = createdRequest.DateSent,
					Status = createdRequest.Status
				};
		}
			
		

		public async Task<MedicineRequestResponseDto> UpdateMedicineRequestAsync(UpdateMedicineRequestRequestDto request, string id)
		{
			

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

				if (student.Student.ParentId != request.RequestBy || student.Student.ParentId == null)
				{
					throw new BadRequestException(
						"This student isn't your children/kids, please pick the child that has parentId as your account id");
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


				// Reload with navigation properties
				var updatedRequest = await _medicineRequestRepository
					.Include(mr => mr.RequestByNavigation)
					.Include(mr => mr.ForStudentNavigation)
					.FirstOrDefaultAsync(mr => mr.Id == medicineRequest.Id);

				return new MedicineRequestResponseDto
				{
					Id = updatedRequest.Id,
					RequestBy = updatedRequest.RequestBy,
					RequestByName = updatedRequest.RequestByNavigation?.Account.FullName ?? "Unknown",
					ForStudent = updatedRequest.ForStudent,
					ForStudentName = updatedRequest.ForStudentNavigation?.Account.FullName ?? "Unknown",
					Description = updatedRequest.Description,
					DateSent = updatedRequest.DateSent,
					Status = updatedRequest.Status
				};
			
		}

		public async Task DeleteMedicineRequestAsync(string id)
		{
			
				_unitOfWork.BeginTransaction();

				var medicineRequest = await _medicineRequestRepository.GetByIdAsync(id);
				if (medicineRequest == null)
				{
					throw new NotFoundException("Medicine Request", id);
				}

				medicineRequest.Status = RequestStatus.Deleted.ToString();
				await _medicineRequestRepository.UpdateAsync(medicineRequest);
				await _unitOfWork.SaveAsync();

				_unitOfWork.CommitTransaction();
				
		}

		public async Task<PagingModel<MedicineRequestResponseDto>> GetMedicineRequestsByStudentAsync(string studentId, MedicineRequestFilterRequestDto request)
		{
			IQueryable<Medicinerequest> query = _medicineRequestRepository
				.Include(mr => mr.RequestByNavigation)
				.Include(mr => mr.ForStudentNavigation)
				.Where(mr => mr.ForStudent == studentId);

			// Apply filters
			query = ApplyFilter(query, request);


			// Apply sorting
			query = ApplySorting(query, request.SortByDateSentByDesc);

			var response = query.Select(mr => new MedicineRequestResponseDto
			{
				Id = mr.Id,
				RequestBy = mr.RequestBy,
				RequestByName = mr.RequestByNavigation.Account.FullName ?? "Unknown",
				ForStudent = mr.ForStudent,
				ForStudentName = mr.ForStudentNavigation.Account.FullName ?? "Unknown",
				Description = mr.Description,
				DateSent = mr.DateSent,
				Status = mr.Status
			});

			if (query == null)
			{
				throw new NotFoundException("Unable to found Medicine Request with given filters by Student Id: " + studentId);
			}

			var pagedData = await PagingExtension.ToPagingModel(response, request.PageIndex, request.PageSize);

			return pagedData;
		}

		/// <summary>
		/// Get Medicine Request created by Requester (Parent)
		/// </summary>
		/// <param name="requesterId"></param>
		/// <param name="pageIndex"></param>
		/// <param name="pageSize"></param>
		/// <returns></returns>
		public async Task<PagingModel<MedicineRequestResponseDto>> GetMedicineRequestsByRequesterAsync(string requesterId, MedicineRequestFilterRequestDto request)
		{
			IQueryable<Medicinerequest> query = _medicineRequestRepository
				.Include(mr => mr.RequestByNavigation)
				.Include(mr => mr.ForStudentNavigation)
				.Where(mr=>mr.RequestBy==requesterId);

			// Apply filters
			query = ApplyFilter(query, request);


			// Apply sorting
			query = ApplySorting(query, request.SortByDateSentByDesc);

			var response = query.Select(mr => new MedicineRequestResponseDto
			{
				Id = mr.Id,
				RequestBy = mr.RequestBy,
				RequestByName = mr.RequestByNavigation.Account.FullName ?? "Unknown",
				ForStudent = mr.ForStudent,
				ForStudentName = mr.ForStudentNavigation.Account.FullName ?? "Unknown",
				Description = mr.Description,
				DateSent = mr.DateSent,
				Status = mr.Status
			});

			if (query == null)
			{
				throw new NotFoundException("Unable to found Medicine Request with given filters by Requester Id: "+requesterId);
			}

			var pagedData = await PagingExtension.ToPagingModel(response, request.PageIndex, request.PageSize);

			return pagedData;
		}

		private IQueryable<Medicinerequest> ApplySorting(IQueryable<Medicinerequest> query, bool SortByDateSentByDesc)
		{

			return SortByDateSentByDesc
				? query.OrderByDescending(m => m.DateSent)
				: query.OrderBy(m => m.DateSent);
		}

		

		private IQueryable<Medicinerequest> ApplyFilter(IQueryable<Medicinerequest> query, MedicineRequestFilterRequestDto request)
		{
			//Important filter: Filter Deleted Medicine Request out
			query = query.Where(mr => mr.Status != RequestStatus.Deleted.ToString());

			// Apply filters search by name and availability
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

			return query;

		}

		//Used later
		private IQueryable<Medicinerequest> ApplySortingAdvance(IQueryable<Medicinerequest> query, string? sortBy, bool isDescending)
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

		public async Task<int> CountPendingMedicineRequest()
		{
			var repository = _unitOfWork.GetRepository<Medicinerequest>();

			return await repository.GetQueryable()
				.Where(x => x.Status == RequestStatus.Pending.ToString())
				.CountAsync();

		}
	}
}
