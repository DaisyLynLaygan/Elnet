// WebSocket connection
let ws = null;
let wsConnected = false;
let wsRetryCount = 0;
const wsMaxRetries = 5;
const wsRetryDelay = 3000;

// Filter and pagination state
let currentFilters = {
    status: 'all',
    serviceType: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    startDate: null,
    endDate: null
};
let currentPage = 1;
let totalPages = 1;
let isLoading = false;
let isInitialLoad = true;

// DOM Elements
const tableBody = document.getElementById('serviceRequestsTableBody');
const pagination = document.getElementById('pagination');
const modals = {
    serviceRequest: document.getElementById('serviceRequestModal'),
    rejection: document.getElementById('rejectionModal')
};

// Filter elements
const statusFilter = document.getElementById('statusFilter');
const serviceTypeFilter = document.getElementById('serviceTypeFilter');
const paymentFilter = document.getElementById('paymentFilter');
const dateFilter = document.getElementById('dateFilter');
const customDateRange = document.getElementById('customDateRange');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');

// Modal action buttons
const approveRequestBtn = document.getElementById('approveRequestBtn');
const rejectRequestBtn = document.getElementById('rejectRequestBtn');
const markPaidBtn = document.getElementById('markPaidBtn');
const markCompleteBtn = document.getElementById('markCompleteBtn');
const confirmRejectionBtn = document.getElementById('confirmRejectionBtn');

// Rejection modal elements
const rejectionReason = document.getElementById('rejectionReason');
const customReasonGroup = document.getElementById('customReasonGroup');
const customReason = document.getElementById('customReason');

// Stats elements
const totalRequests = document.getElementById('totalRequests');
const pendingRequests = document.getElementById('pendingRequests');
const unpaidRequests = document.getElementById('unpaidRequests');
const completedRequests = document.getElementById('completedRequests');

// Current request being viewed
let currentRequestId = null;

// Initialize WebSocket connection
function initWebSocket() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        return; // Already connected or connecting
    }

    try {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        ws = new WebSocket(`${protocol}${window.location.host}/ws/admin/service-requests`);
        
        ws.onopen = function() {
            console.log('Service Request WebSocket connection established');
            wsConnected = true;
            wsRetryCount = 0;
            if (isInitialLoad) {
                loadServiceRequests();
                isInitialLoad = false;
            }
        };
        
        ws.onmessage = function(event) {
            try {
                const data = JSON.parse(event.data);
                console.log('Received WebSocket message:', data);
                
                if (data.type === 'new_service_request') {
                    // Format the request data to match the table structure
                    const formattedRequest = {
                        request_id: data.request.id || data.request.request_id,
                        service_type: data.request.serviceType || data.request.service_type,
                        service_icon: data.request.serviceIcon || data.request.service_icon,
                        scheduled_date: data.request.scheduledDate || data.request.scheduled_date,
                        scheduled_time: data.request.scheduledTime || data.request.scheduled_time,
                        status: data.request.status || 'Pending Approval',
                        payment_status: data.request.paymentStatus || data.request.payment_status || 'Unpaid',
                        price: data.request.price,
                        frequency: data.request.frequency,
                        notes: data.request.notes,
                        user: {
                            firstname: data.request.user.firstname || (data.request.user.name ? data.request.user.name.split(' ')[0] : ''),
                            lastname: data.request.user.lastname || (data.request.user.name ? data.request.user.name.split(' ')[1] : ''),
                            email: data.request.user.email,
                            contact_no: data.request.user.contact_no || data.request.user.phone
                        }
                    };
                    
                    if (currentPage === 1) {
                        addNewRequestToTable(formattedRequest);
                    }
                    if (data.stats) {
                        updateStats(data.stats);
                    } else {
                        // If stats not provided, refresh them
                        loadServiceRequests();
                    }
                } else if (data.type === 'service_request_update') {
                    // Format the update data
                    const formattedUpdate = {
                        id: data.request.id || data.request.request_id,
                        status: data.request.status,
                        paymentStatus: data.request.paymentStatus || data.request.payment_status
                    };
                    updateRequestInTable(formattedUpdate);
                    if (data.stats) {
                        updateStats(data.stats);
                    }
                } else if (data.type === 'stats_update') {
                    updateStats(data.stats);
                } else if (data.type === 'pong') {
                    console.log('Received pong from server');
                }
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        };
        
        ws.onclose = function(event) {
            console.log('Service Request WebSocket connection closed', event.code, event.reason);
            wsConnected = false;
            if (wsRetryCount < wsMaxRetries) {
                console.log(`Attempting to reconnect (${wsRetryCount + 1}/${wsMaxRetries})...`);
                wsRetryCount++;
                setTimeout(initWebSocket, wsRetryDelay);
            } else {
                console.log('Max retries reached for WebSocket, functionality will continue without real-time updates');
            }
        };
        
        ws.onerror = function(error) {
            console.error('Service Request WebSocket error:', error);
            wsConnected = false;
        };
    } catch (error) {
        console.error('Service Request WebSocket initialization failed:', error);
        wsConnected = false;
        if (wsRetryCount < wsMaxRetries) {
            wsRetryCount++;
            setTimeout(initWebSocket, wsRetryDelay);
        }
    }
}

