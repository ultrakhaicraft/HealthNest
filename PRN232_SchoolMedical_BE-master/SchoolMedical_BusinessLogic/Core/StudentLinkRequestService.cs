using HealthNest_BusinessLogic.Interface;
using HealthNest_BusinessLogic.Utility;
using HealthNest_DAO.DTOModels;
using HealthNest_DAO.Entities;
using HealthNest_DAO.Enums;
using HealthNest_DAO.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Core;

public class StudentLinkRequestService : IStudentLinkRequestService
{
	private readonly IUnitOfWork _unitOfWork;
	private const int MaxPendingPerParent = 5;
	private readonly ILogger<StudentLinkRequestService> _logger;

	public StudentLinkRequestService(IUnitOfWork unitOfWork, ILogger<StudentLinkRequestService> logger)
	{
		_unitOfWork = unitOfWork;
		_logger = logger;
	}


	/// <summary>
	/// Create Link request from parent
	/// </summary>
	/// <param name="parentId"></param>
	/// <param name="model"></param>
	/// <returns></returns>
	public async Task<List<StudentLinkRequestViewModel>> SubmitAsync(string parentId, LinkRequestCreateModel model)
	{
		var parent = await _unitOfWork.GetRepository<Account>().FindAsync(a => a.Id == parentId);
		if (parent == null || parent.Role != AccountRole.Parent.ToString() || parent.Status == AccountStatus.Inactive.ToString())
			throw new BadRequestException("Parent account not found or not eligible to request links.");

		var ids = (model.StudentIds ?? new List<string>())
			.Where(id=>!string.IsNullOrEmpty(id))
			.Distinct()
			.ToList();

		if (ids.Count == 0)
			throw new BadRequestException("At least one student id is required.");

		var students = await _unitOfWork.GetRepository<Student>()
			.Include(s=>s.Account)
			.Where(s=>ids.Contains(s.Id))
			.ToListAsync();

		var unavailable = ids.Except(students.Where(s => s.Account.Status != AccountStatus.Inactive.ToString()).Select(s => s.Id)).ToList();
		if (unavailable.Count > 0)
			throw new NotFoundException($"Student account(s) not found or inactive: {string.Join(", ", unavailable)}");

		var alreadyLinked = students.Where(s => !string.IsNullOrEmpty(s.ParentId)).Select(s => s.Id).ToList();
		if (alreadyLinked.Count > 0)
			throw new BadRequestException($"Student(s) already linked to a parent: {string.Join(", ", alreadyLinked)}");

		// No duplicate pending request for the same student
		var duplicates = await _unitOfWork.GetRepository<StudentLinkRequest>()
			.Include(r => r.Student)
			.Where(r => r.ParentId == parentId && r.Status == RequestStatus.Pending.ToString() && ids.Contains(r.StudentId))
			.Select(r => r.StudentId)
			.ToListAsync();

		if (duplicates.Count > 0)
			throw new BadRequestException($"You already have a pending request for: {string.Join(", ", duplicates)}");

		// Spam control: cap total pending requests per parent
		var pendingCount = await _unitOfWork.GetRepository<StudentLinkRequest>().Include(r => r.Student)
			.CountAsync(r => r.ParentId == parentId && r.Status == RequestStatus.Pending.ToString());


		if (pendingCount + ids.Count > MaxPendingPerParent)
			throw new BadRequestException(
				$"You can have at most {MaxPendingPerParent} pending requests ({pendingCount} currently pending).");

		var now = DateTime.Now;
		var entities = ids.Select(studentId => new StudentLinkRequest
		{
			Id = Guid.NewGuid().ToString(),
			ParentId = parentId,
			StudentId = studentId,
			RelationshipNote = model.RelationshipNote?.Trim() ?? "N/A",
			Status = RequestStatus.Pending.ToString(),
			CreatedDateTime = now
		}).ToList();


		try
		{
			await _unitOfWork.GetRepository<StudentLinkRequest>().InsertRangeAsync(entities);
			await _unitOfWork.SaveAsync();
		}
		catch (DbUpdateException ex) when (IsDuplicateKey(ex))
		{
			// Backstop for the race the check above can't close: the unique index on PendingPairKey
			throw new BadRequestException("A pending request already exists for one of these students.");
		}

		var newIds = entities.Select(e => e.Id).ToList();
		return await _unitOfWork.GetRepository<StudentLinkRequest>().Include(r => r.Student.Account).Where(r => newIds.Contains(r.Id)).Select(ToViewModel).ToListAsync();
	}

