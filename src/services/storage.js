const TASKS_KEY = 'ai_task_matrix_tasks_v2';
const API_KEY_STORAGE = 'ai_task_matrix_gemini_key';

const today = new Date();
const todayStr = today.toISOString().slice(0, 10);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().slice(0, 10);

const SAMPLE_TASKS = [
  {
    id: 'sample-1',
    title: 'Sửa lỗi critical bug thanh toán sản phẩm',
    description: 'Khách hàng không thể hoàn tất giao dịch ngân hàng.',
    start_date: `${todayStr}T08:00`,
    end_date: `${todayStr}T17:00`,
    deadline: `${todayStr}T17:00`,
    matrix_zone: 'DO_NOW',
    status: 'PENDING',
    created_at: new Date().toISOString()
  },
  {
    id: 'sample-2',
    title: 'Thiết kế kiến trúc hệ thống Q3/2026',
    description: 'Lên bản thảo nâng cấp microservices và tối ưu cơ sở dữ liệu.',
    start_date: `${todayStr}T09:00`,
    end_date: `${tomorrowStr}T18:00`,
    deadline: `${tomorrowStr}T18:00`,
    matrix_zone: 'PLAN',
    status: 'PENDING',
    created_at: new Date().toISOString()
  },
  {
    id: 'sample-3',
    title: 'Gửi báo cáo doanh thu tuần cho phòng kế toán',
    description: 'Xuất file Excel tổng hợp trước 5h chiều.',
    start_date: `${todayStr}T13:00`,
    end_date: `${todayStr}T17:00`,
    deadline: `${todayStr}T17:00`,
    matrix_zone: 'DELEGATE',
    status: 'PENDING',
    created_at: new Date().toISOString()
  },
  {
    id: 'sample-4',
    title: 'Đọc sách Clean Code & Refactoring',
    description: 'Nâng cao tư duy refactoring và viết hàm đơn nhiệm.',
    start_date: '',
    end_date: '',
    deadline: '',
    matrix_zone: 'BACKLOG',
    status: 'PENDING',
    created_at: new Date().toISOString()
  }
];

export const storageService = {
  getTasks: () => {
    try {
      const data = localStorage.getItem(TASKS_KEY);
      if (!data) {
        localStorage.setItem(TASKS_KEY, JSON.stringify(SAMPLE_TASKS));
        return SAMPLE_TASKS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Lỗi khi đọc tasks từ localStorage:', e);
      return SAMPLE_TASKS;
    }
  },

  saveTasks: (tasks) => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Lỗi khi lưu tasks vào localStorage:', e);
    }
  },

  getApiKey: () => {
    try {
      return localStorage.getItem(API_KEY_STORAGE) || import.meta.env.VITE_GEMINI_API_KEY || '';
    } catch (e) {
      return '';
    }
  },

  saveApiKey: (key) => {
    try {
      localStorage.setItem(API_KEY_STORAGE, key.trim());
    } catch (e) {
      console.error('Lỗi khi lưu Gemini API Key:', e);
    }
  }
};
