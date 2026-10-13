using HealthNest_BusinessLogic.Interface;
using HealthNest_BusinessLogic.Utility;
using HealthNest_DAO.DTOModels;
using HealthNest_DAO.Entities;
using HealthNest_DAO.Enums;
using HealthNest_DAO.Interfaces;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace HealthNest_BusinessLogic.Core;


public class StudentHealthRecordService : IStudentHealthRecordService
{
	private readonly IUnitOfWork _unitOfWork;

	public StudentHealthRecordService(IUnitOfWork unitOfWork)
	{
		_unitOfWork = unitOfWork;
	}

	public async Task<string> CreateRecordAsync(StudentHealthRecordCreateModel record, string createdBy)
	{
		
			await Task.Delay(100);

			var parent= await _unitOfWork.GetRepository<Account>().GetByIdAsync(createdBy);
			if(parent == null)
			{
				throw new NotFoundException("Unable to find parent account with their Id: " + createdBy);
			}

			var studentHealthRecord = new Studenthealthrecord
			{
				Id = Guid.NewGuid().ToString(),
				StudentId = record.StudentId,
				Height = record.Height,
				Allergies = record.Allergies,
				HealthHistory = record.HealthHistory,
				Vision = record.Vision,
				EarNoseAndMouth = record.EarNoseAndMouth,
				Teeth = record.Teeth,
				BloodPressure = record.BloodPressure,
				BloodProfile = record.BloodProfile,
				Heart = record.Heart,
				Status = RecordStatus.Active.ToString(),
				CreatedBy = createdBy, // Assuming CreatedBy is a property in the create model
				CreatedDateTime = DateTime.Now,
				UpdatedDateTime = DateTime.Now,
				
			};

			await _unitOfWork.GetRepository<Studenthealthrecord>().InsertAsync(studentHealthRecord);
			await _unitOfWork.SaveAsync(); 
			return studentHealthRecord.Id;
		
	}

	public async Task DeleteRecordAsync(string recordId)
	{
		
			await Task.Delay(100);
			var record = _unitOfWork.GetRepository<Studenthealthrecord>().GetById(recordId);
			if (record == null)
			{
				throw new NotFoundException("Student health record",recordId);
			}
			_unitOfWork.GetRepository<Studenthealthrecord>().Delete(record);
			await _unitOfWork.SaveAsync(); // Ensure the save operation completes
			return;
		
	}

	public async Task<PagingModel<StudentHealthRecordViewModel>> GetAllRecords(StudentHealthRecordQuery recordQuery)
	{
		
			await Task.Delay(100);
			var records = _unitOfWork.GetRepository<Studenthealthrecord>().GetQueryable();
			

			//Search by student name by accessing Student Object
			if (!string.IsNullOrEmpty(recordQuery.StudentName))
			{
				records = records.Where(r => r.Student.Account.FullName.Contains(recordQuery.StudentName, StringComparison.OrdinalIgnoreCase));
			}

			//Filter by status
			// Filter Based on Status (using string-to-enum conversion)
			if (!string.IsNullOrEmpty(recordQuery.Status.ToString()))
			{
				if (Enum.TryParse<AccountStatus>(recordQuery.Status.ToString(), true, out var parsedStatus))
				{
					records = records.Where(account => account.Status == parsedStatus.ToString());
				}
			}

			if (records == null || !records.Any())
			{
				throw new NotFoundException("No student health records found.");
			}

			var recordResponse = records.Select(record => new StudentHealthRecordViewModel
			{
				Id = record.Id,
				StudentId = record.StudentId,
				StudentName = record.Student.Account.FullName, // Assuming Student has a FullName property
				CreatedBy = record.CreatedByNavigation.Account.FullName, // Assuming CreatedByNavigation has a FullName property
				Status = record.Status
			});

			var pagingModel = await PagingExtension.ToPagingModel(recordResponse, recordQuery.PageNumber, recordQuery.PageNumber);

			return new PagingModel<StudentHealthRecordViewModel>
			{
				PageIndex = pagingModel.PageIndex,
				PageSize = pagingModel.PageSize,
				TotalCount = pagingModel.TotalCount,
				TotalPages = pagingModel.TotalPages,
				Data = pagingModel.Data
			};
	
	}

