using HomeOwner.Models;
using Microsoft.AspNetCore.Mvc;

namespace HomeOwner.Controllers
{
    public class BaseController : Controller
    {
        protected User CurrentUser
        {
            get => HttpContext.Session.GetObject<User>("CurrentUser");
            set => HttpContext.Session.SetObject("CurrentUser", value);
        }
        protected void ViewContents()
        {
            ViewBag.CurrentUser = CurrentUser;

            if (CurrentUser == null)
            {
                RedirectToAction("Index", "Home");
            }

        }

    }
}