	public async Task<StudentLinkRequestDetailModel> GetStudentLinkRequestModel(string id, string accountId)
	{
		var account = await _unitOfWork.GetRepository<Account>().GetQueryable().Where(x=>x.Id == accountId).FirstOrDefaultAsync();
		if (account == null)
		{
			throw new BadRequestException("Can't find account for verify");
		}

		bool IsNurse = account.Role == AccountRole.SchoolNurse.ToString();
		var entity = await _unitOfWork.GetRepository<StudentLinkRequest>()
				.Include(x => x.Student)
				.Include(x => x.Student.Account)
				.Include(x => x.Parent.Account)
				.Include(x => x.ReviewedByNavigation)
				.Where(x => x.Id == id && (IsNurse || x.ParentId==accountId))
				.FirstOrDefaultAsync();

		if (entity == null)
			throw new NotFoundException("Student Link Request", id);

		return new StudentLinkRequestDetailModel
		{
			Id = entity.Id,
			ParentId = entity.ParentId,
			RelationshipNote = entity.RelationshipNote,
			StudentId = entity.StudentId,
			ParentName = entity.Parent.Account.FullName,
			StudentName = entity.Student.Account.FullName,
			reviewedByName = entity.ReviewedByNavigation?.FullName ?? "N/A",
			RejectionReason = entity.RejectionReason,
			ReviewedBy = entity.ReviewedBy,
			Status = entity.Status,
			ReviewedDateTime = entity.ReviewedDateTime,
			CreatedDateTime = entity.CreatedDateTime,

		};
	}

	public async Task UnlinkAsync(string parentId, string studentId)
	{
		var student =await _unitOfWork.GetRepository<Student>()
			.Include(s=>s.Account)
			.Where(s=>s.Id==studentId && s.ParentId==parentId)
			.FirstOrDefaultAsync();

		if (student == null)
			throw new NotFoundException("Linked student not found.");

		var approvedLinks = await _unitOfWork.GetRepository<StudentLinkRequest>()
			.Include(r => r.Student)                                // entry point only
			.Where(r => r.ParentId == parentId && r.StudentId == studentId && r.Status == RequestStatus.Approved.ToString())
			.ToListAsync();

		student.ParentId = null;
		if (student.Account.Status != AccountStatus.Inactive.ToString())
			student.Account.Status = AccountStatus.NotLinked.ToString();

		foreach (var link in approvedLinks)
			_unitOfWork.GetRepository<StudentLinkRequest>().Delete(link); // your repository's delete method

		try
		{
			await _unitOfWork.SaveAsync();                          // one atomic transaction
		}
		catch (DbUpdateConcurrencyException)
		{
			// ParentId is a concurrency token: someone (e.g. a nurse) changed the link first
			throw new BadRequestException("This link was just changed by someone else. Please refresh and try again.");
		}

		_logger.LogInformation("Parent {ParentId} unlinked student {StudentId}", parentId, studentId);

	}

	public async Task CancelAsync(string parentId, string requestId)
	{
		// Ownership is part of the query: someone else's request looks the same as a missing one
		var request = await _unitOfWork.GetRepository<StudentLinkRequest>().Include(r=>r.Student)
			.Where(r => r.Id == requestId && r.ParentId == parentId)
			.FirstOrDefaultAsync();
		if (request == null)
			throw new NotFoundException("Student Link Request", requestId);

		EnsurePending(request, "cancelled");
		request.Status = RequestStatus.Cancelled.ToString();

		try
		{
			await _unitOfWork.SaveAsync();
		}
		catch (DbUpdateConcurrencyException)
		{
			throw new BadRequestException("This request was just reviewed and can no longer be cancelled.");
		}
	}


