using Microsoft.AspNetCore.Mvc;
using BlueFinance.API.DTOs.Responses;
using BlueFinance.API.Services.Interfaces;

namespace BlueFinance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IWalletService _walletService;
    private readonly ICategoryService _categoryService;
    private readonly ITransactionService _transactionService;
    private readonly IBudgetService _budgetService;
    private readonly IRecurringTransactionService _recurringService;

    public DashboardController(
        IWalletService walletService,
        ICategoryService categoryService,
        ITransactionService transactionService,
        IBudgetService budgetService,
        IRecurringTransactionService recurringService)
    {
        _walletService = walletService;
        _categoryService = categoryService;
        _transactionService = transactionService;
        _budgetService = budgetService;
        _recurringService = recurringService;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var walletsTask = _walletService.GetAllAsync();
        var categoriesTask = _categoryService.GetAllAsync();
        var transactionsTask = _transactionService.GetAllAsync();
        var budgetsTask = _budgetService.GetAllAsync();
        var recurringTask = _recurringService.GetAllAsync();

        await Task.WhenAll(walletsTask, categoriesTask, transactionsTask, budgetsTask, recurringTask);

        var wallets = walletsTask.Result;
        var categories = categoriesTask.Result;
        var transactions = transactionsTask.Result;
        var budgets = budgetsTask.Result;
        var recurring = recurringTask.Result;

        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var monthTransactions = transactions.Where(t => t.Date >= monthStart).ToList();

        var response = new DashboardResponse
        {
            Wallets = wallets,
            Categories = categories,
            Transactions = transactions.OrderByDescending(t => t.Date).ToList(),
            Budgets = budgets,
            Recurring = recurring,
            Summary = new DashboardSummary
            {
                TotalBalance = wallets.Sum(w => w.Balance),
                MonthlyIncome = monthTransactions
                    .Where(t => t.Type == "Income")
                    .Sum(t => t.Amount),
                MonthlyExpense = monthTransactions
                    .Where(t => t.Type == "Expense")
                    .Sum(t => t.Amount),
            }
        };

        return Ok(response);
    }
}
