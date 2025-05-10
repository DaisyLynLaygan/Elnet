// Store for pending service requests and bookings
let userServiceRequests = [];

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Payment method selection
    const methodCards = document.querySelectorAll('.method-card');
    methodCards.forEach(card => {
        card.addEventListener('click', () => {
            methodCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
    
    // Load real service requests when page loads
    fetchUserServiceRequests();

    // Set up WebSocket connection for real-time updates
    setupServiceRequestWebSocket();
    
    // Payment modal functionality
    const payButtons = document.querySelectorAll('.pay-now-button, .pay-booking-button');
    const paymentModal = document.getElementById('paymentModal');
    const closeModal = document.querySelector('.close-modal');
    
    // We'll add the event listeners dynamically after loading the bookings
    
    closeModal.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
    });
    
    // Confirm payment button - will be replaced with real API call
    const confirmButton = document.querySelector('.confirm-button');
    confirmButton.addEventListener('click', processPayment);
});

function setupServiceRequestWebSocket() {
    try {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const host = window.location.host;
        
        // Connect to WebSocket
        const serviceRequestSocket = new WebSocket(`${protocol}${host}/ws/homeowner/service-requests`);
        
        serviceRequestSocket.onopen = function() {
            console.log('Service Request WebSocket connection established');
        };
        
        serviceRequestSocket.onmessage = function(event) {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'service_request_update') {
                    // Refresh the service requests if there's an update
                    fetchUserServiceRequests();
                }
            } catch (error) {
                console.error('Error processing service request message:', error);
            }
        };
        
        serviceRequestSocket.onerror = function(error) {
            console.error('Service Request WebSocket error:', error);
        };
        
        serviceRequestSocket.onclose = function(event) {
            console.log('Service Request WebSocket connection closed', event.code, event.reason);
        };
    } catch (error) {
        console.error('Service Request WebSocket initialization failed:', error);
    }
}

// Get current user ID from session
function getCurrentUserId() {
    // Check if we have a "user_id" in session storage
    const sessionUserId = sessionStorage.getItem('user_id');
    if (sessionUserId) {
        return parseInt(sessionUserId);
    }
    
    // Default ID for testing purposes - in a real app, this should come from the server
    return 1; 
}

// Fetch service requests from the server
async function fetchUserServiceRequests() {
    try {
        const userId = getCurrentUserId();
        const response = await fetch(`/Homeowner/GetUserServiceRequests?userId=${userId}`);
        const data = await response.json();
        
        if (data.success) {
            // Sort service requests to show pending ones first
            userServiceRequests = data.serviceRequests.sort((a, b) => {
                // Sort by approval status (pending first), then by date
                if (a.status === 'Pending Approval' && b.status !== 'Pending Approval') {
                    return -1;
                } else if (a.status !== 'Pending Approval' && b.status === 'Pending Approval') {
                    return 1;
                } else {
                    // If status is the same, sort by date (newest first)
                    return new Date(b.date) - new Date(a.date);
                }
            });
            
            displayServiceRequests();
        } else {
            console.error('Failed to fetch service requests:', data.message);
        }
    } catch (error) {
        console.error('Error fetching service requests:', error);
    }
}

