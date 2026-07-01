using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlueFinance.API.Data;
using BlueFinance.API.Enums;
using BlueFinance.API.Models;

namespace BlueFinance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppSettingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AppSettingsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var settings = await _context.AppSettings.FirstOrDefaultAsync();
        if (settings is null)
            return NotFound(new { message = "App settings not found" });
        return Ok(new
        {
            settings.Currency,
            settings.Theme,
            settings.Language
        });
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateSettingsRequest request)
    {
        var settings = await _context.AppSettings.FirstOrDefaultAsync();
        if (settings is null)
        {
            settings = new AppSetting();
            _context.AppSettings.Add(settings);
        }

        settings.Currency = request.Currency;
        settings.Theme = request.Theme;
        settings.Language = request.Language;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            settings.Currency,
            settings.Theme,
            settings.Language
        });
    }
}

public class UpdateSettingsRequest
{
    public CurrencyType Currency { get; set; }
    public ThemeType Theme { get; set; }
    public LanguageType Language { get; set; }
}
