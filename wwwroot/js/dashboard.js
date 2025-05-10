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
let serviceRequestRetryCount = 0;
const serviceRequestMaxRetries = 5;
const serviceRequestRetryDelay = 3000;
let wsConnected = false;

function connectServiceRequestWebSocket() {
    if (serviceRequestSocket && (serviceRequestSocket.readyState === WebSocket.OPEN || serviceRequestSocket.readyState === WebSocket.CONNECTING)) {
        return; // Already connected or connecting
    }

    try {
        // Skip websocket connection if on certain pages where it's not needed
        if (!document.getElementById('maintenanceBookingModal')) {
            console.log('Skipping service request WebSocket on this page');
            return;
        }
        
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const host = window.location.host;
        
        // Connect to WebSocket
        serviceRequestSocket = new WebSocket(`${protocol}${host}/ws/homeowner/service-requests`);
        
        serviceRequestSocket.onopen = function() {
            console.log('Service Request WebSocket connection established');
            wsConnected = true;
            serviceRequestRetryCount = 0;
        };
        
        serviceRequestSocket.onmessage = function(event) {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'new_service_request') {
                    // Handle new service request notification
                    showServiceRequestNotification(data.request);
                } else if (data.type === 'service_request_update') {
                    // Handle service request update
                    updateServiceRequestStatus(data.request);
                }
            } catch (error) {
                console.error('Error processing service request message:', error);
            }
        };
        
        serviceRequestSocket.onerror = function(error) {
            console.error('Service Request WebSocket error:', error);
            wsConnected = false;
        };
        
        serviceRequestSocket.onclose = function(event) {
            console.log('Service Request WebSocket connection closed', event.code, event.reason);
            wsConnected = false;
            if (serviceRequestRetryCount < serviceRequestMaxRetries) {
                console.log(`Attempting to reconnect (${serviceRequestRetryCount + 1}/${serviceRequestMaxRetries})...`);
                serviceRequestRetryCount++;
                setTimeout(connectServiceRequestWebSocket, serviceRequestRetryDelay);
            } else {
                console.log('Max retries reached for WebSocket, functionality will continue without real-time updates');
            }
        };
    } catch (error) {
        console.error('Service Request WebSocket initialization failed:', error);
        wsConnected = false;
        if (serviceRequestRetryCount < serviceRequestMaxRetries) {
            serviceRequestRetryCount++;
            setTimeout(connectServiceRequestWebSocket, serviceRequestRetryDelay);
        }
    }
}

// Keep WebSocket alive
setInterval(() => {
    if (serviceRequestSocket && wsConnected && serviceRequestSocket.readyState === WebSocket.OPEN) {
        serviceRequestSocket.send(JSON.stringify({ type: 'ping' }));
    } else if (!wsConnected && serviceRequestRetryCount < serviceRequestMaxRetries) {
        connectServiceRequestWebSocket();
    }
}, 30000); // Every 30 seconds

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

