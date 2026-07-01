using BlueFinance.API.DTOs.Requests;
using BlueFinance.API.DTOs.Responses;

namespace BlueFinance.API.Services.Interfaces;

public interface IBudgetService
{
    Task<List<BudgetResponse>> GetAllAsync();
    Task<BudgetResponse?> GetByIdAsync(string id);
    Task<BudgetResponse> CreateAsync(CreateBudgetRequest request);
    Task<BudgetResponse?> UpdateAsync(string id, UpdateBudgetRequest request);
    Task<bool> DeleteAsync(string id);
}
