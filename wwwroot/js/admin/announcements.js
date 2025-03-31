document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const createModal = document.getElementById('createAnnouncementModal');
    const viewModal = document.getElementById('viewAnnouncementModal');
    
    // Show Create Modal
    document.getElementById('createAnnouncementBtn').addEventListener('click', function() {
        // Reset form and set to create mode
        document.getElementById('announcementForm').reset();
        document.getElementById('announcementId').value = '';
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
    
    // View Announcement Button Click
    document.querySelectorAll('.btn-icon.view').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const title = row.cells[0].textContent;
            const content = row.cells[1].textContent.replace('...', '');
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
            const isEditMode = document.getElementById('announcementId').value !== '';
            const action = isEditMode ? 'updated' : 'created';
            
            // In a real app, you would send this data to the server here
            const announcementData = {
                id: document.getElementById('announcementId').value || Date.now().toString(),
                title: document.getElementById('announcementTitle').value,
                content: document.getElementById('announcementContent').value,
                startDate: document.getElementById('announcementStartDate').value,
                endDate: document.getElementById('announcementEndDate').value || 'Ongoing',
                priority: document.getElementById('announcementPriority').value,
                notify: document.getElementById('sendNotification').checked
            };
            
            console.log('Announcement data:', announcementData); // For debugging
            
            alert(`Announcement ${action} successfully!`);
            createModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            
            if (isEditMode) {
                // Update the table row with new data
                updateAnnouncementInTable(announcementData);
            } else {
                // Add new announcement to table
                addAnnouncementToTable(announcementData);
            }
            
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
                const announcementId = row.getAttribute('data-id');
                
                // In a real app, you would send a delete request to the server here
                console.log('Deleting announcement with ID:', announcementId);
                
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
            const announcementId = row.getAttribute('data-id');
            const title = row.cells[0].textContent;
            const content = row.cells[1].textContent.replace('...', '');
            const startDate = row.querySelector('td[data-date]').getAttribute('data-date');
            const endDate = row.querySelectorAll('td[data-date]')[1].getAttribute('data-date');
            const status = row.cells[5].textContent.trim();
            
            // Set modal to edit mode
            document.querySelector('#createAnnouncementModal .modal-title').textContent = 'Edit Announcement';
            document.getElementById('saveAnnouncement').textContent = 'Update Announcement';
            document.getElementById('announcementId').value = announcementId;
            
            // Populate form fields
            document.getElementById('announcementTitle').value = title;
            document.getElementById('announcementContent').value = content;
            document.getElementById('announcementStartDate').value = startDate;
            document.getElementById('announcementEndDate').value = endDate;
            
            // Set priority based on status (simplified)
            if (status === 'Active') {
                document.getElementById('announcementPriority').value = 'high';
            } else {
                document.getElementById('announcementPriority').value = 'normal';
            }
            
            // Show modal
            createModal.style.display = 'block';
            document.body.classList.add('modal-open');
        });
    });

    // Helper function to update announcement in table
    function updateAnnouncementInTable(data) {
        const row = document.querySelector(`tr[data-id="${data.id}"]`);
        if (row) {
            row.cells[0].textContent = data.title;
            row.cells[1].textContent = data.content.length > 50 ? 
                data.content.substring(0, 50) + '...' : data.content;
            
            // Format dates for display
            const startDate = new Date(data.startDate);
            const endDate = data.endDate === 'Ongoing' ? 'Ongoing' : new Date(data.endDate);
            
            row.querySelector('td[data-date]').textContent = formatDateForDisplay(startDate);
            row.querySelector('td[data-date]').setAttribute('data-date', data.startDate);
            
            const endDateCell = row.querySelectorAll('td[data-date]')[1];
            endDateCell.textContent = data.endDate === 'Ongoing' ? 'Ongoing' : formatDateForDisplay(endDate);
            endDateCell.setAttribute('data-date', data.endDate);
            
            // Update status
            const today = new Date();
            const statusCell = row.cells[5];
            if (data.endDate === 'Ongoing' || new Date(data.endDate) > today) {
                statusCell.innerHTML = '<span class="status-badge active">Active</span>';
            } else {
                statusCell.innerHTML = '<span class="status-badge expired">Expired</span>';
            }
        }
    }

    // Helper function to add new announcement to table
    function addAnnouncementToTable(data) {
        const tbody = document.querySelector('.announcements-table tbody');
        const newId = data.id;
        
        const newRow = document.createElement('tr');
        newRow.setAttribute('data-id', newId);
        
        // Format dates for display
        const startDate = new Date(data.startDate);
        const endDate = data.endDate === 'Ongoing' ? 'Ongoing' : new Date(data.endDate);
        
        // Determine status
        const today = new Date();
        const isActive = data.endDate === 'Ongoing' || new Date(data.endDate) > today;
        
        newRow.innerHTML = `
            <td>${data.title}</td>
            <td class="truncate">${data.content.length > 50 ? data.content.substring(0, 50) + '...' : data.content}</td>
            <td>Current User</td>
            <td data-date="${data.startDate}">${formatDateForDisplay(startDate)}</td>
            <td data-date="${data.endDate}">${data.endDate === 'Ongoing' ? 'Ongoing' : formatDateForDisplay(endDate)}</td>
            <td><span class="status-badge ${isActive ? 'active' : 'expired'}">${isActive ? 'Active' : 'Expired'}</span></td>
            <td class="actions">
                <button class="btn-icon edit" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete" title="Delete"><i class="fas fa-trash-alt"></i></button>
                <button class="btn-icon view" title="View"><i class="fas fa-eye"></i></button>
            </td>
        `;
        
        tbody.insertBefore(newRow, tbody.firstChild);
        
        // Reattach event listeners to new buttons
        attachEventListenersToRow(newRow);
    }

    // Helper function to format date for display
    function formatDateForDisplay(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Helper function to attach event listeners to a table row
    function attachEventListenersToRow(row) {
        row.querySelector('.btn-icon.view').addEventListener('click', function() {
            const row = this.closest('tr');
            const title = row.cells[0].textContent;
            const content = row.cells[1].textContent.replace('...', '');
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
        
        row.querySelector('.btn-icon.edit').addEventListener('click', function() {
            const row = this.closest('tr');
            const announcementId = row.getAttribute('data-id');
            const title = row.cells[0].textContent;
            const content = row.cells[1].textContent.replace('...', '');
            const startDate = row.querySelector('td[data-date]').getAttribute('data-date');
            const endDate = row.querySelectorAll('td[data-date]')[1].getAttribute('data-date');
            const status = row.cells[5].textContent.trim();
            
            document.querySelector('#createAnnouncementModal .modal-title').textContent = 'Edit Announcement';
            document.getElementById('saveAnnouncement').textContent = 'Update Announcement';
            document.getElementById('announcementId').value = announcementId;
            
            document.getElementById('announcementTitle').value = title;
            document.getElementById('announcementContent').value = content;
            document.getElementById('announcementStartDate').value = startDate;
            document.getElementById('announcementEndDate').value = endDate;
            
            if (status === 'Active') {
                document.getElementById('announcementPriority').value = 'high';
            } else {
                document.getElementById('announcementPriority').value = 'normal';
            }
            
            createModal.style.display = 'block';
            document.body.classList.add('modal-open');
        });
        
        row.querySelector('.btn-icon.delete').addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this announcement?')) {
                const row = this.closest('tr');
                const announcementId = row.getAttribute('data-id');
                
                console.log('Deleting announcement with ID:', announcementId);
                
                row.style.opacity = '0.5';
                setTimeout(() => {
                    row.remove();
                    alert('Announcement deleted successfully!');
                }, 300);
            }
        });
    }

    // Initialize date pickers with today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('announcementStartDate').value = today;
});