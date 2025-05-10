using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HomeOwner.Data;
using HomeOwner.Models;
using Microsoft.EntityFrameworkCore;
using System.IO;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace HomeOwner.Controllers
{
    public class AdminController : BaseController
    {
        private readonly HomeOwnerContext _context;

        public AdminController(HomeOwnerContext db)
        {
            _context = db;

            if (!adminRoute)
            {
                RedirectToAction("Index", "Home");
            }
        }

        //Get all users
        public ViewModel GetUser()
        {
            var viewModel = new ViewModel();

            try
            {
                var users = _context.User.ToList();
                viewModel.Users = users;
                viewModel.newUser = new User();
            }
            catch (Exception)
            {
                viewModel.ErrorMessage = "Error loading users";
            }

            return viewModel;
        }

        public int GetStaffCount()
        {
            return _context.User.Count(u => u.role == "staff");
        }

        public int GetHomeOwnerCount()
        {
            return _context.User.Count(u => u.role == "homeowner");
        }

        public int GetActiveUserCount()
        {
            return _context.User.Count(u => u.status == "Active");
        }




        [HttpPost]
        public JsonResult AddUser([FromBody] User userData)
        {
            try
            {
                var user = new User
                {
                    username = userData.username,
                    user_password = userData.user_password,
                    email = userData.email,
                    contact_no = userData.contact_no,
                    firstname = userData.firstname,
                    lastname = userData.lastname,
                    date_created = DateOnly.FromDateTime(DateTime.Now),
                    role = userData.role,
                    status = "Active"
                };

                _context.User.Add(user);
                _context.SaveChanges();

                return Json(new { success = true, message = "User added successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult EditUser([FromBody] User userData)
        {
            try
            {
                var user = _context.User.FirstOrDefault(u => u.user_id == userData.user_id);
                if (user == null)
                {
                    return Json(new { success = false, message = "User not found." });
                }

                user.firstname = userData.firstname;
                user.lastname = userData.lastname;
                user.email = userData.email;
                user.contact_no = userData.contact_no;
                user.role = userData.role;
                user.status = userData.status;

                _context.SaveChanges();

                return Json(new { success = true, message = "User updated successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult DeleteUser(int id)
        {
            try
            {
                var user = _context.User.FirstOrDefault(u => u.user_id == id);
                if (user == null)
                {
                    return Json(new { success = false, message = "User not found." });
                }

                _context.User.Remove(user);
                _context.SaveChanges();

                return Json(new { success = true, message = "User deleted successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        public IActionResult Dashboard()
        {
            ViewContents();
            ViewBag.ActiveCount = GetActiveUserCount();
            ViewBag.StaffCount = GetStaffCount();
            ViewBag.HomeOwnerCount = GetHomeOwnerCount();
            ViewBag.ActiveMenu = "Dashboard";
            return View();
        }

        public IActionResult AdminAnnouncements()
        {
            ViewContents();
            ViewBag.ActiveMenu = "Announcements";
            return View(GetAnnouncements());
        }

        public ViewModel GetAnnouncements()
        {
            var viewModel = new ViewModel();
            try
            {
                var announcements = _context.Announcement.ToList();
                viewModel.Announcements = announcements;
                viewModel.newAnnouncement = new Announcement();
            }
            catch (Exception)
            {
                viewModel.ErrorMessage = "Error loading announcements";
            }
            return viewModel;
        }
        [HttpPost]
        public JsonResult GetAnnouncement(int id)
        {
            try
            {
                var announcement = _context.Announcement.FirstOrDefault(a => a.announcement_id == id);
                if (announcement == null)
                {
                    return Json(new { success = false, message = "Announcement not found." });
                }

                return Json(new
                {
                    success = true,
                    announcement = new
                    {
                        announcement_id = announcement.announcement_id,
                        title = announcement.title,
                        content = announcement.content,
                        start_date = announcement.start_date?.ToString("yyyy-MM-dd"),
                        end_date = announcement.end_date?.ToString("yyyy-MM-dd"),
                        priority = announcement.priority,
                        status = announcement.status,
                        author = announcement.author
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult AddAnnouncement([FromBody] Announcement announcementData)
        {
            try
            {
                if (announcementData == null)
                {
                    return Json(new { success = false, message = "Announcement data is null" });
                }

                if (string.IsNullOrEmpty(announcementData.title) || string.IsNullOrEmpty(announcementData.content))
                {
                    return Json(new { success = false, message = "Title and content are required" });
                }

                var announcement = new Announcement
                {
                    title = announcementData.title,
                    content = announcementData.content,
                    start_date = announcementData.start_date,
                    end_date = announcementData.end_date,
                    priority = announcementData.priority ?? "normal",
                    status = "Active",
                    author = CurrentUser?.firstname + " " + CurrentUser?.lastname
                };

                _context.Announcement.Add(announcement);
                _context.SaveChanges();

                return Json(new { success = true, message = "Announcement published successfully!", id = announcement.announcement_id });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult EditAnnouncement([FromBody] Announcement announcementData)
        {
            try
            {
                if (announcementData == null)
                {
                    return Json(new { success = false, message = "Announcement data is null" });
                }

                var announcement = _context.Announcement.FirstOrDefault(a => a.announcement_id == announcementData.announcement_id);
                if (announcement == null)
                {
                    return Json(new { success = false, message = "Announcement not found." });
                }

                announcement.title = announcementData.title;
                announcement.content = announcementData.content;
                announcement.start_date = announcementData.start_date;
                announcement.end_date = announcementData.end_date;
                announcement.priority = announcementData.priority ?? "normal";

                _context.SaveChanges();

                return Json(new { success = true, message = "Announcement updated successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult DeleteAnnouncement(int id)
        {
            try
            {
                var announcement = _context.Announcement.FirstOrDefault(a => a.announcement_id == id);
                if (announcement == null)
                {
                    return Json(new { success = false, message = "Announcement not found." });
                }

                _context.Announcement.Remove(announcement);
                _context.SaveChanges();

                return Json(new { success = true, message = "Announcement deleted successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        public IActionResult Documents()
        {
            ViewContents();
            ViewBag.ActiveMenu = "Documents";
            return View("AdminDocuments");
        }

        [HttpGet]
        public JsonResult GetDocuments()
        {
            try
            {
                var documents = _context.Document
                    .Include(d => d.Uploader)
                    .OrderByDescending(d => d.upload_date)
                    .Select(d => new
                    {
                        id = d.document_id,
                        name = d.name != null ? d.name : string.Empty,
                        type = d.file_type != null ? d.file_type : string.Empty,
                        category = d.category != null ? d.category : string.Empty,
                        size = d.file_size,
                        uploaded = d.upload_date.ToString("yyyy-MM-dd"),
                        visibility = d.visibility != null ? d.visibility : "admin",
                        url = d.file_path != null ? d.file_path : string.Empty,
                        downloads = d.download_count,
                        uploader = new
                        {
                            id = d.uploader_id,
                            name = d.Uploader == null ? "Unknown User" : 
                                (d.Uploader.firstname != null ? d.Uploader.firstname : string.Empty) + " " + 
                                (d.Uploader.lastname != null ? d.Uploader.lastname : string.Empty)
                        }
                    })
                    .ToList();

                // Calculate statistics
                var stats = new
                {
                    total = documents.Count,
                    admin = documents.Count(d => d.visibility == "admin"),
                    staff = documents.Count(d => d.visibility == "staff"),
                    homeowner = documents.Count(d => d.visibility == "homeowner")
                };

                return Json(new { success = true, documents, stats });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> UploadDocument(IFormFile file, string visibility, bool allowDownload, bool applyWatermark, string category, string description)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return Json(new { success = false, message = "No file selected" });
                }

                // Create uploads directory if it doesn't exist
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "documents");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generate unique filename
                var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Save file to disk
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Create document record in database
                var document = new Document
                {
                    name = file.FileName,
                    file_path = $"/uploads/documents/{uniqueFileName}",
                    file_type = Path.GetExtension(file.FileName).TrimStart('.'),
                    file_size = file.Length,
                    description = description,
                    visibility = visibility ?? "admin",
                    allow_download = allowDownload,
                    apply_watermark = applyWatermark,
                    upload_date = DateTime.Now,
                    category = category,
                    uploader_id = CurrentUser.user_id,
                    download_count = 0,
                    view_count = 0
                };

                // Manually execute SQL to bypass EF Core issues
                var connection = _context.Database.GetDbConnection();
                var wasOpen = connection.State == System.Data.ConnectionState.Open;
                
                if (!wasOpen)
                    await connection.OpenAsync();
                
                try
                {
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = @"
                            INSERT INTO [Document] (
                                [name], [file_path], [file_type], [file_size], 
                                [description], [visibility], [allow_download], [apply_watermark], 
                                [upload_date], [category], [uploader_id], [download_count], [view_count]
                            ) VALUES (
                                @name, @file_path, @file_type, @file_size,
                                @description, @visibility, @allow_download, @apply_watermark,
                                @upload_date, @category, @uploader_id, @download_count, @view_count
                            );
                            SELECT SCOPE_IDENTITY();";
                        
                        // Add parameters
                        var p1 = command.CreateParameter();
                        p1.ParameterName = "@name";
                        p1.Value = document.name;
                        command.Parameters.Add(p1);
                        
                        var p2 = command.CreateParameter();
                        p2.ParameterName = "@file_path";
                        p2.Value = document.file_path;
                        command.Parameters.Add(p2);
                        
                        var p3 = command.CreateParameter();
                        p3.ParameterName = "@file_type";
                        p3.Value = document.file_type ?? (object)DBNull.Value;
                        command.Parameters.Add(p3);
                        
                        var p4 = command.CreateParameter();
                        p4.ParameterName = "@file_size";
                        p4.Value = document.file_size;
                        command.Parameters.Add(p4);
                        
                        var p5 = command.CreateParameter();
                        p5.ParameterName = "@description";
                        p5.Value = document.description ?? (object)DBNull.Value;
                        command.Parameters.Add(p5);
                        
                        var p6 = command.CreateParameter();
                        p6.ParameterName = "@visibility";
                        p6.Value = document.visibility;
                        command.Parameters.Add(p6);
                        
                        var p7 = command.CreateParameter();
                        p7.ParameterName = "@allow_download";
                        p7.Value = document.allow_download;
                        command.Parameters.Add(p7);
                        
                        var p8 = command.CreateParameter();
                        p8.ParameterName = "@apply_watermark";
                        p8.Value = document.apply_watermark;
                        command.Parameters.Add(p8);
                        
                        var p9 = command.CreateParameter();
                        p9.ParameterName = "@upload_date";
                        p9.Value = document.upload_date;
                        command.Parameters.Add(p9);
                        
                        var p10 = command.CreateParameter();
                        p10.ParameterName = "@category";
                        p10.Value = document.category ?? (object)DBNull.Value;
                        command.Parameters.Add(p10);
                        
                        var p11 = command.CreateParameter();
                        p11.ParameterName = "@uploader_id";
                        p11.Value = document.uploader_id;
                        command.Parameters.Add(p11);
                        
                        var p12 = command.CreateParameter();
                        p12.ParameterName = "@download_count";
                        p12.Value = document.download_count;
                        command.Parameters.Add(p12);
                        
                        var p13 = command.CreateParameter();
                        p13.ParameterName = "@view_count";
                        p13.Value = document.view_count;
                        command.Parameters.Add(p13);
                        
                        // Execute and get ID
                        var result = await command.ExecuteScalarAsync();
                        document.document_id = Convert.ToInt32(result);
                    }
                }
                finally
                {
                    if (!wasOpen)
                        connection.Close();
                }

                return Json(new { 
                    success = true, 
                    message = "Document uploaded successfully", 
                    document = new {
                        id = document.document_id,
                        name = document.name,
                        type = document.file_type,
                        size = document.file_size,
                        url = document.file_path
                    }
                });
            }
            catch (Exception ex)
            {
                // If there's an error, try to delete the uploaded file
                if (file != null)
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "documents", Path.GetFileName(file.FileName));
                    if (System.IO.File.Exists(filePath))
                    {
                        try
                        {
                            System.IO.File.Delete(filePath);
                        }
                        catch { /* Ignore cleanup errors */ }
                    }
                }
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
                            WHERE d.document_id = @id";
                        
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
                        return Json(new { success = false, message = "Document not found" });
                    }

                    var result = new
                    {
                        id = document.document_id,
                        name = document.name ?? string.Empty,
                        type = document.file_type ?? string.Empty,
                        size = document.file_size,
                        uploaded = document.upload_date.ToString("yyyy-MM-dd"),
                        uploader = uploaderName,
                        visibility = document.visibility ?? "admin",
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

        [HttpPost]
        public async Task<JsonResult> UpdateDocumentSettings(int id, string visibility, bool allowDownload, bool applyWatermark, string category, string description)
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
                            SET visibility = @visibility,
                                allow_download = @allowDownload,
                                apply_watermark = @applyWatermark,
                                category = @category,
                                description = @description
                            WHERE document_id = @id";
                        
                        var idParam = command.CreateParameter();
                        idParam.ParameterName = "@id";
                        idParam.Value = id;
                        command.Parameters.Add(idParam);
                        
                        var visibilityParam = command.CreateParameter();
                        visibilityParam.ParameterName = "@visibility";
                        visibilityParam.Value = visibility ?? "admin";
                        command.Parameters.Add(visibilityParam);
                        
                        var allowDownloadParam = command.CreateParameter();
                        allowDownloadParam.ParameterName = "@allowDownload";
                        allowDownloadParam.Value = allowDownload;
                        command.Parameters.Add(allowDownloadParam);
                        
                        var applyWatermarkParam = command.CreateParameter();
                        applyWatermarkParam.ParameterName = "@applyWatermark";
                        applyWatermarkParam.Value = applyWatermark;
                        command.Parameters.Add(applyWatermarkParam);
                        
                        var categoryParam = command.CreateParameter();
                        categoryParam.ParameterName = "@category";
                        categoryParam.Value = category != null ? (object)category : DBNull.Value;
                        command.Parameters.Add(categoryParam);
                        
                        var descriptionParam = command.CreateParameter();
                        descriptionParam.ParameterName = "@description";
                        descriptionParam.Value = description != null ? (object)description : DBNull.Value;
                        command.Parameters.Add(descriptionParam);
                        
                        int rowsAffected = await command.ExecuteNonQueryAsync();
                        
                        if (rowsAffected == 0)
                        {
                            return Json(new { success = false, message = "Document not found" });
                        }
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
        public async Task<JsonResult> DeleteDocument(int id)
        {
            try
            {
                // First get the file path so we can delete the file
                string filePath = null;
                
                var connection = _context.Database.GetDbConnection();
                var wasOpen = connection.State == System.Data.ConnectionState.Open;
                
                if (!wasOpen)
                    await connection.OpenAsync();
                
                try
                {
                    // Get the file path
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "SELECT file_path FROM Document WHERE document_id = @id";
                        
                        var idParam = command.CreateParameter();
                        idParam.ParameterName = "@id";
                        idParam.Value = id;
                        command.Parameters.Add(idParam);
                        
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                filePath = !reader.IsDBNull(0) ? reader.GetString(0) : null;
                            }
                        }
                    }
                    
                    if (filePath == null)
                    {
                        return Json(new { success = false, message = "Document not found" });
                    }
                    
                    // Delete from database
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "DELETE FROM Document WHERE document_id = @id";
                        
                        var idParam = command.CreateParameter();
                        idParam.ParameterName = "@id";
                        idParam.Value = id;
                        command.Parameters.Add(idParam);
                        
                        int rowsAffected = await command.ExecuteNonQueryAsync();
                        
                        if (rowsAffected == 0)
                        {
                            return Json(new { success = false, message = "Document not found" });
                        }
                    }
                }
                finally
                {
                    if (!wasOpen)
                        connection.Close();
                }
                
                // Delete the physical file
                if (!string.IsNullOrEmpty(filePath))
                {
                    var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", filePath.TrimStart('/'));
                    if (System.IO.File.Exists(fullPath))
                    {
                        System.IO.File.Delete(fullPath);
                    }
                }
                
                return Json(new { success = true });
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
                            WHERE document_id = @id";
                        
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

        public IActionResult Reservations()
        {
            ViewContents();
            ViewBag.ActiveMenu = "Reservations";
            return View("AdminReservations");
        }

        [HttpGet]
        public JsonResult GetFacilityReservations(string status = "all", int page = 1, int pageSize = 5)
        {
            try
            {
                var query = _context.FacilityReservation
                    .Include(r => r.User)
                    .Include(r => r.Facility)
                    .AsQueryable();

                // Apply status filter
                if (status != "all")
                {
                    query = query.Where(r => r.status.ToLower() == status.ToLower());
                }

                // Get total count for pagination
                var totalCount = query.Count();
                var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

                // Apply pagination
                var reservations = query
                    .OrderByDescending(r => r.date_created)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(r => new
                    {
                        id = r.reservation_id,
                        facility = r.Facility.name,
                        resident = $"{r.User.firstname} {r.User.lastname}",
                        dateTime = $"{r.reservation_date.ToString("dd MMM yyyy")}, {r.reservation_time}",
                        date = r.reservation_date.ToString("dd MMM yyyy"),
                        time = $"{r.reservation_time} ({r.duration_hours} hour{(r.duration_hours > 1 ? "s" : "")})",
                        status = r.status.ToLower(),
                        payment_status = r.payment_status,
                        guests = $"{r.guest_count} people",
                        purpose = r.purpose,
                        amount = $"${r.price.ToString("0.00")}",
                        notes = r.staff_notes ?? ""
                    })
                    .ToList();

                // Calculate statistics
                var stats = new
                {
                    total = totalCount,
                    pending = _context.FacilityReservation.Count(r => r.status == "Pending"),
                    approved = _context.FacilityReservation.Count(r => r.status == "Approved"),
                    completed = _context.FacilityReservation.Count(r => r.status == "Completed"),
                    cancelled = _context.FacilityReservation.Count(r => r.status == "Cancelled")
                };

                return Json(new
                {
                    success = true,
                    reservations,
                    stats,
                    pagination = new
                    {
                        currentPage = page,
                        totalPages = totalPages,
                        totalItems = totalCount
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> UpdateReservationStatus([FromBody] FacilityStatusUpdate statusUpdate)
        {
            try
            {
                var reservation = await _context.FacilityReservation.FindAsync(statusUpdate.ReservationId);
                if (reservation == null)
                {
                    return Json(new { success = false, message = "Reservation not found." });
                }

                string oldStatus = reservation.status;
                reservation.status = statusUpdate.Status;
                if (!string.IsNullOrEmpty(statusUpdate.StaffNotes))
                {
                    reservation.staff_notes = statusUpdate.StaffNotes;
                }

                // If approving a pending reservation that's already paid, keep it paid
                if (statusUpdate.Status == "Approved" && reservation.payment_status == "Paid")
                {
                    // Keep the payment status
                }
                // Otherwise, update based on status
                else if (statusUpdate.Status == "Cancelled")
                {
                    // If cancelled, set payment status to appropriate value
                    reservation.payment_status = "Cancelled";
                    
                    // Send notification to user about rejection
                    await SendRejectionNotification(reservation.user_id, "facility", 
                        "Facility Reservation Rejected", 
                        $"Your reservation for {reservation.Facility?.name ?? "a facility"} has been rejected.\n\nReason: {statusUpdate.StaffNotes ?? "No reason provided"}",
                        reservation.reservation_id.ToString());
                }

                await _context.SaveChangesAsync();

                return Json(new { success = true, message = $"Reservation {statusUpdate.Status.ToLower()} successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Helper method to send notification to user
        private async Task SendRejectionNotification(int userId, string type, string title, string message, string referenceId)
        {
            try
            {
                var notification = new Notification
                {
                    user_id = userId,
                    title = title,
                    message = message,
                    created_date = DateTime.Now,
                    is_read = false,
                    type = type,
                    reference_id = referenceId
                };
                
                _context.Notification.Add(notification);
                await _context.SaveChangesAsync();
                
                // If we had a notification hub, we would broadcast the notification here
            }
            catch (Exception ex)
            {
                // Log error but don't fail the main operation
                Console.WriteLine($"Error sending notification: {ex.Message}");
            }
        }

        public class FacilityStatusUpdate
        {
            public int ReservationId { get; set; }
            public string Status { get; set; }
            public string StaffNotes { get; set; }
        }

        public IActionResult Polls()
        {
            ViewContents();
            ViewBag.ActiveMenu = "Polls";
            return View("AdminPolls");
        }

        public IActionResult Events()
        {
            ViewContents();
            ViewBag.ActiveMenu = "Events";
            return View("AdminEvents");
        }

        // Get all events
        [HttpGet]
        public JsonResult GetEvents(string filter = "upcoming")
        {
            try
            {
                var today = DateTime.Today;
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

                // First fetch events
                var eventsList = query.OrderBy(e => e.event_date).ToList();
                
                // Then transform to response format outside of the LINQ query
                var events = eventsList.Select(e => {
                    // Create tags list outside of the expression tree
                    List<string> tagsList = e.tags != null 
                        ? e.tags.Split(',').ToList() 
                        : new List<string>();
                    
                    return new
                    {
                        id = e.event_id,
                        title = e.title,
                        date = e.event_date,
                        formattedDate = e.event_date.ToString("yyyy-MM-dd"),
                        startTime = e.start_time,
                        endTime = e.end_time,
                        location = e.location,
                        description = e.description,
                        organizer = e.organizer,
                        contact = e.contact_email,
                        capacity = e.capacity,
                        rsvpCount = e.rsvp_count,
                        image = e.image_url,
                        featured = e.is_featured,
                        tags = tagsList,
                        createdAt = e.created_at,
                        updatedAt = e.updated_at
                    };
                }).ToList();

                return Json(new { success = true, events });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Get event by ID
        [HttpGet]
        public JsonResult GetEvent(int id)
        {
            try
            {
                var evt = _context.Event.FirstOrDefault(e => e.event_id == id);
                if (evt == null)
                {
                    return Json(new { success = false, message = "Event not found." });
                }

                var participants = _context.EventParticipant
                    .Include(p => p.User)
                    .Where(p => p.event_id == id)
                    .Select(p => new
                    {
                        id = p.participant_id,
                        type = p.participant_type,
                        userId = p.user_id,
                        name = $"{p.User.firstname} {p.User.lastname}",
                        registeredAt = p.registered_at
                    })
                    .ToList();

                // Create tags list outside of the anonymous object
                List<string> tagsList = evt.tags != null 
                    ? evt.tags.Split(',').ToList() 
                    : new List<string>();

                var eventDetails = new
                {
                    id = evt.event_id,
                    title = evt.title,
                    date = evt.event_date,
                    formattedDate = evt.event_date.ToString("yyyy-MM-dd"),
                    startTime = evt.start_time,
                    endTime = evt.end_time,
                    location = evt.location,
                    description = evt.description,
                    organizer = evt.organizer,
                    contact = evt.contact_email,
                    capacity = evt.capacity,
                    rsvpCount = evt.rsvp_count,
                    image = evt.image_url,
                    featured = evt.is_featured,
                    tags = tagsList,
                    createdAt = evt.created_at,
                    updatedAt = evt.updated_at,
                    participants = participants
                };

                return Json(new { success = true, event_details = eventDetails });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Add a new event
        [HttpPost]
        public JsonResult AddEvent([FromBody] EventSubmission eventData)
        {
            try
            {
                if (eventData == null)
                {
                    return Json(new { success = false, message = "Event data is null" });
                }

                // Validate required fields
                if (string.IsNullOrEmpty(eventData.Title) || 
                    eventData.EventDate == DateTime.MinValue ||
                    string.IsNullOrEmpty(eventData.StartTime) ||
                    string.IsNullOrEmpty(eventData.EndTime) ||
                    string.IsNullOrEmpty(eventData.Location) ||
                    eventData.Capacity <= 0)
                {
                    return Json(new { success = false, message = "Please fill in all required fields (title, date, time, location, capacity)" });
                }

                var newEvent = new Event
                {
                    title = eventData.Title,
                    event_date = eventData.EventDate,
                    start_time = eventData.StartTime,
                    end_time = eventData.EndTime,
                    location = eventData.Location,
                    description = eventData.Description,
                    organizer = eventData.Organizer,
                    contact_email = eventData.ContactEmail,
                    capacity = eventData.Capacity,
                    rsvp_count = 0,
                    image_url = eventData.ImageUrl,
                    is_featured = eventData.IsFeatured,
                    tags = string.Join(",", eventData.Tags ?? new List<string>()),
                    created_at = DateTime.Now
                };

                _context.Event.Add(newEvent);
                _context.SaveChanges();

                return Json(new { 
                    success = true, 
                    message = "Event created successfully!", 
                    event_id = newEvent.event_id 
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Update an existing event
        [HttpPost]
        public JsonResult UpdateEvent([FromBody] EventSubmission eventData)
        {
            try
            {
                if (eventData == null || eventData.EventId <= 0)
                {
                    return Json(new { success = false, message = "Invalid event data" });
                }

                var existingEvent = _context.Event.FirstOrDefault(e => e.event_id == eventData.EventId);
                if (existingEvent == null)
                {
                    return Json(new { success = false, message = "Event not found." });
                }

                // Update event properties
                existingEvent.title = eventData.Title;
                existingEvent.event_date = eventData.EventDate;
                existingEvent.start_time = eventData.StartTime;
                existingEvent.end_time = eventData.EndTime;
                existingEvent.location = eventData.Location;
                existingEvent.description = eventData.Description;
                existingEvent.organizer = eventData.Organizer;
                existingEvent.contact_email = eventData.ContactEmail;
                existingEvent.capacity = eventData.Capacity;
                existingEvent.image_url = eventData.ImageUrl;
                existingEvent.is_featured = eventData.IsFeatured;
                existingEvent.tags = string.Join(",", eventData.Tags ?? new List<string>());
                existingEvent.updated_at = DateTime.Now;

                _context.SaveChanges();

                return Json(new { success = true, message = "Event updated successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Upload event image
        [HttpPost]
        public async Task<JsonResult> UploadEventImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return Json(new { success = false, message = "No file selected" });
                }

                // Create uploads directory if it doesn't exist
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "events");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generate unique filename
                var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Save file to disk
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return the URL to the uploaded image
                return Json(new { 
                    success = true, 
                    message = "Image uploaded successfully", 
                    imageUrl = $"/uploads/events/{uniqueFileName}"
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Delete an event
        [HttpPost]
        public JsonResult DeleteEvent(int id)
        {
            try
            {
                var evt = _context.Event.FirstOrDefault(e => e.event_id == id);
                if (evt == null)
                {
                    return Json(new { success = false, message = "Event not found." });
                }

                // Delete associated event image if it exists
                if (!string.IsNullOrEmpty(evt.image_url) && evt.image_url.StartsWith("/uploads/events/"))
                {
                    try
                    {
                        // Get physical file path
                        var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", evt.image_url.TrimStart('/'));
                        
                        // Delete file if exists
                        if (System.IO.File.Exists(imagePath))
                        {
                            System.IO.File.Delete(imagePath);
                        }
                    }
                    catch (Exception ex)
                    {
                        // Log error but continue with deletion
                        Console.WriteLine($"Error deleting image file: {ex.Message}");
                    }
                }

                // Delete participants first (if cascade delete isn't set up)
                var participants = _context.EventParticipant.Where(p => p.event_id == id).ToList();
                if (participants.Any())
                {
                    _context.EventParticipant.RemoveRange(participants);
                }

                // Then delete the event
                _context.Event.Remove(evt);
                _context.SaveChanges();

                return Json(new { success = true, message = "Event deleted successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Get event participants
        [HttpGet]
        public JsonResult GetEventParticipants(int eventId)
        {
            try
            {
                var participants = _context.EventParticipant
                    .Include(p => p.User)
                    .Where(p => p.event_id == eventId)
                    .Select(p => new
                    {
                        id = p.participant_id,
                        type = p.participant_type,
                        userId = p.user_id,
                        name = $"{p.User.firstname} {p.User.lastname}",
                        email = p.User.email,
                        avatar = "", // You can add avatar logic here if available
                        registeredAt = p.registered_at
                    })
                    .ToList();

                // Group participants by type
                var grouped = new 
                {
                    homeowners = participants.Where(p => p.type == "homeowner").ToList(),
                    staff = participants.Where(p => p.type == "staff").ToList(),
                    admins = participants.Where(p => p.type == "admin").ToList(),
                    total = participants.Count
                };

                return Json(new { success = true, participants = grouped });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Add a participant to an event
        [HttpPost]
        public JsonResult AddEventParticipant([FromBody] EventParticipantSubmission participantData)
        {
            try
            {
                if (participantData == null || participantData.EventId <= 0 || participantData.UserId <= 0)
                {
                    return Json(new { success = false, message = "Invalid participant data" });
                }

                // Check if event exists
                var evt = _context.Event.FirstOrDefault(e => e.event_id == participantData.EventId);
                if (evt == null)
                {
                    return Json(new { success = false, message = "Event not found." });
                }

                // Check if user exists
                var user = _context.User.FirstOrDefault(u => u.user_id == participantData.UserId);
                if (user == null)
                {
                    return Json(new { success = false, message = "User not found." });
                }

                // Check if user is already a participant
                var existingParticipant = _context.EventParticipant
                    .FirstOrDefault(p => p.event_id == participantData.EventId && p.user_id == participantData.UserId);
                
                if (existingParticipant != null)
                {
                    return Json(new { success = false, message = "User is already a participant in this event." });
                }

                // Add new participant
                var newParticipant = new EventParticipant
                {
                    event_id = participantData.EventId,
                    user_id = participantData.UserId,
                    participant_type = participantData.ParticipantType,
                    registered_at = DateTime.Now
                };

                _context.EventParticipant.Add(newParticipant);
                
                // Update RSVP count
                evt.rsvp_count = evt.rsvp_count + 1;
                
                _context.SaveChanges();

                return Json(new { 
                    success = true, 
                    message = "Participant added successfully!",
                    participant = new
                    {
                        id = newParticipant.participant_id,
                        type = newParticipant.participant_type,
                        userId = newParticipant.user_id,
                        name = $"{user.firstname} {user.lastname}",
                        email = user.email,
                        registeredAt = newParticipant.registered_at
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Remove a participant from an event
        [HttpPost]
        public JsonResult RemoveEventParticipant(int participantId)
        {
            try
            {
                var participant = _context.EventParticipant
                    .FirstOrDefault(p => p.participant_id == participantId);
                
                if (participant == null)
                {
                    return Json(new { success = false, message = "Participant not found." });
                }

                // Update RSVP count
                var evt = _context.Event.FirstOrDefault(e => e.event_id == participant.event_id);
                if (evt != null)
                {
                    evt.rsvp_count = Math.Max(0, evt.rsvp_count - 1);
                }

                _context.EventParticipant.Remove(participant);
                _context.SaveChanges();

                return Json(new { success = true, message = "Participant removed successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Get users for participant selection
        [HttpGet]
        public JsonResult GetUsersForParticipantSelection(string userType = "homeowner")
        {
            try
            {
                var users = _context.User
                    .Where(u => u.role == userType && u.status == "Active")
                    .Select(u => new
                    {
                        id = u.user_id,
                        name = $"{u.firstname} {u.lastname}",
                        email = u.email,
                        role = u.role
                    })
                    .ToList();

                return Json(new { success = true, users });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Helper classes for event submission
        public class EventSubmission
        {
            public int EventId { get; set; }
            public string Title { get; set; }
            public DateTime EventDate { get; set; }
            public string StartTime { get; set; }
            public string EndTime { get; set; }
            public string Location { get; set; }
            public string Description { get; set; }
            public string Organizer { get; set; }
            public string ContactEmail { get; set; }
            public int Capacity { get; set; }
            public string ImageUrl { get; set; }
            public bool IsFeatured { get; set; }
            public List<string> Tags { get; set; }
        }

        public class EventParticipantSubmission
        {
            public int EventId { get; set; }
            public int UserId { get; set; }
            public string ParticipantType { get; set; }
        }

        public IActionResult AdminUsers()
        {
            ViewContents();

            ViewBag.ActiveMenu = "Users";
            return View(GetUser());
        }

        public IActionResult Feedback()
        {
            ViewContents();
            ViewBag.ActiveMenu = "Feedback";
            return View("AdminFeedback");
        }

        [HttpGet]
        public JsonResult GetFeedback(int page = 1, int pageSize = 10, string facility = "all")
        {
            try
            {
                var query = _context.Feedback
                    .Include(f => f.User)
                    .Include(f => f.Facility)
                    .AsQueryable();

                // Apply facility filter if not "all"
                if (facility != "all")
                {
                    query = query.Where(f => f.Facility.name == facility);
                }

                // Get total count for pagination
                var totalCount = query.Count();
                var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

                // Apply pagination
                var feedbacks = query
                    .OrderByDescending(f => f.created_date)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(f => new
                    {
                        feedback_id = f.feedback_id,
                        user = new
                        {
                            name = f.User.firstname + " " + f.User.lastname
                        },
                        facility = new 
                        {
                            name = f.Facility.name
                        },
                        overall_rating = f.overall_rating,
                        title = f.title,
                        comment = f.comment,
                        created_date = f.created_date.ToString("MMMM dd, yyyy"),
                        status = "Published"
                    })
                    .ToList();

                // Calculate statistics
                var stats = new
                {
                    total = totalCount,
                    average_rating = query.Any() ? query.Average(f => f.overall_rating) : 0m,
                    new_this_week = query.Count(f => f.created_date >= DateTime.Now.AddDays(-7)),
                    facilities = _context.Facility.Count()
                };

                return Json(new
                {
                    success = true,
                    feedbacks,
                    stats,
                    pagination = new
                    {
                        currentPage = page,
                        totalPages = totalPages,
                        totalItems = totalCount
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetFeedbackDetails(int id)
        {
            try
            {
                var feedback = _context.Feedback
                    .Include(f => f.User)
                    .Include(f => f.Facility)
                    .FirstOrDefault(f => f.feedback_id == id);

                if (feedback == null)
                {
                    return Json(new { success = false, message = "Feedback not found." });
                }

                var response = new
                {
                    success = true,
                    feedback = new
                    {
                        feedback_id = feedback.feedback_id,
                        user = new
                        {
                            name = feedback.User.firstname + " " + feedback.User.lastname
                        },
                        facility = new
                        {
                            name = feedback.Facility.name
                        },
                        overall_rating = feedback.overall_rating,
                        title = feedback.title,
                        comment = feedback.comment,
                        photos = feedback.photos,
                        created_date = feedback.created_date.ToString("MMMM dd, yyyy"),
                        status = "Published"
                    }
                };

                return Json(response);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetComplaints(int page = 1, int pageSize = 10, string status = "all", string serviceType = "all")
        {
            try
            {
                var query = _context.ServiceRequest
                    .Include(s => s.User)
                    .AsQueryable();

                // Apply filters
                if (status != "all")
                {
                    query = query.Where(s => s.status == status);
                }

                if (serviceType != "all")
                {
                    query = query.Where(s => s.service_type == serviceType);
                }

                // Get total count for pagination
                var totalCount = query.Count();
                var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

                // Apply pagination
                var complaints = query
                    .OrderByDescending(s => s.date_created)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(s => new
                    {
                        request_id = s.request_id,
                        user = new
                        {
                            name = s.User.firstname + " " + s.User.lastname
                        },
                        service_type = s.service_type,
                        title = s.notes,
                        severity = s.status, // Using status as severity for now
                        date_created = s.date_created.ToString("MMMM dd, yyyy"),
                        status = s.status
                    })
                    .ToList();

                // Calculate statistics
                var stats = new
                {
                    total = totalCount,
                    open = _context.ServiceRequest.Count(s => s.status == "Pending Approval"),
                    avg_resolution_time = 3.2, // You can calculate this based on your data
                    satisfaction_rate = 92 // You can calculate this based on your data
                };

                return Json(new
                {
                    success = true,
                    complaints,
                    stats,
                    pagination = new
                    {
                        currentPage = page,
                        totalPages = totalPages,
                        totalItems = totalCount
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        public IActionResult ServiceRequests()
        {
            ViewContents();
            ViewBag.ActiveMenu = "ServiceRequests";
            return View("AdminServiceRequests");
        }

        public IActionResult AdminIssue()
        {
            ViewBag.ActiveMenu = "FacilityIssue";
            ViewContents();
            var issues = _context.Report.Include(r => r.Author).ToList();



            return View(issues);
        }

        [HttpPost]
        public async Task<JsonResult> UpdateServiceRequestStatus([FromBody] ServiceRequest request)
        {
            try
            {
                var existingRequest = _context.ServiceRequest.FirstOrDefault(r => r.request_id == request.request_id);
                if (existingRequest == null)
                {
                    return Json(new { success = false, message = "Service request not found." });
                }

                existingRequest.status = request.status;
                existingRequest.payment_status = request.payment_status;

                await _context.SaveChangesAsync();

                // Broadcast service request update
                var serviceRequestWebSocketManager = HttpContext.RequestServices.GetRequiredService<ServiceRequestWebSocketManager>();
                await serviceRequestWebSocketManager.BroadcastServiceRequestUpdate(existingRequest);

                return Json(new { success = true, message = "Service request updated successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetServiceRequests(string status = "all", string serviceType = "all", string paymentStatus = "all", 
            string dateRange = "all", string startDate = null, string endDate = null, int page = 1, int pageSize = 5)
        {
            try
            {
                var query = _context.ServiceRequest
                    .Include(r => r.User)
                    .AsQueryable();

                // Apply filters
                if (status != "all")
                {
                    query = query.Where(r => r.status == status);
                }

                if (serviceType != "all")
                {
                    query = query.Where(r => r.service_type == serviceType);
                }

                if (paymentStatus != "all")
                {
                    query = query.Where(r => r.payment_status == paymentStatus);
                }

                if (dateRange != "all")
                {
                    var today = DateTime.Today;
                    switch (dateRange)
                    {
                        case "today":
                            query = query.Where(r => r.scheduled_date == today);
                            break;
                        case "week":
                            var weekStart = today.AddDays(-7);
                            query = query.Where(r => r.scheduled_date >= weekStart && r.scheduled_date <= today);
                            break;
                        case "month":
                            var monthStart = today.AddMonths(-1);
                            query = query.Where(r => r.scheduled_date >= monthStart && r.scheduled_date <= today);
                            break;
                        case "custom":
                            if (!string.IsNullOrEmpty(startDate) && !string.IsNullOrEmpty(endDate))
                            {
                                var start = DateTime.Parse(startDate);
                                var end = DateTime.Parse(endDate);
                                query = query.Where(r => r.scheduled_date >= start && r.scheduled_date <= end);
                            }
                            break;
                    }
                }

                // Get total count for pagination
                var totalCount = query.Count();
                var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

                // Apply pagination
                var requests = query
                    .OrderByDescending(r => r.date_created)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(r => new
                    {
                        request_id = r.request_id,
                        service_type = r.service_type,
                        service_icon = r.service_icon,
                        price = r.price,
                        frequency = r.frequency,
                        scheduled_date = r.scheduled_date,
                        scheduled_time = r.scheduled_time,
                        status = r.status,
                        payment_status = r.payment_status,
                        notes = r.notes,
                        date_created = r.date_created,
                        user = new
                        {
                            user_id = r.User.user_id,
                            firstname = r.User.firstname,
                            lastname = r.User.lastname,
                            email = r.User.email,
                            contact_no = r.User.contact_no
                        }
                    })
                    .ToList();

                // Calculate statistics
                var stats = new
                {
                    total = totalCount,
                    pending = _context.ServiceRequest.Count(r => r.status == "Pending Approval"),
                    unpaid = _context.ServiceRequest.Count(r => r.payment_status == "Unpaid"),
                    completed = _context.ServiceRequest.Count(r => r.status == "Completed")
                };

                return Json(new { 
                    success = true, 
                    requests, 
                    stats,
                    pagination = new {
                        currentPage = page,
                        totalPages = totalPages,
                        totalItems = totalCount
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetServiceRequest(int id)
        {
            try
            {
                var request = _context.ServiceRequest
                    .Include(r => r.User)
                    .FirstOrDefault(r => r.request_id == id);

                if (request == null)
                {
                    return Json(new { success = false, message = "Service request not found." });
                }

                var response = new
                {
                    success = true,
                    request = new
                    {
                        request_id = request.request_id,
                        service_type = request.service_type,
                        service_icon = request.service_icon,
                        price = request.price,
                        frequency = request.frequency,
                        scheduled_date = request.scheduled_date,
                        scheduled_time = request.scheduled_time,
                        status = request.status,
                        payment_status = request.payment_status,
                        notes = request.notes,
                        date_created = request.date_created,
                        user = new
                        {
                            user_id = request.User.user_id,
                            firstname = request.User.firstname,
                            lastname = request.User.lastname,
                            email = request.User.email,
                            contact_no = request.User.contact_no
                        }
                    }
                };

                return Json(response);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetServiceRequestsData(string period = "week")
        {
            try
            {
                DateTime startDate;
                DateTime endDate = DateTime.Today.AddDays(1).AddTicks(-1); // End of today
                List<string> labels = new List<string>();
                List<int> values = new List<int>();

                switch (period.ToLower())
                {
                    case "week":
                        startDate = DateTime.Today.AddDays(-6); // Last 7 days
                        
                        // Generate last 7 days
                        for (int i = 0; i < 7; i++)
                        {
                            var date = startDate.AddDays(i);
                            labels.Add(date.ToString("ddd"));
                            
                            // Count service requests on this day
                            values.Add(_context.ServiceRequest.Count(sr => 
                                sr.date_created.Date == date.Date));
                        }
                        break;

                    case "month":
                        startDate = DateTime.Today.AddDays(-29); // Last 30 days
                        
                        // Group by week for better visualization
                        for (int i = 0; i < 4; i++) // 4 weeks
                        {
                            var weekStart = startDate.AddDays(i * 7);
                            var weekEnd = weekStart.AddDays(6);
                            labels.Add($"{weekStart:MMM dd}-{weekEnd:MMM dd}");
                            
                            // Count service requests in this week
                            values.Add(_context.ServiceRequest.Count(sr => 
                                sr.date_created.Date >= weekStart.Date && 
                                sr.date_created.Date <= weekEnd.Date));
                        }
                        break;

                    case "year":
                        startDate = new DateTime(DateTime.Today.Year, 1, 1); // Start of this year
                        
                        // Generate months
                        for (int i = 0; i < 12; i++)
                        {
                            var monthStart = new DateTime(DateTime.Today.Year, i + 1, 1);
                            var monthEnd = monthStart.AddMonths(1).AddDays(-1);
                            labels.Add(monthStart.ToString("MMM"));
                            
                            // Count service requests in this month
                            values.Add(_context.ServiceRequest.Count(sr => 
                                sr.date_created.Month == monthStart.Month && 
                                sr.date_created.Year == monthStart.Year));
                        }
                        break;

                    default:
                        return Json(new { success = false, message = "Invalid period" });
                }

                return Json(new { 
                    success = true, 
                    labels = labels, 
                    values = values 
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetFacilityRatingsData(string view = "current")
        {
            try
            {
                List<string> labels = new List<string>();
                List<decimal> values = new List<decimal>();

                var facilities = _context.Facility.ToList();

                if (view.ToLower() == "current")
                {
                    // Get average ratings for each facility
                    foreach (var facility in facilities)
                    {
                        labels.Add(facility.name);
                        values.Add(facility.overall_rating);
                    }
                }
                else if (view.ToLower() == "trend")
                {
                    // Get month-to-month trends for average rating
                    // This would require a more complex query with historical data
                    // For simplicity, we'll return the same data as "current" for now
                    foreach (var facility in facilities)
                    {
                        labels.Add(facility.name);
                        values.Add(facility.overall_rating);
                    }
                }
                else if (view.ToLower() == "count")
                {
                    // Get booking counts for each facility
                    foreach (var facility in facilities)
                    {
                        labels.Add(facility.name);
                        // Count reservations for this facility
                        var count = _context.FacilityReservation.Count(fr => fr.facility_id == facility.facility_id);
                        values.Add(count);
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Invalid view" });
                }

                return Json(new {
                    success = true,
                    labels = labels,
                    values = values
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // For service requests rejection
        [HttpPost]
        public async Task<JsonResult> RejectServiceRequest(int id, [FromBody] dynamic data)
        {
            try
            {
                var request = await _context.ServiceRequest.FindAsync(id);
                if (request == null)
                {
                    return Json(new { success = false, message = "Service request not found." });
                }

                // Parse the reason from the request body
                string reason = "";
                try
                {
                    // Try to extract reason from dynamic data
                    reason = data?.reason?.ToString() ?? "No reason provided.";
                }
                catch
                {
                    reason = "No reason provided.";
                }

                // Update request status
                request.status = "Rejected";
                
                // Send notification to user
                await SendRejectionNotification(request.user_id, "service_request", 
                    "Service Request Rejected", 
                    $"Your service request for {request.service_type} has been rejected.\n\nReason: {reason}",
                    request.request_id.ToString());

                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Service request rejected successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}