using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;
using HomeOwner.Models;
using HomeOwner.Data;
using System.Linq;

namespace HomeOwner.Controllers
{
    public class DocumentsController : BaseController
    {
        private readonly HomeOwnerContext _context;
        private readonly string _uploadPath;

        public DocumentsController(HomeOwnerContext context, IWebHostEnvironment env)
        {
            _context = context;
            _uploadPath = Path.Combine(env.WebRootPath, "Uploads", "Documents");
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        [HttpGet]
        public IActionResult Upload()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Upload(List<IFormFile> files, string defaultVisibility, bool watermark, bool viewOnly)
        {
            if (files == null || !files.Any())
            {
                ModelState.AddModelError("", "Please select at least one file.");
                return View();
            }

            foreach (var file in files)
            {
                var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                var extension = Path.GetExtension(file.FileName);
                var newFileName = $"{fileName}_{Guid.NewGuid()}{extension}";
                var fullPath = Path.Combine(_uploadPath, newFileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var document = new Document
                {
                    FileName = file.FileName,
                    FileType = file.ContentType,
                    FileSize = file.Length,
                    FileUrl = $"/Uploads/Documents/{newFileName}",
                    Visibility = VisibilityLevel.Public,
                    UploadDate = DateTime.Now,
                    ApplyWatermark = watermark,
                    DisableDownload = viewOnly
                };

                _context.Document.Add(document);
            }

            await _context.SaveChangesAsync();

            TempData["Success"] = "Files uploaded successfully.";
            return RedirectToAction("Upload");
        }

        [HttpGet]
        public IActionResult Index()
        {
            var documents = _context.Document.ToList();
            return View(documents);
        }
    }
}