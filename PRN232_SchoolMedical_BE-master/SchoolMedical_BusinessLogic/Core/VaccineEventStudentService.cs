using HealthNest_BusinessLogic.Interface;
using HealthNest_BusinessLogic.Utility;
using HealthNest_DAO.DTOModels;
using HealthNest_DAO.Entities;
using HealthNest_DAO.Enums;
using HealthNest_DAO.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Core;

public class VaccineEventStudentService : IVaccineEventStudentService
{
	private readonly IUnitOfWork _unitOfWork;
	private readonly IGenericRepository<VaccineeventStudent> _vaccineEventStudentRepository;
	private readonly IGenericRepository<Vaccineevent> _vaccineEventRepository;

	public VaccineEventStudentService(IUnitOfWork unitOfWork )
	{
		_unitOfWork = unitOfWork;
		_vaccineEventStudentRepository = _unitOfWork.GetRepository<VaccineeventStudent>();
		_vaccineEventRepository = _unitOfWork.GetRepository<Vaccineevent>();
	}


	#region Find Vaccine Event Participant
	public async Task<PagingModel<ViewVaccineEventStudentModel>> FindVaccineEventStudentByEventId(string eventId, VaccineEventStudentQuery request)
	{
		var query = _vaccineEventStudentRepository.GetQueryable().Where(x => x.VaccineeventId == eventId);

		if (!string.IsNullOrEmpty(request.ParticipantStatus))
		{
			query = query.Where(s => s.Status == request.ParticipantStatus);
		}

		query = request.SortByDateSignUp ? query.OrderByDescending(s => s.SignupDate) : query.OrderBy(s => s.SignupDate);

		int totalItems = await query.CountAsync();

		query = query.Skip((request.PageIndex - 1) * request.PageSize)
				.Take(request.PageSize);

		List<ViewVaccineEventStudentModel> viewData = await query.Select(i => new ViewVaccineEventStudentModel
		{
			SignUpId = i.SignUpId,
			VaccineeventId = i.VaccineeventId,
			StudentId = i.StudentId,
			SignupDate = i.SignupDate,
			Status = i.Status

		}).ToListAsync();



		var pagedResult = PagingExtension.ToPagingModel(viewData, totalCount: totalItems, pageIndex: request.PageIndex, request.PageSize);

		return pagedResult;
	}

	public async Task<PagingModel<ViewVaccineEventStudentModel>> FindVaccineEventStudentByParentId(string parentId, VaccineEventStudentQuery request)
	{
		var query = _vaccineEventStudentRepository.GetQueryable().Where(x => x.RegisteredByParent == parentId);

		if (!string.IsNullOrEmpty(request.ParticipantStatus))
		{
			query = query.Where(s => s.Status == request.ParticipantStatus);
		}

		query = request.SortByDateSignUp ? query.OrderByDescending(s => s.SignupDate) : query.OrderBy(s => s.SignupDate);

		int totalItems = await query.CountAsync();

		query = query.Skip((request.PageIndex - 1) * request.PageSize)
				.Take(request.PageSize);

		List<ViewVaccineEventStudentModel> viewData = await query.Select(i => new ViewVaccineEventStudentModel
		{
			SignUpId = i.SignUpId,

			VaccineeventId = i.VaccineeventId,
			StudentId = i.StudentId,
			SignupDate = i.SignupDate,
			Status = i.Status

		}).ToListAsync();



		var pagedResult = PagingExtension.ToPagingModel(viewData, totalCount: totalItems, pageIndex: request.PageIndex, request.PageSize);

		return pagedResult;
	}

