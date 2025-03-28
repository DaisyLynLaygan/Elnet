using Microsoft.AspNetCore.Mvc;

namespace HomeOwner.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult AdminDashboard()
        {
            return View();
        }
    }
}
