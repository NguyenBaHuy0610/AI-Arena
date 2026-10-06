# Việt Phục AI Arena 🇻🇳

Khám phá trang phục truyền thống Việt Nam qua góc nhìn AI và tranh minh họa 2D chính diện.

## Tính năng
- 🎨 **Bộ sưu tập 5 trang phục tiêu biểu ba miền** với hình minh họa 2D chính diện thống nhất người mẫu (Áo dài, Áo tứ thân, Áo ngũ thân, Áo nhật bình, Áo bà ba).
- ⚖️ **Hệ thống chấm điểm văn hóa thông minh** đánh giá phối đồ dựa trên 9 quy tắc học thuật khảo chứng.
- 📚 **Nguồn tham chiếu học thuật**: Tra cứu xuất xứ bảo tàng, độ tin cậy và liên kết trực tiếp tới tài liệu gốc.
- 💾 **Tích hợp Supabase** (Database + Storage) với cơ chế tự động chuyển sang dữ liệu nội bộ (offline fallback).
- ✨ **Giao diện hiện đại & chuyển động mượt mà**: Hiệu ứng chuyển trang, hoạt ảnh spring với Framer Motion và TailwindCSS v4.

## Danh mục Trang phục MVP
| Tên trang phục | Không gian văn hóa | Niên đại tiêu biểu | Đối tượng |
|---|---|---|---|
| **Áo dài** | Liên vùng (Bắc, Trung, Nam) | TK XVIII – nay | Nam & Nữ |
| **Áo tứ thân** | Bắc Bộ | TK XVII – XX | Nữ giới |
| **Áo ngũ thân** | Liên vùng | TK XVIII – XX | Nam & Nữ |
| **Áo nhật bình** | Huế (Cung đình triều Nguyễn) | Triều Nguyễn | Nữ giới |
| **Áo bà ba** | Nam Bộ | TK XX – nay | Nam & Nữ |

## Hướng dẫn cài đặt & Khởi chạy

```bash
# 1. Đi đến thư mục ứng dụng
cd vietphuc-app

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi chạy máy chủ phát triển
npm run dev
```

## Chạy Unit Test

Hệ thống đi kèm bộ kiểm thử tự động toàn diện (Data Layer, Score Engine, Supabase Hooks):

```bash
npm test
```

## Cấu hình Supabase (Tùy chọn)

Ứng dụng hoạt động đầy đủ cả khi không có Internet nhờ bộ dữ liệu JSON fallback. Để kết nối cơ sở dữ liệu Supabase:

```bash
cp .env.local.example .env.local
# Mở file .env.local và điền VITE_SUPABASE_URL cùng VITE_SUPABASE_ANON_KEY của bạn
```

Chạy các file SQL trong thư mục `JOBS/migrations/` vào Supabase SQL Editor:
- `001_initial_schema.sql`
- `002_seed_garments.sql`

## Nền tảng Công nghệ
- **React 19** + **Vite 8**
- **TailwindCSS v4** + Token màu truyền thống Việt Nam
- **Framer Motion** cho vi hoạt ảnh và chuyển trang
- **Vitest** cho unit test
- **Supabase JS Client** cho lưu trữ đám mây
- **Gemini AI** sinh hình minh họa phục trang 2D
