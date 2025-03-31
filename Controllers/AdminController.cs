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

        // Private method to check if user is logged in and return user
        private User GetCurrentUser()
        {
            var userJson = HttpContext.Session.GetString("CurrentUser");

            if (string.IsNullOrEmpty(userJson))
            {
                return null;
            }

            var user = JsonConvert.DeserializeObject<User>(userJson);
            return user;
        }

        public IActionResult Dashboard()
        {
            var user = GetCurrentUser();

            if (user == null)
            {
                return RedirectToAction("Index", "Home"); // Redirect if no user is logged in or deserialization fails
            }

            ViewBag.CurrentUser = user;
            ViewBag.ActiveMenu = "Dashboard";
            return View();
        }

        public IActionResult Announcements()
        {
            var user = GetCurrentUser();

            if (user == null)
            {
                return RedirectToAction("Index", "Home");
            }

            ViewBag.CurrentUser = user;
            ViewBag.ActiveMenu = "Announcements";
            return View("AdminAnnouncements"); // Use this if you want to keep the current view name
        }

        public IActionResult Documents()
        {
            var user = GetCurrentUser();

            if (user == null)
            {
                return RedirectToAction("Index", "Home");
            }

            ViewBag.CurrentUser = user;
            ViewBag.ActiveMenu = "Documents";
            return View("AdminDocuments");
        }

        public IActionResult Reservations()
        {
            var user = GetCurrentUser();

            if (user == null)
            {
                return RedirectToAction("Index", "Home");
            }

            ViewBag.CurrentUser = user;
            ViewBag.ActiveMenu = "Reservations";
            return View("AdminReservations");
        }

        public IActionResult Polls()
        {
            var user = GetCurrentUser();

            if (user == null)
            {
                return RedirectToAction("Index", "Home");
            }

            ViewBag.CurrentUser = user;
            ViewBag.ActiveMenu = "Polls";
            return View("AdminPolls");
        }

        public IActionResult Events()
        {
            var user = GetCurrentUser();

            if (user == null)
            {
                return RedirectToAction("Index", "Home");
            }

            ViewBag.CurrentUser = user;
            ViewBag.ActiveMenu = "Events";
            return View("AdminEvents");
        }

        public IActionResult Users()
        {
            var user = GetCurrentUser();

            if (user == null)
            {
                return RedirectToAction("Index", "Home");
            }

            ViewBag.CurrentUser = user;
            ViewBag.ActiveMenu = "Users";
            return View("AdminUsers");
        }

        public IActionResult Feedback()
        {
            var user = GetCurrentUser();

            if (user == null)
            {
                return RedirectToAction("Index", "Home");
            }

            ViewBag.CurrentUser = user;
            ViewBag.ActiveMenu = "Feedback";
            return View("AdminFeedback");
        }

        public IActionResult ServiceRequests()
        {
            var user = GetCurrentUser();

            if (user == null)
            {
                return RedirectToAction("Index", "Home");
            }

            ViewBag.CurrentUser = user;
            ViewBag.ActiveMenu = "ServiceRequests";
            return View("AdminServiceRequests");
        }
    }
}