function nextStep(currentStep, modalType = 'maintenance') {
    console.log(`nextStep called with currentStep=${currentStep}, modalType=${modalType}`);
    
    // Debug direct element access
    if (modalType === 'facility') {
        console.log("Trying to find facility elements directly by ID:");
        const step1 = document.getElementById('facility-step-1');
        const step2 = document.getElementById('facility-step-2');
        const step3 = document.getElementById('facility-step-3');
        console.log("facility-step-1:", step1);
        console.log("facility-step-2:", step2);
        console.log("facility-step-3:", step3);
        
        // Try alternative selectors
        console.log("Trying alternative selectors:");
        const alt1 = document.querySelector('#facilityBookingModal .booking-form-step[data-step="1"]');
        const alt2 = document.querySelector('#facilityBookingModal .booking-form-step[data-step="2"]');
        const alt3 = document.querySelector('#facilityBookingModal .booking-form-step[data-step="3"]');
        console.log("Alt selector 1:", alt1);
        console.log("Alt selector 2:", alt2);
        console.log("Alt selector 3:", alt3);
    }
    
    let currentStepElement, nextStepElement;
    
    if (modalType === 'facility') {
        // Try direct selector first
        currentStepElement = document.querySelector(`#facilityBookingModal .booking-form-step[data-step="${currentStep}"]`);
        nextStepElement = document.querySelector(`#facilityBookingModal .booking-form-step[data-step="${currentStep + 1}"]`);
        
        // If that fails, try by ID
        if (!currentStepElement) {
            currentStepElement = document.getElementById(`facility-step-${currentStep}`);
        }
        if (!nextStepElement) {
            nextStepElement = document.getElementById(`facility-step-${currentStep + 1}`);
        }
    } else {
        // Use the original selector for maintenance steps
        currentStepElement = document.querySelector(`#${modalType}BookingModal .booking-form-step[data-step="${currentStep}"]`);
        nextStepElement = document.querySelector(`#${modalType}BookingModal .booking-form-step[data-step="${currentStep + 1}"]`);
    }
    
    console.log('Current step element:', currentStepElement);
    console.log('Next step element:', nextStepElement);
    
    if (currentStepElement && nextStepElement) {
        // Validate the current step before moving to the next
        if (modalType === 'facility' && currentStep === 1) {
            console.log('Validating facility step 1');
            // Validate facility booking step 1
            const guests = document.getElementById('facility-guests').value;
            const purpose = document.getElementById('facility-purpose').value.trim();
            
            console.log('Guests:', guests);
            console.log('Purpose:', purpose);
            
            if (!purpose) {
                Swal.fire('Missing Information', 'Please provide the purpose of your reservation.', 'warning');
                return;
            }
            
            if (!guests || isNaN(guests) || guests < 1) {
                Swal.fire('Invalid Input', 'Please enter a valid number of guests.', 'warning');
                return;
            }
        } else if (modalType === 'facility' && currentStep === 2) {
            console.log('Validating facility step 2');
            // Validate facility booking step 2
            const date = document.getElementById('facility-date').value;
            const time = document.getElementById('facility-time').value;
            
            console.log('Date:', date);
            console.log('Time:', time);
            
            if (!date) {
                Swal.fire('Missing Information', 'Please select a date for your reservation.', 'warning');
                return;
            }
            
            if (!time) {
                Swal.fire('Missing Information', 'Please select a time for your reservation.', 'warning');
                return;
            }
        } else if (currentStep === 1) {
            // Validate service booking step 1
            // No validation needed for service step 1
            console.log('No validation needed for maintenance step 1');
        } else if (currentStep === 2) {
            console.log('Validating maintenance step 2');
            // Validate service booking step 2
            const date = document.getElementById('service-date').value;
            const time = document.getElementById('service-time').value;
            
            console.log('Date:', date);
            console.log('Time:', time);
            
            if (!date) {
                Swal.fire('Missing Information', 'Please select a date for your service.', 'warning');
                return;
            }
            
            if (!time) {
                Swal.fire('Missing Information', 'Please select a time for your service.', 'warning');
                return;
            }
        }
        
        console.log('Validation passed, moving to next step');
        
        currentStepElement.classList.remove('active');
        nextStepElement.classList.add('active');
        
        // Update step indicator
        let currentIndicator, nextIndicator;
        
        if (modalType === 'facility') {
            currentIndicator = document.querySelector(`#facilityBookingModal .booking-step[data-step="${currentStep}"]`);
            nextIndicator = document.querySelector(`#facilityBookingModal .booking-step[data-step="${currentStep + 1}"]`);
        } else {
            currentIndicator = document.querySelector(`#${modalType}BookingModal .booking-step[data-step="${currentStep}"]`);
            nextIndicator = document.querySelector(`#${modalType}BookingModal .booking-step[data-step="${currentStep + 1}"]`);
        }
        
        console.log('Current indicator:', currentIndicator);
        console.log('Next indicator:', nextIndicator);
        
        if (currentIndicator && nextIndicator) {
            currentIndicator.classList.remove('active');
            currentIndicator.classList.add('completed');
            nextIndicator.classList.add('active');
        }
        
        // Update booking summary if moving to confirmation step
        if (currentStep + 1 === 3) {
            updateBookingSummary();
        }
    } else {
        console.error(`Could not find step elements: currentStep=${currentStep}, modalType=${modalType}`);
        // Emergency fallback - try direct manipulation of classes by index
        if (modalType === 'facility') {
            console.log("Trying emergency fallback with direct class manipulation");
            const allSteps = document.querySelectorAll('#facilityBookingModal .booking-form-step');
            console.log("All steps found:", allSteps);
            
            if (allSteps.length >= currentStep + 1) {
                const currentIndex = currentStep - 1; // Arrays are 0-indexed
                const nextIndex = currentStep; // Next step is current+1, but arrays are 0-indexed
                
                console.log(`Using indexes: currentIndex=${currentIndex}, nextIndex=${nextIndex}`);
                
                allSteps.forEach(step => step.classList.remove('active'));
                allSteps[nextIndex].classList.add('active');
                
                // Also update indicators
                const allIndicators = document.querySelectorAll('#facilityBookingModal .booking-step');
                if (allIndicators.length >= currentStep + 1) {
                    allIndicators.forEach(ind => ind.classList.remove('active', 'completed'));
                    // Mark previous steps as completed
                    for (let i = 0; i < currentStep; i++) {
                        allIndicators[i].classList.add('completed');
                    }
                    allIndicators[nextIndex].classList.add('active');
                    
                    console.log("Step indicators updated");
                }
                
                // If moving to confirmation step, update summary
                if (currentStep + 1 === 3) {
                    updateFacilitySummary();
                    console.log("Facility summary updated");
                }
                
                console.log("Emergency fallback activated - step updated");
            }
        }
    }
}

