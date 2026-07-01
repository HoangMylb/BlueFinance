using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BlueFinance.API.Models;

public class Budget
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString("N")[..8];

    [Required]
    [MaxLength(50)]
    public string CategoryId { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Amount { get; set; }

    // Navigation
    [ForeignKey(nameof(CategoryId))]
    public Category? Category { get; set; }
}
