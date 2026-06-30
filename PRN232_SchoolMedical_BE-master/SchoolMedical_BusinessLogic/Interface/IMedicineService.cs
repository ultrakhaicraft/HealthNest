using SchoolMedical_DataAccess.DTOModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Interface
{
    public interface IMedicineService
    {
        Task<PagingModel<MedicineDetailResponseDto>> GetAllMedicinesAsync(MedicineFilterRequestDto request);
        Task<MedicineDetailResponseDto?> GetMedicineDetailByIdAsync(string id);
        Task<MedicineDetailResponseDto> CreateMedicineAsync(CreateMedicineRequestDto request, string createdBy);
        Task<MedicineDetailResponseDto> UpdateMedicineAsync(UpdateMedicineRequestDto request, string medicineId);
        Task<bool> SoftDeleteMedicineAsync(string id);
    }
}
