# 📋 Checklist: การใช้งาน Enhanced API

## ✅ สิ่งที่พร้อมใช้งานแล้ว

### 1. TypeScript API Functions

- [x] `lib/api-enhanced.ts` - 5 functions สำหรับดึงข้อมูล
- [x] Type-safe interfaces ครบถ้วน
- [x] Error handling ทุก function
- [x] ไม่ต้องติดตั้ง dependencies เพิ่ม

### 2. Static Data Generation Script

- [x] `scripts/generate-data.mjs` - Node.js script
- [x] สร้าง 3 JSON files: action summary, bill details, province stats
- [x] พร้อมใช้งาน: `node scripts/generate-data.mjs`

### 3. Example Component

- [x] `components/MPActionList.tsx` - Component แสดงสถิติ ส.ส.
- [x] Material-UI styling
- [x] Responsive grid layout
- [x] Loading และ error states

### 4. Documentation

- [x] `docs/API-ENHANCED.md` - คู่มือการใช้งาน API
- [x] `docs/MIGRATION-SUMMARY.md` - สรุปการปรับปรุง
- [x] `README.md` - Updated with new features

---

## 🎯 Next Steps - เลือกอย่างใดอย่างหนึ่ง

### Option A: ใช้ Real-time API (แนะนำสำหรับ Prototype)

#### ขั้นตอนที่ 1: Import functions

```typescript
// ใน component หรือ page
import {
  fetchMPActionSummary,
  fetchBillVoteDetails,
  fetchProvinceVoteSummary,
} from "@/lib/api-enhanced";
```

#### ขั้นตอนที่ 2: ใช้งาน

```typescript
"use client";

import { useEffect, useState } from "react";
import { fetchMPActionSummary, MPActionSummary } from "@/lib/api-enhanced";

export default function MyComponent() {
  const [data, setData] = useState<MPActionSummary[]>([]);

  useEffect(() => {
    async function loadData() {
      const mps = await fetchMPActionSummary();
      setData(mps);
    }
    loadData();
  }, []);

  return (
    <div>
      {data.map((mp) => (
        <div key={mp.person}>
          <h3>{mp.person}</h3>
          <p>เห็นด้วย: {mp.เห็นด้วย}</p>
        </div>
      ))}
    </div>
  );
}
```

#### ขั้นตอนที่ 3: ทดสอบ

```bash
npm run dev
# เข้า http://localhost:3000/your-page
```

---

### Option B: ใช้ Static Data (แนะนำสำหรับ Production)

#### ขั้นตอนที่ 1: Generate data

```bash
node scripts/generate-data.mjs
```

**Output:**

```
🚀 Starting data generation...

🔄 Generating MP Action Summary...
✅ Generated 500 MP records
📝 Saved to: public/data/mp-action-summary.json

🔄 Generating Bill Vote Details...
✅ Generated 15000 vote records
📝 Saved to: public/data/bill-vote-details.json

📝 Saved to: public/data/province-summary.json

✨ Data generation completed successfully!
```

#### ขั้นตอนที่ 2: เพิ่มใน package.json (Optional)

```json
{
  "scripts": {
    "generate:data": "node scripts/generate-data.mjs",
    "prebuild": "npm run generate:data"
  }
}
```

#### ขั้นตอนที่ 3: ใช้งาน static files

```typescript
"use client";

import { useEffect, useState } from "react";

export default function MyComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const response = await fetch("/data/mp-action-summary.json");
      const mps = await response.json();
      setData(mps);
    }
    loadData();
  }, []);

  return (
    <div>
      {data.map((mp) => (
        <div key={mp.person}>
          <h3>{mp.person}</h3>
          <p>เห็นด้วย: {mp.เห็นด้วย}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔥 Quick Start - ทดสอบ Component ตัวอย่าง

### สร้างหน้าทดสอบ:

```typescript
// app/test-mp/page.tsx
import MPActionList from "@/components/MPActionList";