// Display service requests in the UI
function displayServiceRequests() {
    const maintenanceContainer = document.getElementById('maintenance-bookings');
    
    // Clear existing content
    maintenanceContainer.innerHTML = '';
    
    // Filter service requests: 
    // 1. Show Pending Approval and Approved but Unpaid
    // 2. Hide Rejected, Completed, and Paid ones
    const filteredRequests = userServiceRequests.filter(request => 
        (request.status === "Pending Approval" || request.status === "Approved") && 
        request.paymentStatus === "Unpaid"
    );
    
    // Add maintenance bookings if they exist
    if (filteredRequests && filteredRequests.length > 0) {
        filteredRequests.forEach(request => {
            const bookingCard = createMaintenanceBookingCard(request);
            maintenanceContainer.appendChild(bookingCard);
        });
        
        // Add click events for the newly created pay buttons
        setupPayButtons();
    } else {
        maintenanceContainer.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-calendar-times"></i>
                <p>You have no pending payment service requests</p>
                <a href="/Homeowner/Dashboard" class="book-now-button">Book a Service</a>
            </div>
        `;
    }
    
    // Load facility bookings
    displayFacilityBookings();
}

// Display facility bookings
async function displayFacilityBookings() {
    const facilityContainer = document.getElementById('facility-bookings');
    facilityContainer.innerHTML = '';
    
    try {
        const userId = getCurrentUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        // Show loading state
        facilityContainer.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading your facility reservations...</p>
            </div>
        `;
        
        // Fetch facility reservations from the server
        const response = await fetch(`/Homeowner/GetUserFacilityReservations?userId=${userId}`);
        const data = await response.json();
        
        if (data.success && data.reservations && data.reservations.length > 0) {
            // Only show reservations that need payment (Pending or Approved but Unpaid)
            const filteredReservations = data.reservations.filter(reservation => 
                (reservation.status === "Pending" || reservation.status === "Approved") && 
                reservation.paymentStatus === "Unpaid"
            );
            
            if (filteredReservations.length > 0) {
                facilityContainer.innerHTML = '';
                filteredReservations.forEach(reservation => {
                    const bookingCard = createFacilityBookingCard(reservation);
                    facilityContainer.appendChild(bookingCard);
                });
            } else {
                // No reservations after filtering
                facilityContainer.innerHTML = `
                    <div class="no-bookings">
                        <i class="fas fa-calendar-times"></i>
                        <p>You have no pending payment facility reservations</p>
                        <a href="/Homeowner/Dashboard" class="book-now-button">Reserve a Facility</a>
                    </div>
                `;
            }
        } else {
            facilityContainer.innerHTML = `
                <div class="no-bookings">
                    <i class="fas fa-calendar-times"></i>
                    <p>You have no facility reservations</p>
                    <a href="/Homeowner/Dashboard" class="book-now-button">Reserve a Facility</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching facility reservations:', error);
        facilityContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading facility reservations</p>
                <button class="retry-button" onclick="displayFacilityBookings()">Retry</button>
            </div>
        `;
    }
    
    // Add click events for the newly created pay buttons
    setupPayButtons();
}

function setupPayButtons() {
    const payButtons = document.querySelectorAll('.pay-booking-button');
    const viewDetailsButtons = document.querySelectorAll('.view-details-button');
    const paymentModal = document.getElementById('paymentModal');
    
    // Set up pay now buttons
    payButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the request ID from the button's data attribute
            const requestId = button.getAttribute('data-id');
            const requestType = button.getAttribute('data-type') || 'service';
            
            // Store the selected request ID and type in the modal for later use
            paymentModal.setAttribute('data-request-id', requestId);
            paymentModal.setAttribute('data-request-type', requestType);
            
            // Get booking details
            const bookingCard = button.closest('.booking-card');
            const bookingType = requestType === 'facility' ? 'Facility Booking' : 'Maintenance Service';
            const bookingName = bookingCard.querySelector('h4').textContent;
            const bookingPrice = bookingCard.querySelector('.booking-price').textContent;
            
            document.getElementById('payment-for').textContent = `${bookingType} - ${bookingName}`;
            document.getElementById('payment-amount-summary').textContent = bookingPrice;
            
            document.getElementById('payment-method-summary').textContent = 
                document.querySelector('.method-card.active')?.textContent.trim() || 'Select a payment method';
            
            paymentModal.style.display = 'flex';
        });
    });
    
    // Set up view details buttons for rejected requests
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the booking card and extract information
            const bookingCard = button.closest('.booking-card');
            
            // Find if this is a service request or facility booking
            const isServiceRequest = bookingCard.querySelector('.booking-price') != null;
            const title = bookingCard.querySelector('h4').textContent.replace('Rejected', '').trim();
            
            // Show details in alert
            Swal.fire({
                title: 'Request Rejected',
                html: `
                    <div class="rejection-details">
                        <p><strong>${isServiceRequest ? 'Service' : 'Facility'} request:</strong> ${title}</p>
                        <p><strong>Status:</strong> <span class="text-danger">Rejected</span></p>
                        <p><strong>Reason:</strong> ${getRejectionReason(bookingCard)}</p>
                        <p>If you have questions about this rejection, please contact our support team.</p>
                    </div>
                `,
                icon: 'error',
                confirmButtonText: 'Close'
            });
        });
    });
}

