using System.ComponentModel.DataAnnotations;
using BlueFinance.API.Enums;

namespace BlueFinance.API.DTOs.Requests;

public class CreateCategoryRequest
{
    [Required(ErrorMessage = "Category name is required")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public CategoryType Type { get; set; }

    [MaxLength(50)]
    public string Icon { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Color { get; set; } = string.Empty;
}

public class UpdateCategoryRequest
{
    [Required(ErrorMessage = "Category name is required")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public CategoryType Type { get; set; }

    [MaxLength(50)]
    public string Icon { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Color { get; set; } = string.Empty;
}
