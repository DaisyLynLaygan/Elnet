using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using HomeOwner.Models;
using Microsoft.EntityFrameworkCore;
using HomeOwner.Data;

namespace HomeOwner.Controllers;

public class HomeController(ILogger<HomeController> logger, HomeOwnerContext dbcontext) : Controller
{
    private readonly ILogger<HomeController> logger;
    private readonly HomeOwnerContext _context = dbcontext;
 
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
    public async Task<IActionResult> LoginTask(string? Username, string Password)
    {
        if (Username?.CompareTo("admin") == 0 && Password.CompareTo("admin") == 0)
        {
            return RedirectToAction("Index", "Admin");
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
                HttpContext.Session.SetString("name", user?.username);
                HttpContext.Session.SetInt32("id", (int)user.user_id);
                return RedirectToAction("Dashboard", "Homeowner");
            }

        }
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
