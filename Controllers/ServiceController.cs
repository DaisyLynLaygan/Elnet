using HomeOwner.Data;
using HomeOwner.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace HomeOwner.Controllers
{
    public class ServiceController : BaseController
    {
        private readonly HomeOwnerContext _context;

        public ServiceController(HomeOwnerContext db)
        {
            _context = db;

        }



        [HttpPost]
        public async Task<IActionResult> ConfirmBooking([FromBody] MaintenanceRequest bookingRequest)
        {
            try
            {
                // Parse dates safely
                if (!DateOnly.TryParse(bookingRequest.service_date, out var serviceDate))
                {
                    return BadRequest(new { success = false, message = "Invalid date format" });
                }

                if (!TimeSpan.TryParse(bookingRequest.service_time, out var serviceTime))
                {
                    return BadRequest(new { success = false, message = "Invalid time format" });
                }

                var booking = new MaintenanceRequest
                {
                    service_name = bookingRequest.service_name,
                    service_date = serviceDate.ToString("yyyy-MM-dd"), // Store as string
                    service_time = serviceTime.ToString(), // Store as string
                    frequency = bookingRequest.frequency,
                    notes = bookingRequest.notes,
                    price = bookingRequest.price, // Already parsed via priceString
                    status = "Pending",
                    created_date = DateTime.Now,
                    user_id = CurrentUser.user_id
                };

                _context.MaintenanceRequest.Add(booking);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Booking confirmed successfully!",
                    bookingId = booking.request_id
                });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new
                {
                    success = false,
                    message = "Error processing your booking",
                    error = ex.Message
                });
            }
        }


        //Get Booking List pending via CurrentUser.user_id
       
       
    }
}