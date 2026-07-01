using Microsoft.EntityFrameworkCore;
using BlueFinance.API.Data;
using BlueFinance.API.DTOs.Requests;
using BlueFinance.API.DTOs.Responses;
using BlueFinance.API.Models;
using BlueFinance.API.Services.Interfaces;

namespace BlueFinance.API.Services.Implementations;

public class WalletService : IWalletService
{
    private readonly AppDbContext _context;

    public WalletService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<WalletResponse>> GetAllAsync()
    {
        return await _context.Wallets
            .OrderBy(w => w.CreatedAt)
            .Select(w => ToResponse(w))
            .ToListAsync();
    }

    public async Task<WalletResponse?> GetByIdAsync(string id)
    {
        var wallet = await _context.Wallets.FindAsync(id);
        return wallet is null ? null : ToResponse(wallet);
    }

    public async Task<WalletResponse> CreateAsync(CreateWalletRequest request)
    {
        var wallet = new Wallet
        {
            Name = request.Name,
            Type = request.Type,
            Balance = request.Balance,
            Color = request.Color,
            IsActive = request.IsActive
        };

        _context.Wallets.Add(wallet);
        await _context.SaveChangesAsync();

        return ToResponse(wallet);
    }

    public async Task<WalletResponse?> UpdateAsync(string id, UpdateWalletRequest request)
    {
        var wallet = await _context.Wallets.FindAsync(id);
        if (wallet is null) return null;

        wallet.Name = request.Name;
        wallet.Type = request.Type;
        wallet.Balance = request.Balance;
        wallet.Color = request.Color;
        wallet.IsActive = request.IsActive;
        wallet.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return ToResponse(wallet);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var wallet = await _context.Wallets.FindAsync(id);
        if (wallet is null) return false;

        _context.Wallets.Remove(wallet);
        await _context.SaveChangesAsync();
        return true;
    }

    private static WalletResponse ToResponse(Wallet w) => new()
    {
        Id = w.Id,
        Name = w.Name,
        Type = w.Type.ToString(),
        Balance = w.Balance,
        Color = w.Color,
        IsActive = w.IsActive,
        CreatedAt = w.CreatedAt
    };
}