	public async Task<StudentHealthRecordDetailModel> GetRecordDetailByIdAsync(string recordId)
	{
		
			var studentHealthRecord = await _unitOfWork.GetRepository<Studenthealthrecord>()
			.Include(x => x.Student)
			.Include(x => x.Student.Account)
			.Include(x => x.CreatedByNavigation)
			.Include(x => x.Treatmentrecords)
			.Include(x => x.Vaccinerecords)
			.Where(x => x.Id.Equals(recordId))
			.FirstOrDefaultAsync();

			if (studentHealthRecord == null)
			{
				throw new NotFoundException("Student health record",recordId);
			}

			//Create the DTOs
			var studentId = studentHealthRecord.Student.Id;
			var studentName = studentHealthRecord.Student.Account.FullName;

			var recordResponse  = convertToStudentHealthRecordDTO(studentHealthRecord);

			recordResponse.VaccineRecordViewModels = studentHealthRecord.Vaccinerecords
			.Select(v => convertToVaccineRecordViewDTO(v, studentId, studentName))
			.ToList();

			recordResponse.TreatmentRecordViewModels = studentHealthRecord.Treatmentrecords
				.Select(t => convertToTreatmentRecordViewDTO(t, studentId, studentName))
				.ToList();

			return recordResponse;
	}

	

	public async Task UpdateRecordAsync(StudentHealthRecordUpdateModel record, string recordId)
	{
		
			var existingRecord =  await _unitOfWork.GetRepository<Studenthealthrecord>().GetByIdAsync(recordId);

			if (existingRecord == null)
			{
				throw new NotFoundException("Student Health Record", recordId);
			}

			existingRecord.Height = record.Height;
			existingRecord.Weight = record.Weight;
			existingRecord.Allergies = record.Allergies;
			existingRecord.HealthHistory = record.HealthHistory;
			existingRecord.Vision = record.Vision;
			existingRecord.EarNoseAndMouth = record.EarNoseAndMouth;
			existingRecord.Teeth = record.Teeth;
			existingRecord.BloodPressure = record.BloodPressure;
			existingRecord.BloodProfile = record.BloodProfile;
			existingRecord.Heart = record.Heart;
			existingRecord.Status = record.Status;
			existingRecord.UpdatedDateTime = DateTime.UtcNow;



			await _unitOfWork.GetRepository<Studenthealthrecord>().UpdateAsync(existingRecord);
			await _unitOfWork.SaveAsync(); // Ensure the save operation completes
			return;
		
	}

	public async Task UpdateRecordStatusAsync(string recordId, string status)
	{

			var existingRecord = await _unitOfWork.GetRepository<Studenthealthrecord>().GetByIdAsync(recordId);
			if (existingRecord == null)
			{
				throw new NotFoundException("Student Health Record", recordId);
			}

			existingRecord.Status = status;

			await _unitOfWork.GetRepository<Studenthealthrecord>().UpdateAsync(existingRecord);
			await _unitOfWork.SaveAsync();
			return;
		
	}

	private TreatmentRecordViewModel convertToTreatmentRecordViewDTO(Treatmentrecord record, string studentId, string studentName)
	{
		var treatmentRecordDto = new TreatmentRecordViewModel
		{
			Id =record.Id,
			Description = record.Description,
			RecordDate = record.RecordDate,
			Status = record.Status,
			StudentHealthRecordId = record.StudentHealthRecordId,
			StudentName = studentName,
			StudentId= studentId,
			TreatmentTitle = record.TreatmentTitle,			
		};

		return treatmentRecordDto;
	}

	private VaccineRecordViewModel convertToVaccineRecordViewDTO(Vaccinerecord record, string studentId, string studentName)
	{
		var vaccineRecordDto = new VaccineRecordViewModel
		{
			Id = record.Id,
			Description = record.Description,
			RecordDate = record.RecordDate,
			Status = record.Status,
			StudentHealthRecordId = record.StudentHealthRecordId,
			StudentName = studentName,
			StudentId = studentId,
			VaccineTitle = record.VaccineTitle,
		};

		return vaccineRecordDto;
	}

	private StudentHealthRecordDetailModel convertToStudentHealthRecordDTO(Studenthealthrecord studenthealthrecord)
	{
		var recordResponse = new StudentHealthRecordDetailModel
		{
			Id = studenthealthrecord.Id,
			StudentId = studenthealthrecord.StudentId,
			StudentName = studenthealthrecord.Student.Account.FullName, // Assuming Student has a Name property
			Height = studenthealthrecord.Height,
			Allergies = studenthealthrecord.Allergies,
			HealthHistory = studenthealthrecord.HealthHistory,
			Vision = studenthealthrecord.Vision,
			EarNoseAndMouth = studenthealthrecord.EarNoseAndMouth,
			Teeth = studenthealthrecord.Teeth,
			BloodPressure = studenthealthrecord.BloodPressure,
			BloodProfile = studenthealthrecord.BloodProfile,
			Heart = studenthealthrecord.Heart,
			Status = studenthealthrecord.Status,
			CreatedBy = studenthealthrecord.CreatedByNavigation.Id, // Assuming CreatedBy is a property in the create model
			CreatedDateTime = studenthealthrecord.CreatedDateTime,
			UpdatedDateTime = studenthealthrecord.UpdatedDateTime,

		};

		return recordResponse;
	}
}
