using Microsoft.EntityFrameworkCore;
using BlueFinance.API.Data;
using BlueFinance.API.DTOs.Requests;
using BlueFinance.API.DTOs.Responses;
using BlueFinance.API.Enums;
using BlueFinance.API.Models;
using BlueFinance.API.Services.Interfaces;

namespace BlueFinance.API.Services.Implementations;

public class BudgetService : IBudgetService
{
    private readonly AppDbContext _context;

    public BudgetService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<BudgetResponse>> GetAllAsync()
    {
        var budgets = await _context.Budgets
            .Include(b => b.Category)
            .ToListAsync();

        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var endOfMonth = startOfMonth.AddMonths(1);

        var spentByCategory = await _context.Transactions
            .Where(t => t.Type == CategoryType.Expense
                        && t.Date >= startOfMonth
                        && t.Date < endOfMonth)
            .GroupBy(t => t.CategoryId)
            .Select(g => new { CategoryId = g.Key, Total = g.Sum(t => t.Amount) })
            .ToDictionaryAsync(x => x.CategoryId, x => x.Total);

        return budgets.Select(b => new BudgetResponse
        {
            Id = b.Id,
            CategoryId = b.CategoryId,
            CategoryName = b.Category?.Name ?? "",
            Amount = b.Amount,
            Spent = spentByCategory.GetValueOrDefault(b.CategoryId, 0)
        }).ToList();
    }

    public async Task<BudgetResponse?> GetByIdAsync(string id)
    {
        var budget = await _context.Budgets
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (budget is null) return null;

        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var endOfMonth = startOfMonth.AddMonths(1);

        var spent = await _context.Transactions
            .Where(t => t.Type == CategoryType.Expense
                        && t.CategoryId == budget.CategoryId
                        && t.Date >= startOfMonth
                        && t.Date < endOfMonth)
            .SumAsync(t => t.Amount);

        return new BudgetResponse
        {
            Id = budget.Id,
            CategoryId = budget.CategoryId,
            CategoryName = budget.Category?.Name ?? "",
            Amount = budget.Amount,
            Spent = spent
        };
    }

    public async Task<BudgetResponse> CreateAsync(CreateBudgetRequest request)
    {
        var budget = new Budget
        {
            CategoryId = request.CategoryId,
            Amount = request.Amount
        };

        _context.Budgets.Add(budget);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(budget.Id) ?? throw new InvalidOperationException("Failed to create budget");
    }

    public async Task<BudgetResponse?> UpdateAsync(string id, UpdateBudgetRequest request)
    {
        var budget = await _context.Budgets.FindAsync(id);
        if (budget is null) return null;

        budget.CategoryId = request.CategoryId;
        budget.Amount = request.Amount;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var budget = await _context.Budgets.FindAsync(id);
        if (budget is null) return false;

        _context.Budgets.Remove(budget);
        await _context.SaveChangesAsync();
        return true;
    }
}
