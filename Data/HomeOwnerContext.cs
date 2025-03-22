using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HomeOwner.Models;

namespace HomeOwner.Data
{
    public class HomeOwnerContext : DbContext
    {
        public HomeOwnerContext (DbContextOptions<HomeOwnerContext> options)
            : base(options)
        {
        }

        public DbSet<HomeOwner.Models.User> User { get; set; } = default!;
    }
}