// Keep WebSocket alive
setInterval(() => {
    if (ws && wsConnected && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
    } else if (!wsConnected && wsRetryCount < wsMaxRetries) {
        initWebSocket();
    }
}, 30000); // Every 30 seconds

// Load service requests
async function loadServiceRequests() {
    if (isLoading) return;
    isLoading = true;

    try {
        const queryParams = new URLSearchParams({
            page: currentPage,
            status: currentFilters.status,
            serviceType: currentFilters.serviceType,
            paymentStatus: currentFilters.paymentStatus,
            dateRange: currentFilters.dateRange,
            startDate: currentFilters.startDate || '',
            endDate: currentFilters.endDate || ''
        });
        
        const response = await fetch(`/Admin/GetServiceRequests?${queryParams}`);
        const data = await response.json();
        
        if (data.success) {
            updateServiceRequestsTable(data.requests);
            updatePagination(data.pagination);
            updateStats(data.stats);
        } else {
            console.error('Error loading service requests:', data.message);
            showError(data.message || 'Failed to load service requests');
        }
    } catch (error) {
        console.error('Error loading service requests:', error);
        showError('Failed to load service requests');
    } finally {
        isLoading = false;
    }
}

// Update service requests table
function updateServiceRequestsTable(requests) {
    const tbody = document.getElementById('serviceRequestsTableBody');
    if (!tbody) return;

    tbody.innerHTML = requests.map(request => `
        <tr data-id="${request.request_id}">
            <td>#SR-${request.request_id}</td>
            <td>
                <div class="user-info">
                    <div class="user-avatar">${request.user.firstname.charAt(0)}${request.user.lastname.charAt(0)}</div>
                    <div class="user-details">
                        <h4>${request.user.firstname} ${request.user.lastname}</h4>
                        <p>${request.user.email}</p>
                    </div>
                </div>
            </td>
            <td>
                <div class="service-info">
                    <div class="service-icon">${request.service_icon}</div>
                    <span>${request.service_type}</span>
                </div>
            </td>
            <td>
                <div class="date-time">
                    <div class="date">${new Date(request.scheduled_date).toLocaleDateString()}</div>
                    <div class="time">${request.scheduled_time}</div>
                </div>
            </td>
            <td><span class="badge ${getStatusClass(request.status)}">${request.status}</span></td>
            <td><span class="badge ${request.payment_status === 'Paid' ? 'success' : 'danger'}">${request.payment_status}</span></td>
            <td>
                <button class="btn-icon view-details" title="View Details" data-id="${request.request_id}">
                    <i class="fas fa-eye"></i>
                </button>
                ${request.status === 'Pending Approval' ? `
                    <button class="btn-icon reject-request" title="Reject" data-id="${request.request_id}">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');

    // Add event listeners to the new buttons
    addEventListeners();
}

// Update pagination
function updatePagination(pagination) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    totalPages = pagination.totalPages;
    currentPage = pagination.currentPage;

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <button class="pagination-btn ${currentPage <= 1 ? 'disabled' : ''}" 
                data-page="${currentPage - 1}" 
                ${currentPage <= 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Previous
        </button>
    `;

    // Page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    if (startPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" data-page="1">1</button>
            ${startPage > 2 ? '<span class="pagination-ellipsis">...</span>' : ''}
        `;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    data-page="${i}">
                ${i}
            </button>
        `;
    }

    if (endPage < totalPages) {
        paginationHTML += `
            ${endPage < totalPages - 1 ? '<span class="pagination-ellipsis">...</span>' : ''}
            <button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>
        `;
    }

    // Next button
    paginationHTML += `
        <button class="pagination-btn ${currentPage >= totalPages ? 'disabled' : ''}" 
                data-page="${currentPage + 1}" 
                ${currentPage >= totalPages ? 'disabled' : ''}>
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;

    paginationContainer.innerHTML = paginationHTML;

    // Add event listeners to pagination buttons
    document.querySelectorAll('.pagination-btn:not(.disabled)').forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('disabled')) return;
            currentPage = parseInt(this.getAttribute('data-page'));
            loadServiceRequests();
        });
    });
}

