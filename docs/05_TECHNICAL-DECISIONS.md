# Technical Decisions

## 1. Mục đích tài liệu

Tài liệu này ghi lại các quyết định kỹ thuật quan trọng được đưa ra trong quá trình phát triển hệ thống spreadsheet.

Mục đích:

- Ghi lại các quyết định kỹ thuật quan trọng.
- Giải thích lý do đưa ra quyết định.
- Lưu lại các phương án đã được cân nhắc.
- Tránh việc các phương án đã bị loại bỏ được xem xét lại mà không có lý do.
- Giúp đánh giá các thay đổi về architecture trong tương lai dễ dàng hơn.

Tài liệu này chỉ nên chứa **các quyết định**, không phải các ghi chú kỹ thuật chung.

---

# 2. Quy tắc quyết định

- [ ] Mọi quyết định kỹ thuật quan trọng phải được ghi lại.
- [ ] Mỗi quyết định phải có lý do.
- [ ] Các phương án thay thế quan trọng phải được ghi lại.
- [ ] Quyết định phải được đánh giá dựa trên requirements của project.
- [ ] Việc thay đổi hoặc đảo ngược một quyết định quan trọng phải được ghi lại.
- [ ] Các chi tiết implementation nhỏ không cần ghi vào đây.

---

# 3. Trạng thái quyết định

Các trạng thái có thể sử dụng:

```text
PROPOSED
ACCEPTED
REJECTED
SUPERSEDED
```

- `PROPOSED` — Đề xuất
- `ACCEPTED` — Đã chấp nhận
- `REJECTED` — Đã từ chối
- `SUPERSEDED` — Đã được thay thế bởi quyết định khác

---

# 4. Decision Template

## DEC-XXX — [Decision Title]

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Tại sao cần đưa ra quyết định này?

### Decision

Quyết định được đưa ra là gì?

### Reason

Tại sao lựa chọn phương án này?

### Alternatives

- [ ] Alternative 1
- [ ] Alternative 2
- [ ] Alternative 3

### Consequences

Ưu điểm, nhược điểm hoặc trade-off của quyết định này là gì?

### Related Documents

- `REQUIREMENTS.md`
- `ARCHITECTURE.md`
- `DATA-MODEL.md`
- `ROADMAP.md`

---

# 5. Architecture Decisions

## DEC-001 — Frontend Architecture

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Xác định architecture tổng thể của frontend cho spreadsheet application.

### Decision

### Reason

### Alternatives

- [ ] Option 1
- [ ] Option 2
- [ ] Option 3

### Consequences

---

## DEC-002 — Backend Architecture

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Xác định architecture của backend và các responsibility chính.

### Decision

### Reason

### Alternatives

- [ ] Option 1
- [ ] Option 2
- [ ] Option 3

### Consequences

---

# 6. State Management Decisions

## DEC-003 — Frontend State Management

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Xác định cách quản lý state của workbook, sheet, cell, selection, UI và history.

### Decision

### Reason

### Alternatives

- [ ] Option 1
- [ ] Option 2
- [ ] Option 3

### Consequences

---

# 7. Database Decisions

## DEC-004 — Database

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Xác định technology database được sử dụng để lưu trữ persistent spreadsheet data.

### Decision

### Reason

### Alternatives

- [ ] Option 1
- [ ] Option 2
- [ ] Option 3

### Consequences

---

## DEC-005 — Cell Storage Strategy

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Xác định cách cell data được lưu trữ và truy xuất một cách hiệu quả.

### Decision

### Reason

### Alternatives

- [ ] Lưu mọi cell
- [ ] Sparse cell storage
- [ ] Khác

### Consequences

---

# 8. API Decisions

## DEC-006 — API Strategy

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Xác định cách frontend giao tiếp với backend.

### Decision

### Reason

### Alternatives

- [ ] REST API
- [ ] GraphQL
- [ ] Khác

### Consequences

---

# 9. Realtime Decisions

## DEC-007 — Realtime Communication

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Xác định cách các client gửi và nhận spreadsheet changes theo realtime.

### Decision

### Reason

### Alternatives

- [ ] WebSocket
- [ ] Server-Sent Events
- [ ] Polling
- [ ] Khác

### Consequences

---