	public async Task<PagingModel<StudentLinkRequestViewModel>> GetAllStudentLinkRequest(StudentLinkRequestQuery query)
	{
		string pending = RequestStatus.Pending.ToString();
		var q = _unitOfWork.GetRepository<StudentLinkRequest>().GetQueryable();

		var status = query.Status?.Trim();
		if(!string.IsNullOrEmpty(query.Status))
			q= q.Where(r=>r.Status== status);
		if (!string.IsNullOrWhiteSpace(query.StudentName))
			q = q.Where(r => r.Student.Account.FullName.Contains(query.StudentName));
		if (!string.IsNullOrWhiteSpace(query.ParentName))
			q = q.Where(r => r.Parent.Account.FullName.Contains(query.ParentName));

		// Pending: oldest first (work the queue in order). Everything else: newest first.
		// ThenBy(Id) gives batch-submitted rows (identical CreatedDateTime) a stable order across pages.

		var ordered = string.Equals(status, pending, StringComparison.OrdinalIgnoreCase)
		? q.OrderBy(r => r.CreatedDateTime).ThenBy(r => r.Id)
		: q.OrderByDescending(r => r.CreatedDateTime).ThenBy(r => r.Id);

		var (pageIndex, pageSize) = NormalizePaging(query);

		var totalCount = await ordered.CountAsync();
		var items = await ordered
			.Skip((pageIndex - 1) * pageSize)
			.Take(pageSize)
			.Select(ToViewModel)
			.ToListAsync();

		await FillOtherPendingCountsAsync(items, pending);

		return PagingExtension.ToPagingModel(items, totalCount: totalCount, pageIndex: query.PageIndex, query.PageSize); ;
	}

	public async Task ApproveAsync(string nurseId, string requestId)
	{
		var queryable =  _unitOfWork.GetRepository<StudentLinkRequest>().GetQueryable();
		var request = await queryable.Where(r => r.Id == requestId).FirstOrDefaultAsync();
		if (request == null)
			throw new NotFoundException("Link request not found.");

		EnsurePending(request, "approved");

		// Re-validate at approval time: things may have changed since the request was filed
		var parent = await _unitOfWork.GetRepository<Account>().FindAsync(a => a.Id == request.ParentId);
		if (parent == null || parent.Status == AccountStatus.Inactive.ToString())
			throw new BadRequestException("The requesting parent's account is no longer active.");

		var student = await _unitOfWork.GetRepository<Student>()
			.Include(s => s.Account)
			.Where(s => s.Id == request.StudentId)
			.FirstOrDefaultAsync();
		if (student == null || student.Account.Status == AccountStatus.Inactive.ToString())
			throw new BadRequestException("The student account was not found or is inactive.");
		if (!string.IsNullOrEmpty(student.ParentId))
			throw new BadRequestException("This student is already linked to a parent.");

		var competing =await  queryable.Where(r => r.StudentId == request.StudentId && r.Status == RequestStatus.Pending.ToString() && r.Id != request.Id)
			.ToListAsync();

		var now = DateTime.Now;

		// 1. Link (the logic from AssignStudentToParent, now driven by the stored request)
		student.ParentId = request.ParentId;
		student.Account.Status = AccountStatus.Active.ToString();

		// 2. Approve
		request.Status = RequestStatus.Approved.ToString();
		request.ReviewedBy = nurseId;
		request.ReviewedDateTime = now;

		// 3. A student has one ParentId, so every other pending claim on this student is closed out
		foreach (var other in competing)
		{
			other.Status = RequestStatus.Rejected.ToString();
			other.ReviewedBy = nurseId;
			other.ReviewedDateTime = now;
			other.RejectionReason = "Another link request for this student was approved.";
		}

		try
		{
			await _unitOfWork.SaveAsync();       // one SaveChanges = one atomic transaction
		}
		catch (DbUpdateConcurrencyException)
		{
			throw new BadRequestException(
				"This request or student was changed by someone else. Please refresh and try again.");
		}
	}

