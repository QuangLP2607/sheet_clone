# Kiến trúc

## 1. Mục đích tài liệu

Tài liệu này mô tả kiến trúc tổng thể của hệ thống Spreadsheet.

Mục tiêu là xác định rõ:

- Các thành phần chính của hệ thống.
- Trách nhiệm của từng thành phần.
- Luồng dữ liệu giữa Frontend và Backend.
- Cách Sheet Engine xử lý dữ liệu.
- Cách State được quản lý.
- Cách dữ liệu được lưu trữ và đồng bộ.
- Cách hệ thống hỗ trợ Realtime Collaboration.
- Các ranh giới trách nhiệm giữa các module.

Tài liệu này tập trung vào **kiến trúc hệ thống**, không mô tả chi tiết implementation của từng component.

---

## 2. Mục tiêu kiến trúc

Kiến trúc hệ thống cần đáp ứng các mục tiêu sau:

- [x] Tách biệt rõ Frontend và Backend.
- [x] Tách UI khỏi Spreadsheet Engine.
- [x] Có khả năng mở rộng số lượng Cell lớn.
- [ ] Hỗ trợ Formula Engine.
- [ ] Hỗ trợ Undo / Redo.
- [ ] Hỗ trợ Clipboard.
- [ ] Hỗ trợ Formatting.
- [ ] Hỗ trợ Merge Cells.
- [ ] Hỗ trợ Realtime Collaboration.
- [ ] Hỗ trợ Authentication và Authorization.
- [ ] Có khả năng mở rộng trong tương lai.

### Nguyên tắc chính

> UI không được trực tiếp chịu trách nhiệm xử lý business logic của Spreadsheet.

Business logic của Spreadsheet phải nằm trong **Sheet Engine** hoặc các module chuyên trách.

---

# 3. Tổng quan hệ thống

Kiến trúc tổng thể:

```text
┌──────────────────────────────────────────────┐
│                  Frontend                    │
│                                              │
│  ┌──────────────┐    ┌──────────────────┐   │
│  │     UI       │───▶│   Sheet Engine   │   │
│  └──────────────┘    └─────────┬────────┘   │
│                                │            │
│                        ┌───────▼────────┐   │
│                        │  State Layer   │   │
│                        └───────┬────────┘   │
│                                │            │
│                    ┌───────────┴──────────┐ │
│                    │                      │ │
│               HTTP API              WebSocket│
└────────────────────┬──────────────────────┘
                     │
                     │
┌────────────────────▼─────────────────────────┐
│                   Backend                     │
│                                               │
│  ┌──────────────┐     ┌──────────────────┐   │
│  │   API Layer  │────▶│  Business Logic  │   │
│  └──────────────┘     └────────┬─────────┘   │
│                                │             │
│                     ┌──────────▼──────────┐  │
│                     │    Data Access      │  │
│                     └──────────┬──────────┘  │
└────────────────────────────────┼─────────────┘
                                 │
                         ┌───────▼────────┐
                         │   PostgreSQL   │
                         └────────────────┘
```

Hệ thống được chia thành hai phần chính:

```text
Frontend
    │
    ├── UI
    ├── Sheet Engine
    ├── State Management
    ├── API Client
    └── WebSocket Client

Backend
    │
    ├── API
    ├── Business Logic
    ├── Realtime
    ├── Authentication
    ├── Authorization
    └── Database Access
```

---

# 4. Kiến trúc Frontend

Frontend chịu trách nhiệm:

- Hiển thị giao diện.
- Nhận input từ người dùng.
- Quản lý trạng thái phía Client.
- Xử lý các thao tác Spreadsheet phía Client.
- Render Grid.
- Gửi thay đổi lên Backend.
- Nhận dữ liệu Realtime từ Backend.

Frontend được chia thành các layer chính:

```text
Frontend
│
├── UI Layer
│
├── Sheet Engine
│
├── State Layer
│
├── API Client
│
└── Realtime Client
```

---

# 5. UI Layer

UI Layer chịu trách nhiệm hiển thị và tương tác với người dùng.

Các thành phần chính có thể bao gồm:

```text
UI
│
├── Toolbar
├── Formula Bar
├── Grid
│   ├── Row Header
│   ├── Column Header
│   └── Cell
│
├── Sheet Tabs
├── Context Menu
├── Dialog
└── Other UI Components
```

UI Layer không được trực tiếp xử lý các logic phức tạp như:

- Formula calculation.
- History management.
- Persistence.
- Collaboration.
- Database operations.

Ví dụ:

```text
User click Cell
      │
      ▼
     UI
      │
      ▼
Sheet Engine
      │
      ▼
State
```

Không nên:

```text
UI
 │
 ├── Update database
 ├── Calculate formula
 ├── Manage history
 └── Broadcast WebSocket
```

---

# 6. Sheet Engine

Sheet Engine là thành phần cốt lõi của Spreadsheet.

Nó chịu trách nhiệm xử lý các operation liên quan đến Spreadsheet.

Các nhóm chức năng chính:

```text
Sheet Engine
│
├── Cell Operations
│
├── Range Operations
│
├── Selection
│
├── Clipboard
│
├── Formatting
│
├── Formula
│
├── Merge
│
├── History
│
└── Structural Operations
```

Ví dụ:

```text
SET_CELL_VALUE
SET_CELL_STYLE
PASTE_RANGE
CLEAR_RANGE
INSERT_ROW
DELETE_ROW
INSERT_COLUMN
DELETE_COLUMN
MERGE_CELLS
UNMERGE_CELLS
```

Sheet Engine nên hoạt động dựa trên các operation rõ ràng thay vì để UI tự thay đổi State.

Ví dụ:

```text
User input
    │
    ▼
SET_CELL_VALUE
    │
    ▼
Sheet Engine
    │
    ├── Validate
    ├── Update state
    ├── Create history entry
    └── Generate persistence operation
```

---

# 7. Quản lý State

State Layer chịu trách nhiệm lưu trạng thái Spreadsheet ở Client.

Có thể chia State thành các nhóm:

```text
Application State
│
├── Workbook State
│
├── Sheet State
│
├── Cell State
├── Selection State
├── Formatting State
├── History State
└── UI State
```

Không phải toàn bộ dữ liệu đều cần lưu trong cùng một State.

Ví dụ:

```text
Persistent State
├── Workbook
├── Sheet
├── Cell
└── Formatting

Transient State
├── Selection
├── Active Cell
├── Editing State
└── UI State
```

### Nguyên tắc

State phải có **Single Source of Truth**.

Không được tồn tại nhiều nguồn dữ liệu độc lập đại diện cho cùng một trạng thái.

Ví dụ không nên:

```text
Grid Cell Value
     +
Local Component State
     +
Global Cell State
     +
DOM Content
```

mà không có quy tắc đồng bộ rõ ràng.

---

# 8. Kiến trúc Backend

Backend chịu trách nhiệm:

- Authentication.
- Authorization.
- Workbook management.
- Sheet management.
- Cell persistence.
- Revision management.
- Collaboration.
- Validation.
- Data integrity.
- API.
- Realtime communication.

Backend có thể được tổ chức như sau:

```text
Backend
│
├── API Layer
│
├── Authentication
│
├── Authorization
│
├── Workbook Module
│
├── Sheet Module
│
├── Cell Module
│
├── Revision Module
│
├── Collaboration Module
│
└── Database Layer
```

Mỗi module nên có trách nhiệm rõ ràng.

---

# 9. API Layer

API Layer là interface giữa Frontend và Backend.

API chịu trách nhiệm:

- Nhận request.
- Validate input cơ bản.
- Authentication.
- Gọi Business Logic.
- Trả response.
- Chuẩn hóa error response.

Ví dụ:

```text
POST /workbooks
GET  /workbooks/:id
GET  /workbooks/:id/sheets
POST /sheets
PATCH /cells
DELETE /cells
```

API Layer không nên chứa business logic phức tạp.

Không nên:

```text
Controller
    │
    ├── Calculate formula
    ├── Update multiple entities
    ├── Manage revision
    └── Broadcast realtime
```

