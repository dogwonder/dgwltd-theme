let cropper = null;
let cropperData = null;
let zoomValue = 1;

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const backgroundColor = document.getElementById('backgroundColor');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const zoomValueDisplay = document.getElementById('zoomValue');
const resetBtn = document.getElementById('resetBtn');
const zoomControlsContainer = document.getElementById('zoomControlsContainer');

const image = document.getElementById('image');
const preview = document.getElementById('preview');
const previewContainer = document.getElementById('previewContainer');
const downloadBtn = document.getElementById('downloadBtn');

// Handle paste events
document.addEventListener('paste', (e) => {
    e.preventDefault();
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
        if (item.type.indexOf('image') === 0) {
            const file = item.getAsFile();
            handleFile(file);
            break;
        }
    }
});

// Handle drag and drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
});

// Handle click to select
dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
});

// Reset button
resetBtn.addEventListener('click', () => {
    if (cropper) {
        cropper.reset();
        zoomValue = 1;
        updateZoomDisplay();
        updatePreview();
    }
});

// Listen for aspect ratio changes and update the cropper
document.querySelectorAll('input[name="aspectRatio"]').forEach(radio => {
    radio.addEventListener('change', () => {
        if (cropper) {
            // Save the current zoom level and other data
            const currentZoom = zoomValue;
            
            // Reinitialize cropper with new aspect ratio
            initCropper(true);
            
            // Restore zoom after initialization
            setTimeout(() => {
                zoomValue = currentZoom;
                updateZoomDisplay();
                cropper.zoomTo(currentZoom);
            }, 100);
        }
    });
});

// Listen for background color changes and update the preview
backgroundColor.addEventListener('change', () => {
    updatePreview();
});

// Handle zoom buttons
zoomInBtn.addEventListener('click', () => {
    if (cropper) {
        // Smaller increment for zooming in
        zoomValue = Math.min(zoomValue + 0.02, 3);
        updateZoomDisplay();
        cropper.zoomTo(zoomValue);
    }
});

zoomOutBtn.addEventListener('click', () => {
    if (cropper) {
        // Extra small decrement for zooming out, with smaller steps at lower zoom levels
        let zoomDecrement = 0.02;
        
        // Use even smaller decrements for small zoom values
        if (zoomValue < 0.2) {
            zoomDecrement = 0.005;
        } else if (zoomValue < 0.5) {
            zoomDecrement = 0.01;
        }
        
        zoomValue = Math.max(zoomValue - zoomDecrement, 0.01);
        updateZoomDisplay();
        cropper.zoomTo(zoomValue);
        
        // Force update canvas size to allow zooming out beyond image boundaries
        const canvasData = cropper.getCanvasData();
        if (zoomValue < 0.3) {
            // Apply more aggressive canvas scaling for very small zoom levels
            // Smaller scale factor for smoother transitions
            const scaleFactor = zoomValue < 0.1 ? 0.98 : 0.99;
            
            cropper.setCanvasData({
                width: canvasData.width * scaleFactor,
                height: canvasData.height * scaleFactor,
                left: canvasData.left + (canvasData.width - canvasData.width * scaleFactor) / 2,
                top: canvasData.top + (canvasData.height - canvasData.height * scaleFactor) / 2
            });
        }
    }
});

function updateZoomDisplay() {
    // Show zoom percentage with 1 decimal place for smaller values
    let displayValue = Math.round(zoomValue * 100);
    if (zoomValue < 0.1) {
        // Show more precision for very small values
        displayValue = (zoomValue * 100).toFixed(1);
    }
    zoomValueDisplay.textContent = `${displayValue}%`;
}

function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        image.src = e.target.result;
        image.classList.remove('hidden');
        zoomControlsContainer.classList.remove('hidden');
        
        // Reset zoom value to default
        zoomValue = 1;
        updateZoomDisplay();
        
        initCropper();
    };
    reader.readAsDataURL(file);
}

function initCropper(preserveData = false) {
    if (cropper) {
        // Store data if needed
        if (preserveData) {
            cropperData = cropper.getData();
        }
        
        cropper.destroy();
    }

    // Get the selected aspect ratio
    const aspectRatioValue = document.querySelector('input[name="aspectRatio"]:checked').value;
    const ratio = parseFloat(aspectRatioValue);

    cropper = new Cropper(image, {
        aspectRatio: ratio,
        viewMode: 0, // Changed to 0 to allow for unlimited movement
        dragMode: 'move',
        autoCropArea: 0.9,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        minCropBoxWidth: 100,
        minCropBoxHeight: 100,
        ready: function() {
            // If we need to restore data
            if (preserveData && cropperData) {
                // Set the crop box data first
                setTimeout(() => {
                    cropper.setData(cropperData);
                }, 50);
            }
            
            // Initial preview update
            updatePreview();
        },
        zoom: function(e) {
            // Update zoom value when zooming from cropper
            zoomValue = e.detail.ratio;
            updateZoomDisplay();
        },
        crop: updatePreview
    });
}

function updatePreview() {
    if (!cropper) return;

    // Create a larger canvas with the background color
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Get the selected aspect ratio
    const aspectRatioValue = document.querySelector('input[name="aspectRatio"]:checked').value;
    const ratio = parseFloat(aspectRatioValue);
    
    // Set canvas dimensions to the desired aspect ratio
    if (ratio === 2) {
        canvas.width = 1200;
        canvas.height = 600;
    } else if (ratio === 1.91) {
        canvas.width = 1200;
        canvas.height = 628;
    } else if (ratio === 1.4) {
        canvas.width = 1400;
        canvas.height = 1000;
    } else if (ratio === 1) {
        canvas.width = 1080;
        canvas.height = 1080;
    } else {
        canvas.width = 1200;
        canvas.height = 1200 / ratio;
    }
    
    // Fill with background color
    ctx.fillStyle = backgroundColor.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get the cropped canvas
    const croppedCanvas = cropper.getCroppedCanvas();
    if (!croppedCanvas) return;
    
    // Calculate dimensions to center the image
    const scale = Math.min(
        canvas.width / croppedCanvas.width,
        canvas.height / croppedCanvas.height
    ) * 0.95; // Scale slightly down to add padding
    
    const scaledWidth = croppedCanvas.width * scale;
    const scaledHeight = croppedCanvas.height * scale;
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;
    
    // Draw the cropped image centered on the background
    ctx.drawImage(croppedCanvas, x, y, scaledWidth, scaledHeight);
    
    // Convert to JPEG with 0.9 quality
    const previewUrl = canvas.toDataURL('image/jpeg', 0.9);
    preview.src = previewUrl;
    previewContainer.classList.remove('hidden');

    // Show dimensions
    const dimensionsInfo = document.getElementById('dimensionsInfo');
    dimensionsInfo.textContent = `Dimensions: ${canvas.width} × ${canvas.height} pixels`;

    // Update download link
    downloadBtn.href = previewUrl;
    downloadBtn.download = `social-card-${aspectRatioValue.replace('.', '_')}.jpg`;
}