export default function TestMPPage() {
  return (
    <div style={{ padding: "20px" }}>
      <MPActionList />
    </div>
  );
}
```

### เข้าไปดู:

```
http://localhost:3000/test-mp
```

---

## 📊 Data Structure Reference

### MPActionSummary (เหมือน example.json)

```typescript
{
  person: string;           // "กนก ลื้มตระกูล"
  province: string | null;  // "อุตรดิตถ์"
  image: string | null;     // URL รูปภาพ
  งดออกเสียง: number;        // 0
  "ลา / ขาดลงมติ": number;  // 1
  เห็นด้วย: number;          // 0
  ไม่ลงคะแนนเสียง: number;   // 0
  ไม่เห็นด้วย: number;       // 0
  รวมลงมติ: number;         // 0
}
```

### BillVoteDetail (เหมือน example2.json)

```typescript
{
  person: string; // "สยาม หัตถสงเคาระห์"
  province: string | null; // "หนองบัวลำภู"
  option: string; // "ไม่เห็นด้วย"
  law: string; // "ร่างพระราชบัญญัติ ..."
  result: string | null; // "ไม่ผ่าน"
}
```

---

## 🐛 Troubleshooting

### ❌ ปัญหา: "Failed to fetch"

**สาเหตุ:** API endpoint ไม่พร้อม  
**วิธีแก้:**

1. เช็คว่า development server รันอยู่: `npm run dev`
2. เช็คว่า `/api/graphql` ทำงาน
3. ลอง static data แทน

### ❌ ปัญหา: "Data is empty"

**สาเหตุ:** GraphQL query ไม่ return ข้อมูล  
**วิธีแก้:**

1. เช็ค console logs
2. ตรวจสอบ term filter (ปัจจุบันใช้ term 26)
3. ทดสอบ query ที่ GraphQL endpoint โดยตรง

### ❌ ปัญหา: TypeScript errors

**สาเหตุ:** Type mismatch  
**วิธีแก้:**

1. Import interfaces จาก `lib/api-enhanced`
2. ใช้ `MPActionSummary` และ `BillVoteDetail` types
3. เช็ค nullable values (`province: string | null`)

---

## 📚 API Functions Reference

### 1. `fetchMPActionSummary()`

```typescript
const mps = await fetchMPActionSummary();
// Returns: MPActionSummary[] - ข้อมูลการทำงานของ ส.ส. ทั้งหมด
```

### 2. `fetchBillVoteDetails()`

```typescript
const votes = await fetchBillVoteDetails();
// Returns: BillVoteDetail[] - รายละเอียดการลงมติทั้งหมด
```

### 3. `fetchProvinceVoteSummary(provinceName)`

```typescript
const bangkokMPs = await fetchProvinceVoteSummary("กรุงเทพมหานคร");
// Returns: MPActionSummary[] - ส.ส. ในจังหวัดที่ระบุ
```

### 4. `fetchMPVoteHistory(mpName)`

```typescript
const { summary, details } = await fetchMPVoteHistory("พิธา ลิ้มเจริญรัตน์");
// Returns: { summary: MPActionSummary | null, details: BillVoteDetail[] }
```

### 5. `fetchProvinceSummaryStats()`

```typescript
const stats = await fetchProvinceSummaryStats();
// Returns: Record<string, { totalMPs, avgAgree, avgDisagree, avgAbstain, avgAbsent }>
```

---

## ✨ Tips & Best Practices

### 💡 Performance

- ใช้ `useMemo` สำหรับ filter/sort ข้อมูลจำนวนมาก
- ใช้ `useCallback` สำหรับ event handlers
- พิจารณา pagination ถ้ามีข้อมูลมากกว่า 100 records

### 💡 Caching

- ใช้ React Query หรือ SWR สำหรับ caching
- หรือใช้ `useState` + `useEffect` แบบง่ายๆ

### 💡 Error Handling

- แสดง loading state ขณะโหลดข้อมูล
- แสดง error message ถ้าเกิดข้อผิดพลาด
- มี fallback UI สำหรับกรณีไม่มีข้อมูล

---

## 🎉 Ready to Use!

ไฟล์ทั้งหมดพร้อมใช้งานแล้ว เลือกวิธีการใช้งานตามความเหมาะสม:

- 🚀 **Prototype/Demo**: ใช้ Real-time API
- ⚡ **Production/Performance**: ใช้ Static Data
- 📊 **Hybrid**: ใช้ทั้งสองแบบตามหน้า

---

**Happy Coding! 🎊**
