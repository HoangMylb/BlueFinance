using Microsoft.AspNetCore.Mvc;
using BlueFinance.API.DTOs.Requests;
using BlueFinance.API.Services.Interfaces;

namespace BlueFinance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecurringTransactionsController : ControllerBase
{
    private readonly IRecurringTransactionService _recurringService;

    public RecurringTransactionsController(IRecurringTransactionService recurringService)
    {
        _recurringService = recurringService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var recurring = await _recurringService.GetAllAsync();
        return Ok(recurring);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var recurring = await _recurringService.GetByIdAsync(id);
        if (recurring is null)
            return NotFound(new { message = $"Recurring transaction with ID '{id}' not found" });
        return Ok(recurring);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRecurringTransactionRequest request)
    {
        var recurring = await _recurringService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = recurring.Id }, recurring);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateRecurringTransactionRequest request)
    {
        var recurring = await _recurringService.UpdateAsync(id, request);
        if (recurring is null)
            return NotFound(new { message = $"Recurring transaction with ID '{id}' not found" });
        return Ok(recurring);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _recurringService.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = $"Recurring transaction with ID '{id}' not found" });
        return NoContent();
    }
}
