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
        Task<PagingModel<MedicineDetailResponseDto>> GetAllMedicinesAsync(MedicineQueryDto request);
        Task<MedicineDetailResponseDto> GetMedicineDetailByIdAsync(string id);
        Task<MedicineDetailResponseDto> CreateMedicineAsync(MedicineCreateDto request, string createdBy);
        Task<MedicineDetailResponseDto> UpdateMedicineAsync(UpdateMedicineDto request, string medicineId);
        Task SoftDeleteMedicineAsync(string id);
    }
}