	public async Task<PagingModel<ViewVaccineEventStudentModel>> FindVaccineEventStudentByStudentId(string studentId, VaccineEventStudentQuery request)
	{
		var query = _vaccineEventStudentRepository.GetQueryable().Where(x => x.StudentId == studentId);

		if (!string.IsNullOrEmpty(request.ParticipantStatus))
		{
			query = query.Where(s => s.Status == request.ParticipantStatus);
		}

		query = request.SortByDateSignUp ? query.OrderByDescending(s => s.SignupDate) : query.OrderBy(s => s.SignupDate);

		int totalItems = await query.CountAsync();

		query = query.Skip((request.PageIndex - 1) * request.PageSize)
				.Take(request.PageSize);

		List<ViewVaccineEventStudentModel> viewData = await query.Select(i => new ViewVaccineEventStudentModel
		{
			SignUpId = i.SignUpId,
			VaccineeventId = i.VaccineeventId,
			StudentId = i.StudentId,
			SignupDate = i.SignupDate,
			Status = i.Status

		}).ToListAsync();



		var pagedResult = PagingExtension.ToPagingModel(viewData, totalCount: totalItems, pageIndex: request.PageIndex, request.PageSize);

		return pagedResult;
	}

	public async Task<ViewVaccineEventStudentDetailModel> ViewVaccineEventStudentDetail(string studentId, string vaccineEventId)
	{
		var detail = await _vaccineEventStudentRepository.GetQueryable()
	   .Where(x => x.VaccineeventId == vaccineEventId && x.StudentId == studentId)
	   .Select(x => new ViewVaccineEventStudentDetailModel
	   {
		   SignUpId = x.SignUpId,
		   VaccineeventId = x.VaccineeventId,
		   StudentId = x.StudentId,
		   StudentName = x.Student.Account.FullName,
		   CheckedBy = x.CheckedBy,
		   CheckedByName = x.Nurse.Account.FullName ?? "N/A",
		   RegisteredByParent = x.RegisteredByParent,
		   Note = x.Note,
		   Status = x.Status,
		   ResultSummary = x.ResultSummary,
		   SignupDate = x.SignupDate,
		   UpdatedAt = x.UpdatedAt
	   })
	   .FirstOrDefaultAsync();

		if (detail == null)
			throw new NotFoundException(
				$"Can't find vaccine participant data with student Id: {studentId} and vaccine event id: {vaccineEventId}");

		return detail;
	}

	#endregion

	#region Vaccine Event Update and Create

	/// <summary>
	/// Remove student from vaccine event by rejection
	/// </summary>
	/// <param name="vaccineEventId"></param>
	/// <param name="studentId"></param>
	/// <returns></returns>
	/// <exception cref="NotFoundException"></exception>
	/// <exception cref="BadRequestException"></exception>

	public async Task SignUpStudentAsync(CreateVaccineEventStudentModel request, string parentId)
	{
		var query = _vaccineEventStudentRepository.GetQueryable();
		//Check for event
		Vaccineevent ev = _vaccineEventRepository.GetById(request.VaccineEventId)
		?? throw new NotFoundException("Vaccine Event", request.VaccineEventId);

		//Check if student exist and belong to the caller
		Student student = _unitOfWork.GetRepository<Student>().Find(s => s.Id == request.StudentId)
		?? throw new NotFoundException("Student", request.StudentId);
		if (student.ParentId != parentId)
			throw new BadRequestException("You can only sign up your own child.");

		//Check for sign up period
		if ((!Enum.TryParse<EventStatus>(ev.Status, true, out var pendingEvent) || pendingEvent == EventStatus.Pending))
		{
			throw new BadRequestException("Sign-up has not yet opened. Please wait for sign up date");
		}

		//Check for Signup Period
		if (!Enum.TryParse<EventStatus>(ev.Status, true, out var evStatus) || evStatus != EventStatus.Signup
	   || ev.DateSignupEnd is not { } end || DateTime.Now > end)
			throw new BadRequestException("Sign-up has closed. Please contact the school nurse to cancel.");


		//Check for duplicate, If there is exist one Approve  or Complete Status, there is a duplicate
		//Parent can only re sign up if the status is cancel, this action will update the status back to Pending and note but keep
		//signUpId, studentId and vaccine event Id (Basically update the entity, not creating new one due to unique key rule)
		var exisitingSignUp = await query.Where(s => s.StudentId == request.StudentId && s.VaccineeventId == request.VaccineEventId)
			.FirstOrDefaultAsync();




		if (exisitingSignUp!=null)
		{
			if (exisitingSignUp.Status != AttentdanceStatus.Cancelled.ToString())
			{
				throw new BadRequestException($"There is a duplicate vaccine participant data with student Id: {request.StudentId} and vaccine event id: {request.VaccineEventId}. Re sign up is" +
				$"only allowed if the sign up status of the participant is cancelled");
			}

			exisitingSignUp.Note = request.Note;
			exisitingSignUp.SignupDate = DateTime.Now;
			exisitingSignUp.UpdatedAt = DateTime.Now;
			exisitingSignUp.Status = AttentdanceStatus.Pending.ToString();
		}
		else
		{
			VaccineeventStudent vaccineeventStudent = new VaccineeventStudent
			{
				SignUpId = new Guid().ToString(),
				StudentId = request.StudentId,
				VaccineeventId = request.VaccineEventId,
				Note = request.Note,
				RegisteredByParent = parentId,
				SignupDate = DateTime.Now,
				UpdatedAt = DateTime.Now,
				Status = AttentdanceStatus.Pending.ToString(),
			};

			await _vaccineEventStudentRepository.InsertAsync(vaccineeventStudent);
		}


		await _unitOfWork.SaveAsync();
	}

