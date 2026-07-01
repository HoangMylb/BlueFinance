using System.ComponentModel.DataAnnotations;
using BlueFinance.API.Enums;

namespace BlueFinance.API.DTOs.Requests;

public class CreateTransactionRequest
{
    [Required]
    [Range(0, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    public CategoryType Type { get; set; }

    [Required(ErrorMessage = "Category is required")]
    public string CategoryId { get; set; } = string.Empty;

    [Required(ErrorMessage = "Wallet is required")]
    public string WalletId { get; set; } = string.Empty;

    [Required]
    public DateTime Date { get; set; }

    [MaxLength(500)]
    public string Note { get; set; } = string.Empty;
}

public class UpdateTransactionRequest
{
    [Required]
    [Range(0, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    public CategoryType Type { get; set; }

    [Required(ErrorMessage = "Category is required")]
    public string CategoryId { get; set; } = string.Empty;

    [Required(ErrorMessage = "Wallet is required")]
    public string WalletId { get; set; } = string.Empty;

    [Required]
    public DateTime Date { get; set; }

    [MaxLength(500)]
    public string Note { get; set; } = string.Empty;
}
