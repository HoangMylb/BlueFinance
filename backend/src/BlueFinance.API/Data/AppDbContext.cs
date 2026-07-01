using Microsoft.EntityFrameworkCore;
using BlueFinance.API.Models;

namespace BlueFinance.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Wallet> Wallets => Set<Wallet>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Budget> Budgets => Set<Budget>();
    public DbSet<RecurringTransaction> RecurringTransactions => Set<RecurringTransaction>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<AppSetting> AppSettings => Set<AppSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Wallet
        modelBuilder.Entity<Wallet>(entity =>
        {
            entity.Property(e => e.Type)
                  .HasConversion<string>()
                  .HasMaxLength(20);

            entity.HasIndex(e => e.Name);
        });

        // Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.Property(e => e.Type)
                  .HasConversion<string>()
                  .HasMaxLength(10);
        });

        // Transaction
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.Property(e => e.Type)
                  .HasConversion<string>()
                  .HasMaxLength(10);

            entity.Property(e => e.Amount)
                  .HasColumnType("decimal(18,2)");

            entity.HasOne(e => e.Category)
                  .WithMany(c => c.Transactions)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Wallet)
                  .WithMany(w => w.Transactions)
                  .HasForeignKey(e => e.WalletId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.Date);
            entity.HasIndex(e => e.CategoryId);
            entity.HasIndex(e => e.WalletId);
        });

        // Budget
        modelBuilder.Entity<Budget>(entity =>
        {
            entity.Property(e => e.Amount)
                  .HasColumnType("decimal(18,2)");

            entity.HasOne(e => e.Category)
                  .WithMany(c => c.Budgets)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // RecurringTransaction
        modelBuilder.Entity<RecurringTransaction>(entity =>
        {
            entity.Property(e => e.Type)
                  .HasConversion<string>()
                  .HasMaxLength(10);

            entity.Property(e => e.Frequency)
                  .HasConversion<string>()
                  .HasMaxLength(10);

            entity.Property(e => e.Amount)
                  .HasColumnType("decimal(18,2)");

            entity.HasOne(e => e.Category)
                  .WithMany(c => c.RecurringTransactions)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Wallet)
                  .WithMany(w => w.RecurringTransactions)
                  .HasForeignKey(e => e.WalletId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // UserProfile (singleton)
        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasData(new UserProfile
            {
                Id = 1,
                Name = "Alex Nguyen",
                Email = "alex.nguyen@bluefinance.com",
                AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&q=80",
                MonthlySavingGoal = 15000000m
            });
        });

        // AppSetting (singleton)
        modelBuilder.Entity<AppSetting>(entity =>
        {
            entity.HasData(new AppSetting
            {
                Id = 1
            });
        });
    }
}
