# ECAP — Official Website

เว็บไซต์ทางการของสายการเรียน **ECAP (English Communication & Academic Programme)**
ธีม Luxury · Noir & Gold · ฟอนต์ Kanit · มีโหมดสว่าง (Ivory) ในตัว

เว็บทั้งหมดอยู่ในโฟลเดอร์ [`docs/`](docs) เป็น HTML/CSS/JS ล้วน ไม่ต้อง build และไม่พึ่งไลบรารีภายนอก (ยกเว้นฟอนต์จาก Google Fonts)

## ลูกเล่นในเว็บ

| ส่วน | ลูกเล่น |
| --- | --- |
| Preloader | ตัวอักษร ECAP ไล่ขึ้นพร้อมตัวนับ 000 → 100 แล้วม่านเปิดขึ้น |
| Hero | สนามตัวอักษรบน canvas ที่เรืองแสงตามเมาส์, ตัว ECAP ขนาดยักษ์เคลื่อนแบบ parallax, คำที่สลับแบบ scramble, การ์ดพจนานุกรมพร้อมปุ่มฟังเสียง |
| ทั้งหน้า | Smooth scroll, cursor ทองแบบกำหนดเอง, ปุ่มแม่เหล็ก, แถบความคืบหน้า, film grain, หัวข้อเผยทีละคำ |
| Marquee | คำศัพท์พร้อม part of speech วิ่งตามทิศและความเร็วการเลื่อน |
| About | ข้อความ manifesto ค่อย ๆ สว่างตามการเลื่อน, ตัวเลขนับขึ้น |
| Pillars | การ์ด 6 parts of speech เอียงแบบ 3D พร้อมแสงขอบตามเมาส์ |
| Journey | เลื่อนแนวนอนแบบ pinned เล่าเส้นทาง ม.4–ม.6 ผ่าน Tense |
| Courses | ภาพตัวอย่างลอยตามเมาส์เมื่อชี้รายวิชา |
| Grammar Lab | เกม “Spot the mistake” 6 ข้อ + Word of the Day ที่กดฟังเสียงได้ |
| Life at ECAP | การ์ดกิจกรรมลากเลื่อนได้แบบมีแรงเฉื่อย |
| Theme | สลับ Noir/Ivory ด้วยเอฟเฟกต์วงกลมขยาย (View Transitions) |
| Footer | ตัว ECAP ยักษ์ค่อย ๆ เติมสีทองตามการเลื่อน, นาฬิกาเวลากรุงเทพฯ |
| Easter egg | พิมพ์ `e` `c` `a` `p` บนคีย์บอร์ดที่ไหนก็ได้ |

ทุกเอฟเฟกต์ปิดอัตโนมัติเมื่อผู้ใช้ตั้งค่า “ลดการเคลื่อนไหว” (prefers-reduced-motion) และบนมือถือจะใช้การเลื่อนแบบปกติ

## แก้ไขข้อมูลติดต่อ

เปิดไฟล์ [`docs/assets/js/main.js`](docs/assets/js/main.js) แล้วแก้ object `SITE` ด้านบนสุด

```js
const SITE = {
  email: 'ecap@yourschool.ac.th',
  phone: '02-000-0000',
  lineId: '@ecap.official',
  lineUrl: 'https://line.me/R/ti/p/@ecap.official',
  facebookName: 'ECAP Official',
  facebookUrl: 'https://www.facebook.com/',
  instagramHandle: '@ecap.official',
  instagramUrl: 'https://www.instagram.com/',
  address: 'ฝ่ายวิชาการ อาคาร 1 ชั้น 2',
  mapUrl: 'https://maps.google.com/?q=Bangkok',
  formEndpoint: ''
};
```

ค่าทุกช่องในหน้าเว็บ (เมนู, ส่วนติดต่อ, footer) จะเปลี่ยนตามนี้ทั้งหมด
ควรแก้ค่าเดียวกันใน `docs/index.html` ด้วย เพื่อให้ผู้ที่ปิด JavaScript และ search engine เห็นข้อมูลที่ถูกต้อง

**แบบฟอร์มติดต่อ:** ถ้าเว้น `formEndpoint` ไว้ ปุ่มส่งจะเปิดแอปอีเมลของผู้ใช้พร้อมข้อความที่กรอก
ถ้าต้องการให้ส่งเข้ากล่องอีเมลอัตโนมัติ สมัคร [Formspree](https://formspree.io) (ฟรี) แล้วใส่ URL เช่น `https://formspree.io/f/abcdwxyz`

ข้อมูลหลักสูตร ตัวเลข สถิติ และกิจกรรมในเว็บเป็นตัวอย่างเริ่มต้น โปรดตรวจและแก้ให้ตรงกับข้อมูลจริงของโรงเรียนใน `docs/index.html`

## เปิดเว็บจริง (GitHub Pages)

Repo นี้มี workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) ที่ deploy โฟลเดอร์ `docs/` ขึ้น GitHub Pages ทุกครั้งที่มีการ push เข้า `main`

ทำครั้งแรกครั้งเดียว:

1. ไปที่ **Settings → Pages** ของ repo
2. ตรง **Build and deployment → Source** เลือก **GitHub Actions**
3. Merge โค้ดเข้า branch `main` (หรือเข้า **Actions → Deploy ECAP website → Run workflow**)
4. รอประมาณ 1 นาที เว็บจะออนไลน์ที่ **https://ekkies.github.io/learn-github/**

## ใช้โดเมนของตัวเอง (เช่น `ecap-school.com`)

1. ซื้อโดเมนจากผู้ให้บริการใดก็ได้ (Namecheap, Cloudflare, GoDaddy ฯลฯ)
2. ตั้งค่า DNS ที่ผู้ให้บริการโดเมน
   - ถ้าใช้ `www.ecap-school.com` → เพิ่ม `CNAME` ชื่อ `www` ชี้ไปที่ `ekkies.github.io`
   - ถ้าใช้โดเมนหลัก `ecap-school.com` → เพิ่ม `A` record 4 ตัว: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. กลับมาที่ **Settings → Pages → Custom domain** ใส่ชื่อโดเมน กด Save แล้วติ๊ก **Enforce HTTPS**
4. แก้ URL ใน `docs/index.html` (`og:image`), `docs/robots.txt` และ `docs/sitemap.xml` ให้เป็นโดเมนใหม่
5. ถ้าใช้โดเมนของตัวเอง ให้แก้ลิงก์ `/learn-github/` ใน `docs/404.html` เป็น `/`

## ดูเว็บบนเครื่อง

```bash
cd docs
python3 -m http.server 8000
# เปิด http://localhost:8000
```

## โครงสร้างไฟล์

```
docs/
├── index.html            หน้าเว็บหลัก
├── 404.html              หน้า Not Found
├── assets/
│   ├── css/style.css     ธีม สี ฟอนต์ และ layout ทั้งหมด (token อยู่ด้านบนไฟล์)
│   ├── js/main.js        ลูกเล่นทั้งหมด + ข้อมูลติดต่อ (SITE) + คำถามเกม + คำศัพท์
│   └── img/              favicon และภาพสำหรับแชร์ลงโซเชียล
├── robots.txt
└── sitemap.xml
```