Thay vào đó:

```text
Controller
    │
    ▼
Service
    │
    ├── Business Logic
    ├── Persistence
    └── Realtime Event
```

---

# 10. Realtime Layer

Realtime Layer chịu trách nhiệm đồng bộ thay đổi giữa các Client.

Công nghệ dự kiến:

```text
WebSocket
```

Luồng cơ bản:

```text
Client A
   │
   │ SET_CELL_VALUE
   ▼
Backend
   │
   ├── Validate
   ├── Persist
   └── Broadcast
          │
          ├──────────────▶ Client B
          ├──────────────▶ Client C
          └──────────────▶ Client D
```

Realtime event nên biểu diễn bằng operation rõ ràng.

Ví dụ:

```text
{
  type: "SET_CELL_VALUE",
  sheetId: "...",
  row: 10,
  column: 5,
  value: "Hello"
}
```

Không nên broadcast toàn bộ Sheet khi chỉ một Cell thay đổi.

Không nên:

```text
Cell changed
    │
    ▼
Send entire sheet
```

Nên:

```text
Cell changed
    │
    ▼
Send operation
```

---

# 11. Database Layer

Database là nguồn lưu trữ dữ liệu lâu dài của hệ thống.

Database dự kiến:

```text
PostgreSQL
```

Các entity chính:

```text
User
Workbook
Sheet
Cell
Revision
Permission
```

Có thể mở rộng thêm:

```text
Merge
CellStyle
Comment
Attachment
Notification
```

Database Layer chịu trách nhiệm:

- Persistence.
- Transaction.
- Constraint.
- Query.
- Index.
- Data integrity.

Database không nên chịu trách nhiệm cho UI State.

---

# 12. Luồng dữ liệu

## 12.1 Đọc dữ liệu

```text
User opens workbook
        │
        ▼
Frontend
        │
        ▼
GET Workbook
        │
        ▼
Backend
        │
        ▼
Database
        │
        ▼
Backend
        │
        ▼
Frontend State
        │
        ▼
Sheet Engine
        │
        ▼
UI
```

---

## 12.2 Thay đổi Cell

```text
User edits Cell
        │
        ▼
UI
        │
        ▼
Sheet Engine
        │
        ├── Validate
        ├── Update State
        ├── Create History
        │
        ▼
API
        │
        ▼
Backend
        │
        ├── Validate
        ├── Persist
        └── Broadcast
```

---

## 12.3 Nhận thay đổi từ Client khác

```text
WebSocket
    │
    ▼
Realtime Client
    │
    ▼
Sheet Engine
    │
    ▼
State
    │
    ▼
UI
```

Remote operation phải đi qua cùng một cơ chế xử lý operation của hệ thống.

---

# 13. Mô hình Cell Operation

Thay vì để từng UI component tự thay đổi dữ liệu, hệ thống sử dụng operation.

Ví dụ:

```text
SET_CELL_VALUE
SET_CELL_FORMULA
SET_CELL_STYLE
CLEAR_CELL
PASTE_RANGE
CLEAR_RANGE
INSERT_ROW
DELETE_ROW
INSERT_COLUMN
DELETE_COLUMN
MERGE_CELLS
UNMERGE_CELLS
```

Một operation có thể có cấu trúc:

```text
Operation
│
├── id
├── type
├── workbookId
├── sheetId
├── payload
├── userId
└── timestamp
```

Ví dụ:

```json
{
  "type": "SET_CELL_VALUE",
  "sheetId": "sheet-1",
  "row": 10,
  "column": 5,
  "value": "Hello"
}
```

Operation có thể được sử dụng cho:

- State update.
- History.
- Persistence.
- Realtime.
- Logging.
- Debugging.

---

# 14. Luồng Collaboration

Khi nhiều User cùng chỉnh sửa một Sheet:

```text
              ┌──────────────┐
              │   Backend    │
              └──────┬───────┘
                     │
          ┌──────────┼──────────┐
          │          │          │
          ▼          ▼          ▼
       Client A   Client B   Client C
```

Ví dụ:

