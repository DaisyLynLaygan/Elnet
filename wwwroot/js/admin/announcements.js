document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const modals = {
        create: document.getElementById('createAnnouncementModal'),
        view: document.getElementById('viewAnnouncementModal'),
        edit: document.getElementById('editAnnouncementModal')
    };
    
    // Current announcement being edited/deleted
    let currentAnnouncementId = null;

    // Show SweetAlert notification
    function showAlert(message, type = 'success', callback = null) {
        return Swal.fire({
            icon: type,
            title: message,
            showConfirmButton: true,
            timer: 3000
        }).then((result) => {
            if (callback && (result.isConfirmed || result.isDismissed)) {
                callback();
            }
        });
    }

    // Modal functions
    function openModal(modal) {
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }
    
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    
    // Close modals when clicking X or close button
    document.getElementById('closeCreateModal').addEventListener('click', () => closeModal(modals.create));
    document.getElementById('closeEditModal').addEventListener('click', () => closeModal(modals.edit));
    document.getElementById('closeViewModal').addEventListener('click', () => closeModal(modals.view));
    document.getElementById('closeViewModalBtn').addEventListener('click', () => closeModal(modals.view));
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Create announcement button
    document.getElementById('createAnnouncementBtn').addEventListener('click', function() {
        resetCreateForm();
        openModal(modals.create);
    });
    
    // Cancel buttons
    document.getElementById('cancelCreateAnnouncement').addEventListener('click', () => {
        closeModal(modals.create);
    });
    
    document.getElementById('cancelEditAnnouncement').addEventListener('click', () => {
        closeModal(modals.edit);
    });
    
    // View announcement functionality
    document.querySelectorAll('.btn-icon.view').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            populateViewModal(row);
            openModal(modals.view);
        });
    });
    
    // Edit announcement functionality
    document.querySelectorAll('.btn-icon.edit').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            currentAnnouncementId = row.getAttribute('data-id');
            getAnnouncementForEdit(currentAnnouncementId);
        });
    });
    
    // Delete announcement functionality
    document.querySelectorAll('.btn-icon.delete').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            currentAnnouncementId = row.getAttribute('data-id');
            const announcementTitle = row.querySelector('[data-cell="Title"]').textContent;
            
            showDeleteConfirmation(announcementTitle);
        });
    });
    
    // Create announcement form submission
    document.getElementById('submitCreateAnnouncement').addEventListener('click', function() {
        saveAnnouncement();
    });
    
    // Edit announcement form submission
    document.getElementById('submitEditAnnouncement').addEventListener('click', function() {
        updateAnnouncement();
    });
    
    // Helper functions
    function resetCreateForm() {
        document.getElementById('createAnnouncementTitle').value = '';
        document.getElementById('createAnnouncementContent').value = '';
        document.getElementById('createAnnouncementPriority').value = 'normal';
        document.getElementById('createSendNotification').checked = false;
        
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('createAnnouncementStartDate').value = today;
        document.getElementById('createAnnouncementEndDate').value = '';
    }
    
    function populateViewModal(row) {
        document.getElementById('viewAnnouncementTitle').textContent = 
            row.querySelector('[data-cell="Title"]').textContent;
        document.getElementById('viewAnnouncementContent').textContent = 
            row.querySelector('[data-cell="Content"]').textContent;
        document.getElementById('viewAnnouncementAuthor').textContent = 
            row.querySelector('[data-cell="Author"]').textContent;
        document.getElementById('viewAnnouncementDate').textContent = 
            row.querySelector('[data-cell="Posted"]').textContent;
        document.getElementById('viewAnnouncementExpiry').textContent = 
            row.querySelector('[data-cell="Expires"]').textContent;
        
        const priority = row.querySelector('[data-cell="Status"]').textContent.trim().toLowerCase();
        const priorityBadge = document.getElementById('viewAnnouncementPriority');
        priorityBadge.textContent = priority;
        priorityBadge.className = 'badge ' + 
            (priority === 'urgent' ? 'badge-danger' : 
             priority === 'high' ? 'badge-warning' : 'badge-primary');
    }
    
    function getAnnouncementForEdit(id) {
        fetch('/Admin/GetAnnouncement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                document.getElementById('editAnnouncementId').value = data.announcement.announcement_id;
                document.getElementById('editAnnouncementTitle').value = data.announcement.title;
                document.getElementById('editAnnouncementContent').value = data.announcement.content;
                document.getElementById('editAnnouncementStartDate').value = data.announcement.start_date;
                document.getElementById('editAnnouncementEndDate').value = data.announcement.end_date || '';
                document.getElementById('editAnnouncementPriority').value = data.announcement.priority;
                
                openModal(modals.edit);
            } else {
                showAlert(data.message || 'Announcement not found', 'error');
            }
        })
        .catch(error => {
            showAlert('Error fetching announcement: ' + error.message, 'error');
        });
    }
    
    function showDeleteConfirmation(title) {
        Swal.fire({
            title: 'Delete Announcement?',
            html: `Are you sure you want to delete <strong>"${title}"</strong>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAnnouncement(currentAnnouncementId);
            }
        });
    }
    
    function saveAnnouncement() {
        const title = document.getElementById('createAnnouncementTitle').value;
        const content = document.getElementById('createAnnouncementContent').value;
        const startDate = document.getElementById('createAnnouncementStartDate').value;
        
        if (!title || !content || !startDate) {
            showAlert('Title, content and start date are required', 'error');
            return;
        }

        const formData = {
            title: title,
            content: content,
            start_date: startDate,
            end_date: document.getElementById('createAnnouncementEndDate').value || null,
            priority: document.getElementById('createAnnouncementPriority').value
        };

        fetch('/Admin/AddAnnouncement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                closeModal(modals.create);
                showAlert(data.message, 'success', () => {
                    window.location.reload();
                });
            } else {
                showAlert(data.message || 'Failed to create announcement', 'error');
            }
        })
        .catch(error => {
            showAlert('Error creating announcement: ' + error.message, 'error');
        });
    }
    
    function updateAnnouncement() {
        const title = document.getElementById('editAnnouncementTitle').value;
        const content = document.getElementById('editAnnouncementContent').value;
        const startDate = document.getElementById('editAnnouncementStartDate').value;
        
        if (!title || !content || !startDate) {
            showAlert('Title, content and start date are required', 'error');
            return;
        }

        const formData = {
            announcement_id: parseInt(document.getElementById('editAnnouncementId').value),
            title: title,
            content: content,
            start_date: startDate,
            end_date: document.getElementById('editAnnouncementEndDate').value || null,
            priority: document.getElementById('editAnnouncementPriority').value
        };

        fetch('/Admin/EditAnnouncement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                closeModal(modals.edit);
                showAlert(data.message, 'success', () => {
                    window.location.reload();
                });
            } else {
                showAlert(data.message || 'Failed to update announcement', 'error');
            }
        })
        .catch(error => {
            showAlert('Error updating announcement: ' + error.message, 'error');
        });
    }
    
    function deleteAnnouncement(id) {
        fetch('/Admin/DeleteAnnouncement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showAlert(data.message, 'success', () => {
                    window.location.reload();
                });
            } else {
                showAlert(data.message || 'Failed to delete announcement', 'error');
            }
        })
        .catch(error => {
            showAlert('Error deleting announcement: ' + error.message, 'error');
        });
    }
});