using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using HomeOwner.Models;
using Microsoft.AspNetCore.Http;

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
            Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
            Response.Headers["Pragma"] = "no-cache";
            Response.Headers["Expires"] = "0";

            ViewBag.CurrentUser = CurrentUser;

            // If no user is logged in, clear everything and redirect
            if (CurrentUser == null)
            {
                KillSessionAndCookies();
                context.Result = RedirectToAction("Index", "Home");
                return;
            }

            // Set route access flags based on user role
            adminRoute = CurrentUser.role == "admin";
            homeownerRoute = CurrentUser.role == "homeowner";
            staffRoute = CurrentUser.role == "staff";

            // Get the requested path
            var path = context.HttpContext.Request.Path.Value?.ToLower() ?? "";

            // Strict role-based access control
            if (IsAdminRoute(path) && !adminRoute)
            {
                KillSessionAndCookies();
                context.Result = RedirectToAction("Index", "Home");
                return;
            }

            if (IsHomeownerRoute(path) && !homeownerRoute)
            {
                KillSessionAndCookies();
                context.Result = RedirectToAction("Index", "Home");
                return;
            }

            if (IsStaffRoute(path) && !staffRoute)
            {
                KillSessionAndCookies();
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

        private bool IsAdminRoute(string path)
        {
            return path.StartsWith("/admin");
        }

        private bool IsHomeownerRoute(string path)
        {
            return path.StartsWith("/homeowner");
        }

        private bool IsStaffRoute(string path)
        {
            return path.StartsWith("/staff");
        }

        private void KillSessionAndCookies()
        {
            HttpContext.Session.Clear();

            foreach (var cookie in Request.Cookies.Keys)
            {
                Response.Cookies.Delete(cookie);
            }

            Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
            Response.Headers["Pragma"] = "no-cache";
            Response.Headers["Expires"] = "0";
        }
    }
}