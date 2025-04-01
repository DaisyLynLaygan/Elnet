using HomeOwner.Models;
using Microsoft.AspNetCore.Mvc;
using HomeOwner.Data;


namespace HomeOwner.Controllers
{

    public class StaffController : BaseController
    {
        private readonly HomeOwnerContext _context;

        public StaffController(HomeOwnerContext db)
        {
            _context = db;
        }


        public IActionResult StaffDashboard()
        {
            ViewContents();
            return View();
        }
      }
    }
