import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * BearAvatar: Gấu phản ứng theo trạng thái form
 * mode: 'idle' | 'user' | 'password'
 * value: chuỗi tài khoản để gấu đảo mắt theo độ dài
 */
export default function BearAvatar({ mode='idle', value='' }) {
  // Tính offset mắt theo độ dài value (giới hạn +/-10px)
  const eyeOffset = useMemo(() => {
    if (mode !== 'user') return 0;
    const len = value.length;
    if (!len) return 0;
    const max = 10;
    return Math.max(-max, Math.min(max, (len - 8))); // bắt đầu di chuyển sau ~8 ký tự
  }, [value, mode]);

  // Khi che mắt: animate tay đi lên
  const handsY = mode === 'password' ? 0 : 140; // tay từ dưới đi lên che mắt
  const handsRotate = mode === 'password' ? 0 : -5;
  const eyesOpacity = mode === 'password' ? 0 : 1;

  return (
    <div className="mx-auto mb-8 select-none" style={{ width: 160, height: 160 }}>
      <motion.svg
        viewBox="0 0 300 300"
        className="drop-shadow-lg"
        initial={false}
        animate={{}}
      >
        {/* Vòng nền */}
        <defs>
          <linearGradient id="bearBg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <circle cx="150" cy="150" r="140" fill="url(#bearBg)" />

        {/* Mặt */}
        <motion.circle cx="150" cy="150" r="90" fill="#fff" stroke="#e2e8f0" strokeWidth="4" />
        {/* Tai */}
        <circle cx="95" cy="95" r="28" fill="#fff" stroke="#e2e8f0" strokeWidth="4" />
        <circle cx="205" cy="95" r="28" fill="#fff" stroke="#e2e8f0" strokeWidth="4" />

        {/* Mắt */}
        <motion.g
          initial={false}
          animate={{ x: eyeOffset, opacity: eyesOpacity }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <circle cx="125" cy="145" r="10" fill="#111827" />
          <circle cx="175" cy="145" r="10" fill="#111827" />
        </motion.g>

        {/* Mũi + miệng */}
        <ellipse cx="150" cy="170" rx="26" ry="22" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="3" />
        <circle cx="150" cy="162" r="8" fill="#0f172a" />
        <path d="M140 178 Q150 188 160 178" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Hai tay */}
        <motion.g
          initial={false}
          animate={{ y: handsY, rotate: handsRotate }}
          transition={{ type: 'spring', stiffness: 160, damping: 18 }}
        >
          {/* Tay trái */}
          <path d="M70 300 Q110 220 130 190 Q140 170 125 155" fill="#fff" stroke="#e2e8f0" strokeWidth="5" />
          <path d="M122 154 Q115 166 118 174 Q123 182 132 178" fill="#fff" stroke="#e2e8f0" strokeWidth="4" />
          {/* Tay phải */}
          <path d="M230 300 Q190 220 170 190 Q160 170 175 155" fill="#fff" stroke="#e2e8f0" strokeWidth="5" />
          <path d="M178 154 Q185 166 182 175 Q177 183 168 178" fill="#fff" stroke="#e2e8f0" strokeWidth="4" />
        </motion.g>
      </motion.svg>
    </div>
  );
}