// Helper function to get the rejection reason from the booking card
function getRejectionReason(bookingCard) {
    // First try to get the actual rejection reason stored as a data attribute
    const storedReason = bookingCard.getAttribute('data-rejection-reason');
    if (storedReason) {
        return storedReason;
    }
    
    // Fallback to placeholder reasons if no actual reason is available
    const placeholderReasons = [
        "The requested service is not available on the selected date.",
        "The facility is undergoing maintenance on the selected date.",
        "The request was denied by the administration.",
        "The service capacity has been reached for the selected date.",
        "Your request does not meet our service requirements.",
        "The facility was reserved for another event."
    ];
    
    // Get a consistent reason based on the booking title
    const title = bookingCard.querySelector('h4').textContent;
    const reasonIndex = title.length % placeholderReasons.length;
    return placeholderReasons[reasonIndex];
}

async function processPayment() {
    const paymentModal = document.getElementById('paymentModal');
    const requestId = paymentModal.getAttribute('data-request-id');
    const requestType = paymentModal.getAttribute('data-request-type') || 'service'; // Default to service if not specified
    const paymentMethod = document.querySelector('.method-card.active')?.textContent.trim() || 'Credit Card';
    
    if (!requestId) {
        showAlert('Error', 'No booking selected for payment', 'error');
        return;
    }
    
    // Check that a payment method is selected
    if (!document.querySelector('.method-card.active')) {
        showAlert('Error', 'Please select a payment method', 'error');
        return;
    }
    
    // Get the booking name for success message
    const paymentFor = document.getElementById('payment-for').textContent;
    
    try {
        // Show loading state
        const confirmButton = document.querySelector('.confirm-button');
        confirmButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        confirmButton.disabled = true;
        
        let endpoint = '/Homeowner/ProcessServicePayment';
        if (requestType === 'facility') {
            endpoint = '/Homeowner/ProcessFacilityPayment';
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                RequestId: parseInt(requestId),
                PaymentMethod: paymentMethod
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Hide the modal
            paymentModal.style.display = 'none';
            
            // Show success message
            Swal.fire({
                title: 'Payment Successful!',
                text: `Your payment for ${paymentFor} has been processed successfully.`,
                icon: 'success',
                confirmButtonText: 'Great!',
                confirmButtonColor: '#6D4C41'
            });
            
            // Refresh the appropriate bookings list
            if (requestType === 'facility') {
                displayFacilityBookings();
            } else {
                fetchUserServiceRequests();
            }
        } else {
            showAlert('Payment Failed', data.message || 'Payment could not be processed', 'error');
        }
    } catch (error) {
        console.error('Payment processing error:', error);
        showAlert('Error', 'An error occurred while processing your payment. Please try again later.', 'error');
    } finally {
        // Reset button state
        document.querySelector('.confirm-button').innerHTML = '<i class="fas fa-lock"></i> Confirm Payment';
        document.querySelector('.confirm-button').disabled = false;
    }
}

function showAlert(title, message, type) {
    // Simple alert function - in a real app you might use SweetAlert2 or similar
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: title,
            text: message,
            icon: type,
            confirmButtonText: 'OK'
        });
    } else {
        alert(`${title}: ${message}`);
    }
}

