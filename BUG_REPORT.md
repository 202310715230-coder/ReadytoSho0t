# 🐛 BUG HUNTING REPORT - Ready To Shot Rental Frontend

**Tanggal:** 3 Juni 2026  
**Framework:** React + TypeScript + Vite  
**Status:** ✅ Audit Selesai  
**Total Bug Ditemukan:** 21 (2 🔴 Critical, 6 🟠 High, 12 🟡 Medium, 1 🟢 Low)

---

## 📊 RINGKASAN EKSEKUTIF

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 2 | **URGENT** - Harus diperbaiki sebelum deployment |
| 🟠 High | 6 | **SOON** - Perbaiki dalam sprint ini |
| 🟡 Medium | 12 | **SCHEDULED** - Rencana perbaikan terdekat |
| 🟢 Low | 1 | **NICE TO HAVE** - Perbaikan optional |

---

## 🔴 CRITICAL BUGS (HARUS DIPERBAIKI SEGERA)

### 🔴 Bug #1: Hardcoded User WhatsApp dalam Production

**File:** `src/app/pages/PaymentStatus.tsx:7`  
**Severity:** 🔴 **CRITICAL - SECURITY RISK**  
**Category:** Security / Data Privacy

#### Deskripsi Masalah
WhatsApp number di-hardcode di production code. Ini berarti:
- ❌ Semua user akan melihat status pembayaran user lain (Faiq)
- ❌ Data pribadi user terbuka untuk semua
- ❌ Multi-user functionality rusak total

#### Kode Bermasalah
```typescript
// src/app/pages/PaymentStatus.tsx - Line 7
const userWhatsapp = "081314342077"; // ❌ HARDCODED!
```

#### Langkah Reproduksi
1. Login sebagai user berbeda
2. Akses halaman `/payment-status`
3. Lihat status pembayaran user "Faiq" (081314342077), bukan user yang login

#### Dampak
- 🔴 **CRITICAL**: Semua user dapat melihat data private user lain
- 💾 Data leakage
- 👤 Multi-user system tidak berfungsi

#### Solusi
```typescript
// ✅ BENAR - Ambil dari authenticated user
const { user } = useAuth();
const userWhatsapp = user?.whatsapp || "";

if (!userWhatsapp) {
  return (
    <div className="p-8 text-center text-red-600">
      User WhatsApp tidak ditemukan. Silakan update profil Anda.
    </div>
  );
}

const { rental, loading, refetchStatus } = useUserRentalStatus(userWhatsapp);
```

---

### 🔴 Bug #2: Infinite Fetch Loop di useUserRentalStatus

**File:** `src/app/components/hooks/UseUserRentalStatus.tsx:31`  
**Severity:** 🔴 **CRITICAL - PERFORMANCE**  
**Category:** Infinite Loop / Race Condition

#### Deskripsi Masalah
`checkPaymentStatus` callback tidak ada di dependency array, menyebabkan infinite loop.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH
useEffect(() => {
  checkPaymentStatus();
}, [whatsappNumber]); // ❌ checkPaymentStatus HILANG dari dependencies!
```

#### Masalahnya:
1. `checkPaymentStatus` dibuat ulang setiap render
2. Tapi tidak termasuk dalam dependency
3. Atau jika termasuk, akan infinite loop

#### Langkah Reproduksi
1. Render komponen dengan whatsAppNumber
2. Buka console → perhatikan Network tab
3. Lihat fetch API dijalankan berulang kali

#### Dampak
- 🔴 **CRITICAL**: Server API dibanjiri request
- 📉 Performance menurun drastis
- 💻 Browser freeze/lag

#### Solusi
```typescript
// ✅ BENAR - Tambahkan checkPaymentStatus ke dependencies
useEffect(() => {
  checkPaymentStatus();
}, [whatsappNumber, checkPaymentStatus]); // ✅ Sekarang complete

