# 📊 Enhanced API Documentation

## ภาพรวม

โปรเจคนี้มี 2 วิธีในการดึงข้อมูลการทำงานของ ส.ส. และรายละเอียดการลงมติ:

### ✅ วิธีที่ 1: Real-time API (แนะนำ)

ใช้ TypeScript functions ใน `lib/api-enhanced.ts` เพื่อดึงข้อมูลแบบ real-time จาก GraphQL API

### 📦 วิธีที่ 2: Pre-generated Static Data

ใช้ Node.js script เพื่อ generate JSON files ล่วงหน้า (เหมาะถ้าข้อมูลไม่เปลี่ยนบ่อย)

---

## 🚀 วิธีที่ 1: Real-time API

### การติดตั้ง

ไม่ต้องติดตั้งอะไรเพิ่ม - ใช้ได้เลย!

### ตัวอย่างการใช้งาน

```typescript
import {
  fetchMPActionSummary,
  fetchBillVoteDetails,
  fetchProvinceVoteSummary,
  fetchMPVoteHistory,
  fetchProvinceSummaryStats,
} from "@/lib/api-enhanced";

// 1. ดึงข้อมูลการทำงานของ ส.ส. ทั้งหมด
const mpActions = await fetchMPActionSummary();
/*
[
  {
    person: "กนก ลื้มตระกูล",
    province: "อุตรดิตถ์",
    image: "https://...",
    งดออกเสียง: 0,
    "ลา / ขาดลงมติ": 1,
    เห็นด้วย: 0,
    ไม่ลงคะแนนเสียง: 0,
    ไม่เห็นด้วย: 0,
    รวมลงมติ: 0
  },
  ...
]
*/

// 2. ดึงรายละเอียดการลงมติในแต่ละร่างกฎหมาย
const billDetails = await fetchBillVoteDetails();
/*
[
  {
    person: "สยาม หัตถสงเคาระห์",
    province: "หนองบัวลำภู",
    option: "ไม่เห็นด้วย",
    law: "ร่างพระราชบัญญัติ ...",
    result: "ไม่ผ่าน"
  },
  ...
]
*/

// 3. ดึงข้อมูลตามจังหวัด
const bangkokMPs = await fetchProvinceVoteSummary("กรุงเทพมหานคร");

// 4. ดึงประวัติการลงมติของ ส.ส. คนใดคนหนึ่ง
const { summary, details } = await fetchMPVoteHistory("พิธา ลิ้มเจริญรัตน์");

// 5. สรุปสถิติแบ่งตามจังหวัด
const provinceStats = await fetchProvinceSummaryStats();
/*
{
  "กรุงเทพมหานคร": {
    totalMPs: 30,
    avgAgree: 45.5,
    avgDisagree: 12.3,
    avgAbstain: 2.1,
    avgAbsent: 5.2
  },
  ...
}
*/
```

### ใช้ใน Component

