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
    }
}
