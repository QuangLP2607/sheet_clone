# Spreadsheet — Yêu cầu hệ thống

## 1. Mục đích tài liệu

Tài liệu này định nghĩa các yêu cầu **chức năng** và **phi chức năng** của hệ thống Spreadsheet.

Tài liệu mô tả **hệ thống phải cung cấp những gì**, không mô tả cách các tính năng được implementation.

Các quyết định kỹ thuật, kiến trúc, thiết kế Database, API và chi tiết implementation được định nghĩa trong các tài liệu riêng.

---

# 2. Phạm vi

Hệ thống là một ứng dụng Spreadsheet chạy trên nền web, cho phép người dùng:

- Tạo và quản lý Workbook.
- Tạo và quản lý nhiều Sheet.
- Nhập và chỉnh sửa dữ liệu trong Cell.
- Chọn Cell và Range.
- Định dạng nội dung và giao diện Cell.
- Sử dụng Formula và Function.
- Copy, Cut và Paste dữ liệu.
- Chèn, xóa và thay đổi kích thước Row và Column.
- Undo và Redo các Operation.
- Persist dữ liệu Spreadsheet thông qua Backend.
- Hỗ trợ nhiều User và Permission.
- Hỗ trợ Realtime Collaboration khi được bật.

---

# 3. Yêu cầu chức năng

## 3.1 Workbook

### 3.1.1 Quản lý Workbook

- [ ] Tạo Workbook.
- [ ] Mở Workbook.
- [ ] Đổi tên Workbook.
- [ ] Xóa Workbook.
- [ ] Liệt kê các Workbook của User.
- [ ] Hiển thị Metadata của Workbook.
- [ ] Persist các thay đổi của Workbook.

### 3.1.2 Trạng thái Workbook

- [ ] Duy trì Workbook đang Active.
- [ ] Duy trì Sheet đang Active.
- [ ] Khôi phục Sheet cuối cùng được Active khi mở lại Workbook.

---

# 4. Sheet

## 4.1 Quản lý Sheet

- [ ] Tạo Sheet.
- [ ] Đổi tên Sheet.
- [ ] Xóa Sheet.
- [ ] Thay đổi thứ tự Sheet.
- [ ] Chuyển đổi giữa các Sheet.
- [ ] Duy trì Sheet đang Active.
- [ ] Ngăn các tên Sheet không hợp lệ hoặc bị trùng khi cần thiết.

## 4.2 Hiển thị Sheet

- [ ] Scroll theo chiều dọc.
- [ ] Scroll theo chiều ngang.
- [ ] Zoom In.
- [ ] Zoom Out.
- [ ] Reset Zoom.
- [ ] Duy trì vị trí Viewport.
- [ ] Render các Sheet lớn một cách hiệu quả.

## 4.3 Row

- [ ] Hiển thị Row Header.
- [ ] Chèn Row.
- [ ] Xóa Row.
- [ ] Thay đổi kích thước Row.
- [ ] Chọn một Row.
- [ ] Chọn nhiều Row.
- [ ] Duy trì kích thước của Row.

## 4.4 Column

- [ ] Hiển thị Column Header.
- [ ] Chèn Column.
- [ ] Xóa Column.
- [ ] Thay đổi kích thước Column.
- [ ] Chọn một Column.
- [ ] Chọn nhiều Column.
- [ ] Duy trì kích thước của Column.

---

# 5. Cell

## 5.1 Chọn Cell

- [ ] Chọn một Cell.
- [ ] Chọn một Range.
- [ ] Chọn một Row.
- [ ] Chọn một Column.
- [ ] Chọn nhiều Range.
- [ ] Mở rộng Selection bằng Keyboard Modifier.
- [ ] Duy trì Active Cell bên trong Selection.
- [ ] Hiển thị trực quan Range đang được chọn.

## 5.2 Chỉnh sửa Cell

- [ ] Nhập Text vào Cell.
- [ ] Nhập Number vào Cell.
- [ ] Nhập Date vào Cell.
- [ ] Nhập Formula vào Cell.
- [ ] Chỉnh sửa nội dung Cell hiện tại.
- [ ] Thay thế nội dung Cell hiện tại.
- [ ] Thêm nội dung vào nội dung Cell hiện tại.
- [ ] Xóa nội dung Cell.
- [ ] Hủy Editing.
- [ ] Commit Editing.
- [ ] Hỗ trợ chỉnh sửa thông qua Formula/Input Bar.
- [ ] Hỗ trợ Rich Text Content.

## 5.3 Điều hướng Cell

