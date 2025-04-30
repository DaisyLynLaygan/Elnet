document.addEventListener('DOMContentLoaded', function() {
    // Global variables for pagination
    let currentFeedbackPage = 1;
    let currentComplaintsPage = 1;
    const pageSize = 10;

    // Tab functionality
    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.feedback-content');
    
    function switchTab(tabId) {
        // Remove active class from all tabs and contents
        tabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        const selectedTab = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);
        
        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active');
            selectedContent.classList.add('active');

            // Load data for the selected tab
            if (tabId === 'facility-feedback') {
                loadFeedback();
            } else if (tabId === 'service-complaints') {
                loadComplaints();
            }
        }
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Function to load feedback data
    async function loadFeedback() {
        try {
            const facility = document.getElementById('facilityFilter').value;
            const response = await fetch(`/Admin/GetFeedback?page=${currentFeedbackPage}&pageSize=${pageSize}&facility=${facility}`);
            const result = await response.json();

            if (result.success) {
                updateFeedbackTable(result.feedbacks);
                updateFeedbackStats(result.stats);
                updateFeedbackPagination(result.pagination);
            } else {
                console.error('Error loading feedback:', result.message);
            }
        } catch (error) {
            console.error('Error loading feedback:', error);
        }
    }

    // Function to load complaints data
    async function loadComplaints() {
        try {
            const status = document.getElementById('statusFilter').value;
            const serviceType = document.getElementById('serviceTypeFilter').value;
            const response = await fetch(`/Admin/GetComplaints?page=${currentComplaintsPage}&pageSize=${pageSize}&status=${status}&serviceType=${serviceType}`);
            const result = await response.json();

            if (result.success) {
                updateComplaintsTable(result.complaints);
                updateComplaintsStats(result.stats);
                updateComplaintsPagination(result.pagination);
            } else {
                console.error('Error loading complaints:', result.message);
            }
        } catch (error) {
            console.error('Error loading complaints:', error);
        }
    }

    // Function to update feedback table
    function updateFeedbackTable(feedbacks) {
        const tbody = document.querySelector('#facility-feedback tbody');
        tbody.innerHTML = '';

        feedbacks.forEach(feedback => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="feedback-user">
                        <div class="feedback-user-info">
                            <h4>${feedback.user.name}</h4>
                            <p>${feedback.user.unit}</p>
                        </div>
                    </div>
                </td>
                <td>${feedback.facility}</td>
                <td>
                    <div class="rating-stars">${generateStarRating(feedback.overall_rating)}</div>
                </td>
                <td>${feedback.title}</td>
                <td>${feedback.created_date}</td>
                <td><span class="badge success">${feedback.status}</span></td>
                <td>
                    <button class="btn-icon view-details" title="View Details" data-type="feedback" data-id="${feedback.feedback_id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon delete-feedback" title="Delete" data-id="${feedback.feedback_id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Function to update complaints table
    function updateComplaintsTable(complaints) {
        const tbody = document.querySelector('#service-complaints tbody');
        tbody.innerHTML = '';

        complaints.forEach(complaint => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="feedback-user">
                        <div class="feedback-user-info">
                            <h4>${complaint.user.name}</h4>
                            <p>${complaint.user.unit}</p>
                        </div>
                    </div>
                </td>
                <td>${complaint.service_type}</td>
                <td>${complaint.title}</td>
                <td><span class="badge ${getSeverityClass(complaint.severity)}">${complaint.severity}</span></td>
                <td>${complaint.date_created}</td>
                <td><span class="badge ${getStatusClass(complaint.status)}">${complaint.status}</span></td>
                <td>
                    <button class="btn-icon view-details" title="View Details" data-type="complaint" data-id="${complaint.request_id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon resolve-complaint" title="Resolve" data-id="${complaint.request_id}">
                        <i class="fas fa-check"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Helper function to generate star rating display
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }
        if (hasHalfStar) {
            stars += '½';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '☆';
        }
        return stars;
    }

    // Helper function to get severity class
    function getSeverityClass(severity) {
        switch (severity.toLowerCase()) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'secondary';
        }
    }

    // Helper function to get status class
    function getStatusClass(status) {
        switch (status.toLowerCase()) {
            case 'open': return 'danger';
            case 'in-progress': return 'primary';
            case 'resolved': return 'success';
            default: return 'secondary';
        }
    }

    // Function to update feedback stats
    function updateFeedbackStats(stats) {
        document.querySelector('#facility-feedback .stat-card:nth-child(1) .stat-value').textContent = stats.total;
        document.querySelector('#facility-feedback .stat-card:nth-child(2) .stat-value').textContent = stats.average_rating.toFixed(1);
        document.querySelector('#facility-feedback .stat-card:nth-child(3) .stat-value').textContent = stats.new_this_week;
        document.querySelector('#facility-feedback .stat-card:nth-child(4) .stat-value').textContent = stats.facilities;
    }

    // Function to update complaints stats
    function updateComplaintsStats(stats) {
        document.querySelector('#service-complaints .stat-card:nth-child(1) .stat-value').textContent = stats.total;
        document.querySelector('#service-complaints .stat-card:nth-child(2) .stat-value').textContent = stats.open;
        document.querySelector('#service-complaints .stat-card:nth-child(3) .stat-value').textContent = stats.avg_resolution_time;
        document.querySelector('#service-complaints .stat-card:nth-child(4) .stat-value').textContent = stats.satisfaction_rate + '%';
    }

    // Function to update feedback pagination
    function updateFeedbackPagination(pagination) {
        const paginationContainer = document.querySelector('#facility-feedback .pagination');
        paginationContainer.innerHTML = '';

        // Previous button
        if (pagination.currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
            prevButton.addEventListener('click', () => {
                currentFeedbackPage--;
                loadFeedback();
            });
            paginationContainer.appendChild(prevButton);
        }

        // Page buttons
        for (let i = 1; i <= pagination.totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === pagination.currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentFeedbackPage = i;
                loadFeedback();
            });
            paginationContainer.appendChild(pageButton);
        }

        // Next button
        if (pagination.currentPage < pagination.totalPages) {
            const nextButton = document.createElement('button');
            nextButton.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
            nextButton.addEventListener('click', () => {
                currentFeedbackPage++;
                loadFeedback();
            });
            paginationContainer.appendChild(nextButton);
        }
    }

    // Function to update complaints pagination
    function updateComplaintsPagination(pagination) {
        const paginationContainer = document.querySelector('#service-complaints .pagination');
        paginationContainer.innerHTML = '';

        // Previous button
        if (pagination.currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
            prevButton.addEventListener('click', () => {
                currentComplaintsPage--;
                loadComplaints();
            });
            paginationContainer.appendChild(prevButton);
        }

        // Page buttons
        for (let i = 1; i <= pagination.totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === pagination.currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentComplaintsPage = i;
                loadComplaints();
            });
            paginationContainer.appendChild(pageButton);
        }

        // Next button
        if (pagination.currentPage < pagination.totalPages) {
            const nextButton = document.createElement('button');
            nextButton.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
            nextButton.addEventListener('click', () => {
                currentComplaintsPage++;
                loadComplaints();
            });
            paginationContainer.appendChild(nextButton);
        }
    }

    // Filter event listeners
    document.getElementById('facilityFilter')?.addEventListener('change', function() {
        currentFeedbackPage = 1;
        loadFeedback();
    });

    document.getElementById('statusFilter')?.addEventListener('change', function() {
        currentComplaintsPage = 1;
        loadComplaints();
    });

    document.getElementById('serviceTypeFilter')?.addEventListener('change', function() {
        currentComplaintsPage = 1;
        loadComplaints();
    });

    // Initialize with first tab active
    switchTab('facility-feedback');

    // Function to show feedback details in modal
    async function showFeedbackDetails(feedbackId) {
        try {
            const response = await fetch(`/Admin/GetFeedbackDetails?id=${feedbackId}`);
            const result = await response.json();

            if (result.success) {
                const feedback = result.feedback;
                const modal = document.getElementById('feedbackDetailModal');
                
                // Set modal content
                document.getElementById('feedbackUserName').textContent = feedback.user.name;
                document.getElementById('feedbackUserUnit').textContent = feedback.user.unit || 'N/A';
                document.getElementById('feedbackFacility').textContent = feedback.facility;
                document.getElementById('feedbackRating').innerHTML = generateStarRating(feedback.overall_rating);
                document.getElementById('feedbackDate').textContent = feedback.created_date;
                document.getElementById('feedbackStatus').textContent = feedback.status;
                document.getElementById('feedbackFullText').textContent = feedback.comment;
                
                // Set user avatar (if available)
                const userAvatar = document.getElementById('feedbackUserAvatar');
                if (feedback.user.avatar) {
                    userAvatar.src = feedback.user.avatar;
                } else {
                    // Generate initials avatar if no avatar is available
                    const initials = feedback.user.name.split(' ').map(n => n[0]).join('');
                    userAvatar.src = `https://ui-avatars.com/api/?name=${initials}&background=random`;
                }
                
                // Show modal
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
                
                // Add event listener for closing the modal
                const closeModal = function() {
                    modal.style.display = 'none';
                    document.body.style.overflow = ''; // Restore scrolling
                };
                
                // Close when clicking the close button
                document.querySelector('.close-modal').onclick = closeModal;
                
                // Close when clicking outside the modal
                window.onclick = function(event) {
                    if (event.target === modal) {
                        closeModal();
                    }
                };
                
                // Close when pressing Escape key
                document.onkeydown = function(event) {
                    if (event.key === 'Escape') {
                        closeModal();
                    }
                };
            } else {
                console.error('Error loading feedback details:', result.message);
                alert('Failed to load feedback details. Please try again.');
            }
        } catch (error) {
            console.error('Error loading feedback details:', error);
            alert('An error occurred while loading feedback details. Please try again.');
        }
    }

    // Add event listener for view details buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-details')) {
            const button = e.target.closest('.view-details');
            const feedbackId = button.getAttribute('data-id');
            showFeedbackDetails(feedbackId);
        }
    });

    // Close modal functionality
    document.querySelectorAll('.close-modal, .close').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('feedbackDetailModal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === document.getElementById('feedbackDetailModal')) {
            document.getElementById('feedbackDetailModal').style.display = 'none';
        }
    });
});