using HomeOwner.Models;
using Microsoft.AspNetCore.Mvc;
using HomeOwner.Data;
using Microsoft.EntityFrameworkCore;

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

         public List<Post> RetrievePost()
        {
            var posts = _context.Post.Include(p => p.Author)
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
            return RedirectToAction("StaffCommunity", "Staff");
        }


        //Add issue report
      [HttpPost]
public async Task<IActionResult> AddReport(Report model)
{
    if (!ModelState.IsValid)
    {
       return RedirectToAction("StaffDashboard", "Staff");
    }

    try
    {
        // Set the author_id to current user's ID
        model.user_id = CurrentUser.user_id;
        model.created_date = DateTime.Now;
        
        _context.Report.Add(model);
        await _context.SaveChangesAsync();
        
        return RedirectToAction("StaffDashboard", new { success = true });
    }
    catch
    {
        ModelState.AddModelError("", "Error submitting report");
         return RedirectToAction("StaffDashboard", "Staff");
    }
}




        public IActionResult StaffDashboard()
        {
            ViewContents();
            return View();
        }

        public IActionResult StaffCommunity()
        {
            ViewContents(); // If this sets other ViewData (e.g., user info)

            var model = new ViewModel
            {
                Announcements = GetAnnouncements(), // Load announcements
                Posts = RetrievePost()             // Load posts
            };

            return View(model); // Pass the combined ViewModel
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

        // Add this new action for Current Tasks
        public IActionResult StaffCurrentTask()
        {
            ViewContents();
            return View();
        }
    }
}