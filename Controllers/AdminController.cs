using HomeOwner.Data;
using HomeOwner.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace HomeOwner.Controllers
{
    public class AdminController : BaseController
    {
        private readonly HomeOwnerContext _context;
        
        public AdminController(HomeOwnerContext db)
        {
            _context = db;
        }


        //Get all users
        public ViewModel GetUser()
        {
            var viewModel = new ViewModel();

            try
            {
                var users = _context.User.ToList();
                viewModel.Users = users;
                viewModel.newUser = new User(); 
            }
            catch (Exception ex)
            {
                viewModel.ErrorMessage = ex.Message;
            }

            return viewModel; 
        }




        //Add New User via Modal 

        public IActionResult addUserModal(ViewModel model)
        {
            
            try
            {
                var user = new User
                {
                    username = model.newUser.username,
                    user_password = model.newUser.user_password,
                    email = model.newUser.email,
                    address = model.newUser.address,
                    contact_no = model.newUser.contact_no,
                    firstname = model.newUser.firstname,
                    lastname = model.newUser.lastname,
                    date_created = DateOnly.FromDateTime(DateTime.Now),
                    role = model.newUser.role,
                     status="Active"
                };


                // Save the user to the database
                _context.User.Add(user);
                _context.SaveChanges();
                TempData["Message"] = "User added successfully!";
                return RedirectToAction("AdminUsers");
            }
            catch (Exception ex)
            {
                TempData["Error"] = "An error occurred while adding the user.";
                return RedirectToAction("AdminUsers");
            }
        }


        public IActionResult HardDeleteUser(int Id)
        {
            try
            {
                var user = _context.User.FirstOrDefault(m => m.user_id == Id);
                if (user != null)
                {
                    _context.User.Remove(user);
                    _context.SaveChanges();
                    TempData["Message"] = "User deleted successfully!";
                }
                else
                {
                    TempData["Error"] = "User not found.";
                }
            }
            catch (Exception ex)
            {
                TempData["Error"] = "An error occurred while deleting the user.";
            }

            return RedirectToAction("AdminUsers");
        }







        public IActionResult Dashboard()
        {

            ViewContents();

            ViewBag.ActiveMenu = "Dashboard";
            return View();
        }

        public IActionResult Announcements()
        {
            ViewContents();
            ViewBag.ActiveMenu = "Announcements";
            return View("AdminAnnouncements"); // Use this if you want to keep the current view name
        }

        public IActionResult Documents()
        {
            ViewContents();
            ViewBag.ActiveMenu = "Documents";
            return View("AdminDocuments");
        }

        public IActionResult Reservations()
        {
            ViewContents();
            ViewBag.ActiveMenu = "Reservations";
            return View("AdminReservations");
        }

        public IActionResult Polls()
        {
            ViewContents();
            ViewBag.ActiveMenu = "Polls";
            return View("AdminPolls");
        }

        public IActionResult Events()
        {
            ViewContents();
            ViewBag.ActiveMenu = "Events";
            return View("AdminEvents");
        }


      

        public  IActionResult  AdminUsers()
        {
            ViewContents();

            ViewBag.ActiveMenu = "Users";
            return View(GetUser());
        }

        public IActionResult Feedback()
        {
            ViewContents();
            ViewBag.ActiveMenu = "Feedback";
            return View("AdminFeedback");
        }

        public IActionResult ServiceRequests()
        {
            ViewContents();
            ViewBag.ActiveMenu = "ServiceRequests";
            return View("AdminServiceRequests");
        }
    }
}