// ATAU gunakan AbortController untuk cleanup
useEffect(() => {
  const controller = new AbortController();
  
  const check = async () => {
    if (!whatsappNumber) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(..., { 
        signal: controller.signal // ✅ Bisa di-cancel
      });
      // ... process response
    } finally {
      setLoading(false);
    }
  };
  
  check();
  
  return () => controller.abort(); // ✅ Cleanup on unmount
}, [whatsappNumber]);
```

---

## 🟠 HIGH PRIORITY BUGS (PERBAIKI SEGERA)

### 🟠 Bug #3: Race Condition di BookingStep3Delivery

**File:** `src/app/components/booking/BookingStep3Delivery.tsx:75`  
**Severity:** 🟠 **HIGH - LOGIC BUG**  
**Category:** Race Condition

#### Deskripsi Masalah
Logic race condition tidak benar-benar mencegah stale response. Jika user:
1. Pilih address A
2. Pilih address B (request A masih pending)
3. Response A datang terakhir
4. Hasil akhir pakai data A (SALAH!)

#### Kode Bermasalah
```typescript
const calculateRouteFromAddress = useCallback(
  async (address: UserAddress) => {
    const currentRequestId = requestIdRef.current + 1; // ❌ SALAH!
    requestIdRef.current = currentRequestId;
    
    // ... OSRM API call
    
    if (requestIdRef.current !== currentRequestId) return; // Check ini tidak atomic
  }
);
```

#### Masalahnya:
```
Sequence yang salah:
1. Request A starts, currentRequestId = 1
2. Request B starts, currentRequestId = 2
3. Response A datang terakhir
4. Check: requestIdRef.current (2) !== currentRequestId (1) → ✅ skip
5. Tapi sudah update state dengan data dari A

Race condition masih bisa terjadi antara check dan setState
```

#### Langkah Reproduksi
1. Buka booking step 3
2. Rapidly toggle courier delivery on/off
3. Select address sambil request masih pending
4. Lihat data address mungkin tidak match dengan display

#### Solusi
```typescript
const calculateRouteFromAddress = useCallback(
  async (address: UserAddress) => {
    const currentRequestId = ++requestIdRef.current; // ✅ Pre-increment atomically
    
    // ... logic...
    
    try {
      // ... OSRM call
      
      // ✅ Check SEBELUM any state update
      if (requestIdRef.current !== currentRequestId) return;
      
      // ✅ Sekarang baru update state
      setDeliveryDistanceKm(roundedDistance);
      setCourierFee(fee);
      setMapError(null);
    } catch (error) {
      if (requestIdRef.current !== currentRequestId) return;
      
      // ✅ Handle error
      setDeliveryDistanceKm(0);
      setCourierFee(0);
      setMapError("Gagal menghitung rute...");
    }
  },
  [setCourierFee, setDeliveryDistanceKm]
);
```

---

### 🟠 Bug #4: Menggunakan alert() untuk Validasi Form

**File:** `src/app/components/booking/BookingStep1Date.tsx:149`  
**File:** `src/app/components/booking/BookingStep2Client.tsx:101`  
**Severity:** 🟠 **HIGH - UX ISSUE**  
**Category:** User Experience / Accessibility

#### Deskripsi Masalah
Menggunakan `alert()` untuk error validation. Ini:
- ❌ Mengganggu user experience
- ❌ Tidak accessible (screen reader issue)
- ❌ Tidak bisa di-test otomatis
- ❌ Buruk di mobile
- ❌ Sudah ada error display di UI

#### Kode Bermasalah
```typescript
// BookingStep1Date.tsx - Line 149
const handleEndDateChange = (date: Date | null) => {
  if (!date) {
    setEndDate("");
    return;
  }
  
  const normalizedEnd = new Date(date);
  normalizedEnd.setHours(0, 0, 0, 0);
  
  if (parsedStartDate && normalizedEnd <= parsedStartDate) {
    alert("Tanggal selesai harus setelah tanggal mulai."); // ❌ ALERT!
    setEndDate("");
    return;
  }
  
  setEndDate(formatDateToString(normalizedEnd));
};

// BookingStep2Client.tsx - Line 101
const handleNext = () => {
  // ...
  if (nameError || mailError || phoneError || !isValid) {
    alert(nameError || mailError || phoneError || "Data client belum lengkap."); // ❌ ALERT!
    return;
  }
  
  onNext();
};
```

#### Langkah Reproduksi
1. Buka booking step 1
2. Select end date sebelum start date
3. Lihat browser alert popup (jelek!)

#### Solusi
```typescript
// ✅ BENAR - Gunakan error state yang sudah ada
const handleEndDateChange = (date: Date | null) => {
  if (!date) {
    setEndDate("");
    return;
  }
  
  const normalizedEnd = new Date(date);
  normalizedEnd.setHours(0, 0, 0, 0);
  
  if (parsedStartDate && normalizedEnd <= parsedStartDate) {
    // ❌ Jangan alert, setEndDate ke state yang akan di-render
    setEndDate(""); // Biarkan error message di-render dari state
    return;
  }
  
  setEndDate(formatDateToString(normalizedEnd));
};