function prevStep(currentStep, modalType = 'maintenance') {
    console.log(`prevStep called with currentStep=${currentStep}, modalType=${modalType}`);
    
    let currentStepElement, prevStepElement;
    
    if (modalType === 'facility') {
        // Try direct selector first
        currentStepElement = document.querySelector(`#facilityBookingModal .booking-form-step[data-step="${currentStep}"]`);
        prevStepElement = document.querySelector(`#facilityBookingModal .booking-form-step[data-step="${currentStep - 1}"]`);
        
        // If that fails, try by ID
        if (!currentStepElement) {
            currentStepElement = document.getElementById(`facility-step-${currentStep}`);
        }
        if (!prevStepElement) {
            prevStepElement = document.getElementById(`facility-step-${currentStep - 1}`);
        }
    } else {
        // Use the original selector for maintenance steps
        currentStepElement = document.querySelector(`#${modalType}BookingModal .booking-form-step[data-step="${currentStep}"]`);
        prevStepElement = document.querySelector(`#${modalType}BookingModal .booking-form-step[data-step="${currentStep - 1}"]`);
    }
    
    console.log('Current step element:', currentStepElement);
    console.log('Previous step element:', prevStepElement);
    
    if (currentStepElement && prevStepElement) {
        currentStepElement.classList.remove('active');
        prevStepElement.classList.add('active');
        
        // Update step indicator
        let currentIndicator, prevIndicator;
        
        if (modalType === 'facility') {
            currentIndicator = document.querySelector(`#facilityBookingModal .booking-step[data-step="${currentStep}"]`);
            prevIndicator = document.querySelector(`#facilityBookingModal .booking-step[data-step="${currentStep - 1}"]`);
        } else {
            currentIndicator = document.querySelector(`#${modalType}BookingModal .booking-step[data-step="${currentStep}"]`);
            prevIndicator = document.querySelector(`#${modalType}BookingModal .booking-step[data-step="${currentStep - 1}"]`);
        }
        
        console.log('Current indicator:', currentIndicator);
        console.log('Previous indicator:', prevIndicator);
        
        if (currentIndicator && prevIndicator) {
            currentIndicator.classList.remove('active');
            prevIndicator.classList.remove('completed');
            prevIndicator.classList.add('active');
        }
    } else {
        console.error(`Could not find step elements: currentStep=${currentStep}, modalType=${modalType}`);
        // Emergency fallback - try direct manipulation of classes by index
        if (modalType === 'facility') {
            console.log("Trying emergency fallback with direct class manipulation");
            const allSteps = document.querySelectorAll('#facilityBookingModal .booking-form-step');
            console.log("All steps found:", allSteps);
            
            if (allSteps.length >= currentStep) {
                const prevStepIndex = currentStep - 2; // Arrays are 0-indexed
                allSteps.forEach(step => step.classList.remove('active'));
                allSteps[prevStepIndex].classList.add('active');
                
                // Also update indicators
                const allIndicators = document.querySelectorAll('#facilityBookingModal .booking-step');
                if (allIndicators.length >= currentStep) {
                    allIndicators.forEach(ind => ind.classList.remove('active', 'completed'));
                    // Mark previous steps as completed
                    for (let i = 0; i < currentStep - 1; i++) {
                        allIndicators[i].classList.add('completed');
                    }
                    allIndicators[currentStep - 2].classList.add('active');
                }
                
                console.log("Emergency fallback activated - step updated");
            }
        }
    }
}

