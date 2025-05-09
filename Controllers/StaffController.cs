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
            if (!staffRoute)
            {
                RedirectToAction("Index", "Home");
            }
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
            ViewContents();
            return View();
        }

        public IActionResult StaffCommunity()
        {
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
            ViewBag.CurrentUser = CurrentUser;
            return View();
        }

        public IActionResult StaffCurrentTask()
        {
            ViewContents();
            return View();
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
    }
}