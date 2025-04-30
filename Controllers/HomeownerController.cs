using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using HomeOwner.Data;
using HomeOwner.Models;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace HomeOwner.Controllers
{
    public class HomeownerController : Controller
    {
        private readonly HomeOwnerContext _context;
        private readonly ILogger<HomeownerController> _logger;

        public HomeownerController(HomeOwnerContext context, ILogger<HomeownerController> logger)
        {
            _context = context;
            _logger = logger;
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
    }
} 