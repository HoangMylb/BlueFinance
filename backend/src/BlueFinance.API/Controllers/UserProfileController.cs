using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlueFinance.API.Data;
using BlueFinance.API.Models;

namespace BlueFinance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserProfileController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserProfileController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var profile = await _context.UserProfiles.FirstOrDefaultAsync();
        if (profile is null)
            return NotFound(new { message = "User profile not found" });
        return Ok(new
        {
            profile.Name,
            profile.Email,
            profile.AvatarUrl,
            profile.MonthlySavingGoal
        });
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateProfileRequest request)
    {
        var profile = await _context.UserProfiles.FirstOrDefaultAsync();
        if (profile is null)
        {
            profile = new UserProfile();
            _context.UserProfiles.Add(profile);
        }

        profile.Name = request.Name;
        profile.Email = request.Email;
        profile.AvatarUrl = request.AvatarUrl ?? profile.AvatarUrl;
        profile.MonthlySavingGoal = request.MonthlySavingGoal;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            profile.Name,
            profile.Email,
            profile.AvatarUrl,
            profile.MonthlySavingGoal
        });
    }
}

public class UpdateProfileRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public decimal MonthlySavingGoal { get; set; }
}
