using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_BusinessLogic.Utility;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Core
{
    public class MedicalSupplyService : IMedicalSupplyService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Medicalsupply> medicalSupply;

		public MedicalSupplyService(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			medicalSupply = _unitOfWork.GetRepository<Medicalsupply>();
		}

		public async Task<string> CreateMedicalSupplyAsync(MedicalSupplyCreateModel request, string createdBy)
        {
            var newSupply = new Medicalsupply
            {
                Id = Guid.NewGuid().ToString(),
                Name = request.Name ?? "",
                Description = request.Description,
                Amount = request.Amount,
                CreatedBy = createdBy //User ID of the creator
			};

            await medicalSupply.InsertAsync(newSupply);
            await _unitOfWork.SaveAsync();

            return  newSupply.Id;
		}

        public async Task<PagingModel<MedicalSupplyViewModel>> GetAllMedicalSupplyAsync(MedicalSupplyQuery request)
        {
            /*
            int pageIndex = 1; 
            int pageSize = 10; 

            var allData = await medicalSupply.GetAllAsync();

            int totalCount = allData.Count();
            int totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var pagedData = allData
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new MedicalSupplyModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    Amount = x.Amount,
                    IsAvailable = x.IsAvailable,
                    IsDeleted = x.IsDeleted,
                    CreatedBy = x.CreatedBy,
                    CreatedByNavigationId = x.CreatedByNavigation.Id
                })
                .ToList();

            return new PagingModel<MedicalSupplyModel>
            {
                PageIndex = pageIndex,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages,
                Data = pagedData
            };
            */

            var allData = await _unitOfWork.GetRepository<Medicalsupply>().GetAllAsync();
            allData = allData.Where(x => !x.IsDeleted);

            var viewData = allData.Select(x => new MedicalSupplyViewModel
            {
                Id = x.Id,
                Name = x.Name,
                Amount = x.Amount,
                IsAvailable = x.IsAvailable,
                IsDeleted = x.IsDeleted,
            });
				
            var pagedData = await PagingExtension.ToPagingModel(viewData, request.PageIndex, request.PageSize);
            return pagedData;

		}


        public async Task<MedicalSupplyDetailModel> GetMedicalSupplyByIdAsync(string id)
        {
            var entity = await medicalSupply.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted)
                return null;

            return new MedicalSupplyDetailModel
			{
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description,
                Amount = entity.Amount,
                IsAvailable = entity.IsAvailable,
                IsDeleted = entity.IsDeleted,
                CreatedBy = entity.CreatedBy,
            };
        }

        public async Task<bool> SoftDeleteMedicalSupplyAsync(string id)
        {
            var entity = await medicalSupply.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted)
                return false;

            entity.IsDeleted = true;
            medicalSupply.Update(entity);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> UpdateMedicalSupplyAsync(MedicalSupplyUpdateModel request, string medicineId)
        {
            var entity = await medicalSupply.GetByIdAsync(medicineId);
            if (entity == null || entity.IsDeleted)
                return false;

            entity.Name = request.Name ?? entity.Name;
            entity.Description = request.Description;
            entity.Amount = request.Amount;
            entity.IsAvailable = request.IsAvailable ?? entity.IsAvailable;

            medicalSupply.Update(entity);
            await _unitOfWork.SaveAsync();

			return true;
		}
    }
}
