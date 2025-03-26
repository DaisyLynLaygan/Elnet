using Microsoft.AspNetCore.Mvc;

namespace HomeOwner.Controllers
{
    public class Homeowner : Controller
    {
        public IActionResult Dashboard()
        {
            return View();
        }
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult Feedback()
        {
            return View();
        }
        public IActionResult Community()
        {
            return View();
        }
          public IActionResult Payment()
        {
            return View();
        }
    }
}
