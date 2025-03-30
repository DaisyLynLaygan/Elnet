using HomeOwner.Data;
using HomeOwner.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace HomeOwner.Controllers
{
    public class AdminController : Controller
    {
        private readonly HomeOwnerContext _context;
        public AdminController(HomeOwnerContext db)
        {
            _context = db;
        }

        public IActionResult Dashboard()
        {
            var userJson = HttpContext.Session.GetString("CurrentUser");

            if (string.IsNullOrEmpty(userJson))
            {
                return RedirectToAction("Index", "Home"); // Redirect if no user is logged in
            }

            var user = JsonConvert.DeserializeObject<User>(userJson);

            if (user == null)
            {
                return RedirectToAction("Index", "Home"); // Redirect if deserialization fails
            }

            ViewBag.CurrentUser = user;
            ViewBag.ActiveMenu = "Dashboard";
            return View();
        }

        
        public IActionResult Announcements()
        {
            var userJson = HttpContext.Session.GetString("CurrentUser");
            
            if (string.IsNullOrEmpty(userJson))
            {
                return RedirectToAction("Index", "Home");
            }

            var user = JsonConvert.DeserializeObject<User>(userJson);

            if (user == null)
            {
                return RedirectToAction("Index", "Home");
            }

            ViewBag.CurrentUser = user;
            ViewBag.ActiveMenu = "Announcements";
            return View("AdminAnnouncements"); // if you want to keep the current view name
            return View();

        }
    
        public IActionResult Documents() => View("AdminDocuments");

        public IActionResult Reservations() => View("AdminReservations");

        public IActionResult Polls() => View("AdminPolls");

        public IActionResult Events() => View("AdminEvents");

        public IActionResult Users() => View("AdminUsers");

        public IActionResult Feedback() => View("AdminFeedback");

        public IActionResult ServiceRequests() => View("AdminServiceRequests");
    }
}
