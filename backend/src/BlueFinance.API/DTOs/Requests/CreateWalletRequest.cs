using System.ComponentModel.DataAnnotations;
using BlueFinance.API.Enums;

namespace BlueFinance.API.DTOs.Requests;

public class CreateWalletRequest
{
    [Required(ErrorMessage = "Wallet name is required")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public WalletType Type { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Balance { get; set; }

    [MaxLength(200)]
    public string Color { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}

public class UpdateWalletRequest
{
    [Required(ErrorMessage = "Wallet name is required")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public WalletType Type { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Balance { get; set; }

    [MaxLength(200)]
    public string Color { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}