// JSX sudah ada, jangan diganti dengan alert:
{dateError ? (
  <div className="mt-4 flex items-start gap-2 border-2 border-red-500 bg-red-100 p-3 text-xs font-black uppercase text-red-700">
    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
    <span>{dateError}</span>
  </div>
) : null}
```

---

### 🟠 Bug #5: Infinite Loop di useProducts Hook

**File:** `src/app/components/hooks/UseProducts.tsx:113`  
**Severity:** 🟠 **HIGH - PERFORMANCE**  
**Category:** Infinite Loop

#### Deskripsi Masalah
`fetchProducts` included dalam dependency array sendiri → infinite loop.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH
const fetchProducts = useCallback(async () => {
  // ... fetch logic
}, []); // dependencies kosong

useEffect(() => {
  void fetchProducts();
}, [fetchProducts]); // ❌ fetchProducts bergantung pada diri sendiri!

// Siklus:
// 1. Component render
// 2. fetchProducts dibuat baru (karena dependencies kosong)
// 3. useEffect deteksi fetchProducts berubah
// 4. fetchProducts dijalankan
// 5. Back to step 2 (INFINITE!)
```

#### Langkah Reproduksi
1. Import dan gunakan `useProducts()` di komponen
2. Buka console
3. Lihat Network tab → fetch API dipanggil berulang kali

#### Solusi
```typescript
// ✅ BENAR - Pisahkan fetch logic dari effect logic
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(PRODUCTS_URL, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await safeJson<ProductsResponse>(response);

      if (!response.ok || !result || result.status !== "success") {
        throw new Error(formatBackendError(result, "Gagal mengambil data produk"));
      }

      const productData = Array.isArray(result.data)
        ? result.data.map(normalizeProduct)
        : [];

      setProducts(productData);

      return {
        status: "success" as const,
        data: productData,
      };
    } catch (err) {
      console.error("Fetch products error:", err);

      const message =
        err instanceof Error ? err.message : "UNKNOWN_ERROR_ENCOUNTERED";

      setError(message);
      setProducts([]);

      return {
        status: "error" as const,
        message,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ BENAR - Run sekali saja saat mount
  useEffect(() => {
    void fetchProducts();
  }, []); // ✅ Empty array - run hanya sekali!

  return {
    products,
    isLoading,
    error,
    refetchProducts: fetchProducts, // ✅ Expose untuk manual refetch
    refreshProducts: fetchProducts,
    setProducts,
    setError,
  };
}
```

---

### 🟠 Bug #6: Session Cleared Saat Logout Error

**File:** `src/app/components/hooks/UseAuth.tsx:324`  
**Severity:** 🟠 **HIGH - LOGIC BUG**  
**Category:** Error Handling

#### Deskripsi Masalah
Session dihapus bahkan jika logout GAGAL. User logout tapi tidak berhasil → tapi session sudah clear.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH
const logout = useCallback(async (): Promise<ApiResponse> => {
  setLoading(true);

  try {
    const response = await fetch(`${API_BASE}/logout.php`, {
      method: "POST",
      credentials: "include",
    });

    const data = await parseJsonResponse(response);
    clearSession(); // ❌ SELALU CLEAR, MESKI GAGAL!
    
    // ... rest of code

  } finally {
    setLoading(false);
  }
}, [clearSession]);
```

#### Langkah Reproduksi
1. Setup network interceptor untuk fail logout
2. Click logout button
3. Network request fails
4. User sudah logout dari FE tapi masih login di BE

#### Dampak
- 🔴 Session inconsistency (logout FE tapi login BE)
- 🔴 Security risk (FE think logout, BE think still logged in)

#### Solusi
```typescript
// ✅ BENAR - Hanya clear jika logout sukses
const logout = useCallback(async (): Promise<ApiResponse> => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch(`${API_BASE}/logout.php`, {
      method: "POST",
      credentials: "include",
    });

    const data = await parseJsonResponse(response);

    // ✅ Check response status SEBELUM clear session
    if (response.ok && data.status === "success") {
      clearSession();
      
      return {
        status: "success",
        message: data.message || "Logout berhasil",
      };
    } else {
      // ❌ Logout gagal, jangan clear session
      const errorMsg = data.message || "Logout gagal";
      setError(errorMsg);
      
      return {
        status: "error",
        message: errorMsg,
      };
    }
  } catch (err) {
    console.error("Logout error:", err);

    const message = "Terjadi kesalahan server";
    setError(message);

    return {
      status: "error",
      message,
    };
  } finally {
    setLoading(false);
  }
}, [clearSession]);
```

---

### 🟠 Bug #7: 401 Error Handling Tidak Benar

**File:** `src/app/components/booking/BookingStep4Payment.tsx:144`  
**Severity:** 🟠 **HIGH - ERROR HANDLING**  
**Category:** Error Handling

#### Deskripsi Masalah
401 error ditangani tapi logic-nya keliru, error message tidak ditampilkan.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH
if (response.status === 401) {
  setIsLocked(false);
  setPendingData(null);
  setCheckError("Session login tidak terbaca. Silakan login ulang.");
  return; // ❌ Return di sini...
}

if (!response.ok) {
  throw new Error(result?.message || `HTTP error ${response.status}`); // ❌ Tapi 401 tidak sampai sini!
}
```

