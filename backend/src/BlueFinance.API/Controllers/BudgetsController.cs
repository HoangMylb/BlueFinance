using Microsoft.AspNetCore.Mvc;
using BlueFinance.API.DTOs.Requests;
using BlueFinance.API.Services.Interfaces;

namespace BlueFinance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BudgetsController : ControllerBase
{
    private readonly IBudgetService _budgetService;

    public BudgetsController(IBudgetService budgetService)
    {
        _budgetService = budgetService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var budgets = await _budgetService.GetAllAsync();
        return Ok(budgets);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var budget = await _budgetService.GetByIdAsync(id);
        if (budget is null)
            return NotFound(new { message = $"Budget with ID '{id}' not found" });
        return Ok(budget);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBudgetRequest request)
    {
        var budget = await _budgetService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = budget.Id }, budget);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateBudgetRequest request)
    {
        var budget = await _budgetService.UpdateAsync(id, request);
        if (budget is null)
            return NotFound(new { message = $"Budget with ID '{id}' not found" });
        return Ok(budget);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _budgetService.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = $"Budget with ID '{id}' not found" });
        return NoContent();
    }
}
