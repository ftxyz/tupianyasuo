// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.querySelector('.upload-button');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const downloadButton = document.getElementById('downloadButton');
    const compressionControls = document.querySelector('.compression-controls');
    const previewContainer = document.querySelector('.preview-container');
    const downloadArea = document.querySelector('.download-area');

    // 存储原始文件
    let originalFile = null;

    // 上传按钮点击事件
    uploadButton.addEventListener('click', () => fileInput.click());

    // 文件选择事件
    fileInput.addEventListener('change', handleFileSelect);

    // 拖拽事件处理
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007AFF';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#E5E5E5';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#E5E5E5';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // 质量滑块变化事件
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
        if (originalFile) {
            compressImage(originalFile, this.value / 100);
        }
    });

    // 处理文件选择
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    }

    // 处理文件
    function handleFile(file) {
        if (!file.type.match('image.*')) {
            alert('请选择图片文件！');
            return;
        }

        originalFile = file;
        displayFileSize(file.size, originalSize);
        
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage.src = e.target.result;
            compressImage(file, qualitySlider.value / 100);
        };
        reader.readAsDataURL(file);

        // 显示控制和预览区域
        compressionControls.style.display = 'block';
        previewContainer.style.display = 'grid';
        downloadArea.style.display = 'block';
    }

    // 压缩图片
    function compressImage(file, quality) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob(
                    function(blob) {
                        const compressedUrl = URL.createObjectURL(blob);
                        compressedImage.src = compressedUrl;
                        displayFileSize(blob.size, compressedSize);
                        
                        // 更新下载按钮
                        downloadButton.onclick = () => {
                            const link = document.createElement('a');
                            link.href = compressedUrl;
                            link.download = `compressed_${file.name}`;
                            link.click();
                        };
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 显示文件大小
    function displayFileSize(bytes, element) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        let i = 0;
        let size = bytes;
        while (size >= 1024 && i < sizes.length - 1) {
            size /= 1024;
            i++;
        }
        element.textContent = `文件大小: ${size.toFixed(2)} ${sizes[i]}`;
    }
}); 