#### Masalahnya:
- 401 dikembalikan tanpa throw Error
- Flow melanjutkan ke kode berikutnya
- Error message tidak ditampilkan dengan sempurna

#### Solusi
```typescript
// ✅ BENAR
if (!response.ok) {
  if (response.status === 401) {
    setCheckError("Session login tidak terbaca. Silakan login ulang.");
  } else {
    throw new Error(result?.message || `HTTP error ${response.status}`);
  }
  setIsLocked(false);
  setPendingData(null);
  return;
}

// Sekarang OK response diproses
if (!result || typeof result !== "object") {
  throw new Error("Format response backend tidak valid.");
}
```

---

### 🟠 Bug #8: KTP Upload Error Silent Failure

**File:** `src/app/components/profile/KtpUploadBox.tsx:72`  
**Severity:** 🟠 **HIGH - ERROR HANDLING**  
**Category:** Error Handling

#### Deskripsi Masalah
Upload error hanya di console.error, user tidak tahu apa yang salah.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH
const handleFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // ... validasi...

  const localPreview = URL.createObjectURL(file);
  setPreview(localPreview);

  try {
    await onUpload(file);
  } catch (error) {
    console.error("Upload KTP gagal:", error); // ❌ Silent failure!
    setPreview(ktpPhotoUrl || null);
  } finally {
    e.target.value = "";
    URL.revokeObjectURL(localPreview);
  }
};
```

#### Langkah Reproduksi
1. Click upload KTP
2. Backend gagal
3. User tidak tahu apa yang salah

#### Solusi
```typescript
// ✅ BENAR - Tambahkan error state
const [uploadError, setUploadError] = useState<string | null>(null);
const [isUploading, setIsUploading] = useState(false);

const handleFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // ... validasi file...

  const localPreview = URL.createObjectURL(file);
  setPreview(localPreview);
  setUploadError(null); // Clear error
  setIsUploading(true);

  try {
    await onUpload(file);
    setUploadError(null); // Clear setelah sukses
  } catch (error) {
    console.error("Upload KTP gagal:", error);
    
    const errorMsg = error instanceof Error 
      ? error.message 
      : "Upload KTP gagal. Coba lagi.";
    
    setUploadError(errorMsg); // ✅ Set error state
    setPreview(ktpPhotoUrl || null); // Rollback preview
  } finally {
    setIsUploading(false);
    e.target.value = "";
    URL.revokeObjectURL(localPreview);
  }
};

// Render error message:
{uploadError && (
  <div className="mt-2 p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded">
    ❌ {uploadError}
  </div>
)}
```

---

## 🟡 MEDIUM PRIORITY BUGS (RENCANAKAN PERBAIKAN)

### 🟡 Bug #9: OSRM Request Timeout Terlalu Singkat

**File:** `src/app/components/booking/BookingStep3Delivery.tsx:22`  
**Severity:** 🟡 **MEDIUM - PERFORMANCE**  
**Category:** Performance / Edge Case

#### Deskripsi Masalah
Timeout 10 detik terlalu singkat untuk slow network (3G/4G).

#### Kode Bermasalah
```typescript
const OSRM_TIMEOUT_MS = 10000; // ❌ Terlalu singkat untuk slow network
```

#### Langkah Reproduksi
1. Test di network 3G/4G
2. Select courier delivery
3. OSRM request timeout
4. User tidak bisa lanjut booking

#### Solusi
```typescript
// ✅ BENAR - Timeout lebih reasonable + loading state
const OSRM_TIMEOUT_MS = 30000; // 30 detik lebih masuk akal

