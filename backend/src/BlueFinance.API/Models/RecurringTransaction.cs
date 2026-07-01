using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BlueFinance.API.Enums;

namespace BlueFinance.API.Models;

public class RecurringTransaction
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString("N")[..8];

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    public CategoryType Type { get; set; }

    [Required]
    [MaxLength(50)]
    public string CategoryId { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string WalletId { get; set; } = string.Empty;

    [Required]
    public RecurringFrequency Frequency { get; set; }

    public bool IsActive { get; set; } = true;

    [Required]
    public DateTime NextExecutionDate { get; set; }

    // Navigation
    [ForeignKey(nameof(CategoryId))]
    public Category? Category { get; set; }

    [ForeignKey(nameof(WalletId))]
    public Wallet? Wallet { get; set; }
}
