using Microsoft.EntityFrameworkCore;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_BusinessLogic.Utility;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Core;


public class MedicineService : IMedicineService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IGenericRepository<Medicine> _medicineRepository;
    

    public MedicineService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _medicineRepository = _unitOfWork.GetRepository<Medicine>();
    }

    public async Task<PagingModel<MedicineDetailResponseDto>> GetAllMedicinesAsync(MedicineQueryDto request)
    {
			var query = _medicineRepository.Include(m => m.CreatedByNavigation)
			.Where(m => !m.IsDeleted);

			// Apply filters search by name and availability
			if (!string.IsNullOrEmpty(request.Name))
			{
				query = query.Where(m => m.Name.ToLower().Contains(request.Name.ToLower()));
			}

			if (request.IsAvailable.HasValue)
			{
				query = query.Where(m => m.IsAvailable == request.IsAvailable.Value);
			}

			// Apply sorting
			query = ApplySorting(query, request.SortByNameByDescending);

            //Convert Medicine to MedicineDetailResponseDto

            var medicineResponseDto = 
                query.Select(m => new MedicineDetailResponseDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Description = m.Description,
                    Amount = m.Amount,
                    IsAvailable = m.IsAvailable,
                    CreatedBy = m.CreatedBy,
                    CreatedByName = m.CreatedByNavigation.FullName ?? "Unknown"
                });


			// Apply paging
			var medicinePage = await PagingExtension.ToPagingModel<MedicineDetailResponseDto>(medicineResponseDto.AsQueryable(), request.PageIndex, request.PageSize);


			return new PagingModel<MedicineDetailResponseDto>
			{
				PageIndex = medicinePage.PageIndex,
				PageSize = medicinePage.PageSize,
				TotalCount = medicinePage.TotalCount,
				TotalPages = medicinePage.TotalPages,
				Data = medicinePage.Data
			};
		
    }

    public async Task<MedicineDetailResponseDto> GetMedicineDetailByIdAsync(string id)
    {
        
			var medicine = await _medicineRepository
			.Include(m => m.CreatedByNavigation)
			.Where(m => m.Id == id && !m.IsDeleted)
			.Select(m => new MedicineDetailResponseDto
			{
				Id = m.Id,
				Name = m.Name,
				Description = m.Description,
				Amount = m.Amount,
				IsAvailable = m.IsAvailable,
				CreatedBy = m.CreatedBy,
				CreatedByName = m.CreatedByNavigation.FullName ?? "Unknown"
			})
			.FirstOrDefaultAsync();

            if(medicine == null)
            {
                throw new NotFoundException("Medicine", id);
            }

			return medicine;
		
    }

    public async Task<MedicineDetailResponseDto> CreateMedicineAsync(MedicineCreateDto request, string createdBy)
    {
            var medicine = new Medicine
            {
                Id = Guid.NewGuid().ToString(),
                Name = request.Name,
                Description = request.Description,
                Amount = request.Amount,
                IsAvailable = request.IsAvailable ?? true,
                CreatedBy = createdBy,
                IsDeleted = false
            };

            await _medicineRepository.InsertAsync(medicine);
            await _unitOfWork.SaveAsync();


            var createdMedicine = await _medicineRepository
                .Include(m => m.CreatedByNavigation)
                .FirstOrDefaultAsync(m => m.Id == medicine.Id);

            return new MedicineDetailResponseDto
            {
                Id = createdMedicine!.Id,
                Name = createdMedicine!.Name,
                Description = createdMedicine.Description,
                Amount = createdMedicine.Amount,
                IsAvailable = createdMedicine.IsAvailable,
                CreatedBy = createdMedicine.CreatedBy,
                CreatedByName = createdMedicine.CreatedByNavigation?.FullName ?? "Unknown"
            };
       
    }

    public async Task<MedicineDetailResponseDto> UpdateMedicineAsync(UpdateMedicineDto request, string medicineId)
    {
       

            var medicine = await _medicineRepository.GetByIdAsync(medicineId);
            if (medicine == null || medicine.IsDeleted)
            {
                throw new AppException(ErrorMessage.MedicineNotFound);
            }
			//Update the medicine properties
			medicine.Name = request.Name;
            medicine.Description = request.Description;
            medicine.Amount = request.Amount;
            medicine.IsAvailable = request.IsAvailable;

            await _medicineRepository.UpdateAsync(medicine);
            await _unitOfWork.SaveAsync();


			// Fetch the updated medicine with CreatedByNavigation for response
			var updatedMedicine = await _medicineRepository
                .Include(m => m.CreatedByNavigation)
                .FirstOrDefaultAsync(m => m.Id == medicine.Id);

            return new MedicineDetailResponseDto
            {
                Id = updatedMedicine!.Id,
                Name = updatedMedicine.Name,
                Description = updatedMedicine.Description,
                Amount = updatedMedicine.Amount,
                IsAvailable = updatedMedicine.IsAvailable,
                CreatedBy = updatedMedicine.CreatedBy,
                CreatedByName = updatedMedicine.CreatedByNavigation?.FullName ?? "Unknown"
            };
       
    }

    public async Task SoftDeleteMedicineAsync(string medicineId)
    {
      

            var medicine = await _medicineRepository.GetByIdAsync(medicineId);
            if (medicine == null || medicine.IsDeleted)
            {
                throw new NotFoundException("Medicines", medicineId);
            }

            medicine.IsDeleted = true;
            await _medicineRepository.UpdateAsync(medicine);
            await _unitOfWork.SaveAsync();

           
      
    }

    private IQueryable<Medicine> ApplySorting(IQueryable<Medicine> query, bool SortByNameIsDescending)
    {
       

        return SortByNameIsDescending
			? query.OrderByDescending(m=>m.Name)
            : query.OrderBy(m => m.Name);
    }

}
