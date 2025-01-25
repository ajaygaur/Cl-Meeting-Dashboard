using Microsoft.EntityFrameworkCore;
using POC.Models;

namespace POC.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Meeting> meeting { get; set; }
        public DbSet<ActionItem> actionitem { get; set; }
        public DbSet<Recording> recording { get; set; }

    }
}
