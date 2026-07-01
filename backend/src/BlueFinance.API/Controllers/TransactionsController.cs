using Microsoft.AspNetCore.Mvc;
using BlueFinance.API.DTOs.Requests;
using BlueFinance.API.Services.Interfaces;

namespace BlueFinance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? categoryId, [FromQuery] string? walletId)
    {
        var transactions = await _transactionService.GetAllAsync(categoryId, walletId);
        return Ok(transactions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var transaction = await _transactionService.GetByIdAsync(id);
        if (transaction is null)
            return NotFound(new { message = $"Transaction with ID '{id}' not found" });
        return Ok(transaction);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTransactionRequest request)
    {
        var transaction = await _transactionService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateTransactionRequest request)
    {
        var transaction = await _transactionService.UpdateAsync(id, request);
        if (transaction is null)
            return NotFound(new { message = $"Transaction with ID '{id}' not found" });
        return Ok(transaction);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _transactionService.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = $"Transaction with ID '{id}' not found" });
        return NoContent();
    }
}
