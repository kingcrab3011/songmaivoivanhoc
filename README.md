# VĂN NGHỊ LUẬN LAB — SẢN PHẨM HỌC TẬP SỐ MÔN NGỮ VĂN

> **Năm học:** 2026–2027  
> **Giáo viên hướng dẫn:** Võ Thị Mỹ Ngà  
> **Học sinh thực hiện:** Nguyễn Anh Tuấn, Đỗ Thị Ánh Chinh  
> **Lớp:** 12A2 — **Khóa:** 2024–2027 — **Trường:** THPT Yên Lãng  
> **Hotline hỗ trợ:** 0975083274  

---

## 1. Giới thiệu dự án
**Văn Nghị Luận Lab** là một sản phẩm học tập số dành cho học sinh THPT (đặc biệt là học sinh lớp 12 chuẩn bị cho kỳ thi Tốt nghiệp THPT và Đánh giá năng lực). Website hỗ trợ rèn luyện kỹ năng viết văn nghị luận xã hội, phát triển tư duy phản biện, tích lũy dẫn chứng thực tiễn đa chiều và trau chuốt diễn đạt tiếng Việt.

Sản phẩm phục vụ mục đích giáo dục phi thương mại.

---

## 2. Các chức năng chính
1. **Màn hình chào & Thông tin dự án:** Giới thiệu đầy đủ thông tin giáo viên, học sinh, lớp, trường và cam kết phi thương mại.
2. **Ảnh Chân Trời Tri Thức & Cuộn trang mờ dần:** Hiệu ứng chuyển động mượt mà biểu tượng cho hành trình khám phá tri thức.
3. **Kho 100 Đề Nghị Luận Xã Hội:** Tuyển tập 100 đề thực tế thuộc 20 nhóm chủ đề, tìm kiếm tiếng Việt không dấu, lọc theo chủ đề và mức độ khó (Cơ bản, Trung bình, Nâng cao).
4. **Dàn Ý Mẫu 7 Phần Chuẩn Mực (A – G):**
   - A. Mở bài
   - B. Giải thích
   - C. Hệ thống luận điểm
   - D. Dẫn chứng tiêu biểu
   - E. Phản biện và mở rộng
   - F. Bài học nhận thức và hành động
   - G. Kết bài
5. **Trình Soạn Thảo Văn Bản Tự Động Lưu (Essay Editor):**
   - Đếm số từ, số ký tự tiếng Việt theo thời gian thực
   - Đặt mục tiêu số từ (200 từ cho đoạn văn, 600 từ cho bài văn chuẩn THPT)
   - Lưu nháp tự động với cơ chế debounce
   - Tùy chỉnh phông chữ Lora / Be Vietnam Pro và cỡ chữ
   - Thanh trượt xem dàn ý song hành trong lúc viết
6. **Mục Bài Làm Nháp (Độc lập):** Quản lý nhiều bản thảo, đổi tên, tiếp tục viết dở, xóa có hộp thoại xác nhận.
7. **Mục Bài Đã Lưu:** Quản lý tài liệu yêu thích (đề thi, dàn ý, dẫn chứng, bài viết mẫu).
8. **Kho Dẫn Chứng Phong Phú:**
   - Dẫn chứng cá nhân (Nguyễn Ngọc Ký, Nick Vujicic, Malala Yousafzai, Marie Curie, Bác sĩ Đặng Thùy Trâm, Helen Keller, Stephen Hawking...)
   - Dẫn chứng cộng đồng / hiện tượng xã hội (Dự án Nuôi Em, Cứu trợ Bão Yagi 2024, Nhóm Sài Gòn Xanh, Hành trình Đỏ, Sách hóa nông thôn...)
   - Có phân tích phẩm chất, cách đưa vào bài và lưu ý tránh lỗi ngụy biện.
9. **Mục Tải Lên Cộng Đồng (Nằm cạnh Bài đã lưu):**
   - Loại A: Đóng góp đề bài mới
   - Loại B: Chia sẻ bài văn đã viết có cam kết bản quyền
