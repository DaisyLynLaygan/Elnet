﻿using HomeOwner.Data;
using HomeOwner.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HomeOwner.Controllers
{


    public class Homeowner : BaseController
    {
        private readonly HomeOwnerContext _context;
        public Homeowner(HomeOwnerContext db)
        {
            _context = db;
            if (!homeownerRoute)
            {

                RedirectToAction("Index", "Home");
            }
        }




        public List<Announcement> GetAnnouncements()
        {

            var currentDate = DateTime.Now;

            var announcements = _context.Announcement.Where(m => currentDate < m.end_date).ToList();



            return announcements;
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

        return Json(new { success = true, comment = new {
            id = comment.comment_id,
            content = comment.content,
            createdDate = comment.created_date?.ToString("MMMM dd, yyyy hh:mm tt"),
            author = new {
                id = author.user_id,
                name = $"{author.firstname} {author.lastname}",
                role = author.role
            }
        }});
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
            .Select(c => new {
                id = c.comment_id,
                content = c.content,
                createdDate = c.created_date,
                author = new {
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

public class CommentModel
{
    public int PostId { get; set; }
    public string Content { get; set; }
}

        //Error ni
        public void UpdateProfile(User model)
        {
            try
            {
                // Find the user in the database
                var existingUser = _context.User.FirstOrDefault(u => u.username == model.username);

                if (existingUser == null)
                {
                    ViewBag.Error = "Invalid user data.";
                    return;
                }

                // Update only the modified fields

                existingUser.firstname = model?.firstname;
                existingUser.lastname = model?.lastname;
                existingUser.email = model?.email;
                existingUser.address = model?.address;
                existingUser.contact_no = model?.contact_no;


                _context.User.Update(existingUser);
                _context.SaveChanges();

                ViewBag.Message = "Profile updated successfully!";

            }
            catch (Exception ex)
            {
                ViewBag.Error = "An error occurred while updating the profile.";

            }
        }

        [HttpPost]
        public async Task<IActionResult> AddPostUser(ViewModel model)
        {

            // Map Register model to User model
            var post = new Post
            {
                content = model.newPost.content,
                created_date = DateTime.Now,
                updated_date = DateTime.Now,
                user_id = CurrentUser.user_id,
            };
            if (model.newPost.ImageFile != null && model.newPost.ImageFile.Length > 0)
            {
                // Save the image to a folder (e.g., wwwroot/uploads/posts)
                var uploadsFolder = Path.Combine("wwwroot", "uploads", "posts");
                Directory.CreateDirectory(uploadsFolder); // Ensure folder exists

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + model.newPost.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.newPost.ImageFile.CopyToAsync(stream);
                }

                post.ImagePath = $"/uploads/posts/{uniqueFileName}"; // Save path
            }


            // Save the user to the database
            _context.Post.Add(post);
            _context.SaveChanges();


            // Redirect to the Login page


            ViewBag.message = "Error username existed";
            return RedirectToAction("Community", "Homeowner");
        }



      public List<Post> RetrievePost()
        {
            var posts = _context.Post
                .Include(p => p.Author)
                .OrderByDescending(p => p.created_date)
                .ToList();
            
            return posts; 
        }





        public IActionResult Dashboard()
        {
            ViewContents();
            return View();
        }
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult Feedback()
        {
            ViewContents();
            return View();
        }
        public IActionResult Community()
        {
            ViewContents(); // If this sets other ViewData (e.g., user info)

            var model = new ViewModel
            {
                Announcements = GetAnnouncements(), // Load announcements
                Posts = RetrievePost()             // Load posts
            };

            return View(model); // Pass the combined ViewModel
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

        public class PostUpdateModel
        {
            public int postId { get; set; }
            public string content { get; set; }
        }

        public class PostDeleteModel
        {
            public int postId { get; set; }
        }

        public IActionResult History()
        {
            ViewContents();
            return View();
        }
        public IActionResult UserProfile()
        {
            ViewContents();
            return View();
        }

        public IActionResult Notification()
        {
            ViewContents();
            return View();
        }

        [HttpGet]
        public async Task<JsonResult> GetUserNotificationsData()
        {
            try
            {
                if (CurrentUser == null)
                {
                    return Json(new { success = false, message = "User not authenticated" });
                }

                int userId = CurrentUser.user_id;
                var notifications = await _context.Notification
                    .Where(n => n.user_id == userId)
                    .OrderByDescending(n => n.created_date)
                    .ToListAsync();

                return Json(new { success = true, notifications });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        
        [HttpGet]
        public async Task<JsonResult> GetUnreadNotificationsCount()
        {
            try
            {
                // Check if user is authenticated
                if (CurrentUser == null || CurrentUser.user_id <= 0)
                {
                    return Json(new { success = false, message = "User not authenticated" });
                }
                
                // Count unread notifications
                var unreadCount = await _context.Notification
                    .Where(n => n.user_id == CurrentUser.user_id && !n.is_read)
                    .CountAsync();
                
                return Json(new { success = true, unreadCount });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error counting unread notifications: {ex.Message}");
                return Json(new { success = false, message = "Error retrieving notification count" });
            }
        }
        
        [HttpPost]
        public async Task<JsonResult> MarkUserNotificationRead(int notificationId)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return Json(new { success = false, message = "User not authenticated" });
                }

                int userId = CurrentUser.user_id;
                var notification = await _context.Notification
                    .FirstOrDefaultAsync(n => n.notification_id == notificationId && n.user_id == userId);

                if (notification == null)
                {
                    return Json(new { success = false, message = "Notification not found" });
                }

                notification.is_read = true;
                await _context.SaveChangesAsync();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        
        [HttpPost]
        public async Task<JsonResult> MarkAllUserNotificationsRead()
        {
            try
            {
                if (CurrentUser == null)
                {
                    return Json(new { success = false, message = "User not authenticated" });
                }

                int userId = CurrentUser.user_id;
                var notifications = await _context.Notification
                    .Where(n => n.user_id == userId && !n.is_read)
                    .ToListAsync();

                foreach (var notification in notifications)
                {
                    notification.is_read = true;
                }

                await _context.SaveChangesAsync();

                return Json(new { success = true, count = notifications.Count });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> SubmitFeedback([FromBody] FeedbackModel model)
        {
            try
            {
                // Validate required fields
                if (string.IsNullOrWhiteSpace(model.Title))
                {
                    return Json(new { success = false, message = "Please provide a title for your feedback" });
                }

                if (model.Title.Length < 3 || model.Title.Length > 100)
                {
                    return Json(new { success = false, message = "Title must be between 3 and 100 characters" });
                }

                if (string.IsNullOrWhiteSpace(model.Comment))
                {
                    return Json(new { success = false, message = "Please provide a comment for your feedback" });
                }

                if (model.Comment.Length < 10)
                {
                    return Json(new { success = false, message = "Your feedback comment is too short. Please provide more details." });
                }

                // Check if facility exists
                var facility = await _context.Facility.FindAsync(model.FacilityId);
                
                // If facility doesn't exist, create it on demand
                if (facility == null)
                {
                    string facilityName = model.FacilityId switch
                    {
                        1 => "Function Hall",
                        2 => "Sports Court",
                        3 => "Swimming Pool",
                        4 => "Gym Facility",
                        _ => $"Facility {model.FacilityId}"
                    };
                    
                    // Create a new facility with auto-incrementing ID 
                    facility = new Facility
                    {
                        name = facilityName,
                        description = $"A facility for our residents",
                        image_path = $"/images/{facilityName.ToLower().Replace(" ", "-")}.jpg",
                        overall_rating = 0,
                        review_count = 0,
                        cleanliness_rating = 0,
                        equipment_rating = 0,
                        staff_rating = 0,
                        value_rating = 0
                    };
                    
                    _context.Facility.Add(facility);
                    await _context.SaveChangesAsync();
                    
                    // Reload the facility to get the ID
                    facility = await _context.Facility.FirstOrDefaultAsync(f => f.name == facilityName);
                    
                    if (facility == null)
                    {
                        return Json(new { success = false, message = "Error creating facility" });
                    }
                }

                // Create new feedback
                var feedback = new Feedback
                {
                    facility_id = facility.facility_id, // Use the actual facility ID from the database
                    user_id = CurrentUser.user_id,
                    overall_rating = model.OverallRating,
                    cleanliness_rating = model.CleanlinessRating,
                    equipment_rating = model.EquipmentRating,
                    staff_rating = model.StaffRating,
                    value_rating = model.ValueRating,
                    title = model.Title.Trim(),
                    comment = model.Comment.Trim(),
                    photos = model.Photos != null ? System.Text.Json.JsonSerializer.Serialize(model.Photos) : null,
                    created_date = DateTime.Now
                };

                _context.Feedback.Add(feedback);
                await _context.SaveChangesAsync();

                // Update facility ratings
                await UpdateFacilityRatings(facility.facility_id);

                return Json(new { success = true, message = "Feedback submitted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }

        private async Task UpdateFacilityRatings(int facilityId)
        {
            try
            {
                // Use optimized query to get aggregated ratings in a single database call
                var ratings = await _context.Feedback
                    .Where(f => f.facility_id == facilityId)
                    .GroupBy(f => f.facility_id)
                    .Select(g => new
                    {
                        FacilityId = g.Key,
                        ReviewCount = g.Count(),
                        OverallRating = Math.Round(g.Average(f => f.overall_rating), 1),
                        CleanlinessRating = Math.Round(g.Average(f => f.cleanliness_rating), 1),
                        EquipmentRating = Math.Round(g.Average(f => f.equipment_rating), 1),
                        StaffRating = Math.Round(g.Average(f => f.staff_rating), 1),
                        ValueRating = Math.Round(g.Average(f => f.value_rating), 1)
                    })
                    .FirstOrDefaultAsync();

                if (ratings != null)
                {
                    var facility = await _context.Facility.FindAsync(facilityId);
                    if (facility != null)
                    {
                        facility.review_count = ratings.ReviewCount;
                        facility.overall_rating = (decimal)ratings.OverallRating;
                        facility.cleanliness_rating = (decimal)ratings.CleanlinessRating;
                        facility.equipment_rating = (decimal)ratings.EquipmentRating;
                        facility.staff_rating = (decimal)ratings.StaffRating;
                        facility.value_rating = (decimal)ratings.ValueRating;

                        await _context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error but don't let it crash the feedback submission
                Console.WriteLine($"Error updating facility ratings: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<JsonResult> GetFacilityFeedback(int facilityId, int page = 1, int pageSize = 10)
        {
            try
            {
                // Validate input
                page = Math.Max(1, page);
                pageSize = Math.Clamp(pageSize, 5, 20);
                
                // Check if facility exists
                var facility = await _context.Facility.FindAsync(facilityId);
                if (facility == null)
                {
                    // Create a new facility with the appropriate ID
                    string facilityName = facilityId switch
                    {
                        1 => "Function Hall",
                        2 => "Sports Court",
                        3 => "Swimming Pool",
                        4 => "Gym Facility",
                        _ => $"Facility {facilityId}"
                    };
                    
                    facility = new Facility
                    {
                        name = facilityName,
                        description = $"A facility for our residents",
                        image_path = $"/images/{facilityName.ToLower().Replace(" ", "-")}.jpg",
                        overall_rating = 0,
                        review_count = 0,
                        cleanliness_rating = 0,
                        equipment_rating = 0,
                        staff_rating = 0,
                        value_rating = 0
                    };
                    
                    _context.Facility.Add(facility);
                    await _context.SaveChangesAsync();
                    
                    // Reload the facility
                    facility = await _context.Facility.FirstOrDefaultAsync(f => f.name == facilityName);
                    
                    // Return empty feedback list since this is a new facility
                    return Json(new { 
                        success = true, 
                        feedbacks = new object[] { },
                        pagination = new {
                            currentPage = 1,
                            pageSize = pageSize,
                            totalItems = 0,
                            totalPages = 0
                        }
                    });
                }
                
                // Query with pagination and eager loading
                var query = _context.Feedback
                    .Include(f => f.User)
                    .Where(f => f.facility_id == facility.facility_id)
                    .OrderByDescending(f => f.created_date)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
                
                // Get total count for pagination
                var totalCount = await _context.Feedback
                    .Where(f => f.facility_id == facility.facility_id)
                    .CountAsync();
                
                // Execute query
                var feedbacks = await query
                    .Select(f => new
                    {
                        id = f.feedback_id,
                        title = f.title,
                        comment = f.comment,
                        overallRating = f.overall_rating,
                        cleanlinessRating = f.cleanliness_rating,
                        equipmentRating = f.equipment_rating,
                        staffRating = f.staff_rating,
                        valueRating = f.value_rating,
                        photos = f.photos,
                        createdDate = f.created_date,
                        user = new
                        {
                            id = f.User.user_id,
                            name = $"{f.User.firstname} {f.User.lastname}"
                        }
                    })
                    .ToListAsync();

                // Deserialize photos after the query
                var result = feedbacks.Select(f => new
                {
                    f.id,
                    f.title,
                    f.comment,
                    f.overallRating,
                    f.cleanlinessRating,
                    f.equipmentRating,
                    f.staffRating,
                    f.valueRating,
                    photos = string.IsNullOrEmpty(f.photos) ? null : System.Text.Json.JsonSerializer.Deserialize<string[]>(f.photos),
                    f.createdDate,
                    f.user
                });

                return Json(new { 
                    success = true, 
                    feedbacks = result,
                    pagination = new {
                        currentPage = page,
                        pageSize = pageSize,
                        totalItems = totalCount,
                        totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<JsonResult> GetFacilityDetails(int facilityId)
        {
            try
            {
                var facility = await _context.Facility.FindAsync(facilityId);
                if (facility == null)
                {
                    // Create the facility if it doesn't exist
                    string facilityName = facilityId switch
                    {
                        1 => "Function Hall",
                        2 => "Sports Court",
                        3 => "Swimming Pool",
                        4 => "Gym Facility",
                        _ => $"Facility {facilityId}"
                    };
                    
                    // Create a new facility with auto-incrementing ID
                    facility = new Facility
                    {
                        name = facilityName,
                        description = $"A facility for our residents",
                        image_path = $"/images/{facilityName.ToLower().Replace(" ", "-")}.jpg",
                        overall_rating = 0,
                        review_count = 0,
                        cleanliness_rating = 0,
                        equipment_rating = 0,
                        staff_rating = 0,
                        value_rating = 0
                    };
                    
                    _context.Facility.Add(facility);
                    await _context.SaveChangesAsync();
                    
                    // Reload the facility to get the ID
                    facility = await _context.Facility.FirstOrDefaultAsync(f => f.name == facilityName);
                    
                    if (facility == null)
                    {
                        return Json(new { success = false, message = "Error creating facility" });
                    }
                }
                else
                {
                    // Get all feedback for this facility
                    var feedbacks = await _context.Feedback
                        .Where(f => f.facility_id == facility.facility_id)
                        .ToListAsync();

                    // Calculate ratings if there are feedbacks
                    if (feedbacks.Any())
                    {
                        facility.review_count = feedbacks.Count;
                        facility.overall_rating = Math.Round(feedbacks.Average(f => f.overall_rating), 1);
                        facility.cleanliness_rating = Math.Round(feedbacks.Average(f => f.cleanliness_rating), 1);
                        facility.equipment_rating = Math.Round(feedbacks.Average(f => f.equipment_rating), 1);
                        facility.staff_rating = Math.Round(feedbacks.Average(f => f.staff_rating), 1);
                        facility.value_rating = Math.Round(feedbacks.Average(f => f.value_rating), 1);
                        
                        // Save the updated ratings
                        await _context.SaveChangesAsync();
                    }
                }

                return Json(new { success = true, facility });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        public class FeedbackModel
        {
            public int FacilityId { get; set; }
            public decimal OverallRating { get; set; }
            public decimal CleanlinessRating { get; set; }
            public decimal EquipmentRating { get; set; }
            public decimal StaffRating { get; set; }
            public decimal ValueRating { get; set; }
            public string Title { get; set; }
            public string Comment { get; set; }
            public string[] Photos { get; set; }
        }

        public IActionResult Documents()
        {
            ViewContents();
            return View();
        }

        [HttpGet]
        public JsonResult GetHomeownerDocuments()
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
                            WHERE d.visibility = 'homeowner'
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
                            WHERE document_id = @id AND visibility = 'homeowner'";
                        
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
                    
                    // First check if the document exists and is available for homeowners
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = @"
                            SELECT file_path, allow_download 
                            FROM Document 
                            WHERE document_id = @id AND visibility = 'homeowner'";
                        
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
                            WHERE d.document_id = @id AND d.visibility = 'homeowner'";
                        
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
    }
}
