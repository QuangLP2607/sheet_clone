# Roadmap

## 1. Mục đích tài liệu

Tài liệu này định nghĩa roadmap triển khai cho hệ thống spreadsheet.

Roadmap được tổ chức dựa trên **dependency** và **priority**, thay vì dựa trên thứ tự của các tính năng UI.

Mục tiêu chính:

- Xây dựng spreadsheet engine cốt lõi trước.
- Thiết lập nền tảng backend và persistence.
- Bổ sung dần các tính năng spreadsheet nâng cao.
- Tránh triển khai tính năng khi foundation cần thiết chưa tồn tại.
- Giúp tiến độ phát triển có thể đo lường được.

---

# 2. Nguyên tắc phát triển

- [x] Xây dựng core trước các tính năng nâng cao.
- [x] Triển khai và validate từng layer trước khi phụ thuộc nhiều vào layer đó.
- [x] Tránh premature optimization.
- [x] Không triển khai collaboration trước khi operation model ổn định.
- [x] Không triển khai formula phức tạp trước khi cell model ổn định.
- [ ] Đảm bảo mỗi phase có thể được test độc lập.
- [ ] Refactor khi các assumption về architecture không còn đúng.
- [ ] Cập nhật roadmap khi priority thay đổi.

---

# 3. Phase 0 — Project Foundation

**Mục tiêu:** Thiết lập cấu trúc project cơ bản.

### Frontend

- [x] Tạo frontend project
- [x] Thiết lập React + TypeScript
- [x] Thiết lập styling system
- [x] Tạo application layout cơ bản
- [x] Tạo toolbar foundation
- [x] Tạo rich-text foundation
- [ ] Thiết lập frontend folder structure
- [ ] Thiết lập state management structure
- [ ] Thiết lập API client structure
- [ ] Thiết lập common types

### Backend

- [ ] Tạo backend project
- [ ] Thiết lập TypeScript
- [ ] Thiết lập backend framework
- [ ] Thiết lập environment configuration
- [ ] Thiết lập database connection
- [ ] Thiết lập basic error handling
- [ ] Thiết lập API structure

---

# 4. Phase 1 — Spreadsheet Core

**Mục tiêu:** Xây dựng một spreadsheet có thể sử dụng được cho single-user.

### Grid

- [ ] Render spreadsheet grid
- [ ] Render row headers
- [ ] Render column headers
- [ ] Render corner
- [ ] Render cells
- [ ] Hỗ trợ grid có kích thước lớn
- [ ] Thêm virtualization

### Selection

- [ ] Select một cell
- [ ] Select range
- [ ] Drag selection
- [ ] Extend selection bằng keyboard
- [ ] Select row
- [ ] Select column
- [ ] Select all

### Editing

- [ ] Enter edit mode
- [ ] Edit cell value
- [ ] Commit cell value
- [ ] Cancel editing
- [ ] Nhập multiline text
- [ ] Navigation sau khi editing
- [ ] Xử lý keyboard shortcuts

### Navigation

- [ ] Arrow navigation
- [ ] Enter navigation
- [ ] Tab navigation
- [ ] Shift + navigation
- [ ] Home / End
- [ ] Page navigation

---

# 5. Phase 2 — Cell Data Model

**Mục tiêu:** Thiết lập representation nội bộ của dữ liệu spreadsheet.

- [ ] Implement cell model
- [ ] Implement sheet model
- [ ] Implement workbook model
- [ ] Implement sparse cell storage
- [ ] Implement cell value types
- [ ] Implement cell update operations
- [ ] Define operation types
- [ ] Validate cell coordinates
- [ ] Validate sheet boundaries

Sau khi hoàn thành phase này:

```text
User Action
    ↓
Sheet Engine
    ↓
Operation
    ↓
State
    ↓
UI
```

phải hoạt động mà **không yêu cầu backend**.

---

# 6. Phase 3 — Backend & Persistence

**Mục tiêu:** Persistence dữ liệu spreadsheet.

### Database

- [ ] Create database
- [ ] Create User model
- [ ] Create Workbook model
- [ ] Create Sheet model
- [ ] Create Cell model
- [ ] Add foreign keys
- [ ] Add unique constraints
- [ ] Add indexes
- [ ] Run migrations

### Backend API

- [ ] Authentication API
- [ ] Workbook API
- [ ] Sheet API
- [ ] Cell API
- [ ] Batch update API
- [ ] Error response format

### Frontend Integration

- [ ] Connect API client
- [ ] Load workbook
- [ ] Load sheet
- [ ] Save cell changes
- [ ] Save batch operations
- [ ] Handle API failures
- [ ] Handle loading state

---

# 7. Phase 4 — Clipboard

**Mục tiêu:** Implement hành vi clipboard của spreadsheet.

