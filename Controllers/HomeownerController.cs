using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using HomeOwner.Data;
using HomeOwner.Models;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace HomeOwner.Controllers
{
    public class HomeownerController : BaseController
    {
        private readonly HomeOwnerContext _context;
        private readonly ILogger<HomeownerController> _logger;

        public HomeownerController(HomeOwnerContext context, ILogger<HomeownerController> logger)
        {
            _context = context;
            _logger = logger;
            
            // Check if the user is a homeowner before allowing access
            if (!homeownerRoute)
            {
                RedirectToAction("Index", "Home");
            }
        }

        [HttpPost]
        public async Task<JsonResult> CreateServiceRequest([FromBody] ServiceRequest request)
        {
            try
            {
                _logger.LogInformation($"Received service request: {System.Text.Json.JsonSerializer.Serialize(request)}");

                if (request == null)
                {
                    _logger.LogError("Request object is null");
                    return Json(new { success = false, message = "Invalid request data." });
                }

                if (request.user_id <= 0)
                {
                    _logger.LogError($"Invalid user ID: {request.user_id}");
                    return Json(new { success = false, message = "Invalid user ID." });
                }

                var user = await _context.User.FindAsync(request.user_id);
                if (user == null)
                {
                    _logger.LogError($"User not found for ID: {request.user_id}");
                    return Json(new { success = false, message = "User not found." });
                }

                // Set default values
                request.date_created = DateTime.Now;
                request.status = "Pending Approval";
                request.payment_status = "Unpaid";

                // Validate required fields
                var validationErrors = new List<string>();

                if (string.IsNullOrEmpty(request.service_type))
                    validationErrors.Add("Service type is required.");

                if (string.IsNullOrEmpty(request.frequency))
                    validationErrors.Add("Service frequency is required.");

                if (request.scheduled_date == default)
                    validationErrors.Add("Scheduled date is required.");

                if (string.IsNullOrEmpty(request.scheduled_time))
                    validationErrors.Add("Scheduled time is required.");

                if (validationErrors.Any())
                {
                    _logger.LogError($"Validation errors: {string.Join(", ", validationErrors)}");
                    return Json(new { success = false, message = string.Join(" ", validationErrors) });
                }

                try
                {
                    _context.ServiceRequest.Add(request);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Service request created successfully with ID: {request.request_id}");
                }
                catch (Exception dbEx)
                {
                    _logger.LogError(dbEx, "Database error while saving service request");
                    return Json(new { success = false, message = "Database error while saving the request." });
                }

                // Broadcast new service request - make it optional
                try {
                    var serviceRequestWebSocketManager = HttpContext.RequestServices.GetService<ServiceRequestWebSocketManager>();
                    if (serviceRequestWebSocketManager != null) {
                        await serviceRequestWebSocketManager.BroadcastNewServiceRequest(request, user);
                        _logger.LogInformation("WebSocket broadcast completed successfully");
                    }
                } catch (Exception wsEx) {
                    _logger.LogWarning(wsEx, "WebSocket notification failed, but service request was created successfully");
                }

                return Json(new { success = true, message = "Service request created successfully!", requestId = request.request_id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled error creating service request");
                return Json(new { 
                    success = false, 
                    message = "An error occurred while creating the service request. Please try again.",
                    details = ex.Message // Adding detailed error message for debugging
                });
            }
        }
        
        [HttpPost]
        public async Task<JsonResult> CreateFacilityReservation([FromBody] FacilityReservation reservation)
        {
            try
            {
                _logger.LogInformation($"Received facility reservation: {System.Text.Json.JsonSerializer.Serialize(reservation)}");

                if (reservation == null)
                {
                    _logger.LogError("Reservation object is null");
                    return Json(new { success = false, message = "Invalid reservation data." });
                }

                if (reservation.user_id <= 0)
                {
                    _logger.LogError($"Invalid user ID: {reservation.user_id}");
                    return Json(new { success = false, message = "Invalid user ID." });
                }

                var user = await _context.User.FindAsync(reservation.user_id);
                if (user == null)
                {
                    _logger.LogError($"User not found for ID: {reservation.user_id}");
                    return Json(new { success = false, message = "User not found." });
                }

                // Set default values
                reservation.date_created = DateTime.Now;
                reservation.status = "Pending";
                reservation.payment_status = "Unpaid";

                // Validate required fields
                var validationErrors = new List<string>();

                if (reservation.facility_id <= 0)
                    validationErrors.Add("Facility ID is required.");

                if (reservation.reservation_date == default)
                    validationErrors.Add("Reservation date is required.");

                if (string.IsNullOrEmpty(reservation.reservation_time))
                    validationErrors.Add("Reservation time is required.");

                if (reservation.duration_hours <= 0)
                    validationErrors.Add("Duration is required.");

                if (reservation.guest_count <= 0)
                    validationErrors.Add("Guest count is required.");

                if (string.IsNullOrEmpty(reservation.purpose))
                    validationErrors.Add("Purpose is required.");

                if (validationErrors.Any())
                {
                    _logger.LogError($"Validation errors: {string.Join(", ", validationErrors)}");
                    return Json(new { success = false, message = string.Join(" ", validationErrors) });
                }

                try
                {
                    _context.FacilityReservation.Add(reservation);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Facility reservation created successfully with ID: {reservation.reservation_id}");
                }
                catch (Exception dbEx)
                {
                    _logger.LogError(dbEx, "Database error while saving facility reservation");
                    return Json(new { success = false, message = "Database error while saving the reservation." });
                }

                // Broadcast new reservation - make it optional
                try {
                    var serviceRequestWebSocketManager = HttpContext.RequestServices.GetService<ServiceRequestWebSocketManager>();
                    if (serviceRequestWebSocketManager != null) {
                        // You could implement a specific facility broadcast method if needed
                        _logger.LogInformation("WebSocket broadcast completed successfully");
                    }
                } catch (Exception wsEx) {
                    _logger.LogWarning(wsEx, "WebSocket notification failed, but facility reservation was created successfully");
                }

                return Json(new { success = true, message = "Facility reservation created successfully!", reservationId = reservation.reservation_id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled error creating facility reservation");
                return Json(new { 
                    success = false, 
                    message = "An error occurred while creating the facility reservation. Please try again.",
                    details = ex.Message // Adding detailed error message for debugging
                });
            }
        }
        
        public IActionResult Payment()
        {
            // Get the current user ID from the session
            int userId = 0;
            if (HttpContext.Session.GetString("user_id") != null)
            {
                userId = Convert.ToInt32(HttpContext.Session.GetString("user_id"));
                ViewBag.CurrentUser = _context.User.FirstOrDefault(u => u.user_id == userId);
            }
            
            return View();
        }
        
        [HttpGet]
        public async Task<JsonResult> GetUserServiceRequests(int userId)
        {
            try
            {
                if (userId <= 0)
                {
                    return Json(new { success = false, message = "Invalid user ID" });
                }
                
                // Get all service requests for this user - include all requests regardless of payment status
                var serviceRequests = await _context.ServiceRequest
                    .Where(r => r.user_id == userId)
                    .Select(r => new
                    {
                        id = r.request_id,
                        service = r.service_type,
                        icon = r.service_icon,
                        date = r.scheduled_date.ToString("yyyy-MM-dd"),
                        time = r.scheduled_time,
                        frequency = r.frequency,
                        price = r.price.ToString("C2"),
                        status = r.status,
                        paymentStatus = r.payment_status,
                        staffNotes = r.staffNotes
                    })
                    .ToListAsync();

                // Find rejection notifications for these service requests to get rejection reasons
                var requestIds = serviceRequests.Select(r => r.id.ToString()).ToList();
                var rejectionNotifications = await _context.Notification
                    .Where(n => n.user_id == userId && n.type == "service_request" && requestIds.Contains(n.reference_id))
                    .Select(n => new { requestId = n.reference_id, message = n.message })
                    .ToListAsync();

                // Create a dictionary of rejection messages by request ID for quick lookup
                var rejectionMessages = rejectionNotifications.ToDictionary(
                    n => int.Parse(n.requestId),
                    n => n.message
                );

                // Enhance service requests with rejection reasons
                var enhancedRequests = serviceRequests.Select(r => new
                {
                    r.id,
                    r.service,
                    r.icon,
                    r.date,
                    r.time,
                    r.frequency,
                    r.price,
                    r.status,
                    r.paymentStatus,
                    rejectionReason = r.status == "Rejected" ? 
                        (rejectionMessages.ContainsKey(r.id) ? 
                            ExtractRejectionReason(rejectionMessages[r.id]) : 
                            r.staffNotes) : 
                        null
                }).ToList();
                
                return Json(new { success = true, serviceRequests = enhancedRequests });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving service requests for user ID {userId}");
                return Json(new { success = false, message = "Error retrieving service requests" });
            }
        }
        
        [HttpGet]
        public async Task<JsonResult> GetUserFacilityReservations(int userId)
        {
            try
            {
                if (userId <= 0)
                {
                    return Json(new { success = false, message = "Invalid user ID" });
                }
                
                // Get all facility reservations for this user - include all reservations regardless of payment status
                var reservations = await _context.FacilityReservation
                    .Include(r => r.Facility)
                    .Where(r => r.user_id == userId)
                    .Select(r => new
                    {
                        id = r.reservation_id,
                        facility = r.Facility.name,
                        date = r.reservation_date.ToString("yyyy-MM-dd"),
                        time = r.reservation_time,
                        duration = $"{r.duration_hours} hour{(r.duration_hours > 1 ? "s" : "")}",
                        guests = r.guest_count,
                        purpose = r.purpose,
                        price = r.price.ToString("C2"),
                        status = r.status,
                        paymentStatus = r.payment_status,
                        staffNotes = r.staff_notes
                    })
                    .ToListAsync();

                // Find rejection notifications for these facility reservations to get rejection reasons
                var reservationIds = reservations.Select(r => r.id.ToString()).ToList();
                var rejectionNotifications = await _context.Notification
                    .Where(n => n.user_id == userId && n.type == "facility" && reservationIds.Contains(n.reference_id))
                    .Select(n => new { reservationId = n.reference_id, message = n.message })
                    .ToListAsync();

                // Create a dictionary of rejection messages by reservation ID for quick lookup
                var rejectionMessages = rejectionNotifications.ToDictionary(
                    n => int.Parse(n.reservationId),
                    n => n.message
                );

                // Enhance reservations with rejection reasons
                var enhancedReservations = reservations.Select(r => new
                {
                    r.id,
                    r.facility,
                    r.date,
                    r.time,
                    r.duration,
                    r.guests,
                    r.purpose,
                    r.price,
                    r.status,
                    r.paymentStatus,
                    rejectionReason = (r.status == "Cancelled" || r.status == "Rejected") ? 
                        (rejectionMessages.ContainsKey(r.id) ? 
                            ExtractRejectionReason(rejectionMessages[r.id]) : 
                            r.staffNotes) : 
                        null
                }).ToList();
                
                return Json(new { success = true, reservations = enhancedReservations });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving facility reservations for user ID {userId}");
                return Json(new { success = false, message = "Error retrieving facility reservations" });
            }
        }
        
        [HttpPost]
        public async Task<JsonResult> ProcessServicePayment([FromBody] PaymentRequest paymentRequest)
        {
            try
            {
                // Validate the request
                if (paymentRequest == null || paymentRequest.RequestId <= 0)
                {
                    return Json(new { success = false, message = "Invalid payment request data" });
                }
                
                // Find the service request
                var serviceRequest = await _context.ServiceRequest.FindAsync(paymentRequest.RequestId);
                if (serviceRequest == null)
                {
                    return Json(new { success = false, message = "Service request not found" });
                }
                
                // For security, also check that the user making the payment owns the request
                int currentUserId = 0;
                if (HttpContext.Session.GetString("user_id") != null)
                {
                    currentUserId = Convert.ToInt32(HttpContext.Session.GetString("user_id"));
                }
                
                if (serviceRequest.user_id != currentUserId && currentUserId != 0)
                {
                    return Json(new { success = false, message = "You are not authorized to pay for this request" });
                }
                
                // Update the payment status
                serviceRequest.payment_status = "Paid";
                
                // If request is in "Pending Approval" status, automatically approve it upon payment
                if (serviceRequest.status == "Pending Approval")
                {
                    serviceRequest.status = "Approved";
                }
                
                await _context.SaveChangesAsync();
                
                // Notify via WebSocket if available
                try
                {
                    var serviceRequestWebSocketManager = HttpContext.RequestServices.GetService<ServiceRequestWebSocketManager>();
                    if (serviceRequestWebSocketManager != null)
                    {
                        await serviceRequestWebSocketManager.BroadcastServiceRequestUpdate(serviceRequest);
                        _logger.LogInformation($"WebSocket payment update broadcast completed for request {serviceRequest.request_id}");
                    }
                }
                catch (Exception wsEx)
                {
                    _logger.LogWarning(wsEx, "WebSocket payment notification failed, but payment was processed successfully");
                }
                
                return Json(new { 
                    success = true, 
                    message = "Payment processed successfully! Your service request has been approved.",
                    requestId = serviceRequest.request_id 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing service payment");
                return Json(new { success = false, message = "Error processing payment", details = ex.Message });
            }
        }
        
        [HttpPost]
        public async Task<JsonResult> ProcessFacilityPayment([FromBody] PaymentRequest paymentRequest)
        {
            try
            {
                // Validate the request
                if (paymentRequest == null || paymentRequest.RequestId <= 0)
                {
                    return Json(new { success = false, message = "Invalid payment request data" });
                }
                
                // Find the facility reservation
                var reservation = await _context.FacilityReservation.FindAsync(paymentRequest.RequestId);
                if (reservation == null)
                {
                    return Json(new { success = false, message = "Facility reservation not found" });
                }
                
                // For security, also check that the user making the payment owns the reservation
                int currentUserId = 0;
                if (HttpContext.Session.GetString("user_id") != null)
                {
                    currentUserId = Convert.ToInt32(HttpContext.Session.GetString("user_id"));
                }
                
                if (reservation.user_id != currentUserId && currentUserId != 0)
                {
                    return Json(new { success = false, message = "You are not authorized to pay for this reservation" });
                }
                
                // Update the payment status
                reservation.payment_status = "Paid";
                
                // If reservation is in "Pending" status, automatically approve it upon payment
                if (reservation.status == "Pending")
                {
                    reservation.status = "Approved";
                }
                
                await _context.SaveChangesAsync();
                
                // Notify via WebSocket if available - could implement specific facility broadcast
                
                return Json(new { 
                    success = true, 
                    message = "Payment processed successfully! Your facility reservation has been approved.",
                    reservationId = reservation.reservation_id 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing facility payment");
                return Json(new { success = false, message = "Error processing payment", details = ex.Message });
            }
        }
        
        [HttpGet]
        public async Task<JsonResult> GetUserNotifications()
        {
            try
            {
                // Get current user ID from session
                int userId = 0;
                if (HttpContext.Session.GetString("user_id") != null)
                {
                    userId = Convert.ToInt32(HttpContext.Session.GetString("user_id"));
                }
                
                if (userId <= 0)
                {
                    return Json(new { success = false, message = "User not authenticated" });
                }
                
                // Get notifications for this user, ordered by date (newest first)
                var notifications = await _context.Notification
                    .Where(n => n.user_id == userId)
                    .OrderByDescending(n => n.created_date)
                    .Select(n => new
                    {
                        id = n.notification_id,
                        title = n.title,
                        message = n.message,
                        created_date = n.created_date.ToString("MMM dd, yyyy hh:mm tt"),
                        is_read = n.is_read,
                        type = n.type,
                        reference_id = n.reference_id
                    })
                    .ToListAsync();
                
                return Json(new { success = true, notifications });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving notifications");
                return Json(new { success = false, message = "Error retrieving notifications" });
            }
        }
        
        [HttpGet]
        public async Task<JsonResult> GetUserUnreadNotificationsCount()
        {
            try
            {
                // Get current user ID from session
                int userId = 0;
                if (HttpContext.Session.GetString("user_id") != null)
                {
                    userId = Convert.ToInt32(HttpContext.Session.GetString("user_id"));
                }
                
                if (userId <= 0)
                {
                    return Json(new { success = false, message = "User not authenticated" });
                }
                
                // Count unread notifications
                var unreadCount = await _context.Notification
                    .Where(n => n.user_id == userId && !n.is_read)
                    .CountAsync();
                
                return Json(new { success = true, unreadCount });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error counting unread notifications");
                return Json(new { success = false, message = "Error retrieving notification count" });
            }
        }
        
        [HttpPost]
        public async Task<JsonResult> MarkUserNotificationAsRead(int notificationId)
        {
            try
            {
                // Get current user ID from session
                int userId = 0;
                if (HttpContext.Session.GetString("user_id") != null)
                {
                    userId = Convert.ToInt32(HttpContext.Session.GetString("user_id"));
                }
                
                if (userId <= 0)
                {
                    return Json(new { success = false, message = "User not authenticated" });
                }
                
                // Find the notification
                var notification = await _context.Notification.FindAsync(notificationId);
                
                if (notification == null)
                {
                    return Json(new { success = false, message = "Notification not found" });
                }
                
                // Verify the notification belongs to the current user
                if (notification.user_id != userId)
                {
                    return Json(new { success = false, message = "Unauthorized access to notification" });
                }
                
                // Mark as read
                notification.is_read = true;
                await _context.SaveChangesAsync();
                
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking notification as read");
                return Json(new { success = false, message = "Error updating notification" });
            }
        }
        
        [HttpPost]
        public async Task<JsonResult> MarkAllUserNotificationsAsRead()
        {
            try
            {
                // Get current user ID from session
                int userId = 0;
                if (HttpContext.Session.GetString("user_id") != null)
                {
                    userId = Convert.ToInt32(HttpContext.Session.GetString("user_id"));
                }
                
                if (userId <= 0)
                {
                    return Json(new { success = false, message = "User not authenticated" });
                }
                
                // Get all unread notifications for this user
                var notifications = await _context.Notification
                    .Where(n => n.user_id == userId && !n.is_read)
                    .ToListAsync();
                
                // Mark all as read
                foreach (var notification in notifications)
                {
                    notification.is_read = true;
                }
                
                await _context.SaveChangesAsync();
                
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking all notifications as read");
                return Json(new { success = false, message = "Error updating notifications" });
            }
        }

        // Fetch notifications for the current user
        [HttpGet]
        public JsonResult GetNotifications()
        {
            try
            {
                if (CurrentUser == null)
                {
                    return Json(new { success = false, message = "User not authenticated" });
                }

                int userId = CurrentUser.user_id;
                var notifications = _context.Notification
                    .Where(n => n.user_id == userId)
                    .OrderByDescending(n => n.created_date)
                    .ToList();

                return Json(new { success = true, notifications });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Mark a notification as read
        [HttpPost]
        public JsonResult MarkNotificationAsRead(int notificationId)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return Json(new { success = false, message = "User not authenticated" });
                }

                int userId = CurrentUser.user_id;
                var notification = _context.Notification
                    .FirstOrDefault(n => n.notification_id == notificationId && n.user_id == userId);

                if (notification == null)
                {
                    return Json(new { success = false, message = "Notification not found" });
                }

                notification.is_read = true;
                _context.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Mark all notifications as read
        [HttpPost]
        public JsonResult MarkAllNotificationsAsRead()
        {
            try
            {
                if (CurrentUser == null)
                {
                    return Json(new { success = false, message = "User not authenticated" });
                }

                int userId = CurrentUser.user_id;
                var notifications = _context.Notification
                    .Where(n => n.user_id == userId && !n.is_read)
                    .ToList();

                foreach (var notification in notifications)
                {
                    notification.is_read = true;
                }

                _context.SaveChanges();

                return Json(new { success = true, count = notifications.Count });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Helper method to extract rejection reason from notification message
        private string ExtractRejectionReason(string message)
        {
            if (string.IsNullOrEmpty(message)) return "No reason provided";
            
            // Notifications typically have a format like "Your request... has been rejected.\n\nReason: The actual reason"
            if (message.Contains("Reason:"))
            {
                var reasonPart = message.Split("Reason:", StringSplitOptions.RemoveEmptyEntries);
                if (reasonPart.Length > 1)
                {
                    return reasonPart[1].Trim();
                }
            }
            
            return message; // Return full message if we can't extract the reason
        }
    }
    
    public class PaymentRequest
    {
        public int RequestId { get; set; }
        public string PaymentMethod { get; set; }
    }
} 