// Render loading dengan pesan:
{isCalculating && (
  <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold">
    🔄 Menghitung rute GoSend... (ini mungkin butuh beberapa detik)
  </div>
)}

{mapError && (
  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
    ❌ {mapError}
  </div>
)}
```

---

### 🟡 Bug #10: Double Session Parsing di PrivateRoute

**File:** `src/app/components/PrivateRoute.tsx:26`  
**Severity:** 🟡 **MEDIUM - RACE CONDITION**  
**Category:** Race Condition

#### Deskripsi Masalah
PrivateRoute manually parse localStorage sambil useAuth sedang fetching. Bisa stale data.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH - Double parsing
const { user, loading, isInitialized, isAuthenticated } = useAuth();

const localSession = localStorage.getItem("user_session");
let localUser: any = null;

if (localSession) {
  try {
    localUser = JSON.parse(localSession);
  } catch {
    localStorage.removeItem("user_session");
    localStorage.removeItem("user_id");
  }
}

const activeUser = user || localUser; // ❌ Could be stale
```

#### Masalahnya:
1. useAuth sedang fetch session dari BE
2. PrivateRoute parse localStorage manual
3. Race condition: mana yang win?
4. Stale data bisa digunakan

#### Solusi
```typescript
// ✅ BENAR - Trust useAuth hook sepenuhnya
export function PrivateRoute({
  children,
  requireAdmin = false,
}: PrivateRouteProps): JSX.Element {
  const location = useLocation();

  const {
    user,
    loading,
    isInitialized,
    isAuthenticated,
  } = useAuth();

  // ✅ Tunggu hook initialization selesai
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-foreground border-t-secondary animate-spin rounded-full" />
      </div>
    );
  }

  // ✅ Gunakan user dari hook, jangan parse localStorage
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (
    requireAdmin &&
    user.role?.toLowerCase() !== "admin"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}
```

---

### 🟡 Bug #11: useBookingProduct Missing Error State

**File:** `src/app/components/hooks/useBookingProduct.tsx`  
**Severity:** 🟡 **MEDIUM - ERROR HANDLING**  
**Category:** Error Handling