	public async Task RejectStudentFromVaccineEventAsync(string vaccineEventId, string studentId, string checkedById)
	{
		var eventParticipant = await _vaccineEventStudentRepository.GetQueryable()
			.Where(s => s.VaccineeventId == vaccineEventId && s.StudentId == studentId)
			.FirstOrDefaultAsync();

		if (eventParticipant == null)
		{
			throw new NotFoundException($"Can't found this vaccine participant data with student Id: {studentId} and vaccine event id: {vaccineEventId}");
		}

		// Validate if the status value is suitable for update
		var newStatus = ValidateAttendantStatus.ParseStatus(AttentdanceStatus.Rejected.ToString());
		ValidateAttendantStatus.ValidateEventStatusTransition(eventParticipant, newStatus);


		eventParticipant.Status = AttentdanceStatus.Rejected.ToString();
		eventParticipant.CheckedBy = checkedById;
		eventParticipant.UpdatedAt = DateTime.Now;


		await _vaccineEventStudentRepository.UpdateAsync(eventParticipant);
		await _unitOfWork.SaveAsync();

	}

	public async Task ApproveStudentToVaccineEventAsync(string vaccineEventId, string studentId, string checkedById)
	{
		var eventParticipant = await _vaccineEventStudentRepository.GetQueryable()
							.Where(s => s.VaccineeventId == vaccineEventId && s.StudentId == studentId)
							.FirstOrDefaultAsync();

		if (eventParticipant == null)
		{
			throw new NotFoundException($"Can't found this vaccine participant data with student Id: {studentId} and vaccine event id: {vaccineEventId}");
		}

		// Validate if the status value is suitable for update
		var newStatus = ValidateAttendantStatus.ParseStatus(AttentdanceStatus.Approved.ToString());
		ValidateAttendantStatus.ValidateEventStatusTransition(eventParticipant, newStatus);

		//Note: Vaccine Event and Student Id are excluded from update
		eventParticipant.Status = AttentdanceStatus.Approved.ToString();
		eventParticipant.CheckedBy = checkedById;
		eventParticipant.UpdatedAt = DateTime.Now;


		await _vaccineEventStudentRepository.UpdateAsync(eventParticipant);
		await _unitOfWork.SaveAsync();
	}

