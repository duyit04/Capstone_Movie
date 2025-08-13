# 🎬 Cinema Color System Guide - Cyber Movie App

## 🌟 **Tổng quan hệ thống màu mới**

Hệ thống màu sắc rạp phim hiện đại và đẹp mắt cho toàn bộ website, với thiết kế consistent và professional theo theme rạp phim tối.

## 🎨 **Bảng màu chính - Cinema Theme**

### **Cinema Background Colors**
```css
--cinema-bg: #0B0F14           /* Nền chính tối như rạp phim */
--cinema-surface: #121821      /* Bề mặt thẻ/khối */
```

### **Text Colors**
```css
--cinema-text-primary: #E6EDF3    /* Chữ chính trắng ngà, dễ đọc */
--cinema-text-secondary: #9FB0C3  /* Chữ phụ */
```

### **Accent Colors (Neon)**
```css
--accent-primary: #00E5FF         /* Nút/CTA nhấn chính neon xanh */
--accent-secondary: #8A5CFF       /* Nút nhấn phụ/hover tím neon */
```

### **Status Colors**
```css
--status-warning: #FFC857         /* Cảnh báo */
--status-success: #22C55E         /* Thành công */
--status-error: #EF4444           /* Lỗi */
```

### **Seat Colors**
```css
--seat-available: #9FB0C3        /* Ghế còn trống */
--seat-selected: #00E5FF         /* Ghế đã chọn */
--seat-sold: #374151             /* Ghế đã bán */
```

## 🔤 **Typography System**

### **Fonts**
```css
--font-sans: 'Be Vietnam Pro'     /* Body text, dễ đọc, hỗ trợ tiếng Việt */
--font-display: 'Montserrat'      /* Headings, nổi bật, hiện đại */
--font-mono: 'JetBrains Mono'     /* Code, technical text */
```

### **Font Sizes**
```css
h1: 40px (32px mobile)           /* H1-H2: 32-40px */
h2: 32px (28px mobile)
h3: 24px (20px mobile)
h4: 20px
h5: 18px
h6: 16px
body: 16px                        /* Body: 16-18px */
```

### **Line Heights**
```css
line-height: 1.5-1.7              /* Cho dễ đọc */
```

## 🎭 **Component System**

### **Buttons**
```css
/* Primary Button */
.btn-primary {
  background: var(--accent-primary);
  color: var(--cinema-bg);
}

/* Hover: sáng hơn 15% */
.btn-primary:hover {
  background: #00d4e6;
}

/* Active: giảm độ sáng 5% */
.btn-primary:active {
  background: #00b8cc;
}
```

### **Cards**
```css
.card {
  background: var(--cinema-surface);
  border: 1px solid var(--surface-200);
  border-radius: var(--radius-xl);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```

### **Inputs**
```css
.input {
  background: var(--cinema-surface);
  border: 1px solid var(--surface-200);
  color: var(--cinema-text-primary);
}

.input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.1);
}
```

## 🌈 **Gradients**

### **Neon Gradients**
```css
--gradient-neon: linear-gradient(135deg, #00E5FF 0%, #8A5CFF 100%);
--gradient-primary: linear-gradient(135deg, #00E5FF 0%, #8A5CFF 100%);
--gradient-accent: linear-gradient(135deg, #8A5CFF 0%, #00E5FF 100%);
```

### **Surface Gradients**
```css
--gradient-hero: linear-gradient(135deg, #0B0F14 0%, #121821 50%, #1a2332 100%);
--gradient-card: linear-gradient(135deg, #121821 0%, #1a2332 100%);
```

## 💫 **Shadows & Effects**

### **Neon Glows**
```css
--shadow-glow: 0 0 20px rgba(0, 229, 255, 0.3);
--shadow-glow-accent: 0 0 20px rgba(138, 92, 255, 0.3);
--shadow-glow-warning: 0 0 20px rgba(255, 200, 87, 0.3);
```

### **Regular Shadows**
```css
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
```

## 🎯 **Usage Examples**

### **Primary CTA Button**
```css
.cta-button {
  background: var(--accent-primary);
  color: var(--cinema-bg);
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s;
}

.cta-button:hover {
  background: #00d4e6;
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}
```

### **Card Component**
```css
.movie-card {
  background: var(--cinema-surface);
  border: 1px solid var(--surface-200);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s;
}

.movie-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--accent-primary);
}
```

### **Text Styling**
```css
.movie-title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--cinema-text-primary);
  background: var(--gradient-neon);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.movie-description {
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--cinema-text-secondary);
  line-height: 1.6;
}
```

## 📱 **Responsive Design**

### **Mobile Breakpoints**
```css
@media (max-width: 640px) {
  h1 { font-size: 32px; }
  h2 { font-size: 28px; }
  h3 { font-size: 20px; }
}

@media (max-width: 768px) {
  h1 { font-size: 36px; }
  h2 { font-size: 30px; }
}
```

## 🎨 **Color Combinations**

### **High Contrast (Accessibility)**
- Background: `var(--cinema-bg)` + Text: `var(--cinema-text-primary)`
- Background: `var(--accent-primary)` + Text: `var(--cinema-bg)`

### **Medium Contrast**
- Background: `var(--cinema-surface)` + Text: `var(--cinema-text-primary)`
- Background: `var(--surface-200)` + Text: `var(--cinema-text-secondary)`

### **Low Contrast (Subtle)**
- Background: `var(--cinema-bg)` + Text: `var(--cinema-text-secondary)`

## 🚀 **Animation & Transitions**

### **Hover Effects**
```css
.hover-lift {
  transition: all var(--transition-normal);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```

### **Button Interactions**
```css
.btn {
  transition: all var(--transition-normal);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.btn:active {
  transform: translateY(0);
}
```

## 🎭 **Theme Variations**

### **Cinema Mode (Default)**
- Dark background with neon accents
- High contrast for readability
- Professional movie theater aesthetic

### **Accessibility Mode**
- Increased contrast ratios
- Larger text sizes
- Enhanced focus indicators

## 📋 **Implementation Checklist**

- [x] Import Google Fonts (Montserrat, Be Vietnam Pro)
- [x] Define CSS variables for all colors
- [x] Apply cinema theme to header
- [x] Update global styles
- [x] Create component system
- [x] Add responsive breakpoints
- [x] Implement hover effects
- [x] Add neon glow effects
- [x] Test accessibility contrast
- [x] Document usage guidelines

## 🔧 **Customization**

### **Changing Primary Color**
```css
:root {
  --accent-primary: #your-color-here;
}
```

### **Adding New Status Colors**
```css
:root {
  --status-info: #3b82f6;
  --status-neutral: #6b7280;
}
```

### **Custom Gradients**
```css
:root {
  --gradient-custom: linear-gradient(135deg, #color1 0%, #color2 100%);
}
```

---

**🎬 Hệ thống màu này tạo ra trải nghiệm rạp phim hiện đại, chuyên nghiệp và dễ sử dụng cho người dùng!**
