document.addEventListener('DOMContentLoaded', function() {
    // Comment Modal Functionality
    const commentModal = document.getElementById('commentModal');
    const commentBtns = document.querySelectorAll('.comment-btn');
    const closeModalBtn = document.querySelector('#commentModal .close-community-modal'); // Updated class
    const commentsContainer = document.getElementById('commentsContainer');
    const commentInput = document.getElementById('commentInput');
    const postCommentBtn = document.querySelector('.btn-post-comment');
    
    // Sample comments data
    const sampleComments = {
        1: [
            { id: 1, user: 'Mike Thompson', text: 'I recommend John from Thompson Plumbing. He fixed our leak last month.', time: '2 hours ago' },
            { id: 2, user: 'Lisa Wong', text: 'Avoid City Plumbing - they overcharge!', time: '1 hour ago' },
            { id: 3, user: 'David Miller', text: 'We used Ace Plumbing - reasonable rates and quick service.', time: '45 minutes ago' },
            { id: 4, user: 'Emma Johnson', text: 'I have a contact for a great independent plumber. Will DM you.', time: '30 minutes ago' },
            { id: 5, user: 'Robert Chen', text: 'PlumbRight did good work for us last year.', time: '15 minutes ago' }
        ],
        2: [
            { id: 1, user: 'Sarah Johnson', text: 'I\'ll be there!', time: '1 day ago' },
            { id: 2, user: 'Tom Wilson', text: 'Can we discuss the recent break-ins?', time: '22 hours ago' },
            { id: 3, user: 'Lisa Wong', text: 'I\'ll bring some snacks for everyone.', time: '20 hours ago' },
            { id: 4, user: 'David Miller', text: 'Looking forward to meeting everyone!', time: '18 hours ago' },
            { id: 5, user: 'Emma Johnson', text: 'Should we invite the police community officer?', time: '15 hours ago' },
            { id: 6, user: 'Robert Chen', text: 'I can help organize the meeting.', time: '12 hours ago' },
            { id: 7, user: 'Maria Garcia', text: 'What time should we arrive to help set up?', time: '10 hours ago' },
            { id: 8, user: 'James Brown', text: 'I\'ll bring extra chairs from my house.', time: '5 hours ago' }
        ]
    };
    
    // Open comment modal
    commentBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            loadComments(postId);
            commentModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });
    
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
    
    // Load comments for a post
    function loadComments(postId) {
        commentsContainer.innerHTML = '';
        const comments = sampleComments[postId] || [];
        
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
            return;
        }
        
        comments.forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.innerHTML = `
                <img src="/images/user-default-picture.jpg" alt="${comment.user}">
                <div class="comment-content">
                    <div class="comment-header">
                        <strong>${comment.user}</strong>
                        <span>${comment.time}</span>
                    </div>
                    <p>${comment.text}</p>
                </div>
            `;
            commentsContainer.appendChild(commentEl);
        });
    }
    
    // Post a new comment
    postCommentBtn.addEventListener('click', function() {
        const commentText = commentInput.value.trim();
        if (commentText) {
            const newComment = {
                id: Date.now(),
                user: 'You',
                avatar: '/images/user-default-picture.jpg',
                text: commentText,
                time: 'Just now'
            };
            
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.innerHTML = `
                <img src="${newComment.avatar}" alt="${newComment.user}">
                <div class="comment-content">
                    <div class="comment-header">
                        <strong>${newComment.user}</strong>
                        <span>${newComment.time}</span>
                    </div>
                    <p>${newComment.text}</p>
                </div>
            `;
            
            commentsContainer.appendChild(commentEl);
            commentInput.value = '';
            
            // Scroll to bottom
            commentsContainer.scrollTop = commentsContainer.scrollHeight;
        }
    });
    
    // Create Post Functionality
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    const photoUpload = document.getElementById('photoUpload');
    const photoPreviewContainer = document.getElementById('photoPreviewContainer');
    const submitPostBtn = document.getElementById('submitPostBtn');
    const postInput = document.getElementById('postInput');
    
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
    
    // Submit post button
    submitPostBtn.addEventListener('click', function() {
        const postText = postInput.value.trim();
        const hasPhotos = photoPreviewContainer.children.length > 0;
        
        if (postText || hasPhotos) {
            // In a real app, this would send to backend
            alert('Post submitted! (This is a UI demo only)');
            postInput.value = '';
            photoPreviewContainer.innerHTML = '';
        } else {
            alert('Please add some text or photos to your post');
        }
    });

    // Allow pressing Enter in comment input to post
    commentInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            postCommentBtn.click();
        }
    });

    // Allow pressing Enter in post input to submit (but only if Shift isn't held)
    postInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitPostBtn.click();
        }
    });
});