10. **Cố Vấn AI Chấm Bài (Google Gemini 3.8 Flash):**
   - Đánh giá theo thang điểm 10 chuẩn mực giáo dục Việt Nam
   - 9 tiêu chí sư phạm chi tiết
   - Gợi ý câu viết lại và phân tích lý do
   - Cảnh báo bắt buộc: điểm số chỉ mang tính tham khảo tự học.
   - Xử lý trạng thái an toàn: không để lộ API key ở frontend, báo trạng thái rõ ràng nếu chưa cấu hình server key.

---

## 3. Cấu trúc thư mục

```
van-nghi-luan-lab/
├── index.html                 # Entry point HTML với Google Fonts tiếng Việt
├── metadata.json              # Khai báo thông tin applet và server-side capabilities
├── package.json               # Cấu hình scripts và dependencies
├── server.ts                  # Máy chủ Express: proxy API Gemini AI & phục vụ Vite
├── tsconfig.json              # Cấu hình TypeScript
├── vite.config.ts             # Cấu hình Vite & Tailwind CSS v4
├── src/
│   ├── main.tsx               # Khởi tạo React App
│   ├── App.tsx                # Luồng điều hướng và giao diện chính
│   ├── index.css              # CSS toàn cục và bảng màu giấy sách
│   ├── types/
│   │   └── index.ts           # Định nghĩa Typescript data models
│   ├── data/
│   │   ├── prompts.ts         # Cơ sở dữ liệu 100 đề bài nghị luận xã hội
│   │   ├── outlines.ts        # Dàn ý mẫu 7 phần & bộ tổng hợp dàn ý
│   │   └── evidence.ts        # Kho dẫn chứng cá nhân & hiện tượng xã hội
│   ├── utils/
│   │   └── text.ts            # Xử lý đếm từ tiếng Việt & tìm kiếm không dấu
│   ├── services/
│   │   └── storage.ts         # Quản lý localStorage cho bản nháp & cộng đồng
│   ├── assets/
│   │   └── images/            # Ảnh chân trời tri thức chất lượng cao
│   └── components/
│       ├── WelcomeModal.tsx          # Màn hình chào bắt buộc với thông tin nhóm
│       ├── KnowledgeHorizonHero.tsx  # Hero chân trời tri thức cuộn mờ dần
│       ├── Navbar.tsx                # Thanh điều hướng chuẩn UI/UX
│       ├── PromptBank.tsx            # Kho 100 đề với bộ lọc và tìm kiếm
│       ├── OutlineViewer.tsx         # Trình xem dàn ý 7 phần
│       ├── EssayEditor.tsx           # Trình soạn thảo văn bản
│       ├── DraftsManager.tsx         # Trang quản lý các bài nháp
│       ├── SavedItemsView.tsx        # Trang quản lý bài đã lưu
│       ├── EvidenceBank.tsx          # Kho dẫn chứng thực tiễn
│       ├── UploadCommunityModal.tsx  # Modal tải lên đề và chia sẻ bài
│       ├── CommunityView.tsx         # Trang bài viết cộng đồng
│       ├── AiGradingModal.tsx        # Modal AI chấm bài tham khảo
│       ├── ProjectInfoModal.tsx      # Modal thông tin dự án
│       └── PromptDetailModal.tsx     # Modal xem chi tiết đề bài
```

---

## 4. Hướng dẫn chạy môi trường Local

1. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

2. **Cấu hình biến môi trường:**
   Tạo file `.env` từ `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Điền khóa `GEMINI_API_KEY` nếu muốn sử dụng tính năng AI chấm bài. Nếu không điền, ứng dụng vẫn hoạt động 100% tất cả các tính năng học tập khác ở chế độ demo an toàn.

3. **Chạy server phát triển:**
   ```bash
   npm run dev
   ```
   Mở trình duyệt tại: `http://localhost:3000`

---

## 5. Hướng dẫn triển khai lên Vercel

Dự án tương thích hoàn toàn để deploy lên Vercel:

1. Đẩy mã nguồn lên kho lưu trữ GitHub/GitLab.
2. Đăng nhập Vercel và chọn **Add New Project** -> Import repository của bạn.
3. Trong phần **Build and Output Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Trong phần **Environment Variables**:
   - Thêm `GEMINI_API_KEY`: nhập khóa API Gemini của bạn (không bắt buộc, nếu có sẽ kích hoạt tính năng AI chấm bài).
5. Nhấn **Deploy**.