- [ ] Điều hướng bằng phím Arrow.
- [ ] Điều hướng bằng `Tab`.
- [ ] Điều hướng bằng `Enter`.
- [ ] Điều hướng bằng `Shift + Tab`.
- [ ] Điều hướng bằng `Shift + Enter`.
- [ ] Điều hướng đến đầu/cuối Row khi phù hợp.
- [ ] Điều hướng đến đầu/cuối Sheet khi phù hợp.
- [ ] Tự động Scroll Viewport khi điều hướng ra ngoài vùng đang hiển thị.

---

# 6. Clipboard

## 6.1 Copy

- [ ] Copy một Cell.
- [ ] Copy một Range.
- [ ] Copy nhiều Range được chọn khi được hỗ trợ.
- [ ] Copy Cell Value.
- [ ] Copy Formula.
- [ ] Copy Formatting khi phù hợp.
- [ ] Copy Rich Text khi phù hợp.

## 6.2 Cut

- [ ] Cut một Cell.
- [ ] Cut một Range.
- [ ] Giữ lại nội dung đã Copy trong quá trình Cut.
- [ ] Xóa nội dung ban đầu sau khi Cut thành công.

## 6.3 Paste

- [ ] Paste một Cell.
- [ ] Paste nhiều Cell.
- [ ] Paste một Range.
- [ ] Paste Formula.
- [ ] Paste Formatting.
- [ ] Paste Rich Text.
- [ ] Paste dữ liệu từ Clipboard bên ngoài hệ thống.
- [ ] Xử lý an toàn dữ liệu Clipboard không tương thích.
- [ ] Hỗ trợ Paste dữ liệu có kích thước khác nhau.

---

# 7. Formatting

## 7.1 Text Formatting

- [ ] Thay đổi Font Family.
- [ ] Thay đổi Font Size.
- [ ] Bật/tắt Bold.
- [ ] Bật/tắt Italic.
- [ ] Bật/tắt Strikethrough.
- [ ] Thay đổi Text Color.

## 7.2 Cell Formatting

- [ ] Thay đổi Background Color.
- [ ] Thiết lập Horizontal Alignment.
- [ ] Thiết lập Vertical Alignment.
- [ ] Cấu hình Text Wrapping.
- [ ] Cấu hình Cell Border.
- [ ] Cấu hình Number Format.
- [ ] Xóa Formatting.

## 7.3 Rich Text

- [ ] Formatting phần Text được chọn bên trong Cell.
- [ ] Hỗ trợ nhiều Text Style trong cùng một Cell.
- [ ] Giữ nguyên Rich Text Formatting khi chỉnh sửa.
- [ ] Persist Rich Text Content.
- [ ] Khôi phục Rich Text Content khi load Sheet.

---

# 8. Formula

## 8.1 Nhập Formula

- [ ] Phát hiện Formula Input.
- [ ] Lưu Formula riêng biệt với Displayed Result khi cần thiết.
- [ ] Hiển thị Formula trong Input/Formula Bar.
- [ ] Chỉnh sửa Formula hiện tại.
- [ ] Xóa Formula.

## 8.2 Reference

- [ ] Hỗ trợ Cell Reference.
- [ ] Hỗ trợ Relative Reference.
- [ ] Hỗ trợ Absolute Reference.
- [ ] Hỗ trợ Range Reference.
- [ ] Hỗ trợ Reference giữa các Cell.
- [ ] Hỗ trợ Reference giữa các Sheet khi phù hợp.

## 8.3 Calculation

- [ ] Tính toán Formula Result.
- [ ] Recalculate các Cell phụ thuộc khi Cell được tham chiếu thay đổi.
- [ ] Xử lý Circular Reference.
- [ ] Xử lý Formula không hợp lệ.
- [ ] Xử lý Cell Reference không hợp lệ.
- [ ] Hiển thị Calculation Error.

## 8.4 Function

Formula Engine ban đầu sẽ hỗ trợ một tập hợp Function được xác định trước.

Các Function ban đầu:

- [ ] `SUM`
- [ ] `AVERAGE`
- [ ] `MIN`
- [ ] `MAX`
- [ ] `COUNT`
- [ ] `IF`

Các Function bổ sung có thể được thêm vào sau.

---

# 9. History

## 9.1 Undo

- [ ] Undo Operation được hỗ trợ gần nhất.
- [ ] Undo nhiều Operation.
- [ ] Duy trì State chính xác sau khi Undo.
- [ ] Disable Undo khi không còn Operation nào có thể Undo.

## 9.2 Redo

- [ ] Redo Operation đã Undo.
- [ ] Redo nhiều Operation.
- [ ] Xóa Redo History không còn hợp lệ sau khi thực hiện Operation mới.
- [ ] Disable Redo khi không còn Operation nào có thể Redo.

## 9.3 Operation

History phải dựa trên các Logical Spreadsheet Operation thay vì các UI Event riêng lẻ.

Ví dụ:

- [ ] Cell Edit.
- [ ] Range Formatting.
- [ ] Paste.
- [ ] Delete.
- [ ] Row Insert/Delete.
- [ ] Column Insert/Delete.
- [ ] Merge/Unmerge.