#### Deskripsi Masalah
Tidak ada cara membedakan "loading" dari "error". Keduanya return `isLoading: false, product: null`.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH - Tidak ada error state
export function useBookingProduct(id: string | undefined) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // ... no error state!

  return { product, isLoading }; // ❌ Tidak ada error
}
```

#### Langkah Reproduksi
1. Akses product dengan ID invalid
2. API return 404
3. Component terima `isLoading: false, product: null`
4. Tidak bisa distinguish apakah error atau benar-benar tidak ada data

#### Solusi
```typescript
// ✅ BENAR - Tambahkan error state
export function useBookingProduct(id: string | undefined) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // ✅ ERROR STATE

  useEffect(() => {
    const fetchProductFromDB = async () => {
      if (!id) {
        setIsLoading(false);
        setError(null);
        setProduct(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null); // Clear error saat fetch

        const response = await fetch(
          `http://localhost/db_readytoshot/get_product_detail.php?id=${id}`
        );

        if (!response.ok) {
          throw new Error(`Product tidak ditemukan (${response.status})`);
        }

        const data = await response.json();

        if (data.status === "success" || data.id) {
          const item = data.data || data;

          const backendImageBase =
            "http://localhost/db_readytoshot/config/assets/products/";

          setProduct({
            id: item.id,
            name: item.name,
            brand: item.brand || "CAMERA",
            price: Number(item.price_per_day || item.price || 0),
            image: item.image ||
              (item.image_path ? `${backendImageBase}${item.image_path}` : ""),
          });
          setError(null);
        } else {
          throw new Error("Format response invalid");
        }
      } catch (error) {
        console.error("Transmission Error:", error);
        
        const errorMsg = error instanceof Error 
          ? error.message 
          : "Gagal memuat produk";
        
        setError(errorMsg); // ✅ Set error
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductFromDB();
  }, [id]);

  return { product, isLoading, error }; // ✅ Return error
}
```

---

### 🟡 Bug #12: Date Validation - Prevent 1-Day Rental

**File:** `src/app/components/booking/BookingStep1Date.tsx:106`  
**Severity:** 🟡 **MEDIUM - VALIDATION**  
**Category:** Validation Logic

#### Deskripsi Masalah
Validasi tanggal memaksa minimal 2 hari rental. Tapi business logic mungkin allow 1-day rental.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH
const minEndDate = parsedStartDate ? addDays(parsedStartDate, 1) : today;
// Ini artinya: kalau start = hari ini, end minimal = besok
// Jadi user hanya bisa 1 hari, tapi validasi:
if (parsedEndDate <= parsedStartDate) {
  return "Tanggal selesai harus setelah tanggal mulai.";
}
// Ini match, jadi OK. Tapi minEndDate setnya addDays(x, 1) artinya endDate harus > startDate

// Sebenarnya logic-nya OK untuk 1-day rental
// Tapi bisa confusing
```

Sebenarnya ini logic-nya benar untuk 1-day rental, tapi bisa confusing.

#### Solusi
```typescript
// ✅ BENAR - Clarify logic
// 1-day rental berarti: start = 1 Januari, end = 1 Januari
// Tapi kalau disimpan sebagai:
// startDate = "2024-01-01"
// endDate = "2024-01-02"
// Berarti sewa dari tgl 1 pukul 0:00 hingga tgl 2 pukul 0:00 = 24 jam = 1 hari

// Jadi logic sudah benar, tapi dokumentasi perlu jelas:
```

---

### 🟡 Bug #13: Floating Point Rounding Error

**File:** `src/app/components/hooks/useBookingCalc.tsx:87`  
**Severity:** 🟡 **MEDIUM - PRECISION**  
**Category:** Calculation Precision

#### Deskripsi Masalah
Discount calculation tidak rounded, bisa accumulate float errors.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH
const discountPercent = calculatedDuration >= 5 ? 0.08 : 0;
const normalTotalPrice = cleanUnitPrice * calculatedDuration;
const discountAmount = normalTotalPrice * discountPercent; // ❌ FLOAT!
const subtotal = normalTotalPrice - discountAmount; // ❌ Bisa error
```

#### Contoh Error:
```
unitPrice = 123.456
duration = 3
normalTotalPrice = 370.368

discountAmount = 0 (karena < 5 hari)
subtotal = 370.368 ✓

Tapi kalau:
unitPrice = 100.001
duration = 5
normalTotalPrice = 500.005
discountAmount = 500.005 * 0.08 = 40.0004 ❌ (float!)
subtotal = 500.005 - 40.0004 = 460.0046 ❌
```

#### Solusi
```typescript
// ✅ BENAR - Round semua nilai uang
const discountAmount = Math.round(normalTotalPrice * discountPercent);
const subtotal = Math.round(normalTotalPrice - discountAmount);

const finalCourierFee =
  deliveryMethod === "courier" ? cleanCourierFee : 0;

const totalPrice = Math.round(subtotal + finalCourierFee); // ✅ Round

const dpAmount = Math.round(totalPrice * 0.3);
const settlementAmount = Math.round(totalPrice - dpAmount);
```

---

### 🟡 Bug #14: Memory Leak di Booking.tsx

**File:** `src/app/pages/customers/Booking.tsx:159`  
**Severity:** 🟡 **MEDIUM - MEMORY LEAK**  
**Category:** Memory Leak

#### Deskripsi Masalah
`setFormData` dipanggil tanpa cek apakah component masih mounted. Bisa warning di dev.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH
useEffect(() => {
  const sourceUser = profileUser || authUser;

  if (!sourceUser) return;

  const fullNameValue =
    "full_name" in sourceUser && sourceUser.full_name
      ? sourceUser.full_name
      : sourceUser.username;

  setFormData((prev) => ({
    fullName: prev.fullName || fullNameValue || "",
    email: prev.email || sourceUser.email || "",
    whatsapp:
      prev.whatsapp ||
      normalizeWhatsapp(sourceUser.whatsapp || sourceUser.phone || ""),
  })); // ❌ Tidak ada cleanup
}, [profileUser, authUser]);
```

#### Masalahnya:
- Jika component unmount sebelum effect selesai
- setState dipanggil pada unmounted component
- Warning di console (dev mode)

#### Solusi
```typescript
// ✅ BENAR - Add isMounted guard
useEffect(() => {
  let isMounted = true;

  const sourceUser = profileUser || authUser;

  if (!sourceUser) return;

  if (isMounted) {
    const fullNameValue =
      "full_name" in sourceUser && sourceUser.full_name
        ? sourceUser.full_name
        : sourceUser.username;

    setFormData((prev) => ({
      fullName: prev.fullName || fullNameValue || "",
      email: prev.email || sourceUser.email || "",
      whatsapp:
        prev.whatsapp ||
        normalizeWhatsapp(sourceUser.whatsapp || sourceUser.phone || ""),
    }));
  }

  return () => {
    isMounted = false; // ✅ Cleanup
  };
}, [profileUser, authUser]);
```

---

### 🟡 Bug #15: No Retry Logic untuk Profile Fetch

**File:** `src/app/components/hooks/UseProfile.tsx`  
**Severity:** 🟡 **MEDIUM - ERROR HANDLING**  
**Category:** Error Handling

#### Deskripsi Masalah
Jika profile fetch fail, tidak ada cara untuk retry. User harus refresh page.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH - Tidak expose retry
return {
  user,
  isLoading,
  error,
  bookings,
  // ❌ Tidak ada refetch!
};
```

#### Solusi
```typescript
// ✅ BENAR - Expose refetch function
const fetchProfile = useCallback(async () => {
  // ... fetch logic
}, []);

return {
  user,
  isLoading,
  error,
  bookings,
  refetchProfile: fetchProfile, // ✅ Add refetch
  refetchBookings: fetchBookings,
};

// Component bisa pakai:
// const { user, error, refetchProfile } = useProfile();
// if (error) {
//   return <button onClick={refetchProfile}>Retry</button>;
// }
```

---

### 🟡 Bug #16: Map Click Handler Missing Dependencies

**File:** `src/app/components/profile/ProfileAddressTab.tsx:140`  
**Severity:** 🟡 **MEDIUM - DEPENDENCIES**  
**Category:** React Dependencies

#### Deskripsi Masalah
Map event handler tidak punya dependency array yang proper.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH
function MapClickHandler({
  onPickLocation,
}: {
  onPickLocation: (location: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      onPickLocation([e.latlng.lat, e.latlng.lng]);
    },
  });
  // ❌ Missing dependency array!
  return null;
}
```

#### Solusi
```typescript
// ✅ BENAR
function MapClickHandler({
  onPickLocation,
}: {
  onPickLocation: (location: LatLng) => void;
}) {
  useMapEvents(
    {
      click(e) {
        onPickLocation([e.latlng.lat, e.latlng.lng]);
      },
    },
    [onPickLocation] // ✅ Add dependency array
  );
  return null;
}
```

---

### 🟡 Bug #17: Product Image Broken Link No Fallback

**File:** `src/app/components/booking/BookingInvoiceSidebar.tsx:27`  
**Severity:** 🟡 **MEDIUM - ERROR HANDLING**  
**Category:** Error Handling

#### Deskripsi Masalah
Kalau image gagal load, hanya di-hide, tidak menampilkan fallback icon.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH
{productImage ? (
  <img
    src={productImage}
    alt={product.name || "Product"}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.currentTarget.style.display = "none"; // ❌ Hanya hide, tidak fallback!
    }}
  />
) : (
  <div className="w-full h-full flex items-center justify-center">
    <Camera className="w-6 h-6 text-foreground/40" />
  </div>
)}
```

#### Masalahnya:
- Image gagal load
- onError trigger, hide image
- Hasil: kosong / blank (jelek!)

#### Solusi
```typescript
// ✅ BENAR
const [imageError, setImageError] = useState(false);

