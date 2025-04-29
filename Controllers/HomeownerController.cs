using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using HomeOwner.Data;
using HomeOwner.Models;
using Microsoft.Extensions.Logging;

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
                if (request.user_id <= 0)
                {
                    return Json(new { success = false, message = "Invalid user ID." });
                }

                var user = await _context.User.FindAsync(request.user_id);
                if (user == null)
                {
                    return Json(new { success = false, message = "User not found." });
                }

                // Set default values
                request.date_created = DateTime.Now;
                request.status = "Pending Approval";
                request.payment_status = "Unpaid";

                // Validate required fields
                if (string.IsNullOrEmpty(request.service_type))
                {
                    return Json(new { success = false, message = "Service type is required." });
                }

                if (string.IsNullOrEmpty(request.frequency))
                {
                    return Json(new { success = false, message = "Service frequency is required." });
                }

                if (request.scheduled_date == default)
                {
                    return Json(new { success = false, message = "Scheduled date is required." });
                }

                if (string.IsNullOrEmpty(request.scheduled_time))
                {
                    return Json(new { success = false, message = "Scheduled time is required." });
                }

                _context.ServiceRequest.Add(request);
                await _context.SaveChangesAsync();

                // Broadcast new service request
                var serviceRequestWebSocketManager = HttpContext.RequestServices.GetRequiredService<ServiceRequestWebSocketManager>();
                await serviceRequestWebSocketManager.BroadcastNewServiceRequest(request, user);

                return Json(new { success = true, message = "Service request created successfully!" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating service request");
                return Json(new { success = false, message = "An error occurred while creating the service request. Please try again." });
            }
        }
    }
} 