function confirmMaintenanceBooking() {
    const serviceType = document.getElementById('service-name-display').textContent;
    const serviceIcon = document.getElementById('service-icon-display').textContent;
    const price = parseFloat(document.getElementById('service-price-display').textContent.replace(/[^0-9.]/g, ''));
    const frequency = document.querySelector('.frequency-option.active').dataset.frequency;
    const scheduledDate = document.getElementById('service-date').value;
    const scheduledTime = document.getElementById('service-time').value;
    const notes = document.getElementById('service-notes').value;
    
    // Validate inputs
    if (!scheduledDate) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please select a date for your service',
        });
        return;
    }
    
    if (!scheduledTime) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please select a time for your service',
        });
        return;
    }
    
    // Show loading state
    Swal.fire({
        title: 'Submitting request...',
        text: 'Please wait',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    const requestData = {
        request_id: 0,
        user_id: currentUserId,
        service_type: serviceType,
        service_icon: serviceIcon,
        price: price,
        frequency: frequency,
        scheduled_date: new Date(scheduledDate).toISOString(),
        scheduled_time: scheduledTime,
        notes: notes || '',
        status: 'Pending Approval',
        payment_status: 'Unpaid'
    };
    
    // Log the data being sent
    console.log('Submitting service request:', requestData);
    
    fetch('/Homeowner/CreateServiceRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(async response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        // Check if the response has content and is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json().then(data => ({
                ok: response.ok,
                data: data
            }));
        } else {
            // If the response is not JSON, convert it to a JSON object with an error message
            return response.text().then(text => {
                console.log('Non-JSON response:', text);
                return { success: false, message: 'Unexpected response from server' };
            });
        }
    })
    .then(result => {
        if (result.ok && result.data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: result.data.message || 'Your service request has been submitted successfully!',
                confirmButtonText: 'OK'
            }).then(() => {
                closeServiceRequestModal();
                resetMaintenanceForm();
            });
        } else {
            let errorMessage = 'Failed to submit service request. Please try again.';
            if (result.data && typeof result.data === 'object') {
                errorMessage = result.data.message || result.data.details || errorMessage;
            } else if (typeof result.data === 'string') {
                try {
                    const parsed = JSON.parse(result.data);
                    errorMessage = parsed.message || parsed.details || result.data;
                } catch {
                    errorMessage = result.data;
                }
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        console.error('Error submitting service request:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'An error occurred while submitting your request. Please try again.',
            confirmButtonText: 'OK'
        });
    });
}

