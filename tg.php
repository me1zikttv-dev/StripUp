<?php
// tg.php
// Принимает JSON с сайта и отправляет заявку в Telegram

header('Content-Type: application/json; charset=utf-8');

// ===============================
// ✅ ВСТАВЬ СЮДА (у тебя уже есть)
// ===============================

// ✅ BOT TOKEN (оставляем твой)
$BOT_TOKEN = '8497373725:AAFBV65-Km6M_wKxUWWPkDy7sqkp2NiFk74'; // <-- BOT TOKEN

// ✅ CHAT ID (из твоего getUpdates)
$CHAT_ID = '6324436781'; // <-- CHAT_ID

// ===============================

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Bad JSON']);
  exit;
}

$vacancy = trim((string)($data['vacancy'] ?? ''));
$name   = trim((string)($data['name'] ?? ''));
$tg     = trim((string)($data['tg'] ?? ''));
$phone  = trim((string)($data['phone'] ?? ''));

if ($name === '' || $tg === '' || $phone === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Missing fields']);
  exit;
}

// Немного безопасности: обрежем длину
$vacancy = mb_substr($vacancy, 0, 80);
$name    = mb_substr($name, 0, 80);
$tg      = mb_substr($tg, 0, 80);
$phone   = mb_substr($phone, 0, 80);

$text =
"📝 Новая заявка с сайта\n\n".
"💼 Вакансия: {$vacancy}\n".
"👤 Имя: {$name}\n".
"🔗 TG: {$tg}\n".
"📞 Телефон: {$phone}";

$url = "https://api.telegram.org/bot{$BOT_TOKEN}/sendMessage";

$postFields = [
  'chat_id' => $CHAT_ID,
  'text' => $text,
  'parse_mode' => 'HTML',
  'disable_web_page_preview' => true
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

if ($response === false) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'CURL error: ' . $curlErr]);
  exit;
}

$tgResp = json_decode($response, true);

if ($httpCode >= 400 || !isset($tgResp['ok']) || $tgResp['ok'] !== true) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Telegram API error', 'tg' => $tgResp]);
  exit;
}

echo json_encode(['ok' => true]);