---

# 10. Structural Operations

## 10.1 Row

- [ ] Chèn một Row.
- [ ] Chèn nhiều Row.
- [ ] Xóa một Row.
- [ ] Xóa nhiều Row.
- [ ] Bảo toàn dữ liệu Cell bị ảnh hưởng một cách chính xác.
- [ ] Bảo toàn Formatting một cách chính xác.

## 10.2 Column

- [ ] Chèn một Column.
- [ ] Chèn nhiều Column.
- [ ] Xóa một Column.
- [ ] Xóa nhiều Column.
- [ ] Bảo toàn dữ liệu Cell bị ảnh hưởng một cách chính xác.
- [ ] Bảo toàn Formatting một cách chính xác.

## 10.3 Merge

- [ ] Merge các Cell được chọn.
- [ ] Unmerge Cell.
- [ ] Hiển thị Merged Cell chính xác.
- [ ] Bảo toàn nội dung của Cell phù hợp.
- [ ] Ngăn các Operation không hợp lệ trên Merged Range.

---

# 11. Persistence

## 11.1 Loading

- [ ] Load Workbook Metadata.
- [ ] Load Sheet.
- [ ] Load Sheet Configuration.
- [ ] Load Cell.
- [ ] Load Formatting.
- [ ] Load Formula.
- [ ] Khôi phục Row Dimension.
- [ ] Khôi phục Column Dimension.

## 11.2 Saving

- [ ] Save Cell Change.
- [ ] Save Formatting Change.
- [ ] Save Formula Change.
- [ ] Save Row/Column Change.
- [ ] Save Sheet Change.
- [ ] Save Workbook Change.

## 11.3 Batch Operations

Hệ thống phải hỗ trợ Batch Persistence đối với các Operation ảnh hưởng đến nhiều Cell.

Ví dụ:

- [ ] Paste một Range.
- [ ] Format một Range.
- [ ] Fill một Range.
- [ ] Insert/Delete nhiều Row hoặc Column.

Hệ thống không nên yêu cầu một Network Request cho mỗi Cell bị ảnh hưởng.

---

# 12. Realtime Collaboration

Realtime Collaboration là một phần trong thiết kế hệ thống nhưng có thể được implementation sau khi Spreadsheet Core dành cho Single User đã ổn định.

## 12.1 Synchronization

- [ ] Nhận thay đổi Cell từ User khác.
- [ ] Apply thay đổi từ xa vào Local Sheet.
- [ ] Broadcast thay đổi Local đến User khác.
- [ ] Synchronize thay đổi Sheet.
- [ ] Synchronize Structural Change.

## 12.2 Presence

- [ ] Xác định các User đang Active.
- [ ] Hiển thị Selection của User khác khi được hỗ trợ.
- [ ] Hiển thị Editing State của User khác khi được hỗ trợ.

## 12.3 Conflict Handling

- [ ] Phát hiện các thay đổi xung đột.
- [ ] Áp dụng Conflict Resolution Strategy đã được xác định.
- [ ] Ngăn Local Sheet State rơi vào trạng thái không nhất quán.

---

# 13. Authentication & Authorization

## 13.1 Authentication

- [ ] User Registration khi cần thiết.
- [ ] User Login.
- [ ] User Logout.
- [ ] Duy trì Authenticated Session.
- [ ] Bảo vệ các Resource yêu cầu Authentication.

## 13.2 Workbook Permission

- [ ] Workbook Owner.
- [ ] Chia sẻ Workbook với User khác.
- [ ] Read-only Access.
- [ ] Read/write Access.
- [ ] Xóa quyền truy cập.
- [ ] Ngăn các thay đổi trái phép.

---

# 14. Backend

Backend chịu trách nhiệm cung cấp quyền truy cập Persistent và Secure đối với dữ liệu Spreadsheet.

- [ ] Cung cấp Workbook API.
- [ ] Cung cấp Sheet API.
- [ ] Cung cấp Cell API.
- [ ] Cung cấp Batch Cell Operation.
- [ ] Validate dữ liệu đầu vào.
- [ ] Validate User Permission.
- [ ] Persist các thay đổi.
- [ ] Xử lý an toàn các Concurrent Request.
- [ ] Cung cấp Realtime Communication khi cần thiết.
- [ ] Cung cấp Revision/History Data khi cần thiết.

---

# 15. Data Integrity

Hệ thống phải duy trì Spreadsheet State nhất quán.

- [ ] Ngăn các Cell bị trùng tại cùng một Sheet/Position.
- [ ] Validate Sheet Ownership.
- [ ] Validate Workbook Ownership/Access.
- [ ] Validate Row và Column Position.
- [ ] Validate Structural Operation.
- [ ] Ngăn các Reference không hợp lệ khi phù hợp.
- [ ] Xử lý các Operation thất bại mà không để lại Partial Invalid State.
- [ ] Sử dụng Transactional Operation khi nhiều thay đổi Database phải thành công cùng nhau.

