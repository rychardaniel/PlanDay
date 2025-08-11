using Microsoft.EntityFrameworkCore;
using PlanDayAPI.Models;

namespace PlanDayAPI.Data;

public class AppDbContext : DbContext
{
    public DbSet<EventModel> Events { get; set; }
    public DbSet<EventTypesModel> EventTypes { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }
}