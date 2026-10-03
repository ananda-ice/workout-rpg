# ⚔️ Workout RPG - Quest for Gains

> A retro 8-bit gamified workout and fitness tracker built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS v4**.

![Workout RPG Preview](https://raw.githubusercontent.com/ananda-ice/workout-rpg/main/public/preview.png) *(ถ้ามีภาพ Screenshot สามารถแคปไปวางในโฟลเดอร์ public ได้)*

---

## 🌟 Key Features

- **🎮 RPG Gamification**:
  - **Dynamic EXP Scaling**: ระบบคำนวณ EXP ตามเลเวล ยิ่งเลเวลสูงยิ่งท้าทาย
  - **Weekly Boss Raid**: บอสประจำสัปดาห์ (เช่น Goblin Beast 1,000 HP) ที่ลดเลือดตามปริมาณการออกกำลังกาย
  - **Hero Gear & Achievements**: ปลดล็อกไอเทมสวมใส่และเหรียญรางวัลตามเลเวลและสถิติ
  - **Streak & Campfire Recovery**: ระบบนับสตรีคต่อเนื่อง พร้อมโหมดพักฟื้นรอบกองไฟ (Streak Shield) พักได้สูงสุด 2 วันติดกันโดยไม่เสียสตรีค

- **🎨 Retro 8-Bit Pixel Aesthetic**:
  - **Dynamic Pixel Mountain Background**: ทิวเขาพิกเซลเคลื่อนไหวพร้อมหมอกและดวงดาว
  - **Day / Night Mode**: สลับธีมกลางวัน (Parchment Paper สไตล์กระดาษแผนที่ RPG) และกลางคืน (Dark Retro Arcade) พร้อมจำสถานะผ่าน `localStorage`

- **📊 Health & Body Metrics**:
  - บันทึกน้ำหนักและคำนวณค่า BMI อัตโนมัติ
  - **Weight & BMI Log History**: กราฟแท่งพิกเซลและประวัติบันทึกสถิติน้ำหนักย้อนหลัง

- **🔊 Retro Sound Effects**: เสียงประกอบสไตล์เกมตู้ยุคคลาสสิก (Web Audio API)

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Browser LocalStorage (Zero setup, private by design)

---

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
git clone [https://github.com/ananda-ice/workout-rpg.git](https://github.com/ananda-ice/workout-rpg.git)
cd workout-rpg
npm install