```text
Client A
    │
    │ SET_CELL_VALUE
    ▼
Backend
    │
    ├── Validate
    ├── Persist
    └── Broadcast
           │
           ├────────▶ Client B
           └────────▶ Client C
```

Client A không cần nhận lại operation của chính nó nếu State local đã được cập nhật theo cơ chế optimistic update.

Tuy nhiên, hệ thống cần có cơ chế xác nhận hoặc reconciliation khi Backend từ chối operation.

---

# 15. Ranh giới trách nhiệm

Mỗi layer phải có trách nhiệm rõ ràng.

| Thành phần               | Trách nhiệm                |
| ------------------------ | -------------------------- |
| UI                       | Hiển thị và nhận input     |
| Sheet Engine             | Spreadsheet business logic |
| State                    | Lưu trạng thái Client      |
| API Client               | Giao tiếp HTTP             |
| Realtime Client          | Giao tiếp WebSocket        |
| Backend Controller       | Nhận và trả HTTP request   |
| Backend Service          | Business logic phía Server |
| Repository / Data Access | Giao tiếp Database         |
| Database                 | Persistent data            |

### Nguyên tắc

UI không truy cập Database.

```text
UI
 ↓
Sheet Engine
 ↓
API Client
 ↓
Backend
 ↓
Database
```

Không được:

```text
UI
 ↓
Database
```

---

# 16. Kiến trúc hiệu năng

Spreadsheet có thể chứa số lượng Cell rất lớn.

Do đó hệ thống phải tránh render toàn bộ Grid.

Kiến trúc Grid cần hỗ trợ:

```text
Virtualization
```

Ví dụ:

```text
Actual Sheet

Row 1
Row 2
Row 3
...
Row 1,000,000
```

Không render toàn bộ:

```text
DOM
├── Row 1
├── Row 2
├── Row 3
├── ...
└── Row 1,000,000
```

Thay vào đó:

```text
Viewport
     │
     ▼
Visible Rows
     │
     ▼
Visible Columns
     │
     ▼
Rendered Cells
```

### Các mục tiêu hiệu năng

- [ ] Không render Cell không nằm trong viewport.
- [ ] Hạn chế re-render không cần thiết.
- [ ] Batch nhiều Cell operations.
- [ ] Debounce / throttle các thao tác phù hợp.
- [ ] Chỉ persist phần dữ liệu thay đổi.
- [ ] Không load toàn bộ Workbook nếu không cần thiết.
- [ ] Hỗ trợ lazy loading khi dữ liệu lớn.

---

# 17. Xử lý lỗi

Hệ thống cần phân biệt:

```text
Client Error
Server Error
Network Error
Validation Error
Authorization Error
Conflict Error
Persistence Error
```

API response nên có format thống nhất.

Ví dụ:

```json
{
  "success": false,
  "error": {
    "code": "CELL_UPDATE_FAILED",
    "message": "Unable to update cell."
  }
}
```

Frontend cần xử lý:

```text
Request
   │
   ├── Success
   │
   └── Error
        │
        ├── Retry
        ├── Rollback
        ├── Show message
        └── Reconnect
```

---

# 18. Khả năng mở rộng

Kiến trúc phải cho phép thêm tính năng mà không cần thay đổi toàn bộ hệ thống.

Các tính năng tương lai có thể bao gồm:

```text
Comments
Mentions
Notifications
Charts
Conditional Formatting
Named Ranges
Data Validation
Import / Export
Advanced Formula Functions
Version History
Presence
Cursor Sharing
Permissions
```

Các tính năng này nên được thêm dưới dạng module độc lập khi có nhu cầu.

Ví dụ:

```text
Sheet Engine
│
├── Cell
├── Range
├── Formula
├── Formatting
├── History
│
└── Future
    ├── Chart
    ├── Conditional Formatting
    └── Data Validation
```

---

# 19. Quy tắc kiến trúc

Các quy tắc sau phải được tuân thủ trong quá trình phát triển.

## 19.1 Không đưa Business Logic vào UI

```text
UI ≠ Business Logic
```

UI chỉ gọi operation hoặc action.

