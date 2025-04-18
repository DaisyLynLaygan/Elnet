﻿﻿using HomeOwner.Data;
using HomeOwner.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;


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


        public IActionResult Payment()
        {
            ViewContents();
            return View();
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

        public IActionResult Events()
        {
            ViewContents();
            return View();
        }
    }
}
