using BlueFinance.API.DTOs.Requests;
using BlueFinance.API.DTOs.Responses;

namespace BlueFinance.API.Services.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryResponse>> GetAllAsync();
    Task<CategoryResponse?> GetByIdAsync(string id);
    Task<CategoryResponse> CreateAsync(CreateCategoryRequest request);
    Task<CategoryResponse?> UpdateAsync(string id, UpdateCategoryRequest request);
    Task<bool> DeleteAsync(string id);
}
