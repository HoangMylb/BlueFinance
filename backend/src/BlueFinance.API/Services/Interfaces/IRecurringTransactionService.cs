using BlueFinance.API.DTOs.Requests;
using BlueFinance.API.DTOs.Responses;

namespace BlueFinance.API.Services.Interfaces;

public interface IRecurringTransactionService
{
    Task<List<RecurringTransactionResponse>> GetAllAsync();
    Task<RecurringTransactionResponse?> GetByIdAsync(string id);
    Task<RecurringTransactionResponse> CreateAsync(CreateRecurringTransactionRequest request);
    Task<RecurringTransactionResponse?> UpdateAsync(string id, UpdateRecurringTransactionRequest request);
    Task<bool> DeleteAsync(string id);
}
