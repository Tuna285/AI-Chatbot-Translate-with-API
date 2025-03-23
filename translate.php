<?php
header("Content-Type: application/json");

// Load config
require_once 'config.php';

// Nhận dữ liệu từ yêu cầu POST
$data = json_decode(file_get_contents("php://input"), true);
$text = $data['text'] ?? '';
$sourceLang = $data['sourceLang'] ?? 'auto';
$targetLang = $data['targetLang'] ?? '';
$additionalInstructions = $data['additionalInstructions'] ?? ''; // Lấy yêu cầu bổ sung

if (empty($text) || empty($targetLang)) {
    echo json_encode(["error" => "Văn bản hoặc ngôn ngữ đích không được để trống"]);
    exit;
}

// Thông tin Google Gemini API
$apiKey = API_KEY;
$apiUrl = "API_URL";

// Tạo prompt dịch thuật
$prompt = "";

// Thêm văn bản cần dịch và xử lý auto detect
if ($sourceLang === 'auto') {
    $prompt .= "Detect the language and translate the following text: '$text'\n";
} else {
    $prompt .= "Translate the following text from $sourceLang: '$text'\n";
}

// Thêm yêu cầu bổ sung (nếu có)
if (!empty($additionalInstructions)) {
  $prompt .= "Additional instructions: $additionalInstructions\n";
}

// Thêm hướng dẫn dịch sang ngôn ngữ đích, và yêu cầu không giải thích
$prompt .= "Translate to $targetLang.  Provide only the translation, no explanations.\n";


// Chuẩn bị dữ liệu gửi đến API
$payload = [
    "contents" => [
        [
            "parts" => [
                ["text" => $prompt]
            ]
        ]
    ]
];

// Gửi yêu cầu đến Gemini API bằng cURL
$ch = curl_init($apiUrl . "?key=" . $apiKey);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Xử lý phản hồi từ API
if ($httpCode === 200) {
    $result = json_decode($response, true);
    if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
        $translatedText = $result['candidates'][0]['content']['parts'][0]['text'];
        echo json_encode(["translatedText" => $translatedText]);
    } else {
        echo json_encode(["error" => "Không thể lấy kết quả dịch: " . json_encode($result)]);
    }
} else {
    echo json_encode(["error" => "Lỗi kết nối API: HTTP $httpCode - $response"]);
}
?>