---

## 19.2 Không để component tự quản lý dữ liệu Spreadsheet

Cell component không nên tự quyết định cách lưu Cell.

Ví dụ không nên:

```text
Cell
 ├── fetch API
 ├── update database
 ├── calculate formula
 └── update history
```

Nên:

```text
Cell
   │
   ▼
Sheet Engine
   │
   ▼
State / API
```

---

## 19.3 Không phụ thuộc trực tiếp vào Database Schema ở Frontend

Frontend chỉ biết API contract.

```text
Frontend
    │
    ▼
API Contract
    │
    ▼
Backend
    │
    ▼
Database
```

---

## 19.4 Operation phải có tính xác định

Cùng một State và cùng một Operation phải tạo ra cùng một kết quả.

Ví dụ:

```text
State A
+
SET_CELL_VALUE(row=1, column=1, value="Hello")
=
State B
```

---

## 19.5 Không gửi toàn bộ Sheet cho một thay đổi nhỏ

Không nên:

```text
1 Cell changed
    ↓
Send entire Sheet
```

Nên:

```text
1 Cell changed
    ↓
Send Cell Operation
```

---

## 19.6 Không tối ưu quá sớm

Ưu tiên:

```text
Correctness
    ↓
Maintainability
    ↓
Performance
```

Không nên xây dựng hệ thống quá phức tạp trước khi có nhu cầu thực tế.

---

## 19.7 Không để một module làm quá nhiều việc

Mỗi module phải có trách nhiệm rõ ràng.

Ví dụ:

```text
Formula Engine
    → Formula

History
    → Undo / Redo

Clipboard
    → Copy / Paste

Sheet Engine
    → Điều phối các operation
```

---

# 20. Các quyết định kiến trúc cần chốt

Các quyết định sau cần được xác định trước khi implementation sâu.

### Frontend

- [x] React + TypeScript.
- [ ] Cấu trúc Sheet Engine.
- [ ] State management.
- [ ] Grid rendering strategy.
- [ ] Virtualization strategy.
- [ ] Selection architecture.
- [ ] Editing architecture.

### Backend

- [ ] Backend framework.
- [ ] Module structure.
- [ ] API architecture.
- [ ] Authentication.
- [ ] Authorization.
- [ ] WebSocket architecture.

### Database

- [ ] Database engine.
- [ ] Cell storage strategy.
- [ ] Formula storage.
- [ ] Style storage.
- [ ] Revision storage.
- [ ] Permission model.

### Collaboration

- [ ] Realtime protocol.
- [ ] Operation format.
- [ ] Conflict handling.
- [ ] Optimistic update strategy.
- [ ] Reconnection strategy.

### Formula

- [ ] Formula parser.
- [ ] Formula evaluator.
- [ ] Dependency tracking.
- [ ] Circular reference handling.
- [ ] Formula result caching.

---

# 21. Trạng thái kiến trúc

## Đã hoàn thành

- [x] Xác định Frontend / Backend separation.
- [x] Xác định UI Layer.
- [x] Xác định Sheet Engine là core business layer.
- [x] Xác định State Layer.
- [x] Xác định API Layer.
- [x] Xác định Realtime Layer.
- [x] Xác định Database Layer.
- [x] Xác định Operation-based architecture.
- [x] Xác định trách nhiệm cơ bản của các layer.

## Đang chờ quyết định

- [ ] Frontend State Management.
- [ ] Grid Engine.
- [ ] Virtualization.
- [ ] Backend Framework.
- [ ] Database Schema.
- [ ] API Contract.
- [ ] WebSocket Protocol.
- [ ] Collaboration Conflict Strategy.
- [ ] Formula Engine.
- [ ] History Architecture.

## Nguyên tắc phát triển

- [ ] Không implementation sâu trước khi architecture được chốt.
- [ ] Mọi quyết định quan trọng phải được ghi vào `TECHNICAL-DECISIONS.md`.
- [ ] Khi architecture thay đổi, phải cập nhật tài liệu này.
- [ ] Không để code thực tế đi lệch architecture mà không cập nhật quyết định.
