document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminDocumentsGrid = document.getElementById('adminDocumentsGrid');
    const adminUploadBtn = document.getElementById('adminUploadBtn');
    const adminCreateFolderBtn = document.getElementById('adminCreateFolderBtn');
    const bulkActionsBtn = document.getElementById('bulkActionsBtn');
    const adminTrashBtn = document.getElementById('adminTrashBtn');
    const adminBreadcrumb = document.getElementById('adminBreadcrumb');
    const adminDocumentPreview = document.getElementById('adminDocumentPreview');
    const adminClosePreviewBtn = document.getElementById('adminClosePreviewBtn');
    const adminDownloadBtn = document.getElementById('adminDownloadBtn');
    const adminSecurityBtn = document.getElementById('adminSecurityBtn');
    const adminReplaceBtn = document.getElementById('adminReplaceBtn');
    const adminDeleteBtn = document.getElementById('adminDeleteBtn');

    // Modal Elements
    const adminUploadModal = document.getElementById('adminUploadModal');
    const securityModal = document.getElementById('securityModal');
    const adminUploadCancelBtn = document.getElementById('adminUploadCancelBtn');
    const adminUploadSubmitBtn = document.getElementById('adminUploadSubmitBtn');
    const securityCancelBtn = document.getElementById('securityCancelBtn');
    const securitySaveBtn = document.getElementById('securitySaveBtn');
    const securityLevel = document.getElementById('securityLevel');
    const customPermissionsSection = document.getElementById('customPermissionsSection');

    // State
    let currentFolder = 'root';
    let selectedDocument = null;
    let documents = [];
    let folders = [];

    // Initialize
    initAdminDocuments();
    
    function initAdminDocuments() {
        setupAdminEventListeners();
        loadAdminDocuments();
        loadAdminFolders();
        renderAdminDocuments();
        renderAdminBreadcrumb();
    }

    function setupAdminEventListeners() {
        // Buttons
        adminUploadBtn.addEventListener('click', () => adminUploadModal.style.display = 'flex');
        adminCreateFolderBtn.addEventListener('click', openCreateFolderModal);
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
        
        // Security level change
        securityLevel.addEventListener('change', function() {
            customPermissionsSection.style.display = 
                this.value === 'custom' ? 'block' : 'none';
        });
    }

    function loadAdminDocuments() {
        // In a real app, this would be an API call
        documents = [
            {
                id: 'doc1',
                name: '2024 Budget Proposal.pdf',
                type: 'financial',
                folder: 'root',
                size: '4.2 MB',
                uploaded: '2024-01-15',
                visibility: 'board',
                url: '/documents/financial/2024-budget.pdf',
                downloads: 14,
                versions: [
                    { number: '1.2', date: '2024-01-10' },
                    { number: '1.1', date: '2023-12-15' }
                ],
                accessLog: [
                    { user: 'John Smith (Board)', action: 'Downloaded', time: 'Today, 10:45 AM' },
                    { user: 'Sarah Johnson (Admin)', action: 'Viewed', time: 'Yesterday, 3:22 PM' }
                ]
            },
            {
                id: 'doc2',
                name: 'Architectural Guidelines.docx',
                type: 'policy',
                folder: 'root',
                size: '2.8 MB',
                uploaded: '2023-11-20',
                visibility: 'public',
                url: '/documents/policies/arch-guidelines.docx',
                downloads: 42,
                versions: [
                    { number: '3.1', date: '2023-11-20' }
                ],
                accessLog: []
            }
        ];
    }

    function loadAdminFolders() {
        // In a real app, this would be an API call
        folders = [
            { id: 'confidential', name: 'Confidential', parent: 'root', itemCount: 12, visibility: 'admin' },
            { id: 'financial', name: 'Financial', parent: 'root', itemCount: 8, visibility: 'board' },
            { id: 'meetings', name: 'Meetings', parent: 'root', itemCount: 15, visibility: 'public' },
            { id: 'policies', name: 'Policies', parent: 'root', itemCount: 5, visibility: 'public' }
        ];
    }

    function renderAdminDocuments() {
        adminDocumentsGrid.innerHTML = '';
        
        // Show folders first
        const currentFolders = folders.filter(folder => folder.parent === currentFolder);
        currentFolders.forEach(folder => {
            const folderElement = document.createElement('div');
            folderElement.className = 'admin-folder-item';
            folderElement.dataset.id = folder.id;
            
            folderElement.innerHTML = `
                <span class="folder-badge">${folder.itemCount} items</span>
                <i class="fas fa-folder"></i>
                <span class="folder-name">${folder.name}</span>
                <div class="folder-actions">
                    <button class="btn-action edit" title="Edit Folder"><i class="fas fa-cog"></i></button>
                </div>
            `;
            
            folderElement.addEventListener('click', function(e) {
                if (!e.target.closest('.folder-actions')) {
                    navigateToAdminFolder(folder.id);
                }
            });
            
            // Add event listeners to folder actions
            const editBtn = folderElement.querySelector('.edit');
            
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                editAdminFolder(folder);
            });
            
            adminDocumentsGrid.appendChild(folderElement);
        });
        
        // Show documents
        const currentDocs = documents.filter(doc => doc.folder === currentFolder);
        currentDocs.forEach(doc => {
            const docElement = document.createElement('div');
            docElement.className = 'admin-document-item';
            docElement.dataset.id = doc.id;
            
            // Get icon based on file type
            const fileExt = doc.name.split('.').pop().toLowerCase();
            const icon = getFileIcon(fileExt);
            
            // Get visibility class
            const visibilityClass = `visibility-${doc.visibility}`;
            const visibilityText = 
                doc.visibility === 'public' ? 'Public' :
                doc.visibility === 'board' ? 'Board Only' : 'Admin Only';
            
            docElement.innerHTML = `
                <div class="document-icon-admin">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="document-info-admin">
                    <div class="document-name-admin">${doc.name}</div>
                    <div class="document-meta-admin">
                        <span class="document-type">${formatDocumentType(doc.type)}</span>
                        <span class="document-date">${formatDate(doc.uploaded)}</span>
                        <span class="document-size">${doc.size}</span>
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
                    previewAdminDocument(doc);
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

    function renderAdminBreadcrumb() {
        adminBreadcrumb.innerHTML = '';
        
        // Always show root link
        const rootItem = document.createElement('a');
        rootItem.href = '#';
        rootItem.className = 'breadcrumb-item root';
        rootItem.dataset.id = 'root';
        rootItem.textContent = 'All Documents';
        rootItem.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToAdminFolder('root');
        });
        adminBreadcrumb.appendChild(rootItem);
        
        // In a real app, we would show the full folder hierarchy
        if (currentFolder !== 'root') {
            const current = folders.find(f => f.id === currentFolder);
            if (current) {
                adminBreadcrumb.innerHTML += '<span class="breadcrumb-separator">/</span>';
                
                const folderItem = document.createElement('a');
                folderItem.href = '#';
                folderItem.className = 'breadcrumb-item';
                folderItem.dataset.id = current.id;
                folderItem.textContent = current.name;
                folderItem.addEventListener('click', function(e) {
                    e.preventDefault();
                    navigateToAdminFolder(current.id);
                });
                adminBreadcrumb.appendChild(folderItem);
            }
        }
    }

    function navigateToAdminFolder(folderId) {
        currentFolder = folderId;
        renderAdminDocuments();
        renderAdminBreadcrumb();
    }

    function previewAdminDocument(doc) {
        selectedDocument = doc;
        
        // Update preview panel
        document.getElementById('previewDocName').textContent = doc.name;
        document.getElementById('previewDocType').textContent = formatDocumentType(doc.type);
        document.getElementById('previewDocDate').textContent = `${formatDate(doc.uploaded)} by Admin`;
        document.getElementById('previewDocSize').textContent = doc.size;
        document.getElementById('previewDocDownloads').textContent = doc.downloads;
        
        const visibilityText = 
            doc.visibility === 'public' ? 'Public (All homeowners)' :
            doc.visibility === 'board' ? 'Board Members Only' : 'Administrators Only';
        document.getElementById('previewDocVisibility').textContent = visibilityText;
        
        // Show version history
        const versionHistoryContainer = document.querySelector('.version-history');
        versionHistoryContainer.innerHTML = `
            <h4><i class="fas fa-code-branch"></i> Version History</h4>
            ${doc.versions.map(version => `
                <div class="version-item">
                    <div>
                        <span class="version-number">Version ${version.number}</span>
                        <span class="version-date">Updated: ${formatDate(version.date)}</span>
                    </div>
                    <div class="version-actions">
                        <button class="btn-action" title="Restore"><i class="fas fa-undo"></i></button>
                        <button class="btn-action" title="Download"><i class="fas fa-download"></i></button>
                    </div>
                </div>
            `).join('')}
        `;
        
        // Show access log
        const accessLogContainer = document.querySelector('.access-log');
        accessLogContainer.innerHTML = `
            <h4><i class="fas fa-list"></i> Recent Access</h4>
            ${doc.accessLog.length > 0 ? 
                doc.accessLog.map(access => `
                    <div class="access-log-item">
                        <span class="access-user">${access.user}</span>
                        <span class="access-time">${access.time}</span>
                        <div class="access-action">${access.action}</div>
                    </div>
                `).join('') : 
                '<div class="access-log-item">No recent access</div>'}
        `;
        
        adminDocumentPreview.style.display = 'flex';
    }

    function closeAdminPreview() {
        adminDocumentPreview.style.display = 'none';
        selectedDocument = null;
    }

    function downloadAdminDocument(doc = selectedDocument) {
        if (doc) {
            // In a real app, this would trigger the file download
            console.log(`Admin downloading document: ${doc.name}`);
            window.open(doc.url, '_blank');
            
            // Track download in access log
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const dateString = now.toDateString() === new Date().toDateString() ? 
                'Today' : now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            doc.accessLog.unshift({
                user: 'Admin User (Admin)',
                action: 'Downloaded',
                time: `${dateString}, ${timeString}`
            });
            
            doc.downloads++;
        }
    }

    function openSecurityModal(doc = selectedDocument) {
        if (!doc) return;
        
        // Set current security level
        securityLevel.value = doc.visibility;
        customPermissionsSection.style.display = 'none';
        
        securityModal.style.display = 'flex';
    }

    function saveSecuritySettings() {
        if (!selectedDocument) return;
        
        // Update document visibility
        selectedDocument.visibility = securityLevel.value;
        
        // In a real app, this would save to the server
        console.log(`Updated security settings for ${selectedDocument.name} to ${securityLevel.value}`);
        
        // Update UI
        const visibilityClass = `visibility-${selectedDocument.visibility}`;
        const visibilityText = 
            selectedDocument.visibility === 'public' ? 'Public' :
            selectedDocument.visibility === 'board' ? 'Board Only' : 'Admin Only';
        
        document.querySelector(`.admin-document-item[data-id="${selectedDocument.id}"] .document-visibility`)
            .className = `document-visibility ${visibilityClass}`;
        document.querySelector(`.admin-document-item[data-id="${selectedDocument.id}"] .document-visibility`)
            .textContent = visibilityText;
        
        document.getElementById('previewDocVisibility').textContent = 
            selectedDocument.visibility === 'public' ? 'Public (All homeowners)' :
            selectedDocument.visibility === 'board' ? 'Board Members Only' : 'Administrators Only';
        
        securityModal.style.display = 'none';
    }

    function replaceAdminDocument() {
        if (!selectedDocument) return;
        
        // In a real app, this would open a file selector
        console.log(`Replacing document: ${selectedDocument.name}`);
        alert('File replacement dialog would open here');
    }

    function deleteAdminDocument(docId = selectedDocument?.id) {
        if (!docId) return;
        
        if (confirm('Are you sure you want to move this document to trash?')) {
            // In a real app, this would be an API call
            documents = documents.filter(doc => doc.id !== docId);
            
            // Close preview if open
            if (selectedDocument && selectedDocument.id === docId) {
                closeAdminPreview();
            }
            
            renderAdminDocuments();
        }
    }

    function editAdminFolder(folder) {
        // In a real app, this would open an edit modal
        console.log(`Editing folder: ${folder.name}`);
        alert('Folder edit dialog would open here');
    }

    function showVersionHistory(doc) {
        if (!doc) return;
        
        // Ensure the document is selected and preview is open
        if (!selectedDocument || selectedDocument.id !== doc.id) {
            selectedDocument = doc;
            previewAdminDocument(doc);
        }
        
        // Scroll to version history section
        document.querySelector('.version-history').scrollIntoView({ behavior: 'smooth' });
    }

    function handleAdminUpload() {
        const files = document.getElementById('adminDocumentFiles').files;
        const folder = document.getElementById('adminDocumentFolder').value;
        const visibility = document.getElementById('adminDocumentVisibility').value;
        const watermark = document.getElementById('adminWatermarkOption').checked;
        const disableDownload = document.getElementById('adminDisableDownload').checked;
        
        if (files.length === 0) {
            alert('Please select at least one file to upload');
            return;
        }
        
        // In a real app, this would upload files to the server
        console.log('Admin uploading files:', {
            count: files.length,
            folder,
            visibility,
            watermark,
            disableDownload
        });
        
        // Simulate adding new documents
        Array.from(files).forEach(file => {
            const fileExt = file.name.split('.').pop().toLowerCase();
            const newDoc = {
                id: 'doc' + Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: getDocumentTypeFromExt(fileExt),
                folder,
                size: formatFileSize(file.size),
                uploaded: new Date().toISOString().split('T')[0],
                visibility,
                url: `/documents/${folder}/${file.name}`,
                downloads: 0,
                versions: [],
                accessLog: []
            };
            
            documents.push(newDoc);
        });
        
        // Close modal and refresh
        adminUploadModal.style.display = 'none';
        renderAdminDocuments();
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
            'form': 'Form',
            'guideline': 'Guideline',
            'notice': 'Notice'
        };
        return types[type] || type.charAt(0).toUpperCase() + type.slice(1);
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i])
    }
});