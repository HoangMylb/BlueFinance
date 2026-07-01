using System.ComponentModel.DataAnnotations;

namespace BlueFinance.API.DTOs.Requests;

public class CreateBudgetRequest
{
    [Required(ErrorMessage = "Category is required")]
    public string CategoryId { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Amount { get; set; }
}

public class UpdateBudgetRequest
{
    [Required(ErrorMessage = "Category is required")]
    public string CategoryId { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Amount { get; set; }
}
