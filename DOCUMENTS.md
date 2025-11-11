# 🧾 Food Store Calculator Application — Specification Document

## 1. Overview

**Project Name:** Food Store Calculator Application  
**Objective:**  
สร้างระบบคำนวณราคาสินค้าสำหรับร้านอาหารที่มีเงื่อนไขส่วนลดซับซ้อน โดยมีทั้ง API และ UI เพื่อให้ลูกค้าสามารถเลือกสินค้า คำนวณราคา และรับส่วนลดได้อัตโนมัติ  

**Scope:**  
- ระบบฝั่ง **Frontend (UI)**  
- ระบบฝั่ง **Backend (API)**  
- ระบบจำลองการเช็ค “Red Set” ว่ามีการสั่งในช่วงเวลา 1 ชั่วโมงหรือไม่  

---

## 2. System Architecture

**Architecture:** Client–Server (RESTful API)  

**Technology Stack:**  
- Frontend: React.js  
- Backend: NestJS  
- Database: PostgreSQL / Redis  
- Testing: Jest  
- Deployment: Docker + Docker Compose  
- Version Control: Git + GitHub Repository  

---

## 3. Functional Requirements

1. **Product Management**
   - แสดงรายการสินค้าทั้ง 7 รายการ  
   - Endpoint สำหรับดึงรายการสินค้า (API)

2. **Order & Calculation**
   - ผู้ใช้สามารถเลือกจำนวนสินค้าต่อรายการ  
   - ระบบคำนวณราคาและส่วนลดอัตโนมัติ (Preview)  
   - ต้องกด **Confirm Order** ใน Order Summary เพื่อบันทึกลงฐานข้อมูลจริง  
   - แสดง Order History พร้อม line item และสถานะ Red Set

3. **Discount Policy Panel**
   - แสดงกฎส่วนลด (Pair, Member, Red Set restriction) ใต้หัวข้อ Products

---

## 4. Discount Rules

- **Pair Discount (5%)**: สำหรับคู่ของ Orange, Pink หรือ Green  
- **Member Discount (10%)**: ถ้ากรอกเลขบัตรสมาชิก  
- **Red Set Restriction**: สั่งได้เพียง 1 ครั้งต่อชั่วโมง  

---

## 5. API Specification

เปิดดูเอกสารแบบ interactive ได้ที่ `http://localhost:3001/api/docs` (Swagger UI)

### `GET /api/products`
> ดึงรายการสินค้าและราคา

### `POST /api/calculate`
> รับออเดอร์จากลูกค้าและคำนวณราคาสุดท้าย

### `POST /api/orders`
> ยืนยันคำสั่งซื้อและบันทึกลงฐานข้อมูล (ใช้ payload เดียวกับ calculate)

### `GET /api/orders`
> ดึงรายการ order ล่าสุด พร้อม line item และ flag ว่ามี Red Set หรือไม่

### `GET /api/red-status`
> ตรวจสอบสถานะ Red set

---

## 6. UI Specification

**Components:**  
- Product List  
- Discount Policy (details/accordion)
- Member Card Input  
- Calculate Button (preview)
- Result Summary + Confirm Order  
- Order History

---

## 7. Database Design

**Tables:**  
1. `products (id, name, price)`  
2. `orders (id, created_at, total, member_card)`  
3. `order_items (id, order_id, product_id, quantity)`  
4. `red_orders_log (id, ordered_at)`  

---

## 8. Business Logic Summary

**คำนวณราคาตามสูตร:**  
```text
subtotal = sum(price * quantity)
pairDiscount = 5% สำหรับคู่สินค้า
memberDiscount = 10% ถ้ามี memberCard
total = subtotal - pairDiscount - memberDiscount
```

**Order Flow:**  
1. ผู้ใช้กรอกจำนวนสินค้า → `POST /api/calculate` → ได้ preview ส่วนลด  
2. ผู้ใช้กด Confirm → `POST /api/orders` → ตรวจ Red Set, Save orders/order_items, อัปเดต order history  
3. UI refresh order history และ Red status อัตโนมัติ  

---

## 9. Testing

Unit tests ตรวจสอบ logic ส่วนลดและข้อจำกัดการสั่ง Red set  
Integration tests สำหรับ `/api/orders` และ `/api/red-status`  
Frontend build/test ensures calculate + confirm flow compileสำเร็จ  

---

## 10. Deployment

- **Local:** Docker Compose (API + DB + Frontend)  
- **Production:** AWS / Render / DigitalOcean  
- **CI/CD:** GitHub Actions  
