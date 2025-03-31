    // Facility data with ratings and reviews
    const facilities = {
        1: { // Function Hall
            name: "Function Hall",
            overallRating: 4.8,
            reviewCount: 124,
            cleanliness: 4.6,
            equipment: 4.4,
            staff: 4.5,
            value: 4.3,
            reviews: [
                {
                    user: "Pradeep Kumar Singh",
                    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                    rating: 5,
                    date: "2 days ago",
                    title: "Perfect for our wedding!",
                    comment: "The function hall was absolutely perfect for our wedding reception. The staff went above and beyond to make our day special.",
                    cleanliness: 5,
                    equipment: 5,
                    staff: 5,
                    value: 4,
                    photos: [
                        "https://images.unsplash.com/photo-1561484930-974554019ade?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                    ]
                },
                {
                    user: "Anjali Sharma",
                    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                    rating: 4,
                    date: "1 week ago",
                    title: "Great venue for corporate events",
                    comment: "We hosted our annual conference here and everything was excellent. The sound system could use an upgrade though.",
                    cleanliness: 5,
                    equipment: 4,
                    staff: 5,
                    value: 4,
                    photos: [
                        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    ]
                }
            ]
        },
        2: { // Sports Court
            name: "Sports Court",
            overallRating: 4.6,
            reviewCount: 87,
            cleanliness: 4.5,
            equipment: 4.3,
            staff: 4.4,
            value: 4.7,
            reviews: [
                {
                    user: "Rahul Mehta",
                    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
                    rating: 5,
                    date: "3 days ago",
                    title: "Best basketball court in town!",
                    comment: "The surface is perfect and the hoops are well-maintained. We play here every weekend.",
                    cleanliness: 5,
                    equipment: 5,
                    staff: 4,
                    value: 5,
                    photos: [
                        "https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    ]
                }
            ]
        },
        3: { // Swimming Pool
            name: "Swimming Pool",
            overallRating: 4.9,
            reviewCount: 156,
            cleanliness: 4.8,
            equipment: 4.7,
            staff: 4.9,
            value: 4.8,
            reviews: [
                {
                    user: "Priya Patel",
                    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
                    rating: 5,
                    date: "1 day ago",
                    title: "Crystal clear water!",
                    comment: "The pool is always clean and well-maintained. Lifeguards are very attentive.",
                    cleanliness: 5,
                    equipment: 5,
                    staff: 5,
                    value: 5,
                    photos: [
                        "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                        "https://images.unsplash.com/photo-1575429198339-9a1c7e7a0a5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    ]
                }
            ]
        },
        4: { // Gym Facility
            name: "Gym Facility",
            overallRating: 4.7,
            reviewCount: 203,
            cleanliness: 4.6,
            equipment: 4.8,
            staff: 4.7,
            value: 4.5,
            reviews: [
                {
                    user: "Vikram Singh",
                    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
                    rating: 4,
                    date: "5 days ago",
                    title: "Well-equipped gym",
                    comment: "Great variety of equipment but could use more free weights during peak hours.",
                    cleanliness: 4,
                    equipment: 5,
                    staff: 4,
                    value: 4,
                    photos: [
                        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1975&q=80"
                    ]
                }
            ]
        }
    };
    
    // Sample complaints data
    const complaintsData = {
        complaints: [
            {
                id: 1,
                serviceType: "House Cleaning",
                title: "Incomplete cleaning service",
                description: "The cleaners missed several areas including under the furniture and the kitchen cabinets. I paid for a full cleaning but didn't receive it.",
                severity: "high",
                dateFiled: "2023-05-15",
                serviceDate: "2023-05-14",
                status: "open",
                attachments: [],
                updates: [
                    {
                        author: "You",
                        date: "2023-05-15",
                        content: "Filed the complaint"
                    }
                ]
            },
            {
                id: 2,
                serviceType: "Garden Maintenance",
                title: "Poor hedge trimming",
                description: "The gardener cut the hedges unevenly and left clippings all over the lawn. The service was not up to the usual standard.",
                severity: "medium",
                dateFiled: "2023-05-10",
                serviceDate: "2023-05-09",
                status: "in-progress",
                attachments: [
                    {
                        type: "image",
                        url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    }
                ],
                updates: [
                    {
                        author: "You",
                        date: "2023-05-10",
                        content: "Filed the complaint with photo evidence"
                    },
                    {
                        author: "Admin",
                        date: "2023-05-11",
                        content: "We've assigned a senior gardener to review and correct the work. They will visit on Friday."
                    }
                ]
            },
            {
                id: 3,
                serviceType: "Handyman Services",
                title: "Leaky faucet not fixed",
                description: "The handyman came to fix the leaky faucet but it's still dripping. The issue wasn't resolved properly.",
                severity: "low",
                dateFiled: "2023-04-28",
                serviceDate: "2023-04-27",
                status: "resolved",
                attachments: [],
                updates: [
                    {
                        author: "You",
                        date: "2023-04-28",
                        content: "Reported the issue"
                    },
                    {
                        author: "Admin",
                        date: "2023-04-29",
                        content: "We've scheduled a different technician to revisit and fix the issue properly."
                    },
                    {
                        author: "You",
                        date: "2023-05-02",
                        content: "The faucet was properly fixed on the second visit. Thank you."
                    }
                ]
            }
        ]
    };
    
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize Swiper with responsive settings
        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 4,
                },
            }
        });
    
        // Tab functionality
        const tabs = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.feedback-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
                
                // If switching to complaints tab, load complaints
                if (tabId === 'service-complaints') {
                    loadComplaints('all');
                }
            });
        });
    
        // Function to update facility details and reviews
        function updateFacilityDetails(facilityId) {
            const facility = facilities[facilityId];
            
            // Update header
            document.querySelector('.selected-facility').textContent = facility.name;
            
            // Update overall rating
            document.querySelector('.rating-number').textContent = facility.overallRating;
            document.querySelector('.rating-count').textContent = `${facility.reviewCount} reviews`;
            
            // Update star display (simple version - in real app you'd calculate exact stars)
            const starDisplay = '★★★★★'.slice(0, Math.floor(facility.overallRating)) + 
                              (facility.overallRating % 1 >= 0.5 ? '☆' : '');
            document.querySelector('.rating-stars').innerHTML = starDisplay;
            
            // Update category ratings
            document.querySelector('.cleanliness-value').textContent = facility.cleanliness;
            document.querySelector('.cleanliness-bar').style.width = `${(facility.cleanliness / 5) * 100}%`;
            
            document.querySelector('.equipment-value').textContent = facility.equipment;
            document.querySelector('.equipment-bar').style.width = `${(facility.equipment / 5) * 100}%`;
            
            document.querySelector('.staff-value').textContent = facility.staff;
            document.querySelector('.staff-bar').style.width = `${(facility.staff / 5) * 100}%`;
            
            document.querySelector('.value-value').textContent = facility.value;
            document.querySelector('.value-bar').style.width = `${(facility.value / 5) * 100}%`;
            
            // Update facility ID in form
            document.getElementById('facilityId').value = facilityId;
            
            // Update reviews
            const reviewsContainer = document.querySelector('.feedback-items-container');
            reviewsContainer.innerHTML = '';
            
            facility.reviews.forEach(review => {
                const reviewItem = document.createElement('div');
                reviewItem.className = 'feedback-item';
                
                // Create star display for review
                const reviewStars = '★★★★★'.slice(0, review.rating) + '☆☆☆☆☆'.slice(review.rating);
                
                // Create category ratings display
                let categoryRatings = '';
                for (const [category, rating] of Object.entries(review)) {
                    if (['cleanliness', 'equipment', 'staff', 'value'].includes(category)) {
                        const stars = '★★★★★'.slice(0, rating) + '☆☆☆☆☆'.slice(rating);
                        categoryRatings += `
                            <div class="category-rating-item">
                                <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                                <span class="category-rating-stars">${stars}</span>
                            </div>
                        `;
                    }
                }
                
                // Create photos display if they exist
                let photosDisplay = '';
                if (review.photos && review.photos.length > 0) {
                    photosDisplay = `<div class="feedback-photos">`;
                    review.photos.forEach(photo => {
                        photosDisplay += `<img src="${photo}" alt="Review photo">`;
                    });
                    photosDisplay += `</div>`;
                }
                
                reviewItem.innerHTML = `
                    <div class="user-info">
                        <div class="user-avatar">
                            <img src="${review.avatar}" alt="${review.user}">
                        </div>
                        <div class="user-details">
                            <h4>${review.user}</h4>
                            <div class="review-meta">
                                <span class="review-rating">${reviewStars}</span>
                                <span class="review-date">${review.date}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="feedback-content">
                        <h5>${review.title}</h5>
                        <p>${review.comment}</p>
                        
                        <div class="category-ratings-review">
                            ${categoryRatings}
                        </div>
                    </div>
                    
                    ${photosDisplay}
                    
                    <div class="feedback-actions">
                        <button class="action-button helpful-button">
                            <i class="far fa-thumbs-up"></i> Helpful (0)
                        </button>
                        <button class="action-button reply-button">
                            <i class="far fa-comment"></i> Reply
                        </button>
                    </div>
                    
                    <div class="feedback-reply" style="display: none;">
                        <textarea placeholder="Write a reply..."></textarea>
                        <button class="submit-reply">Post Reply</button>
                    </div>
                `;
                
                reviewsContainer.appendChild(reviewItem);
            });
        }
    
        // Facility selection
        const facilityCards = document.querySelectorAll('.facility-card');
        facilityCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remove active class from all cards
                facilityCards.forEach(c => c.classList.remove('active'));
                
                // Add active class to selected card
                this.classList.add('active');
                
                // Update facility details
                const facilityId = parseInt(this.getAttribute('data-facility-id'));
                updateFacilityDetails(facilityId);
            });
        });
    
        // Initialize with first facility
        updateFacilityDetails(1);
    
        // Star rating functionality
        const stars = document.querySelectorAll('.star-rating .star');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                const starContainer = this.parentElement;
                
                // Set active class
                stars.forEach(s => {
                    s.classList.remove('active');
                    if (parseInt(s.getAttribute('data-value')) <= value) {
                        s.classList.add('active');
                    }
                });
                
                // Update hidden input
                document.getElementById('overallRating').value = value;
            });
        });
    
        // Category star rating functionality
        const categoryStars = document.querySelectorAll('.category-stars .cat-star');
        categoryStars.forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                const category = this.getAttribute('data-category');
                const starContainer = this.parentElement;
                
                // Set active class for this category
                const categoryStars = starContainer.querySelectorAll('.cat-star');
                categoryStars.forEach(s => {
                    s.classList.remove('active');
                    if (parseInt(s.getAttribute('data-value')) <= value) {
                        s.classList.add('active');
                    }
                });
                
                // Update hidden input
                document.getElementById(`${category}Rating`).value = value;
            });
        });
    
        // Photo upload functionality for facility feedback
        const facilityUploadTrigger = document.getElementById('facilityUploadTrigger');
        const facilityPhotoUpload = document.getElementById('facilityPhotoUpload');
        const facilityUploadPreview = document.getElementById('facilityUploadPreview');
    
        facilityUploadTrigger.addEventListener('click', function() {
            facilityPhotoUpload.click();
        });
    
        facilityPhotoUpload.addEventListener('change', function(e) {
            facilityUploadPreview.innerHTML = '';
            
            if (this.files) {
                Array.from(this.files).forEach(file => {
                    if (file.type.match('image.*')) {
                        const reader = new FileReader();
                        
                        reader.onload = function(e) {
                            const imgContainer = document.createElement('div');
                            imgContainer.className = 'preview-image';
                            imgContainer.style.position = 'relative';
                            imgContainer.style.display = 'inline-block';
                            imgContainer.style.marginRight = '10px';
                            
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            img.style.width = '100px';
                            img.style.height = '100px';
                            img.style.objectFit = 'cover';
                            img.style.borderRadius = '8px';
                            
                            const removeBtn = document.createElement('span');
                            removeBtn.innerHTML = '&times;';
                            removeBtn.style.position = 'absolute';
                            removeBtn.style.top = '0';
                            removeBtn.style.right = '0';
                            removeBtn.style.background = 'rgba(0,0,0,0.5)';
                            removeBtn.style.color = 'white';
                            removeBtn.style.width = '20px';
                            removeBtn.style.height = '20px';
                            removeBtn.style.borderRadius = '50%';
                            removeBtn.style.display = 'flex';
                            removeBtn.style.alignItems = 'center';
                            removeBtn.style.justifyContent = 'center';
                            removeBtn.style.cursor = 'pointer';
                            removeBtn.style.fontSize = '12px';
                            
                            removeBtn.addEventListener('click', function() {
                                imgContainer.remove();
                            });
                            
                            imgContainer.appendChild(img);
                            imgContainer.appendChild(removeBtn);
                            facilityUploadPreview.appendChild(imgContainer);
                        }
                        
                        reader.readAsDataURL(file);
                    }
                });
            }
        });
    
        // Reply button functionality (delegated event for dynamic content)
        document.querySelector('.feedback-list').addEventListener('click', function(e) {
            if (e.target.closest('.reply-button')) {
                const feedbackItem = e.target.closest('.feedback-item');
                const replySection = feedbackItem.querySelector('.feedback-reply');
                
                if (replySection.style.display === 'block') {
                    replySection.style.display = 'none';
                } else {
                    replySection.style.display = 'block';
                }
            }
        });
    
        // Form submission for facility feedback
        const feedbackForm = document.getElementById('facilityFeedbackForm');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Show success modal
                document.getElementById('modalTitle').textContent = 'Thank You!';
                document.getElementById('modalMessage').textContent = 'Your feedback has been submitted successfully.';
                document.getElementById('successModal').style.display = 'flex';
                
                // Reset form
                this.reset();
                facilityUploadPreview.innerHTML = '';
                stars.forEach(star => star.classList.remove('active'));
                categoryStars.forEach(star => star.classList.remove('active'));
            });
        }
    
        // Complaint status tabs
        const statusTabs = document.querySelectorAll('.status-tab');
        statusTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                statusTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Load complaints with selected status
                const status = this.getAttribute('data-status');
                loadComplaints(status);
            });
        });
    
        // Load complaints function
        function loadComplaints(status) {
            const complaintsContainer = document.querySelector('.complaints-items-container');
            complaintsContainer.innerHTML = '';
            
            // Filter complaints by status
            let filteredComplaints = complaintsData.complaints;
            if (status !== 'all') {
                filteredComplaints = complaintsData.complaints.filter(complaint => complaint.status === status);
            }
            
            // Update counts
            const totalComplaints = complaintsData.complaints.length;
            const openComplaints = complaintsData.complaints.filter(c => c.status === 'open').length;
            
            document.getElementById('totalComplaints').textContent = totalComplaints;
            document.getElementById('openComplaints').textContent = openComplaints;
            
            // Show no complaints message if none
            if (filteredComplaints.length === 0) {
                document.getElementById('noComplaintsMessage').style.display = 'block';
                return;
            } else {
                document.getElementById('noComplaintsMessage').style.display = 'none';
            }
            
            // Display complaints
            filteredComplaints.forEach(complaint => {
                const complaintItem = document.createElement('div');
                complaintItem.className = 'complaint-item';
                complaintItem.setAttribute('data-complaint-id', complaint.id);
                
                // Format dates
                const filedDate = new Date(complaint.dateFiled);
                const serviceDate = new Date(complaint.serviceDate);
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                
                // Determine severity class and label
                let severityClass = '';
                let severityLabel = '';
                switch(complaint.severity) {
                    case 'low':
                        severityClass = 'low';
                        severityLabel = 'Low';
                        break;
                    case 'medium':
                        severityClass = 'medium';
                        severityLabel = 'Medium';
                        break;
                    case 'high':
                        severityClass = 'high';
                        severityLabel = 'High';
                        break;
                }
                
                // Determine status class and label
                let statusClass = '';
                let statusLabel = '';
                switch(complaint.status) {
                    case 'open':
                        statusClass = 'open';
                        statusLabel = 'Open';
                        break;
                    case 'in-progress':
                        statusClass = 'in-progress';
                        statusLabel = 'In Progress';
                        break;
                    case 'resolved':
                        statusClass = 'resolved';
                        statusLabel = 'Resolved';
                        break;
                }
                
                complaintItem.innerHTML = `
                    <div class="complaint-header">
                        <h3 class="complaint-title">${complaint.title}</h3>
                        <span class="complaint-status ${statusClass}">${statusLabel}</span>
                    </div>
                    <div class="complaint-meta">
                        <span class="complaint-service">${complaint.serviceType}</span>
                        <span class="complaint-date">Filed on ${filedDate.toLocaleDateString('en-US', options)}</span>
                        <span class="complaint-severity ${severityClass}">${severityLabel}</span>
                    </div>
                    <p class="complaint-preview">${complaint.description}</p>
                `;
                
                complaintsContainer.appendChild(complaintItem);
            });
            
            // Add click event to complaint items
            document.querySelectorAll('.complaint-item').forEach(item => {
                item.addEventListener('click', function() {
                    const complaintId = parseInt(this.getAttribute('data-complaint-id'));
                    showComplaintDetails(complaintId);
                });
            });
        }
    
        // Show complaint details in modal
        function showComplaintDetails(complaintId) {
            const complaint = complaintsData.complaints.find(c => c.id === complaintId);
            if (!complaint) return;
            
            // Format dates
            const filedDate = new Date(complaint.dateFiled);
            const serviceDate = new Date(complaint.serviceDate);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            
            // Determine severity class and label
            let severityClass = '';
            let severityLabel = '';
            switch(complaint.severity) {
                case 'low':
                    severityClass = 'low';
                    severityLabel = 'Low';
                    break;
                case 'medium':
                    severityClass = 'medium';
                    severityLabel = 'Medium';
                    break;
                case 'high':
                    severityClass = 'high';
                    severityLabel = 'High';
                    break;
            }
            
            // Determine status class and label
            let statusClass = '';
            let statusLabel = '';
            switch(complaint.status) {
                case 'open':
                    statusClass = 'open';
                    statusLabel = 'Open';
                    break;
                case 'in-progress':
                    statusClass = 'in-progress';
                    statusLabel = 'In Progress';
                    break;
                case 'resolved':
                    statusClass = 'resolved';
                    statusLabel = 'Resolved';
                    break;
            }
            
            // Set modal content
            document.getElementById('complaintModalTitle').textContent = complaint.title;
            document.getElementById('complaintModalStatus').className = `complaint-status-badge ${statusClass}`;
            document.getElementById('complaintModalStatus').textContent = statusLabel;
            document.getElementById('complaintModalService').textContent = complaint.serviceType;
            document.getElementById('complaintModalDate').textContent = filedDate.toLocaleDateString('en-US', options);
            document.getElementById('complaintModalSeverity').className = `complaint-severity ${severityClass}`;
            document.getElementById('complaintModalSeverity').textContent = severityLabel;
            document.getElementById('complaintModalDescription').textContent = complaint.description;
            
            // Set attachments
            const attachmentsContainer = document.querySelector('#complaintModalAttachments .attachments-container');
            attachmentsContainer.innerHTML = '';
            
            if (complaint.attachments.length > 0) {
                complaint.attachments.forEach(attachment => {
                    if (attachment.type === 'image') {
                        attachmentsContainer.innerHTML += `
                            <div class="attachment-item">
                                <img src="${attachment.url}" alt="Complaint attachment">
                            </div>
                        `;
                    } else {
                        attachmentsContainer.innerHTML += `
                            <div class="attachment-item">
                                <div class="file-icon">
                                    <i class="fas fa-file-alt"></i>
                                </div>
                                <div class="file-name">Document</div>
                            </div>
                        `;
                    }
                });
            } else {
                attachmentsContainer.innerHTML = '<p>No attachments</p>';
            }
            
            // Set updates
            const updatesContainer = document.querySelector('#complaintModalUpdates .updates-container');
            updatesContainer.innerHTML = '';
            
            complaint.updates.forEach(update => {
                const updateDate = new Date(update.date);
                updatesContainer.innerHTML += `
                    <div class="update-item">
                        <div class="update-header">
                            <span class="update-author">${update.author}</span>
                            <span class="update-date">${updateDate.toLocaleDateString('en-US', options)}</span>
                        </div>
                        <div class="update-content">${update.content}</div>
                    </div>
                `;
            });
            
            // Show response form only for open or in-progress complaints
            if (complaint.status === 'open' || complaint.status === 'in-progress') {
                document.getElementById('complaintResponseForm').style.display = 'block';
            } else {
                document.getElementById('complaintResponseForm').style.display = 'none';
            }
            
            // Show modal
            document.getElementById('complaintDetailsModal').style.display = 'flex';
        }
    
        // New complaint button
        document.getElementById('newComplaintBtn').addEventListener('click', function() {
            document.getElementById('complaintForm').style.display = 'block';
            this.style.display = 'none';
        });
    
        // New complaint button from empty state
        document.getElementById('newComplaintEmptyBtn').addEventListener('click', function() {
            document.getElementById('complaintForm').style.display = 'block';
            document.getElementById('newComplaintBtn').style.display = 'none';
        });
    
        // Cancel complaint button
        document.getElementById('cancelComplaint').addEventListener('click', function() {
            document.getElementById('complaintForm').style.display = 'none';
            document.getElementById('newComplaintBtn').style.display = 'block';
            document.getElementById('serviceComplaintForm').reset();
            document.getElementById('complaintUploadPreview').innerHTML = '';
        });
    
        // Photo upload functionality for complaints
        const complaintUploadTrigger = document.getElementById('complaintUploadTrigger');
        const complaintFileUpload = document.getElementById('complaintFileUpload');
        const complaintUploadPreview = document.getElementById('complaintUploadPreview');
    
        complaintUploadTrigger.addEventListener('click', function() {
            complaintFileUpload.click();
        });
    
        complaintFileUpload.addEventListener('change', function(e) {
            complaintUploadPreview.innerHTML = '';
            
            if (this.files) {
                Array.from(this.files).forEach(file => {
                    const fileContainer = document.createElement('div');
                    fileContainer.className = 'file-preview';
                    fileContainer.style.position = 'relative';
                    fileContainer.style.display = 'inline-block';
                    fileContainer.style.marginRight = '10px';
                    
                    if (file.type.match('image.*')) {
                        const reader = new FileReader();
                        
                        reader.onload = function(e) {
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            img.style.width = '100px';
                            img.style.height = '100px';
                            img.style.objectFit = 'cover';
                            img.style.borderRadius = '8px';
                            
                            const removeBtn = document.createElement('span');
                            removeBtn.innerHTML = '&times;';
                            removeBtn.style.position = 'absolute';
                            removeBtn.style.top = '0';
                            removeBtn.style.right = '0';
                            removeBtn.style.background = 'rgba(0,0,0,0.5)';
                            removeBtn.style.color = 'white';
                            removeBtn.style.width = '20px';
                            removeBtn.style.height = '20px';
                            removeBtn.style.borderRadius = '50%';
                            removeBtn.style.display = 'flex';
                            removeBtn.style.alignItems = 'center';
                            removeBtn.style.justifyContent = 'center';
                            removeBtn.style.cursor = 'pointer';
                            removeBtn.style.fontSize = '12px';
                            
                            removeBtn.addEventListener('click', function() {
                                fileContainer.remove();
                            });
                            
                            fileContainer.appendChild(img);
                            fileContainer.appendChild(removeBtn);
                            complaintUploadPreview.appendChild(fileContainer);
                        }
                        
                        reader.readAsDataURL(file);
                    } else {
                        const fileIcon = document.createElement('div');
                        fileIcon.className = 'file-icon';
                        fileIcon.innerHTML = '<i class="fas fa-file-alt"></i>';
                        
                        const fileName = document.createElement('div');
                        fileName.className = 'file-name';
                        fileName.textContent = file.name;
                        
                        const removeBtn = document.createElement('span');
                        removeBtn.innerHTML = '&times;';
                        removeBtn.style.position = 'absolute';
                        removeBtn.style.top = '0';
                        removeBtn.style.right = '0';
                        removeBtn.style.background = 'rgba(0,0,0,0.5)';
                        removeBtn.style.color = 'white';
                        removeBtn.style.width = '20px';
                        removeBtn.style.height = '20px';
                        removeBtn.style.borderRadius = '50%';
                        removeBtn.style.display = 'flex';
                        removeBtn.style.alignItems = 'center';
                        removeBtn.style.justifyContent = 'center';
                        removeBtn.style.cursor = 'pointer';
                        removeBtn.style.fontSize = '12px';
                        
                        removeBtn.addEventListener('click', function() {
                            fileContainer.remove();
                        });
                        
                        fileContainer.appendChild(fileIcon);
                        fileContainer.appendChild(fileName);
                        fileContainer.appendChild(removeBtn);
                        complaintUploadPreview.appendChild(fileContainer);
                    }
                });
            }
        });
    
        // Form submission for service complaints
        const complaintForm = document.getElementById('serviceComplaintForm');
        if (complaintForm) {
            complaintForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Create new complaint
                const newComplaint = {
                    id: complaintsData.complaints.length + 1,
                    serviceType: document.getElementById('complaint-service').value,
                    title: document.getElementById('complaint-title').value,
                    description: document.getElementById('complaint-description').value,
                    severity: document.querySelector('input[name="severity"]:checked').value,
                    dateFiled: new Date().toISOString().split('T')[0],
                    serviceDate: document.getElementById('service-date').value,
                    status: 'open',
                    attachments: [],
                    updates: [
                        {
                            author: 'You',
                            date: new Date().toISOString().split('T')[0],
                            content: 'Filed the complaint'
                        }
                    ]
                };
                
                // Add to complaints array
                complaintsData.complaints.unshift(newComplaint);
                
                // Show success modal
                document.getElementById('modalTitle').textContent = 'Complaint Filed!';
                document.getElementById('modalMessage').textContent = 'Your complaint has been submitted successfully. We will review it and get back to you soon.';
                document.getElementById('successModal').style.display = 'flex';
                
                // Reset form and hide it
                this.reset();
                document.getElementById('complaintForm').style.display = 'none';
                document.getElementById('newComplaintBtn').style.display = 'block';
                complaintUploadPreview.innerHTML = '';
                
                // Reload complaints
                loadComplaints('all');
            });
        }
    
        // Cancel response button in complaint details
        document.getElementById('cancelResponse').addEventListener('click', function() {
            document.getElementById('complaintResponseText').value = '';
        });
    
        // Submit response button in complaint details
        document.getElementById('submitResponse').addEventListener('click', function() {
            const responseText = document.getElementById('complaintResponseText').value.trim();
            if (!responseText) return;
            
            // In a real app, this would send to the server
            // For demo, we'll just show a success message
            document.getElementById('modalTitle').textContent = 'Update Submitted!';
            document.getElementById('modalMessage').textContent = 'Your update has been added to the complaint.';
            document.getElementById('successModal').style.display = 'flex';
            
            // Clear the response field
            document.getElementById('complaintResponseText').value = '';
        });
    
        // Modal close functionality
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.close-modal');
        const modalButtons = document.querySelectorAll('.modal-button');
    
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });
    
        modalButtons.forEach(button => {
            button.addEventListener('click', function() {
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });
    
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            modals.forEach(modal => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    
        // Sort reviews functionality
        const sortSelect = document.getElementById('sortReviews');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                const sortValue = this.value;
                const feedbackContainer = document.querySelector('.feedback-items-container');
                const feedbackItems = Array.from(document.querySelectorAll('.feedback-item'));
                
                feedbackItems.sort((a, b) => {
                    if (sortValue === 'newest') {
                        return 0; // In real app, you'd compare dates
                    } else if (sortValue === 'highest') {
                        const aRating = a.querySelector('.review-rating').textContent.length;
                        const bRating = b.querySelector('.review-rating').textContent.length;
                        return bRating - aRating;
                    } else if (sortValue === 'lowest') {
                        const aRating = a.querySelector('.review-rating').textContent.length;
                        const bRating = b.querySelector('.review-rating').textContent.length;
                        return aRating - bRating;
                    }
                    return 0;
                });
                
                // Re-append sorted items
                feedbackItems.forEach(item => {
                    feedbackContainer.appendChild(item);
                });
            });
        }
    
        // Load more reviews
        const loadMoreBtn = document.querySelector('.load-more-button');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                alert('In a real implementation, this would load more reviews from the server.');
            });
        }
    });