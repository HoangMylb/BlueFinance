using BlueFinance.API.Enums;
using BlueFinance.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BlueFinance.API.Data;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Auto-migrate on startup
        await context.Database.MigrateAsync();

        // Only seed if empty
        if (await context.Wallets.AnyAsync())
            return;

        // ─── Wallets ────────────────────────────────────────────────────────
        var wallets = new List<Wallet>
        {
            new()
            {
                Id = "w-1",
                Name = "Tiền mặt (Physical Cash)",
                Type = WalletType.Cash,
                Balance = 2_500_000m,
                Color = "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                IsActive = true
            },
            new()
            {
                Id = "w-2",
                Name = "Techcombank",
                Type = WalletType.Bank,
                Balance = 130_250_000m,
                Color = "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                IsActive = true
            },
            new()
            {
                Id = "w-3",
                Name = "Momo E-Wallet",
                Type = WalletType.EWallet,
                Balance = 12_500_000m,
                Color = "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                IsActive = true
            }
        };
        context.Wallets.AddRange(wallets);

        // ─── Categories ─────────────────────────────────────────────────────
        var categories = new List<Category>
        {
            new() { Id = "c-1", Name = "Ăn uống (Food & Dining)",      Type = CategoryType.Expense, Icon = "Utensils",     Color = "amber" },
            new() { Id = "c-2", Name = "Di chuyển (Transportation)",   Type = CategoryType.Expense, Icon = "Car",          Color = "blue" },
            new() { Id = "c-3", Name = "Mua sắm tạp hóa (Groceries)",  Type = CategoryType.Expense, Icon = "ShoppingBag",  Color = "emerald" },
            new() { Id = "c-4", Name = "Nhà ở & Điện nước (Housing & Bills)", Type = CategoryType.Expense, Icon = "Home", Color = "indigo" },
            new() { Id = "c-5", Name = "Giải trí (Entertainment)",     Type = CategoryType.Expense, Icon = "Tv",          Color = "purple" },
            new() { Id = "c-6", Name = "Mua sắm (Shopping)",            Type = CategoryType.Expense, Icon = "Tag",         Color = "rose" },
            new() { Id = "c-7", Name = "Lương (Salary)",               Type = CategoryType.Income,  Icon = "Briefcase",   Color = "teal" },
            new() { Id = "c-8", Name = "Làm thêm (Freelance)",          Type = CategoryType.Income,  Icon = "Laptop",      Color = "cyan" },
            new() { Id = "c-9", Name = "Đầu tư (Investments)",          Type = CategoryType.Income,  Icon = "TrendingUp",  Color = "emerald" }
        };
        context.Categories.AddRange(categories);

        // ─── Transactions ───────────────────────────────────────────────────
        var transactions = new List<Transaction>
        {
            new() { Id = "t-1",  Amount = 142_500m,   Type = CategoryType.Expense, CategoryId = "c-1", WalletId = "w-1", Date = Date(0),  Note = "Ăn tối bún chả (Whole Foods)" },
            new() { Id = "t-2",  Amount = 41_200_000m, Type = CategoryType.Income,  CategoryId = "c-7", WalletId = "w-2", Date = Date(1),  Note = "Lương TechCorp tháng này" },
            new() { Id = "t-3",  Amount = 64_000m,     Type = CategoryType.Expense, CategoryId = "c-1", WalletId = "w-3", Date = Date(2),  Note = "Cà phê Starbucks sáng" },
            new() { Id = "t-4",  Amount = 240_000m,    Type = CategoryType.Expense, CategoryId = "c-5", WalletId = "w-3", Date = Date(3),  Note = "Gói Netflix Premium hàng tháng" },
            new() { Id = "t-5",  Amount = 450_000m,    Type = CategoryType.Expense, CategoryId = "c-2", WalletId = "w-2", Date = Date(4),  Note = "Đổ xăng ô tô Shell" },
            new() { Id = "t-6",  Amount = 1_200_000m,  Type = CategoryType.Expense, CategoryId = "c-6", WalletId = "w-2", Date = Date(5),  Note = "Mua giày chạy bộ mới" },
            new() { Id = "t-7",  Amount = 5_000_000m,  Type = CategoryType.Income,  CategoryId = "c-8", WalletId = "w-2", Date = Date(6),  Note = "Thiết kế website freelance" },
            new() { Id = "t-8",  Amount = 1_500_000m,  Type = CategoryType.Expense, CategoryId = "c-3", WalletId = "w-1", Date = Date(7),  Note = "Đi siêu thị Winmart mua đồ cả tuần" },
            new() { Id = "t-9",  Amount = 6_500_000m,  Type = CategoryType.Expense, CategoryId = "c-4", WalletId = "w-2", Date = Date(10), Note = "Tiền thuê nhà tháng này" },
            new() { Id = "t-10", Amount = 800_000m,    Type = CategoryType.Expense, CategoryId = "c-4", WalletId = "w-2", Date = Date(12), Note = "Tiền điện nước internet" },
            new() { Id = "t-11", Amount = 1_500_000m,  Type = CategoryType.Income,  CategoryId = "c-9", WalletId = "w-2", Date = Date(15), Note = "Cổ tức chứng khoán" },
            new() { Id = "t-12", Amount = 320_000m,    Type = CategoryType.Expense, CategoryId = "c-1", WalletId = "w-1", Date = Date(18), Note = "Ăn trưa buffet cùng đồng nghiệp" }
        };
        context.Transactions.AddRange(transactions);

        // ─── Budgets ────────────────────────────────────────────────────────
        var budgets = new List<Budget>
        {
            new() { Id = "b-1", CategoryId = "c-1", Amount = 5_000_000m },
            new() { Id = "b-2", CategoryId = "c-2", Amount = 2_000_000m },
            new() { Id = "b-3", CategoryId = "c-6", Amount = 3_000_000m },
            new() { Id = "b-4", CategoryId = "c-3", Amount = 4_000_000m },
            new() { Id = "b-5", CategoryId = "c-5", Amount = 1_500_000m }
        };
        context.Budgets.AddRange(budgets);

        // ─── Recurring Transactions ─────────────────────────────────────────
        var recurring = new List<RecurringTransaction>
        {
            new()
            {
                Id = "r-1",
                Name = "Lương chính thức TechCorp",
                Amount = 41_200_000m,
                Type = CategoryType.Income,
                CategoryId = "c-7",
                WalletId = "w-2",
                Frequency = RecurringFrequency.Monthly,
                IsActive = true,
                NextExecutionDate = Date(-29)
            },
            new()
            {
                Id = "r-2",
                Name = "Tiền thuê nhà Vinhomes",
                Amount = 6_500_000m,
                Type = CategoryType.Expense,
                CategoryId = "c-4",
                WalletId = "w-2",
                Frequency = RecurringFrequency.Monthly,
                IsActive = true,
                NextExecutionDate = Date(-10)
            },
            new()
            {
                Id = "r-3",
                Name = "Gói Netflix Premium",
                Amount = 240_000m,
                Type = CategoryType.Expense,
                CategoryId = "c-5",
                WalletId = "w-3",
                Frequency = RecurringFrequency.Monthly,
                IsActive = true,
                NextExecutionDate = Date(-27)
            },
            new()
            {
                Id = "r-4",
                Name = "Gói tập Gym California",
                Amount = 800_000m,
                Type = CategoryType.Expense,
                CategoryId = "c-5",
                WalletId = "w-2",
                Frequency = RecurringFrequency.Monthly,
                IsActive = false,
                NextExecutionDate = Date(-1)
            }
        };
        context.RecurringTransactions.AddRange(recurring);

        await context.SaveChangesAsync();
    }

    /// <summary>
    /// Returns a past (or future) date relative to today.
    /// Positive daysAgo = past, negative = future.
    /// </summary>
    private static DateTime Date(int daysAgo)
    {
        return DateTime.UtcNow.Date.AddDays(-daysAgo);
    }
}
