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
            ViewContents();
            return View();
        }

        public IActionResult StaffEvents()
        {
            ViewContents();
            return View();
        }

        public IActionResult StaffCurrentTask()
        {
            ViewContents();
            return View();
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
    }
}