- [ ] Copy cell
- [ ] Copy range
- [ ] Cut cell
- [ ] Cut range
- [ ] Paste cell
- [ ] Paste range
- [ ] Paste values
- [ ] Paste formatting
- [ ] Internal clipboard representation
- [ ] External clipboard integration
- [ ] Keyboard shortcuts
- [ ] Validate pasted ranges

---

# 8. Phase 5 — Formatting

**Mục tiêu:** Implement các tính năng formatting cơ bản của spreadsheet.

### Cell Formatting

- [ ] Font family
- [ ] Font size
- [ ] Bold
- [ ] Italic
- [ ] Underline
- [ ] Strikethrough
- [ ] Text color
- [ ] Background color
- [ ] Horizontal alignment
- [ ] Vertical alignment
- [ ] Text wrapping
- [ ] Borders

### Rich Text

- [x] Rich-text foundation
- [ ] Bold text ranges
- [ ] Italic text ranges
- [ ] Underline text ranges
- [ ] Text color ranges
- [ ] Font size ranges
- [ ] Font family ranges
- [ ] Persist rich text
- [ ] Restore rich text

### Number Formatting

- [ ] General
- [ ] Number
- [ ] Currency
- [ ] Percentage
- [ ] Date
- [ ] Custom number format

---

# 9. Phase 6 — Formula Engine

**Mục tiêu:** Đưa formula vào spreadsheet.

### Formula Input

- [ ] Detect formula input
- [ ] Store formula expression
- [ ] Parse formula
- [ ] Validate formula
- [ ] Display formula errors

### References

- [ ] Single-cell references
- [ ] Range references
- [ ] Relative references
- [ ] Absolute references
- [ ] Cross-sheet references

### Calculation

- [ ] Build dependency graph
- [ ] Recalculate affected cells
- [ ] Handle dependency chains
- [ ] Detect circular references
- [ ] Cache calculation results

### Initial Functions

- [ ] SUM
- [ ] AVERAGE
- [ ] MIN
- [ ] MAX
- [ ] COUNT
- [ ] IF

---

# 10. Phase 7 — History

**Mục tiêu:** Implement undo / redo đáng tin cậy.

- [ ] Define logical operation model
- [ ] Store local operations
- [ ] Undo operation
- [ ] Redo operation
- [ ] Group related operations
- [ ] Clear redo stack after new operation
- [ ] Handle paste as one logical operation
- [ ] Handle formatting as logical operations
- [ ] Handle row / column operations
- [ ] Define interaction with remote operations

---

# 11. Phase 8 — Structural Operations

**Mục tiêu:** Hỗ trợ các thay đổi mang tính cấu trúc của spreadsheet.

### Rows

- [ ] Insert row
- [ ] Delete row
- [ ] Resize row
- [ ] Hide row
- [ ] Show row

### Columns

- [ ] Insert column
- [ ] Delete column
- [ ] Resize column
- [ ] Hide column
- [ ] Show column

### Merge

- [ ] Merge cells
- [ ] Unmerge cells
- [ ] Store merged ranges
- [ ] Validate overlapping merges
- [ ] Define merge content behavior

### Formula Integration

- [ ] Update references after row insertion
- [ ] Update references after row deletion
- [ ] Update references after column insertion
- [ ] Update references after column deletion

---

# 12. Phase 9 — Workbook & Sheet Management

**Mục tiêu:** Cung cấp khả năng navigation hoàn chỉnh cho workbook.

### Workbook

- [ ] Create workbook
- [ ] Rename workbook
- [ ] Delete workbook
- [ ] Open workbook

### Sheet

- [ ] Create sheet
- [ ] Rename sheet
- [ ] Delete sheet
- [ ] Duplicate sheet
- [ ] Reorder sheets
- [ ] Switch active sheet

---

# 13. Phase 10 — Authentication & Permissions

**Mục tiêu:** Bảo mật application.

- [ ] User registration
- [ ] User login
- [ ] User logout
- [ ] Session management
- [ ] Authentication middleware
- [ ] Workbook ownership
- [ ] Viewer permission
- [ ] Editor permission
- [ ] Permission validation
- [ ] Unauthorized access handling

---

# 14. Phase 11 — Realtime Collaboration

**Mục tiêu:** Cho phép nhiều user cùng edit một workbook.

### Connection

- [ ] Establish WebSocket connection
- [ ] Authenticate realtime connection
- [ ] Join workbook session
- [ ] Leave workbook session
- [ ] Handle reconnect
- [ ] Handle disconnect

### Synchronization

- [ ] Send local operations
- [ ] Receive remote operations
- [ ] Apply remote operations
- [ ] Prevent duplicate operations
- [ ] Track operation ordering
- [ ] Handle synchronization failures

### Presence

- [ ] Track active users
- [ ] Show active users
- [ ] Show active sheet
- [ ] Show remote selections
- [ ] Show remote editing state

### Conflict Handling

- [ ] Define conflict model
- [ ] Handle simultaneous cell edits
- [ ] Handle structural conflicts
- [ ] Handle reconnect synchronization
- [ ] Validate final state

