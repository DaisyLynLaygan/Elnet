document.addEventListener('DOMContentLoaded', function() {
    // Comment Modal Functionality
    const commentModal = document.getElementById('commentModal');
    const closeModalBtn = document.querySelector('#commentModal .close-community-modal');
    
    // Close modal
    closeModalBtn.addEventListener('click', function() {
        commentModal.classList.remove('show');
        document.body.style.overflow = '';
    });
    
    // Close when clicking outside modal
    commentModal.addEventListener('click', function(e) {
        if (e.target === commentModal) {
            commentModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
    
    // Create Post Functionality
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    const photoUpload = document.getElementById('photoUpload');
    const photoPreviewContainer = document.getElementById('photoPreviewContainer');
    
    // Add photo button click
    addPhotoBtn.addEventListener('click', function() {
        photoUpload.click();
    });
    
    // Handle photo selection
    photoUpload.addEventListener('change', function(e) {
        photoPreviewContainer.innerHTML = '';
        
        if (e.target.files && e.target.files.length > 0) {
            Array.from(e.target.files).forEach(file => {
                if (file.type.match('image.*')) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const previewItem = document.createElement('div');
                        previewItem.className = 'photo-preview-item';
                        previewItem.innerHTML = `
                            <img src="${event.target.result}" alt="Preview">
                            <button class="remove-photo">&times;</button>
                        `;
                        photoPreviewContainer.appendChild(previewItem);
                        
                        // Remove photo button
                        previewItem.querySelector('.remove-photo').addEventListener('click', function() {
                            previewItem.remove();
                        });
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    });

    // Allow pressing Enter in comment input to post
    document.getElementById('commentInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('submitCommentBtn')?.click();
        }
    });

    // Allow pressing Enter in post input to submit (but only if Shift isn't held)
    document.getElementById('postInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('submitPostBtn')?.click();
        }
    });
});