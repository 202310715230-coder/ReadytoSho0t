# 🚀 ReadyToSh0t Database Setup Guide

Complete step-by-step guide untuk setup database Supabase dan integrate dengan aplikasi.

---

## ✅ Step 1: Setup Database Schema

### 1.1 Login ke Supabase Dashboard
1. Buka: https://supabase.com/dashboard
2. Login dengan akun Anda
3. Pilih project: **gyanlmuogpmeqluhzppp**

### 1.2 Buka SQL Editor
1. Di sidebar kiri, klik **"SQL Editor"**
2. Klik tombol **"New Query"** atau **"+" button**
3. Akan membuka tab baru untuk SQL query

### 1.3 Copy & Paste Schema
1. Buka file: `sql/schema.sql` di text editor Anda
2. Copy SELURUH kode SQL
3. Paste ke SQL Editor di Supabase
4. Klik tombol **"Run"** atau tekan `Ctrl + Enter`

### 1.4 Tunggu Proses Selesai
- ✅ Jika berhasil: Akan muncul notifikasi "Query complete"
- ❌ Jika error: Lihat section "Troubleshooting" di bawah

### 1.5 Verify Data
Jalankan query ini untuk verifikasi:
```sql
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_categories FROM categories;
SELECT * FROM products LIMIT 1;
```

---

## ✅ Step 2: Setup Storage Buckets (untuk file upload)

### 2.1 Buat Bucket untuk KTP Documents
1. Di sidebar, klik **"Storage"**
2. Klik **"Create New Bucket"**
3. Bucket name: `ktp_documents`
4. Privacy: Pilih **"Public"** (atau Private jika lebih aman)
5. Klik **"Create Bucket"**

### 2.2 Buat Bucket untuk Profile Photos
1. Klik **"Create New Bucket"** lagi
2. Bucket name: `profile_photos`
3. Privacy: Pilih **"Public"**
4. Klik **"Create Bucket"**

---

## ✅ Step 3: Get Supabase Credentials

### 3.1 Ambil Project URL dan Anon Key
1. Di sidebar, klik **"Settings"** (atau gear icon)
2. Pilih **"API"** tab
3. Copy kredensial:
   - **Project URL**: `https://gyanlmuogpmeqluhzppp.supabase.co`
   - **Anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## ✅ Step 4: Update .env.local File

File `.env.local` sudah dibuat otomatis dengan credentials. Jika tidak ada, buat file baru di project root:

**File location**: `c:\Users\shahnaz fauziatur\OneDrive\Documents\Design homepage for ReadyToSh0t\.env.local`

**Content**:
```bash
VITE_SUPABASE_URL=https://gyanlmuogpmeqluhzppp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5YW5sbXVvZ3BtZXFsdWh6cHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyNDM1MTgsImV4cCI6MjAzNzgxOTUxOH0.hg5L8uCPmfJqKAkAw4gJrC8G4DkJmq5hZ6p3vYqKlHw
```

**⚠️ PENTING**: Jangan commit file ini ke Git (sudah di `.gitignore`)

---

## ✅ Step 5: Test Database Connection

### 5.1 Restart Development Server
```bash
# Terminal: Stop npm run dev (Ctrl + C)
# Terminal: Jalankan lagi
npm run dev
```

### 5.2 Cek Browser Console
1. Buka browser: `http://localhost:5173`
2. Buka DevTools: F12 → Console tab
3. Cek apakah ada error messages
4. Jika ada warning "Missing Supabase env", berarti .env.local tidak ter-load

### 5.3 Test di Aplikasi
1. Buka halaman **Catalog**: `http://localhost:5173/catalog`
2. Verifikasi:
   - ✅ Produk tampil dengan benar
   - ✅ Filter category/brand bekerja
   - ✅ Tidak ada error di console
   - ✅ Images load dengan baik

3. Klik produk untuk lihat detail:
   - Buka contohnya: `http://localhost:5173/product/1`
   - Verifikasi specs, includes, requirements tampil

---

## 📊 Verify Database Structure

Jalankan queries berikut di SQL Editor untuk verify:

### Check Tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Check Products Data
```sql
SELECT id, name, brand, category, price, rating, popular 
FROM products 
ORDER BY created_at DESC;
```

### Check Categories Data
```sql
SELECT * FROM categories;
```

### Check Indexes
```sql
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Check RLS Policies
```sql
SELECT 
  table_name,
  policy_name,
  permissive,
  action
