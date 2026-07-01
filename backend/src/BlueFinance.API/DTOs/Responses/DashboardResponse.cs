namespace BlueFinance.API.DTOs.Responses;

public class DashboardResponse
{
    public List<WalletResponse> Wallets { get; set; } = new();
    public List<CategoryResponse> Categories { get; set; } = new();
    public List<TransactionResponse> Transactions { get; set; } = new();
    public List<BudgetResponse> Budgets { get; set; } = new();
    public List<RecurringTransactionResponse> Recurring { get; set; } = new();
    public DashboardSummary Summary { get; set; } = new();
}

public class DashboardSummary
{
    public decimal TotalBalance { get; set; }
    public decimal MonthlyIncome { get; set; }
    public decimal MonthlyExpense { get; set; }
}
