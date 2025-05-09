document.addEventListener('DOMContentLoaded', function() {
    console.log("Staff services.js loaded");
    
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
    initializeTabs();
    fetchApprovedFacilityReservations();
    setupEventListeners();
    
    // Functions
    function initializeTabs() {
        const tabs = document.querySelectorAll('.services-tabs .tab');
        const sections = document.querySelectorAll('.service-section');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabType = this.dataset.tab;
                
                // Remove active class from all tabs and sections
                tabs.forEach(t => t.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding section
                this.classList.add('active');
                document.getElementById(`${tabType}-section`).classList.add('active');
            });
        });
    }
    
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
                
                // Now fetch maintenance service requests
                fetchMaintenanceServiceRequests();
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
        if (!facilityFilter) return;
        
        // Clear existing options except the first one (All Facilities)
        while (facilityFilter.options.length > 1) {
            facilityFilter.remove(1);
        }
        
        // Extract unique facility names from the reservations
        const facilities = [...new Set(reservations.map(r => r.facility))].sort();
        
        // Add options for each facility
        facilities.forEach(facility => {
            const option = document.createElement('option');
            option.value = facility;
            option.textContent = facility;
            facilityFilter.appendChild(option);
        });
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
            // Only show Approved reservations (not In Progress)
            if (res.status !== "Approved") {
                return false;
            }
            
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
                
                // Add status color indicator
                let statusColor = "#28a745"; // Green for approved
                
                row.innerHTML = `
                    <td>
                        <div style="display: flex; align-items: center;">
                            <div style="width: 6px; height: 24px; background-color: ${statusColor}; margin-right: 10px; border-radius: 3px;"></div>
                            #${reservation.id}
                        </div>
                    </td>
                    <td>${reservation.facility}</td>
                    <td>${reservation.resident}</td>
                    <td>${reservation.dateTime}</td>
                    <td><span class="status-badge status-approved">Approved</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon view-details" title="View Details" data-action="view">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon" title="Book Facility" data-action="book">
                                <i class="fas fa-calendar-check"></i>
                            </button>
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
        if (facilityPrevBtn && facilityNextBtn && facilityPageNumbers && facilityPaginationInfo) {
            updatePaginationControls(
                page, 
                totalPages, 
                filteredReservations.length, 
                facilityPrevBtn, 
                facilityNextBtn, 
                facilityPageNumbers, 
                facilityPaginationInfo
            );
        } else {
            console.error("FACILITY RENDER: Pagination elements not found");
        }
        
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
        const reservation = facilityReservations.find(r => r.id === reservationId);
        if (!reservation) return;
        
        currentFacilityReservation = reservation;
        
        // Update modal content with all reservation details
        document.getElementById('facilityDetailsId').textContent = `Reservation #${reservation.id}`;
        document.getElementById('facilityDetailsStatus').innerHTML = `
            <span class="status-badge status-approved">Approved</span>
            <span class="status-badge status-paid">${reservation.payment_status}</span>`;
        document.getElementById('facilityDetailsFacility').textContent = reservation.facility;
        document.getElementById('facilityDetailsResident').textContent = reservation.resident;
        document.getElementById('facilityDetailsDate').textContent = reservation.date;
        document.getElementById('facilityDetailsTime').textContent = `${reservation.time} (${reservation.duration} hours)`;
        document.getElementById('facilityDetailsGuests').textContent = reservation.guests;
        document.getElementById('facilityDetailsPurpose').textContent = reservation.purpose;
        document.getElementById('facilityDetailsAmount').textContent = reservation.amount;
        document.getElementById('facilityStaffNotes').value = reservation.notes || '';
        
        // Set default notification message with complete details
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
            // Show loading state on button
            const confirmBtn = document.getElementById('confirmFacilityBookingBtn');
            confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            confirmBtn.disabled = true;
            
            // Send booking request to the server
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
            
            if (data.success) {
                // Show success message
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Booking Confirmed!',
                        html: `The facility booking has been confirmed successfully.<br><br>
                              <strong>Facility:</strong> ${currentFacilityReservation.facility}<br>
                              <strong>Date & Time:</strong> ${currentFacilityReservation.dateTime}`,
                        icon: 'success',
                        confirmButtonColor: '#6B4423',
                    });
                } else {
                    showToast('success', 'Facility booking confirmed successfully!');
                }
                
                // Close the modal
                closeModal(facilityDetailsModal);
                
                // Refresh the reservations list
                await fetchApprovedFacilityReservations();
            } else {
                // Show error message
                showToast('error', data.message || 'Failed to confirm booking');
                console.error('Error confirming booking:', data.message);
            }
        } catch (error) {
            console.error('Error confirming facility booking:', error);
            showToast('error', 'An error occurred while confirming the booking');
        } finally {
            // Reset button state
            const confirmBtn = document.getElementById('confirmFacilityBookingBtn');
            confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Confirm Booking';
            confirmBtn.disabled = false;
        }
    }
    
    // Helper Functions
    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function showToast(type, message) {
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
    
    function updatePaginationControls(currentPage, totalPages, totalItems, prevBtn, nextBtn, pageNumbers, infoElement) {
        if (!prevBtn || !nextBtn || !pageNumbers || !infoElement) return;
        
        // Update prev/next button states
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
        
        // Clear page numbers
        pageNumbers.innerHTML = '';
        
        // Add page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.classList.add('page-number');
            if (i === currentPage) pageBtn.classList.add('active');
            
            pageBtn.addEventListener('click', function() {
                renderFacilityReservations(i, facilitySearch.value, facilityFilter.value);
            });
            
            pageNumbers.appendChild(pageBtn);
        }
        
        // Update info text
        const startItem = totalItems === 0 ? 0 : (currentPage - 1) * 5 + 1;
        const endItem = Math.min(startItem + 4, totalItems);
        infoElement.textContent = `Showing ${startItem} to ${endItem} of ${totalItems} entries`;
    }
    
    function showLoadingState(container) {
        if (!container) return;
        container.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="loading-state">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading reservations...</p>
                    </div>
                </td>
            </tr>
        `;
    }
    
    function showErrorState(container, message = 'Failed to load data') {
        if (!container) return;
        container.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="error-state">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>${message}</p>
                        <button class="retry-button" onclick="fetchApprovedFacilityReservations()">
                            <i class="fas fa-redo"></i> Retry
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Add code to fetch and display maintenance service requests
    let serviceRequests = [];
    let currentServicePage = 1;
    let currentServiceRequest = null;
    
    async function fetchMaintenanceServiceRequests() {
        try {
            console.log("SERVICE FETCH: Starting to fetch approved service requests");
            const maintenanceTableBody = document.getElementById('maintenanceRequestsTable');
            if (!maintenanceTableBody) {
                console.error("SERVICE FETCH: maintenanceTableBody not found");
                return;
            }
            
            showLoadingState(maintenanceTableBody);
            
            const response = await fetch('/Staff/GetServiceRequests');
            const data = await response.json();
            
            console.log("SERVICE FETCH: API response received", data);
            
            if (data.success) {
                serviceRequests = data.requests;
                populateServiceFilter(serviceRequests);
                renderServiceRequests(1);
                console.log('SERVICE FETCH: Loaded service requests:', serviceRequests.length);
                
                // Add event listeners for service section
                setupServiceEventListeners();
            } else {
                showErrorState(maintenanceTableBody, data.message || 'Failed to load service requests');
                console.error('SERVICE FETCH: Failed to fetch service requests:', data.message);
            }
        } catch (error) {
            const maintenanceTableBody = document.getElementById('maintenanceRequestsTable');
            if (maintenanceTableBody) {
                showErrorState(maintenanceTableBody, 'Error fetching service requests');
            }
            console.error('SERVICE FETCH: Error fetching service requests:', error);
        }
    }
    
    function populateServiceFilter(requests) {
        const serviceFilter = document.getElementById('maintenance-filter');
        if (!serviceFilter) return;
        
        // Clear existing options except the first one (All Services)
        while (serviceFilter.options.length > 1) {
            serviceFilter.remove(1);
        }
        
        // Extract unique service types from the requests
        const services = [...new Set(requests.map(r => r.service_type))].sort();
        
        // Add options for each service type
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service;
            option.textContent = service;
            serviceFilter.appendChild(option);
        });
    }
    
    function renderServiceRequests(page = 1, searchTerm = '', filterValue = 'all') {
        const maintenanceTableBody = document.getElementById('maintenanceRequestsTable');
        if (!maintenanceTableBody) {
            console.error("SERVICE RENDER: maintenanceTableBody not found");
            return;
        }
        
        console.log("SERVICE RENDER: Starting to render service requests");
        console.log("SERVICE RENDER: Available requests:", serviceRequests.length);
        
        // Filter requests based on search and filter
        let filteredRequests = serviceRequests.filter(req => {
            // Only show Approved requests (not In Progress)
            if (req.status !== "Approved") {
                return false;
            }
            
            const matchesSearch = searchTerm === '' || 
                req.request_id.toString().includes(searchTerm.toLowerCase()) || 
                `${req.user.firstname} ${req.user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
                req.service_type.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesFilter = filterValue === 'all' || req.service_type === filterValue;
            
            return matchesSearch && matchesFilter;
        });
        
        console.log("SERVICE RENDER: Filtered requests:", filteredRequests.length);
        
        // Pagination logic
        const itemsPerPage = 5;
        const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);
        
        console.log("SERVICE RENDER: Paginated requests:", paginatedRequests.length);
        
        // Clear table
        maintenanceTableBody.innerHTML = '';
        
        // Check if we have any requests
        if (paginatedRequests.length === 0) {
            maintenanceTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <div class="no-data-message">
                            <i class="fas fa-tools"></i>
                            <p>No approved service requests found</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Populate table
        paginatedRequests.forEach(request => {
            try {
                console.log("SERVICE RENDER: Rendering request:", request);
                
                const row = document.createElement('tr');
                row.dataset.id = request.request_id;
                
                // Add status color indicator
                let statusColor = "#28a745"; // Green for approved
                
                const scheduledDate = new Date(request.scheduled_date);
                const formattedDate = `${scheduledDate.toLocaleDateString()} at ${request.scheduled_time}`;
                
                row.innerHTML = `
                    <td>
                        <div style="display: flex; align-items: center;">
                            <div style="width: 6px; height: 24px; background-color: ${statusColor}; margin-right: 10px; border-radius: 3px;"></div>
                            #${request.request_id}
                        </div>
                    </td>
                    <td>${request.user.firstname} ${request.user.lastname}</td>
                    <td>${request.service_type}</td>
                    <td>${formattedDate}</td>
                    <td><span class="status-badge status-approved">Approved</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon view-details" title="View Details" data-action="view">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon" title="Accept Service" data-action="accept">
                                <i class="fas fa-check-circle"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                maintenanceTableBody.appendChild(row);
                
                // Add event listeners to action buttons
                row.querySelectorAll('[data-action]').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const action = this.dataset.action;
                        const requestId = parseInt(this.closest('tr').dataset.id);
                        
                        if (action === 'view' || action === 'accept') {
                            showServiceDetails(requestId);
                        }
                    });
                });
            } catch (error) {
                console.error("SERVICE RENDER: Error rendering request:", error);
            }
        });
        
        // Update pagination controls
        const maintenancePrevBtn = document.getElementById('maintenancePrevPageBtn');
        const maintenanceNextBtn = document.getElementById('maintenanceNextPageBtn');
        const maintenancePageNumbers = document.getElementById('maintenancePageNumbers');
        const maintenancePaginationInfo = document.getElementById('maintenancePaginationInfo');
        
        if (maintenancePrevBtn && maintenanceNextBtn && maintenancePageNumbers && maintenancePaginationInfo) {
            updatePaginationControls(
                page, 
                totalPages, 
                filteredRequests.length, 
                maintenancePrevBtn, 
                maintenanceNextBtn, 
                maintenancePageNumbers, 
                maintenancePaginationInfo
            );
        } else {
            console.error("SERVICE RENDER: Pagination elements not found");
        }
        
        // Add click event to rows
        maintenanceTableBody.querySelectorAll('tr').forEach(row => {
            row.addEventListener('click', function() {
                const requestId = parseInt(this.dataset.id);
                showServiceDetails(requestId);
            });
        });
        
        // Update current page
        currentServicePage = page;
        
        console.log("SERVICE RENDER: Finished rendering service requests");
    }
    
    function showServiceDetails(requestId) {
        const request = serviceRequests.find(r => r.request_id === requestId);
        if (!request) {
            console.error("SERVICE DETAILS: Request not found with ID:", requestId);
            return;
        }
        
        console.log("SERVICE DETAILS: Found request:", request);
        currentServiceRequest = request;
        
        // Get modal elements
        const maintenanceDetailsModal = document.getElementById('maintenanceDetailsModal');
        if (!maintenanceDetailsModal) {
            console.error("SERVICE DETAILS: Modal not found");
            return;
        }
        
        // Update modal content
        document.getElementById('maintenanceDetailsId').textContent = `Request #${request.request_id}`;
        document.getElementById('maintenanceDetailsStatus').innerHTML = 
            `<span class="status-badge status-approved">Approved</span>
             <span class="status-badge status-paid">${request.payment_status}</span>`;
        document.getElementById('maintenanceDetailsService').textContent = request.service_type;
        document.getElementById('maintenanceDetailsResident').textContent = `${request.user.firstname} ${request.user.lastname}`;
        
        // Format scheduled date
        const scheduledDate = new Date(request.scheduled_date);
        document.getElementById('maintenanceDetailsDate').textContent = scheduledDate.toLocaleDateString();
        document.getElementById('maintenanceDetailsTime').textContent = request.scheduled_time;
        document.getElementById('maintenanceDetailsPayment').innerHTML = `<span class="status-badge status-paid">${request.payment_status}</span>`;
        document.getElementById('maintenanceDetailsInstructions').textContent = request.notes || 'No special instructions provided';
        
        // Set default staff notes if any
        document.getElementById('maintenanceStaffNotes').value = '';
        
        // Set default notification message
        const staffName = document.querySelector('meta[name="staff-name"]')?.content || 'Staff';
        document.getElementById('maintenanceNotificationMessage').value = 
            `Dear Homeowner,\n\nThis is to confirm that your ${request.service_type} service scheduled for ${scheduledDate.toLocaleDateString()} at ${request.scheduled_time} has been accepted by ${staffName}.\n\nThank you for using our services.\n\nRegards,\nStaff Team`;
        
        // Set service confirmation as default notification type
        document.getElementById('maintenanceNotificationType').value = 'confirmation';
        
        // Open modal
        openModal(maintenanceDetailsModal);
        
        // Add event listener to accept booking button
        const acceptBtn = document.getElementById('acceptMaintenanceBookingBtn');
        if (acceptBtn) {
            acceptBtn.onclick = function() {
                acceptServiceRequest();
            };
        }
    }
    
    async function acceptServiceRequest() {
        if (!currentServiceRequest) {
            showToast('error', 'No service request selected');
            return;
        }
        
        // Get values from form
        const staffNotes = document.getElementById('maintenanceStaffNotes').value;
        const notificationMessage = document.getElementById('maintenanceNotificationMessage').value;
        
        // Validate the required fields
        if (!notificationMessage.trim()) {
            showToast('error', 'Please enter a notification message for the homeowner');
            return;
        }
        
        try {
            console.log("SERVICE ACCEPT: Accepting service request ID:", currentServiceRequest.request_id);
            
            // Show loading state on button
            const acceptBtn = document.getElementById('acceptMaintenanceBookingBtn');
            const originalBtnText = acceptBtn.innerHTML;
            acceptBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            acceptBtn.disabled = true;
            
            // Send acceptance request
            const response = await fetch('/Staff/UpdateServiceRequestStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requestId: currentServiceRequest.request_id,
                    status: "In Progress",
                    staffNotes: staffNotes,
                    notificationMessage: notificationMessage
                })
            });
            
            const data = await response.json();
            console.log("SERVICE ACCEPT: Response received:", data);
            
            if (data.success) {
                // Show success message
                showToast('success', 'Service request accepted successfully!');
                
                // Update the service request status
                currentServiceRequest.status = "In Progress";
                
                // Close the modal
                closeModal(document.getElementById('maintenanceDetailsModal'));
                
                // Refresh the service requests list
                fetchMaintenanceServiceRequests();
            } else {
                showToast('error', data.message || 'Failed to accept service request');
            }
        } catch (error) {
            console.error('SERVICE ACCEPT: Error accepting service request:', error);
            showToast('error', 'An error occurred while accepting the service request');
        } finally {
            // Reset button state
            const acceptBtn = document.getElementById('acceptMaintenanceBookingBtn');
            acceptBtn.innerHTML = '<i class="fas fa-check-circle"></i> Accept Booking';
            acceptBtn.disabled = false;
        }
    }
    
    function setupServiceEventListeners() {
        // Search input
        const maintenanceSearch = document.getElementById('maintenance-search');
        if (maintenanceSearch) {
            maintenanceSearch.addEventListener('input', function() {
                const maintenanceFilter = document.getElementById('maintenance-filter');
                renderServiceRequests(1, this.value, maintenanceFilter.value);
            });
        }
        
        // Filter dropdown
        const maintenanceFilter = document.getElementById('maintenance-filter');
        if (maintenanceFilter) {
            maintenanceFilter.addEventListener('change', function() {
                const maintenanceSearch = document.getElementById('maintenance-search');
                renderServiceRequests(1, maintenanceSearch.value, this.value);
            });
        }
        
        // Pagination buttons
        const maintenancePrevBtn = document.getElementById('maintenancePrevPageBtn');
        const maintenanceNextBtn = document.getElementById('maintenanceNextPageBtn');
        
        if (maintenancePrevBtn) {
            maintenancePrevBtn.addEventListener('click', function() {
                if (currentServicePage > 1) {
                    currentServicePage--;
                    const maintenanceSearch = document.getElementById('maintenance-search');
                    const maintenanceFilter = document.getElementById('maintenance-filter');
                    renderServiceRequests(currentServicePage, maintenanceSearch.value, maintenanceFilter.value);
                }
            });
        }
        
        if (maintenanceNextBtn) {
            maintenanceNextBtn.addEventListener('click', function() {
                const totalPages = Math.ceil(serviceRequests.length / 5);
                if (currentServicePage < totalPages) {
                    currentServicePage++;
                    const maintenanceSearch = document.getElementById('maintenance-search');
                    const maintenanceFilter = document.getElementById('maintenance-filter');
                    renderServiceRequests(currentServicePage, maintenanceSearch.value, maintenanceFilter.value);
                }
            });
        }
    }
}); 