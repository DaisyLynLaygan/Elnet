// Sample data for bookings (in a real app, this would come from your backend)
const userBookings = {
    maintenance: [
        {
            id: 1,
            service: "House Cleaning",
            date: "2023-07-15",
            time: "9:00 AM",
            price: "$120.00",
            status: "Pending Payment"
        },
        {
            id: 2,
            service: "Garden Maintenance",
            date: "2023-07-10",
            frequency: "Monthly",
            price: "$150.00",
            status: "Pending Payment"
        }
    ],
    facilities: [
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
    ]
};

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
    
    // Load bookings when page loads
    loadBookings();
    
    // Payment modal functionality
    const payButtons = document.querySelectorAll('.pay-now-button, .pay-booking-button');
    const paymentModal = document.getElementById('paymentModal');
    const closeModal = document.querySelector('.close-modal');
    
    payButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Set payment details in modal
            if (button.classList.contains('pay-now-button')) {
                // Rent payment
                document.getElementById('payment-for').textContent = 'Monthly Rent - Luxury Villa';
                document.getElementById('payment-amount-summary').textContent = 
                    '$' + document.getElementById('payment-amount').value;
            } else {
                // Booking payment
                const bookingCard = button.closest('.booking-card');
                const bookingType = button.closest('.bookings-container').id.includes('maintenance') ? 
                    'Maintenance Service' : 'Facility Booking';
                const bookingName = bookingCard.querySelector('h4').textContent;
                const bookingPrice = bookingCard.querySelector('.booking-price').textContent;
                
                document.getElementById('payment-for').textContent = `${bookingType} - ${bookingName}`;
                document.getElementById('payment-amount-summary').textContent = bookingPrice;
            }
            
            document.getElementById('payment-method-summary').textContent = 
                document.querySelector('.method-card.active')?.textContent.trim() || 'Select a payment method';
            
            paymentModal.style.display = 'flex';
        });
    });
    
    closeModal.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
    });
    
    // Confirm payment button
    const confirmButton = document.querySelector('.confirm-button');
    confirmButton.addEventListener('click', () => {
        alert('Payment processed successfully!');
        paymentModal.style.display = 'none';
        
        // In a real app, you would update the booking status here
    });
});

function loadBookings() {
    const maintenanceContainer = document.getElementById('maintenance-bookings');
    const facilityContainer = document.getElementById('facility-bookings');
    
    // Clear existing content except the no-bookings message
    maintenanceContainer.innerHTML = '';
    facilityContainer.innerHTML = '';
    
    // Add maintenance bookings if they exist
    if (userBookings.maintenance.length > 0) {
        userBookings.maintenance.forEach(booking => {
            const bookingCard = createMaintenanceBookingCard(booking);
            maintenanceContainer.appendChild(bookingCard);
        });
    } else {
        maintenanceContainer.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-calendar-times"></i>
                <p>You have no active maintenance bookings</p>
                <a href="/Homeowner/Dashboard" class="book-now-button">Book a Service</a>
            </div>
        `;
    }
    
    // Add facility bookings if they exist
    if (userBookings.facilities.length > 0) {
        userBookings.facilities.forEach(booking => {
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
}

function createMaintenanceBookingCard(booking) {
    const card = document.createElement('div');
    card.className = 'booking-card';
    
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
            <h4>${booking.service}</h4>
            <div class="booking-details">
                ${detailsHtml}
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
            <button class="pay-booking-button">
                <i class="fas fa-credit-card"></i> Pay Now
            </button>
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
            <button class="pay-booking-button">
                <i class="fas fa-credit-card"></i> Pay Now
            </button>
            <button class="cancel-booking-button">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>
    `;
    
    return card;
}