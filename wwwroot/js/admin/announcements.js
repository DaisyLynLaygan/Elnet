document.addEventListener('DOMContentLoaded', function() {
    const createModal = document.getElementById('createAnnouncementModal');
    const viewModal = document.getElementById('viewAnnouncementModal');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    
    document.getElementById('createAnnouncementBtn').addEventListener('click', function() {
        resetAnnouncementForm();
        showModal(createModal);
    });
    
    document.getElementById('closeCreateModal').addEventListener('click', function() {
        hideModal(createModal);
    });
    
    document.getElementById('cancelAnnouncement').addEventListener('click', function() {
        hideModal(createModal);
    });
    
    document.querySelectorAll('.btn-icon.view').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            populateViewModal(row);
            showModal(viewModal);
        });
    });
    
    document.getElementById('closeViewModal').addEventListener('click', function() {
        hideModal(viewModal);
    });
    
    document.getElementById('closeViewModalBtn').addEventListener('click', function() {
        hideModal(viewModal);
    });
    
    document.querySelectorAll('.btn-icon.delete').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const announcementId = row.getAttribute('data-id');
            const announcementTitle = row.cells[0].textContent;
            showDeleteConfirmation(announcementId, announcementTitle);
        });
    });
    
    document.getElementById('closeDeleteModal').addEventListener('click', function() {
        hideModal(deleteConfirmModal);
    });
    
    document.getElementById('cancelDelete').addEventListener('click', function() {
        hideModal(deleteConfirmModal);
    });
    
    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
        const announcementId = deleteConfirmModal.getAttribute('data-id');
        deleteAnnouncement(announcementId);
    });
    
    document.querySelectorAll('.btn-icon.edit').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const announcementId = row.getAttribute('data-id');
            getAnnouncementForEdit(announcementId);
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            hideModal(createModal);
            hideModal(viewModal);
            hideModal(deleteConfirmModal);
        }
    });
    
    document.getElementById('announcementForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveAnnouncement();
    });
    
    function resetAnnouncementForm() {
        document.getElementById('announcementForm').reset();
        document.getElementById('announcementId').value = '';
        document.querySelector('#createAnnouncementModal .modal-title').textContent = 'Create New Announcement';
        document.getElementById('saveAnnouncement').textContent = 'Publish Announcement';
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('announcementStartDate').value = today;
        document.getElementById('announcementEndDate').value = '';
        document.getElementById('announcementPriority').value = 'normal';
        document.getElementById('sendNotification').checked = false;
    }
    
    function populateViewModal(row) {
        const title = row.cells[0].textContent;
        const content = row.cells[1].textContent.replace('...', '');
        const author = row.cells[2].textContent;
        const date = row.cells[3].textContent;
        const expiry = row.cells[4].textContent;
        const priority = row.cells[5].querySelector('.status-badge').textContent.toLowerCase();
        
        document.getElementById('viewAnnouncementTitle').textContent = title;
        document.getElementById('viewAnnouncementContent').textContent = content;
        document.getElementById('viewAnnouncementAuthor').textContent = author;
        document.getElementById('viewAnnouncementDate').textContent = date;
        document.getElementById('viewAnnouncementExpiry').textContent = expiry;
        document.getElementById('viewAnnouncementPriority').textContent = priority;
        document.getElementById('viewAnnouncementPriority').className = 'badge ' + 
            (priority === 'urgent' ? 'badge-danger' : 
             priority === 'high' ? 'badge-warning' : 'badge-primary');
    }
    
    function getAnnouncementForEdit(announcementId) {
        fetch('/Admin/GetAnnouncementById', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: announcementId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelector('#createAnnouncementModal .modal-title').textContent = 'Edit Announcement';
                document.getElementById('saveAnnouncement').textContent = 'Update Announcement';
                document.getElementById('announcementId').value = data.announcement.announcement_id;
                document.getElementById('announcementTitle').value = data.announcement.title;
                document.getElementById('announcementContent').value = data.announcement.content;
                document.getElementById('announcementStartDate').value = data.announcement.start_date;
                document.getElementById('announcementEndDate').value = data.announcement.end_date;
                document.getElementById('announcementPriority').value = data.announcement.priority;
                showModal(createModal);
            } else {
                showAlert(data.message, 'danger');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('An error occurred while fetching announcement', 'danger');
        });
    }
    
    function showDeleteConfirmation(id, title) {
        const modalBody = document.getElementById('deleteConfirmBody');
        modalBody.innerHTML = `
            <p>Are you sure you want to delete the announcement <strong>"${title}"</strong>?</p>
            <p class="text-danger">This action cannot be undone.</p>
        `;
        deleteConfirmModal.setAttribute('data-id', id);
        showModal(deleteConfirmModal);
    }
    
    function showModal(modal) {
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }
    
    function hideModal(modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    
    function saveAnnouncement() {
        const form = document.getElementById('announcementForm');
        const announcementId = document.getElementById('announcementId').value;
        
        if (form.checkValidity()) {
            const formData = {
                announcementId: announcementId,
                title: document.getElementById('announcementTitle').value,
                content: document.getElementById('announcementContent').value,
                start_date: document.getElementById('announcementStartDate').value,
                end_date: document.getElementById('announcementEndDate').value || null,
                priority: document.getElementById('announcementPriority').value
            };
            
            const url = announcementId ? '/Admin/UpdateAnnouncement' : '/Admin/AddAnnouncement';
            const method = 'POST';
            
            if (announcementId) {
                fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        announcement_id: parseInt(announcementId),
                        title: formData.title,
                        content: formData.content,
                        start_date: formData.start_date,
                        end_date: formData.end_date,
                        priority: formData.priority
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.reload();
                    } else {
                        showAlert(data.message, 'danger');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showAlert('An error occurred while saving the announcement', 'danger');
                });
            } else {
                form.submit();
            }
        } else {
            form.reportValidity();
        }
    }
    
    function deleteAnnouncement(announcementId) {
        fetch('/Admin/DeleteAnnouncement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: announcementId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const row = document.querySelector(`tr[data-id="${announcementId}"]`);
                if (row) {
                    row.remove();
                    showAlert('Announcement deleted successfully!', 'success');
                }
            } else {
                showAlert(data.message, 'danger');
            }
            hideModal(deleteConfirmModal);
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('An error occurred while deleting the announcement', 'danger');
            hideModal(deleteConfirmModal);
        });
    }
    
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} fixed-alert`;
        alert.textContent = message;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('announcementStartDate').value = today;
});