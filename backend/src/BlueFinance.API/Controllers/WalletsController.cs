using Microsoft.AspNetCore.Mvc;
using BlueFinance.API.DTOs.Requests;
using BlueFinance.API.Services.Interfaces;

namespace BlueFinance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WalletsController : ControllerBase
{
    private readonly IWalletService _walletService;

    public WalletsController(IWalletService walletService)
    {
        _walletService = walletService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var wallets = await _walletService.GetAllAsync();
        return Ok(wallets);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var wallet = await _walletService.GetByIdAsync(id);
        if (wallet is null)
            return NotFound(new { message = $"Wallet with ID '{id}' not found" });
        return Ok(wallet);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWalletRequest request)
    {
        var wallet = await _walletService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = wallet.Id }, wallet);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateWalletRequest request)
    {
        var wallet = await _walletService.UpdateAsync(id, request);
        if (wallet is null)
            return NotFound(new { message = $"Wallet with ID '{id}' not found" });
        return Ok(wallet);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _walletService.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = $"Wallet with ID '{id}' not found" });
        return NoContent();
    }
}
