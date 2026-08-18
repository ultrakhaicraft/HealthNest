using SchoolMedical_DataAccess.DTOModels;
namespace SchoolMedical_BusinessLogic.Interface
{
    public interface IMedicalSupplyService
    {
        Task<PagingModel<MedicalSupplyViewModel>> GetAllMedicalSupplyAsync(MedicalSupplyQuery request);
        Task<MedicalSupplyDetailModel> GetMedicalSupplyByIdAsync(string id);
        Task<string> CreateMedicalSupplyAsync(MedicalSupplyCreateModel request, string createdBy);
        Task UpdateMedicalSupplyAsync(MedicalSupplyUpdateModel request, string medicineId);
        Task SoftDeleteMedicalSupplyAsync(string id);
    }
}
