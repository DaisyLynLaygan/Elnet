using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using HomeOwner.Models;
using Microsoft.EntityFrameworkCore;
using HomeOwner.Data;

namespace HomeOwner.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly HomeOwnerContext _context;

    public HomeController(ILogger<HomeController> logger, HomeOwnerContext dbcontext)
    {
        _logger = logger;
        _context = dbcontext;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    public IActionResult Login()
    {
        return View();
    }

    public IActionResult LoginTask(string? Username, string Password)
    {
        if (Username?.CompareTo("admin") == 0 && Password.CompareTo("admin") == 0)
        {
            return RedirectToAction("AdminDashboard", "Admin");
        }
        else
        {
            var user = _context.User.FirstOrDefault(m => m.username == Username && m.user_password == Password);
            if (user == null)
            {
                TempData["invalidLogin"] = "Incorrect username and password.";
                return RedirectToAction("Index", "Home");
            }
            else
            {

                HttpContext.Session.SetObject("CurrentUser", user);
                return RedirectToAction("Dashboard", "Homeowner");
            }
        }
    }

    [HttpGet]
    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Create(User model)
    {
        if (ModelState.IsValid)
        {
            // Map Register model to User model
            var checkUser = _context.User.FirstOrDefault(m => m.username == model.username);

            if (checkUser == null)
            {
                var user = new User
                {
                    username = model.username,
                    user_password = model.user_password,
                    email = model.email,
                    address = model.address,
                    contact_no = model.contact_no,
                    firstname = model.firstname,
                    lastname = model.lastname,
                    date_created = DateOnly.FromDateTime(DateTime.Now)
                };


                // Save the user to the database
                _context.User.Add(user);
                _context.SaveChanges();


                // Redirect to the Login page
                return RedirectToAction("Login");
            }
            ViewBag.message = "Error username existed";
            return View();
        }

        // If the model is invalid, return to the registration form
        return View(model);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

            public IActionResult LogOut()
        {
            // Clear the session (if used)
            HttpContext.Session.Clear();

            // Redirect to the Index page
            return RedirectToAction("Index");
        }
}