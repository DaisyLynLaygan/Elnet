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

                // Group notifications by request ID and take the most recent one for each request
                var rejectionMessagesByRequestId = rejectionNotifications
                    .GroupBy(n => n.requestId)
                    .ToDictionary(
                        g => int.Parse(g.Key),
                        g => g.OrderByDescending(n => n.message?.Length ?? 0).First().message // Take the one with longest message as it's likely most detailed
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
                        (rejectionMessagesByRequestId.ContainsKey(r.id) ? 
                            ExtractRejectionReason(rejectionMessagesByRequestId[r.id]) : 
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
                int currentUserId = CurrentUser?.user_id ?? 0;
                
                if (serviceRequest.user_id != currentUserId && currentUserId != 0)
                {
                    return Json(new { success = false, message = "You are not authorized to pay for this request" });
                }
                
                // Check if payment is needed
                if (serviceRequest.payment_status == "Paid")
                {
                    return Json(new { success = false, message = "This service request has already been paid" });
                }
                
                if (serviceRequest.status == "Rejected")
                {
                    return Json(new { success = false, message = "Cannot pay for a rejected service request" });
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

        [HttpGet]
        public async Task<JsonResult> GetPaymentHistory(int months = 12)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return Json(new { success = false, message = "User not authenticated" });
                }

                int userId = CurrentUser.user_id;
                
                // Calculate the start date based on months parameter
                var startDate = DateTime.Now.AddMonths(-months);
                
                // Get service requests with payment data
                var serviceRequests = await _context.ServiceRequest
                    .Where(sr => sr.user_id == userId && 
                                sr.payment_status == "Paid" && 
                                sr.date_created >= startDate)
                    .Select(sr => new
                    {
                        id = sr.request_id,
                        type = "service",
                        service = sr.service_type,
                        date = sr.date_created.ToString("yyyy-MM-dd"),
                        amount = sr.price,
                        status = sr.status,
                        paymentDate = sr.date_created // Using date_created as a proxy for payment date
                    })
                    .ToListAsync();
                
                // Get facility reservations with payment data
                var facilityReservations = await _context.FacilityReservation
                    .Include(fr => fr.Facility)
                    .Where(fr => fr.user_id == userId && 
                                fr.payment_status == "Paid" && 
                                fr.date_created >= startDate)
                    .Select(fr => new
                    {
                        id = fr.reservation_id,
                        type = "facility",
                        facility = fr.Facility.name,
                        date = fr.date_created.ToString("yyyy-MM-dd"),
                        amount = fr.price,
                        status = fr.status,
                        paymentDate = fr.date_created // Using date_created as a proxy for payment date
                    })
                    .ToListAsync();
                    
                // Get rent payments with payment data
                var rentPayments = await _context.RentPayment
                    .Where(rp => rp.user_id == userId && 
                                rp.status == "Paid" && 
                                rp.payment_date >= startDate)
                    .Select(rp => new
                    {
                        id = rp.payment_id,
                        type = "rent",
                        description = "Monthly Rent",
                        date = rp.payment_date.Value.ToString("yyyy-MM-dd"),
                        amount = rp.amount,
                        status = "completed",
                        paymentDate = rp.payment_date
                    })
                    .ToListAsync();
                
                // Calculate summary statistics - all time totals
                var allTimeServiceRequests = await _context.ServiceRequest
                    .Where(sr => sr.user_id == userId && sr.payment_status == "Paid")
                    .ToListAsync();
                    
                var allTimeFacilityReservations = await _context.FacilityReservation
                    .Where(fr => fr.user_id == userId && fr.payment_status == "Paid")
                    .ToListAsync();
                    
                var allTimeRentPayments = await _context.RentPayment
                    .Where(rp => rp.user_id == userId && rp.status == "Paid")
                    .ToListAsync();
                
                var totalSpent = allTimeServiceRequests.Sum(sr => sr.price) + 
                                allTimeFacilityReservations.Sum(fr => fr.price) + 
                                allTimeRentPayments.Sum(rp => rp.amount);
                
                // Calculate this month's spending
                var firstDayOfMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                var thisMonthServices = allTimeServiceRequests
                    .Where(sr => sr.date_created >= firstDayOfMonth)
                    .ToList();
                    
                var thisMonthFacilities = allTimeFacilityReservations
                    .Where(fr => fr.date_created >= firstDayOfMonth)
                    .ToList();
                    
                var thisMonthRent = allTimeRentPayments
                    .Where(rp => rp.payment_date >= firstDayOfMonth)
                    .ToList();
                    
                var thisMonthSpending = thisMonthServices.Sum(sr => sr.price) + 
                                       thisMonthFacilities.Sum(fr => fr.price) + 
                                       thisMonthRent.Sum(rp => rp.amount);
                
                // Get monthly spending for chart - only for the requested months
                var monthlySpending = new List<MonthlySpending>();
                
                // Get data for the requested number of months
                for (int i = 0; i < months; i++)
                {
                    var date = DateTime.Now.AddMonths(-i);
                    var firstDay = new DateTime(date.Year, date.Month, 1);
                    var lastDay = firstDay.AddMonths(1).AddDays(-1);
                    
                    var serviceSpending = allTimeServiceRequests
                        .Where(sr => sr.date_created >= firstDay && sr.date_created <= lastDay)
                        .Sum(sr => sr.price);
                        
                    var facilitySpending = allTimeFacilityReservations
                        .Where(fr => fr.date_created >= firstDay && fr.date_created <= lastDay)
                        .Sum(fr => fr.price);
                        
                    var rentSpending = allTimeRentPayments
                        .Where(rp => rp.payment_date >= firstDay && rp.payment_date <= lastDay)
                        .Sum(rp => rp.amount);
                    
                    monthlySpending.Add(new MonthlySpending
                    {
                        Month = date.ToString("MMM"),
                        Year = date.Year,
                        ServiceSpending = serviceSpending,
                        FacilitySpending = facilitySpending,
                        RentSpending = rentSpending
                    });
                }
                
                return Json(new
                {
                    success = true,
                    serviceRequests,
                    facilityReservations,
                    rentPayments,
                    stats = new
                    {
                        totalSpent,
                        thisMonthSpending,
                        serviceCount = allTimeServiceRequests.Count,
                        facilityCount = allTimeFacilityReservations.Count,
                        rentCount = allTimeRentPayments.Count
                    },
                    monthlySpending
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching payment history");
                return Json(new { success = false, message = "Error retrieving payment history" });
            }
        }
        
        [HttpGet]
        public async Task<JsonResult> GetCurrentRentPayment()
        {
            try
            {
                if (CurrentUser == null)
                {
                    return Json(new { success = false, message = "User not authenticated" });
                }

                int userId = CurrentUser.user_id;
                
                // First check if there's already a rent payment for the current month
                var today = DateTime.Now;
                var firstDayOfMonth = new DateTime(today.Year, today.Month, 1);
                var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
                
                var currentMonthRent = await _context.RentPayment
                    .Where(rp => rp.user_id == userId && 
                           rp.due_date >= firstDayOfMonth && 
                           rp.due_date <= lastDayOfMonth)
                    .FirstOrDefaultAsync();
                
                // If no rent payment exists for the current month, auto-generate one
                if (currentMonthRent == null)
                {
                    currentMonthRent = await GenerateMonthlyRentPayment(userId);
                }
                
                // Get property details (hardcoded for now, but in a real application this would come from the database)
                var propertyDetails = new
                {
                    name = "Luxury Villa in Beverly Hills",
                    bedrooms = 5,
                    bathrooms = 4,
                    squareFeet = 4200
                };
                
                return Json(new
                {
                    success = true,
                    rentPayment = new
                    {
                        id = currentMonthRent.payment_id,
                        amount = currentMonthRent.amount,
                        dueDate = currentMonthRent.due_date.ToString("MMMM d, yyyy"),
                        status = currentMonthRent.status,
                        isPaid = currentMonthRent.status == "Paid",
                        paymentDate = currentMonthRent.payment_date?.ToString("MMMM d, yyyy"),
                        paymentMethod = currentMonthRent.payment_method
                    },
                    property = propertyDetails
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching current rent payment");
                return Json(new { success = false, message = "Error retrieving rent payment information" });
            }
        }
        
        private async Task<RentPayment> GenerateMonthlyRentPayment(int userId)
        {
            // Get the current month and year
            var today = DateTime.Now;
            var dueDate = new DateTime(today.Year, today.Month, today.Day > 25 ? DateTime.DaysInMonth(today.Year, today.Month) : 30);
            
            // If today is already past the 30th, set due date to next month
            if (today.Day > 25)
            {
                dueDate = dueDate.AddMonths(1);
            }
            
            // Create a new rent payment
            var newRentPayment = new RentPayment
            {
                user_id = userId,
                amount = 8500.00m, // This should come from user's property information in a real app
                due_date = dueDate,
                status = "Unpaid",
                date_created = DateTime.Now
            };
            
            _context.RentPayment.Add(newRentPayment);
            await _context.SaveChangesAsync();
            
            // Create a notification for the user about the new rent payment
            var notification = new Notification
            {
                user_id = userId,
                title = "New Rent Payment",
                message = $"Your monthly rent of ${newRentPayment.amount:N2} is due on {dueDate:MMMM d, yyyy}.",
                type = "rent_payment",
                reference_id = newRentPayment.payment_id.ToString(),
                is_read = false,
                created_date = DateTime.Now
            };
            
            _context.Notification.Add(notification);
            await _context.SaveChangesAsync();
            
            return newRentPayment;
        }
        
        [HttpPost]
        public async Task<JsonResult> ProcessRentPayment([FromBody] RentPaymentRequest paymentRequest)
        {
            try
            {
                // Validate the request
                if (paymentRequest == null || paymentRequest.PaymentId <= 0)
                {
                    return Json(new { success = false, message = "Invalid payment request data" });
                }
                
                // Find the rent payment
                var rentPayment = await _context.RentPayment.FindAsync(paymentRequest.PaymentId);
                if (rentPayment == null)
                {
                    return Json(new { success = false, message = "Rent payment not found" });
                }
                
                // For security, also check that the user making the payment owns the payment
                int currentUserId = 0;
                if (HttpContext.Session.GetString("user_id") != null)
                {
                    currentUserId = Convert.ToInt32(HttpContext.Session.GetString("user_id"));
                }
                
                if (rentPayment.user_id != currentUserId && currentUserId != 0)
                {
                    return Json(new { success = false, message = "You are not authorized to pay for this rent" });
                }
                
                // If payment is already made, return success but with a message
                if (rentPayment.status == "Paid")
                {
                    return Json(new { success = true, message = "This rent payment has already been processed.", alreadyPaid = true });
                }
                
                // Update the payment status
                rentPayment.status = "Paid";
                rentPayment.payment_date = DateTime.Now;
                rentPayment.payment_method = paymentRequest.PaymentMethod;
                rentPayment.transaction_id = "TX-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
                
                await _context.SaveChangesAsync();
                
                // Create a notification for successful payment
                var notification = new Notification
                {
                    user_id = rentPayment.user_id,
                    title = "Rent Payment Successful",
                    message = $"Your rent payment of ${rentPayment.amount:N2} has been processed successfully.",
                    type = "payment_confirmation",
                    reference_id = rentPayment.payment_id.ToString(),
                    is_read = false,
                    created_date = DateTime.Now
                };
                
                _context.Notification.Add(notification);
                await _context.SaveChangesAsync();
                
                return Json(new { 
                    success = true, 
                    message = "Rent payment processed successfully!", 
                    paymentId = rentPayment.payment_id,
                    transaction = new
                    {
                        id = rentPayment.transaction_id,
                        date = rentPayment.payment_date?.ToString("yyyy-MM-dd"),
                        amount = rentPayment.amount
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing rent payment");
                return Json(new { success = false, message = "Error processing payment", details = ex.Message });
            }
        }
        
        // Scheduled method to generate monthly rent payments for all users
        // This would be called by a background service in a real application
        [NonAction]
        public async Task GenerateMonthlyRentPaymentsForAllUsers()
        {
            try
            {
                // Get all active homeowner users
                var homeowners = await _context.User
                    .Where(u => u.role == "homeowner" && u.status == "active")
                    .ToListAsync();
                
                var today = DateTime.Now;
                var currentMonth = today.Month;
                var currentYear = today.Year;
                
                foreach (var user in homeowners)
                {
                    // Check if the user already has a rent payment for current month
                    var firstDayOfMonth = new DateTime(currentYear, currentMonth, 1);
                    var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
                    
                    var existingPayment = await _context.RentPayment
                        .Where(rp => rp.user_id == user.user_id && 
                               rp.due_date >= firstDayOfMonth && 
                               rp.due_date <= lastDayOfMonth)
                        .FirstOrDefaultAsync();
                    
                    // If no payment exists for current month, create one
                    if (existingPayment == null)
                    {
                        await GenerateMonthlyRentPayment(user.user_id);
                    }
                }
                
                _logger.LogInformation($"Successfully generated rent payments for {homeowners.Count} users");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating monthly rent payments");
            }
        }
        
        public class MonthlySpending
        {
            public string Month { get; set; }
            public int Year { get; set; }
            public decimal ServiceSpending { get; set; }
            public decimal FacilitySpending { get; set; }
            public decimal RentSpending { get; set; }
        }

        public IActionResult Events()
        {
            ViewContents();
            return View();
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
                        $"INSERT INTO EventParticipant (event_id, user_id, participant_type, registered_at) VALUES ({model.EventId}, {CurrentUser.user_id}, 'homeowner', {DateTime.Now})");
                    
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
    
    public class PaymentRequest
    {
        public int RequestId { get; set; }
        public string PaymentMethod { get; set; }
    }
    
    public class RentPaymentRequest
    {
        public int PaymentId { get; set; }
        public string PaymentMethod { get; set; }
    }
} 