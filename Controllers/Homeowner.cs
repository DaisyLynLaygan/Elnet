﻿﻿using HomeOwner.Data;
using HomeOwner.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


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
           
                var  currentDate = DateTime.Now;
            
                var announcements = _context.Announcement.Where(m=>  currentDate < m.end_date ).ToList();
              
            
        
            return announcements; 
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
          
            var posts = _context.Post.Include(p => p.Author).ToList();
              
          
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