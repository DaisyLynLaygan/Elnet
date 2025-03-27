document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs and buttons
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            tabBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked tab
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            this.classList.add('active');
        });
    });

    // Edit profile modal with smooth transitions
    const editProfileBtn = document.querySelector('.btn-edit-profile');
    const editModal = document.getElementById('editProfileModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cancelBtns = document.querySelectorAll('.btn-cancel');

    editProfileBtn.addEventListener('click', function() {
        editModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    });

    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Re-enable scrolling
    }

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    cancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Profile picture upload
    const avatarUpload = document.getElementById('avatarUpload');
    const btnEditAvatar = document.querySelector('.btn-edit-avatar');
    const profileAvatar = document.getElementById('profileAvatar');
    
    btnEditAvatar.addEventListener('click', function() {
        avatarUpload.click();
    });
    
    avatarUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                profileAvatar.src = event.target.result;
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Cover photo change
    const btnEditCover = document.querySelector('.btn-edit-cover');
    const changeCoverModal = document.getElementById('changeCoverModal');

    btnEditCover.addEventListener('click', function() {
        changeCoverModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    // Close modal when clicking X button
    document.querySelector('#changeCoverModal .close-modal-2').addEventListener('click', function() {
        changeCoverModal.classList.remove('show');
        document.body.style.overflow = '';
    });

    // Property thumbnail changes
    const thumbnailBtns = document.querySelectorAll('.btn-change-thumbnail');
    thumbnailBtns.forEach(btn => {
        const propertyId = btn.getAttribute('data-property');
        const uploadInput = document.querySelector(`.thumbnail-upload[data-property="${propertyId}"]`);
        const thumbnailImg = btn.closest('.property-thumbnail').querySelector('img');
        
        btn.addEventListener('click', function() {
            uploadInput.click();
        });
        
        uploadInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    thumbnailImg.src = event.target.result;
                }
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    });

    // Cover photo suggestions
    const suggestionItems = document.querySelectorAll('.suggestion-item');
    const coverPreview = document.getElementById('coverPreview');
    
    suggestionItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageName = this.getAttribute('data-image');
            coverPreview.src = `~/images/${imageName}`;
        });
    });
            // Close modal when clicking X button (using close-modal-2 class)
    document.querySelector('#changeCoverModal .close-modal-2').addEventListener('click', function() {
        changeCoverModal.classList.remove('show');
        document.body.style.overflow = '';
    });

    // Modal avatar upload
    const modalAvatarUpload = document.getElementById('modalAvatarUpload');
    const btnUploadAvatar = document.querySelector('.btn-upload-avatar');
    const modalAvatarPreview = document.getElementById('modalAvatarPreview');
    
    btnUploadAvatar.addEventListener('click', function() {
        modalAvatarUpload.click();
    });
    
    modalAvatarUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                modalAvatarPreview.src = event.target.result;
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Cover photo upload
    const coverUpload = document.getElementById('coverUpload');
    const btnUploadCover = document.querySelector('.btn-upload-cover');
    
    btnUploadCover.addEventListener('click', function() {
        coverUpload.click();
    });
    
    coverUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                coverPreview.src = event.target.result;
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Thumbnail upload functionality
    const thumbnailUpload = document.getElementById('thumbnailUpload');
    const btnUploadThumbnails = document.querySelector('.btn-upload-thumbnails');
    const thumbnailGallery = document.querySelector('.thumbnail-gallery');
    
    btnUploadThumbnails.addEventListener('click', function() {
        thumbnailUpload.click();
    });
    
    thumbnailUpload.addEventListener('change', function(e) {
        if (e.target.files) {
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const newThumbnail = document.createElement('div');
                    newThumbnail.className = 'thumbnail-item';
                    newThumbnail.innerHTML = `
                        <img src="${event.target.result}" alt="Uploaded Thumbnail">
                        <div class="thumbnail-actions">
                            <button class="btn-edit-thumbnail"><i class="fas fa-edit"></i></button>
                            <button class="btn-delete-thumbnail"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                    thumbnailGallery.appendChild(newThumbnail);
                    addThumbnailEventListeners(newThumbnail);
                };
                reader.readAsDataURL(file);
            });
        }
    });
    
    // Edit thumbnail modal
    const editThumbnailModal = document.getElementById('editThumbnailModal');
    const thumbnailPreview = document.getElementById('thumbnailPreview');
    const btnReplaceThumbnail = document.querySelector('.btn-replace-thumbnail');
    const replaceThumbnail = document.getElementById('replaceThumbnail');
    
    function addThumbnailEventListeners(thumbnail) {
        thumbnail.querySelector('.btn-edit-thumbnail').addEventListener('click', function() {
            const imgSrc = thumbnail.querySelector('img').src;
            thumbnailPreview.src = imgSrc;
            editThumbnailModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
        
        thumbnail.querySelector('.btn-delete-thumbnail').addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this thumbnail?')) {
                thumbnail.remove();
            }
        });
    }
    
    // Add event listeners to existing thumbnails
    document.querySelectorAll('.thumbnail-item').forEach(thumbnail => {
        addThumbnailEventListeners(thumbnail);
    });
    
    // Replace thumbnail image
    btnReplaceThumbnail.addEventListener('click', function() {
        replaceThumbnail.click();
    });
    
    replaceThumbnail.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                thumbnailPreview.src = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    
    // Close modal
    document.querySelector('#editThumbnailModal .close-modal').addEventListener('click', function() {
        editThumbnailModal.classList.remove('show');
        document.body.style.overflow = '';
    });
    
    document.querySelector('#editThumbnailModal .btn-cancel').addEventListener('click', function() {
        editThumbnailModal.classList.remove('show');
        document.body.style.overflow = '';
    });
    
    // Save changes
    document.querySelector('#editThumbnailModal .btn-save').addEventListener('click', function() {
        // Here you would typically save the changes to your database
        alert('Thumbnail changes saved!');
        editThumbnailModal.classList.remove('show');
        document.body.style.overflow = '';
    });
});

