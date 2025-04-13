document.addEventListener('DOMContentLoaded', function () {
    // Initialize WebSocket connection for comments
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const commentSocket = new WebSocket(`${protocol}${window.location.host}/ws/comments`);
    
    // Comment Modal Functionality
    const commentModal = document.getElementById('commentModal');
    const commentBtns = document.querySelectorAll('.comment-btn');
    const closeModalBtn = document.querySelector('#commentModal .close-community-modal');
    const commentsContainer = document.getElementById('commentsContainer');
    const commentInput = document.getElementById('commentInput');
    const postCommentBtn = document.querySelector('.btn-post-comment') || document.getElementById('postCommentBtn');
    let currentPostId = null;

    // Handle WebSocket messages
    commentSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_comment') {
            if (data.postId === currentPostId) {
                addCommentToUI(data.comment);
            }
            updateCommentCount(data.postId, data.commentCount);
        }
    };

    // Update comment count for a post
    function updateCommentCount(postId, count) {
        const commentCountElement = document.querySelector(`.comments-count[data-post-id="${postId}"]`);
        if (commentCountElement) {
            commentCountElement.innerHTML = count === 1 ? 
                '<span>1 comment</span>' : 
                `<span>${count} comments</span>`;
        }
    }

    // Open comment modal
    commentBtns.forEach(btn => {
        btn.addEventListener('click', async function () {
            currentPostId = parseInt(this.getAttribute('data-post-id'));
            await loadComments(currentPostId);
            commentModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function () {
            commentModal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // Close when clicking outside modal
    commentModal.addEventListener('click', function (e) {
        if (e.target === commentModal) {
            commentModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Load comments for a post
    async function loadComments(postId) {
        try {
            // Determine if we're in staff or homeowner context
            const isStaff = window.location.pathname.includes('Staff');
            const endpoint = isStaff ? '/Staff/GetComments' : '/Homeowner/GetComments';
            
            const response = await fetch(`${endpoint}?postId=${postId}`);
            const data = await response.json();
            
            commentsContainer.innerHTML = '';
            
            if (data.success && data.comments.length > 0) {
                data.comments.forEach(comment => {
                    addCommentToUI(comment);
                });
            } else {
                commentsContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
            }
        } catch (error) {
            console.error('Error loading comments:', error);
            commentsContainer.innerHTML = '<p class="no-comments">Error loading comments. Please try again.</p>';
        }
    }

    // Add a comment to the UI
    function addCommentToUI(comment) {
        // Remove the "no comments" message if it exists
        const noCommentsMsg = commentsContainer.querySelector('.no-comments');
        if (noCommentsMsg) {
            noCommentsMsg.remove();
        }

        const commentEl = document.createElement('div');
        commentEl.className = 'comment';
        commentEl.dataset.commentId = comment.id;
        commentEl.innerHTML = `
            <img src="/images/user-default-picture.jpg" alt="${comment.author.name}">
            <div class="comment-content">
                <div class="comment-header">
                    <strong>${comment.author.name}</strong>
                    <span class="role-badge role-${comment.author.role.toLowerCase()}">${comment.author.role}</span>
                    <span>${comment.createdDate}</span>
                </div>
                <p>${comment.content}</p>
            </div>
        `;
        commentsContainer.appendChild(commentEl);
        
        // Scroll to bottom
        commentsContainer.scrollTop = commentsContainer.scrollHeight;
    }

    // Post a new comment
    if (postCommentBtn) {
        postCommentBtn.addEventListener('click', async function () {
            const commentText = commentInput.value.trim();
            if (commentText && currentPostId) {
                try {
                    // Determine if we're in staff or homeowner context
                    const isStaff = window.location.pathname.includes('Staff');
                    const endpoint = isStaff ? '/Staff/AddComment' : '/Homeowner/AddComment';
                    
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            PostId: currentPostId,
                            Content: commentText
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        commentInput.value = '';
                    } else {
                        alert(data.message || 'Failed to post comment');
                    }
                } catch (error) {
                    console.error('Error posting comment:', error);
                    alert('An error occurred while posting the comment');
                }
            }
        });
    }

    // Like functionality
    document.querySelectorAll('.interaction-button.like-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const postId = parseInt(this.closest('.neighborhood-post').getAttribute('data-post-id'));
            const icon = this.querySelector('i');
            
            try {
                const response = await fetch('/Homeowner/ToggleLike', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        PostId: postId
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Update UI
                    if (data.liked) {
                        icon.classList.remove('far');
                        icon.classList.add('fas', 'text-primary');
                    } else {
                        icon.classList.remove('fas', 'text-primary');
                        icon.classList.add('far');
                    }
                    
                    // Update like count
                    const likeCountElement = this.querySelector('.like-count');
                    if (likeCountElement) {
                        likeCountElement.textContent = data.likeCount;
                    }
                }
            } catch (error) {
                console.error('Error toggling like:', error);
            }
        });
    });

    // Initialize like status for each post
    document.querySelectorAll('.neighborhood-post').forEach(postElement => {
        const postId = parseInt(postElement.getAttribute('data-post-id'));
        const likeBtn = postElement.querySelector('.interaction-button.like-btn');
        
        if (likeBtn) {
            fetch(`/Homeowner/GetLikeStatus?postId=${postId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const icon = likeBtn.querySelector('i');
                        const likeCountElement = likeBtn.querySelector('.like-count');
                        
                        if (data.isLiked) {
                            icon.classList.remove('far');
                            icon.classList.add('fas', 'text-primary');
                        }
                        
                        if (likeCountElement) {
                            likeCountElement.textContent = data.likeCount;
                        }
                    }
                })
                .catch(error => console.error('Error getting like status:', error));
        }
    });

    // Create Post Functionality
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    const photoUpload = document.getElementById('photoUpload');
    const photoPreviewContainer = document.getElementById('photoPreviewContainer');
    const submitPostBtn = document.getElementById('submitPostBtn');
    const postInput = document.getElementById('postInput');

    // Add photo button click
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', function () {
            photoUpload.click();
        });
    }

    // Handle photo selection
    if (photoUpload) {
        photoUpload.addEventListener('change', function (e) {
            photoPreviewContainer.innerHTML = '';

            if (e.target.files && e.target.files.length > 0) {
                Array.from(e.target.files).forEach(file => {
                    if (file.type.match('image.*')) {
                        const reader = new FileReader();
                        reader.onload = function (event) {
                            const previewItem = document.createElement('div');
                            previewItem.className = 'photo-preview-item';
                            previewItem.innerHTML = `
                                <img src="${event.target.result}" alt="Preview">
                                <button class="remove-photo">&times;</button>
                            `;
                            photoPreviewContainer.appendChild(previewItem);

                            // Remove photo button
                            previewItem.querySelector('.remove-photo').addEventListener('click', function () {
                                previewItem.remove();
                            });
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        });
    }

    // Allow pressing Enter in post input to submit (but only if Shift isn't held)
    if (postInput) {
        postInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (submitPostBtn) {
                    submitPostBtn.click();
                }
            }
        });
    }

    // Post Validation
    function validatePost() {
        const postText = document.getElementById('postInput')?.value.trim();
        const hasPhotos = document.getElementById('photoPreviewContainer')?.children.length > 0;
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
    const createPostForm = document.querySelector('.create-post form');
    if (createPostForm) {
        createPostForm.addEventListener('submit', function (e) {
            if (!validatePost()) {
                e.preventDefault();
            }
        });
    }

    // Post Edit/Delete Functionality
    const editPostModal = document.getElementById('editPostModal');
    const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
    let currentEditPostId = null;

    // Edit Post
    document.querySelectorAll('.edit-post').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const postId = this.getAttribute('data-post-id');
            const postElement = document.querySelector(`.neighborhood-post[data-post-id="${postId}"]`);
            const postContent = postElement.querySelector('.post-content').textContent;

            currentEditPostId = postId;
            document.getElementById('editPostContent').value = postContent;
            editPostModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    // Delete Post
    document.querySelectorAll('.delete-post').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            currentEditPostId = this.getAttribute('data-post-id');
            deleteConfirmationModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    // Save Edited Post
    document.getElementById('saveEditPost')?.addEventListener('click', function () {
        const newContent = document.getElementById('editPostContent').value.trim();

        if (newContent) {
            // Determine if we're in staff or homeowner context
            const isStaff = window.location.pathname.includes('Staff');
            const endpoint = isStaff ? '/Staff/UpdatePost' : '/Homeowner/UpdatePost';
            
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: parseInt(currentEditPostId),
                    content: newContent
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const postElement = document.querySelector(`.neighborhood-post[data-post-id="${currentEditPostId}"]`);
                        postElement.querySelector('.post-content').textContent = newContent;

                        // Update the "updated date" if available
                        if (data.updatedDate) {
                            const metaElement = postElement.querySelector('.post-meta span');
                            if (metaElement) {
                                const originalText = metaElement.textContent;
                                const updatedText = originalText.replace(/·.*/, `· ${data.updatedDate}`);
                                metaElement.textContent = updatedText;
                            }
                        }

                        closeEditModal();
                    } else {
                        alert(data.message || 'Failed to update post');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while updating the post');
                });
        }
    });

    // Confirm Delete
    document.querySelector('.confirm-delete')?.addEventListener('click', function () {
        // Determine if we're in staff or homeowner context
        const isStaff = window.location.pathname.includes('Staff');
        const endpoint = isStaff ? '/Staff/DeletePost' : '/Homeowner/DeletePost';
        
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postId: parseInt(currentEditPostId)
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.querySelector(`.neighborhood-post[data-post-id="${currentEditPostId}"]`).remove();
                    closeDeleteModal();
                } else {
                    alert(data.message || 'Failed to delete post');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the post');
            });
    });

    // Close modals
    function closeEditModal() {
        editPostModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    function closeDeleteModal() {
        deleteConfirmationModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    document.querySelector('.close-edit-modal')?.addEventListener('click', closeEditModal);
    document.querySelector('.cancel-delete')?.addEventListener('click', closeDeleteModal);
    document.getElementById('cancelEditPost')?.addEventListener('click', closeEditModal);

    // Close when clicking outside modals
    if (editPostModal) {
        editPostModal.addEventListener('click', function (e) {
            if (e.target === editPostModal) {
                closeEditModal();
            }
        });
    }

    if (deleteConfirmationModal) {
        deleteConfirmationModal.addEventListener('click', function (e) {
            if (e.target === deleteConfirmationModal) {
                closeDeleteModal();
            }
        });
    }

    // Post options dropdown
    document.querySelectorAll('.post-options').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const menu = this.nextElementSibling;
            document.querySelectorAll('.post-options-menu').forEach(m => {
                if (m !== menu) m.style.display = 'none';
            });
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', function () {
        document.querySelectorAll('.post-options-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    });
});

// Announcement Modal Functions
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
document.getElementById('announcementModalClose')?.addEventListener('click', hideAnnouncementModal);

// Close modal when clicking outside
document.getElementById('announcementModal')?.addEventListener('click', function (e) {
    if (e.target === this) {
        hideAnnouncementModal();
    }
});