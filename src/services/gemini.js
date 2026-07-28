export const classifyTaskWithGemini = async ({ title, description, startDate, endDate, apiKey }) => {
  if (!apiKey) {
    throw new Error('Chưa cấu hình Gemini API Key. Vui lòng nhập API Key ở thanh Header.');
  }

  const now = new Date();
  const currentTime = now.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const currentISO = now.toISOString().slice(0, 16);

  const prompt = `Bạn là chuyên gia phân loại công việc theo Ma trận Eisenhower và hỗ trợ trích xuất thời gian.

Dữ liệu nhập vào:
- Title (Tên công việc): ${title || 'Không có'}
- Description (Ghi chú/Mô tả): ${description || 'Không có'}
- Start Date hiện tại: ${startDate || 'Chưa có'}
- End Date hiện tại: ${endDate || 'Chưa có'}
- Mốc thời gian hiện tại: ${currentTime} (Chuẩn ISO: ${currentISO})

NHIỆM VỤ:
1. PHÂN LOẠI CÔNG VIỆC thành 1 trong 4 nhóm Eisenhower:
   - DO_NOW (Quan trọng + Khẩn cấp): Sự cố gấp, critical bug, deadline trong ngày, việc khẩn cấp.
   - PLAN (Quan trọng + Không khẩn cấp): Dự án chiến lược, kế hoạch, đọc sách nghiên cứu có mục tiêu.
   - DELEGATE (Không quan trọng + Khẩn cấp): Việc nhờ vả, cuộc gọi đường đột, công việc ngắn hạn khẩn.
   - BACKLOG (Không quan trọng + Không khẩn cấp): Việc giải trí, ghi chú "không quan trọng"/"không gấp", thư giãn, rảnh rỗi.

2. TRÍCH XUẤT THỜI GIAN (startDate và endDate):
   - Phân tích Title và Description để tìm thời gian bắt đầu/kết thúc được đề cập (Ví dụ: "9h sáng đến 10h sáng ngày 30/7/2026", "chiều nay 2h",...).
   - Nếu tìm thấy, đổi thành định dạng chuẩn ISO: "YYYY-MM-DDTHH:mm" (ví dụ: "2026-07-30T09:00").
   - Nếu trong dữ liệu nhập vào ĐÃ CÓ Start Date / End Date rồi thì giữ nguyên giá trị đó.
   - Nếu hoàn toàn không nhắc đến thời gian, trả về null.

LƯU Ý QUAN TRỌNG:
- Nếu ghi chú/tiêu đề ghi "ko quan trọng", "không quan trọng", "không gấp", "thư giãn" ➔ Chọn BACKLOG.
- Chỉ trả về duy nhất 1 JSON theo cấu trúc (không dùng markdown codeblock):
{
  "matrix_zone": "DO_NOW | PLAN | DELEGATE | BACKLOG",
  "startDate": "YYYY-MM-DDTHH:mm hoặc null",
  "endDate": "YYYY-MM-DDTHH:mm hoặc null"
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      response_mime_type: "application/json"
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `Lỗi HTTP ${response.status}`;
      throw new Error(`Gemini API Error: ${msg}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('Gemini API không trả về nội dung text.');
    }

    const parsed = JSON.parse(responseText);
    let rawZone = parsed.matrix_zone || '';

    const zoneMap = {
      'DO_NOW': 'DO_NOW',
      'PLAN': 'PLAN',
      'SCHEDULE': 'PLAN',
      'DELEGATE': 'DELEGATE',
      'BACKLOG': 'BACKLOG',
      'ELIMINATE': 'BACKLOG'
    };

    let finalZone = 'BACKLOG';
    if (zoneMap[rawZone]) {
      finalZone = zoneMap[rawZone];
    } else {
      const upperText = responseText.toUpperCase();
      if (upperText.includes('BACKLOG') || upperText.includes('ELIMINATE')) finalZone = 'BACKLOG';
      else if (upperText.includes('PLAN') || upperText.includes('SCHEDULE')) finalZone = 'PLAN';
      else if (upperText.includes('DELEGATE')) finalZone = 'DELEGATE';
      else if (upperText.includes('DO_NOW')) finalZone = 'DO_NOW';
    }

    // Trả về Object đầy đủ bao gồm phân loại zone và thời gian trích xuất được
    return {
      matrixZone: finalZone,
      startDate: parsed.startDate || null,
      endDate: parsed.endDate || null
    };

  } catch (error) {
    console.error('Lỗi gọi Gemini API:', error);
    throw error;
  }
};