// Update stats
function updateStats(stats) {
    if (!stats) return;

    if (totalRequests) totalRequests.textContent = stats.total;
    if (pendingRequests) pendingRequests.textContent = stats.pending;
    if (unpaidRequests) unpaidRequests.textContent = stats.unpaid;
    if (completedRequests) completedRequests.textContent = stats.completed;
}

// Get status class for badge
function getStatusClass(status) {
    switch(status) {
        case 'Pending Approval': return 'warning';
        case 'Approved': return 'primary';
        case 'Rejected': return 'danger';
        case 'Completed': return 'success';
        default: return 'secondary';
    }
}

// Initialize filters
function initializeFilters() {
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            currentPage = 1;
            loadServiceRequests();
        });
    }

    if (serviceTypeFilter) {
        serviceTypeFilter.addEventListener('change', function() {
            currentFilters.serviceType = this.value;
            currentPage = 1;
            loadServiceRequests();
        });
    }

    if (paymentFilter) {
        paymentFilter.addEventListener('change', function() {
            currentFilters.paymentStatus = this.value;
            currentPage = 1;
            loadServiceRequests();
        });
    }

    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            currentFilters.dateRange = this.value;
            if (this.value === 'custom') {
                customDateRange.style.display = 'flex';
            } else {
                customDateRange.style.display = 'none';
                currentFilters.startDate = null;
                currentFilters.endDate = null;
                currentPage = 1;
                loadServiceRequests();
            }
        });
    }

    if (startDate) {
        startDate.addEventListener('change', function() {
            currentFilters.startDate = this.value;
            if (currentFilters.endDate) {
                currentPage = 1;
                loadServiceRequests();
            }
        });
    }

    if (endDate) {
        endDate.addEventListener('change', function() {
            currentFilters.endDate = this.value;
            if (currentFilters.startDate) {
                currentPage = 1;
                loadServiceRequests();
            }
        });
    }
}

// Add event listeners to table buttons
function addEventListeners() {
    // View details button click
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const requestId = this.getAttribute('data-id');
            openServiceRequestModal(requestId);
        });
    });

    // Approve Request
    document.querySelectorAll('.approve-request').forEach(button => {
        button.addEventListener('click', async () => {
            const requestId = button.dataset.id;
            await approveRequest(requestId);
        });
    });

    // Reject Request
    document.querySelectorAll('.reject-request').forEach(button => {
        button.addEventListener('click', () => {
            const requestId = button.dataset.id;
            showRejectionModal(requestId);
        });
    });

    // Mark as Paid
    document.querySelectorAll('.mark-paid').forEach(button => {
        button.addEventListener('click', async () => {
            const requestId = button.dataset.id;
            await markRequestAsPaid(requestId);
        });
    });

    // Mark as Complete
    document.querySelectorAll('.mark-complete').forEach(button => {
        button.addEventListener('click', async () => {
            const requestId = button.dataset.id;
            await markRequestAsComplete(requestId);
        });
    });
}

