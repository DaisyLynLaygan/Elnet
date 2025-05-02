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
    
    // Global variables
    let currentFacilityId = 1;
    let currentPage = 1;
    let totalPages = 1;
    let facilityCards;
    
    // Add the swear words list at the top of the file
    const swearWords = [
        // English
        'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'cock', 'pussy', 'whore', 'slut',
        'bastard', 'motherfucker', 'piss', 'damn', 'ass', 'idiot', 'retard', 'moron',
        
        // Filipino
        'putang', 'puta', 'putangina', 'gago', 'tangina', 'tarantado', 'ulol', 'bobo', 'tanga',
        'inutil', 'kupal', 'hinayupak', 'hayop', 'hayup', 'lintik', 'leche', 'pakyu', 'pakyo',
        'punyeta', 'pakshet', 'engot', 'ungas', 'olol', 'buwisit', 'bwisit', 'ogag', 'pokpok',
        
        // Cebuano
        'pisti', 'pisteng', 'yawa', 'yawaa', 'bati', 'batia', 'bilat', 'bilata', 'buang',
        'buanga', 'hindot', 'hindota', 'animal', 'animala', 'amaw', 'amawa', 'puya', 'puyat',
        'libog', 'liboga', 'bayot', 'bayota', 'tae', 'taeta', 'bulok', 'buloka',
        
        // Common variations and combinations
        'putanginamo', 'tanginama', 'tanginamoka', 'pisting', 'pistengyawa', 'putragis',
        'fuckyou', 'fck', 'fvck', 'f*ck', 'sh*t', 'b*tch', 'stfu', 'wtf', 'fck u',
        'putangina mo', 'tang ina', 'tang ina mo', 'puta mo', 'gago ka',
        
        // Additional regional variations
        'paksit', 'pakingshet', 'kingina', 'kinginamo', 'shunga', 'boboka', 'bobomo',
        'tangamo', 'pesteng', 'pisteng yawa', 'piste', 'amawon', 'amahan', 'bilateron',
        'hindoton', 'punyales', 'punyaleta'
    ];

    // Function to censor swear words
    function censorText(text) {
        if (!text) return '';
        
        let censoredText = text;
        swearWords.forEach(word => {
            const regex = new RegExp(word, 'gi');
            censoredText = censoredText.replace(regex, '*'.repeat(word.length));
        });
        return censoredText;
    }
    
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
    
    document.addEventListener('DOMContentLoaded', async function() {
        try {
            // Initialize facility cards first
            facilityCards = document.querySelectorAll('.facility-card');
            
            // Initialize with first facility
            if (facilityCards && facilityCards.length > 0) {
                const initialFacilityId = parseInt(facilityCards[0].getAttribute('data-facility-id')) || 1;
                currentFacilityId = initialFacilityId;
                
                // Update all facility card ratings first
                await updateAllFacilityRatings();
                
                // Set active facility and update details
                setActiveFacilityCard(initialFacilityId);
                await updateFacilityDetails(initialFacilityId);
            }
            
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
            
            // Function to switch tabs
            function switchTab(tabId) {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                const activeTab = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
                const activeContent = document.getElementById(tabId);
                
                if (activeTab && activeContent) {
                    activeTab.classList.add('active');
                    activeContent.classList.add('active');
                    
                    // If switching to complaints tab, load complaints
                    if (tabId === 'service-complaints') {
                        loadComplaints('all');
                    } else if (tabId === 'facility-feedback') {
                        // Reset to current facility when switching back to feedback
                        if (currentFacilityId) {
                            updateFacilityDetails(currentFacilityId);
                            setActiveFacilityCard(currentFacilityId);
                        }
                    }
                }
            }
            
            // Add click event listeners to tabs
            tabs.forEach(tab => {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    const tabId = this.getAttribute('data-tab');
                    switchTab(tabId);
                });
            });
            
            // Initialize with facility feedback tab
            switchTab('facility-feedback');
        
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
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
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
                        throw new Error(result.message || 'Failed to load facility details');
                    }
                } catch (error) {
                    console.error('Error updating facility details:', error);
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
            facilityCards.forEach(card => {
                card.addEventListener('click', async function() {
                    try {
                        const facilityId = parseInt(this.getAttribute('data-facility-id'));
                        if (!facilityId) return;
                        
                        currentFacilityId = facilityId;
                        
                        // Update facility details
                        await updateFacilityDetails(facilityId);
                        
                        // Set active class
                        setActiveFacilityCard(facilityId);
                        
                        // Scroll to feedback form
                        document.querySelector('.feedback-section').scrollIntoView({ behavior: 'smooth' });
                    } catch (error) {
                        console.error('Error updating facility:', error);
                        showModal('Error', 'Failed to load facility details. Please try again.', false);
                    }
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
                            Title: censorText(trimmedTitle),
                            Comment: censorText(trimmedComment),
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

            // Function to display feedback items
            async function loadFacilityFeedback(facilityId, page = 1) {
                try {
                    const response = await fetch(`/Homeowner/GetFacilityFeedback?facilityId=${facilityId}&page=${page}&pageSize=5`);
                    const data = await response.json();

                    if (data.success) {
                        const container = document.querySelector('.feedback-items-container');
                        container.innerHTML = ''; // Clear existing feedback

                        if (data.feedbacks.length === 0) {
                            container.innerHTML = `
                                <div class="no-reviews">
                                    <p>No reviews yet. Be the first to share your experience!</p>
                                </div>`;
                            return;
                        }

                        data.feedbacks.forEach(feedback => {
                            const feedbackItem = document.createElement('div');
                            feedbackItem.className = 'feedback-item';
                            
                            // Format date
                            const date = new Date(feedback.createdDate);
                            const formattedDate = date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });

                            feedbackItem.innerHTML = `
                                <div class="user-info">
                                    <div class="user-avatar">
                                        <div class="avatar-initials">${getInitials(feedback.user.name)}</div>
                                    </div>
                                    <div class="user-details">
                                        <h4>${feedback.user.name}</h4>
                                        <div class="review-meta">
                                            <div class="review-rating">
                                                ${generateStarRating(feedback.overallRating)}
                                            </div>
                                            <span class="review-date">${formattedDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="review-content">
                                    <h5 class="review-title">${censorText(feedback.title)}</h5>
                                    <p class="review-comment">${censorText(feedback.comment)}</p>
                                </div>
                                <div class="category-ratings-review">
                                    <div class="rating-item">
                                        <span>Cleanliness</span>
                                        <div class="rating-stars">${generateStarRating(feedback.cleanlinessRating)}</div>
                                    </div>
                                    <div class="rating-item">
                                        <span>Equipment</span>
                                        <div class="rating-stars">${generateStarRating(feedback.equipmentRating)}</div>
                                    </div>
                                    <div class="rating-item">
                                        <span>Staff</span>
                                        <div class="rating-stars">${generateStarRating(feedback.staffRating)}</div>
                                    </div>
                                    <div class="rating-item">
                                        <span>Value</span>
                                        <div class="rating-stars">${generateStarRating(feedback.valueRating)}</div>
                                    </div>
                                </div>
                            `;

                            container.appendChild(feedbackItem);
                        });

                        // Update pagination if needed
                        updatePagination(data.pagination);
                    } else {
                        console.error('Error loading feedback:', data.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            // Helper function to generate star rating HTML
            function generateStarRating(rating) {
                const fullStars = Math.floor(rating);
                const hasHalfStar = rating % 1 >= 0.5;
                const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
                
                return '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
            }

            // Helper function to get initials from name
            function getInitials(name) {
                return name
                    .split(' ')
                    .map(word => word[0])
                    .join('')
                    .toUpperCase();
            }

            // Update pagination
            function updatePagination(pagination) {
                const container = document.querySelector('.feedback-list');
                const loadMoreBtn = container.querySelector('.load-more-button');
                
                if (pagination.currentPage >= pagination.totalPages) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'block';
                }
            }

            // Initialize feedback loading when page loads
            document.addEventListener('DOMContentLoaded', function() {
                // Load initial feedback for the first facility
                loadFacilityFeedback(1);

                // Add event listener for facility card clicks
                document.querySelectorAll('.facility-card').forEach(card => {
                    card.addEventListener('click', function() {
                        const facilityId = this.dataset.facilityId;
                        loadFacilityFeedback(facilityId);
                    });
                });

                // Add event listener for load more button
                const loadMoreBtn = document.querySelector('.load-more-button');
                if (loadMoreBtn) {
                    loadMoreBtn.addEventListener('click', function() {
                        const currentPage = parseInt(this.dataset.page || 1);
                        const facilityId = document.querySelector('.facility-card.active').dataset.facilityId;
                        loadFacilityFeedback(facilityId, currentPage + 1);
                    });
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
        } catch (error) {
            console.error('Error initializing feedback:', error);
        }
    });