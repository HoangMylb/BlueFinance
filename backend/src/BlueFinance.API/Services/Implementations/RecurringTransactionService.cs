using Microsoft.EntityFrameworkCore;
using BlueFinance.API.Data;
using BlueFinance.API.DTOs.Requests;
using BlueFinance.API.DTOs.Responses;
using BlueFinance.API.Models;
using BlueFinance.API.Services.Interfaces;

namespace BlueFinance.API.Services.Implementations;

public class RecurringTransactionService : IRecurringTransactionService
{
    private readonly AppDbContext _context;

    public RecurringTransactionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<RecurringTransactionResponse>> GetAllAsync()
    {
        return await _context.RecurringTransactions
            .Include(r => r.Category)
            .Include(r => r.Wallet)
            .OrderBy(r => r.NextExecutionDate)
            .Select(r => ToResponse(r))
            .ToListAsync();
    }

    public async Task<RecurringTransactionResponse?> GetByIdAsync(string id)
    {
        var recurring = await _context.RecurringTransactions
            .Include(r => r.Category)
            .Include(r => r.Wallet)
            .FirstOrDefaultAsync(r => r.Id == id);

        return recurring is null ? null : ToResponse(recurring);
    }

    public async Task<RecurringTransactionResponse> CreateAsync(CreateRecurringTransactionRequest request)
    {
        var recurring = new RecurringTransaction
        {
            Name = request.Name,
            Amount = request.Amount,
            Type = request.Type,
            CategoryId = request.CategoryId,
            WalletId = request.WalletId,
            Frequency = request.Frequency,
            IsActive = request.IsActive,
            NextExecutionDate = request.NextExecutionDate
        };

        _context.RecurringTransactions.Add(recurring);
        await _context.SaveChangesAsync();

        var saved = await _context.RecurringTransactions
            .Include(r => r.Category)
            .Include(r => r.Wallet)
            .FirstAsync(r => r.Id == recurring.Id);

        return ToResponse(saved);
    }

    public async Task<RecurringTransactionResponse?> UpdateAsync(string id, UpdateRecurringTransactionRequest request)
    {
        var recurring = await _context.RecurringTransactions
            .Include(r => r.Category)
            .Include(r => r.Wallet)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (recurring is null) return null;

        recurring.Name = request.Name;
        recurring.Amount = request.Amount;
        recurring.Type = request.Type;
        recurring.CategoryId = request.CategoryId;
        recurring.WalletId = request.WalletId;
        recurring.Frequency = request.Frequency;
        recurring.IsActive = request.IsActive;
        recurring.NextExecutionDate = request.NextExecutionDate;

        await _context.SaveChangesAsync();

        return ToResponse(recurring);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var recurring = await _context.RecurringTransactions.FindAsync(id);
        if (recurring is null) return false;

        _context.RecurringTransactions.Remove(recurring);
        await _context.SaveChangesAsync();
        return true;
    }

    private static RecurringTransactionResponse ToResponse(RecurringTransaction r) => new()
    {
        Id = r.Id,
        Name = r.Name,
        Amount = r.Amount,
        Type = r.Type.ToString(),
        CategoryId = r.CategoryId,
        CategoryName = r.Category?.Name ?? "",
        WalletId = r.WalletId,
        WalletName = r.Wallet?.Name ?? "",
        Frequency = r.Frequency.ToString(),
        IsActive = r.IsActive,
        NextExecutionDate = r.NextExecutionDate
    };
}