// Modal handling functions
function openModal(modal) {
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
    }
}

function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.body.classList.remove('modal-open');
    }
}

// Add event listeners to all close modal buttons
function setupModalClosers() {
    // Close when clicking the X or close button
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) closeModal(modal);
        });
    });
    
    // Close when clicking outside the modal content
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal(this);
        });
    });
}

// API Calls
async function approveRequest(requestId) {
    try {
        const response = await fetch(`/Admin/ApproveServiceRequest/${requestId}`, {
            method: 'POST'
        });

        if (response.ok) {
            showSuccess('Service request approved successfully');
            closeModal(modals.serviceRequest);
            loadServiceRequests();
        } else {
            throw new Error('Failed to approve request');
        }
    } catch (error) {
        console.error('Error approving request:', error);
        showError('Failed to approve service request');
    }
}

function showRejectionModal(requestId) {
    currentRequestId = requestId;
    openModal(modals.rejection);
}

async function confirmRejection() {
    const reason = document.getElementById('rejectionReason').value;
    const customReason = document.getElementById('customReason').value;
    
    if (!reason) {
        showError('Please select a reason for rejection');
        return;
    }

    if (reason === 'other' && !customReason) {
        showError('Please specify the reason for rejection');
        return;
    }

    try {
        const response = await fetch(`/Admin/RejectServiceRequest/${currentRequestId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reason: reason === 'other' ? customReason : reason
            })
        });

        if (response.ok) {
            showSuccess('Service request rejected successfully');
            closeModal(modals.rejection);
            loadServiceRequests();
        } else {
            throw new Error('Failed to reject request');
        }
    } catch (error) {
        console.error('Error rejecting request:', error);
        showError('Failed to reject service request');
    }
}

async function markRequestAsPaid(requestId) {
    try {
        const response = await fetch(`/Admin/MarkServiceRequestAsPaid/${requestId}`, {
            method: 'POST'
        });

        if (response.ok) {
            showSuccess('Service request marked as paid');
            closeModal(modals.serviceRequest);
            loadServiceRequests();
        } else {
            throw new Error('Failed to mark request as paid');
        }
    } catch (error) {
        console.error('Error marking request as paid:', error);
        showError('Failed to mark service request as paid');
    }
}

async function markRequestAsComplete(requestId) {
    try {
        const response = await fetch(`/Admin/MarkServiceRequestAsComplete/${requestId}`, {
            method: 'POST'
        });

        if (response.ok) {
            showSuccess('Service request marked as complete');
            closeModal(modals.serviceRequest);
            loadServiceRequests();
        } else {
            throw new Error('Failed to mark request as complete');
        }
    } catch (error) {
        console.error('Error marking request as complete:', error);
        showError('Failed to mark service request as complete');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getPaymentClass(status) {
    return status === 'Paid' ? 'status-paid' : 'status-unpaid';
}

// Notification functions
function showSuccess(message) {
    // Only show success for important actions, not connections
    if (!message.includes('updates connected')) {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: message,
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }
}

function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load data immediately
    loadServiceRequests();
    
    // Initialize WebSocket after initial data load
    initWebSocket();
    
    // Initialize filters
    initializeFilters();
    
    // Set up modal close functionality
    setupModalClosers();
    
    // Add event listeners for modal buttons
    document.getElementById('approveRequestBtn')?.addEventListener('click', () => approveRequest(currentRequestId));
    document.getElementById('rejectRequestBtn')?.addEventListener('click', () => showRejectionModal(currentRequestId));
    document.getElementById('markPaidBtn')?.addEventListener('click', () => markRequestAsPaid(currentRequestId));
    document.getElementById('markCompleteBtn')?.addEventListener('click', () => markRequestAsComplete(currentRequestId));
    document.getElementById('confirmRejectionBtn')?.addEventListener('click', confirmRejection);
    
    // Add event listener for rejection reason selection
    document.getElementById('rejectionReason')?.addEventListener('change', (e) => {
        const customReasonGroup = document.getElementById('customReasonGroup');
        if (customReasonGroup) {
            customReasonGroup.style.display = e.target.value === 'other' ? 'block' : 'none';
        }
    });
});

// Add these helper functions
function addNewRequestToTable(request) {
    if (!request || !request.user) {
        console.error('Invalid request data:', request);
        return;
    }

    const tbody = document.getElementById('serviceRequestsTableBody');
    if (!tbody) return;

    const newRow = document.createElement('tr');
    newRow.setAttribute('data-id', request.request_id);
    
    const userInitials = `${(request.user.firstname || '').charAt(0)}${(request.user.lastname || '').charAt(0)}`;
    
    newRow.innerHTML = `
        <td>#SR-${request.request_id}</td>
        <td>
            <div class="user-info">
                <div class="user-avatar">${userInitials}</div>
                <div class="user-details">
                    <h4>${request.user.firstname} ${request.user.lastname}</h4>
                    <p>${request.user.email}</p>
                </div>
            </div>
        </td>
        <td>
            <div class="service-info">
                <div class="service-icon">${request.service_icon || '🔧'}</div>
                <span>${request.service_type}</span>
            </div>
        </td>
        <td>
            <div class="date-time">
                <div class="date">${new Date(request.scheduled_date).toLocaleDateString()}</div>
                <div class="time">${request.scheduled_time}</div>
            </div>
        </td>
        <td><span class="badge ${getStatusClass(request.status)}">${request.status}</span></td>
        <td><span class="badge ${request.payment_status === 'Paid' ? 'success' : 'danger'}">${request.payment_status}</span></td>
        <td>
            <button class="btn-icon view-details" title="View Details" data-id="${request.request_id}">
                <i class="fas fa-eye"></i>
            </button>
            ${request.status === 'Pending Approval' ? `
                <button class="btn-icon reject-request" title="Reject" data-id="${request.request_id}">
                    <i class="fas fa-times"></i>
                </button>
            ` : ''}
        </td>
    `;

    // Add the new row at the beginning of the table
    if (tbody.firstChild) {
        tbody.insertBefore(newRow, tbody.firstChild);
    } else {
        tbody.appendChild(newRow);
    }

    // Add event listeners to the new buttons
    addEventListenersToRow(newRow);
}

function updateRequestInTable(request) {
    const row = document.querySelector(`tr[data-id="${request.id}"]`);
    if (!row) {
        console.warn(`Request row with ID ${request.id} not found`);
        return;
    }

    // Update status badge
    const statusCell = row.querySelector('td:nth-child(5)');
    if (statusCell) {
        statusCell.innerHTML = `<span class="badge ${getStatusClass(request.status)}">${request.status}</span>`;
    }

    // Update payment status badge
    const paymentCell = row.querySelector('td:nth-child(6)');
    if (paymentCell) {
        paymentCell.innerHTML = `<span class="badge ${request.paymentStatus === 'Paid' ? 'success' : 'danger'}">${request.paymentStatus}</span>`;
    }

    // Update action buttons based on status
    const actionsCell = row.querySelector('td:nth-child(7)');
    if (actionsCell) {
        let buttonsHtml = `
            <button class="btn-icon view-details" title="View Details" data-id="${request.id}">
                <i class="fas fa-eye"></i>
            </button>
        `;

        if (request.status === 'Pending Approval') {
            buttonsHtml += `
                <button class="btn-icon reject-request" title="Reject" data-id="${request.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
        }

        actionsCell.innerHTML = buttonsHtml;
        addEventListenersToRow(row);
    }
}