## DEC-008 — Collaboration Conflict Strategy

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Xác định cách xử lý các thay đổi đồng thời từ nhiều user.

### Decision

### Reason

### Alternatives

- [ ] Last-write-wins
- [ ] Operation-based synchronization
- [ ] OT
- [ ] CRDT
- [ ] Khác

### Consequences

---

# 10. Formula Decisions

## DEC-009 — Formula Engine

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Xác định formula được parse và calculate ở đâu và bằng cách nào.

### Decision

### Reason

### Alternatives

- [ ] Frontend calculation
- [ ] Backend calculation
- [ ] Shared calculation engine
- [ ] External formula library
- [ ] Khác

### Consequences

---

## DEC-010 — Formula Result Storage

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Xác định calculated formula result có được persist hay được tính động.

### Decision

### Reason

### Alternatives

- [ ] Calculate on demand
- [ ] Cache locally
- [ ] Persist calculated result
- [ ] Hybrid approach

### Consequences

---

# 11. History Decisions

## DEC-011 — Undo / Redo

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Xác định cách spreadsheet history được biểu diễn và quản lý.

### Decision

### Reason

### Alternatives

- [ ] Operation-based history
- [ ] State snapshots
- [ ] Hybrid approach

### Consequences

---

# 12. Rich Text Decisions

## DEC-012 — Rich Text Storage

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Xác định cách rich text bên trong cell được biểu diễn và persist.

### Decision

### Reason

### Alternatives

- [ ] HTML
- [ ] JSON runs
- [ ] Editor-specific format
- [ ] Khác

### Consequences

---

# 13. Performance Decisions

## DEC-013 — Grid Rendering

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Xác định cách render spreadsheet grid lớn một cách hiệu quả.

### Decision

### Reason

### Alternatives

- [ ] Normal DOM rendering
- [ ] Row virtualization
- [ ] Column virtualization
- [ ] Two-dimensional virtualization
- [ ] Khác

### Consequences

---

# 14. Authentication Decisions

## DEC-014 — Authentication Strategy

**Status:** PROPOSED

**Date:** YYYY-MM-DD

### Context

Xác định cách user authenticate với application.

### Decision

### Reason

### Alternatives

- [ ] Session-based authentication
- [ ] JWT
- [ ] OAuth
- [ ] Khác

### Consequences

---

# 15. Rejected Decisions

Section này ghi lại các approach đã được **explicitly rejected**.

## REJ-XXX — [Rejected Approach]

**Date:** YYYY-MM-DD

### Approach

### Reason for Rejection

### Replacement

---

# 16. Superseded Decisions

Section này ghi lại các decision trước đây đã được accepted nhưng sau đó được thay thế.

## DEC-XXX → DEC-XXX

**Old Decision:**

**New Decision:**

### Reason for Change

### Migration Impact

---

# 17. Decision Log

| ID      | Decision                        | Status   | Date       |
| ------- | ------------------------------- | -------- | ---------- |
| DEC-001 | Frontend Architecture           | PROPOSED | YYYY-MM-DD |
| DEC-002 | Backend Architecture            | PROPOSED | YYYY-MM-DD |
| DEC-003 | Frontend State Management       | PROPOSED | YYYY-MM-DD |
| DEC-004 | Database                        | PROPOSED | YYYY-MM-DD |
| DEC-005 | Cell Storage Strategy           | PROPOSED | YYYY-MM-DD |
| DEC-006 | API Strategy                    | PROPOSED | YYYY-MM-DD |
| DEC-007 | Realtime Communication          | PROPOSED | YYYY-MM-DD |
| DEC-008 | Collaboration Conflict Strategy | PROPOSED | YYYY-MM-DD |
| DEC-009 | Formula Engine                  | PROPOSED | YYYY-MM-DD |
| DEC-010 | Formula Result Storage          | PROPOSED | YYYY-MM-DD |
| DEC-011 | Undo / Redo                     | PROPOSED | YYYY-MM-DD |
| DEC-012 | Rich Text Storage               | PROPOSED | YYYY-MM-DD |
| DEC-013 | Grid Rendering                  | PROPOSED | YYYY-MM-DD |
| DEC-014 | Authentication Strategy         | PROPOSED | YYYY-MM-DD |
