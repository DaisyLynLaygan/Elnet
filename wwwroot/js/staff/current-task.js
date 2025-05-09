document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const facilityTasksTable = document.getElementById('facilityTasks');
    const serviceTasksTable = document.getElementById('serviceTasks');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const taskDetailsModal = document.getElementById('taskDetailsModal');
    const taskModalTitle = document.getElementById('taskModalTitle');
    const taskModalBody = document.getElementById('taskModalBody');
    const markTaskDoneBtn = document.getElementById('markTaskDoneBtn');
    const closeModalButtons = document.querySelectorAll('.close-modal, .close-modal-btn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const completionNotesField = document.getElementById('completionNotes');

    // State management
    let facilityTasks = [];
    let serviceTasks = [];
    let completedFacilityTasks = [];
    let completedServiceTasks = [];
    let currentTask = null;
    let currentFilter = 'in-progress';
    let isFacilityTask = false;

    // Initialize the page
    initializePage();

    // Function to initialize the page and load data
    async function initializePage() {
        await fetchTasks();
        renderTasks(currentFilter);
        setupEventListeners();
    }

    // Event Listeners
    function setupEventListeners() {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                renderTasks(currentFilter);
            });
        });

        markTaskDoneBtn.addEventListener('click', markTaskAsDone);

        closeModalButtons.forEach(btn => {
            btn.addEventListener('click', closeTaskModal);
        });

        taskDetailsModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeTaskModal();
            }
        });
    }

    // Functions
    async function fetchTasks() {
        showLoading(true);
        hideError();

        try {
            console.log("Fetching tasks from API...");
            
            // Fetch tasks from API
            const response = await fetch('/Staff/GetCurrentTasks');
            
            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                facilityTasks = data.facilityTasks || [];
                serviceTasks = data.serviceTasks || [];
                
                console.log(`Loaded ${facilityTasks.length} facility tasks and ${serviceTasks.length} service tasks`);
                
                // Filter completed tasks into separate arrays
                completedFacilityTasks = facilityTasks.filter(task => task.status.toLowerCase() === 'completed');
                completedServiceTasks = serviceTasks.filter(task => task.status.toLowerCase() === 'completed');
                
                // Filter in-progress tasks
                facilityTasks = facilityTasks.filter(task => task.status.toLowerCase() === 'in progress');
                serviceTasks = serviceTasks.filter(task => task.status.toLowerCase() === 'in progress');
            } else {
                console.error('Failed to load tasks:', data.message);
                showError(data.message || 'Failed to load tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            showError('Error connecting to the server. Please check your connection and try again.');
        } finally {
            showLoading(false);
        }
    }

    function renderTasks(filter = 'in-progress') {
        console.log(`Rendering tasks with filter: ${filter}`);
        
        // Determine which tasks to display based on the filter
        const tasksToRender = {
            facility: filter === 'in-progress' ? facilityTasks : completedFacilityTasks,
            service: filter === 'in-progress' ? serviceTasks : completedServiceTasks
        };
        
        // Render facility tasks
        facilityTasksTable.innerHTML = '';
        if (tasksToRender.facility.length === 0) {
            facilityTasksTable.innerHTML = `
                <tr>
                    <td colspan="6" class="no-tasks">No ${filter} facility tasks found</td>
                </tr>
            `;
        } else {
            tasksToRender.facility.forEach(task => {
                const row = document.createElement('tr');
                row.dataset.id = task.id;
                row.dataset.type = 'facility';
                
                // Determine status display
                const statusDisplay = formatStatus(task.status);
                const statusClass = task.status.toLowerCase().replace(' ', '-');
                
                row.innerHTML = `
                    <td>${task.id}</td>
                    <td>${task.facility}</td>
                    <td>${task.resident}</td>
                    <td>${task.dateTime}</td>
                    <td><span class="status-badge status-${statusClass}">${statusDisplay}</span></td>
                    <td>
                        <button class="btn-icon view-details" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                `;
                facilityTasksTable.appendChild(row);
            });
        }

        // Render service tasks
        serviceTasksTable.innerHTML = '';
        if (tasksToRender.service.length === 0) {
            serviceTasksTable.innerHTML = `
                <tr>
                    <td colspan="6" class="no-tasks">No ${filter} service tasks found</td>
                </tr>
            `;
        } else {
            tasksToRender.service.forEach(task => {
                const row = document.createElement('tr');
                row.dataset.id = task.id;
                row.dataset.type = 'service';
                
                // Determine status display
                const statusDisplay = formatStatus(task.status);
                const statusClass = task.status.toLowerCase().replace(' ', '-');
                
                row.innerHTML = `
                    <td>${task.id}</td>
                    <td>${task.service}</td>
                    <td>${task.homeowner}</td>
                    <td>${task.date}</td>
                    <td><span class="status-badge status-${statusClass}">${statusDisplay}</span></td>
                    <td>
                        <button class="btn-icon view-details" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                `;
                serviceTasksTable.appendChild(row);
            });
        }

        // Add click event to view buttons
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const taskRow = this.closest('tr');
                const taskId = taskRow.dataset.id;
                const taskType = taskRow.dataset.type;
                showTaskDetails(taskId, taskType);
            });
        });

        // Add click event to rows
        document.querySelectorAll('#facilityTasks tr, #serviceTasks tr').forEach(row => {
            if (!row.querySelector('.no-tasks')) {
                row.addEventListener('click', function() {
                    const taskId = this.dataset.id;
                    const taskType = this.dataset.type;
                    showTaskDetails(taskId, taskType);
                });
            }
        });
    }

    function showTaskDetails(taskId, taskType) {
        console.log(`Showing details for ${taskType} task ${taskId}`);
        
        let task;
        if (taskType === 'facility') {
            task = currentFilter === 'in-progress' ? 
                facilityTasks.find(t => t.id === taskId) : 
                completedFacilityTasks.find(t => t.id === taskId);
            isFacilityTask = true;
        } else {
            task = currentFilter === 'in-progress' ? 
                serviceTasks.find(t => t.id === taskId) : 
                completedServiceTasks.find(t => t.id === taskId);
            isFacilityTask = false;
        }

        if (!task) {
            console.error(`Task not found: ${taskType} ${taskId}`);
            return;
        }

        currentTask = task;

        // Update modal title
        taskModalTitle.textContent = isFacilityTask ? 
            `Facility Reservation: ${task.id}` : 
            `Service Request: ${task.id}`;

        // Reset completion notes field
        if (completionNotesField) {
            completionNotesField.value = '';
        }

        // Update modal body
        if (isFacilityTask) {
            taskModalBody.innerHTML = `
                <div class="task-details">
                    <div class="detail-item">
                        <span class="detail-label">Facility:</span>
                        <span class="detail-value">${task.facility}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Resident:</span>
                        <span class="detail-value">${task.resident}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${task.date}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">${task.time} (${task.duration} hours)</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Guests:</span>
                        <span class="detail-value">${task.guests}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Purpose:</span>
                        <span class="detail-value">${task.purpose}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Staff Notes:</span>
                        <span class="detail-value">${task.notes || 'None'}</span>
                    </div>
                </div>
            `;
        } else {
            taskModalBody.innerHTML = `
                <div class="task-details">
                    <div class="detail-item">
                        <span class="detail-label">Service:</span>
                        <span class="detail-value">${task.service}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Homeowner:</span>
                        <span class="detail-value">${task.homeowner}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Scheduled Date:</span>
                        <span class="detail-value">${task.date}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Scheduled Time:</span>
                        <span class="detail-value">${task.time}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Payment Status:</span>
                        <span class="detail-value">${task.payment_status}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Instructions:</span>
                        <span class="detail-value">${task.notes || 'None'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Staff Notes:</span>
                        <span class="detail-value">${task.staffNotes || 'None'}</span>
                    </div>
                </div>
            `;
        }
        
        // Add completion notes field if this is an in-progress task
        if (currentFilter === 'in-progress') {
            taskModalBody.innerHTML += `
                <div class="completion-form">
                    <h4>Completion Details</h4>
                    <div class="form-group">
                        <label for="completionNotes">Completion Notes:</label>
                        <textarea id="completionNotes" placeholder="Enter notes about the completed task..."></textarea>
                        <small class="help-text">These notes will be sent to the homeowner in a notification.</small>
                    </div>
                </div>
            `;
        }

        // Show/hide mark as done button based on status
        markTaskDoneBtn.style.display = currentFilter === 'in-progress' ? 'block' : 'none';

        // Open modal
        taskDetailsModal.classList.add('active');
    }

    async function markTaskAsDone() {
        if (!currentTask) {
            showToast('error', 'No task selected');
            return;
        }
        
        const completionNotes = document.getElementById('completionNotes')?.value || '';

        try {
            // Show loading state on button
            const originalBtnText = markTaskDoneBtn.innerHTML;
            markTaskDoneBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            markTaskDoneBtn.disabled = true;
            
            // Make API call to mark task as completed
            const response = await fetch('/Staff/MarkTaskCompleted', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    taskId: currentTask.id,
                    taskType: isFacilityTask ? 'facility' : 'service',
                    completionNotes: completionNotes
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Show success message
                showToast('success', data.message || 'Task marked as completed');
                
                // Move the task to the completed array
                if (isFacilityTask) {
                    const taskIndex = facilityTasks.findIndex(t => t.id === currentTask.id);
                    if (taskIndex !== -1) {
                        const completedTask = {...facilityTasks[taskIndex], status: 'Completed'};
                        facilityTasks.splice(taskIndex, 1);
                        completedFacilityTasks.push(completedTask);
                    }
                } else {
                    const taskIndex = serviceTasks.findIndex(t => t.id === currentTask.id);
                    if (taskIndex !== -1) {
                        const completedTask = {...serviceTasks[taskIndex], status: 'Completed'};
                        serviceTasks.splice(taskIndex, 1);
                        completedServiceTasks.push(completedTask);
                    }
                }
                
                // Close modal and refresh the tasks list
                closeTaskModal();
                renderTasks(currentFilter);
            } else {
                showToast('error', data.message || 'Failed to mark task as completed');
            }
        } catch (error) {
            console.error('Error marking task as done:', error);
            showToast('error', 'An error occurred while updating the task');
        } finally {
            // Reset button state
            markTaskDoneBtn.innerHTML = '<i class="fas fa-check-circle"></i> Mark as Completed';
            markTaskDoneBtn.disabled = false;
        }
    }

    function closeTaskModal() {
        taskDetailsModal.classList.remove('active');
        currentTask = null;
    }

    function formatStatus(status) {
        return status.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }
    
    function showLoading(show) {
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'flex' : 'none';
        }
    }
    
    function hideError() {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }
    
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
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
});