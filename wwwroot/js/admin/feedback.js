document.addEventListener('DOMContentLoaded', function() {
    // Sample data for modals
    const feedbackData = {
        1: {
            userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
            userName: "Pradeep Kumar Singh",
            userUnit: "Unit 12B",
            facility: "Function Hall",
            rating: "★★★★★ (5/5)",
            date: "May 15, 2023",
            status: "Published",
            fullText: "Perfect for our wedding! The staff went above and beyond to make our special day memorable. The hall was beautifully decorated exactly as we requested. The sound system was excellent, and the catering area was well-organized. We couldn't have asked for a better venue for our wedding reception."
        },
        2: {
            userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
            userName: "Priya Sharma",
            userUnit: "Unit 5C",
            facility: "Swimming Pool",
            rating: "★★★☆☆ (3/5)",
            date: "May 14, 2023",
            status: "Pending",
            fullText: "Water was too cold and the pool wasn't cleaned properly. There were leaves floating in the water and the tiles around the pool were slippery. The lifeguard wasn't very attentive either. I hope management can improve the maintenance and temperature control of the pool."
        },
        3: {
            userAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
            userName: "Rahul Mehta",
            userUnit: "Unit 8A",
            facility: "Gym Facility",
            rating: "★★★★☆ (4/5)",
            date: "May 12, 2023",
            status: "Published",
            fullText: "Good equipment but needs more maintenance. Some of the treadmill belts are wearing out and a few weight machines make strange noises. The space is well-organized though and there's a good variety of equipment. The air conditioning works well which is important for a workout space."
        }
    };

    const complaintData = {
        101: {
            userAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
            userName: "Neha Gupta",
            userUnit: "Unit 9D",
            serviceType: "House Cleaning",
            severity: "High",
            date: "May 15, 2023",
            status: "Open",
            fullText: "Incomplete cleaning service. The cleaners only vacuumed the living room and didn't touch the bedrooms or bathrooms as promised. The kitchen counters were wiped but the stove wasn't cleaned. I paid for a full cleaning service but only received partial service.",
            resolutionNotes: ""
        },
        102: {
            userAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
            userName: "Vikram Patel",
            userUnit: "Unit 3B",
            serviceType: "Garden Maintenance",
            severity: "Medium",
            date: "May 14, 2023",
            status: "In Progress",
            fullText: "Overgrown bushes blocking pathway. The shrubs near the entrance to my unit have grown so much that they're obstructing the walkway. It's becoming difficult to get through, especially with packages. This also creates a security concern as it provides hiding spots near the entrance.",
            resolutionNotes: "Gardening team scheduled for tomorrow morning to trim the bushes."
        },
        103: {
            userAvatar: "https://randomuser.me/api/portraits/women/63.jpg",
            userName: "Ananya Reddy",
            userUnit: "Unit 7E",
            serviceType: "Safety Inspection",
            severity: "High",
            date: "May 10, 2023",
            status: "Resolved",
            fullText: "Fire extinguisher expired in common area. I noticed that the fire extinguisher on the 7th floor near the elevators has an expiration date from last month. This is a serious safety concern that needs immediate attention. All fire safety equipment should be regularly inspected and maintained.",
            resolutionNotes: "Expired extinguisher replaced on May 11. All other extinguishers in the building checked and found to be in compliance."
        }
    };

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
        }
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Modal functionality
    const modals = {
        feedback: document.getElementById('feedbackDetailModal'),
        complaint: document.getElementById('complaintDetailModal')
    };
    
    const closeButtons = document.querySelectorAll('.close, .close-modal');
    
    // Open modals when clicking view buttons
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const id = this.getAttribute('data-id');
            
            if (type === 'feedback' && feedbackData[id]) {
                openFeedbackModal(id);
            } else if (type === 'complaint' && complaintData[id]) {
                openComplaintModal(id);
            }
        });
    });
    
    function openFeedbackModal(id) {
        const data = feedbackData[id];
        if (!data) return;
        
        document.getElementById('feedbackUserAvatar').src = data.userAvatar;
        document.getElementById('feedbackUserName').textContent = data.userName;
        document.getElementById('feedbackUserUnit').textContent = data.userUnit;
        document.getElementById('feedbackFacility').textContent = data.facility;
        document.getElementById('feedbackRating').textContent = data.rating;
        document.getElementById('feedbackDate').textContent = data.date;
        document.getElementById('feedbackStatus').textContent = data.status;
        document.getElementById('feedbackFullText').textContent = data.fullText;
        
        // Set the delete button data-id
        document.getElementById('deleteFeedbackBtn').setAttribute('data-id', id);
        
        // Show the modal
        modals.feedback.classList.add('show');
    }
    
    function openComplaintModal(id) {
        const data = complaintData[id];
        if (!data) return;
        
        document.getElementById('complaintUserAvatar').src = data.userAvatar;
        document.getElementById('complaintUserName').textContent = data.userName;
        document.getElementById('complaintUserUnit').textContent = data.userUnit;
        document.getElementById('complaintServiceType').textContent = data.serviceType;
        document.getElementById('complaintSeverity').textContent = data.severity;
        document.getElementById('complaintDate').textContent = data.date;
        document.getElementById('complaintStatus').textContent = data.status;
        document.getElementById('complaintFullText').textContent = data.fullText;
        document.getElementById('resolutionNotes').value = data.resolutionNotes || '';
        
        // Set the resolve button data-id
        document.getElementById('resolveComplaintBtn').setAttribute('data-id', id);
        
        // Show resolution section only if not resolved
        const resolutionSection = document.getElementById('resolutionSection');
        if (data.status === 'Resolved') {
            resolutionSection.style.display = 'none';
            document.getElementById('resolveComplaintBtn').style.display = 'none';
        } else {
            resolutionSection.style.display = 'block';
            document.getElementById('resolveComplaintBtn').style.display = 'inline-block';
        }
        
        // Show the modal
        modals.complaint.classList.add('show');
    }
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    function closeAllModals() {
        Object.values(modals).forEach(modal => {
            modal.classList.remove('show');
        });
    }
    
    // Delete feedback
    document.getElementById('deleteFeedbackBtn')?.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this feedback?')) {
            // In a real app, you would send a request to your server here
            console.log(`Deleting feedback with ID: ${id}`);
            alert('Feedback deleted successfully!');
            closeAllModals();
            
            // Remove the row from the table
            const row = document.querySelector(`.delete-feedback[data-id="${id}"]`)?.closest('tr');
            if (row) {
                row.remove();
            }
        }
    });
    
    // Approve feedback
    document.getElementById('approveFeedbackBtn')?.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        // In a real app, you would send a request to your server here
        console.log(`Approving feedback with ID: ${id}`);
        alert('Feedback approved and published!');
        closeAllModals();
        
        // Update the status in the table
        const statusBadge = document.querySelector(`.delete-feedback[data-id="${id}"]`)?.closest('tr')?.querySelector('.badge');
        if (statusBadge) {
            statusBadge.textContent = 'Published';
            statusBadge.className = 'badge success';
        }
    });
    
    // Resolve complaint
    document.getElementById('resolveComplaintBtn')?.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const resolutionNotes = document.getElementById('resolutionNotes').value;
        
        if (!resolutionNotes.trim()) {
            alert('Please enter resolution notes before marking as resolved.');
            return;
        }
        
        // In a real app, you would send a request to your server here
        console.log(`Resolving complaint with ID: ${id}`, { resolutionNotes });
        alert('Complaint marked as resolved!');
        closeAllModals();
        
        // Update the status in the table
        const row = document.querySelector(`.resolve-complaint[data-id="${id}"]`)?.closest('tr');
        if (row) {
            const statusBadge = row.querySelector('.badge');
            if (statusBadge) {
                statusBadge.textContent = 'Resolved';
                statusBadge.className = 'badge success';
            }
        }
    });
    
    // Delete feedback from table (without opening modal)
    document.querySelectorAll('.delete-feedback').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this feedback?')) {
                // In a real app, you would send a request to your server here
                console.log(`Deleting feedback with ID: ${id}`);
                this.closest('tr').remove();
                alert('Feedback deleted successfully!');
            }
        });
    });
    
    // Resolve complaint from table (without opening modal)
    document.querySelectorAll('.resolve-complaint').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.getAttribute('data-id');
            if (confirm('Are you sure you want to mark this complaint as resolved?')) {
                // In a real app, you would send a request to your server here
                console.log(`Resolving complaint with ID: ${id}`);
                const row = this.closest('tr');
                if (row) {
                    const statusBadge = row.querySelector('.badge');
                    if (statusBadge) {
                        statusBadge.textContent = 'Resolved';
                        statusBadge.className = 'badge success';
                    }
                }
                alert('Complaint marked as resolved!');
            }
        });
    });
    
    // Filter functionality
    document.getElementById('facilityFilter')?.addEventListener('change', function() {
        const facility = this.value;
        const rows = document.querySelectorAll('#facility-feedback tbody tr');
        
        rows.forEach(row => {
            const rowFacility = row.querySelector('td:nth-child(2)').textContent;
            if (facility === 'all' || rowFacility === facility) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
    
    document.getElementById('statusFilter')?.addEventListener('change', function() {
        const status = this.value;
        const rows = document.querySelectorAll('#service-complaints tbody tr');
        
        rows.forEach(row => {
            const rowStatus = row.querySelector('td:nth-child(6) .badge').textContent;
            const statusMatch = 
                (status === 'all') ||
                (status === 'open' && rowStatus === 'Open') ||
                (status === 'in-progress' && rowStatus === 'In Progress') ||
                (status === 'resolved' && rowStatus === 'Resolved');
            
            if (statusMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
    
    document.getElementById('serviceTypeFilter')?.addEventListener('change', function() {
        const serviceType = this.value;
        const rows = document.querySelectorAll('#service-complaints tbody tr');
        
        rows.forEach(row => {
            const rowServiceType = row.querySelector('td:nth-child(2)').textContent;
            if (serviceType === 'all' || rowServiceType === serviceType) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
    
    // Pagination
    document.querySelectorAll('.pagination button').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                const paginationContainer = this.closest('.pagination');
                if (paginationContainer) {
                    const activeButton = paginationContainer.querySelector('button.active');
                    if (activeButton) {
                        activeButton.classList.remove('active');
                    }
                }
                this.classList.add('active');
                // In a real app, you would load the corresponding page of data here
                console.log('Page changed to:', this.textContent.trim());
            }
        });
    });
    
    // Initialize with first tab active
    switchTab('facility-feedback');
});