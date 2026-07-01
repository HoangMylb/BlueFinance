using BlueFinance.API.DTOs.Requests;
using BlueFinance.API.DTOs.Responses;

namespace BlueFinance.API.Services.Interfaces;

public interface IWalletService
{
    Task<List<WalletResponse>> GetAllAsync();
    Task<WalletResponse?> GetByIdAsync(string id);
    Task<WalletResponse> CreateAsync(CreateWalletRequest request);
    Task<WalletResponse?> UpdateAsync(string id, UpdateWalletRequest request);
    Task<bool> DeleteAsync(string id);
}