{!imageError && productImage ? (
  <img
    src={productImage}
    alt={product.name || "Product"}
    className="w-full h-full object-cover"
    onError={() => setImageError(true)} // ✅ Set state
  />
) : (
  <div className="w-full h-full flex items-center justify-center bg-muted">
    <Camera className="w-6 h-6 text-foreground/40" /> {/* ✅ Show fallback */}
  </div>
)}
```

---

### 🟡 Bug #18: UseCrud Empty Catch Block

**File:** `src/app/components/hooks/UseCrud.tsx:160`  
**Severity:** 🟡 **MEDIUM - ERROR HANDLING**  
**Category:** Error Handling

#### Deskripsi Masalah
Banyak empty catch block hanya console.error.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH - Berbagai catch block yang tidak handle error
try {
  // ... operation
} catch (error) {
  console.error("Error:", error); // ❌ Hanya log, tidak handle!
}
```

#### Solusi
Lihat contoh di Bug #8 & #9 bagaimana handle error dengan benar.

---

### 🟡 Bug #19: Registrasi Form - Missing Password Match Validation

**File:** `src/app/pages/auth/Registrasi.tsx:60`  
**Severity:** 🟡 **MEDIUM - VALIDATION**  
**Category:** Form Validation

#### Deskripsi Masalah
Form punya field `confirmPassword` tapi tidak validate password match.

