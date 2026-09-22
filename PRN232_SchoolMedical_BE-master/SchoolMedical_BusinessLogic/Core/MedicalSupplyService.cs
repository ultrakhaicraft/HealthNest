using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_BusinessLogic.Utility;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace SchoolMedical_BusinessLogic.Core
{
    public class MedicalSupplyService : IMedicalSupplyService
    {
        private const string cacheKey = "all_medical_supplies";
		private readonly IUnitOfWork _unitOfWork;
        private readonly IDistributedCache _cache;
		private readonly IGenericRepository<Medicalsupply> _medicalSuppliesRepository;
        private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10); 

		public MedicalSupplyService(IUnitOfWork unitOfWork, IDistributedCache cache)
		{
			_unitOfWork = unitOfWork;
			_medicalSuppliesRepository = _unitOfWork.GetRepository<Medicalsupply>();
            _cache = cache;
		}

		public async Task<string> CreateMedicalSupplyAsync(MedicalSupplyCreateModel request)
        {
			if (string.IsNullOrEmpty(request.CreatedBy) || request.CreatedBy==null)
				throw new BadRequestException("CreatedBy Id is empty, please input this data");

			var newSupply = new Medicalsupply
            {
                Id = Guid.NewGuid().ToString(),
                Name = request.Name ?? "",
                Description = request.Description,
                Amount = request.Amount,
                CreatedBy = request.CreatedBy //User ID of the creator
			};

            await _medicalSuppliesRepository.InsertAsync(newSupply);
            await _unitOfWork.SaveAsync();

			return newSupply.Id;
		}
		

		public async Task<PagingModel<MedicalSupplyViewModel>> GetAllMedicalSupplyAsync(MedicalSupplyQuery request)
        {


			var supplies = _medicalSuppliesRepository.Include(m => m.CreatedByNavigation)
			 .Where(m => m.IsDeleted);

			//Apply filtering and sorting
			supplies = ApplyFilter(supplies, request.Status, request.Name);

			supplies = ApplySorting(supplies, request.SortByNameByDescending);

			List<MedicalSupplyViewModel> viewData = supplies.Select(x => new MedicalSupplyViewModel
            {
                Id = x.Id,
                Name = x.Name,
                Amount = x.Amount,
                IsAvailable = x.IsAvailable,
                IsDeleted = x.IsDeleted,
				CreatedByName = x.CreatedByNavigation.Account.FullName
            }).ToList();


			//Put the view data into cache for future requests
			await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(viewData), new DistributedCacheEntryOptions
			{
				AbsoluteExpirationRelativeToNow = CacheDuration
			});

			var pagedResult = await PagingExtension.ToPagingModel(viewData, request.PageIndex, request.PageSize);

            return pagedResult;
		}



		public async Task<MedicalSupplyDetailModel> GetMedicalSupplyByIdAsync(string id)
        {
            var entity = await _medicalSuppliesRepository
                .Include(x => x.CreatedByNavigation)
                .Where(x => x.Id == id && !x.IsDeleted)
                .FirstOrDefaultAsync();

            if (entity == null || entity.IsDeleted)
                throw new NotFoundException("Medical Supply", id);

            return new MedicalSupplyDetailModel
			{
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description,
                Amount = entity.Amount,
                IsAvailable = entity.IsAvailable,
                IsDeleted = entity.IsDeleted,
                CreatedBy = entity.CreatedByNavigation.Id,
                CreatedByName = entity.CreatedByNavigation.Account.FullName
            };
        }

        public async Task SoftDeleteMedicalSupplyAsync(string id)
        {
            var entity = await _medicalSuppliesRepository.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted)
                throw new NotFoundException("Medical Supply", id);

            entity.IsDeleted = true;
            _medicalSuppliesRepository.Update(entity);
            await _unitOfWork.SaveAsync();
        }

        public async Task UpdateMedicalSupplyAsync(MedicalSupplyUpdateModel request, string medicineId)
        {
            var entity = await _medicalSuppliesRepository.GetByIdAsync(medicineId);
            if (entity == null || entity.IsDeleted)
				throw new NotFoundException("Medical Supply", medicineId);

			entity.Name = request.Name ?? entity.Name;
            entity.Description = request.Description;
            entity.Amount = request.Amount;
            entity.IsAvailable = request.IsAvailable ?? entity.IsAvailable;

            _medicalSuppliesRepository.Update(entity);
            await _unitOfWork.SaveAsync();
		}

		private IQueryable<Medicalsupply> ApplySorting(IQueryable<Medicalsupply> query, bool SortByNameIsDescending)
		{

			return SortByNameIsDescending
				? query.OrderByDescending(m => m.Name)
				: query.OrderBy(m => m.Name);
		}

		private IQueryable<Medicalsupply> ApplyFilter(IQueryable<Medicalsupply> query, string status, string name)
		{

			// Apply filters search by name and availability
			if (!string.IsNullOrEmpty(name))
			{
				query = query.Where(m => m.Name.ToLower().Contains(name.ToLower()));
			}

			if (!string.IsNullOrEmpty(status))
			{
				if (status.Equals("Available", StringComparison.OrdinalIgnoreCase))
				{
					query = query.Where(m => m.IsAvailable == true);
				}

				if (status.Equals("Unavailable", StringComparison.OrdinalIgnoreCase))
				{
					query = query.Where(m => m.IsAvailable == false);
				}
			}

			return query;

		}
	}
}