---

# 15. Phase 12 — Performance

**Mục tiêu:** Đảm bảo spreadsheet vẫn usable với dataset lớn.

### Rendering

- [ ] Virtualized cells
- [ ] Virtualized rows
- [ ] Virtualized columns
- [ ] Minimize unnecessary renders
- [ ] Optimize cell editor

### Data

- [ ] Lazy-load sheet data
- [ ] Batch API requests
- [ ] Batch state updates
- [ ] Optimize sparse cell storage

### Formula

- [ ] Incremental recalculation
- [ ] Dependency caching
- [ ] Avoid unnecessary recalculation

### Realtime

- [ ] Batch realtime operations where appropriate
- [ ] Avoid broadcasting redundant changes
- [ ] Handle high-frequency updates

---

# 16. Phase 13 — Reliability & Testing

**Mục tiêu:** Đưa hệ thống đến trạng thái đủ ổn định cho real usage.

### Unit Tests

- [ ] Cell operations
- [ ] Range operations
- [ ] Selection
- [ ] Clipboard
- [ ] Formatting
- [ ] Formula parser
- [ ] Formula calculation
- [ ] History
- [ ] Row / column operations

### Integration Tests

- [ ] API
- [ ] Database persistence
- [ ] Workbook loading
- [ ] Sheet loading
- [ ] Batch operations
- [ ] Authentication
- [ ] Permissions

### Realtime Tests

- [ ] Two-client synchronization
- [ ] Simultaneous edits
- [ ] Disconnect / reconnect
- [ ] Operation ordering
- [ ] Conflict handling

### UI Tests

- [ ] Cell editing
- [ ] Selection
- [ ] Toolbar
- [ ] Clipboard
- [ ] Sheet management

---

# 17. Phase 14 — Import / Export

**Mục tiêu:** Hỗ trợ trao đổi dữ liệu spreadsheet.

- [ ] Export spreadsheet
- [ ] Import spreadsheet
- [ ] CSV support
- [ ] XLSX support
- [ ] Preserve values
- [ ] Preserve formulas
- [ ] Preserve formatting where supported

---

# 18. Phase 15 — Advanced Features

Các tính năng này được cố tình trì hoãn.

- [ ] Comments
- [ ] Notifications
- [ ] Named ranges
- [ ] Charts
- [ ] Filters
- [ ] Conditional formatting
- [ ] Data validation
- [ ] Protected ranges
- [ ] Version history
- [ ] Activity log
- [ ] Offline mode

---

# 19. Milestones

## Milestone 1 — Basic Spreadsheet

**Target:**

```text
Grid
+
Selection
+
Editing
+
Navigation
```

**Status:**

- [ ] Complete

---

## Milestone 2 — Persistent Spreadsheet

**Target:**

```text
Basic Spreadsheet
+
Backend
+
Database
+
Persistence
```

**Status:**

- [ ] Complete

---

## Milestone 3 — Usable Spreadsheet

**Target:**

```text
Persistence
+
Clipboard
+
Formatting
+
Workbook / Sheet Management
```

**Status:**

- [ ] Complete

---

## Milestone 4 — Spreadsheet Engine

**Target:**

```text
Usable Spreadsheet
+
Formula
+
History
+
Structural Operations
```

**Status:**

- [ ] Complete

---

## Milestone 5 — Collaborative Spreadsheet

**Target:**

```text
Spreadsheet Engine
+
Authentication
+
Permissions
+
Realtime Collaboration
```

**Status:**

- [ ] Complete

---

## Milestone 6 — Production Readiness

**Target:**

```text
Collaboration
+
Performance
+
Testing
+
Reliability
```

**Status:**

- [ ] Complete

---

# 20. Current Development State

Trạng thái hiện tại của project:

- [x] Requirements defined
- [x] High-level architecture defined
- [x] Data model defined
- [x] Toolbar foundation exists
- [x] Rich-text foundation exists
- [ ] Spreadsheet grid
- [ ] Cell engine
- [ ] State management
- [ ] Backend
- [ ] Database
- [ ] API
- [ ] Formula engine
- [ ] History
- [ ] Collaboration

---

# 21. Roadmap Rules

- [x] Không sử dụng legacy implementation làm architectural source of truth.
- [x] Chỉ sử dụng legacy code làm reference cho các technology hoặc idea đã từng sử dụng.
- [x] Requirements có priority cao hơn implementation hiện tại.
- [x] Architecture có priority cao hơn từng component riêng lẻ.
- [x] Data model phải ổn định trước khi finalize database schema.
- [x] Operation model nên được thiết lập trước khi implement collaboration.
- [x] Formula dependency design nên được thiết lập trước khi implement các formula phức tạp.
- [ ] Các thay đổi lớn về architecture phải được phản ánh trong architecture document.
- [ ] Các requirements đã hoàn thành phải được phản ánh trong roadmap.