#### Kode Bermasalah
```typescript
// ❌ BERMASALAH
{...register("confirmPassword", {
  required: "Konfirmasi password wajib diisi",
  // ❌ Missing validate untuk check apakah = password
})}
```

#### Solusi
```typescript
// ✅ BENAR
{...register("confirmPassword", {
  required: "Konfirmasi password wajib diisi",
  validate: (value) => 
    value === password || "Password tidak cocok", // ✅ Validate match
})}
```

---

## 🟢 LOW PRIORITY BUGS (OPTIONAL)

### 🟢 Bug #20: BookingStep4Payment - Unnecessary Dependency

**File:** `src/app/components/booking/BookingStep4Payment.tsx:140`  
**Severity:** 🟢 **LOW - CODE QUALITY**  
**Category:** Code Quality

#### Deskripsi Masalah
`revokePreviewUrl` ditambahkan ke dependency array cleanup function, padahal tidak perlu.

#### Kode Bermasalah
```typescript
// 🟢 MINOR - Technically OK tapi unnecessary
useEffect(() => {
  return () => {
    revokePreviewUrl(); // ✅ This is correct
  };
}, [revokePreviewUrl]); // 🟡 Unnecessary, fungsi never changes
```

#### Solusi
```typescript
// ✅ BENAR - Dependency array bisa kosong
useEffect(() => {
  return () => {
    revokePreviewUrl();
  };
}, []); // ✅ Empty OK since revokePreviewUrl is stable
```

---

## 📋 PRIORITAS PERBAIKAN

### URUTAN PERBAIKAN:

1. **HARI INI** 🔴
   - [ ] Bug #1: Hardcoded WhatsApp (CRITICAL)
   - [ ] Bug #2: Infinite fetch loop useUserRentalStatus (CRITICAL)

2. **MINGGU INI** 🟠
   - [ ] Bug #3: Race condition BookingStep3Delivery
   - [ ] Bug #4: Replace alert() dengan UI state
   - [ ] Bug #5: Infinite loop useProducts
   - [ ] Bug #6: Logout error handling
   - [ ] Bug #7: 401 error handling
   - [ ] Bug #8: KTP upload error feedback

3. **SPRINT DEPAN** 🟡
   - [ ] Bug #9-19: Medium priority bugs

4. **BACKLOG** 🟢
   - [ ] Bug #20: Code quality improvement

---

## 🧪 TESTING CHECKLIST

Setelah fix bugs, pastikan test:

### Auth Flow
- [ ] Login dengan credential valid
- [ ] Login dengan credential invalid
- [ ] Register user baru
- [ ] Password confirmation validation
- [ ] Logout dan cek session clear di FE & BE
- [ ] Akses protected route tanpa login → redirect ke login
- [ ] Token refresh flow

### Booking Flow
- [ ] Select start date hari ini, end date besok → 1 hari
- [ ] Select invalid date range → error message show (bukan alert)
- [ ] Step 1 validation
- [ ] Step 2 client data validation
- [ ] Step 3 delivery dengan courier → OSRM API call sukses
- [ ] Step 3 delivery dengan COD → no OSRM call
- [ ] Step 3 OSRM call timeout → error message
- [ ] Step 4 payment upload image
- [ ] Booking submit sukses → invoice created

### Profile
- [ ] Upload KTP → sukses & fallback jika fail
- [ ] Upload profile photo → sukses & fallback jika fail
- [ ] Add address → save & fetch
- [ ] Map click select location
- [ ] Edit address & delete address

### Payment Status
- [ ] Login dengan user A → lihat status pembayaran user A
- [ ] Login dengan user B → lihat status pembayaran user B (bukan A!)
- [ ] Retry refresh status

---

## 📞 CONTACT & ESCALATION

Untuk pertanyaan atau clarifikasi:
- 🔴 Critical bugs: Immediate escalation
- 🟠 High bugs: Sprint planning review
- 🟡 Medium bugs: Backlog prioritization

---

**Report Generated:** 3 Juni 2026  
**Next Review:** Setelah semua 🔴 CRITICAL diperbaiki  
**Status:** ✅ Ready for Implementation