	public async Task CancelSignUp(string vaccineEventId, string studentId)
	{
		//Check for event
		Vaccineevent ev = _vaccineEventRepository.GetById(vaccineEventId)
		?? throw new NotFoundException("Vaccine Event", vaccineEventId);


		var eventParticipant = await _vaccineEventStudentRepository.GetQueryable()
									.Where(s => s.VaccineeventId == vaccineEventId && s.StudentId == studentId)
									.FirstOrDefaultAsync();

		if (eventParticipant == null)
		{
			throw new NotFoundException($"Can't found this vaccine participant data with student Id: {studentId} and vaccine event id: {vaccineEventId}");
		}

		//Check for Signup Period
		if (!Enum.TryParse<EventStatus>(ev.Status, true, out var evStatus) || evStatus != EventStatus.Signup
	   || ev.DateSignupEnd is not { } end || DateTime.Now > end)
			throw new BadRequestException("Sign-up has closed. Please contact the school nurse to cancel.");

		// Validate if the status value is suitable for update
		var newStatus = ValidateAttendantStatus.ParseStatus(AttentdanceStatus.Cancelled.ToString());
		ValidateAttendantStatus.ValidateEventStatusTransition(eventParticipant, newStatus);

		//Note: Vaccine Event and Student Id are excluded from update
		eventParticipant.Status = AttentdanceStatus.Cancelled.ToString();
		eventParticipant.UpdatedAt = DateTime.Now;


		await _vaccineEventStudentRepository.UpdateAsync(eventParticipant);
		await _unitOfWork.SaveAsync();
	}

	public async Task CompleteStudentVaccineEventAsync(string eventId, string studentId, string checkById, string ResultSummary)
	{
		var eventParticipant = await _vaccineEventStudentRepository.GetQueryable()
									.Where(s => s.VaccineeventId == eventId && s.StudentId == studentId)
									.Include(s=>s.Vaccineevent)
									.FirstOrDefaultAsync();

		

		if (eventParticipant == null)
		{
			throw new NotFoundException($"Can't found this vaccine participant data with student Id: {studentId} and vaccine event id: {eventId}");
		}

		//On update on the date of event and later on
		var isDateSuitable = eventParticipant.Vaccineevent.DateOccurred.CompareTo(DateTime.Today);
		if (isDateSuitable < 0)
		{
			throw new BadRequestException("Cannot change the participant status to complete if the vaccine event day haven't occurred");
		}

		// Validate if the status value is suitable for update
		var newStatus = ValidateAttendantStatus.ParseStatus(AttentdanceStatus.Approved.ToString());
		ValidateAttendantStatus.ValidateEventStatusTransition(eventParticipant, newStatus);

		//Note: Vaccine Event and Student Id are excluded from update
		eventParticipant.Status = AttentdanceStatus.Completed.ToString();
		eventParticipant.CheckedBy = checkById;
		eventParticipant.UpdatedAt = DateTime.Now;
		eventParticipant.ResultSummary = ResultSummary;


		await _vaccineEventStudentRepository.UpdateAsync(eventParticipant);
		await _unitOfWork.SaveAsync();
	}

	public async Task UpdateNote(string eventId, string studentId, string note)
	{
		var eventParticipant = await _vaccineEventStudentRepository.GetQueryable()
											.Where(s => s.VaccineeventId == eventId && s.StudentId == studentId)
											.FirstOrDefaultAsync();

		if (eventParticipant == null)
		{
			throw new NotFoundException($"Can't found this vaccine participant data with student Id: {studentId} and vaccine event id: {eventId}");
		}

		// Validate if the status value is suitable for update
		var newStatus = ValidateAttendantStatus.ParseStatus(AttentdanceStatus.Approved.ToString());
		ValidateAttendantStatus.ValidateEventStatusTransition(eventParticipant, newStatus);

		//Note: Vaccine Event and Student Id are excluded from update
		eventParticipant.UpdatedAt = DateTime.Now;
		eventParticipant.Note = note;


		await _vaccineEventStudentRepository.UpdateAsync(eventParticipant);
		await _unitOfWork.SaveAsync();
	}

	#endregion
}
