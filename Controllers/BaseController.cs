using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using HomeOwner.Models;

namespace HomeOwner.Controllers
{
    public class BaseController : Controller
    {
        protected bool adminRoute = false;
        protected bool homeownerRoute = false;
        protected bool staffRoute = false;
   

        protected User CurrentUser
        {
            get => HttpContext.Session.GetObject<User>("CurrentUser");
            set => HttpContext.Session.SetObject("CurrentUser", value);
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
          
            ViewBag.CurrentUser = CurrentUser;

          
            if (CurrentUser == null)
            {
                context.Result = RedirectToAction("Index", "Home");
                return;
            }

           
            adminRoute = CurrentUser.role == "admin";
            homeownerRoute = CurrentUser.role == "homeowner";
            staffRoute = CurrentUser.role == "staff";

            // Controller-specific authorization
            if (this is AdminController && !adminRoute)
            {
                context.Result = RedirectToAction("Index", "Home");
                return;
            }

            base.OnActionExecuting(context);
        }

        protected void ViewContents()
        {
            ViewBag.AdminAccess = adminRoute;
            ViewBag.HomeownerAccess = homeownerRoute;
            ViewBag.StaffAccess = staffRoute;
        }
    }
}