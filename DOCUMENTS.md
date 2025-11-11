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
   - ระบบคำนวณราคาและส่วนลดอัตโนมัติ  

---

## 4. Discount Rules

- **Pair Discount (5%)**: สำหรับคู่ของ Orange, Pink หรือ Green  
- **Member Discount (10%)**: ถ้ากรอกเลขบัตรสมาชิก  
- **Red Set Restriction**: สั่งได้เพียง 1 ครั้งต่อชั่วโมง  

---

## 5. API Specification

### `GET /api/products`
> ดึงรายการสินค้าและราคา

### `POST /api/calculate`
> รับออเดอร์จากลูกค้าและคำนวณราคาสุดท้าย

### `GET /api/red-status`
> ตรวจสอบสถานะ Red set

---

## 6. UI Specification

**Components:**  
- Product List  
- Member Card Input  
- Calculate Button  
- Result Summary  

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

---

## 9. Testing

Unit tests ตรวจสอบ logic ส่วนลดและข้อจำกัดการสั่ง Red set  

---

## 10. Deployment

- **Local:** Docker Compose (API + DB + Frontend)  
- **Production:** AWS / Render / DigitalOcean  
- **CI/CD:** GitHub Actions  
