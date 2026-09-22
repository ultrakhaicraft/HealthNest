using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_BusinessLogic.Utility;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Enums;
using SchoolMedical_DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace SchoolMedical_BusinessLogic.Core
{
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
				if (!String.IsNullOrEmpty(recordQuery.StudentName))
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

				var pagingModel = await PagingExtension.ToPagingModel<StudentHealthRecordViewModel>(recordResponse, recordQuery.PageNumber, recordQuery.PageNumber);

				return new PagingModel<StudentHealthRecordViewModel>
				{
					PageIndex = pagingModel.PageIndex,
					PageSize = pagingModel.PageSize,
					TotalCount = pagingModel.TotalCount,
					TotalPages = pagingModel.TotalPages,
					Data = pagingModel.Data
				};
		
		}

		public async Task<StudentHealthRecordDetailModel> GetRecordByIdAsync(string recordId)
		{
			
				await Task.Delay(100);
				var resultList = _unitOfWork.GetRepository<Studenthealthrecord>().Include(x => x.Student).Include(x => x.CreatedByNavigation);
				var record = resultList.Where(x=>x.Id.Equals(recordId)).FirstOrDefault();
				if (record == null)
				{
					throw new NotFoundException("Student health record",recordId);
				}

				var recordResponse = new StudentHealthRecordDetailModel
				{
					Id = record.Id,
					StudentId = record.StudentId,
					StudentName = record.Student.Account.FullName, // Assuming Student has a Name property
					Height = record.Height,
					Allergies = record.Allergies,
					HealthHistory = record.HealthHistory,
					Vision = record.Vision,
					EarNoseAndMouth = record.EarNoseAndMouth,
					Teeth = record.Teeth,
					BloodPressure = record.BloodPressure,
					BloodProfile = record.BloodProfile,
					Heart = record.Heart,
					Status = record.Status,
					CreatedBy = record.CreatedByNavigation.Id, // Assuming CreatedBy is a property in the create model
					CreatedDateTime = record.CreatedDateTime,
					UpdatedDateTime = record.UpdatedDateTime,

					/*
					VaccineRecordViewModels = record.Vaccinerecords.Select(v => new VaccineRecordViewModel
					{
						Id = v.Id,
						StudentId = v.StudentId,
						StudentName = v.Student.FullName, // Assuming Student has a FullName property
						RecordDate = v.RecordDate,
						VaccineTitle = v.VaccineTitle,
						Status = v.Status
					}).ToList(),
					TreatmentRecordViewModels = record.Treatmentrecords.Select(t => new TreatmentRecordViewModel
					{
						Id = t.Id,
						StudentId = t.StudentId,
						StudentName = t.Student.FullName, // Assuming Student has a FullName property
						RecordDate = t.RecordDate,
						TreatmentTitle = t.TreatmentTitle,
						Status = t.Status
					}).ToList()
					*/

				};

				return recordResponse;


			
		}

		public async Task<StudentHealthRecordDetailModel> GetRecordFromStudentIdAsync(string studentId)
		{
			
				await Task.Delay(100);
				
				var resultList = _unitOfWork.GetRepository<Studenthealthrecord>().Include(x => x.Student).Include(x => x.CreatedByNavigation);
				var record = resultList.Where(x => x.StudentId.Equals(studentId)).FirstOrDefault();

				if (record == null)
				{
					throw new NotFoundException("Unable to found Student health record with student Id: "+ studentId);
				}

				var recordResponse = new StudentHealthRecordDetailModel
				{
					Id = record.Id,
					StudentId = record.StudentId,
					StudentName = record.Student.Account.FullName, // Assuming Student has a Name property
					Height = record.Height,
					Allergies = record.Allergies,
					HealthHistory = record.HealthHistory,
					Vision = record.Vision,
					EarNoseAndMouth = record.EarNoseAndMouth,
					Teeth = record.Teeth,
					BloodPressure = record.BloodPressure,
					BloodProfile = record.BloodProfile,
					Heart = record.Heart,
					Status = record.Status,
					CreatedBy = record.CreatedByNavigation.Id, // Assuming CreatedBy is a property in the create model
					CreatedDateTime = record.CreatedDateTime,
					UpdatedDateTime = record.UpdatedDateTime,
					/*
					VaccineRecordViewModels = record.Vaccinerecords.Select(v => new VaccineRecordViewModel
					{
						Id = v.Id,
						StudentId = v.StudentId,
						StudentName = v.Student.FullName, // Assuming Student has a FullName property
						RecordDate = v.RecordDate,
						VaccineTitle = v.VaccineTitle,
						Status = v.Status
					}).ToList(),
					TreatmentRecordViewModels = record.Treatmentrecords.Select(t => new TreatmentRecordViewModel
					{
						Id = t.Id,
						StudentId = t.StudentId,
						StudentName = t.Student.FullName, // Assuming Student has a FullName property
						RecordDate = t.RecordDate,
						TreatmentTitle = t.TreatmentTitle,
						Status = t.Status
					}).ToList()
					*/

				};

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
	}
}
