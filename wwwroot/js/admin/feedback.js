document.addEventListener('DOMContentLoaded', function() {
    // Global variables for pagination
    let currentFeedbackPage = 1;
    let currentComplaintsPage = 1;
    const pageSize = 5;

    // Load feedback data on page load
    loadFeedback();

    // List of swear words to censor (can be expanded)
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
        if (!text) return text;
        
        let censoredText = text;
        swearWords.forEach(word => {
            const regex = new RegExp(word, 'gi');
            censoredText = censoredText.replace(regex, '*'.repeat(word.length));
        });
        return censoredText;
    }

    // Tab functionality
    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.feedback-content');
    
    function switchTab(tabId) {
        // First hide all content sections with a fade out effect
        tabContents.forEach(content => {
            content.style.opacity = '0';
            setTimeout(() => {
                content.style.display = 'none';
            }, 300); // Match this with CSS transition time
        });

        // Remove active class from all tabs
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to clicked tab
        const selectedTab = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Show selected content with fade in effect
        const selectedContent = document.getElementById(tabId);
        if (selectedContent) {
            setTimeout(() => {
                selectedContent.style.display = 'block';
                // Force a reflow
                selectedContent.offsetHeight;
                selectedContent.style.opacity = '1';
                selectedContent.classList.add('active');

                // Load appropriate data
                if (tabId === 'facility-feedback') {
                    loadFeedback();
                } else if (tabId === 'service-complaints') {
                    loadComplaints();
                }
            }, 300); // Match this with CSS transition time
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

        if (!feedbacks || feedbacks.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="7" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-comments"></i>
                        <h3>No Feedback Yet</h3>
                        <p>There are no feedback entries to display.</p>
                    </div>
                </td>
            `;
            tbody.appendChild(emptyRow);
            return;
        }

        feedbacks.forEach(feedback => {
            // Format date
            const date = new Date(feedback.created_date);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="feedback-user">
                        <div class="feedback-user-info">
                            <h4>${feedback.user?.name || 'N/A'}</h4>
                            <p>${feedback.user?.unit || 'N/A'}</p>
                        </div>
                    </div>
                </td>
                <td>${feedback.facility?.name || 'N/A'}</td>
                <td>
                    <div class="rating-stars">${generateStarRating(feedback.overall_rating || 0)}</div>
                </td>
                <td>
                    <div class="table-feedback-content">
                        <div class="table-review-title">${censorText(feedback.title) || 'No Title'}</div>
                        <div class="table-review-comment">${censorText(feedback.comment) || 'No Comment'}</div>
                    </div>
                </td>
                <td>${formattedDate}</td>
                <td><span class="badge ${feedback.status?.toLowerCase() || 'default'}">${feedback.status || 'N/A'}</span></td>
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
                            <h4>${complaint.user?.name || 'N/A'}</h4>
                            <p>${complaint.user?.unit || 'N/A'}</p>
                        </div>
                    </div>
                </td>
                <td>${complaint.service_type || 'N/A'}</td>
                <td>${censorText(complaint.title) || 'N/A'}</td>
                <td><span class="badge ${getSeverityClass(complaint.severity || 'low')}">${complaint.severity || 'N/A'}</span></td>
                <td>${complaint.date_created || 'N/A'}</td>
                <td><span class="badge ${getStatusClass(complaint.status || 'open')}">${complaint.status || 'N/A'}</span></td>
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
            prevButton.classList.add('pagination-btn');
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
            pageButton.classList.add('pagination-btn');
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
            nextButton.classList.add('pagination-btn');
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
            prevButton.classList.add('pagination-btn');
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
            pageButton.classList.add('pagination-btn');
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
            nextButton.classList.add('pagination-btn');
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
                
                if (!modal) {
                    console.error('Modal element not found');
                    return;
                }
                
                // Format date
                const date = new Date(feedback.created_date);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                // Helper function to safely set text content
                function setTextContent(elementId, text) {
                    const element = document.getElementById(elementId);
                    if (element) {
                        element.textContent = text || 'N/A';
                    }
                }
                
                // Set modal content safely
                setTextContent('feedbackUserName', feedback.user?.name);
                setTextContent('feedbackUserUnit', feedback.user?.unit);
                setTextContent('feedbackFacility', feedback.facility?.name);
                setTextContent('feedbackDate', formattedDate);
                setTextContent('feedbackStatus', feedback.status);
                setTextContent('feedbackFullText', feedback.comment || 'No comment provided');
                
                // Set rating safely
                const ratingElement = document.getElementById('feedbackRating');
                if (ratingElement) {
                    ratingElement.innerHTML = generateStarRating(feedback.overall_rating || 0);
                }
                
                // Set user avatar safely
                const userAvatar = document.getElementById('feedbackUserAvatar');
                if (userAvatar) {
                    if (feedback.user?.avatar) {
                        userAvatar.src = feedback.user.avatar;
                    } else {
                        const initials = (feedback.user?.name || 'NA').split(' ').map(n => n[0]).join('');
                        userAvatar.src = `https://ui-avatars.com/api/?name=${initials}&background=random`;
                    }
                }
                
                // Show modal
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
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
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === document.getElementById('feedbackDetailModal')) {
            document.getElementById('feedbackDetailModal').style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    });
});