```tsx
"use client";

import { useEffect, useState } from "react";
import { fetchMPActionSummary, MPActionSummary } from "@/lib/api-enhanced";

export default function MPList() {
  const [mps, setMPs] = useState<MPActionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchMPActionSummary();
        setMPs(data);
      } catch (error) {
        console.error("Error loading MPs:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {mps.map((mp) => (
        <div key={mp.person}>
          <h3>{mp.person}</h3>
          <p>จังหวัด: {mp.province}</p>
          <p>เห็นด้วย: {mp.เห็นด้วย} ครั้ง</p>
          <p>ไม่เห็นด้วย: {mp.ไม่เห็นด้วย} ครั้ง</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 📦 วิธีที่ 2: Pre-generated Static Data

### การติดตั้ง

ไม่ต้องติดตั้งอะไรเพิ่ม - ใช้ Node.js built-in fetch

### การ Generate ข้อมูล

```bash
# รัน script เพื่อ generate JSON files
node scripts/generate-data.mjs
```

จะสร้างไฟล์ใน `public/data/`:

- `mp-action-summary.json` - ข้อมูลการทำงานของ ส.ส.
- `bill-vote-details.json` - รายละเอียดการลงมติ
- `province-summary.json` - สถิติแบ่งตามจังหวัด

### การใช้งาน Static Data

```typescript
// ดึงข้อมูลจาก static JSON
const response = await fetch("/data/mp-action-summary.json");
const mpData = await response.json();
```

### เพิ่มใน package.json

```json
{
  "scripts": {
    "generate:data": "node scripts/generate-data.mjs",
    "prebuild": "npm run generate:data"
  }
}
```

---

## 📋 เปรียบเทียบ 2 วิธี

| คุณสมบัติ        | Real-time API | Static Data        |
| ---------------- | ------------- | ------------------ |
| **ข้อมูลล่าสุด** | ✅ Real-time  | ⚠️ ต้อง regenerate |
| **Performance**  | ⚠️ ช้ากว่า    | ✅ เร็วมาก         |
| **Server Load**  | ⚠️ เยอะ       | ✅ น้อย            |
| **Build Time**   | ✅ เร็ว       | ⚠️ ช้าขึ้น         |
| **SEO**          | ⚠️ CSR        | ✅ SSG/ISR ได้     |
| **ความซับซ้อน**  | ✅ ง่าย       | ⚠️ ต้องรัน script  |

---

## 🎯 คำแนะนำ

### ใช้ Real-time API เมื่อ:

- ต้องการข้อมูลที่ทันสมัยที่สุด
- จำนวน request ไม่มาก
- มี loading state ที่ดี

### ใช้ Static Data เมื่อ:

- ข้อมูลไม่เปลี่ยนแปลงบ่อย
- ต้องการ performance สูงสุด
- ต้องการ SEO ที่ดี (SSG)
- มี traffic สูง

---

## 🔧 การปรับปรุงจาก Python Script เดิม

### ✅ ข้อดีของ TypeScript Implementation:

1. **Type Safety**: มี TypeScript interfaces ครบถ้วน
2. **Integration**: ทำงานกับ Next.js โดยตรง
3. **Performance**: ใช้ Map แทน nested loops
4. **Error Handling**: มี try-catch ครบทุก function
5. **Flexibility**: แยก functions ตามการใช้งาน
6. **No Dependencies**: ไม่ต้องติดตั้ง pandas, requests
7. **Modern**: ใช้ async/await แทน synchronous code

### 🗑️ ปัญหาที่แก้ไขจาก Python Script:

1. ❌ ~~Hard-coded filter~~ → ✅ ไม่มี filter ที่แปลก
2. ❌ ~~ใช้ `provinces[-1]`~~ → ✅ filter เฉพาะ active memberships
3. ❌ ~~Nested loops~~ → ✅ ใช้ Map optimization
4. ❌ ~~No error handling~~ → ✅ มี try-catch
5. ❌ ~~Manual file writing~~ → ✅ ดึงได้ตรงๆ หรือ auto-generate

---

## 📚 API Reference

### `fetchMPActionSummary()`

ดึงข้อมูลการทำงานของ ส.ส. ทั้งหมด

**Returns:** `Promise<MPActionSummary[]>`

### `fetchBillVoteDetails()`

ดึงรายละเอียดการลงมติในแต่ละร่างกฎหมาย

**Returns:** `Promise<BillVoteDetail[]>`

### `fetchProvinceVoteSummary(provinceName: string)`

ดึงข้อมูลการลงมติตามจังหวัด

**Parameters:**

- `provinceName`: ชื่อจังหวัด (เช่น "กรุงเทพมหานคร")

**Returns:** `Promise<MPActionSummary[]>`

### `fetchMPVoteHistory(mpName: string)`

ดึงข้อมูลการลงมติของ ส.ส. คนใดคนหนึ่ง

**Parameters:**

- `mpName`: ชื่อ ส.ส. (เช่น "พิธา ลิ้มเจริญรัตน์")

**Returns:** `Promise<{ summary: MPActionSummary | null; details: BillVoteDetail[] }>`

### `fetchProvinceSummaryStats()`

สรุปสถิติการลงมติแบ่งตามจังหวัด

**Returns:** `Promise<Record<string, ProvinceSummary>>`

---

## 🐛 Troubleshooting

### ปัญหา: CORS Error

**วิธีแก้:** ใช้ API route `/api/graphql` แทนการเรียก direct

### ปัญหา: Data ไม่ครบ

**วิธีแก้:** เช็ค term filter (ปัจจุบันใช้ term 26)

### ปัญหา: Performance ช้า

**วิธีแก้:** เปลี่ยนไปใช้ Static Data generation

---

## 📞 Support

หากมีปัญหาหรือข้อสงสัย:

1. ดู error logs ใน console
2. เช็ค GraphQL endpoint ว่าทำงานปกติ
3. ตรวจสอบ data structure จาก API
