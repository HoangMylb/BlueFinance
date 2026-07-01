namespace BlueFinance.API.DTOs.Responses;

public class TransactionResponse
{
    public string Id { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public string CategoryId { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string WalletId { get; set; } = string.Empty;
    public string WalletName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Note { get; set; } = string.Empty;
}
