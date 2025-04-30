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
                        "https://images.unsplash.com/photo-1571902943202-507eb2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1975&q=80"
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
    
    document.addEventListener('DOMContentLoaded', async function() {
        // Update all facility card ratings first
        await updateAllFacilityRatings();
        
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
    
        // Function to generate star rating HTML
        function generateStarRating(rating) {
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            
            let html = '';
            
            // Add full stars
            for (let i = 0; i < fullStars; i++) {
                html += '<span class="star-filled" aria-hidden="true">★</span>';
            }
            
            // Add half star if needed
            if (hasHalfStar) {
                html += '<span class="star-half" aria-hidden="true">★</span>';
            }
            
            // Add empty stars
            for (let i = 0; i < emptyStars; i++) {
                html += '<span class="star-empty" aria-hidden="true">☆</span>';
            }
            
            // Add screen reader text for accessibility
            html += `<span class="sr-only">${rating} out of 5 stars</span>`;
            
            return html;
        }
    
        // Function to update facility details and reviews
        async function updateFacilityDetails(facilityId) {
            try {
                // Show loading indicators
                document.querySelector('.rating-number').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                document.querySelector('.rating-stars').innerHTML = '';
                document.querySelector('.rating-count').innerHTML = '';
                
                // Clear rating bars
                document.querySelectorAll('.bar-fill').forEach(bar => {
                    bar.style.width = '0%';
                    bar.style.transition = 'none';
                });
                
                // Clear rating values
                document.querySelectorAll('.rating-value').forEach(value => {
                    value.textContent = '0.0';
                });
                
                const response = await fetch(`/Homeowner/GetFacilityDetails?facilityId=${facilityId}`);
                const result = await response.json();
                
                // Re-enable transitions after a small delay
                setTimeout(() => {
                    document.querySelectorAll('.bar-fill').forEach(bar => {
                        bar.style.transition = 'width 0.3s ease';
                    });
                }, 50);
                
                if (result.success) {
                    const facility = result.facility;
                    
                    // Update header and facility name
                    document.querySelector('.selected-facility').textContent = facility.name;
                    
                    // Update overall rating
                    document.querySelector('.rating-number').textContent = facility.overall_rating.toFixed(1);
                    document.querySelector('.rating-count').textContent = `${facility.review_count} ${facility.review_count === 1 ? 'review' : 'reviews'}`;
                    
                    // Update star display with custom function
                    document.querySelector('.rating-stars').innerHTML = generateStarRating(facility.overall_rating);
                    
                    // Update category ratings
                    document.querySelector('.cleanliness-value').textContent = facility.cleanliness_rating.toFixed(1);
                    document.querySelector('.cleanliness-bar').style.width = `${(facility.cleanliness_rating / 5) * 100}%`;
                    
                    document.querySelector('.equipment-value').textContent = facility.equipment_rating.toFixed(1);
                    document.querySelector('.equipment-bar').style.width = `${(facility.equipment_rating / 5) * 100}%`;
                    
                    document.querySelector('.staff-value').textContent = facility.staff_rating.toFixed(1);
                    document.querySelector('.staff-bar').style.width = `${(facility.staff_rating / 5) * 100}%`;
                    
                    document.querySelector('.value-value').textContent = facility.value_rating.toFixed(1);
                    document.querySelector('.value-bar').style.width = `${(facility.value_rating / 5) * 100}%`;
                    
                    // Update the facility card rating
                    const facilityCard = document.querySelector(`.facility-card[data-facility-id="${facilityId}"]`);
                    if (facilityCard) {
                        const ratingSpan = facilityCard.querySelector('.facility-rating span');
                        if (ratingSpan) {
                            ratingSpan.textContent = facility.overall_rating.toFixed(1);
                        }
                    }
                    
                    // Update facility ID in form and show form
                    document.getElementById('facilityId').value = facilityId;
                    document.querySelector('.feedback-form').style.display = 'block';
                    
                    // Reset rating stars
                    resetRatingStars();
                    
                    // Load feedback for this facility
                    await loadFacilityFeedback(facilityId);
                } else {
                    // Show error message if the result was not successful
                    showModal('Error', result.message || 'Failed to load facility details', false);
                }
            } catch (error) {
                console.error('Error updating facility details:', error);
                // Show error message
                showModal('Error', 'Failed to load facility details. Please try again later.', false);
            }
        }
    
        // Function to reset rating stars
        function resetRatingStars() {
            // Reset overall rating
            document.querySelectorAll('.star-rating .star').forEach(star => {
                star.classList.remove('active');
            });
            document.getElementById('overallRating').value = '';

            // Reset category ratings
            ['cleanliness', 'equipment', 'staff', 'value'].forEach(category => {
                document.querySelectorAll(`.category-stars[data-category="${category}"] .cat-star`).forEach(star => {
                    star.classList.remove('active');
                });
                document.getElementById(`${category}Rating`).value = '';
            });
        }
    
        // Star rating functionality
        const stars = document.querySelectorAll('.star-rating .star');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                document.getElementById('overallRating').value = value;
                
                // Update star display
                stars.forEach(s => {
                    s.classList.remove('active');
                    if (parseInt(s.getAttribute('data-value')) <= value) {
                        s.classList.add('active');
                    }
                });
            });

            // Add hover effect
            star.addEventListener('mouseover', function() {
                const value = parseInt(this.getAttribute('data-value'));
                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-value')) <= value) {
                        s.classList.add('hover');
                    }
                });
            });

            star.addEventListener('mouseout', function() {
                stars.forEach(s => s.classList.remove('hover'));
            });
        });
    
        // Category star rating functionality
        const categoryStars = document.querySelectorAll('.category-stars .cat-star');
        categoryStars.forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                const category = this.closest('.category-stars').getAttribute('data-category');
                document.getElementById(`${category}Rating`).value = value;
                
                // Update star display for this category
                const categoryStarsElements = this.closest('.category-stars').querySelectorAll('.cat-star');
                categoryStarsElements.forEach(s => {
                    s.classList.remove('active');
                    if (parseInt(s.getAttribute('data-value')) <= value) {
                        s.classList.add('active');
                    }
                });
            });

            // Add hover effect
            star.addEventListener('mouseover', function() {
                const value = parseInt(this.getAttribute('data-value'));
                const categoryStarsElements = this.closest('.category-stars').querySelectorAll('.cat-star');
                categoryStarsElements.forEach(s => {
                    if (parseInt(s.getAttribute('data-value')) <= value) {
                        s.classList.add('hover');
                    }
            });
        });

            star.addEventListener('mouseout', function() {
                const categoryStarsElements = this.closest('.category-stars').querySelectorAll('.cat-star');
                categoryStarsElements.forEach(s => s.classList.remove('hover'));
            });
        });
    
        // Facility selection
        const facilityCards = document.querySelectorAll('.facility-card');

        // Function to set active facility card
        function setActiveFacilityCard(facilityId) {
            // Remove active class from all cards
            facilityCards.forEach(card => {
                card.classList.remove('active');
                if (parseInt(card.getAttribute('data-facility-id')) === facilityId) {
                    card.classList.add('active');
                }
            });
        }

        facilityCards.forEach(card => {
            card.addEventListener('click', function() {
                const facilityId = parseInt(this.getAttribute('data-facility-id'));
                
                // Update facility details
                updateFacilityDetails(facilityId);
                
                // Set active class
                setActiveFacilityCard(facilityId);
                
                // Scroll to feedback form
                document.querySelector('.feedback-section').scrollIntoView({ behavior: 'smooth' });
            });
        });
    
        // Initialize with first facility
        const initialFacilityId = 1;
        updateFacilityDetails(initialFacilityId);
        setActiveFacilityCard(initialFacilityId);
    
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
    
        // Function to show modal with appropriate icon
        function showModal(title, message, isSuccess = true) {
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalMessage').textContent = message;
            
            // Set the appropriate icon
            const modalIcon = document.getElementById('modalIcon');
            if (isSuccess) {
                modalIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                modalIcon.className = 'modal-icon success';
            } else {
                modalIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
                modalIcon.className = 'modal-icon error';
            }
            
            document.getElementById('successModal').style.display = 'flex';
        }
    
        // Form submission for facility feedback
        const feedbackForm = document.getElementById('facilityFeedbackForm');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Disable submit button and show loading state
                const submitButton = this.querySelector('.submit-button');
                const originalButtonText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';
                submitButton.style.opacity = '0.7';
                
                try {
                    // Validate that ratings are selected
                    const overallRating = document.getElementById('overallRating').value;
                    const cleanlinessRating = document.getElementById('cleanlinessRating').value;
                    const equipmentRating = document.getElementById('equipmentRating').value;
                    const staffRating = document.getElementById('staffRating').value;
                    const valueRating = document.getElementById('valueRating').value;
                    const title = document.getElementById('feedback-title').value;
                    const comment = document.getElementById('feedback-comment').value;
                    
                    // Validate title and comment with more detailed validation
                    const trimmedTitle = title.trim();
                    const trimmedComment = comment.trim();
                    
                    if (!trimmedTitle) {
                        showModal('Missing Title', 'Please provide a title for your feedback.', false);
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                        submitButton.style.opacity = '1';
                        return;
                    }
                    
                    if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
                        showModal('Invalid Title', 'Title must be between 3 and 100 characters.', false);
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                        submitButton.style.opacity = '1';
                        return;
                    }
                    
                    if (!trimmedComment) {
                        showModal('Missing Comment', 'Please provide a comment for your feedback.', false);
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                        submitButton.style.opacity = '1';
                        return;
                    }
                    
                    if (trimmedComment.length < 10) {
                        showModal('Comment Too Short', 'Please provide a more detailed comment for your feedback (at least 10 characters).', false);
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                        submitButton.style.opacity = '1';
                        return;
                    }
                    
                    if (!overallRating || !cleanlinessRating || !equipmentRating || !staffRating || !valueRating) {
                        showModal('Missing Ratings', 'Please select a rating for all categories.', false);
                        
                        // Reset button state
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                        submitButton.style.opacity = '1';
                        return;
                    }
                    
                    const formData = {
                        FacilityId: parseInt(document.getElementById('facilityId').value),
                        OverallRating: parseInt(overallRating),
                        CleanlinessRating: parseInt(cleanlinessRating),
                        EquipmentRating: parseInt(equipmentRating),
                        StaffRating: parseInt(staffRating),
                        ValueRating: parseInt(valueRating),
                        Title: trimmedTitle,
                        Comment: trimmedComment,
                        Photos: Array.from(document.querySelectorAll('#facilityUploadPreview img')).map(img => img.src)
                    };

                    console.log('Submitting feedback:', formData);

                    const response = await fetch('/Homeowner/SubmitFeedback', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    const result = await response.json();
                    console.log('Feedback submission result:', result);
                    
                    if (result.success) {
                        // Show success modal
                        showModal('Thank You!', 'Your feedback has been submitted successfully.', true);
                        
                        // Reset form
                        this.reset();
                        document.getElementById('facilityUploadPreview').innerHTML = '';
                        document.querySelectorAll('.star-rating .star, .category-stars .cat-star').forEach(star => star.classList.remove('active'));
                        
                        // Update both the facility details and feedback list
                        const facilityId = formData.FacilityId;
                        await updateFacilityDetails(facilityId);
                        
                        // Also update all facility cards with latest ratings
                        await updateAllFacilityRatings();
                    } else {
                        console.error('Error submitting feedback:', result.message);
                        showModal('Submission Error', result.message || 'Failed to submit feedback. Please try again.', false);
                    }
                } catch (error) {
                    console.error('Error submitting feedback:', error);
                    showModal('Error', 'An error occurred while submitting feedback. Please try again later.', false);
                } finally {
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                    submitButton.style.opacity = '1';
                }
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
                
                // Skip if no feedback items
                if (feedbackItems.length === 0) return;
                
                console.log('Sorting reviews by:', sortValue);
                
                feedbackItems.sort((a, b) => {
                    if (sortValue === 'newest') {
                        // Get dates from the date attributes
                        const dateA = new Date(a.getAttribute('data-date'));
                        const dateB = new Date(b.getAttribute('data-date'));
                        return dateB - dateA; // Newest first
                    } else if (sortValue === 'highest') {
                        // Get rating from the rating attribute
                        const ratingA = parseFloat(a.getAttribute('data-rating'));
                        const ratingB = parseFloat(b.getAttribute('data-rating'));
                        return ratingB - ratingA; // Highest first
                    } else if (sortValue === 'lowest') {
                        // Get rating from the rating attribute
                        const ratingA = parseFloat(a.getAttribute('data-rating'));
                        const ratingB = parseFloat(b.getAttribute('data-rating'));
                        return ratingA - ratingB; // Lowest first
                    }
                    return 0;
                });
                
                // Clear container
                feedbackContainer.innerHTML = '';
                
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

        // Global variables for pagination
        let currentFacilityId = 1;
        let currentPage = 1;
        let totalPages = 1;

        // Function to censor bad words
        function censorBadWords(text) {
            if (!text) return '';
            
            // List of bad words to censor
            const badWords = [
                'damn', 'shit', 'fuck', 'asshole', 'bitch', 'crap', 'piss', 'dick', 
                'bastard', 'hell', 'jerk', 'idiot', 'stupid', 'dumb', 'loser', 'retard',
                'slut', 'whore', 'wtf', 'stfu', 'lmao', 'lmfao', 'ass', 'tits'
            ];
            
            let censoredText = text;
            
            // Replace each bad word with asterisks
            badWords.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                censoredText = censoredText.replace(regex, '*'.repeat(word.length));
            });
            
            return censoredText;
        }

        // Function to load facility feedback
        async function loadFacilityFeedback(facilityId, page = 1) {
            try {
                // Update current facility and page
                currentFacilityId = facilityId;
                currentPage = page;
                
                // Show loading indicator
                const reviewsContainer = document.querySelector('.feedback-items-container');
                reviewsContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading reviews...</div>';

                const response = await fetch(`/Homeowner/GetFacilityFeedback?facilityId=${facilityId}&page=${page}`);
                const result = await response.json();
                
                console.log("Feedback response:", result); // Log the response to debug
                
                reviewsContainer.innerHTML = ''; // Clear loading spinner
                
                if (result.success) {
                    // Update pagination info
                    if (result.pagination) {
                        totalPages = result.pagination.totalPages;
                        currentPage = result.pagination.currentPage;
                        
                        // Update load more button
                        const loadMoreButton = document.querySelector('.load-more-button');
                        if (currentPage < totalPages) {
                            loadMoreButton.style.display = 'block';
                            loadMoreButton.textContent = `Load More Reviews (${result.pagination.totalItems - (page * result.pagination.pageSize) > 0 ? 
                                                          result.pagination.totalItems - (page * result.pagination.pageSize) : 0} remaining)`;
                        } else {
                            loadMoreButton.style.display = 'none';
                        }
                    }
                    
                    if (result.feedbacks && result.feedbacks.length > 0) {
                        // Remember sort order
                        const sortOrder = document.getElementById('sortReviews').value || 'newest';
                        
                        // Sort the feedbacks according to current sort order
                        let sortedFeedbacks = [...result.feedbacks];
                        if (sortOrder === 'highest') {
                            sortedFeedbacks.sort((a, b) => b.overallRating - a.overallRating);
                        } else if (sortOrder === 'lowest') {
                            sortedFeedbacks.sort((a, b) => a.overallRating - b.overallRating);
                        } else {
                            // Default: newest first
                            sortedFeedbacks.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                        }
                        
                        sortedFeedbacks.forEach(feedback => {
                            const reviewItem = document.createElement('div');
                            reviewItem.className = 'feedback-item';
                            
                            // Store date and rating as data attributes for sorting
                            reviewItem.setAttribute('data-date', feedback.createdDate);
                            reviewItem.setAttribute('data-rating', feedback.overallRating);
                            
                            // Format date
                            const date = new Date(feedback.createdDate);
                            const formattedDate = date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });
                            
                            // Create star display for review using our helper function
                            const reviewStars = generateStarRating(feedback.overallRating);
                            
                            // Create category ratings display
                            const categoryRatings = `
                                <div class="category-rating-item">
                                    <span>Cleanliness</span>
                                    <span class="category-rating-stars">${generateStarRating(feedback.cleanlinessRating)}</span>
                                </div>
                                <div class="category-rating-item">
                                    <span>Equipment</span>
                                    <span class="category-rating-stars">${generateStarRating(feedback.equipmentRating)}</span>
                                </div>
                                <div class="category-rating-item">
                                    <span>Staff</span>
                                    <span class="category-rating-stars">${generateStarRating(feedback.staffRating)}</span>
                                </div>
                                <div class="category-rating-item">
                                    <span>Value</span>
                                    <span class="category-rating-stars">${generateStarRating(feedback.valueRating)}</span>
                                </div>
                            `;
                            
                            // Create photos display if they exist
                            let photosDisplay = '';
                            if (feedback.photos && feedback.photos.length > 0) {
                                photosDisplay = `<div class="feedback-photos">`;
                                feedback.photos.forEach(photo => {
                                    // Make photos clickable to open in new tab with improved styling
                                    photosDisplay += `<img src="${photo}" alt="Review photo" onclick="window.open('${photo}', '_blank')" title="Click to view full size">`;
                                });
                                photosDisplay += `</div>`;
                            }
                            
                            // Ensure title and comment are properly displayed - required fields
                            const title = feedback.title ? censorBadWords(feedback.title.trim()) : 'Review';
                            const comment = feedback.comment ? censorBadWords(feedback.comment.trim()) : 'No comment provided.';
                            
                            reviewItem.innerHTML = `
                                <div class="user-info">
                                    <div class="user-avatar">
                                        <div class="avatar-initials">${feedback.user.name.split(' ').map(n => n[0]).join('')}</div>
                                    </div>
                                    <div class="user-details">
                                        <h4>${feedback.user.name}</h4>
                                        <div class="review-meta">
                                            <span class="review-rating">${reviewStars}</span>
                                            <span class="review-date">${formattedDate}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="feedback-content">
                                    <h5 class="review-title">${title}</h5>
                                    <p class="review-comment">${comment}</p>
                                    
                                    <div class="category-ratings-review">
                                        ${categoryRatings}
                                    </div>
                                </div>
                                
                                ${photosDisplay}
                            `;
                            
                            reviewsContainer.appendChild(reviewItem);
                        });
                    } else {
                        // No reviews message
                        reviewsContainer.innerHTML = `
                            <div class="no-reviews">
                                <p>No reviews yet. Be the first to share your experience!</p>
                            </div>
                        `;
                        // Hide load more button
                        document.querySelector('.load-more-button').style.display = 'none';
                    }
                } else {
                    reviewsContainer.innerHTML = `
                        <div class="error-message">
                            <p>Failed to load reviews: ${result.message || 'Unknown error'}</p>
                        </div>
                    `;
                    // Hide load more button
                    document.querySelector('.load-more-button').style.display = 'none';
                }
            } catch (error) {
                console.error('Error loading feedback:', error);
                const reviewsContainer = document.querySelector('.feedback-items-container');
                reviewsContainer.innerHTML = `
                    <div class="error-message">
                        <p>Error loading reviews. Please try again later.</p>
                    </div>
                `;
                // Hide load more button
                document.querySelector('.load-more-button').style.display = 'none';
            }
        }

        // Update load more button handler
        document.querySelector('.load-more-button').addEventListener('click', function() {
            if (currentPage < totalPages) {
                loadFacilityFeedback(currentFacilityId, currentPage + 1);
            }
        });

        // Function to update all facility card ratings
        async function updateAllFacilityRatings() {
            try {
                // Get all facility cards
                const facilityCards = document.querySelectorAll('.facility-card');
                
                // Update each facility card rating
                for (const card of facilityCards) {
                    const facilityId = parseInt(card.getAttribute('data-facility-id'));
                    const response = await fetch(`/Homeowner/GetFacilityDetails?facilityId=${facilityId}`);
                    const result = await response.json();
                    
                    if (result.success) {
                        const ratingSpan = card.querySelector('.facility-rating span');
                        if (ratingSpan) {
                            ratingSpan.textContent = result.facility.overall_rating.toFixed(1);
                        }
                    }
                }
            } catch (error) {
                console.error('Error updating facility ratings:', error);
            }
        }
    });