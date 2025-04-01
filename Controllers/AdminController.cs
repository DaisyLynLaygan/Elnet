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
        public ViewModel GetAnnouncement()
        {
            var viewModel = new ViewModel();

            try
            {
                var announcements = _context.Announcement.ToList();
                viewModel.Announcements = announcements;
                viewModel.newAnnouncement = new Announcement(); 
            }
            catch (Exception ex)
            {
                viewModel.ErrorMessage = ex.Message;
            }

            return viewModel; 
        }



         public int GetStaffCount()
        {
            return _context.User
                .Count(u => u.role == "staff");
        }
         public int GetHomeOwnerCount()
        {
            return _context.User
                .Count(u => u.role == "homeowner");
        }
        


        public int GetActiveUserCount()
        {
            return _context.User
                .Count(u => u.status == "Active");
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
                    status = "Active"
                };


                // Save the user to the database
                _context.User.Add(user);
                _context.SaveChanges();
                TempData["Message"] = "User added successfully!";
                return RedirectToAction("AdminUsers");
            }
            catch (Exception ex)
            {
                TempData["Error"] = ex.Message;
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
                TempData["Error"] =  ex.Message;
            }

            return RedirectToAction("AdminUsers");
        }



        //Add announcement 
        public IActionResult AddAnnouncement(ViewModel model)
        {
            
             try
            {
                var announcement = new Announcement
                {
                    title = model.newAnnouncement.title,
                    content = model.newAnnouncement.content,
                    start_date =  model.newAnnouncement.start_date,
                    end_date = model.newAnnouncement.end_date,
                    priority = model.newAnnouncement.priority,
                    status = "Active",
                    author = CurrentUser.firstname + " " + CurrentUser.lastname
                };
               


                // Save the user to the database
               _context.Announcement.Add(announcement);
                _context.SaveChanges();
                TempData["Message"] = "Announcement publish successfully!";
                return RedirectToAction("Announcements");
            }
            catch (Exception ex)
            {
                TempData["Error"] = ex.Message;
                return RedirectToAction("Announcements");
            }
        }







        public IActionResult Dashboard()
        {

            ViewContents();
            ViewBag.ActiveCount = GetActiveUserCount();
            ViewBag.StaffCount = GetStaffCount();
            ViewBag.HomeOwnerCount = GetHomeOwnerCount();
            ViewBag.ActiveMenu = "Dashboard";
            return View();
        }

        public IActionResult AdminAnnouncements()
        {
            ViewContents();
            ViewBag.ActiveMenu = "Announcements";
            return View(GetAnnouncement()); // Use this if you want to keep the current view name
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
