using SchoolMedical_DataAccess.DTOModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Interface
{
    public interface IMedicineRequestService
    {
        Task<PagingModel<MedicineRequestResponseDto>> GetMedicineRequestsAsync(MedicineRequestFilterRequestDto request);
        Task<MedicineRequestResponseDto?> GetMedicineRequestByIdAsync(string id);
        Task<MedicineRequestResponseDto> CreateMedicineRequestAsync(CreateMedicineRequestRequestDto request);
        Task<MedicineRequestResponseDto> UpdateMedicineRequestAsync(UpdateMedicineRequestRequestDto request, string id);
        Task<bool> DeleteMedicineRequestAsync(string id);
        Task<PagingModel<MedicineRequestResponseDto>> GetMedicineRequestsByStudentAsync(string studentId, int pageIndex = 1, int pageSize = 5);
        Task<PagingModel<MedicineRequestResponseDto>> GetMedicineRequestsByRequesterAsync(string requesterId, int pageIndex = 1, int pageSize = 5);

	}
}
