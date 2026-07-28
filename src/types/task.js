export const MATRIX_ZONES = {
  DO_NOW: 'DO_NOW',
  PLAN: 'PLAN',
  DELEGATE: 'DELEGATE',
  BACKLOG: 'BACKLOG',
};

export const ZONE_CONFIG = {
  DO_NOW: {
    id: 'DO_NOW',
    title: 'Làm Ngay (Do Now)',
    subtitle: 'Quan trọng & Khẩn cấp',
    description: 'Nhiệm vụ cấp bách cần giải quyết lập tức',
    color: 'red',
    badgeBg: 'bg-red-100 text-red-900 border-2 border-red-300 font-bold',
    headerBg: 'bg-red-100/90 border-b-2 border-red-300',
    borderColor: 'border-2 border-red-300',
    cardBorder: 'hover:border-red-500',
    accentColor: 'text-red-700',
    dotColor: 'bg-red-600',
    icon: 'AlertTriangle'
  },
  PLAN: {
    id: 'PLAN',
    title: 'Lên Kế Hoạch (Plan)',
    subtitle: 'Quan trọng & Không khẩn cấp',
    description: 'Mục tiêu chiến lược, dài hạn cần xếp lịch',
    color: 'amber',
    badgeBg: 'bg-amber-100 text-amber-900 border-2 border-amber-300 font-bold',
    headerBg: 'bg-amber-100/90 border-b-2 border-amber-300',
    borderColor: 'border-2 border-amber-300',
    cardBorder: 'hover:border-amber-500',
    accentColor: 'text-amber-700',
    dotColor: 'bg-amber-600',
    icon: 'Calendar'
  },
  DELEGATE: {
    id: 'DELEGATE',
    title: 'Nhanh / Giao Việc (Delegate)',
    subtitle: 'Không quan trọng & Khẩn cấp',
    description: 'Nhiệm vụ phát sinh ngắn hạn, việc gấp',
    color: 'sky',
    badgeBg: 'bg-sky-100 text-sky-900 border-2 border-sky-300 font-bold',
    headerBg: 'bg-sky-100/90 border-b-2 border-sky-300',
    borderColor: 'border-2 border-sky-300',
    cardBorder: 'hover:border-sky-500',
    accentColor: 'text-sky-700',
    dotColor: 'bg-sky-600',
    icon: 'Zap'
  },
  BACKLOG: {
    id: 'BACKLOG',
    title: 'Lưu Trữ (Backlog)',
    subtitle: 'Không quan trọng & Không khẩn cấp',
    description: 'Nhiệm vụ giải trí, chờ xử lý khi rảnh',
    color: 'slate',
    badgeBg: 'bg-slate-200 text-slate-900 border-2 border-slate-400 font-bold',
    headerBg: 'bg-slate-200/90 border-b-2 border-slate-300',
    borderColor: 'border-2 border-slate-300',
    cardBorder: 'hover:border-slate-500',
    accentColor: 'text-slate-700',
    dotColor: 'bg-slate-600',
    icon: 'Archive'
  }
};