function addEventListenersToRow(row) {
    // View details button
    const viewButton = row.querySelector('.view-details');
    if (viewButton) {
        viewButton.addEventListener('click', function() {
            const requestId = this.getAttribute('data-id');
            openServiceRequestModal(requestId);
        });
    }

    // Reject button
    const rejectButton = row.querySelector('.reject-request');
    if (rejectButton) {
        rejectButton.addEventListener('click', function() {
            const requestId = this.getAttribute('data-id');
            showRejectionModal(requestId);
        });
    }

    // Mark as paid button
    const markPaidButton = row.querySelector('.mark-paid');
    if (markPaidButton) {
        markPaidButton.addEventListener('click', function() {
            const requestId = this.getAttribute('data-id');
            markRequestAsPaid(requestId);
        });
    }

    // Mark as complete button
    const markCompleteButton = row.querySelector('.mark-complete');
    if (markCompleteButton) {
        markCompleteButton.addEventListener('click', function() {
            const requestId = this.getAttribute('data-id');
            markRequestAsComplete(requestId);
        });
    }
}

// Fetch and display service request details in modal
async function openServiceRequestModal(requestId) {
    if (!requestId) return;
    
    currentRequestId = requestId;
    
    try {
        const response = await fetch(`/Admin/GetServiceRequest/${requestId}`);
        const data = await response.json();
        
        if (data.success) {
            const request = data.request;
            const modalBody = document.querySelector('.modal-body .request-detail');
            
            if (modalBody) {
                modalBody.innerHTML = `
                    <div class="request-header">
                        <div class="request-id">#SR-${request.request_id}</div>
                        <div class="request-status">
                            <span class="badge ${getStatusClass(request.status)}">${request.status}</span>
                        </div>
                    </div>
                    
                    <div class="request-content">
                        <div class="request-section">
                            <h4>Homeowner Information</h4>
                            <div class="request-user">
                                <div class="user-avatar">${request.user.firstname.charAt(0)}${request.user.lastname.charAt(0)}</div>
                                <div class="user-details">
                                    <h4>${request.user.firstname} ${request.user.lastname}</h4>
                                    <p>${request.user.email}</p>
                                    <div class="user-contact">
                                        <i class="fas fa-phone"></i> ${request.user.contact_no || 'N/A'}<br>
                                        <i class="fas fa-envelope"></i> ${request.user.email}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="request-section">
                            <h4>Service Details</h4>
                            <div class="service-info">
                                <div class="service-icon">${request.service_icon}</div>
                                <div class="service-details">
                                    <h4>${request.service_type}</h4>
                                    <div class="service-meta">
                                        <span><strong>Price:</strong> $${request.price.toFixed(2)}</span>
                                        <span><strong>Frequency:</strong> ${request.frequency}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="request-section">
                            <h4>Request Information</h4>
                            <div class="request-meta">
                                <div class="meta-item">
                                    <label>Request Date:</label>
                                    <span>${new Date(request.date_created).toLocaleDateString()}</span>
                                </div>
                                <div class="meta-item">
                                    <label>Scheduled Date:</label>
                                    <span>${new Date(request.scheduled_date).toLocaleDateString()}</span>
                                </div>
                                <div class="meta-item">
                                    <label>Scheduled Time:</label>
                                    <span>${request.scheduled_time}</span>
                                </div>
                                <div class="meta-item">
                                    <label>Payment Status:</label>
                                    <span class="badge ${request.payment_status === 'Paid' ? 'success' : 'danger'}">${request.payment_status}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="request-section">
                            <h4>Special Instructions</h4>
                            <div class="special-instructions">
                                ${request.notes || 'No special instructions provided.'}
                            </div>
                        </div>
                    </div>
                `;
                
                // Show/hide action buttons based on status
                if (approveRequestBtn) approveRequestBtn.style.display = 'none';
                if (rejectRequestBtn) rejectRequestBtn.style.display = 'none';
                if (markPaidBtn) markPaidBtn.style.display = 'none';
                if (markCompleteBtn) markCompleteBtn.style.display = 'none';
                
                if (request.status === 'Pending Approval') {
                    if (approveRequestBtn) approveRequestBtn.style.display = 'inline-block';
                    if (rejectRequestBtn) rejectRequestBtn.style.display = 'inline-block';
                } else if (request.status === 'Approved' && request.payment_status === 'Unpaid') {
                    if (markPaidBtn) markPaidBtn.style.display = 'inline-block';
                } else if (request.status === 'Approved' && request.payment_status === 'Paid') {
                    if (markCompleteBtn) markCompleteBtn.style.display = 'inline-block';
                }
                
                // Open modal
                openModal(modals.serviceRequest);
            }
        } else {
            showError(data.message || 'Failed to load service request details');
        }
    } catch (error) {
        console.error('Error loading service request:', error);
        showError('Failed to load service request details');
    }
}
