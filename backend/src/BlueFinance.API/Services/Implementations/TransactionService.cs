using Microsoft.EntityFrameworkCore;
using BlueFinance.API.Data;
using BlueFinance.API.DTOs.Requests;
using BlueFinance.API.DTOs.Responses;
using BlueFinance.API.Models;
using BlueFinance.API.Services.Interfaces;

namespace BlueFinance.API.Services.Implementations;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _context;

    public TransactionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TransactionResponse>> GetAllAsync(string? categoryId = null, string? walletId = null)
    {
        var query = _context.Transactions
            .Include(t => t.Category)
            .Include(t => t.Wallet)
            .AsQueryable();

        if (!string.IsNullOrEmpty(categoryId))
            query = query.Where(t => t.CategoryId == categoryId);

        if (!string.IsNullOrEmpty(walletId))
            query = query.Where(t => t.WalletId == walletId);

        return await query
            .OrderByDescending(t => t.Date)
            .Select(t => ToResponse(t))
            .ToListAsync();
    }

    public async Task<TransactionResponse?> GetByIdAsync(string id)
    {
        var transaction = await _context.Transactions
            .Include(t => t.Category)
            .Include(t => t.Wallet)
            .FirstOrDefaultAsync(t => t.Id == id);

        return transaction is null ? null : ToResponse(transaction);
    }

    public async Task<TransactionResponse> CreateAsync(CreateTransactionRequest request)
    {
        var transaction = new Transaction
        {
            Amount = request.Amount,
            Type = request.Type,
            CategoryId = request.CategoryId,
            WalletId = request.WalletId,
            Date = request.Date,
            Note = request.Note
        };

        _context.Transactions.Add(transaction);

        // Update wallet balance
        var wallet = await _context.Wallets.FindAsync(request.WalletId);
        if (wallet is not null)
        {
            wallet.Balance = request.Type == Enums.CategoryType.Income
                ? wallet.Balance + request.Amount
                : wallet.Balance - request.Amount;
            wallet.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        // Reload with navigation properties
        var saved = await _context.Transactions
            .Include(t => t.Category)
            .Include(t => t.Wallet)
            .FirstAsync(t => t.Id == transaction.Id);

        return ToResponse(saved);
    }

    public async Task<TransactionResponse?> UpdateAsync(string id, UpdateTransactionRequest request)
    {
        var transaction = await _context.Transactions
            .Include(t => t.Category)
            .Include(t => t.Wallet)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (transaction is null) return null;

        // Reverse old balance effect
        var wallet = await _context.Wallets.FindAsync(transaction.WalletId);
        if (wallet is not null)
        {
            wallet.Balance = transaction.Type == Enums.CategoryType.Income
                ? wallet.Balance - transaction.Amount
                : wallet.Balance + transaction.Amount;
        }

        transaction.Amount = request.Amount;
        transaction.Type = request.Type;
        transaction.CategoryId = request.CategoryId;
        transaction.WalletId = request.WalletId;
        transaction.Date = request.Date;
        transaction.Note = request.Note;

        // Apply new balance effect
        if (wallet is not null)
        {
            wallet.Balance = request.Type == Enums.CategoryType.Income
                ? wallet.Balance + request.Amount
                : wallet.Balance - request.Amount;
            wallet.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return ToResponse(transaction);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction is null) return false;

        // Reverse balance effect
        var wallet = await _context.Wallets.FindAsync(transaction.WalletId);
        if (wallet is not null)
        {
            wallet.Balance = transaction.Type == Enums.CategoryType.Income
                ? wallet.Balance - transaction.Amount
                : wallet.Balance + transaction.Amount;
            wallet.UpdatedAt = DateTime.UtcNow;
        }

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
        return true;
    }

    private static TransactionResponse ToResponse(Transaction t) => new()
    {
        Id = t.Id,
        Amount = t.Amount,
        Type = t.Type.ToString(),
        CategoryId = t.CategoryId,
        CategoryName = t.Category?.Name ?? "",
        WalletId = t.WalletId,
        WalletName = t.Wallet?.Name ?? "",
        Date = t.Date,
        Note = t.Note
    };
}
