using System.ComponentModel.DataAnnotations;
using BlueFinance.API.Enums;

namespace BlueFinance.API.DTOs.Requests;

public class CreateRecurringTransactionRequest
{
    [Required(ErrorMessage = "Transaction name is required")]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

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
    public RecurringFrequency Frequency { get; set; }

    public bool IsActive { get; set; } = true;

    [Required]
    public DateTime NextExecutionDate { get; set; }
}

public class UpdateRecurringTransactionRequest
{
    [Required(ErrorMessage = "Transaction name is required")]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

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
    public RecurringFrequency Frequency { get; set; }

    public bool IsActive { get; set; } = true;

    [Required]
    public DateTime NextExecutionDate { get; set; }
}
