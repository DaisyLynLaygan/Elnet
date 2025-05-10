// Facility Reservations Manager
document.addEventListener('DOMContentLoaded', function() {
    console.log("Facility Reservations Manager loaded");
    
    // DOM elements
    const facilityTableBody = document.getElementById('facilityReservationsTable');
    const facilitySearch = document.getElementById('facility-search');
    const facilityFilter = document.getElementById('facility-filter');
    const facilityDetailsModal = document.getElementById('facilityDetailsModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const confirmBookingBtn = document.getElementById('confirmFacilityBookingBtn');
    
    // Pagination elements
    const facilityPrevBtn = document.querySelector('#facility-section .pagination-prev');
    const facilityNextBtn = document.querySelector('#facility-section .pagination-next');
    const facilityPageNumbers = document.querySelector('#facility-section .pagination-numbers');
    const facilityPaginationInfo = document.querySelector('#facility-section .pagination-info');
    
    // State management
    let facilityReservations = [];
    let currentFacilityPage = 1;
    let currentFacilityReservation = null;
    
    // Initialize
    fetchApprovedFacilityReservations();
    setupEventListeners();
    
    // Functions
    function setupEventListeners() {
        // Search input
        if (facilitySearch) {
            facilitySearch.addEventListener('input', function() {
                renderFacilityReservations(1, this.value, facilityFilter.value);
            });
        }
        
        // Filter dropdown
        if (facilityFilter) {
            facilityFilter.addEventListener('change', function() {
                renderFacilityReservations(1, facilitySearch.value, this.value);
            });
        }
        
        // Close modal buttons
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                closeModal(this.closest('.modal'));
            });
        });
        
        // Pagination buttons
        if (facilityPrevBtn) {
            facilityPrevBtn.addEventListener('click', function() {
                if (currentFacilityPage > 1) {
                    currentFacilityPage--;
                    renderFacilityReservations(currentFacilityPage, facilitySearch.value, facilityFilter.value);
                }
            });
        }
        
        if (facilityNextBtn) {
            facilityNextBtn.addEventListener('click', function() {
                const totalPages = Math.ceil(facilityReservations.length / 5);
                if (currentFacilityPage < totalPages) {
                    currentFacilityPage++;
                    renderFacilityReservations(currentFacilityPage, facilitySearch.value, facilityFilter.value);
                }
            });
        }
        
        // Confirm booking button
        if (confirmBookingBtn) {
            confirmBookingBtn.addEventListener('click', function() {
                confirmFacilityBooking();
            });
        }
        
        // Handle clicks outside modal
        window.addEventListener('click', function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    closeModal(modal);
                }
            });
        });
    }
    
    async function fetchApprovedFacilityReservations() {
        try {
            console.log("FACILITY FETCH: Starting to fetch approved facility reservations");
            showLoadingState(facilityTableBody);
            
            const response = await fetch('/Staff/GetApprovedFacilityReservations');
            const data = await response.json();
            
            console.log("FACILITY FETCH: API response received", data);
            
            if (data.success) {
                facilityReservations = data.reservations;
                populateFacilityFilter(facilityReservations);
                renderFacilityReservations(1);
                console.log('FACILITY FETCH: Loaded facility reservations:', facilityReservations.length);
            } else {
                showErrorState(facilityTableBody, data.message || 'Failed to load reservations');
                console.error('FACILITY FETCH: Failed to fetch facility reservations:', data.message);
            }
        } catch (error) {
            showErrorState(facilityTableBody, 'Error fetching reservations');
            console.error('FACILITY FETCH: Error fetching facility reservations:', error);
        }
    }
    
    function populateFacilityFilter(reservations) {
        if (!facilityFilter) {
            console.error("FILTER: Facility filter element not found");
            return;
        }
        
        console.log("FILTER: Populating facility filter with unique facilities");
        
        // Clear existing options except the first one (All Facilities)
        while (facilityFilter.options.length > 1) {
            facilityFilter.remove(1);
        }
        
        // Extract unique facility names from the reservations
        const facilities = [...new Set(reservations.map(r => r.facility))].sort();
        console.log("FILTER: Unique facilities found:", facilities);
        
        // Add options for each facility
        facilities.forEach(facility => {
            const option = document.createElement('option');
            option.value = facility;
            option.textContent = facility;
            facilityFilter.appendChild(option);
        });
        
        console.log("FILTER: Filter options added");
    }
    
    function renderFacilityReservations(page = 1, searchTerm = '', filterValue = 'all') {
        if (!facilityTableBody) {
            console.error("FACILITY RENDER: facilityTableBody not found");
            return;
        }
        
        console.log("FACILITY RENDER: Starting to render facility reservations");
        console.log("FACILITY RENDER: Available reservations:", facilityReservations.length);
        
        // Filter reservations based on search and filter
        let filteredReservations = facilityReservations.filter(res => {
            const matchesSearch = searchTerm === '' || 
                res.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                res.resident.toLowerCase().includes(searchTerm.toLowerCase()) || 
                res.facility.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesFilter = filterValue === 'all' || res.facility === filterValue;
            
            return matchesSearch && matchesFilter;
        });
        
        console.log("FACILITY RENDER: Filtered reservations:", filteredReservations.length);
        
        // Pagination logic
        const itemsPerPage = 5;
        const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const paginatedReservations = filteredReservations.slice(startIndex, startIndex + itemsPerPage);
        
        console.log("FACILITY RENDER: Paginated reservations:", paginatedReservations.length);
        
        // Clear table
        facilityTableBody.innerHTML = '';
        
        // Check if we have any reservations
        if (paginatedReservations.length === 0) {
            facilityTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <div class="no-data-message">
                            <i class="fas fa-calendar-times"></i>
                            <p>No approved facility reservations found</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Populate table
        paginatedReservations.forEach(reservation => {
            try {
                console.log("FACILITY RENDER: Rendering reservation:", reservation);
                
                const row = document.createElement('tr');
                row.dataset.id = reservation.id;
                
                // Determine which status badge to display
                let statusBadge = '';
                if (reservation.status === 'In Progress') {
                    statusBadge = '<span class="status-badge status-in-progress">In Progress</span>';
                } else if (reservation.status === 'Approved') {
                    statusBadge = '<span class="status-badge status-approved">Approved</span>';
                } else {
                    statusBadge = `<span class="status-badge">${reservation.status}</span>`;
                }
                
                row.innerHTML = `
                    <td>#${reservation.id}</td>
                    <td>${reservation.facility}</td>
                    <td>${reservation.resident}</td>
                    <td>${reservation.dateTime}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon view-details" title="View Details" data-action="view">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${reservation.status === 'Approved' ? `
                            <button class="btn-icon" title="Book Facility" data-action="book">
                                <i class="fas fa-calendar-check"></i>
                            </button>
                            ` : ''}
                        </div>
                    </td>
                `;
                
                facilityTableBody.appendChild(row);
                
                // Add event listeners to action buttons
                row.querySelectorAll('[data-action]').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const action = this.dataset.action;
                        const reservationId = this.closest('tr').dataset.id;
                        
                        if (action === 'view' || action === 'book') {
                            showFacilityDetails(reservationId);
                        }
                    });
                });
            } catch (error) {
                console.error("FACILITY RENDER: Error rendering reservation:", error);
            }
        });
        
        // Update pagination controls
        updatePaginationControls(
            page, 
            totalPages, 
            filteredReservations.length
        );
        
        // Add click event to rows
        facilityTableBody.querySelectorAll('tr').forEach(row => {
            row.addEventListener('click', function() {
                const reservationId = this.dataset.id;
                showFacilityDetails(reservationId);
            });
        });
        
        // Update current page
        currentFacilityPage = page;
        
        console.log("FACILITY RENDER: Finished rendering facility reservations");
    }
    
    function showFacilityDetails(reservationId) {
        console.log("FACILITY DETAILS: Showing details for reservation ID:", reservationId);
        
        const reservation = facilityReservations.find(r => r.id === reservationId);
        if (!reservation) {
            console.error("FACILITY DETAILS: Reservation not found with ID:", reservationId);
            return;
        }
        
        console.log("FACILITY DETAILS: Found reservation:", reservation);
        currentFacilityReservation = reservation;
        
        // Update modal content
        document.getElementById('facilityDetailsId').textContent = `Reservation #${reservation.id}`;
        document.getElementById('facilityDetailsStatus').innerHTML = 
            `<span class="status-badge status-approved">Approved</span>
             <span class="status-badge status-paid">${reservation.payment_status}</span>`;
        document.getElementById('facilityDetailsFacility').textContent = reservation.facility;
        document.getElementById('facilityDetailsResident').textContent = reservation.resident;
        document.getElementById('facilityDetailsDate').textContent = reservation.date;
        document.getElementById('facilityDetailsTime').textContent = `${reservation.time} (${reservation.duration} hours)`;
        document.getElementById('facilityDetailsGuests').textContent = reservation.guests;
        document.getElementById('facilityDetailsPurpose').textContent = reservation.purpose;
        document.getElementById('facilityDetailsAmount').textContent = reservation.amount;
        document.getElementById('facilityStaffNotes').value = reservation.notes || '';
        
        // Set default notification message
        document.getElementById('facilityNotificationMessage').value = 
            `Dear Resident,\n\nThis is to confirm that a staff member will accompany you for your reservation at the ${reservation.facility} on ${reservation.date} at ${reservation.time}.\n\nNumber of guests: ${reservation.guests}\nPurpose: ${reservation.purpose}\n\nThank you,\nStaff Team`;
        
        // Open modal
        openModal(facilityDetailsModal);
    }
    
    async function confirmFacilityBooking() {
        if (!currentFacilityReservation) {
            showToast('error', 'No reservation selected');
            return;
        }
        
        // Get values from form
        const staffNotes = document.getElementById('facilityStaffNotes').value;
        const notificationMessage = document.getElementById('facilityNotificationMessage').value;
        
        // Validate the required fields
        if (!notificationMessage.trim()) {
            showToast('error', 'Please enter a notification message for the resident');
            return;
        }
        
        try {
            console.log("FACILITY BOOKING: Confirming booking for reservation ID:", currentFacilityReservation.id);
            
            // Show loading state on button
            const confirmBtn = document.getElementById('confirmFacilityBookingBtn');
            const originalBtnText = confirmBtn.innerHTML;
            confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            confirmBtn.disabled = true;
            
            // Send booking request
            const response = await fetch('/Staff/BookFacilityReservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reservationId: parseInt(currentFacilityReservation.id),
                    staffNotes: staffNotes,
                    notificationMessage: notificationMessage
                })
            });
            
            const data = await response.json();
            console.log("FACILITY BOOKING: Response received:", data);
            
            if (data.success) {
                // Show success message
                showToast('success', 'Facility booking confirmed successfully!');
                
                // Update the current reservation's status
                if (data.newStatus && currentFacilityReservation) {
                    currentFacilityReservation.status = data.newStatus;
                }
                
                // Close the modal
                closeModal(facilityDetailsModal);
                
                // Refresh the reservations list
                await fetchApprovedFacilityReservations();
            } else {
                showToast('error', data.message || 'Failed to confirm booking');
            }
        } catch (error) {
            console.error('FACILITY BOOKING: Error confirming booking:', error);
            showToast('error', 'An error occurred while confirming the booking');
        } finally {
            // Reset button state
            const confirmBtn = document.getElementById('confirmFacilityBookingBtn');
            confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Confirm Booking';
            confirmBtn.disabled = false;
        }
    }
    
    // Helper Functions
    function updatePaginationControls(currentPage, totalPages, totalItems) {
        console.log("PAGINATION: Updating pagination controls");
        console.log("PAGINATION: Current page:", currentPage, "Total pages:", totalPages, "Total items:", totalItems);
        
        if (!facilityPrevBtn || !facilityNextBtn || !facilityPageNumbers || !facilityPaginationInfo) {
            console.error("PAGINATION: Missing pagination elements");
            return;
        }
        
        // Update prev/next button states
        facilityPrevBtn.disabled = currentPage <= 1;
        facilityNextBtn.disabled = currentPage >= totalPages;
        
        // Clear page numbers
        facilityPageNumbers.innerHTML = '';
        
        // Add page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.classList.add('page-number');
            if (i === currentPage) pageBtn.classList.add('active');
            
            pageBtn.addEventListener('click', function() {
                renderFacilityReservations(i, facilitySearch.value, facilityFilter.value);
            });
            
            facilityPageNumbers.appendChild(pageBtn);
        }
        
        // Update info text
        const startItem = totalItems === 0 ? 0 : (currentPage - 1) * 5 + 1;
        const endItem = Math.min(startItem + 4, totalItems);
        facilityPaginationInfo.textContent = `Showing ${startItem} to ${endItem} of ${totalItems} entries`;
        
        console.log("PAGINATION: Finished updating pagination controls");
    }
    
    function openModal(modal) {
        if (!modal) {
            console.error("MODAL: Attempted to open a null/undefined modal");
            return;
        }
        console.log("MODAL: Opening modal");
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        if (!modal) {
            console.error("MODAL: Attempted to close a null/undefined modal");
            return;
        }
        console.log("MODAL: Closing modal");
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function showToast(type, message) {
        console.log(`TOAST: ${type.toUpperCase()} - ${message}`);
        
        if (typeof Swal !== 'undefined') {
            const icon = type === 'success' ? 'success' : 
                         type === 'error' ? 'error' : 
                         'info';
            
            Swal.fire({
                icon: icon,
                title: type.charAt(0).toUpperCase() + type.slice(1),
                text: message,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } else {
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }
    
    function showLoadingState(container) {
        if (!container) {
            console.error("LOADING: Container not found");
            return;
        }
        
        console.log("LOADING: Showing loading state");
        container.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="loading-state">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading data...</p>
                    </div>
                </td>
            </tr>
        `;
    }
    
    function showErrorState(container, message = 'Failed to load data') {
        if (!container) {
            console.error("ERROR: Container not found");
            return;
        }
        
        console.log("ERROR: Showing error state:", message);
        container.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="error-state">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>${message}</p>
                        <button class="retry-button" onclick="location.reload()">
                            <i class="fas fa-redo"></i> Retry
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    // Expose functions for external use
    window.FacilityReservationsManager = {
        refreshReservations: fetchApprovedFacilityReservations
    };
}); 