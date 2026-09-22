# Mô hình dữ liệu

## 1. Mục đích tài liệu

Tài liệu này định nghĩa mô hình dữ liệu khái niệm của hệ thống Spreadsheet.

Mục đích:

- Xác định các entity chính trong hệ thống.
- Xác định mối quan hệ giữa các entity.
- Xác định dữ liệu nào cần được persist.
- Xác định cấu trúc của Spreadsheet Cell.
- Xác định mối quan hệ giữa giá trị Cell, Formula và Formatting.
- Làm nền tảng ổn định cho việc thiết kế Database và API.

Tài liệu này mô tả **mô hình dữ liệu logic** trước.

Database Schema cuối cùng có thể được điều chỉnh trong quá trình implementation.

---

# 2. Tổng quan mô hình dữ liệu

Mối quan hệ cốt lõi:

```text
User
 │
 └── Workbook
        │
        ├── Sheet
        │     │
        │     └── Cell
        │
        └── Revision
```

Các entity bổ sung có thể được thêm vào sau:

```text
User

Workbook

Sheet

Cell

Revision

Permission

Session
```

---

# 3. User

Đại diện cho một người dùng đã được xác thực.

Cấu trúc khái niệm:

```text
User
├── id
├── email
├── name
├── avatar
├── createdAt
└── updatedAt
```

Trách nhiệm:

- [ ] Xác định người dùng.
- [ ] Xác thực người dùng.
- [ ] Liên kết người dùng với Workbook.
- [ ] Hỗ trợ Permission.

---

# 4. Workbook

Đại diện cho một Spreadsheet document.

Một Workbook có thể chứa nhiều Sheet.

Cấu trúc khái niệm:

```text
Workbook
├── id
├── ownerId
├── name
├── createdAt
└── updatedAt
```

Mối quan hệ:

```text
User
 │
 └── owns
       │
       ▼
    Workbook
       │
       └── contains
             │
             ▼
           Sheets
```

Yêu cầu:

- [ ] Workbook có một owner.
- [ ] Workbook chứa một hoặc nhiều Sheet.
- [ ] Workbook có thể được đổi tên.
- [ ] Workbook có thể bị xóa.
- [ ] Workbook có thể được chia sẻ với người dùng khác.

---

# 5. Sheet

Đại diện cho một Spreadsheet bên trong Workbook.

Cấu trúc khái niệm:

```text
Sheet
├── id
├── workbookId
├── name
├── position
├── rowCount
├── columnCount
├── createdAt
└── updatedAt
```

Trách nhiệm:

- Lưu metadata của Sheet.
- Xác định kích thước của Sheet.
- Quản lý thứ tự của Sheet.
- Chứa các Cell.

Mối quan hệ:

```text
Workbook
   │
   └── Sheet
        │
        └── Cells
```

Yêu cầu:

- [ ] Sheet thuộc chính xác một Workbook.
- [ ] Sheet có một `position` duy nhất bên trong Workbook.
- [ ] Sheet có một `name`.
- [ ] Sheet có số lượng Row có thể cấu hình.
- [ ] Sheet có số lượng Column có thể cấu hình.

---

# 6. Cell

Cell là đơn vị dữ liệu cơ bản của Spreadsheet.

Cấu trúc khái niệm:

```text
Cell
├── id
├── sheetId
├── row
├── column
├── value
├── formula
├── style
├── createdAt
└── updatedAt
```

Một Cell được xác định duy nhất trong một Sheet bởi:

```text
(sheetId, row, column)
```

Ví dụ:

```text
Sheet: sheet_01

Row: 5

Column: 3

→ Cell C5
```

Yêu cầu:

- [ ] Cell thuộc chính xác một Sheet.
- [ ] Cell có Row index.
- [ ] Cell có Column index.
- [ ] Cell có thể chứa một Value.
- [ ] Cell có thể chứa một Formula.
- [ ] Cell có thể chứa Formatting.
- [ ] Vị trí Cell phải là duy nhất trong một Sheet.

---

# 7. Nội dung Cell

Nội dung Cell cần phân biệt giữa dữ liệu người dùng nhập và kết quả được tính toán.

Về mặt khái niệm:

