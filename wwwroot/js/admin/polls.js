document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const createPollBtn = document.getElementById('createPollBtn');
    const createPollModal = document.getElementById('createPollModal');
    const resultsModal = document.getElementById('resultsModal');
    const closeButtons = document.querySelectorAll('.close');
    const cancelPollBtn = document.getElementById('cancelPollBtn');
    const pollForm = document.getElementById('pollForm');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const questionsContainer = document.getElementById('questionsContainer');
    
    // Open create poll modal
    createPollBtn.addEventListener('click', function() {
        createPollModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // Close modals
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    cancelPollBtn.addEventListener('click', function() {
        closeModal(createPollModal);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === createPollModal || event.target === resultsModal) {
            closeModal(event.target);
        }
    });
    
    // Add question to poll form
    addQuestionBtn.addEventListener('click', function() {
        const questionCount = questionsContainer.querySelectorAll('.question-item').length + 1;
        const newQuestion = document.createElement('div');
        newQuestion.className = 'question-item';
        newQuestion.innerHTML = `
            <div class="question-header">
                <label>Question ${questionCount}</label>
                <button type="button" class="btn-text remove-question">Remove</button>
            </div>
            <input type="text" class="question-text" placeholder="Enter question" required>
            <div class="options-container">
                <div class="option-item">
                    <input type="text" placeholder="Option 1" required>
                    <button type="button" class="btn-icon remove-option">×</button>
                </div>
                <div class="option-item">
                    <input type="text" placeholder="Option 2" required>
                    <button type="button" class="btn-icon remove-option">×</button>
                </div>
            </div>
            <button type="button" class="btn-text add-option">+ Add Option</button>
        `;
        questionsContainer.appendChild(newQuestion);
        
        // Add event listeners to new buttons
        addOptionListeners(newQuestion);
        newQuestion.querySelector('.remove-question').addEventListener('click', function() {
            questionsContainer.removeChild(newQuestion);
            updateQuestionNumbers();
        });
    });
    
    // Add option to question
    function addOptionListeners(questionElement) {
        const addOptionBtn = questionElement.querySelector('.add-option');
        const optionsContainer = questionElement.querySelector('.options-container');
        
        addOptionBtn.addEventListener('click', function() {
            const optionCount = optionsContainer.querySelectorAll('.option-item').length + 1;
            const newOption = document.createElement('div');
            newOption.className = 'option-item';
            newOption.innerHTML = `
                <input type="text" placeholder="Option ${optionCount}" required>
                <button type="button" class="btn-icon remove-option">×</button>
            `;
            optionsContainer.appendChild(newOption);
            
            newOption.querySelector('.remove-option').addEventListener('click', function() {
                optionsContainer.removeChild(newOption);
            });
        });
    }
    
    // Update question numbers after removal
    function updateQuestionNumbers() {
        const questions = questionsContainer.querySelectorAll('.question-item');
        questions.forEach((question, index) => {
            question.querySelector('label').textContent = `Question ${index + 1}`;
        });
    }
    
    // Initialize first question's option buttons
    const firstQuestion = questionsContainer.querySelector('.question-item');
    addOptionListeners(firstQuestion);
    firstQuestion.querySelector('.remove-question').addEventListener('click', function() {
        questionsContainer.removeChild(firstQuestion);
        updateQuestionNumbers();
    });
    
    // Form submission
    pollForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here you would typically send the data to the server
        // For demonstration, we'll just close the modal
        closeModal(createPollModal);
        
        // Show success message
        alert('Poll created successfully!');
    });
    
    // View results functionality
    document.querySelectorAll('.poll-actions .btn-secondary').forEach(button => {
        button.addEventListener('click', function() {
            const pollCard = this.closest('.poll-card');
            const pollTitle = pollCard.querySelector('h3').textContent;
            
            document.getElementById('resultsPollTitle').textContent = pollTitle;
            resultsModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
});