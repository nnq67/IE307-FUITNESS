# FUITNESS - Ứng Dụng Hướng Dẫn Tập Thể Dục

**Giảng viên hướng dẫn:** ThS. Phạm Nhật Duy.

---

## Nhóm thực hiện

Đồ án được thực hiện bởi **Nhóm 12**:

| STT | Họ và tên               | MSSV     |
| --- | ----------------------- | -------- |
| 1   | **Trần Thị Như Phương** | 23521249 |
| 2   | **Ngô Chấn Phong**      | 23521166 |
| 3   | **Nguyễn Ngọc Quyên**   | 23521326 |

---

## 1. Giới thiệu chung

**FUITNESS** là đồ án môn học thuộc lớp **IE307.Q12** (Công nghệ lập trình đa nền tảng cho ứng dụng di động) tại Trường Đại học Công nghệ Thông tin - ĐHQG TP.HCM.

Ứng dụng được thiết kế nhằm hỗ trợ người dùng rèn luyện sức khỏe, đặc biệt là hoạt động chạy bộ, thông qua việc theo dõi quãng đường, thời gian và lộ trình luyện tập. Điểm khác biệt của FUITNESS là sự kết hợp giữa công cụ theo dõi sức khỏe cá nhân và tính năng Blog cộng đồng, giúp người dùng chia sẻ thành tích và tạo động lực lẫn nhau.

---

## 2. Các chức năng chính (Key Features)

* **Xác thực người dùng (Authentication):** Đăng ký và đăng nhập tài khoản, lưu trữ thông tin chỉ số cơ thể (chiều cao, cân nặng, ngày sinh).

* **Trang chủ (Home & Dashboard):** Hiển thị tóm tắt hoạt động hằng ngày (Daily summary), số calories tiêu thụ và thời gian luyện tập.

* **Danh sách bài tập (Exercises Library):** Cung cấp kho bài tập đa dạng (Full Body, Cardio, Abs, v.v.) với hướng dẫn chi tiết và hình ảnh minh họa trực quan. Dữ liệu bài tập được lưu trữ offline.

* **Theo dõi tiến độ (Progress Tracking):**

  * **Lịch tập luyện:** Theo dõi trạng thái hoàn thành bài tập theo ngày/tuần/tháng.
  * **Go Jogging:** Tính năng theo dõi lộ trình chạy bộ thời gian thực, vẽ đường chạy trên bản đồ và tính toán quãng đường dựa trên vị trí (GPS).

* **Blog cộng đồng:** Mạng xã hội thu nhỏ cho phép người dùng đăng bài viết, hình ảnh luyện tập, tương tác (Like, Share, Comment) với người dùng khác.

* **Hồ sơ & Tiện ích (Profile & Utilities):** Quản lý thông tin cá nhân và cài đặt ứng dụng.

* **AI Coach:** Tích hợp Chatbot trợ lý ảo giúp giải đáp các thắc mắc về sức khỏe và hướng dẫn sử dụng ứng dụng ngay lập tức.

---

## 3. Công nghệ sử dụng (Tech Stack)

Dự án được xây dựng dựa trên kiến trúc phân lớp (Layered Architecture) với các công nghệ lõi sau:

* **Framework:** React Native.
* **Nền tảng phát triển:** Expo Framework (hỗ trợ truy cập phần cứng như GPS/Location).
* **Cơ sở dữ liệu (Local DB):** SQLite (lưu trữ danh sách bài tập và lịch sử luyện tập cục bộ).
* **Trí tuệ nhân tạo (AI):** Tích hợp Google Gemini API cho tính năng AI Coach.
* **Quản lý trạng thái:** React Context API.
* **Công cụ phát triển:** Visual Studio Code, Git, GitHub.

---

## 4. Cài đặt và Chạy ứng dụng

*(Lưu ý: Đảm bảo máy tính đã cài đặt Node.js và môi trường Expo)*

1. Clone repository:

```bash
git clone [Link_Repository_Cua_Ban]
```

2. Di chuyển vào thư mục dự án và cài đặt các gói phụ thuộc:

```bash
cd FUITNESS
npm install
# hoặc
yarn install
```

3. **QUAN TRỌNG:** Để thực hiện được chức năng AI Coach ở trang Help, vui lòng thực hiện theo hướng dẫn sau vì nhóm không thể push API Key bản thân lên Github được vì vấn đề bảo mật. Nếu không thêm API Key, những chức năng còn lại vẫn hoạt động bình thường trừ AI Coach. 

Thêm API Google Gemini vào dòng 9 của file `\IE307\src\screens\profile\Help.js`

```javascript
const GEMINI_API_KEY = "API_KEY";
```

Để lấy API Key từ **Google AI Studio**, thực hiện các bước sau:

* Mở trình duyệt và truy cập **Google AI Studio** (API Keys) tại trang quản lý API keys: `https://aistudio.google.com/apikey`.
* Đăng nhập bằng tài khoản Google của bạn.
* Tại trang **API Keys**, chọn **Create API key** (hoặc **Get API key**) — bạn có thể chọn tạo key trong một Google Cloud Project hiện có hoặc để Google tạo một project mới cho bạn (khuyến nghị cho người mới).
* Sau khi tạo, **sao chép** API key được hiển thị (thường có tiền tố `AIza` hoặc định dạng tương tự) và lưu trữ an toàn.
* Dán giá trị API key vào biến `GEMINI_API_KEY` ở file `Help.js` như hướng dẫn ở trên.

4. Khởi chạy ứng dụng:

```bash
npx expo start
```

5. Quét mã QR bằng ứng dụng **Expo Go** trên thiết bị di động (Android/iOS) để trải nghiệm.