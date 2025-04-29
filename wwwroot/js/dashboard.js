let dashboardSocket;
let dashboardRetryCount = 0;
const dashboardMaxRetries = 5;
const dashboardRetryDelay = 3000;
const FACILITY_STATUS_KEY = 'facility_statuses';
// Initialize WebSocket connection
function connectDashboardWebSocket() {
    try {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const host = window.location.host;
        const path = '/ws/dashboard';
        
        dashboardSocket = new WebSocket(`${protocol}${host}${path}`);
        
        dashboardSocket.onopen = function() {
            console.log('Dashboard WebSocket connection established');
            dashboardRetryCount = 0;
            requestCurrentStatuses();
        };
        
        dashboardSocket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            if (data.type === 'facility_status_update') {
                updateFacilityStatusUI(data.facility, data.status);
                saveFacilityStatus(data.facility, data.status);
            } else if (data.type === 'current_statuses') {
                data.statuses.forEach(status => {
                    updateFacilityStatusUI(status.facility, status.status);
                    saveFacilityStatus(status.facility, status.status);
                });
            }
        };
        
        dashboardSocket.onerror = function(error) {
            console.error('Dashboard WebSocket error:', error);
        };
        
        dashboardSocket.onclose = function(event) {
            console.log('Dashboard WebSocket connection closed', event.code, event.reason);
            if (dashboardRetryCount < dashboardMaxRetries) {
                dashboardRetryCount++;
                setTimeout(connectDashboardWebSocket, dashboardRetryDelay);
            }
        };
    } catch (error) {
        console.error('Dashboard WebSocket initialization failed:', error);
        if (dashboardRetryCount < dashboardMaxRetries) {
            dashboardRetryCount++;
            setTimeout(connectDashboardWebSocket, dashboardRetryDelay);
        }
    }
}

function requestCurrentStatuses() {
    if (dashboardSocket && dashboardSocket.readyState === WebSocket.OPEN) {
        dashboardSocket.send(JSON.stringify({
            type: 'request_current_statuses'
        }));
    }
}

function saveFacilityStatus(facility, status) {
    const statuses = getFacilityStatuses();
    statuses[facility] = status;
    localStorage.setItem(FACILITY_STATUS_KEY, JSON.stringify(statuses));
}

function getFacilityStatuses() {
    const statuses = localStorage.getItem(FACILITY_STATUS_KEY);
    return statuses ? JSON.parse(statuses) : {};
}

function updateFacilityStatusUI(facility, status) {
    const facilityCards = document.querySelectorAll('.facility-card');
    facilityCards.forEach(card => {
        const facilityName = card.dataset.facility;
        if (facilityName === facility) {
            if (status === 'unavailable') {
                card.classList.add('unavailable-facility');
                const bookButton = card.querySelector('.facility-button');
                if (bookButton) {
                    bookButton.disabled = true;
                    bookButton.textContent = 'Unavailable';
                    bookButton.classList.remove('facility-button');
                    bookButton.classList.add('unavailable-button');
                }
            } else {
                card.classList.remove('unavailable-facility');
                const bookButton = card.querySelector('.unavailable-button');
                if (bookButton) {
                    bookButton.disabled = false;
                    bookButton.textContent = 'Book Now';
                    bookButton.classList.remove('unavailable-button');
                    bookButton.classList.add('facility-button');
                }
            }
        }
    });
}

function initializeFacilityStatuses() {
    const statuses = getFacilityStatuses();
    Object.entries(statuses).forEach(([facility, status]) => {
        updateFacilityStatusUI(facility, status);
    });
}

// Service Request WebSocket
let serviceRequestSocket;

function connectServiceRequestWebSocket() {
    serviceRequestSocket = new WebSocket(`ws://${window.location.host}/ws/service-requests`);
    
    serviceRequestSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.type === 'new_service_request') {
            // Handle new service request notification
            showServiceRequestNotification(data.request);
        } else if (data.type === 'service_request_update') {
            // Handle service request update
            updateServiceRequestStatus(data.request);
        }
    };
    
    serviceRequestSocket.onclose = function() {
        // Reconnect after 5 seconds
        setTimeout(connectServiceRequestWebSocket, 5000);
    };
}

