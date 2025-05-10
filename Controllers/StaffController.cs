using HomeOwner.Models;
using Microsoft.AspNetCore.Mvc;
using HomeOwner.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Antiforgery;

namespace HomeOwner.Controllers
{
    public class StaffController : BaseController
    {
        private readonly HomeOwnerContext _context;

        public StaffController(HomeOwnerContext db)
        {
            _context = db;
            // We'll handle the access check in each action method instead
        }

        private IActionResult EnsureStaffAccess()
        {
            if (!staffRoute)
            {
                return RedirectToAction("Index", "Home");
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> AddComment([FromBody] CommentModel model)
        {
            try
            {
                var comment = new Comment
                {
                    content = model.Content,
                    created_date = DateTime.Now,
                    updated_date = DateTime.Now,
                    author_id = CurrentUser.user_id,
                    post_id = model.PostId
                };

                _context.Comment.Add(comment);
                await _context.SaveChangesAsync();

                // Load the author information
                var author = await _context.User.FindAsync(CurrentUser.user_id);

                // Get the comment count for this post
                var commentCount = await _context.Comment.CountAsync(c => c.post_id == model.PostId);

                // Broadcast the new comment via WebSocket
                var commentWebSocketManager = HttpContext.RequestServices.GetRequiredService<CommentWebSocketManager>();
                await commentWebSocketManager.BroadcastComment(model.PostId, comment, author, commentCount);

                return Json(new
                {
                    success = true,
                    comment = new
                    {
                        id = comment.comment_id,
                        content = comment.content,
                        createdDate = comment.created_date?.ToString("MMMM dd, yyyy hh:mm tt"),
                        author = new
                        {
                            id = author.user_id,
                            name = $"{author.firstname} {author.lastname}",
                            role = author.role
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<JsonResult> GetComments(int postId)
        {
            try
            {
                var comments = await _context.Comment
                    .Include(c => c.Author)
                    .Where(c => c.post_id == postId)
                    .OrderBy(c => c.created_date)
                    .Select(c => new
                    {
                        id = c.comment_id,
                        content = c.content,
                        createdDate = c.created_date,
                        author = new
                        {
                            id = c.Author.user_id,
                            name = $"{c.Author.firstname} {c.Author.lastname}",
                            role = c.Author.role
                        }
                    })
                    .ToListAsync();

                return Json(new { success = true, comments });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult DeletePost([FromBody] PostDeleteModel model)
        {
            try
            {
                var post = _context.Post.FirstOrDefault(p => p.post_id == model.postId);

                if (post == null)
                {
                    return Json(new { success = false, message = "Post not found." });
                }

                if (post.user_id != CurrentUser.user_id)
                {
                    return Json(new { success = false, message = "You can only delete your own posts." });
                }

                _context.Post.Remove(post);
                _context.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult UpdatePost([FromBody] PostUpdateModel model)
        {
            try
            {
                var post = _context.Post.FirstOrDefault(p => p.post_id == model.postId);

                if (post == null)
                {
                    return Json(new { success = false, message = "Post not found." });
                }

                if (post.user_id != CurrentUser.user_id)
                {
                    return Json(new { success = false, message = "You can only edit your own posts." });
                }

                post.content = model.content;
                post.updated_date = DateTime.Now;

                _context.SaveChanges();

                return Json(new { success = true, updatedDate = post.updated_date?.ToString("MMMM dd, yyyy") });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        public List<Post> RetrievePost()
        {
            var posts = _context.Post.Include(p => p.Author)
                .Include(p => p.Comments)
                .ThenInclude(c => c.Author)
                .OrderByDescending(p => p.created_date)
                .ToList();

            return posts;
        }

        public List<Announcement> GetAnnouncements()
        {
            var currentDate = DateTime.Now;
            var announcements = _context.Announcement.Where(m => currentDate < m.end_date).ToList();
            return announcements;
        }

        [HttpPost]
        public async Task<IActionResult> AddPostUser(ViewModel model)
        {
            var post = new Post
            {
                content = model.newPost.content,
                created_date = DateTime.Now,
                updated_date = DateTime.Now,
                user_id = CurrentUser.user_id,
            };

            if (model.newPost.ImageFile != null && model.newPost.ImageFile.Length > 0)
            {
                var uploadsFolder = Path.Combine("wwwroot", "uploads", "posts");
                Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + model.newPost.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.newPost.ImageFile.CopyToAsync(stream);
                }

                post.ImagePath = $"/uploads/posts/{uniqueFileName}";
            }

            _context.Post.Add(post);
            _context.SaveChanges();

            return RedirectToAction("StaffCommunity", "Staff");
        }

        [HttpPost]
        public async Task<JsonResult> CheckDuplicateReport([FromBody] DuplicateCheckModel model)
        {
            try
            {
                // Check for similar reports in the last 24 hours
                var twentyFourHoursAgo = DateTime.Now.AddHours(-24);
                var existingReport = await _context.Report
                    .Where(r => r.report_facility == model.facility 
                            && r.report_type == model.type
                            && r.created_date >= twentyFourHoursAgo)
                    .FirstOrDefaultAsync();

                return Json(new { 
                    success = true, 
                    isDuplicate = existingReport != null 
                });
            }
            catch (Exception ex)
            {
                return Json(new { 
                    success = false, 
                    message = ex.Message 
                });
            }
        }

        [HttpPost]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> AddReport(Report model)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { 
                    success = false, 
                    message = "Please fill in all required fields correctly." 
                });
            }

            try
            {
                // Set the author_id to current user's ID
                model.user_id = CurrentUser.user_id;
                
                // Explicitly set the dates
                model.created_date = DateTime.Now;
                model.updated_date = DateTime.Now;

                _context.Report.Add(model);
                await _context.SaveChangesAsync();
            
                return Json(new { 
                    success = true,
                    message = "Report submitted successfully" 
                });
            }
            catch (Exception ex)
            {
                return Json(new { 
                    success = false, 
                    message = $"Error submitting report: {ex.Message}" 
                });
            }
        }

        public IActionResult StaffDashboard()
        {
            // Check access first
            var accessCheck = EnsureStaffAccess();
            if (accessCheck != null)
                return accessCheck;
                
            ViewContents();
            
            // Get the current user's ID
            int staffId = CurrentUser.user_id;
            
            // Get service request statistics - SERVICES
            var completedServices = _context.ServiceRequest
                .Count(sr => sr.status == "Completed");
                
            var pendingServices = _context.ServiceRequest
                .Count(sr => sr.status == "Approved" && sr.payment_status == "Paid");
                
            var inProgressServices = _context.ServiceRequest
                .Count(sr => sr.status == "In Progress");
            
            // Get facility reservation statistics - FACILITIES
            var completedFacilities = _context.FacilityReservation
                .Count(fr => fr.status == "Completed");
                
            var pendingFacilities = _context.FacilityReservation
                .Count(fr => fr.status == "Approved" && fr.payment_status == "Paid");
                
            var inProgressFacilities = _context.FacilityReservation
                .Count(fr => fr.status == "In Progress");
            
            // Combined statistics
            int totalCompleted = completedServices + completedFacilities;
            int totalPending = pendingServices + pendingFacilities;
            int totalInProgress = inProgressServices + inProgressFacilities;
            
            // Calculate completion rate
            int totalTasks = totalCompleted + totalPending + totalInProgress;
            double completionRate = totalTasks > 0 ? (double)totalCompleted / totalTasks * 100 : 0;
            
            // Get upcoming service requests within the next 7 days, ordered by scheduled date
            var today = DateTime.Now.Date;
            var nextWeek = today.AddDays(7);
            
            // Get upcoming service requests
            var upcomingServices = _context.ServiceRequest
                .Include(sr => sr.User)
                .Where(sr => sr.scheduled_date >= today && 
                            sr.scheduled_date <= nextWeek && 
                            (sr.status == "Approved" || sr.status == "In Progress"))
                .OrderBy(sr => sr.scheduled_date)
                .ThenBy(sr => sr.scheduled_time)
                .Select(sr => new {
                    Id = sr.request_id,
                    Type = sr.service_type,
                    Facility = "", // Not related to facility
                    Date = sr.scheduled_date,
                    Time = sr.scheduled_time,
                    Status = sr.status,
                    HomeownerName = $"{sr.User.firstname} {sr.User.lastname}",
                    IsServiceRequest = true
                })
                .ToList();
            
            // Get upcoming facility reservations
            var upcomingFacilities = _context.FacilityReservation
                .Include(fr => fr.User)
                .Include(fr => fr.Facility)
                .Where(fr => fr.reservation_date >= today && 
                            fr.reservation_date <= nextWeek && 
                            (fr.status == "Approved" || fr.status == "In Progress"))
                .OrderBy(fr => fr.reservation_date)
                .ThenBy(fr => fr.reservation_time)
                .Select(fr => new {
                    Id = fr.reservation_id,
                    Type = "Facility Reservation",
                    Facility = fr.Facility.name,
                    Date = fr.reservation_date,
                    Time = fr.reservation_time,
                    Status = fr.status,
                    HomeownerName = $"{fr.User.firstname} {fr.User.lastname}",
                    IsServiceRequest = false
                })
                .ToList();
            
            // Combine and sort all upcoming tasks
            var allUpcomingTasks = upcomingServices.Cast<object>()
                .Concat(upcomingFacilities.Cast<object>())
                .OrderBy(t => ((dynamic)t).Date)
                .ThenBy(t => ((dynamic)t).Time)
                .ToList();
            
            // Get service request count by month for the last 6 months
            var sixMonthsAgo = today.AddMonths(-6);
            
            // Service requests by month
            var serviceRequests = _context.ServiceRequest
                .Where(sr => sr.date_created >= sixMonthsAgo)
                .GroupBy(sr => new { Month = sr.date_created.Month, Year = sr.date_created.Year })
                .Select(g => new {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    Count = g.Count(),
                    Type = "Service"
                });
            
            // Facility reservations by month
            var facilityReservations = _context.FacilityReservation
                .Where(fr => fr.date_created >= sixMonthsAgo)
                .GroupBy(fr => new { Month = fr.date_created.Month, Year = fr.date_created.Year })
                .Select(g => new {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    Count = g.Count(),
                    Type = "Facility"
                });
            
            // Combine both datasets
            var combinedMonthlyData = serviceRequests.Concat(facilityReservations)
                .GroupBy(x => new { x.Month, x.Year, x.Type })
                .Select(g => new {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    Type = g.Key.Type,
                    Count = g.Sum(x => x.Count)
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToList();
            
            // Create a data structure to represent last 6 months
            var serviceData = new List<int>();
            var facilityData = new List<int>();
            var monthLabels = new List<string>();
            
            for (int i = 5; i >= 0; i--)
            {
                var date = DateTime.Now.AddMonths(-i);
                var monthName = date.ToString("MMM");
                var monthNumber = date.Month;
                var year = date.Year;
                
                monthLabels.Add(monthName);
                
                var serviceCount = combinedMonthlyData
                    .FirstOrDefault(x => x.Month == monthNumber && x.Year == year && x.Type == "Service")?.Count ?? 0;
                
                var facilityCount = combinedMonthlyData
                    .FirstOrDefault(x => x.Month == monthNumber && x.Year == year && x.Type == "Facility")?.Count ?? 0;
                
                serviceData.Add(serviceCount);
                facilityData.Add(facilityCount);
            }
            
            // Add all data to ViewBag
            ViewBag.CompletedServices = totalCompleted;
            ViewBag.PendingTasks = totalPending;
            ViewBag.InProgress = totalInProgress;
            ViewBag.CompletionRate = Math.Round(completionRate, 1);
            ViewBag.UpcomingTasks = allUpcomingTasks;
            ViewBag.MonthLabels = monthLabels;
            ViewBag.ServiceData = serviceData;
            ViewBag.FacilityData = facilityData;
            
            // Get recent completed activities
            var recentServiceActivities = _context.ServiceRequest
                .Include(sr => sr.User)
                .Where(sr => sr.status == "Completed")
                .OrderByDescending(sr => sr.date_created)
                .Take(3)
                .Select(sr => new {
                    StaffName = "Staff", 
                    ActivityType = sr.service_type,
                    Location = "",
                    TimeAgo = sr.date_created // Store the actual datetime instead of calling the method
                })
                .ToList()
                .Select(sr => new {
                    sr.StaffName,
                    sr.ActivityType,
                    sr.Location,
                    TimeAgo = GetTimeAgo(sr.TimeAgo) // Now apply the method after data is materialized
                });
                
            var recentFacilityActivities = _context.FacilityReservation
                .Include(fr => fr.User)
                .Include(fr => fr.Facility)
                .Where(fr => fr.status == "Completed")
                .OrderByDescending(fr => fr.date_created)
                .Take(3)
                .Select(fr => new {
                    StaffName = "Staff",
                    ActivityType = "Facility Reservation",
                    Location = fr.Facility.name,
                    TimeAgo = fr.date_created // Store the actual datetime
                })
                .ToList()
                .Select(fr => new {
                    fr.StaffName,
                    fr.ActivityType,
                    fr.Location,
                    TimeAgo = GetTimeAgo(fr.TimeAgo) // Apply method after data is materialized
                });
                
            // Combine and order the activities
            var recentActivities = recentServiceActivities
                .Concat(recentFacilityActivities)
                .OrderByDescending(a => {
                    // Try to parse the timespan from the text format
                    if (a.TimeAgo.Contains("just now")) return 0;
                    if (a.TimeAgo.Contains("minutes")) {
                        int.TryParse(a.TimeAgo.Split(' ')[0], out int minutes);
                        return minutes;
                    }
                    if (a.TimeAgo.Contains("hours")) {
                        int.TryParse(a.TimeAgo.Split(' ')[0], out int hours);
                        return hours * 60;
                    }
                    if (a.TimeAgo.Contains("days")) {
                        int.TryParse(a.TimeAgo.Split(' ')[0], out int days);
                        return days * 24 * 60;
                    }
                    return int.MaxValue; // For older dates
                })
                .Take(6)
                .ToList();
                
            ViewBag.RecentActivities = recentActivities;
            
            return View();
        }
        
        private static string GetTimeAgo(DateTime dateTime)
        {
            var timeSpan = DateTime.Now - dateTime;
            
            if (timeSpan.TotalMinutes < 1)
                return "just now";
            if (timeSpan.TotalMinutes < 60)
                return $"{(int)timeSpan.TotalMinutes} minutes ago";
            if (timeSpan.TotalHours < 24)
                return $"{(int)timeSpan.TotalHours} hours ago";
            if (timeSpan.TotalDays < 7)
                return $"{(int)timeSpan.TotalDays} days ago";
            
            return dateTime.ToString("MMM dd, yyyy");
        }

        public IActionResult StaffCommunity()
        {
            // Check access first
            var accessCheck = EnsureStaffAccess();
            if (accessCheck != null)
                return accessCheck;
                
            ViewContents();
            var model = new ViewModel
            {
                Announcements = GetAnnouncements(),
                Posts = RetrievePost()
            };
            return View(model);
        }

        public IActionResult StaffServices()
        {
            // Check access first
            var accessCheck = EnsureStaffAccess();
            if (accessCheck != null)
                return accessCheck;
                
            ViewBag.CurrentUser = CurrentUser;
            return View();
        }

        [HttpGet]
        public async Task<JsonResult> GetServiceRequests()
        {
            try
            {
                // Check authentication first
                if (CurrentUser == null || CurrentUser.role != "staff")
                {
                    Console.WriteLine("Authentication failed in GetServiceRequests");
                    return Json(new { success = false, message = "Not authenticated or unauthorized access." });
                }
                
                Console.WriteLine("Staff authenticated, fetching service requests...");
                
                var allRequests = await _context.ServiceRequest
                    .Include(sr => sr.User)
                    .ToListAsync();
                
                Console.WriteLine($"Total service requests found: {allRequests.Count}");
                
                // Filter for paid and approved requests
                var serviceRequests = allRequests
                    .Where(sr => sr.payment_status == "Paid" && sr.status == "Approved")
                    .Select(sr => new
                    {
                        request_id = sr.request_id,
                        user_id = sr.user_id,
                        service_type = sr.service_type,
                        service_icon = sr.service_icon,
                        price = sr.price,
                        frequency = sr.frequency,
                        scheduled_date = sr.scheduled_date,
                        scheduled_time = sr.scheduled_time,
                        status = sr.status,
                        payment_status = sr.payment_status,
                        notes = sr.notes,
                        date_created = sr.date_created,
                        user = new
                        {
                            user_id = sr.User.user_id,
                            firstname = sr.User.firstname,
                            lastname = sr.User.lastname,
                            email = sr.User.email,
                            contact_no = sr.User.contact_no
                        }
                    })
                    .ToList();
                
                Console.WriteLine($"Filtered service requests (Paid and Approved): {serviceRequests.Count}");

                return Json(new { success = true, requests = serviceRequests });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching service requests: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> UpdateServiceRequestStatus([FromBody] ServiceRequestUpdateModel model)
        {
            try
            {
                // Validate the model
                if (model.requestId <= 0)
                {
                    return Json(new { success = false, message = "Invalid request ID" });
                }

                // Find the service request
                var serviceRequest = await _context.ServiceRequest.FindAsync(model.requestId);
                if (serviceRequest == null)
                {
                    return Json(new { success = false, message = "Service request not found" });
                }

                // Update the service request status
                serviceRequest.status = model.status;
                
                // If status is being updated to In Progress, save the staff ID
                if (model.status == "In Progress")
                {
                    // Don't try to set staff_id since the field doesn't exist
                    // Just log the staff info separately instead
                    Console.WriteLine($"Staff {CurrentUser.user_id} ({CurrentUser.firstname} {CurrentUser.lastname}) is handling request {serviceRequest.request_id}");
                }
                
                // Save the staff notes if provided
                if (!string.IsNullOrEmpty(model.staffNotes))
                {
                    // Now we can use the staffNotes field directly
                    serviceRequest.staffNotes = model.staffNotes;
                }

                // Create a notification for the user
                if (!string.IsNullOrEmpty(model.notificationMessage))
                {
                    try
                    {
                        // Include staff name in the notification title
                        var staffName = $"{CurrentUser.firstname} {CurrentUser.lastname}";
                        var notification = new Notification
                        {
                            user_id = serviceRequest.user_id,
                            title = $"Service Request Update: {serviceRequest.service_type} with {staffName}",
                            message = model.notificationMessage,
                            created_date = DateTime.Now,
                            is_read = false,
                            type = "service_request",
                            reference_id = serviceRequest.request_id.ToString()
                        };

                        _context.Notification.Add(notification);
                        Console.WriteLine($"Created notification for user {serviceRequest.user_id} regarding service request {serviceRequest.request_id}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error creating notification: {ex.Message}");
                        // Continue even if notification creation fails
                    }
                }

                // Save changes to the database
                await _context.SaveChangesAsync();

                // Broadcast the update via WebSocket
                var serviceRequestWebSocketManager = HttpContext.RequestServices.GetRequiredService<ServiceRequestWebSocketManager>();
                await serviceRequestWebSocketManager.BroadcastServiceRequestUpdate(serviceRequest);

                return Json(new { 
                    success = true, 
                    message = "Service request status updated successfully",
                    requestId = serviceRequest.request_id,
                    staffName = $"{CurrentUser.firstname} {CurrentUser.lastname}",
                    newStatus = serviceRequest.status
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating service request: {ex.Message}");
                return Json(new { success = false, message = ex.Message });
            }
        }

        public IActionResult StaffEvents()
        {
            // Check access first
            var accessCheck = EnsureStaffAccess();
            if (accessCheck != null)
                return accessCheck;
                
            ViewBag.CurrentUser = CurrentUser;
            return View();
        }

        public IActionResult StaffCurrentTask()
        {
            // Check access first
            var accessCheck = EnsureStaffAccess();
            if (accessCheck != null)
                return accessCheck;
                
            ViewContents();
            return View();
        }

        [HttpGet]
        [Route("Staff/GetCurrentTasks")]
        public async Task<JsonResult> GetCurrentTasks()
        {
            try
            {
                // Check authentication first
                if (CurrentUser == null || CurrentUser.role != "staff")
                {
                    Console.WriteLine("Authentication failed in GetCurrentTasks");
                    return Json(new { success = false, message = "Not authenticated or unauthorized access." });
                }
                
                Console.WriteLine("Staff authenticated, fetching current tasks...");
                
                // Get facility reservations assigned to this staff
                var facilityReservations = await _context.FacilityReservation
                    .Include(fr => fr.User)
                    .Include(fr => fr.Facility)
                    .Where(fr => fr.status == "In Progress" || fr.status == "Completed")
                    .OrderByDescending(fr => fr.status == "In Progress" ? 1 : 0) // Show in progress first
                    .ThenByDescending(fr => fr.reservation_date)
                    .Select(fr => new
                    {
                        id = fr.reservation_id.ToString(),
                        facility = fr.Facility.name,
                        resident = $"{fr.User.firstname} {fr.User.lastname}",
                        dateTime = $"{fr.reservation_date.ToString("dd MMM yyyy")}, {fr.reservation_time}",
                        date = fr.reservation_date.ToString("dd MMM yyyy"),
                        time = fr.reservation_time,
                        duration = fr.duration_hours,
                        guests = $"{fr.guest_count} guests",
                        purpose = fr.purpose,
                        amount = $"${fr.price.ToString("0.00")}",
                        status = fr.status,
                        payment_status = fr.payment_status,
                        notes = fr.staff_notes ?? "",
                        user_id = fr.user_id,
                        user_email = fr.User.email,
                        user_contact = fr.User.contact_no
                    })
                    .ToListAsync();
                
                // Get service requests assigned to this staff
                var serviceRequests = await _context.ServiceRequest
                    .Include(sr => sr.User)
                    .Where(sr => sr.status == "In Progress" || sr.status == "Completed") 
                    .OrderByDescending(sr => sr.status == "In Progress" ? 1 : 0) // Show in progress first
                    .ThenByDescending(sr => sr.scheduled_date)
                    .Select(sr => new
                    {
                        id = sr.request_id.ToString(),
                        service = sr.service_type,
                        service_icon = sr.service_icon,
                        homeowner = $"{sr.User.firstname} {sr.User.lastname}",
                        date = sr.scheduled_date.ToString("dd MMM yyyy"),
                        time = sr.scheduled_time,
                        price = $"${sr.price.ToString("0.00")}",
                        status = sr.status,
                        payment_status = sr.payment_status,
                        notes = sr.notes,
                        staffNotes = sr.staffNotes,
                        user_id = sr.user_id,
                        user_email = sr.User.email,
                        user_contact = sr.User.contact_no
                    })
                    .ToListAsync();
                
                Console.WriteLine($"Found {facilityReservations.Count} facility tasks and {serviceRequests.Count} service tasks");

                return Json(new { 
                    success = true, 
                    facilityTasks = facilityReservations, 
                    serviceTasks = serviceRequests 
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching current tasks: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<JsonResult> GetApprovedFacilityReservations()
        {
            try
            {
                // Check authentication first
                if (CurrentUser == null || CurrentUser.role != "staff")
                {
                    Console.WriteLine("Authentication failed in GetApprovedFacilityReservations");
                    return Json(new { success = false, message = "Not authenticated or unauthorized access." });
                }
                
                Console.WriteLine("Staff authenticated, fetching approved facility reservations...");
                
                var reservations = await _context.FacilityReservation
                    .Include(fr => fr.User)
                    .Include(fr => fr.Facility)
                    .Where(fr => fr.status == "Approved" && fr.payment_status == "Paid")
                    .OrderByDescending(fr => fr.reservation_date)
                    .Select(fr => new
                    {
                        id = fr.reservation_id.ToString(),
                        facility = fr.Facility.name,
                        resident = $"{fr.User.firstname} {fr.User.lastname}",
                        dateTime = $"{fr.reservation_date.ToString("dd MMM yyyy")}, {fr.reservation_time}",
                        date = fr.reservation_date.ToString("dd MMM yyyy"),
                        time = fr.reservation_time,
                        duration = fr.duration_hours,
                        guests = $"{fr.guest_count} guests",
                        purpose = fr.purpose,
                        amount = $"${fr.price.ToString("0.00")}",
                        status = fr.status,
                        payment_status = fr.payment_status,
                        notes = fr.staff_notes ?? "",
                        staffId = CurrentUser.user_id,
                        user_id = fr.user_id,
                        user_email = fr.User.email,
                        user_contact = fr.User.contact_no
                    })
                    .ToListAsync();
                
                Console.WriteLine($"Approved facility reservations found: {reservations.Count}");

                return Json(new { success = true, reservations = reservations });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching approved facility reservations: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> BookFacilityReservation([FromBody] FacilityBookingModel model)
        {
            try
            {
                // Validate the model
                if (model.reservationId <= 0)
                {
                    return Json(new { success = false, message = "Invalid reservation ID" });
                }

                // Find the facility reservation
                var reservation = await _context.FacilityReservation
                    .Include(r => r.Facility)
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.reservation_id == model.reservationId);
                
                if (reservation == null)
                {
                    return Json(new { success = false, message = "Facility reservation not found" });
                }

                // Check that the reservation is in the correct state
                if (reservation.status != "Approved" || reservation.payment_status != "Paid")
                {
                    return Json(new { success = false, message = "This reservation cannot be booked (invalid status)" });
                }

                // Update the reservation status to "In Progress"
                reservation.status = "In Progress";
                
                // Update staff notes if provided
                if (!string.IsNullOrEmpty(model.staffNotes))
                {
                    reservation.staff_notes = model.staffNotes;
                }

                // Create a notification for the homeowner
                if (!string.IsNullOrEmpty(model.notificationMessage))
                {
                    try
                    {
                        // Include staff name in the notification title
                        var staffName = $"{CurrentUser.firstname} {CurrentUser.lastname}";
                        var notification = new Notification
                        {
                            user_id = reservation.user_id,
                            title = $"Facility Booking Confirmation: {reservation.Facility.name} with {staffName}",
                            message = model.notificationMessage,
                            created_date = DateTime.Now,
                            is_read = false,
                            type = "facility_booking",
                            reference_id = reservation.reservation_id.ToString()
                        };

                        _context.Notification.Add(notification);
                        Console.WriteLine($"Created notification for user {reservation.user_id} regarding facility reservation {reservation.reservation_id}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error creating notification: {ex.Message}");
                        // Continue even if notification creation fails
                    }
                }

                // Save changes to the database
                await _context.SaveChangesAsync();

                // Return success response
                return Json(new { 
                    success = true, 
                    message = $"Facility booking confirmed successfully for {reservation.Facility.name}",
                    reservationId = reservation.reservation_id,
                    staffName = $"{CurrentUser.firstname} {CurrentUser.lastname}",
                    newStatus = reservation.status
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error booking facility: {ex.Message}");
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        [Route("Staff/CompleteFacilityReservation")]
        public async Task<JsonResult> CompleteFacilityReservation([FromBody] CompletionModel model)
        {
            try
            {
                // Validate the model
                if (model.reservationId <= 0)
                {
                    return Json(new { success = false, message = "Invalid reservation ID" });
                }

                // Find the facility reservation
                var reservation = await _context.FacilityReservation
                    .Include(r => r.Facility)
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.reservation_id == model.reservationId);
                
                if (reservation == null)
                {
                    return Json(new { success = false, message = "Facility reservation not found" });
                }

                // Check that the reservation is in the correct state
                if (reservation.status != "In Progress")
                {
                    return Json(new { success = false, message = "This reservation cannot be completed (invalid status)" });
                }

                // Update the reservation status to "Completed"
                reservation.status = "Completed";
                
                // Update completion notes if provided
                if (!string.IsNullOrEmpty(model.completionNotes))
                {
                    string dateStr = DateTime.Now.ToString("yyyy-MM-dd");
                    reservation.staff_notes += $"\n\nCompletion Notes ({dateStr}): {model.completionNotes}";
                }

                // Create a notification for the homeowner
                if (!string.IsNullOrEmpty(model.notificationMessage))
                {
                    try
                    {
                        // Include staff name in the notification title
                        var staffName = $"{CurrentUser.firstname} {CurrentUser.lastname}";
                        var notification = new Notification
                        {
                            user_id = reservation.user_id,
                            title = $"Facility Booking Completed: {reservation.Facility.name}",
                            message = model.notificationMessage,
                            created_date = DateTime.Now,
                            is_read = false,
                            type = "facility_booking",
                            reference_id = reservation.reservation_id.ToString()
                        };

                        _context.Notification.Add(notification);
                        Console.WriteLine($"Created completion notification for user {reservation.user_id} regarding facility reservation {reservation.reservation_id}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error creating notification: {ex.Message}");
                        // Continue even if notification creation fails
                    }
                }

                // Save changes to the database
                await _context.SaveChangesAsync();

                // Return success response
                return Json(new { 
                    success = true, 
                    message = $"Facility booking marked as completed for {reservation.Facility.name}",
                    reservationId = reservation.reservation_id,
                    staffName = $"{CurrentUser.firstname} {CurrentUser.lastname}",
                    newStatus = reservation.status
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error completing facility reservation: {ex.Message}");
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        [Route("Staff/CompleteServiceRequest")]
        public async Task<JsonResult> CompleteServiceRequest([FromBody] CompletionModel model)
        {
            try
            {
                // Validate the model
                if (model.requestId <= 0)
                {
                    return Json(new { success = false, message = "Invalid request ID" });
                }

                // Find the service request
                var serviceRequest = await _context.ServiceRequest
                    .Include(sr => sr.User)
                    .FirstOrDefaultAsync(sr => sr.request_id == model.requestId);
                
                if (serviceRequest == null)
                {
                    return Json(new { success = false, message = "Service request not found" });
                }

                // Check that the service request is in the correct state
                if (serviceRequest.status != "In Progress")
                {
                    return Json(new { success = false, message = "This service request cannot be completed (invalid status)" });
                }

                // Update the service request status to "Completed"
                serviceRequest.status = "Completed";
                
                // Update completion notes if provided
                if (!string.IsNullOrEmpty(model.completionNotes))
                {
                    string dateStr = DateTime.Now.ToString("yyyy-MM-dd");
                    serviceRequest.staffNotes += $"\n\nCompletion Notes ({dateStr}): {model.completionNotes}";
                }

                // Create a notification for the user
                if (!string.IsNullOrEmpty(model.notificationMessage))
                {
                    try
                    {
                        // Include staff name in the notification title
                        var staffName = $"{CurrentUser.firstname} {CurrentUser.lastname}";
                        var notification = new Notification
                        {
                            user_id = serviceRequest.user_id,
                            title = $"Service Request Completed: {serviceRequest.service_type}",
                            message = model.notificationMessage,
                            created_date = DateTime.Now,
                            is_read = false,
                            type = "service_request",
                            reference_id = serviceRequest.request_id.ToString()
                        };

                        _context.Notification.Add(notification);
                        Console.WriteLine($"Created completion notification for user {serviceRequest.user_id} regarding service request {serviceRequest.request_id}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error creating notification: {ex.Message}");
                        // Continue even if notification creation fails
                    }
                }

                // Save changes to the database
                await _context.SaveChangesAsync();

                // Broadcast the update via WebSocket if available
                try {
                    var serviceRequestWebSocketManager = HttpContext.RequestServices.GetRequiredService<ServiceRequestWebSocketManager>();
                    await serviceRequestWebSocketManager.BroadcastServiceRequestUpdate(serviceRequest);
                } catch (Exception ex) {
                    Console.WriteLine($"Error broadcasting service request update: {ex.Message}");
                    // Continue even if WebSocket broadcast fails
                }

                return Json(new { 
                    success = true, 
                    message = $"Service request marked as completed: {serviceRequest.service_type}",
                    requestId = serviceRequest.request_id,
                    staffName = $"{CurrentUser.firstname} {CurrentUser.lastname}",
                    newStatus = serviceRequest.status
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error completing service request: {ex.Message}");
                return Json(new { success = false, message = ex.Message });
            }
        }

        public class CommentModel
        {
            public int PostId { get; set; }
            public string Content { get; set; }
        }

        public class PostUpdateModel
        {
            public int postId { get; set; }
            public string content { get; set; }
        }

        public class PostDeleteModel
        {
            public int postId { get; set; }
        }

        public class DuplicateCheckModel
        {
            public string facility { get; set; }
            public string type { get; set; }
        }

        public class ServiceRequestUpdateModel
        {
            public int requestId { get; set; }
            public string status { get; set; }
            public string staffNotes { get; set; }
            public string notificationMessage { get; set; }
        }

        public class FacilityBookingModel
        {
            public int reservationId { get; set; }
            public string staffNotes { get; set; }
            public string notificationMessage { get; set; }
        }

        public class CompletionModel
        {
            public int reservationId { get; set; }
            public int requestId { get; set; }
            public string completionNotes { get; set; }
            public string notificationMessage { get; set; }
        }

        public IActionResult Documents()
        {
            var accessCheck = EnsureStaffAccess();
            if (accessCheck != null)
                return accessCheck;
                
            ViewContents();
            return View();
        }

        [HttpGet]
        public JsonResult GetStaffDocuments()
        {
            try
            {
                // Use direct SQL to avoid EF Core issues
                var connection = _context.Database.GetDbConnection();
                var wasOpen = connection.State == System.Data.ConnectionState.Open;
                
                if (!wasOpen)
                    connection.Open();
                
                try
                {
                    var documents = new List<object>();
                    
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = @"
                            SELECT d.document_id, d.name, d.file_path, d.file_type, d.file_size, 
                                   d.description, d.visibility, d.allow_download, d.apply_watermark, 
                                   d.upload_date, d.category, d.download_count, d.view_count,
                                   u.firstname, u.lastname
                            FROM Document d
                            LEFT JOIN [User] u ON d.uploader_id = u.user_id
                            WHERE d.visibility IN ('staff', 'admin')
                            ORDER BY d.upload_date DESC";
                        
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var uploaderName = "Unknown User";
                                if (!reader.IsDBNull(reader.GetOrdinal("firstname")) && !reader.IsDBNull(reader.GetOrdinal("lastname")))
                                {
                                    string firstname = reader.GetString(reader.GetOrdinal("firstname"));
                                    string lastname = reader.GetString(reader.GetOrdinal("lastname"));
                                    uploaderName = $"{firstname} {lastname}".Trim();
                                }
                                
                                documents.Add(new
                                {
                                    id = reader.GetInt32(reader.GetOrdinal("document_id")),
                                    name = reader.IsDBNull(reader.GetOrdinal("name")) ? string.Empty : reader.GetString(reader.GetOrdinal("name")),
                                    type = reader.IsDBNull(reader.GetOrdinal("file_type")) ? string.Empty : reader.GetString(reader.GetOrdinal("file_type")),
                                    category = reader.IsDBNull(reader.GetOrdinal("category")) ? string.Empty : reader.GetString(reader.GetOrdinal("category")),
                                    size = reader.GetInt64(reader.GetOrdinal("file_size")),
                                    uploaded = reader.GetDateTime(reader.GetOrdinal("upload_date")).ToString("yyyy-MM-dd"),
                                    url = reader.IsDBNull(reader.GetOrdinal("file_path")) ? string.Empty : reader.GetString(reader.GetOrdinal("file_path")),
                                    downloads = reader.GetInt32(reader.GetOrdinal("download_count")),
                                    allow_download = reader.GetBoolean(reader.GetOrdinal("allow_download")),
                                    uploader = uploaderName
                                });
                            }
                        }
                    }
                    
                    // Calculate statistics
                    var stats = new
                    {
                        total = documents.Count
                    };
                    
                    return Json(new { success = true, documents, stats });
                }
                finally
                {
                    if (!wasOpen)
                        connection.Close();
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> TrackDocumentView(int id)
        {
            try
            {
                var connection = _context.Database.GetDbConnection();
                var wasOpen = connection.State == System.Data.ConnectionState.Open;
                
                if (!wasOpen)
                    await connection.OpenAsync();
                
                try
                {
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = @"
                            UPDATE Document 
                            SET view_count = view_count + 1
                            WHERE document_id = @id AND visibility IN ('staff', 'admin')";
                        
                        var idParam = command.CreateParameter();
                        idParam.ParameterName = "@id";
                        idParam.Value = id;
                        command.Parameters.Add(idParam);
                        
                        await command.ExecuteNonQueryAsync();
                    }
                    
                    return Json(new { success = true });
                }
                finally
                {
                    if (!wasOpen)
                        connection.Close();
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> TrackDocumentDownload(int id)
        {
            try
            {
                var connection = _context.Database.GetDbConnection();
                var wasOpen = connection.State == System.Data.ConnectionState.Open;
                
                if (!wasOpen)
                    await connection.OpenAsync();
                
                try
                {
                    string filePath = null;
                    
                    // First check if the document exists and is available for staff
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = @"
                            SELECT file_path, allow_download 
                            FROM Document 
                            WHERE document_id = @id AND visibility IN ('staff', 'admin')";
                        
                        var idParam = command.CreateParameter();
                        idParam.ParameterName = "@id";
                        idParam.Value = id;
                        command.Parameters.Add(idParam);
                        
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                bool allowDownload = reader.GetBoolean(reader.GetOrdinal("allow_download"));
                                if (!allowDownload)
                                {
                                    return Json(new { success = false, message = "Downloads are not allowed for this document" });
                                }
                                
                                filePath = reader.IsDBNull(reader.GetOrdinal("file_path")) ? null : reader.GetString(reader.GetOrdinal("file_path"));
                                
                                // Check if file path is null or empty
                                if (string.IsNullOrEmpty(filePath))
                                {
                                    return Json(new { success = false, message = "Document file path is missing" });
                                }
                                
                                // Check if file exists on server
                                string fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", filePath.TrimStart('/'));
                                if (!System.IO.File.Exists(fullPath))
                                {
                                    return Json(new { success = false, message = "Document file not found on server" });
                                }
                                
                                // Make sure the file path starts with a forward slash for proper URL construction
                                if (!filePath.StartsWith("/"))
                                {
                                    filePath = "/" + filePath;
                                }
                            }
                            else
                            {
                                return Json(new { success = false, message = "Document not found or not accessible" });
                            }
                        }
                    }
                    
                    // Update download count
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = @"
                            UPDATE Document 
                            SET download_count = download_count + 1
                            WHERE document_id = @id";
                        
                        var idParam = command.CreateParameter();
                        idParam.ParameterName = "@id";
                        idParam.Value = id;
                        command.Parameters.Add(idParam);
                        
                        await command.ExecuteNonQueryAsync();
                    }
                    
                    return Json(new { success = true, url = filePath });
                }
                finally
                {
                    if (!wasOpen)
                        connection.Close();
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetDocumentDetails(int id)
        {
            try
            {
                // Use direct SQL to avoid EF Core issues
                var connection = _context.Database.GetDbConnection();
                var wasOpen = connection.State == System.Data.ConnectionState.Open;
                
                if (!wasOpen)
                    connection.Open();
                
                try
                {
                    // Create a document object to hold our result
                    Document document = null;
                    string uploaderName = "Unknown User";
                    
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = @"
                            SELECT d.document_id, d.name, d.file_path, d.file_type, d.file_size, 
                                   d.description, d.visibility, d.allow_download, d.apply_watermark, 
                                   d.upload_date, d.expiration_date, d.category, d.uploader_id, 
                                   d.download_count, d.view_count,
                                   u.firstname, u.lastname
                            FROM Document d
                            LEFT JOIN [User] u ON d.uploader_id = u.user_id
                            WHERE d.document_id = @id AND d.visibility IN ('staff', 'admin')";
                        
                        var idParam = command.CreateParameter();
                        idParam.ParameterName = "@id";
                        idParam.Value = id;
                        command.Parameters.Add(idParam);
                        
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                document = new Document
                                {
                                    document_id = reader.GetInt32(reader.GetOrdinal("document_id")),
                                    name = reader.IsDBNull(reader.GetOrdinal("name")) ? string.Empty : reader.GetString(reader.GetOrdinal("name")),
                                    file_path = reader.IsDBNull(reader.GetOrdinal("file_path")) ? string.Empty : reader.GetString(reader.GetOrdinal("file_path")),
                                    file_type = reader.IsDBNull(reader.GetOrdinal("file_type")) ? null : reader.GetString(reader.GetOrdinal("file_type")),
                                    file_size = reader.GetInt64(reader.GetOrdinal("file_size")),
                                    description = reader.IsDBNull(reader.GetOrdinal("description")) ? null : reader.GetString(reader.GetOrdinal("description")),
                                    visibility = reader.IsDBNull(reader.GetOrdinal("visibility")) ? "admin" : reader.GetString(reader.GetOrdinal("visibility")),
                                    allow_download = reader.GetBoolean(reader.GetOrdinal("allow_download")),
                                    apply_watermark = reader.GetBoolean(reader.GetOrdinal("apply_watermark")),
                                    upload_date = reader.GetDateTime(reader.GetOrdinal("upload_date")),
                                    expiration_date = reader.IsDBNull(reader.GetOrdinal("expiration_date")) ? null : (DateTime?)reader.GetDateTime(reader.GetOrdinal("expiration_date")),
                                    category = reader.IsDBNull(reader.GetOrdinal("category")) ? null : reader.GetString(reader.GetOrdinal("category")),
                                    uploader_id = reader.GetInt32(reader.GetOrdinal("uploader_id")),
                                    download_count = reader.GetInt32(reader.GetOrdinal("download_count")),
                                    view_count = reader.GetInt32(reader.GetOrdinal("view_count"))
                                };
                                
                                // Get uploader name if available
                                if (!reader.IsDBNull(reader.GetOrdinal("firstname")) && !reader.IsDBNull(reader.GetOrdinal("lastname")))
                                {
                                    string firstname = reader.GetString(reader.GetOrdinal("firstname"));
                                    string lastname = reader.GetString(reader.GetOrdinal("lastname"));
                                    uploaderName = $"{firstname} {lastname}".Trim();
                                }
                            }
                        }
                    }
                    
                    if (document == null)
                    {
                        return Json(new { success = false, message = "Document not found or not accessible" });
                    }

                    var result = new
                    {
                        id = document.document_id,
                        name = document.name ?? string.Empty,
                        type = document.file_type ?? string.Empty,
                        size = document.file_size,
                        uploaded = document.upload_date.ToString("yyyy-MM-dd"),
                        uploader = uploaderName,
                        category = document.category ?? string.Empty,
                        description = document.description ?? string.Empty,
                        allow_download = document.allow_download,
                        apply_watermark = document.apply_watermark,
                        download_count = document.download_count,
                        view_count = document.view_count,
                        url = document.file_path ?? string.Empty
                    };

                    return Json(new { success = true, document = result });
                }
                finally
                {
                    if (!wasOpen)
                        connection.Close();
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetEvents(string filter = "upcoming")
        {
            try
            {
                var today = DateTime.Now.Date;
                var query = _context.Event.AsQueryable();
                
                // Apply filter
                if (filter == "upcoming")
                {
                    query = query.Where(e => e.event_date >= today);
                }
                else if (filter == "past")
                {
                    query = query.Where(e => e.event_date < today);
                }
                else if (filter == "featured")
                {
                    query = query.Where(e => e.is_featured);
                }
                
                // Get user ID for checking RSVPs
                int userId = CurrentUser?.user_id ?? 0;
                
                // Get events data
                var events = query
                    .OrderBy(e => e.event_date)
                    .Select(e => new
                    {
                        id = e.event_id,
                        title = e.title,
                        date = e.event_date,
                        startTime = e.start_time,
                        endTime = e.end_time,
                        location = e.location,
                        description = e.description,
                        organizer = e.organizer,
                        contact = e.contact_email,
                        capacity = e.capacity,
                        rsvpCount = e.rsvp_count,
                        tags = e.tags,
                        featured = e.is_featured,
                        image = e.image_url
                    })
                    .ToList();
                
                // Process tags after retrieving data from database
                var processedEvents = events.Select(e => new
                {
                    e.id,
                    e.title,
                    e.date,
                    e.startTime,
                    e.endTime,
                    e.location,
                    e.description,
                    e.organizer,
                    e.contact,
                    e.capacity,
                    e.rsvpCount,
                    tags = e.tags != null ? e.tags.Split(',').ToList() : new List<string>(),
                    e.featured,
                    e.image
                }).ToList();
                
                // Get RSVPs for the current user using direct SQL to avoid navigation property issues
                List<int> userRsvps = new List<int>();
                if (userId > 0)
                {
                    // Create a simple query to get event IDs the user has RSVPed to
                    var sql = $"SELECT event_id FROM EventParticipant WHERE user_id = {userId}";
                    
                    using (var command = _context.Database.GetDbConnection().CreateCommand())
                    {
                        command.CommandText = sql;
                        
                        if (command.Connection.State != System.Data.ConnectionState.Open)
                            command.Connection.Open();
                        
                        using (var result = command.ExecuteReader())
                        {
                            while (result.Read())
                            {
                                userRsvps.Add(result.GetInt32(0)); // Get the event_id
                            }
                        }
                    }
                }
                
                var eventsWithRsvp = processedEvents.Select(e => new
                {
                    e.id,
                    e.title,
                    e.date,
                    e.startTime,
                    e.endTime,
                    e.location,
                    e.description,
                    e.organizer,
                    e.contact,
                    e.capacity,
                    e.rsvpCount,
                    e.tags,
                    e.featured,
                    e.image,
                    hasRsvp = userRsvps.Contains(e.id)
                });
                
                return Json(new { success = true, events = eventsWithRsvp });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> RsvpForEvent([FromBody] EventRsvpModel model)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return Json(new { success = false, message = "You must be logged in to RSVP for events." });
                }
                
                var evt = await _context.Event.FindAsync(model.EventId);
                if (evt == null)
                {
                    return Json(new { success = false, message = "Event not found." });
                }
                
                // Check if user is already registered - using direct query to avoid navigation property issues
                var existingRsvp = await _context.Database.ExecuteSqlInterpolatedAsync(
                    $"SELECT COUNT(1) FROM EventParticipant WHERE event_id = {model.EventId} AND user_id = {CurrentUser.user_id}");
                
                bool isRegistered = existingRsvp > 0;
                
                if (model.IsAttending)
                {
                    // User wants to attend
                    if (isRegistered)
                    {
                        return Json(new { success = true, message = "You are already registered for this event." });
                    }
                    
                    // Check if event is full
                    if (evt.rsvp_count >= evt.capacity)
                    {
                        return Json(new { success = false, message = "This event is already at full capacity." });
                    }
                    
                    // Insert directly using SQL to avoid navigation property issues
                    await _context.Database.ExecuteSqlInterpolatedAsync(
                        $"INSERT INTO EventParticipant (event_id, user_id, participant_type, registered_at) VALUES ({model.EventId}, {CurrentUser.user_id}, 'staff', {DateTime.Now})");
                    
                    // Increment RSVP count
                    evt.rsvp_count += 1;
                    await _context.SaveChangesAsync();
                    
                    return Json(new { 
                        success = true, 
                        message = "You have successfully RSVP'd for this event!",
                        rsvpCount = evt.rsvp_count,
                        capacity = evt.capacity
                    });
                }
                else
                {
                    // User wants to cancel attendance
                    if (!isRegistered)
                    {
                        return Json(new { success = false, message = "You are not registered for this event." });
                    }
                    
                    // Delete directly using SQL to avoid navigation property issues
                    await _context.Database.ExecuteSqlInterpolatedAsync(
                        $"DELETE FROM EventParticipant WHERE event_id = {model.EventId} AND user_id = {CurrentUser.user_id}");
                    
                    // Decrement RSVP count
                    evt.rsvp_count = Math.Max(0, evt.rsvp_count - 1);
                    await _context.SaveChangesAsync();
                    
                    return Json(new { 
                        success = true, 
                        message = "Your RSVP has been canceled.",
                        rsvpCount = evt.rsvp_count,
                        capacity = evt.capacity
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetEventDetails(int id)
        {
            try
            {
                var userId = CurrentUser?.user_id ?? 0;
                
                var evt = _context.Event
                    .Where(e => e.event_id == id)
                    .Select(e => new
                    {
                        id = e.event_id,
                        title = e.title,
                        date = e.event_date,
                        startTime = e.start_time,
                        endTime = e.end_time,
                        location = e.location,
                        description = e.description,
                        organizer = e.organizer,
                        contact = e.contact_email,
                        capacity = e.capacity,
                        rsvpCount = e.rsvp_count,
                        tags = e.tags,
                        featured = e.is_featured,
                        image = e.image_url
                    })
                    .FirstOrDefault();
                
                if (evt == null)
                {
                    return Json(new { success = false, message = "Event not found." });
                }
                
                // Process tags after retrieving data from database
                var processedEvent = new
                {
                    evt.id,
                    evt.title,
                    evt.date,
                    evt.startTime,
                    evt.endTime,
                    evt.location,
                    evt.description,
                    evt.organizer,
                    evt.contact,
                    evt.capacity,
                    evt.rsvpCount,
                    tags = evt.tags != null ? evt.tags.Split(',').ToList() : new List<string>(),
                    evt.featured,
                    evt.image
                };
                
                // Check if user has RSVP'd for this event using raw SQL to avoid navigation property issues
                bool hasRsvp = false;
                if (userId > 0)
                {
                    var sql = $"SELECT COUNT(1) FROM EventParticipant WHERE event_id = {id} AND user_id = {userId}";
                    var count = _context.Database.ExecuteSqlRaw(sql);
                    hasRsvp = count > 0;
                }
                
                // Check if event is currently ongoing
                var now = DateTime.Now;
                var eventDate = evt.date.Date;
                
                // Parse start and end times and combine with event date
                var startTimeParts = evt.startTime.Split(':');
                var endTimeParts = evt.endTime.Split(':');
                
                var eventStartDateTime = new DateTime(
                    eventDate.Year, 
                    eventDate.Month, 
                    eventDate.Day, 
                    int.Parse(startTimeParts[0]), 
                    int.Parse(startTimeParts[1]), 
                    0
                );
                
                var eventEndDateTime = new DateTime(
                    eventDate.Year, 
                    eventDate.Month, 
                    eventDate.Day, 
                    int.Parse(endTimeParts[0]), 
                    int.Parse(endTimeParts[1]), 
                    0
                );
                
                bool isOngoing = now >= eventStartDateTime && now <= eventEndDateTime;
                
                return Json(new
                {
                    success = true,
                    event_details = new
                    {
                        processedEvent.id,
                        processedEvent.title,
                        processedEvent.date,
                        processedEvent.startTime,
                        processedEvent.endTime,
                        processedEvent.location,
                        processedEvent.description,
                        processedEvent.organizer,
                        processedEvent.contact,
                        processedEvent.capacity,
                        processedEvent.rsvpCount,
                        processedEvent.tags,
                        processedEvent.featured,
                        processedEvent.image,
                        hasRsvp,
                        isOngoing
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        public class EventRsvpModel
        {
            public int EventId { get; set; }
            public bool IsAttending { get; set; }
        }
    }
}