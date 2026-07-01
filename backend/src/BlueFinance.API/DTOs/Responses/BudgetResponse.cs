namespace BlueFinance.API.DTOs.Responses;

public class BudgetResponse
{
    public string Id { get; set; } = string.Empty;
    public string CategoryId { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Spent { get; set; }
    public decimal Remaining => Amount - Spent;
    public double PercentUsed => Amount > 0 ? (double)(Spent / Amount) * 100 : 0;
}
