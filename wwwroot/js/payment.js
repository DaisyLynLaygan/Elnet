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
    
    // Add maintenance bookings if they exist
    if (userServiceRequests && userServiceRequests.length > 0) {
        userServiceRequests.forEach(request => {
            const bookingCard = createMaintenanceBookingCard(request);
            maintenanceContainer.appendChild(bookingCard);
        });
        
        // Add click events for the newly created pay buttons
        setupPayButtons();
    } else {
        maintenanceContainer.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-calendar-times"></i>
                <p>You have no active maintenance bookings</p>
                <a href="/Homeowner/Dashboard" class="book-now-button">Book a Service</a>
            </div>
        `;
    }
    
    // For now, use sample data for facility bookings
    displayFacilityBookings();
}

// Display sample facility bookings
function displayFacilityBookings() {
    const facilityContainer = document.getElementById('facility-bookings');
    facilityContainer.innerHTML = '';
    
    // Sample data just for UI purposes
    const facilityBookings = [
        {
            id: 1,
            facility: "Function Hall",
            date: "2023-08-05",
            duration: "4 hours",
            startTime: "2:00 PM",
            guests: 50,
            price: "$500.00",
            status: "Pending Payment"
        }
    ];
    
    if (facilityBookings.length > 0) {
        facilityBookings.forEach(booking => {
            const bookingCard = createFacilityBookingCard(booking);
            facilityContainer.appendChild(bookingCard);
        });
    } else {
        facilityContainer.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-calendar-times"></i>
                <p>You have no facility reservations</p>
                <a href="/Homeowner/Dashboard" class="book-now-button">Reserve a Facility</a>
            </div>
        `;
    }
    
    // Add click events for the newly created pay buttons
    setupPayButtons();
}

function setupPayButtons() {
    const payButtons = document.querySelectorAll('.pay-booking-button');
    const paymentModal = document.getElementById('paymentModal');
    
    payButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the request ID from the button's data attribute
            const requestId = button.getAttribute('data-id');
            
            // Store the selected request ID in the modal for later use
            paymentModal.setAttribute('data-request-id', requestId);
            
            // Get booking details
            const bookingCard = button.closest('.booking-card');
            const bookingType = button.closest('.bookings-container').id.includes('maintenance') ? 
                'Maintenance Service' : 'Facility Booking';
            const bookingName = bookingCard.querySelector('h4').textContent;
            const bookingPrice = bookingCard.querySelector('.booking-price').textContent;
            
            document.getElementById('payment-for').textContent = `${bookingType} - ${bookingName}`;
            document.getElementById('payment-amount-summary').textContent = bookingPrice;
            
            document.getElementById('payment-method-summary').textContent = 
                document.querySelector('.method-card.active')?.textContent.trim() || 'Select a payment method';
            
            paymentModal.style.display = 'flex';
        });
    });
}

async function processPayment() {
    const paymentModal = document.getElementById('paymentModal');
    const requestId = paymentModal.getAttribute('data-request-id');
    const paymentMethod = document.querySelector('.method-card.active')?.textContent.trim() || 'Credit Card';
    
    if (!requestId) {
        showAlert('Error', 'No booking selected for payment', 'error');
        return;
    }
    
    try {
        // Show loading state
        document.querySelector('.confirm-button').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        document.querySelector('.confirm-button').disabled = true;
        
        const response = await fetch('/Homeowner/ProcessServicePayment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requestId: parseInt(requestId),
                paymentMethod: paymentMethod
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Hide the modal
            paymentModal.style.display = 'none';
            
            // Show success message
            showAlert('Success', 'Payment processed successfully!', 'success');
            
            // Refresh the service requests
            fetchUserServiceRequests();
        } else {
            showAlert('Error', data.message || 'Payment failed', 'error');
        }
    } catch (error) {
        console.error('Payment processing error:', error);
        showAlert('Error', 'An error occurred while processing your payment', 'error');
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
    
    // Add a badge if status is "Pending Approval"
    const statusBadge = booking.status === "Pending Approval" 
        ? '<span class="status-badge pending">Pending Approval</span>' 
        : '';
    
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
            ${booking.paymentStatus === "Unpaid" ? `
                <button class="pay-booking-button" data-id="${booking.id}">
                    <i class="fas fa-credit-card"></i> Pay Now
                </button>
            ` : `
                <button class="paid-status-button" disabled>
                    <i class="fas fa-check-circle"></i> Paid
                </button>
            `}
            <button class="cancel-booking-button">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>
    `;
    
    return card;
}

function createFacilityBookingCard(booking) {
    const card = document.createElement('div');
    card.className = 'booking-card';
    
    card.innerHTML = `
        <div class="booking-info">
            <h4>${booking.facility}</h4>
            <div class="booking-details">
                <div class="booking-detail">
                    <i class="fas fa-calendar-day"></i>
                    <span>${booking.date}</span>
                </div>
                <div class="booking-detail">
                    <i class="fas fa-clock"></i>
                    <span>${booking.startTime}</span>
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
                    <span>${booking.status}</span>
                </div>
            </div>
        </div>
        <div class="booking-actions">
            <button class="pay-booking-button" data-id="${booking.id}">
                <i class="fas fa-credit-card"></i> Pay Now
            </button>
            <button class="cancel-booking-button">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>
    `;
    
    return card;
}