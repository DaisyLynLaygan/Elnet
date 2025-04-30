using HomeOwner.Data;
using HomeOwner.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace HomeOwner.Controllers
{
    public class AdminController : BaseController
    {
        private readonly HomeOwnerContext _context;

        public AdminController(HomeOwnerContext db)
        {
            _context = db;

            if (!adminRoute)
            {
                RedirectToAction("Index", "Home");
            }
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

                return Json(new
                {
                    success = true,
                    announcement = new
                    {
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




        public IActionResult AdminUsers()
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

        [HttpGet]
        public JsonResult GetFeedback(int page = 1, int pageSize = 10, string facility = "all")
        {
            try
            {
                var query = _context.Feedback
                    .Include(f => f.User)
                    .Include(f => f.Facility)
                    .AsQueryable();

                // Apply facility filter if not "all"
                if (facility != "all")
                {
                    query = query.Where(f => f.Facility.name == facility);
                }

                // Get total count for pagination
                var totalCount = query.Count();
                var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

                // Apply pagination
                var feedbacks = query
                    .OrderByDescending(f => f.created_date)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(f => new
                    {
                        feedback_id = f.feedback_id,
                        user = new
                        {
                            name = f.User.firstname + " " + f.User.lastname
                        },
                        facility = f.Facility.name,
                        overall_rating = f.overall_rating,
                        title = f.title,
                        created_date = f.created_date.ToString("MMMM dd, yyyy"),
                        status = "Published"
                    })
                    .ToList();

                // Calculate statistics
                var stats = new
                {
                    total = totalCount,
                    average_rating = query.Average(f => f.overall_rating),
                    new_this_week = query.Count(f => f.created_date >= DateTime.Now.AddDays(-7)),
                    facilities = _context.Facility.Count()
                };

                return Json(new
                {
                    success = true,
                    feedbacks,
                    stats,
                    pagination = new
                    {
                        currentPage = page,
                        totalPages = totalPages,
                        totalItems = totalCount
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetFeedbackDetails(int id)
        {
            try
            {
                var feedback = _context.Feedback
                    .Include(f => f.User)
                    .Include(f => f.Facility)
                    .FirstOrDefault(f => f.feedback_id == id);

                if (feedback == null)
                {
                    return Json(new { success = false, message = "Feedback not found." });
                }

                var response = new
                {
                    success = true,
                    feedback = new
                    {
                        feedback_id = feedback.feedback_id,
                        user = new
                        {
                            name = feedback.User.firstname + " " + feedback.User.lastname
                        },
                        facility = feedback.Facility.name,
                        overall_rating = feedback.overall_rating,
                        title = feedback.title,
                        comment = feedback.comment,
                        photos = feedback.photos,
                        created_date = feedback.created_date.ToString("MMMM dd, yyyy"),
                        status = "Published"
                    }
                };

                return Json(response);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetComplaints(int page = 1, int pageSize = 10, string status = "all", string serviceType = "all")
        {
            try
            {
                var query = _context.ServiceRequest
                    .Include(s => s.User)
                    .AsQueryable();

                // Apply filters
                if (status != "all")
                {
                    query = query.Where(s => s.status == status);
                }

                if (serviceType != "all")
                {
                    query = query.Where(s => s.service_type == serviceType);
                }

                // Get total count for pagination
                var totalCount = query.Count();
                var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

                // Apply pagination
                var complaints = query
                    .OrderByDescending(s => s.date_created)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(s => new
                    {
                        request_id = s.request_id,
                        user = new
                        {
                            name = s.User.firstname + " " + s.User.lastname
                        },
                        service_type = s.service_type,
                        title = s.notes,
                        severity = s.status, // Using status as severity for now
                        date_created = s.date_created.ToString("MMMM dd, yyyy"),
                        status = s.status
                    })
                    .ToList();

                // Calculate statistics
                var stats = new
                {
                    total = totalCount,
                    open = _context.ServiceRequest.Count(s => s.status == "Pending Approval"),
                    avg_resolution_time = 3.2, // You can calculate this based on your data
                    satisfaction_rate = 92 // You can calculate this based on your data
                };

                return Json(new
                {
                    success = true,
                    complaints,
                    stats,
                    pagination = new
                    {
                        currentPage = page,
                        totalPages = totalPages,
                        totalItems = totalCount
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
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
            ViewContents();
            var issues = _context.Report.Include(r => r.Author).ToList();



            return View(issues);
        }

        [HttpPost]
        public async Task<JsonResult> UpdateServiceRequestStatus([FromBody] ServiceRequest request)
        {
            try
            {
                var existingRequest = _context.ServiceRequest.FirstOrDefault(r => r.request_id == request.request_id);
                if (existingRequest == null)
                {
                    return Json(new { success = false, message = "Service request not found." });
                }

                existingRequest.status = request.status;
                existingRequest.payment_status = request.payment_status;

                await _context.SaveChangesAsync();

                // Broadcast service request update
                var serviceRequestWebSocketManager = HttpContext.RequestServices.GetRequiredService<ServiceRequestWebSocketManager>();
                await serviceRequestWebSocketManager.BroadcastServiceRequestUpdate(existingRequest);

                return Json(new { success = true, message = "Service request updated successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetServiceRequests(string status = "all", string serviceType = "all", string paymentStatus = "all", 
            string dateRange = "all", string startDate = null, string endDate = null, int page = 1, int pageSize = 5)
        {
            try
            {
                var query = _context.ServiceRequest
                    .Include(r => r.User)
                    .AsQueryable();

                // Apply filters
                if (status != "all")
                {
                    query = query.Where(r => r.status == status);
                }

                if (serviceType != "all")
                {
                    query = query.Where(r => r.service_type == serviceType);
                }

                if (paymentStatus != "all")
                {
                    query = query.Where(r => r.payment_status == paymentStatus);
                }

                if (dateRange != "all")
                {
                    var today = DateTime.Today;
                    switch (dateRange)
                    {
                        case "today":
                            query = query.Where(r => r.scheduled_date == today);
                            break;
                        case "week":
                            var weekStart = today.AddDays(-7);
                            query = query.Where(r => r.scheduled_date >= weekStart && r.scheduled_date <= today);
                            break;
                        case "month":
                            var monthStart = today.AddMonths(-1);
                            query = query.Where(r => r.scheduled_date >= monthStart && r.scheduled_date <= today);
                            break;
                        case "custom":
                            if (!string.IsNullOrEmpty(startDate) && !string.IsNullOrEmpty(endDate))
                            {
                                var start = DateTime.Parse(startDate);
                                var end = DateTime.Parse(endDate);
                                query = query.Where(r => r.scheduled_date >= start && r.scheduled_date <= end);
                            }
                            break;
                    }
                }

                // Get total count for pagination
                var totalCount = query.Count();
                var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

                // Apply pagination
                var requests = query
                    .OrderByDescending(r => r.date_created)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(r => new
                    {
                        request_id = r.request_id,
                        service_type = r.service_type,
                        service_icon = r.service_icon,
                        price = r.price,
                        frequency = r.frequency,
                        scheduled_date = r.scheduled_date,
                        scheduled_time = r.scheduled_time,
                        status = r.status,
                        payment_status = r.payment_status,
                        notes = r.notes,
                        date_created = r.date_created,
                        user = new
                        {
                            user_id = r.User.user_id,
                            firstname = r.User.firstname,
                            lastname = r.User.lastname,
                            email = r.User.email,
                            contact_no = r.User.contact_no
                        }
                    })
                    .ToList();

                // Calculate statistics
                var stats = new
                {
                    total = totalCount,
                    pending = _context.ServiceRequest.Count(r => r.status == "Pending Approval"),
                    unpaid = _context.ServiceRequest.Count(r => r.payment_status == "Unpaid"),
                    completed = _context.ServiceRequest.Count(r => r.status == "Completed")
                };

                return Json(new { 
                    success = true, 
                    requests, 
                    stats,
                    pagination = new {
                        currentPage = page,
                        totalPages = totalPages,
                        totalItems = totalCount
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetServiceRequest(int id)
        {
            try
            {
                var request = _context.ServiceRequest
                    .Include(r => r.User)
                    .FirstOrDefault(r => r.request_id == id);

                if (request == null)
                {
                    return Json(new { success = false, message = "Service request not found." });
                }

                var response = new
                {
                    success = true,
                    request = new
                    {
                        request_id = request.request_id,
                        service_type = request.service_type,
                        service_icon = request.service_icon,
                        price = request.price,
                        frequency = request.frequency,
                        scheduled_date = request.scheduled_date,
                        scheduled_time = request.scheduled_time,
                        status = request.status,
                        payment_status = request.payment_status,
                        notes = request.notes,
                        date_created = request.date_created,
                        user = new
                        {
                            user_id = request.User.user_id,
                            firstname = request.User.firstname,
                            lastname = request.User.lastname,
                            email = request.User.email,
                            contact_no = request.User.contact_no
                        }
                    }
                };

                return Json(response);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}