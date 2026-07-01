namespace BlueFinance.API.DTOs.Responses;

public class RecurringTransactionResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public string CategoryId { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string WalletId { get; set; } = string.Empty;
    public string WalletName { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime NextExecutionDate { get; set; }
}