// Service Request Modal Functions
function openServiceRequestModal(serviceType, serviceIcon, price) {
    const modal = document.getElementById('maintenanceBookingModal');
    const serviceNameDisplay = document.getElementById('service-name-display');
    const serviceIconDisplay = document.getElementById('service-icon-display');
    const servicePriceDisplay = document.getElementById('service-price-display');
    
    serviceNameDisplay.textContent = serviceType;
    serviceIconDisplay.textContent = serviceIcon;
    servicePriceDisplay.textContent = `From $${price}/service`;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeServiceRequestModal() {
    const modal = document.getElementById('maintenanceBookingModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function nextStep(currentStep) {
    const currentStepElement = document.querySelector(`.booking-form-step[data-step="${currentStep}"]`);
    const nextStepElement = document.querySelector(`.booking-form-step[data-step="${currentStep + 1}"]`);
    
    if (currentStepElement && nextStepElement) {
        currentStepElement.classList.remove('active');
        nextStepElement.classList.add('active');
        
        // Update step indicator
        const currentIndicator = document.querySelector(`.booking-step[data-step="${currentStep}"]`);
        const nextIndicator = document.querySelector(`.booking-step[data-step="${currentStep + 1}"]`);
        
        if (currentIndicator && nextIndicator) {
            currentIndicator.classList.remove('active');
            nextIndicator.classList.add('active');
        }
    }
}

function prevStep(currentStep) {
    const currentStepElement = document.querySelector(`.booking-form-step[data-step="${currentStep}"]`);
    const prevStepElement = document.querySelector(`.booking-form-step[data-step="${currentStep - 1}"]`);
    
    if (currentStepElement && prevStepElement) {
        currentStepElement.classList.remove('active');
        prevStepElement.classList.add('active');
        
        // Update step indicator
        const currentIndicator = document.querySelector(`.booking-step[data-step="${currentStep}"]`);
        const prevIndicator = document.querySelector(`.booking-step[data-step="${currentStep - 1}"]`);
        
        if (currentIndicator && prevIndicator) {
            currentIndicator.classList.remove('active');
            prevIndicator.classList.add('active');
        }
    }
}

function confirmMaintenanceBooking() {
    const serviceType = document.getElementById('service-name-display').textContent;
    const serviceIcon = document.getElementById('service-icon-display').textContent;
    const price = parseFloat(document.getElementById('service-price-display').textContent.replace('From $', '').replace('/service', ''));
    const frequency = document.querySelector('.frequency-option.active').dataset.frequency;
    const scheduledDate = document.getElementById('service-date').value;
    const scheduledTime = document.getElementById('service-time').value;
    const notes = document.getElementById('service-notes').value;
    
    const requestData = {
        request_id: 0, // This will be auto-generated by the database
        user_id: currentUserId,
        service_type: serviceType,
        service_icon: serviceIcon,
        price: price,
        frequency: frequency,
        scheduled_date: new Date(scheduledDate).toISOString(),
        scheduled_time: scheduledTime,
        notes: notes,
        status: "Pending Approval",
        payment_status: "Unpaid",
        date_created: new Date().toISOString()
    };
    
    fetch('/Homeowner/CreateServiceRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Service Request Submitted',
                text: 'Your service request has been submitted successfully!',
                confirmButtonText: 'OK'
            }).then(() => {
                closeServiceRequestModal();
                // Reset form
                document.querySelector('.booking-form-step[data-step="1"]').classList.add('active');
                document.querySelector('.booking-form-step[data-step="2"]').classList.remove('active');
                document.querySelector('.booking-form-step[data-step="3"]').classList.remove('active');
                document.querySelector('.booking-step[data-step="1"]').classList.add('active');
                document.querySelector('.booking-step[data-step="2"]').classList.remove('active');
                document.querySelector('.booking-step[data-step="3"]').classList.remove('active');
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Failed to submit service request. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        console.error('Error submitting service request:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while submitting your request. Please try again.',
            confirmButtonText: 'OK'
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeFacilityStatuses();
    connectDashboardWebSocket();
    connectServiceRequestWebSocket();
    
    // Initialize Swiper for facilities
    var facilitiesSwiper = new Swiper('.facilitiesSwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            454: {
                slidesPerView: 1.2,
            },
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        }
    });

    // Get all thumbnail items
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    let currentThumbnailIndex = 0;
    
    // Function to change the active thumbnail and main image
    function changeActiveThumbnail(index) {
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');
        document.querySelector('.hero-image').src = thumbnails[index].getAttribute('data-image');
    }
    
    // Click event for manual thumbnail selection
    thumbnails.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentThumbnailIndex = index;
            changeActiveThumbnail(currentThumbnailIndex);
            clearInterval(thumbnailInterval);
            thumbnailInterval = setInterval(cycleThumbnails, 5000);
        });
    });
    
    // Function to cycle through thumbnails
    function cycleThumbnails() {
        currentThumbnailIndex = (currentThumbnailIndex + 1) % thumbnails.length;
        changeActiveThumbnail(currentThumbnailIndex);
    }
    
    // Start the automatic cycling (every 5 seconds)
    let thumbnailInterval = setInterval(cycleThumbnails, 5000);
    
    // Pause cycling when hovering over thumbnails
    const thumbnailContainer = document.querySelector('.thumbnail-container');
    thumbnailContainer.addEventListener('mouseenter', () => clearInterval(thumbnailInterval));
    thumbnailContainer.addEventListener('mouseleave', () => {
        thumbnailInterval = setInterval(cycleThumbnails, 5000);
    });

    // Set min date for date inputs to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('service-date').min = today;
    document.getElementById('facility-date').min = today;

    // Modal open/close functionality
    const maintenanceModal = document.getElementById('maintenanceBookingModal');
    const facilityModal = document.getElementById('facilityBookingModal');
    const closeButtons = document.querySelectorAll('.close-booking-modal');
    
    // Open maintenance modal when clicking Book Now buttons
    document.querySelectorAll('.book-service').forEach(button => {
        button.addEventListener('click', function() {
            const serviceType = this.dataset.service;
            const serviceIcon = this.dataset.icon;
            const price = this.dataset.price;
            openServiceRequestModal(serviceType, serviceIcon, price);
        });
    });
    
   // Modify the facility button click handler
    document.querySelectorAll('.facility-button').forEach(button => {
        button.addEventListener('click', function() {
            const facilityName = this.getAttribute('data-facility');
            const facilityPrice = this.getAttribute('data-price');
            const facilityIcon = this.getAttribute('data-icon');
            const hourlyRate = this.getAttribute('data-hourly');
            const maxGuests = this.getAttribute('data-max-guests');
            
            document.getElementById('facility-name-display').textContent = facilityName;
            document.getElementById('facility-price-display').textContent = `Starting at $${facilityPrice}/event`;
            document.getElementById('facility-icon-display').textContent = facilityIcon;
            document.getElementById('facilityBookingModal').setAttribute('data-hourly-rate', hourlyRate);
            document.getElementById('facilityBookingModal').setAttribute('data-max-guests', maxGuests);
            
            // Set default guests to minimum (1) or facility minimum if applicable
            document.getElementById('facility-guests').value = '1';
            
            resetSteps('facility');
            facilityModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            maintenanceModal.style.display = 'none';
            facilityModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close when clicking outside modal
    window.addEventListener('click', function(e) {
        if (e.target === maintenanceModal) {
            maintenanceModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === facilityModal) {
            facilityModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Frequency option selection
    document.querySelectorAll('.frequency-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.frequency-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            updateBookingSummary();
        });
    });

    // Form inputs change
    document.querySelectorAll('#service-date, #service-time, #service-notes, #facility-date, #facility-time, #facility-duration, #facility-guests, #facility-purpose').forEach(input => {
        input.addEventListener('change', updateBookingSummary);
    });
});

function resetSteps(modalType) {
    const steps = document.querySelectorAll(`#${modalType}BookingModal .booking-step`);
    steps.forEach(step => step.classList.remove('active', 'completed'));
    steps[0].classList.add('active');
    
    const formSteps = document.querySelectorAll(`#${modalType}BookingModal .booking-form-step`);
    formSteps.forEach(step => step.classList.remove('active'));
    document.querySelector(`#${modalType}BookingModal .booking-form-step[data-step="1"]`).classList.add('active');
}

function updateBookingSummary() {
    // Maintenance summary
    const serviceName = document.getElementById('service-name-display').textContent;
    const servicePrice = parseFloat(document.getElementById('service-price-display').textContent.replace(/[^0-9.]/g, ''));
    const date = document.getElementById('service-date').value;
    const time = document.getElementById('service-time').value;
    const frequency = document.querySelector('.frequency-option.active').dataset.frequency;
    const notes = document.getElementById('service-notes').value;
    
    document.getElementById('summary-service').textContent = serviceName;
    document.getElementById('summary-date').textContent = date || '-';
    document.getElementById('summary-time').textContent = time || '-';
    document.getElementById('summary-frequency').textContent = 
        frequency === 'once' ? 'One-time' : 
        frequency === 'weekly' ? 'Weekly' : 
        frequency === 'biweekly' ? 'Bi-weekly' : 'Monthly';
    document.getElementById('summary-notes').textContent = notes || '-';
    
    let total = servicePrice;
    if (frequency === 'weekly') total *= 4;
    if (frequency === 'biweekly') total *= 2;
    document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
    
    // Facility summary
    const facilityName = document.getElementById('facility-name-display').textContent;
    const facilityDate = document.getElementById('facility-date').value;
    const duration = document.getElementById('facility-duration').value;
    const guests = document.getElementById('facility-guests').value;
    const purpose = document.getElementById('facility-purpose').value;
    const timeFacility = document.getElementById('facility-time').value;
    const hourlyRate = parseFloat(document.getElementById('facilityBookingModal').getAttribute('data-hourly-rate'));
    
    document.getElementById('facility-summary-name').textContent = facilityName;
    document.getElementById('facility-summary-date').textContent = facilityDate || '-';
    document.getElementById('facility-summary-time').textContent = timeFacility || '-';
    document.getElementById('facility-summary-duration').textContent = `${duration} hour${duration > 1 ? 's' : ''}`;
    document.getElementById('facility-summary-guests').textContent = guests;
    document.getElementById('facility-summary-purpose').textContent = purpose || '-';
    
    const totalFacility = hourlyRate * duration;
    document.getElementById('facility-summary-total').textContent = `$${totalFacility.toFixed(2)}`;
}

function confirmFacilityBooking() {
    const facilityName = document.getElementById('facility-name-display').textContent;
    const date = document.getElementById('facility-date').value;
    const duration = document.getElementById('facility-duration').value;
    const guests = document.getElementById('facility-guests').value;
    const purpose = document.getElementById('facility-purpose').value;
    const time = document.getElementById('facility-time').value;
    const price = document.getElementById('facility-summary-total').textContent;
    
    Swal.fire({
        title: 'Confirm Booking',
        html: `You're about to book:<br><br>
               <b>${facilityName}</b><br>
               Date: ${date}<br>
               Time: ${time}<br>
               Duration: ${duration} hour${duration > 1 ? 's' : ''}<br>
               Guests: ${guests}<br>
               Purpose: ${purpose}<br>
               Total: ${price}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, confirm booking'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Booked!', 'Your facility reservation has been confirmed.', 'success');
            
            // Reset facility form fields
            document.getElementById('facility-purpose').value = '';
            document.getElementById('facility-guests').value = '10';
            document.getElementById('facility-date').value = '';
            document.getElementById('facility-time').value = '';
            document.getElementById('facility-duration').value = '1';
            
            document.getElementById('facilityBookingModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}
