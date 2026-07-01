using Microsoft.EntityFrameworkCore;
using BlueFinance.API.Data;
using BlueFinance.API.DTOs.Requests;
using BlueFinance.API.DTOs.Responses;
using BlueFinance.API.Models;
using BlueFinance.API.Services.Interfaces;

namespace BlueFinance.API.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;

    public CategoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryResponse>> GetAllAsync()
    {
        return await _context.Categories
            .OrderBy(c => c.Name)
            .Select(c => ToResponse(c))
            .ToListAsync();
    }

    public async Task<CategoryResponse?> GetByIdAsync(string id)
    {
        var category = await _context.Categories.FindAsync(id);
        return category is null ? null : ToResponse(category);
    }

    public async Task<CategoryResponse> CreateAsync(CreateCategoryRequest request)
    {
        var category = new Category
        {
            Name = request.Name,
            Type = request.Type,
            Icon = request.Icon,
            Color = request.Color
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return ToResponse(category);
    }

    public async Task<CategoryResponse?> UpdateAsync(string id, UpdateCategoryRequest request)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category is null) return null;

        category.Name = request.Name;
        category.Type = request.Type;
        category.Icon = request.Icon;
        category.Color = request.Color;

        await _context.SaveChangesAsync();

        return ToResponse(category);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category is null) return false;

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return true;
    }

    private static CategoryResponse ToResponse(Category c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Type = c.Type.ToString(),
        Icon = c.Icon,
        Color = c.Color
    };
}
