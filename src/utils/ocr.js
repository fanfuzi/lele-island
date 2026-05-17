// OCR 工具 — 支持 Claude Vision + Tesseract.js + 手动 3 层方案

// 尝试通过 Claude Vision API 识别（服务器端）
async function ocrViaClaude(imageBase64) {
  try {
    const res = await fetch('/api/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
    });
    if (!res.ok) throw new Error(`Claude OCR failed: ${res.status}`);
    const data = await res.json();
    return data.text || null;
  } catch (e) {
    console.warn('Claude Vision OCR failed:', e.message);
    return null;
  }
}

// 通过 Tesseract.js 浏览器端识别
async function ocrViaTesseract(file, onProgress) {
  try {
    const Tesseract = await import('tesseract.js');
    const { data } = await Tesseract.recognize(file, 'chi_tra+eng', {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(Math.round(m.progress * 100));
        }
      },
    });
    return data.text || null;
  } catch (e) {
    console.warn('Tesseract OCR failed:', e.message);
    return null;
  }
}

// 图片转 base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 主入口：上传图片 → 返回识别文字
// 优先 Claude Vision → 回退 Tesseract.js → 返回 null
export async function ocrImage(file, onProgress) {
  // 先用 Claude Vision
  const base64 = await fileToBase64(file);
  const claudeResult = await ocrViaClaude(base64);
  if (claudeResult) return claudeResult;

  // 回退 Tesseract.js
  if (onProgress) onProgress(0);
  const tessResult = await ocrViaTesseract(file, onProgress);
  if (tessResult) return tessResult;

  return null;
}

// 校验识别结果是否为有效文本（含必要的中文/英文/数字）
export function isValidText(text) {
  if (!text || text.trim().length < 5) return false;
  // 至少包含一些可识别的字符
  const hasContent = /[一-鿿\w\d]/.test(text);
  return hasContent;
}