	public async Task<PagingModel<StudentLinkRequestViewModel>> GetMyRequestsAsync(string parentId, StudentLinkRequestQuery query)
	{
		var q = _unitOfWork.GetRepository<StudentLinkRequest>().GetQueryable()
			.Where(r => r.ParentId == parentId);

		if (!string.IsNullOrWhiteSpace(query.StudentName))
			q = q.Where(r => r.Student.Account.FullName.Contains(query.StudentName));
		if (!string.IsNullOrEmpty(query.Status))
		{
			var status = query.Status.ToString();
			q = q.Where(r => r.Status == status);
		}
		var ordered = q.OrderByDescending(r => r.CreatedDateTime).ThenBy(r => r.Id);
		var (pageIndex, pageSize) = NormalizePaging(query);

		var totalCount = await ordered.CountAsync();
		var items = await ordered.Skip((pageIndex - 1) * pageSize).Take(pageSize)
			.Select(ToViewModel).ToListAsync();

		return PagingExtension.ToPagingModel(items, totalCount, pageIndex, pageSize);

	}


	public async Task RejectAsync(string nurseId, string requestId, string reason)
	{
		if (string.IsNullOrWhiteSpace(reason)) throw new BadRequestException("A rejection reason is required");

		var request = await _unitOfWork.GetRepository<StudentLinkRequest>()
			.Include(r => r.Student)
			.Where(r => r.Id == requestId).FirstOrDefaultAsync();

		if (request == null)
			throw new NotFoundException("Link request not found.");

		EnsurePending(request, RequestStatus.Rejected.ToString());

		request.Status = RequestStatus.Rejected.ToString();
		request.ReviewedBy = nurseId;
		request.ReviewedDateTime = DateTime.Now;
		request.RejectionReason = reason.Trim();

		try
		{
			await _unitOfWork.SaveAsync();
		}
		catch (DbUpdateConcurrencyException)
		{
			throw new BadRequestException("This request was changed by someone else. Please refresh and try again.");
		}
	}


	//Private method
	private readonly Expression<Func<StudentLinkRequest, StudentLinkRequestViewModel>> ToViewModel = r =>
	   new StudentLinkRequestViewModel
	   {
		   Id = r.Id,
		   ParentId = r.ParentId,
		   ParentName = r.Parent.Account.FullName,
		   StudentId = r.StudentId,
		   StudentName = r.Student.Account.FullName,
		   Status = r.Status,
		   CreatedDateTime = r.CreatedDateTime,
		   ReviewedBy = r.ReviewedBy,
		   ReviewedDateTime = r.ReviewedDateTime,
		   RejectionReason = r.RejectionReason
	   };

	private static (int pageIndex, int pageSize) NormalizePaging(StudentLinkRequestQuery q) =>
	(Math.Max(1, q.PageIndex), Math.Clamp(q.PageSize, 1, 100));

	private static void EnsurePending(StudentLinkRequest request, string action)
	{
		if (request.Status != RequestStatus.Pending.ToString())
			throw new BadRequestException($"Only pending requests can be {action}. Current status: {request.Status}.");
	}

	private static bool IsDuplicateKey(DbUpdateException ex) =>
		ex.InnerException is MySqlConnector.MySqlException { Number: 1062 };


	// One grouped query for the page's students, instead of a correlated subquery per row
	private async Task FillOtherPendingCountsAsync(List<StudentLinkRequestViewModel> items, string pending)
	{
		var pendingRows = items.Where(i => i.Status == pending).ToList();
		if (pendingRows.Count == 0) return;

		var studentIds = pendingRows.Select(i => i.StudentId).Distinct().ToList();

		var pendingPerStudent = await _unitOfWork.GetRepository<StudentLinkRequest>().GetQueryable()
			.Where(r => r.Status == pending && studentIds.Contains(r.StudentId))
			.GroupBy(r => r.StudentId)
			.Select(g => new { StudentId = g.Key, Count = g.Count() })
			.ToDictionaryAsync(x => x.StudentId, x => x.Count);

		foreach (var item in pendingRows)
		{
			pendingPerStudent.TryGetValue(item.StudentId, out var total);
			item.OtherPendingCount = Math.Max(0, total - 1);          // minus the row itself
		}
	}
}