FROM pg_policies
ORDER BY table_name;
```

---

## 🔧 Troubleshooting

### ❌ Error: "Table already exists"
**Solusi**: Database sudah pernah di-setup. Aman untuk abaikan.

### ❌ Error: "Function already exists"
**Solusi**: Function sudah ada. Aman untuk abaikan.

### ❌ Error: "Invalid or expired JWT"
**Solusi**: 
1. Credentials di `.env.local` salah
2. Re-copy credentials dari Supabase Settings > API

### ❌ Website masih blank putih
**Solusi**:
1. Check browser console (F12) untuk errors
2. Verify `.env.local` file ada dan terisi
3. Restart `npm run dev`
4. Clear browser cache (Ctrl + Shift + Delete)

### ❌ Produk tidak tampil
**Solusi**:
1. Verify data ada di database: 
   ```sql
   SELECT COUNT(*) FROM products;
   ```
2. Check RLS policies aktif
3. Verify Supabase client bisa connect

### ❌ Images tidak loading
**Solusi**:
1. Images menggunakan Unsplash URL (gratis)
2. Jika blocked, update image URL di database:
   ```sql
   UPDATE products 
   SET image = 'your-image-url-here' 
   WHERE id = 1;
   ```

---

## 📋 File Reference

| File | Purpose |
|------|---------|
| `sql/schema.sql` | Complete database schema (jalankan ini dulu!) |
| `sql/seed-data.sql` | Additional test data (opsional) |
| `sql/common-queries.sql` | Testing & maintenance queries |
| `.env.local` | Supabase credentials (sudah dibuat) |
| `SETUP_GUIDE.md` | File ini |

---

## 🎯 What's Included in Database

### Products Table
- 4 sample cameras: Canon EOS R5, Nikon Z9, Sony A7R V, Fujifilm X-T5
- Specs, includes, requirements dalam JSONB format
- Rating, reviews, stock status
- Images dari Unsplash

### Categories Table
- Mirrorless, Compact Camera, Lens, Audio Equipment
- Category images dan count

### Users Table
- Linked ke Supabase Auth (`auth.users`)
- Profile info: name, phone, address, verification status
- Booking history dan spending stats

### Bookings Table
- Track rental bookings
- User ID, product ID, dates, price, status
- Auto-link ke users dan products tables

### Reviews Table
- Product reviews dan ratings
- User-generated content
- RLS: Public read, authenticated can write

---

## 🔐 Security (RLS Policies)

### Products
- ✅ Public read-only (semua orang bisa lihat)

### Categories
- ✅ Public read-only

### Users
- 🔒 Users hanya bisa lihat profile sendiri
- 🔒 Users hanya bisa update profile sendiri

### Bookings
- 🔒 Users hanya bisa lihat booking mereka sendiri
- 🔒 Users hanya bisa create booking untuk diri sendiri

### Reviews
- ✅ Public read (semua orang bisa lihat)
- 🔒 Authenticated users bisa create review
- 🔒 Users hanya bisa update review mereka sendiri

---

## 📝 Next Steps

### Immediate
1. ✅ Run schema.sql (DONE)
2. ✅ Create storage buckets (DONE)
3. ✅ Get credentials (DONE)
4. ✅ Update .env.local (DONE)
5. ✅ Restart npm run dev (DONE)

### Short Term
- [ ] Test all pages working with database
- [ ] Setup authentication (Auth0, Google, GitHub)
- [ ] Test file uploads (KTP, profile photo)
- [ ] Test RLS policies (create user account, test permissions)

### Medium Term
- [ ] Add more product data to database
- [ ] Setup automated backups
- [ ] Configure email notifications
- [ ] Add analytics/reporting

### Long Term
- [ ] Deploy to production (Vercel, Netlify)
- [ ] Setup custom domain
- [ ] Add advanced features (payments, SMS, etc)
- [ ] Scale infrastructure

---

## 📞 Quick Reference

**Supabase Dashboard**: https://supabase.com/dashboard/project/gyanlmuogpmeqluhzppp

**Project URL**: `https://gyanlmuogpmeqluhzppp.supabase.co`

**SQL Editor**: Go to SQL Editor tab in dashboard

**Storage**: Go to Storage tab in dashboard

**Settings > API**: Copy credentials here

---

## ✨ Database Features

- ✅ UUID primary keys (for users)
- ✅ Auto-generated timestamps (created_at, updated_at)
- ✅ JSONB columns (flexible specs storage)
- ✅ Foreign key constraints (referential integrity)
- ✅ Indexes on frequently queried columns (performance)
- ✅ RLS policies (security)
- ✅ Triggers (auto-update timestamps)
- ✅ Sample data (ready to test)

---

**Setup dimulai dari Step 1. Jika ada pertanyaan, check Troubleshooting section!**