```text
Cell
├── input
│   ├── value
│   └── formula
│
└── computed
    └── result
```

Ví dụ:

```text
Input:

=SUM(A1:A5)

Formula:

=SUM(A1:A5)

Result:

150
```

Hệ thống không được xem kết quả hiển thị là dữ liệu đầu vào ban đầu của người dùng.

Yêu cầu:

- [ ] Giữ nguyên Formula gốc.
- [ ] Tính toán Formula result riêng biệt.
- [ ] Hỗ trợ Cell không chứa Formula.
- [ ] Hỗ trợ Cell rỗng.
- [ ] Phân biệt Formula Cell và Value Cell thông thường.

---

# 8. Cell Value

Giá trị của Cell có thể thuộc nhiều kiểu dữ liệu khác nhau.

Các kiểu dữ liệu ban đầu:

```text
EMPTY

TEXT

NUMBER

BOOLEAN

DATE

ERROR
```

Biểu diễn khái niệm:

```text
CellValue
├── type
└── value
```

Ví dụ:

```text
TEXT

"Hello"


NUMBER

123.45


BOOLEAN

true


DATE

2026-09-03


ERROR

#VALUE!
```

Yêu cầu:

- [ ] Xác định các kiểu Value được hỗ trợ.
- [ ] Xác định quy tắc chuyển đổi kiểu dữ liệu.
- [ ] Xác định quy tắc hiển thị.
- [ ] Xác định quy tắc so sánh.
- [ ] Xác định cách Formula xử lý từng kiểu dữ liệu.

---

# 9. Formula

Formula đại diện cho một biểu thức do người dùng nhập vào.

Ví dụ:

```text
=SUM(A1:A5)
```

Về mặt khái niệm:

```text
Formula
├── expression
├── dependencies
└── result
```

Ví dụ Dependency Graph:

```text
A1 ─┐
A2 ─┤
A3 ─┼──► A5
A4 ─┘
```

Yêu cầu:

- [ ] Lưu Formula expression gốc.
- [ ] Parse Formula.
- [ ] Xác định các Cell reference.
- [ ] Xác định các Range reference.
- [ ] Tính toán Dependencies.
- [ ] Recalculate các Cell bị ảnh hưởng.
- [ ] Phát hiện Circular Reference.
- [ ] Lưu Formula Error.

Các Function ban đầu:

- [ ] `SUM`
- [ ] `AVERAGE`
- [ ] `MIN`
- [ ] `MAX`
- [ ] `COUNT`
- [ ] `IF`

Có thể bổ sung thêm Function trong tương lai.

---

# 10. Cell Style

Formatting nên được biểu diễn riêng biệt với nội dung Cell.

Cấu trúc khái niệm:

```text
CellStyle
├── fontFamily
├── fontSize
├── bold
├── italic
├── underline
├── strike
├── textColor
├── backgroundColor
├── horizontalAlign
├── verticalAlign
├── wrap
└── borders
```

Cấu trúc chính xác có thể được điều chỉnh sau.

Yêu cầu:

- [ ] Hỗ trợ Text Formatting.
- [ ] Hỗ trợ Cell Formatting.
- [ ] Hỗ trợ Alignment.
- [ ] Hỗ trợ Borders.
- [ ] Hỗ trợ Background Color.
- [ ] Hỗ trợ Text Color.
- [ ] Hỗ trợ Number Formatting.

---

# 11. Rich Text

Rich Text cho phép các phần khác nhau trong cùng một Cell có Style khác nhau.

Ví dụ:

```text
Hello World
^^^^^

Bold
```

Cấu trúc khái niệm:

```text
RichText
├── text
└── runs
    ├── start
    ├── end
    └── style
```

Ví dụ:

```json
{
  "text": "Hello World",
  "runs": [
    {
      "start": 0,
      "end": 5,
      "style": {
        "bold": true
      }
    }
  ]
}
```

Yêu cầu:

- [ ] Hỗ trợ nhiều Style trong cùng một Cell.
- [ ] Giữ nguyên thứ tự Text.
- [ ] Giữ nguyên các Formatting Range.
- [ ] Cho phép Formatting một phần nội dung Cell.
- [ ] Chuyển đổi Editor Content thành dạng dữ liệu có thể persist.

