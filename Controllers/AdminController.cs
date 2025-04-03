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
            catch (Exception)
            {
                viewModel.ErrorMessage = "Error loading users";
            }

            return viewModel; 
        }

        public int GetStaffCount()
        {
            return _context.User.Count(u => u.role == "staff");
        }

        public int GetHomeOwnerCount()
        {
            return _context.User.Count(u => u.role == "homeowner");
        }
        
        public int GetActiveUserCount()
        {
            return _context.User.Count(u => u.status == "Active");
        }

        [HttpPost]
        public JsonResult AddUser([FromBody] User userData)
        {
            try
            {
                var user = new User
                {
                    username = userData.username,
                    user_password = userData.user_password,
                    email = userData.email,
                    contact_no = userData.contact_no,
                    firstname = userData.firstname,
                    lastname = userData.lastname,
                    date_created = DateOnly.FromDateTime(DateTime.Now),
                    role = userData.role,
                    status = "Active"
                };

                _context.User.Add(user);
                _context.SaveChanges();
                
                return Json(new { success = true, message = "User added successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult EditUser([FromBody] User userData)
        {
            try
            {
                var user = _context.User.FirstOrDefault(u => u.user_id == userData.user_id);
                if (user == null)
                {
                    return Json(new { success = false, message = "User not found." });
                }

                user.firstname = userData.firstname;
                user.lastname = userData.lastname;
                user.email = userData.email;
                user.contact_no = userData.contact_no;
                user.role = userData.role;
                user.status = userData.status;

                _context.SaveChanges();
                
                return Json(new { success = true, message = "User updated successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult DeleteUser(int id)
        {
            try
            {
                var user = _context.User.FirstOrDefault(u => u.user_id == id);
                if (user == null)
                {
                    return Json(new { success = false, message = "User not found." });
                }

                _context.User.Remove(user);
                _context.SaveChanges();
                
                return Json(new { success = true, message = "User deleted successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
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
            return View(GetAnnouncements());
        }

        public ViewModel GetAnnouncements()
        {
            var viewModel = new ViewModel();
            try
            {
                var announcements = _context.Announcement.ToList();
                viewModel.Announcements = announcements;
                viewModel.newAnnouncement = new Announcement(); 
            }
            catch (Exception)
            {
                viewModel.ErrorMessage = "Error loading announcements";
            }
            return viewModel; 
        }
        [HttpPost]
        public JsonResult GetAnnouncement(int id)
        {
            try
            {
                var announcement = _context.Announcement.FirstOrDefault(a => a.announcement_id == id);
                if (announcement == null)
                {
                    return Json(new { success = false, message = "Announcement not found." });
                }

                return Json(new { 
                    success = true, 
                    announcement = new {
                        announcement_id = announcement.announcement_id,
                        title = announcement.title,
                        content = announcement.content,
                        start_date = announcement.start_date?.ToString("yyyy-MM-dd"),
                        end_date = announcement.end_date?.ToString("yyyy-MM-dd"),
                        priority = announcement.priority,
                        status = announcement.status,
                        author = announcement.author
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult AddAnnouncement([FromBody] Announcement announcementData)
        {
            try
            {
                if (announcementData == null)
                {
                    return Json(new { success = false, message = "Announcement data is null" });
                }

                if (string.IsNullOrEmpty(announcementData.title) || string.IsNullOrEmpty(announcementData.content))
                {
                    return Json(new { success = false, message = "Title and content are required" });
                }

                var announcement = new Announcement
                {
                    title = announcementData.title,
                    content = announcementData.content,
                    start_date = announcementData.start_date,
                    end_date = announcementData.end_date,
                    priority = announcementData.priority ?? "normal",
                    status = "Active",
                    author = CurrentUser?.firstname + " " + CurrentUser?.lastname
                };

                _context.Announcement.Add(announcement);
                _context.SaveChanges();
                
                return Json(new { success = true, message = "Announcement published successfully!", id = announcement.announcement_id });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult EditAnnouncement([FromBody] Announcement announcementData)
        {
            try
            {
                if (announcementData == null)
                {
                    return Json(new { success = false, message = "Announcement data is null" });
                }

                var announcement = _context.Announcement.FirstOrDefault(a => a.announcement_id == announcementData.announcement_id);
                if (announcement == null)
                {
                    return Json(new { success = false, message = "Announcement not found." });
                }

                announcement.title = announcementData.title;
                announcement.content = announcementData.content;
                announcement.start_date = announcementData.start_date;
                announcement.end_date = announcementData.end_date;
                announcement.priority = announcementData.priority ?? "normal";

                _context.SaveChanges();
                
                return Json(new { success = true, message = "Announcement updated successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult DeleteAnnouncement(int id)
        {
            try
            {
                var announcement = _context.Announcement.FirstOrDefault(a => a.announcement_id == id);
                if (announcement == null)
                {
                    return Json(new { success = false, message = "Announcement not found." });
                }

                _context.Announcement.Remove(announcement);
                _context.SaveChanges();
                
                return Json(new { success = true, message = "Announcement deleted successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
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

        public IActionResult AdminIssue()
        {
            ViewBag.ActiveMenu = "FacilityIssue";
            return View();
        }
    }
}