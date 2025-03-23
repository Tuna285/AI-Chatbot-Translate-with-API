// Lấy các phần tử DOM trước
const inputTextarea = document.getElementById('inputText');
const resultTextarea = document.getElementById('result');

// Khai báo các biến observer
let inputObserver;
let resultObserver;

// Định nghĩa hàm điều chỉnh chiều cao textarea
function adjustTextareaHeight(textarea) {
    // Ngắt observer tạm thời để tránh vòng lặp vô hạn
    if (textarea === inputTextarea) {
        inputObserver.disconnect();
    } else if (textarea === resultTextarea) {
        resultObserver.disconnect();
    }

    // Điều chỉnh chiều cao
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';

    // Kết nối lại observer
    if (textarea === inputTextarea) {
        inputObserver.observe(inputTextarea, config);
    } else if (textarea === resultTextarea) {
        resultObserver.observe(resultTextarea, config);
    }
}

// Hàm đồng bộ chiều cao giữa hai textarea (nếu cần)
function syncHeight(source, target) {
    target.style.height = source.style.height;
}

// Khởi tạo các observer
inputObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            syncHeight(inputTextarea, resultTextarea);
        }
    });
});

resultObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            syncHeight(resultTextarea, inputTextarea);
        }
    });
});

// Cấu hình cho MutationObserver
const config = { attributes: true, attributeFilter: ['style'] };

// Bắt đầu theo dõi các thay đổi
inputObserver.observe(inputTextarea, config);
resultObserver.observe(resultTextarea, config);

// Xử lý sự kiện dịch thuật
const translateButton = document.querySelector('.translate-button');
translateButton.addEventListener('click', () => {
    const text = inputTextarea.value;
    const sourceLang = document.getElementById('sourceLanguage').value;
    const targetLang = document.getElementById('targetLanguage').value;
    const additionalInstructions = document.getElementById('additionalInstructions').value;

    if (!text || !targetLang) {
        alert('Văn bản hoặc ngôn ngữ đích không được để trống!');
        return;
    }

    // Hiển thị trạng thái đang dịch
    resultTextarea.value = 'Đang dịch...';
    translateButton.disabled = true;

    fetch('translate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceLang, targetLang, additionalInstructions })
    })
    .then(response => response.json())
    .then(data => {
        if (data.translatedText) {
            resultTextarea.value = data.translatedText;
            adjustTextareaHeight(resultTextarea);
        } else {
            resultTextarea.value = 'Lỗi: ' + (data.error || 'Không thể dịch');
        }
    })
    .catch(error => {
        resultTextarea.value = 'Lỗi kết nối: ' + error.message;
    })
    .finally(() => {
        translateButton.disabled = false;
    });
});

// Điều chỉnh chiều cao ban đầu khi nhập văn bản
inputTextarea.addEventListener('input', () => adjustTextareaHeight(inputTextarea));

// Xử lý nút dán
const pasteButton = document.querySelector('.paste-button');
pasteButton.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        inputTextarea.value = text;
        adjustTextareaHeight(inputTextarea);
    } catch (err) {
        alert('Không thể dán văn bản: ' + err);
    }
});

// Xử lý nút xóa
const clearButton = document.querySelector('.clear-button');
clearButton.addEventListener('click', () => {
    inputTextarea.value = '';
    adjustTextareaHeight(inputTextarea);
});

// Xử lý nút copy cho cả hai textarea
const copyButtons = document.querySelectorAll('.copy-button');
copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const textarea = button.closest('.text-area').querySelector('textarea');
        try {
            await navigator.clipboard.writeText(textarea.value);
            button.classList.add('copied');
            setTimeout(() => button.classList.remove('copied'), 2000);
        } catch (err) {
            alert('Không thể sao chép: ' + err);
        }
    });
});

// Xử lý nút đổi ngôn ngữ
const swapButton = document.getElementById('swapLanguages');
swapButton.addEventListener('click', () => {
    const sourceSelect = document.getElementById('sourceLanguage');
    const targetSelect = document.getElementById('targetLanguage');
    const sourceLang = sourceSelect.value;
    
    if (sourceLang !== 'auto') {
        const targetLang = targetSelect.value;
        sourceSelect.value = targetLang;
        targetSelect.value = sourceLang;
        swapButton.classList.add('active');
        setTimeout(() => swapButton.classList.remove('active'), 300);
    }
});