---

# 12. Range

Range đại diện cho nhiều Cell.

Ví dụ:

```text
A1:C5
```

Cấu trúc khái niệm:

```text
Range
├── startRow
├── startColumn
├── endRow
└── endColumn
```

Range được sử dụng cho:

- Selection.
- Copy / Paste.
- Formatting.
- Formula Reference.
- Delete Operation.
- Row / Column Operation.
- Merge Operation.

Yêu cầu:

- [ ] Biểu diễn Range hình chữ nhật.
- [ ] Chuẩn hóa tọa độ Range.
- [ ] Hỗ trợ Range chỉ có một Cell.
- [ ] Hỗ trợ Range có nhiều Cell.

---

# 13. Merge

Merged Cell đại diện cho một vùng hiển thị duy nhất bao phủ nhiều Cell.

Ví dụ:

```text
A1:B2
```

Về mặt khái niệm:

```text
Merge
├── sheetId
├── startRow
├── startColumn
├── endRow
└── endColumn
```

Yêu cầu:

- [ ] Lưu các Merged Range.
- [ ] Ngăn các Merge bị chồng lấn không hợp lệ.
- [ ] Hỗ trợ Merge.
- [ ] Hỗ trợ Unmerge.
- [ ] Xác định Cell nào sở hữu nội dung.

---

# 14. Revision

Revision đại diện cho một thay đổi logic đối với dữ liệu Spreadsheet.

Ví dụ:

```text
Revision
├── id
├── workbookId
├── userId
├── operation
├── payload
├── createdAt
└── version
```

Ví dụ Operation:

```text
SET_CELL_VALUE
```

Payload:

```json
{
  "sheetId": "sheet_01",
  "row": 5,
  "column": 3,
  "value": 100
}
```

Revision có thể được sử dụng để hỗ trợ:

- Undo / Redo.
- Collaboration.
- Synchronization.
- Audit History.
- Version History.

Yêu cầu:

- [ ] Xác định các Operation Type.
- [ ] Xác định cấu trúc Operation Payload.
- [ ] Xác định thứ tự Revision.
- [ ] Xác định Versioning.
- [ ] Xác định Conflict Handling.

---

# 15. Permission

Permission xác định những gì một User có thể thực hiện với một Workbook.

Các Role ban đầu:

```text
OWNER

EDITOR

VIEWER
```

Cấu trúc khái niệm:

```text
Permission
├── id
├── workbookId
├── userId
├── role
└── createdAt
```

Yêu cầu:

- [ ] Owner có toàn quyền.
- [ ] Editor có thể thay đổi dữ liệu Workbook.
- [ ] Viewer chỉ có thể xem dữ liệu Workbook.
- [ ] Backend phải kiểm tra Permission.
- [ ] Realtime Operation phải tuân thủ Permission.

---

# 16. Quan hệ giữa các Entity

Các mối quan hệ ban đầu:

```text
User
 │
 ├───────────────┐
 │               │
 ▼               ▼
Workbook      Permission
 │
 ├───────────────┐
 │               │
 ▼               ▼
Sheet         Revision
 │
 ▼
Cell
```

Chi tiết Cardinality:

```text
User

  1 ───── N Workbook


Workbook

  1 ───── N Sheet


Sheet

  1 ───── N Cell


Workbook

  1 ───── N Revision


User

  1 ───── N Revision


User

  N ───── N Workbook

        thông qua Permission
```

---

# 17. Database Constraints

Database cần enforce các invariant quan trọng.

Yêu cầu:

- [ ] `Sheet.workbookId` phải tham chiếu đến một Workbook tồn tại.
- [ ] `Cell.sheetId` phải tham chiếu đến một Sheet tồn tại.
- [ ] `(sheetId, row, column)` phải là duy nhất.
- [ ] Workbook ownership phải tham chiếu đến một User tồn tại.
- [ ] Permission phải tham chiếu đến một Workbook và User tồn tại.
- [ ] Revision phải tham chiếu đến một Workbook tồn tại.
- [ ] Các Foreign Key không hợp lệ phải bị từ chối.

---

# 18. Cell rỗng

