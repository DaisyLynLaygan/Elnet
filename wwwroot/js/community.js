document.addEventListener('DOMContentLoaded', function() {
    // Comment Modal Functionality
    const commentModal = document.getElementById('commentModal');
    const commentBtns = document.querySelectorAll('.comment-btn');
    const closeModalBtn = document.querySelector('#commentModal .close-community-modal');
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
            const postId = this.getAttribute('data-post-id') || '1'; // Default to post 1 if no ID
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

// Announcement Modal Functions
function showAnnouncementModal(title, description, startDate, endDate) {
    document.getElementById('modalAnnouncementTitle').textContent = title;
    document.getElementById('modalAnnouncementDescription').textContent = description;
    document.getElementById('modalAnnouncementStartDate').textContent = startDate;
    document.getElementById('modalAnnouncementEndDate').textContent = endDate;
    document.getElementById('announcementModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideAnnouncementModal() {
    document.getElementById('announcementModal').style.display = 'none';
    document.body.style.overflow = '';
}

// Close announcement modal when clicking outside
document.getElementById('announcementModal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideAnnouncementModal();
    }
});


function showAnnouncementModal(title, content, startDate, endDate, priority, author) {
    const modal = document.getElementById('announcementModal');
    const titleElement = document.getElementById('announcementModalTitle');
    const contentElement = document.getElementById('announcementModalContent');
    const startDateElement = document.getElementById('announcementModalStartDate');
    const endDateElement = document.getElementById('announcementModalEndDate');
    const priorityBadge = document.getElementById('announcementPriorityBadge');
    const authorElement = document.getElementById('announcementModalAuthor');

    // Set the content
    titleElement.textContent = title;
    contentElement.innerHTML = content.replace(/\n/g, '<br>');
    startDateElement.textContent = startDate || 'Not specified';
    endDateElement.textContent = endDate || 'No end date';
    authorElement.textContent = `Posted by: ${author || 'Admin'}`;

    // Set priority badge
    priorityBadge.textContent = priority || 'Normal';
    priorityBadge.className = 'announcement-priority';
    if (priority) {
        priorityBadge.classList.add(priority.toLowerCase());
    } else {
        priorityBadge.classList.add('normal');
    }

    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideAnnouncementModal() {
    document.getElementById('announcementModal').style.display = 'none';
    document.body.style.overflow = '';
}

// Close modal when clicking close button
document.getElementById('announcementModalClose').addEventListener('click', hideAnnouncementModal);

// Close modal when clicking outside
document.getElementById('announcementModal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideAnnouncementModal();
    }
});
// Post Validation
function validatePost() {
    const postText = document.getElementById('postInput').value.trim();
    const hasPhotos = document.getElementById('photoPreviewContainer').children.length > 0;
    const errorElement = document.getElementById('postError');

    if (!postText && !hasPhotos) {
        if (!errorElement) {
            // Create error element if it doesn't exist
            const errorEl = document.createElement('div');
            errorEl.id = 'postError';
            errorEl.className = 'post-error';
            errorEl.textContent = "Please add some text or photos to your post";
            document.querySelector('.create-post').appendChild(errorEl);
        } else {
            errorElement.textContent = "Please add some text or photos to your post";
            errorElement.style.display = 'block';
        }
        return false;
    }

    if (errorElement) {
        errorElement.style.display = 'none';
    }
    return true;
}

// Modify your form submission to include validation
document.querySelector('.create-post form').addEventListener('submit', function(e) {
    if (!validatePost()) {
        e.preventDefault();
    }
});

// Add event listener to post input to validate on typing
document.getElementById('postInput').addEventListener('input', function() {
    validatePost();
});

// Add event listener to photo upload to validate when photos are added/removed
document.getElementById('photoUpload').addEventListener('change', function() {
    validatePost();
});