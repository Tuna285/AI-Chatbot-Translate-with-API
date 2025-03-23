# Translate by AI API

Dự án này là một ứng dụng web đơn giản cho phép người dùng dịch văn bản từ một ngôn ngữ sang ngôn ngữ khác bằng cách sử dụng Google Gemini API. Người dùng có thể chọn ngôn ngữ nguồn và đích, nhập văn bản, và nhận bản dịch ngay lập tức. Ứng dụng cũng hỗ trợ nhiều tính năng tiện ích.

## Tính năng

- **Dịch văn bản**: Dịch văn bản từ ngôn ngữ nguồn sang ngôn ngữ đích bằng Google Gemini API.
- **Tự động phát hiện ngôn ngữ**: Nếu chọn "Tự động phát hiện", API sẽ tự động xác định ngôn ngữ của văn bản nguồn.
- **Hoán đổi ngôn ngữ**: Nhấn nút hoán đổi để đổi ngôn ngữ nguồn và đích, đồng thời hoán đổi nội dung của hai textarea.
- **Xóa văn bản**: Xóa nội dung của textarea nguồn.
- **Sao chép nội dung**: Sao chép nội dung của textarea nguồn hoặc đích vào clipboard.
- **Yêu cầu bổ sung**: Thêm các hướng dẫn bổ sung cho quá trình dịch (ví dụ: dịch theo phong cách trang trọng).

## Yêu cầu hệ thống

- **Môi trường**: PHP 7.4 trở lên (để chạy file `translate.php`).
- **API Key**: Bạn cần có một API key từ Chatbot để sử dụng dịch vụ dịch thuật.
- **Trình duyệt**: Hỗ trợ các trình duyệt hiện đại như Chrome, Firefox, Edge, Safari.

## Cài đặt

1. **Clone repository**: Clone dự án từ GitHub hoặc tải xuống các file.
   ```bash
   git clone <URL-dự-án>
   ```
2. **Cấu hình API Key**
3. **Chạy server**: Đặt các file trong một server web (ví dụ: XAMPP, WAMP) hoặc chạy server PHP cục bộ bằng lệnh:
   ```bash
   php -S localhost:8000
   ```
4. **Truy cập ứng dụng**: Mở trình duyệt và truy cập `http://localhost:8000` (hoặc cổng bạn đã chọn).
