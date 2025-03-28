﻿using HomeOwner.Data;
using HomeOwner.Models;
using Microsoft.AspNetCore.Mvc;


namespace HomeOwner.Controllers
{

   
    public class Homeowner : BaseController
    {
        private readonly HomeOwnerContext _context;
        public Homeowner(HomeOwnerContext db) {
            _context = db;
        }

        public void ViewContents()
        {
            ViewBag.CurrentUser = CurrentUser;

        }
        public  void UpdateProfile(User model)
        {
            try
            {
                // Find the user in the database
                var existingUser =  _context.User.FirstOrDefault(u => u.username == model.username);

                if (existingUser == null)
                {
                  
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
            
            return View();
        }
        public IActionResult Community()
        {
           
            return View();
        }
        public IActionResult Payment()
        {
           
            return View();
        }
        public IActionResult History()
        {
            
            return View();
        }
        public IActionResult UserProfile()
        {
            ViewContents();
            return View();
        }
    }
}