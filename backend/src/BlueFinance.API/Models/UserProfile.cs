using System.ComponentModel.DataAnnotations;

namespace BlueFinance.API.Models;

public class UserProfile
{
    [Key]
    public int Id { get; set; } = 1;

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [MaxLength(500)]
    public string AvatarUrl { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal MonthlySavingGoal { get; set; }
}