function createMaintenanceBookingCard(booking) {
    const card = document.createElement('div');
    card.className = 'booking-card';
    
    // Store rejection reason as a data attribute if present
    if (booking.rejectionReason) {
        card.setAttribute('data-rejection-reason', booking.rejectionReason);
    }
    
    // Add appropriate status badge
    let statusBadge = '';
    if (booking.status === "Pending Approval") {
        statusBadge = '<span class="status-badge pending">Pending Approval</span>';
    } else if (booking.status === "Rejected") {
        statusBadge = '<span class="status-badge rejected">Rejected</span>';
    }
    
    let detailsHtml = `
        <div class="booking-detail">
            <i class="fas fa-calendar-day"></i>
            <span>${booking.date}</span>
        </div>
    `;
    
    if (booking.time) {
        detailsHtml += `
            <div class="booking-detail">
                <i class="fas fa-clock"></i>
                <span>${booking.time}</span>
            </div>
        `;
    }
    
    if (booking.frequency) {
        detailsHtml += `
            <div class="booking-detail">
                <i class="fas fa-sync-alt"></i>
                <span>${booking.frequency}</span>
            </div>
        `;
    }
    
    // Determine the appropriate action buttons based on status and payment status
    let actionButtons = '';
    
    if (booking.status === "Rejected") {
        // If rejected, show a disabled rejected button
        actionButtons = `
            <button class="rejected-status-button" disabled>
                <i class="fas fa-ban"></i> Rejected
            </button>
            <button class="view-details-button">
                <i class="fas fa-eye"></i> Details
            </button>
        `;
    } else if (booking.paymentStatus === "Unpaid") {
        // If not rejected and unpaid, show pay now button
        actionButtons = `
            <button class="pay-booking-button" data-id="${booking.id}">
                <i class="fas fa-credit-card"></i> Pay Now
            </button>
            <button class="cancel-booking-button">
                <i class="fas fa-times"></i> Cancel
            </button>
        `;
    } else {
        // If paid, show paid status button
        actionButtons = `
            <button class="paid-status-button" disabled>
                <i class="fas fa-check-circle"></i> Paid
            </button>
            <button class="cancel-booking-button">
                <i class="fas fa-times"></i> Cancel
            </button>
        `;
    }
    
    card.innerHTML = `
        <div class="booking-info">
            <h4>${booking.service} ${statusBadge}</h4>
            <div class="booking-details">
                ${detailsHtml}
                <div class="booking-detail">
                    <i class="fas fa-tag"></i>
                    <span class="booking-price">${booking.price}</span>
                </div>
                <div class="booking-detail">
                    <i class="fas fa-info-circle"></i>
                    <span>${booking.paymentStatus === "Unpaid" ? "Pending Payment" : booking.paymentStatus}</span>
                </div>
            </div>
        </div>
        <div class="booking-actions">
            ${actionButtons}
        </div>
    `;
    
    return card;
}

function createFacilityBookingCard(booking) {
    const card = document.createElement('div');
    card.className = 'booking-card';
    
    // Store rejection reason as a data attribute if present
    if (booking.rejectionReason) {
        card.setAttribute('data-rejection-reason', booking.rejectionReason);
    }
    
    // Add appropriate status badge
    let statusBadge = '';
    if (booking.status === "Pending") {
        statusBadge = '<span class="status-badge pending">Pending Approval</span>';
    } else if (booking.status === "Cancelled" || booking.status === "Rejected") {
        statusBadge = '<span class="status-badge rejected">Rejected</span>';
    }
    
    // Determine the appropriate action buttons based on status and payment status
    let actionButtons = '';
    
    if (booking.status === "Cancelled" || booking.status === "Rejected") {
        // If cancelled/rejected, show a disabled rejected button
        actionButtons = `
            <button class="rejected-status-button" disabled>
                <i class="fas fa-ban"></i> Rejected
            </button>
            <button class="view-details-button">
                <i class="fas fa-eye"></i> Details
            </button>
        `;
    } else if (booking.paymentStatus === "Unpaid") {
        // If not rejected and unpaid, show pay now button
        actionButtons = `
            <button class="pay-booking-button" data-id="${booking.id}" data-type="facility">
                <i class="fas fa-credit-card"></i> Pay Now
            </button>
            <button class="cancel-booking-button">
                <i class="fas fa-times"></i> Cancel
            </button>
        `;
    } else {
        // If paid, show paid status button
        actionButtons = `
            <button class="paid-status-button" disabled>
                <i class="fas fa-check-circle"></i> Paid
            </button>
            <button class="cancel-booking-button">
                <i class="fas fa-times"></i> Cancel
            </button>
        `;
    }
    
    card.innerHTML = `
        <div class="booking-info">
            <h4>${booking.facility} ${statusBadge}</h4>
            <div class="booking-details">
                <div class="booking-detail">
                    <i class="fas fa-calendar-day"></i>
                    <span>${booking.date}</span>
                </div>
                <div class="booking-detail">
                    <i class="fas fa-clock"></i>
                    <span>${booking.time}</span>
                </div>
                <div class="booking-detail">
                    <i class="fas fa-hourglass-half"></i>
                    <span>${booking.duration}</span>
                </div>
                <div class="booking-detail">
                    <i class="fas fa-users"></i>
                    <span>${booking.guests} guests</span>
                </div>
                <div class="booking-detail">
                    <i class="fas fa-tag"></i>
                    <span class="booking-price">${booking.price}</span>
                </div>
                <div class="booking-detail">
                    <i class="fas fa-info-circle"></i>
                    <span>${booking.paymentStatus === "Unpaid" ? "Pending Payment" : booking.paymentStatus}</span>
                </div>
            </div>
        </div>
        <div class="booking-actions">
            ${actionButtons}
        </div>
    `;
    
    return card;
}