document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminDocumentsGrid = document.getElementById('adminDocumentsGrid');
    const adminUploadBtn = document.getElementById('adminUploadBtn');
    const adminBreadcrumb = document.getElementById('adminBreadcrumb');
    const adminDocumentPreview = document.getElementById('adminDocumentPreview');
    const adminClosePreviewBtn = document.getElementById('adminClosePreviewBtn');
    const adminDownloadBtn = document.getElementById('adminDownloadBtn');
    const adminSecurityBtn = document.getElementById('adminSecurityBtn');
    const adminReplaceBtn = document.getElementById('adminReplaceBtn');
    const adminDeleteBtn = document.getElementById('adminDeleteBtn');
    const totalDocumentsEl = document.getElementById('totalDocuments');

    // Modal Elements
    const adminUploadModal = document.getElementById('adminUploadModal');
    const securityModal = document.getElementById('securityModal');
    const adminUploadCancelBtn = document.getElementById('adminUploadCancelBtn');
    const adminUploadSubmitBtn = document.getElementById('adminUploadSubmitBtn');
    const securityCancelBtn = document.getElementById('securityCancelBtn');
    const securitySaveBtn = document.getElementById('securitySaveBtn');
    const securityLevel = document.getElementById('securityLevel');

    // State
    let selectedDocument = null;
    let documents = [];

    // Initialize
    initAdminDocuments();
    
    function initAdminDocuments() {
        setupAdminEventListeners();
        loadAdminDocuments();
        renderAdminDocuments();
    }

    function setupAdminEventListeners() {
        // Buttons
        adminUploadBtn.addEventListener('click', () => adminUploadModal.style.display = 'flex');
        adminClosePreviewBtn.addEventListener('click', closeAdminPreview);
        adminDownloadBtn.addEventListener('click', downloadAdminDocument);
        adminSecurityBtn.addEventListener('click', openSecurityModal);
        adminReplaceBtn.addEventListener('click', replaceAdminDocument);
        adminDeleteBtn.addEventListener('click', deleteAdminDocument);
        
        // Modal buttons
        adminUploadCancelBtn.addEventListener('click', () => adminUploadModal.style.display = 'none');
        adminUploadSubmitBtn.addEventListener('click', handleAdminUpload);
        securityCancelBtn.addEventListener('click', () => securityModal.style.display = 'none');
        securitySaveBtn.addEventListener('click', saveSecuritySettings);
    }

    async function loadAdminDocuments() {
        try {
            // Show loading state
            adminDocumentsGrid.innerHTML = `
                <div class="loading-state" style="text-align: center; padding: 40px;">
                    <i class="fas fa-spinner fa-spin fa-2x"></i>
                    <p>Loading documents...</p>
                </div>
            `;
            
            // Fetch documents from the server
            const response = await fetch('/Admin/GetDocuments');
            const data = await response.json();
            
            if (data.success) {
                documents = data.documents;
                
                // Update document count
                if (totalDocumentsEl) {
                    totalDocumentsEl.textContent = data.stats.total;
                }
                
                renderAdminDocuments();
            } else {
                showError('Failed to load documents: ' + data.message);
            }
        } catch (error) {
            console.error('Error loading documents:', error);
            showError('An error occurred while loading documents');
        }
    }

    function renderAdminDocuments() {
        adminDocumentsGrid.innerHTML = '';
        
        if (documents.length === 0) {
            adminDocumentsGrid.innerHTML = `
                <div class="no-documents" style="text-align: center; padding: 40px;">
                    <i class="fas fa-file-alt fa-3x" style="color: #ccc; margin-bottom: 15px;"></i>
                    <p>No documents found. Upload your first document to get started.</p>
                </div>
            `;
            return;
        }
        
        // Show documents
        documents.forEach(doc => {
            const docElement = document.createElement('div');
            docElement.className = 'admin-document-item';
            docElement.dataset.id = doc.id;
            
            // Get icon based on file type
            const fileExt = doc.name.split('.').pop().toLowerCase();
            const icon = getFileIcon(fileExt);
            
            // Get visibility class
            const visibilityClass = `visibility-${doc.visibility}`;
            const visibilityText = 
                doc.visibility === 'homeowner' ? 'Homeowner' :
                doc.visibility === 'staff' ? 'Staff' : 'Admin';
            
            docElement.innerHTML = `
                <div class="document-icon-admin">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="document-info-admin">
                    <div class="document-name-admin">${doc.name}</div>
                    <div class="document-meta-admin">
                        <span class="document-type">${formatDocumentType(doc.type)}</span>
                        <span class="document-date">${formatDate(doc.uploaded)}</span>
                        <span class="document-size">${formatFileSize(doc.size)}</span>
                    </div>
                    <span class="document-visibility ${visibilityClass}">${visibilityText}</span>
                </div>
                <div class="document-actions-admin">
                    <button class="btn-action download" title="Download"><i class="fas fa-download"></i></button>
                    <button class="btn-action security" title="Security"><i class="fas fa-lock"></i></button>
                    <button class="btn-action history" title="Version History"><i class="fas fa-history"></i></button>
                    <button class="btn-action delete" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            // Add event listeners
            docElement.addEventListener('click', function(e) {
                if (!e.target.closest('.document-actions-admin')) {
                    getDocumentDetails(doc.id);
                }
            });
            
            const downloadBtn = docElement.querySelector('.download');
            const securityBtn = docElement.querySelector('.security');
            const historyBtn = docElement.querySelector('.history');
            const deleteBtn = docElement.querySelector('.delete');
            
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                downloadAdminDocument(doc);
            });
            
            securityBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openSecurityModal(doc);
            });
            
            historyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showVersionHistory(doc);
            });
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteAdminDocument(doc.id);
            });
            
            adminDocumentsGrid.appendChild(docElement);
        });
    }

    async function getDocumentDetails(docId) {
        try {
            const response = await fetch(`/Admin/GetDocumentDetails?id=${docId}`);
            const data = await response.json();
            
            if (data.success) {
                previewAdminDocument(data.document);
            } else {
                showError('Failed to load document details: ' + data.message);
            }
        } catch (error) {
            console.error('Error loading document details:', error);
            showError('An error occurred while loading document details');
        }
    }

    function previewAdminDocument(doc) {
        selectedDocument = doc;
        
        // Update preview panel
        document.getElementById('previewDocName').textContent = doc.name;
        document.getElementById('previewDocType').textContent = formatDocumentType(doc.type);
        document.getElementById('previewDocDate').textContent = `${formatDate(doc.uploaded)} by ${doc.uploader}`;
        document.getElementById('previewDocSize').textContent = formatFileSize(doc.size);
        document.getElementById('previewDocDownloads').textContent = doc.download_count;
        
        // Update visibility text based on new options
        const visibilityText = 
            doc.visibility === 'homeowner' ? 'Homeowner Access' :
            doc.visibility === 'staff' ? 'Staff Access' : 'Admin Access';
        document.getElementById('previewDocVisibility').textContent = visibilityText;
        
        // Track document view
        fetch('/Admin/TrackDocumentView', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: doc.id })
        }).catch(error => console.error('Error tracking document view:', error));
        
        adminDocumentPreview.style.display = 'flex';
    }

    function closeAdminPreview() {
        adminDocumentPreview.style.display = 'none';
        selectedDocument = null;
    }

    async function downloadAdminDocument(doc = selectedDocument) {
        if (doc) {
            try {
                // Track the download
                const response = await fetch('/Admin/TrackDocumentDownload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: doc.id })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Open the document in a new tab using the URL we already have from the document object
                    window.open(doc.url, '_blank');
                    
                    // Update the download count in the UI
                    if (selectedDocument && selectedDocument.id === doc.id) {
                        const downloadCountEl = document.getElementById('previewDocDownloads');
                        if (downloadCountEl) {
                            downloadCountEl.textContent = (parseInt(downloadCountEl.textContent) + 1).toString();
                        }
                    }
                    
                    // Show success notification
                    Swal.fire({
                        title: 'Download Started',
                        text: `${doc.name} is being downloaded`,
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    showError('Failed to download document: ' + data.message);
                }
            } catch (error) {
                console.error('Error downloading document:', error);
                showError('An error occurred while downloading the document');
            }
        }
    }

    function openSecurityModal(doc = selectedDocument) {
        if (!doc) return;
        
        // Set current security level
        securityLevel.value = doc.visibility;
        
        // Set other fields if available
        if (document.getElementById('downloadRestriction')) {
            document.getElementById('downloadRestriction').value = doc.allow_download ? 'allow' : 'restrict';
        }
        
        if (document.getElementById('expirationDate') && doc.expiration_date) {
            document.getElementById('expirationDate').value = doc.expiration_date;
        }
        
        securityModal.style.display = 'flex';
    }

    async function saveSecuritySettings() {
        if (!selectedDocument) return;
        
        try {
            // Prepare data
            const visibility = securityLevel.value;
            const allowDownload = document.getElementById('downloadRestriction') ? 
                document.getElementById('downloadRestriction').value === 'allow' : true;
            const applyWatermark = document.getElementById('downloadRestriction') ? 
                document.getElementById('downloadRestriction').value === 'watermark' : false;
            const category = selectedDocument.category || '';
            const description = selectedDocument.description || '';
            
            // Send update request
            const response = await fetch('/Admin/UpdateDocumentSettings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id: selectedDocument.id,
                    visibility,
                    allowDownload,
                    applyWatermark,
                    category,
                    description
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Update document in the list
                const docIndex = documents.findIndex(d => d.id === selectedDocument.id);
                if (docIndex !== -1) {
                    documents[docIndex].visibility = visibility;
                }
                
                // Update UI
                const visibilityClass = `visibility-${visibility}`;
                const visibilityText = 
                    visibility === 'homeowner' ? 'Homeowner' :
                    visibility === 'staff' ? 'Staff' : 'Admin';
                
                document.querySelector(`.admin-document-item[data-id="${selectedDocument.id}"] .document-visibility`)
                    .className = `document-visibility ${visibilityClass}`;
                document.querySelector(`.admin-document-item[data-id="${selectedDocument.id}"] .document-visibility`)
                    .textContent = visibilityText;
                
                document.getElementById('previewDocVisibility').textContent = 
                    visibility === 'homeowner' ? 'Homeowner Access' :
                    visibility === 'staff' ? 'Staff Access' : 'Admin Access';
                
                securityModal.style.display = 'none';
                
                // Show success notification
                Swal.fire({
                    title: 'Settings Saved',
                    text: `Security settings for ${selectedDocument.name} have been updated`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                showError('Failed to update document settings: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating document settings:', error);
            showError('An error occurred while updating document settings');
        }
    }

    function replaceAdminDocument() {
        if (!selectedDocument) return;
        
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = getAcceptedFileTypes();
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        // Trigger click on the file input
        fileInput.click();
        
        // Handle file selection
        fileInput.addEventListener('change', async function() {
            if (fileInput.files.length === 0) return;
            
            try {
                // Show loading state
                Swal.fire({
                    title: 'Uploading...',
                    html: 'Replacing document, please wait...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                // First delete the old document
                const deleteResponse = await fetch('/Admin/DeleteDocument', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: selectedDocument.id })
                });
                
                const deleteData = await deleteResponse.json();
                
                if (!deleteData.success) {
                    Swal.close();
                    showError('Failed to replace document: ' + deleteData.message);
                    return;
                }
                
                // Then upload the new document
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                formData.append('visibility', selectedDocument.visibility);
                formData.append('allowDownload', selectedDocument.allow_download);
                formData.append('applyWatermark', selectedDocument.apply_watermark);
                formData.append('category', selectedDocument.category || '');
                formData.append('description', selectedDocument.description || '');
                
                const uploadResponse = await fetch('/Admin/UploadDocument', {
                    method: 'POST',
                    body: formData
                });
                
                const uploadData = await uploadResponse.json();
                
                if (uploadData.success) {
                    // Close preview
                    closeAdminPreview();
                    
                    // Reload documents
                    await loadAdminDocuments();
                    
                    // Show success message
                    Swal.fire({
                        title: 'Document Replaced',
                        text: 'The document has been successfully replaced',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.close();
                    showError('Failed to upload new document: ' + uploadData.message);
                }
            } catch (error) {
                console.error('Error replacing document:', error);
                Swal.close();
                showError('An error occurred while replacing the document');
            } finally {
                // Remove the file input
                document.body.removeChild(fileInput);
            }
        });
    }

    async function deleteAdminDocument(docId = selectedDocument?.id) {
        if (!docId) return;
        
        try {
            const docToDelete = documents.find(d => d.id === docId);
            if (!docToDelete) return;
            
            // Ask for confirmation
            const result = await Swal.fire({
                title: 'Delete Document',
                text: `Are you sure you want to delete ${docToDelete.name}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#dc3545'
            });
            
            if (result.isConfirmed) {
                // Send delete request
                const response = await fetch('/Admin/DeleteDocument', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: docId })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Remove from documents array
                    documents = documents.filter(doc => doc.id !== docId);
                    
                    // Close preview if open
                    if (selectedDocument && selectedDocument.id === docId) {
                        closeAdminPreview();
                    }
                    
                    // Update UI
                    renderAdminDocuments();
                    
                    // Update document count
                    if (totalDocumentsEl) {
                        totalDocumentsEl.textContent = documents.length;
                    }
                    
                    // Show success message
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The document has been deleted.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    showError('Failed to delete document: ' + data.message);
                }
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            showError('An error occurred while deleting the document');
        }
    }

    function showVersionHistory(doc) {
        if (!doc) return;
        
        // Ensure the document is selected and preview is open
        if (!selectedDocument || selectedDocument.id !== doc.id) {
            getDocumentDetails(doc.id);
        }
        
        // Scroll to version history section
        document.querySelector('.version-history').scrollIntoView({ behavior: 'smooth' });
    }

    async function handleAdminUpload() {
        const fileInput = document.getElementById('adminDocumentFiles');
        const visibility = document.getElementById('adminDocumentVisibility').value;
        const watermark = document.getElementById('adminWatermarkOption').checked;
        const disableDownload = document.getElementById('adminDisableDownload').checked;
        const category = document.getElementById('adminDocumentCategory')?.value || '';
        const description = document.getElementById('adminDocumentDescription')?.value || '';
        
        if (fileInput.files.length === 0) {
            Swal.fire({
                title: 'Error',
                text: 'Please select at least one file to upload',
                icon: 'error'
            });
            return;
        }
        
        // Close the upload modal first
        adminUploadModal.style.display = 'none';
        
        // Show loading indication
        Swal.fire({
            title: 'Uploading...',
            html: `Uploading ${fileInput.files.length} file(s)`,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        try {
            // Upload each file
            const uploadPromises = Array.from(fileInput.files).map(file => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('visibility', visibility);
                formData.append('allowDownload', !disableDownload);
                formData.append('applyWatermark', watermark);
                formData.append('category', category);
                formData.append('description', description);
                
                return fetch('/Admin/UploadDocument', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        console.error('Upload failed:', data.message);
                        return { success: false, message: data.message, fileName: file.name };
                    }
                    return { success: true, data, fileName: file.name };
                })
                .catch(error => {
                    console.error('Error uploading file:', error);
                    return { success: false, message: error.toString(), fileName: file.name };
                });
            });
            
            // Wait for all uploads to complete
            const results = await Promise.all(uploadPromises);
            
            // Check results
            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);
            
            Swal.close();
            
            if (failed.length === 0) {
                // All uploads succeeded
                Swal.fire({
                    title: 'Upload Complete',
                    text: `Successfully uploaded ${successful.length} file(s)`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                
                // Reset the form
                document.getElementById('adminUploadForm').reset();
                
                // Refresh documents
                await loadAdminDocuments();
            } else {
                // Some uploads failed
                const failMessages = failed.map(f => `${f.fileName}: ${f.message}`).join('\n');
                
                Swal.fire({
                    title: `Failed to upload ${failed.length} file(s)`,
                    html: `<div style="text-align:left; max-height: 200px; overflow-y: auto;">
                        <p>The following files failed to upload:</p>
                        <pre style="white-space: pre-wrap;">${failMessages}</pre>
                    </div>`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                
                // If some uploads succeeded, refresh documents
                if (successful.length > 0) {
                    await loadAdminDocuments();
                }
            }
        } catch (error) {
            console.error('Error in upload process:', error);
            Swal.fire({
                title: 'Upload Failed',
                text: `An error occurred: ${error.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    // Helper functions
    function getFileIcon(ext) {
        switch(ext) {
            case 'pdf': return 'fa-file-pdf';
            case 'doc':
            case 'docx': return 'fa-file-word';
            case 'xls':
            case 'xlsx': return 'fa-file-excel';
            case 'ppt':
            case 'pptx': return 'fa-file-powerpoint';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif': return 'fa-file-image';
            case 'zip':
            case 'rar': return 'fa-file-archive';
            default: return 'fa-file';
        }
    }

    function getDocumentTypeFromExt(ext) {
        const typeMap = {
            'pdf': 'document',
            'doc': 'word',
            'docx': 'word',
            'xls': 'spreadsheet',
            'xlsx': 'spreadsheet',
            'ppt': 'presentation',
            'pptx': 'presentation',
            'jpg': 'image',
            'jpeg': 'image',
            'png': 'image',
            'gif': 'image'
        };
        return typeMap[ext] || 'file';
    }

    function formatDocumentType(type) {
        const types = {
            'financial': 'Financial Report',
            'policy': 'Policy',
            'minutes': 'Meeting Minutes',
            'confidential': 'Confidential',
            'form': 'Form',
            'guideline': 'Guideline',
            'notice': 'Notice',
            'pdf': 'PDF Document',
            'doc': 'Word Document',
            'docx': 'Word Document',
            'xls': 'Excel Spreadsheet',
            'xlsx': 'Excel Spreadsheet',
            'ppt': 'PowerPoint',
            'pptx': 'PowerPoint',
            'jpg': 'Image',
            'jpeg': 'Image',
            'png': 'Image'
        };
        return types[type] || type.charAt(0).toUpperCase() + type.slice(1);
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    function formatFileSize(bytes) {
        if (typeof bytes === 'string') {
            return bytes; // Already formatted
        }
        
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function getAcceptedFileTypes() {
        return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif';
    }

    function showError(message) {
        Swal.fire({
            title: 'Error',
            text: message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});