using System.ComponentModel.DataAnnotations;
using BlueFinance.API.Enums;

namespace BlueFinance.API.Models;

public class AppSetting
{
    [Key]
    public int Id { get; set; } = 1;

    [Required]
    public CurrencyType Currency { get; set; } = CurrencyType.VND;

    [Required]
    public ThemeType Theme { get; set; } = ThemeType.Light;

    [Required]
    public LanguageType Language { get; set; } = LanguageType.Vi;
}