function resetMaintenanceForm() {
    // Reset form steps
    document.querySelector('.booking-form-step[data-step="1"]').classList.add('active');
    document.querySelector('.booking-form-step[data-step="2"]').classList.remove('active');
    document.querySelector('.booking-form-step[data-step="3"]').classList.remove('active');
    
    // Reset step indicators
    document.querySelector('.booking-step[data-step="1"]').classList.add('active');
    document.querySelector('.booking-step[data-step="2"]').classList.remove('active');
    document.querySelector('.booking-step[data-step="3"]').classList.remove('active');
    
    // Reset form inputs
    const serviceDate = document.getElementById('service-date');
    const serviceTime = document.getElementById('service-time');
    const serviceNotes = document.getElementById('service-notes');
    
    if (serviceDate) serviceDate.value = '';
    if (serviceTime) serviceTime.value = '';
    if (serviceNotes) serviceNotes.value = '';
    
    // Reset frequency selection
    const frequencyOptions = document.querySelectorAll('.frequency-option');
    frequencyOptions.forEach(opt => opt.classList.remove('active'));
    if (frequencyOptions.length > 0) {
        frequencyOptions[0].classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeFacilityStatuses();
    connectDashboardWebSocket();
    connectServiceRequestWebSocket();
    
    // Load rent payment info
    const propertyCard = document.querySelector('.property-card');
    if (propertyCard) {
        loadRentPaymentInfo();
    }
    
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
    
    // Call the specific facility summary update function for facility bookings
    updateFacilitySummary();
}

function confirmFacilityBooking() {
    const facilityName = document.getElementById('facility-name-display').textContent;
    const date = document.getElementById('facility-date').value;
    const duration = parseInt(document.getElementById('facility-duration').value);
    const guests = parseInt(document.getElementById('facility-guests').value);
    const purpose = document.getElementById('facility-purpose').value;
    const time = document.getElementById('facility-time').value;
    const priceText = document.getElementById('facility-summary-total').textContent.replace('$', '');
    const price = parseFloat(priceText);
    
    // Validation
    if (!date) {
        Swal.fire('Missing Information', 'Please select a date for your reservation.', 'warning');
        return;
    }
    
    if (!time) {
        Swal.fire('Missing Information', 'Please select a time for your reservation.', 'warning');
        return;
    }
    
    if (!purpose) {
        Swal.fire('Missing Information', 'Please provide the purpose of your reservation.', 'warning');
        return;
    }
    
    // Get facility ID based on the name
    let facilityId = 1; // Default to Function Hall
    if (facilityName === 'Sport Court') facilityId = 2;
    if (facilityName === 'Swimming Pool') facilityId = 3;
    if (facilityName === 'Fitness Gym') facilityId = 4;
    
    // Get current user ID from session storage
    const userId = parseInt(sessionStorage.getItem('user_id') || currentUserId);
    
    if (!userId || userId <= 0) {
        Swal.fire('Error', 'User not authenticated. Please log in and try again.', 'error');
        return;
    }
    
    Swal.fire({
        title: 'Confirm Booking',
        html: `You're about to book:<br><br>
               <b>${facilityName}</b><br>
               Date: ${date}<br>
               Time: ${time}<br>
               Duration: ${duration} hour${duration > 1 ? 's' : ''}<br>
               Guests: ${guests}<br>
               Purpose: ${purpose}<br>
               Total: $${price.toFixed(2)}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, confirm booking'
    }).then((result) => {
        if (result.isConfirmed) {
            // Show loading state
            Swal.fire({
                title: 'Processing...',
                text: 'Creating your facility reservation',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Prepare reservation data
            const reservation = {
                user_id: userId,
                facility_id: facilityId,
                reservation_date: date,  // Already in YYYY-MM-DD format
                reservation_time: time,
                duration_hours: duration,
                guest_count: guests,
                purpose: purpose,
                price: price
            };
            
            console.log('Sending reservation data:', reservation);
            
            // Send reservation data to server
            fetch('/Homeowner/CreateFacilityReservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reservation)
            })
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                
                // Check if the response has content and is JSON
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    // If the response is not JSON, convert it to a JSON object with an error message
                    return response.text().then(text => {
                        console.log('Non-JSON response:', text);
                        return { success: false, message: 'Unexpected response from server' };
                    });
                }
            })
            .then(data => {
                console.log('Response data:', data);
                if (data.success) {
                    Swal.fire({
                        title: 'Booked!',
                        text: 'Your facility reservation has been created successfully with status "Pending". Please complete payment in the Payment page to approve it.',
                        icon: 'success',
                        confirmButtonText: 'Go to Payment',
                        showCancelButton: true,
                        cancelButtonText: 'Stay Here'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/Homeowner/Payment';
                        } else {
                            // Reset facility form fields
                            resetFacilityForm();
                        }
                    });
                } else {
                    Swal.fire('Error', data.message || 'Failed to create reservation. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Error creating reservation:', error);
                Swal.fire('Error', 'An unexpected error occurred. Please try again.', 'error');
            });
        }
    });
}

function resetFacilityForm() {
    document.getElementById('facility-purpose').value = '';
    document.getElementById('facility-guests').value = '10';
    document.getElementById('facility-date').value = '';
    document.getElementById('facility-time').value = '';
    document.getElementById('facility-duration').value = '1';
    
    document.getElementById('facilityBookingModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Add notification function if it doesn't exist
function showServiceRequestNotification(request) {
    try {
        if (!request) return;
        
        Swal.fire({
            icon: 'info',
            title: 'Service Request Update',
            text: `Your ${request.service_type} request has been updated.`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

function updateServiceRequestStatus(request) {
    try {
        if (!request) return;
        
        // Update UI if needed
        const requestElement = document.querySelector(`.service-request-item[data-id="${request.id}"]`);
        if (requestElement) {
            const statusBadge = requestElement.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.textContent = request.status;
                statusBadge.className = `status-badge ${getStatusClass(request.status)}`;
            }
            
            const paymentBadge = requestElement.querySelector('.payment-badge');
            if (paymentBadge) {
                paymentBadge.textContent = request.payment_status;
                paymentBadge.className = `payment-badge ${request.payment_status === 'Paid' ? 'paid' : 'unpaid'}`;
            }
        }
    } catch (error) {
        console.error('Error updating request status:', error);
    }
}

function getStatusClass(status) {
    switch(status) {
        case 'Pending Approval': return 'pending';
        case 'Approved': return 'approved';
        case 'Rejected': return 'rejected';
        case 'Completed': return 'completed';
        default: return '';
    }
}

// Function to update facility booking summary
function updateFacilitySummary() {
    console.log("Updating facility booking summary");
    
    const facilityName = document.getElementById('facility-name-display').textContent;
    const date = document.getElementById('facility-date').value;
    const time = document.getElementById('facility-time').value;
    const duration = document.getElementById('facility-duration').value;
    const guests = document.getElementById('facility-guests').value;
    const purpose = document.getElementById('facility-purpose').value;
    
    // Format date and time for display
    let formattedDate = "-";
    if (date) {
        const dateObj = new Date(date);
        formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    let formattedTime = "-";
    if (time) {
        const [hours, minutes] = time.split(':');
        const timeObj = new Date();
        timeObj.setHours(hours);
        timeObj.setMinutes(minutes);
        formattedTime = timeObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    
    // Format duration
    let formattedDuration = "-";
    if (duration) {
        if (duration === "5") {
            formattedDuration = "5+ hours (custom)";
        } else {
            formattedDuration = `${duration} hour${duration > 1 ? 's' : ''}`;
        }
    }
    
    // Update summary fields
    document.getElementById('facility-summary-name').textContent = facilityName;
    document.getElementById('facility-summary-date').textContent = formattedDate;
    document.getElementById('facility-summary-time').textContent = formattedTime;
    document.getElementById('facility-summary-duration').textContent = formattedDuration;
    document.getElementById('facility-summary-guests').textContent = guests || "-";
    document.getElementById('facility-summary-purpose').textContent = purpose || "-";
    
    // Calculate and update total price
    const facilityCard = document.querySelector('.facility-button[data-facility="' + facilityName + '"]');
    if (facilityCard) {
        const basePrice = parseFloat(facilityCard.getAttribute('data-price'));
        const hourlyRate = parseFloat(facilityCard.getAttribute('data-hourly'));
        
        let totalPrice = basePrice; // Start with base price
        
        // Add hourly rate for additional hours beyond the first
        if (duration && parseInt(duration) > 1) {
            if (duration === "5") {
                // For 5+ hours, charge for 4 additional hours
                totalPrice += (hourlyRate * 4);
            } else {
                // For regular durations (2-4 hours), charge for additional hours
                totalPrice += (hourlyRate * (parseInt(duration) - 1));
            }
        }
        
        document.getElementById('facility-summary-total').textContent = `$${totalPrice.toFixed(2)}`;
    } else {
        console.log("Facility card not found for:", facilityName);
    }
    
    console.log("Facility summary updated successfully");
}

// Function to fetch current rent payment info and update the dashboard
async function loadRentPaymentInfo() {
    try {
        const response = await fetch('/Homeowner/GetCurrentRentPayment');
        const data = await response.json();
        
        if (data.success) {
            // Update the dashboard with rent payment info
            document.getElementById('monthlyPayment').textContent = `$${data.rentPayment.amount.toLocaleString()}`;
            
            // Update payment status
            const paymentStatusElement = document.getElementById('paymentStatus');
            paymentStatusElement.textContent = data.rentPayment.status;
            
            // Apply appropriate class based on payment status
            if (data.rentPayment.status === 'Paid') {
                paymentStatusElement.className = 'meta-value status-paid';
            } else {
                paymentStatusElement.className = 'meta-value status-unpaid';
            }
            
            // Update next due date
            document.getElementById('nextDueDate').textContent = data.rentPayment.dueDate;
        } else {
            console.error('Failed to load rent payment information:', data.message);
        }
    } catch (error) {
        console.error('Error fetching rent payment information:', error);
    }
}
