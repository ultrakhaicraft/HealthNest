using HealthNest_DAO.DTOModels;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Interface
{
    public interface IMedicineRequestService
    {
        Task<PagingModel<MedicineRequestResponseDto>> GetMedicineRequestsAsync(MedicineRequestFilterRequestDto request);
        Task<MedicineRequestResponseDto> GetMedicineRequestByIdAsync(string id);
        Task<MedicineRequestResponseDto> CreateMedicineRequestAsync(CreateMedicineRequestRequestDto request);
        Task<MedicineRequestResponseDto> UpdateMedicineRequestAsync(UpdateMedicineRequestRequestDto request, string id);
        Task DeleteMedicineRequestAsync(string id);
        Task<PagingModel<MedicineRequestResponseDto>> GetMedicineRequestsByStudentAsync(string studentId, MedicineRequestFilterRequestDto request);
        Task<PagingModel<MedicineRequestResponseDto>> GetMedicineRequestsByRequesterAsync(string requesterId, MedicineRequestFilterRequestDto request);
        Task<int> CountPendingMedicineRequest();

	}
}
