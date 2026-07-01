using BlueFinance.API.DTOs.Requests;
using BlueFinance.API.DTOs.Responses;

namespace BlueFinance.API.Services.Interfaces;

public interface ITransactionService
{
    Task<List<TransactionResponse>> GetAllAsync(string? categoryId = null, string? walletId = null);
    Task<TransactionResponse?> GetByIdAsync(string id);
    Task<TransactionResponse> CreateAsync(CreateTransactionRequest request);
    Task<TransactionResponse?> UpdateAsync(string id, UpdateTransactionRequest request);
    Task<bool> DeleteAsync(string id);
}
