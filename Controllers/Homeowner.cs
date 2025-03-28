using HomeOwner.Data;
using HomeOwner.Models;
using Microsoft.AspNetCore.Mvc;


namespace HomeOwner.Controllers
{

   
    public class Homeowner : Controller
    {
        private readonly HomeOwnerContext _context;
        public Homeowner(HomeOwnerContext db) {
            _context = db;
        }

        public void ViewContents()
        {
           ViewBag.name =  HttpContext.Session.GetString("name");
           ViewBag.email =  HttpContext.Session.GetString("email");
           ViewBag.contact =  HttpContext.Session.GetString("contact");
           ViewBag.address =  HttpContext.Session.GetString("address");
           ViewBag.firstname =  HttpContext.Session.GetString("firstname");
           ViewBag.lastname =  HttpContext.Session.GetString("lastname");
           ViewBag.fullname = HttpContext.Session.GetString("firstname")+ " " + HttpContext.Session.GetString("lastname");
            
        }
        public IActionResult UpdateProfile(User model)
        {
            try
            {
                // Find the user in the database - MATCH THE PROPERTY NAMES
                var existingUser = _context.User.FirstOrDefault(u => u.user_id == model.user_id);

                if (existingUser == null)
                {
                    return NotFound(); // Return 404 if user is not found
                }

                // Update only the modified fields - USE THE CORRECT PROPERTY NAMES
                existingUser.username = model.username;
                existingUser.email = model.email;
                existingUser.user_password = model.user_password; // Consider hashing this!
                
                // Update other fields if needed
                existingUser.firstname = model.firstname;
                existingUser.lastname = model.lastname;
                existingUser.address = model.address;
                existingUser.contact_no = model.contact_no;

                _context.User.Update(existingUser);
                _context.SaveChanges();

                ViewBag.Message = "Profile updated successfully!";
                return View(existingUser);
            }
            catch (Exception ex)
            {
                ViewBag.Error = "An error occurred while updating the profile.";
                return View();
            }
        }


        public IActionResult Dashboard()
        {
            ViewContents();
            return View();
        }
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult Feedback()
        {
            ViewContents();
            return View();
        }
        public IActionResult Community()
        {
            ViewContents();
            return View();
        }
        public IActionResult Payment()
        {
            ViewContents();
            return View();
        }
        public IActionResult History()
        {
            ViewContents();
            return View();
        }
        public IActionResult UserProfile()
        {
            ViewContents(); 
            return View();
        }
    }
}