---

# 16. Performance

Spreadsheet phải duy trì khả năng sử dụng tốt khi làm việc với các Sheet lớn.

- [ ] Không Render tất cả Cell cùng lúc.
- [ ] Chỉ Render các Cell cần thiết đối với Viewport hiện tại.
- [ ] Tránh Re-render Cell không cần thiết.
- [ ] Không Load toàn bộ Dataset khi không cần thiết.
- [ ] Hỗ trợ Batch Data Loading.
- [ ] Hỗ trợ Batch Data Persistence.
- [ ] Giữ cho UI Responsive trong các Operation lớn.
- [ ] Không Block UI trong quá trình Calculation tốn nhiều tài nguyên khi phù hợp.

---

# 17. Error Handling

- [ ] Hiển thị Error có ý nghĩa cho User.
- [ ] Xử lý API Request thất bại.
- [ ] Xử lý Save Operation thất bại.
- [ ] Xử lý Formula không hợp lệ.
- [ ] Xử lý Clipboard Data không hợp lệ.
- [ ] Xử lý Permission Error.
- [ ] Xử lý Network Disconnection.
- [ ] Khôi phục từ các Synchronization Failure tạm thời khi có thể.

---

# 18. Yêu cầu phi chức năng

## 18.1 Maintainability

- Hệ thống phải tách biệt trách nhiệm giữa UI, Spreadsheet Logic, Persistence và Backend.
- Spreadsheet Operation phải có thể được sử dụng độc lập với UI Component.
- Core Spreadsheet Logic không được phụ thuộc trực tiếp vào React Component.

## 18.2 Extensibility

Kiến trúc phải cho phép hỗ trợ các tính năng trong tương lai:

- [ ] Thêm Formula Function.
- [ ] Advanced Number Format.
- [ ] Conditional Formatting.
- [ ] Freeze Panes.
- [ ] Hidden Row/Column.
- [ ] Data Validation.
- [ ] Named Range.
- [ ] Chart.
- [ ] Comment/Note.
- [ ] Import/Export.
- [ ] Advanced Collaboration.

Các tính năng này không bắt buộc trong Initial Implementation trừ khi được đưa chính thức vào Scope của Project.

## 18.3 Reliability

- Dữ liệu không được âm thầm bị mất.
- Các Persistence Operation thất bại phải có thể phát hiện.
- Concurrent Modification không được làm hỏng Spreadsheet Data.
- Client phải xử lý tốt các Backend/Network Failure tạm thời.

---

# 19. Ưu tiên ban đầu

## P0 — Core

Các tính năng này bắt buộc phải hoàn thành trước khi Spreadsheet được xem là có thể sử dụng.

- [ ] Workbook.
- [ ] Sheet.
- [ ] Grid.
- [ ] Cell.
- [ ] Cell Selection.
- [ ] Cell Editing.
- [ ] Keyboard Navigation.
- [ ] Row/Column Header.
- [ ] Row/Column Resizing.
- [ ] Backend Persistence.
- [ ] Basic Cell Formatting.

## P1 — Tính năng Spreadsheet thiết yếu

- [ ] Copy.
- [ ] Cut.
- [ ] Paste.
- [ ] Undo.
- [ ] Redo.
- [ ] Rich Text.
- [ ] Formula.
- [ ] Insert/Delete Row.
- [ ] Insert/Delete Column.

## P2 — Nâng cao

- [ ] Merge Cell.
- [ ] Multiple Selection.
- [ ] Advanced Formula.
- [ ] Realtime Collaboration.
- [ ] User Presence.
- [ ] Sharing và Permission.

## P3 — Tương lai

- [ ] Conditional Formatting.
- [ ] Freeze Panes.
- [ ] Hidden Row/Column.
- [ ] Data Validation.
- [ ] Chart.
- [ ] Import/Export.
- [ ] Named Range.
- [ ] Comment/Note.

---

# 20. Quy tắc Requirement

Các quy tắc sau được áp dụng khi thay đổi tài liệu này:

1. Chức năng mới phải được thêm vào đây trước khi implementation.

2. Requirement phải mô tả **behavior**, không mô tả implementation.

3. Technology Choice không được ghi dưới dạng Functional Requirement.

4. Các Feature được chủ động trì hoãn phải nằm trong Priority phù hợp thay vì được implementation ngầm.

5. Một Feature chỉ được xem là hoàn thành khi Requirement tương ứng được đánh dấu hoàn thành rõ ràng trong Project Roadmap.

6. Các thay đổi ảnh hưởng đến Requirement hiện tại phải được review trước khi implementation.
