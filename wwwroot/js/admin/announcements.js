document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const createModal = document.getElementById('createAnnouncementModal');
    const viewModal = document.getElementById('viewAnnouncementModal');
    
    // Show Create Modal
    document.getElementById('createAnnouncementBtn').addEventListener('click', function() {
        // Reset form and title when creating new
        document.getElementById('announcementForm').reset();
        document.querySelector('#createAnnouncementModal .modal-title').textContent = 'Create New Announcement';
        document.getElementById('saveAnnouncement').textContent = 'Publish Announcement';
        
        // Set today's date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('announcementStartDate').value = today;
        
        createModal.style.display = 'block';
        document.body.classList.add('modal-open');
    });
    
    // Close Create Modal
    document.getElementById('closeCreateModal').addEventListener('click', function() {
        createModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });
    
    document.getElementById('cancelCreateAnnouncement').addEventListener('click', function() {
        createModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });
    
    // View Announcement Button Click
    document.querySelectorAll('.btn-icon.view').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const title = row.cells[0].textContent;
            const content = row.cells[1].textContent + '...'; // In real app, get full content
            const author = row.cells[2].textContent;
            const date = row.cells[3].textContent;
            const expiry = row.cells[4].textContent;
            
            document.getElementById('viewAnnouncementTitle').textContent = title;
            document.getElementById('viewAnnouncementContent').textContent = content;
            document.getElementById('viewAnnouncementAuthor').textContent = author;
            document.getElementById('viewAnnouncementDate').textContent = date;
            document.getElementById('viewAnnouncementExpiry').textContent = expiry;
            
            viewModal.style.display = 'block';
            document.body.classList.add('modal-open');
        });
    });
    
    // Close View Modal
    document.getElementById('closeViewModal').addEventListener('click', function() {
        viewModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });
    
    document.getElementById('closeViewModalBtn').addEventListener('click', function() {
        viewModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === createModal) {
            createModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
        if (event.target === viewModal) {
            viewModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });

    // Save Announcement Button
    document.getElementById('saveAnnouncement').addEventListener('click', function() {
        const form = document.getElementById('announcementForm');
        if (form.checkValidity()) {
            const action = this.textContent.includes('Update') ? 'updated' : 'created';
            alert(`Announcement ${action} successfully!`);
            createModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            form.reset();
        } else {
            form.reportValidity();
        }
    });

    // Delete Button
    document.querySelectorAll('.btn-icon.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this announcement?')) {
                const row = this.closest('tr');
                row.style.opacity = '0.5';
                setTimeout(() => {
                    row.remove();
                    alert('Announcement deleted successfully!');
                }, 300);
            }
        });
    });

    // Edit Button
    document.querySelectorAll('.btn-icon.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const title = row.cells[0].textContent;
            const content = row.cells[1].textContent;
            const datePosted = row.cells[3].textContent;
            const expiryDate = row.cells[4].textContent;
            
            // Set modal title and button text
            document.querySelector('#createAnnouncementModal .modal-title').textContent = 'Edit Announcement';
            document.getElementById('saveAnnouncement').textContent = 'Update Announcement';
            
            // Populate form fields
            document.getElementById('announcementTitle').value = title;
            document.getElementById('announcementContent').value = content.replace('...', '');
            
            // Format dates (this is simplified - in a real app you'd parse the dates properly)
            document.getElementById('announcementStartDate').value = formatDateForInput(datePosted);
            
            if (expiryDate !== 'Ongoing') {
                document.getElementById('announcementEndDate').value = formatDateForInput(expiryDate);
            } else {
                document.getElementById('announcementEndDate').value = '';
            }
            
            // Show modal
            createModal.style.display = 'block';
            document.body.classList.add('modal-open');
        });
    });

    // Helper function to format date for input field (simplified)
    function formatDateForInput(dateString) {
        // This is a simplified version - in a real app you'd use proper date parsing
        if (dateString.includes('May')) {
            return '2023-05-' + (dateString.includes('15') ? '15' : '30');
        } else if (dateString.includes('June')) {
            return '2023-06-05';
        } else if (dateString.includes('April')) {
            return '2023-04-28';
        }
        return new Date().toISOString().split('T')[0];
    }

    // Initialize date pickers with today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('announcementStartDate').value = today;
});