Hệ thống cần phân biệt:

```text
Cell không tồn tại
```

và:

```text
Cell tồn tại nhưng rỗng
```

Đối với Spreadsheet lớn, việc lưu toàn bộ Cell rỗng có thể không hiệu quả.

Do đó, Model ban đầu nên xem xét chiến lược **Sparse Cell**:

```text
Sheet
│
├── Cell A1
├── Cell B2
├── Cell D8
└── ...
```

Các Cell không có nội dung hoặc Formatting liên quan có thể không cần persist.

Yêu cầu:

- [ ] Xác định khi nào Cell rỗng được persist.
- [ ] Xác định khi nào Cell rỗng có thể bị xóa khỏi Database.
- [ ] Đảm bảo Cell không tồn tại được xử lý như Cell rỗng.
- [ ] Giữ lại Cell có Formatting khi cần thiết.

---

# 19. Dữ liệu phía Client và Server

Không phải toàn bộ dữ liệu đều cần được persist.

## Dữ liệu cần Persist

- [ ] User.
- [ ] Workbook.
- [ ] Sheet.
- [ ] Cell Content.
- [ ] Cell Formula.
- [ ] Cell Formatting.
- [ ] Merge Information.
- [ ] Permission.
- [ ] Revision Data cần thiết.

## Dữ liệu Local / Temporary

- [ ] Selection hiện tại.
- [ ] Active Cell.
- [ ] Editing State.
- [ ] Menu đang mở.
- [ ] Clipboard State tạm thời.
- [ ] Viewport Position.
- [ ] Scroll Position.
- [ ] UI State.

Ranh giới chính xác giữa dữ liệu Client và Server có thể được điều chỉnh trong quá trình implementation.

---

# 20. Quy tắc nhất quán dữ liệu

Các quy tắc sau phải luôn được đảm bảo:

- [x] Một Cell thuộc chính xác một Sheet.
- [x] Một Sheet thuộc chính xác một Workbook.
- [x] Vị trí của Cell là duy nhất trong một Sheet.
- [x] Formula Input và Calculated Result là hai khái niệm khác nhau.
- [x] Formatting được tách biệt khỏi Cell Content cơ bản.
- [x] Cell không tồn tại được xem như Cell rỗng.
- [ ] Formula Dependencies phải luôn nhất quán sau các Structural Operation.
- [ ] Revision phải đại diện cho một Logical Operation hợp lệ.
- [ ] Remote Operation không được làm hỏng Local Sheet State.

---

# 21. Mở rộng dữ liệu trong tương lai

Các Entity có thể được bổ sung:

- [ ] Comments.
- [ ] Notifications.
- [ ] Named Ranges.
- [ ] Charts.
- [ ] Filters.
- [ ] Conditional Formatting.
- [ ] Data Validation.
- [ ] Protected Ranges.
- [ ] Version Snapshots.
- [ ] Activity Logs.
- [ ] Offline Synchronization Metadata.

Các Entity này không nên được thêm vào Core Model cho đến khi Requirement tương ứng được xác định rõ.

---

# 22. Trạng thái mô hình dữ liệu

Trạng thái hiện tại:

- [x] Đã xác định User Entity.
- [x] Đã xác định Workbook Entity.
- [x] Đã xác định Sheet Entity.
- [x] Đã xác định Cell Entity.
- [x] Đã xác định khái niệm Cell Value.
- [x] Đã xác định khái niệm Formula.
- [x] Đã xác định khái niệm Cell Style.
- [x] Đã xác định khái niệm Rich Text.
- [x] Đã xác định khái niệm Range.
- [x] Đã xác định khái niệm Merge.
- [x] Đã xác định khái niệm Revision.
- [x] Đã xác định khái niệm Permission.
- [x] Đã xác định các mối quan hệ Core.
- [ ] Database Schema cuối cùng.
- [ ] Kiểu dữ liệu của từng Column.
- [ ] Index cuối cùng.
- [ ] Cách lưu Formula Dependency.
- [ ] Chiến lược lưu Revision.
- [ ] Format lưu Rich Text.
- [ ] Chiến lược lưu Style.
- [ ] Chiến lược Persist Sparse Cell.
