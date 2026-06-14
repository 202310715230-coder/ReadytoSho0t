import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import {
  Plus,
  MapPin,
  Phone,
  Trash2,
  Pencil,
  Star,
  X,
  Save,
  Search,
  Loader2,
  MousePointerClick,
  Home,
} from "lucide-react";

import {
  AddressPayload,
  UserAddress,
  useAddresses,
} from "../hooks/UseAddresses";

interface ProfileAddressTabProps {
  username?: string;
  whatsapp?: string | null;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

type LatLng = [number, number];

const DEFAULT_CENTER: LatLng = [-6.2919132, 107.0253265];

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapRecenter({ center }: { center: LatLng }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);

  return null;
}

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

  return null;
}

const emptyForm: AddressPayload = {
  receiver_name: "",
  phone: "",
  province_city_district: "",
  street_address: "",
  detail_address: "",
  label: "Rumah",
  latitude: null,
  longitude: null,
  is_main: false,
};

export default function ProfileAddressTab({
  username = "",
  whatsapp = "",
}: ProfileAddressTabProps) {
  const {
    addresses,
    isLoadingAddresses,
    isSavingAddress,
    errorAddress,
    saveAddress,
    deleteAddress,
    setMainAddress,
  } = useAddresses();

  const [isOpen, setIsOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null
  );

  const [form, setForm] = useState<AddressPayload>({
    ...emptyForm,
    receiver_name: username || "",
    phone: whatsapp || "",
    is_main: false,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const selectedPosition = useMemo<LatLng>(() => {
    if (form.latitude && form.longitude) {
      return [Number(form.latitude), Number(form.longitude)];
    }

    return DEFAULT_CENTER;
  }, [form.latitude, form.longitude]);

  const openAddModal = () => {
    setEditingAddress(null);

    setForm({
      ...emptyForm,
      receiver_name: username || "",
      phone: whatsapp || "",
      is_main: addresses.length === 0,
    });

    setSearchQuery("");
    setSearchResults([]);
    setMapError(null);
    setIsOpen(true);
  };

  const openEditModal = (address: UserAddress) => {
    setEditingAddress(address);

    setForm({
      id: address.id,
      receiver_name: address.receiver_name || "",
      phone: address.phone || "",
      province_city_district: address.province_city_district || "",
      street_address: address.street_address || "",
      detail_address: address.detail_address || "",
      label: address.label || "Rumah",
      latitude: address.latitude !== null ? Number(address.latitude) : null,
      longitude: address.longitude !== null ? Number(address.longitude) : null,
      is_main: Boolean(address.is_main),
    });

    setSearchQuery(address.street_address || "");
    setSearchResults([]);
    setMapError(null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingAddress(null);
    setSearchQuery("");
    setSearchResults([]);
    setMapError(null);
  };

  const searchAddress = async () => {
    if (!searchQuery.trim()) {
      setMapError("Masukkan alamat terlebih dahulu.");
      return;
    }

    setIsSearching(true);
    setMapError(null);

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        format: "json",
        addressdetails: "1",
        limit: "5",
        countrycodes: "id",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = (await response.json()) as NominatimResult[];

      if (!Array.isArray(data) || data.length === 0) {
        setSearchResults([]);
        setMapError("Alamat tidak ditemukan. Coba tulis lebih lengkap.");
        return;
      }

      setSearchResults(data);
    } catch (error) {
      console.error("Search address error:", error);
      setMapError("Gagal mencari alamat.");
    } finally {
      setIsSearching(false);
    }
  };

  const reverseGeocode = async (location: LatLng) => {
    try {
      const [lat, lon] = location;

      const params = new URLSearchParams({
        lat: String(lat),
        lon: String(lon),
        format: "json",
        addressdetails: "1",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      return data?.display_name || `${lat}, ${lon}`;
    } catch (error) {
      console.error("Reverse geocode error:", error);
      return `${location[0]}, ${location[1]}`;
    }
  };

  const handleSelectSearchResult = (item: NominatimResult) => {
    const lat = Number(item.lat);
    const lon = Number(item.lon);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      setMapError("Koordinat alamat tidak valid.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lon,
      street_address: item.display_name,
      province_city_district:
        prev.province_city_district || item.display_name,
    }));

    setSearchQuery(item.display_name);
    setSearchResults([]);
    setMapError(null);
  };

  const handlePickLocationFromMap = async (location: LatLng) => {
    const [lat, lon] = location;

    setMapError(null);

    const address = await reverseGeocode(location);

    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lon,
      street_address: address,
      province_city_district: prev.province_city_district || address,
    }));

    setSearchQuery(address);
    setSearchResults([]);
  };

  const handleSave = async () => {
    if (!form.receiver_name.trim()) {
      alert("Nama penerima wajib diisi.");
      return;
    }

    if (!form.phone.trim()) {
      alert("Nomor telepon wajib diisi.");
      return;
    }

    if (!form.province_city_district.trim()) {
      alert("Provinsi/Kota/Kecamatan wajib diisi.");
      return;
    }

    if (!form.street_address.trim()) {
      alert("Alamat lengkap wajib diisi.");
      return;
    }

    if (form.latitude === null || form.longitude === null) {
      alert("Titik lokasi map wajib dipilih.");
      return;
    }

    const result = await saveAddress({
      ...form,
      id: editingAddress?.id || form.id,
    });

    if (result.status !== "success") {
      alert(result.message || "Gagal menyimpan alamat.");
      return;
    }

    alert(result.message || "Alamat berhasil disimpan.");
    closeModal();
  };

  const handleDelete = async (address: UserAddress) => {
    if (address.is_main) {
      alert("Alamat utama tidak bisa dihapus.");
      return;
    }

    const confirmDelete = window.confirm("Yakin ingin menghapus alamat ini?");

    if (!confirmDelete) return;

    const result = await deleteAddress(address.id);

    if (result.status !== "success") {
      alert(result.message || "Gagal menghapus alamat.");
      return;
    }

    alert(result.message || "Alamat berhasil dihapus.");
  };

  const handleSetMain = async (id: number) => {
    const result = await setMainAddress(id);

    if (result.status !== "success") {
      alert(result.message || "Gagal mengubah alamat utama.");
      return;
    }

    alert(result.message || "Alamat utama berhasil diubah.");
  };

  return (
    <div className="min-h-[680px] bg-white">
      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b border-[#E8DCCB] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B07A3A]">
            ReadyToShot Studio
          </p>

          <h1 className="mt-2 text-2xl font-black uppercase tracking-tight text-[#2D1E17]">
            Alamat Saya
          </h1>

          <p className="mt-1 text-xs font-bold uppercase text-[#7B6A5B]">
            Kelola alamat pengiriman kamera kamu
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2D1E17] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#463025]"
        >
          <Plus className="h-4 w-4" />
          Tambah Alamat
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-4 p-5 sm:p-6">
        {errorAddress && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-black uppercase text-red-700">
            {errorAddress}
          </div>
        )}

        {isLoadingAddresses ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#8A5A2B]" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#D8C7B3] bg-[#F8F3EA] p-10 text-center">
            <MapPin className="mx-auto mb-3 h-10 w-10 text-[#B07A3A]" />

            <p className="text-sm font-black uppercase text-[#2D1E17]">
              Belum ada alamat
            </p>

            <p className="mt-2 text-xs font-bold text-[#7B6A5B]">
              Tambahkan alamat agar pengiriman GoSend bisa dihitung otomatis.
            </p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`rounded-[24px] border bg-white p-5 shadow-sm transition ${
                address.is_main
                  ? "border-[#B07A3A] ring-2 ring-[#F5E7D3]"
                  : "border-[#E8DCCB]"
              }`}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F5E7D3]">
                      <Home className="h-5 w-5 text-[#8A5A2B]" />
                    </div>

                    <div>
                      <h2 className="font-black uppercase text-[#2D1E17]">
                        {address.receiver_name || "Nama belum diisi"}
                      </h2>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F8F3EA] px-3 py-1 text-[11px] font-bold text-[#7B6A5B]">
                          <Phone className="h-3.5 w-3.5" />
                          {address.phone || "-"}
                        </span>

                        <span className="rounded-full bg-[#FFF5E8] px-3 py-1 text-[11px] font-black uppercase text-[#B07A3A]">
                          {address.label || "Alamat"}
                        </span>

                        {address.is_main && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF3] px-3 py-1 text-[11px] font-black uppercase text-[#027A48]">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            Alamat Utama
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium leading-relaxed text-[#5B4636]">
                      {address.street_address}
                      {address.detail_address ? `, ${address.detail_address}` : ""}
                    </p>

                    <p className="text-xs font-black uppercase text-[#7B6A5B]">
                      {address.province_city_district}
                    </p>

                    {address.latitude && address.longitude && (
                      <p className="text-[11px] font-bold text-[#9A897A]">
                        Koordinat: {address.latitude}, {address.longitude}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 lg:w-auto lg:min-w-[220px] lg:items-end">
                  <div className="flex w-full gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => openEditModal(address)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#D7E3FF] bg-[#F4F7FF] px-4 py-2 text-xs font-black text-[#175CD3] transition hover:bg-[#EAF0FF] lg:flex-none"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Ubah
                    </button>

                    {!address.is_main && (
                      <button
                        type="button"
                        onClick={() => handleDelete(address)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#FAD1D1] bg-[#FFF5F5] px-4 py-2 text-xs font-black text-[#D92D20] transition hover:bg-[#FFE8E8] lg:flex-none"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                      </button>
                    )}
                  </div>

                  {!address.is_main && (
                    <button
                      type="button"
                      onClick={() => handleSetMain(address.id)}
                      className="inline-flex w-full items-center justify-center rounded-full border border-[#E8DCCB] bg-[#F8F3EA] px-4 py-2.5 text-xs font-black text-[#2D1E17] transition hover:border-[#B07A3A] hover:bg-[#F5E7D3] lg:w-auto"
                    >
                      Jadikan Alamat Utama
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[24px] border-4 border-[#2D1E17] bg-white shadow-[8px_8px_0_#2D1E17]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-4 border-[#2D1E17] bg-white p-5">
              <h2 className="text-2xl font-black uppercase text-[#2D1E17]">
                {editingAddress ? "Ubah Alamat" : "Tambah Alamat"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border-2 border-[#2D1E17] p-2 shadow-[2px_2px_0_#2D1E17]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Nama Penerima"
                  value={form.receiver_name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      receiver_name: e.target.value,
                    }))
                  }
                  className="rounded-2xl border border-[#E8DCCB] p-3 font-bold outline-none focus:border-[#B07A3A]"
                />

                <input
                  type="text"
                  placeholder="Nomor Telepon"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="rounded-2xl border border-[#E8DCCB] p-3 font-bold outline-none focus:border-[#B07A3A]"
                />
              </div>

              <input
                type="text"
                placeholder="Provinsi, Kota, Kecamatan, Kode Pos"
                value={form.province_city_district}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    province_city_district: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#E8DCCB] p-3 font-bold outline-none focus:border-[#B07A3A]"
              />

              <textarea
                placeholder="Nama Jalan, Gedung, No. Rumah"
                value={form.street_address}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    street_address: e.target.value,
                  }))
                }
                rows={3}
                className="w-full resize-none rounded-2xl border border-[#E8DCCB] p-3 font-bold outline-none focus:border-[#B07A3A]"
              />

              <input
                type="text"
                placeholder="Detail Lainnya, contoh: Blok / Unit / Patokan"
                value={form.detail_address || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    detail_address: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#E8DCCB] p-3 font-bold outline-none focus:border-[#B07A3A]"
              />

              <select
                value={form.label}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    label: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#E8DCCB] bg-white p-3 font-bold outline-none focus:border-[#B07A3A]"
              >
                <option value="Rumah">Rumah</option>
                <option value="Kantor">Kantor</option>
                <option value="Alamat Toko">Alamat Toko</option>
                <option value="Lainnya">Lainnya</option>
              </select>

              {/* MAP SEARCH */}
              <div className="space-y-3 rounded-[24px] border border-[#E8DCCB] bg-[#F8F3EA] p-4">
                <label className="flex items-center gap-2 text-xs font-black uppercase text-[#2D1E17]">
                  <MapPin className="h-4 w-4 text-[#B07A3A]" />
                  Titik Lokasi Map
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        searchAddress();
                      }
                    }}
                    placeholder="Cari lokasi alamat..."
                    className="w-full rounded-2xl border border-[#E8DCCB] bg-white p-3 font-bold outline-none focus:border-[#B07A3A]"
                  />

                  <button
                    type="button"
                    onClick={searchAddress}
                    disabled={isSearching}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E6A34A] px-5 py-3 text-xs font-black uppercase text-[#2D1E17] transition hover:bg-[#D89235] disabled:opacity-60"
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        Cari
                      </>
                    )}
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <div className="max-h-48 overflow-y-auto rounded-2xl border border-[#E8DCCB] bg-white">
                    {searchResults.map((item) => (
                      <button
                        key={item.place_id}
                        type="button"
                        onClick={() => handleSelectSearchResult(item)}
                        className="w-full border-b border-[#E8DCCB] p-3 text-left last:border-b-0 hover:bg-[#F2E7D5]"
                      >
                        <p className="text-xs font-black uppercase leading-relaxed text-[#2D1E17]">
                          {item.display_name}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 rounded-2xl border border-[#E8DCCB] bg-white p-3 text-[10px] font-black uppercase text-[#7B6A5B]">
                  <MousePointerClick className="h-4 w-4 text-[#B07A3A]" />
                  Klik langsung pada map untuk menentukan titik lebih akurat.
                </div>

                <div className="overflow-hidden rounded-[24px] border-2 border-[#2D1E17]">
                  <MapContainer
                    center={selectedPosition}
                    zoom={15}
                    scrollWheelZoom={true}
                    className="z-0 h-[320px] w-full"
                  >
                    <MapRecenter center={selectedPosition} />

                    <MapClickHandler
                      onPickLocation={handlePickLocationFromMap}
                    />

                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {form.latitude !== null && form.longitude !== null && (
                      <Marker
                        position={[
                          Number(form.latitude),
                          Number(form.longitude),
                        ]}
                        icon={markerIcon}
                      />
                    )}
                  </MapContainer>
                </div>

                {mapError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-black uppercase text-red-700">
                    {mapError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    readOnly
                    value={form.latitude ?? ""}
                    placeholder="Latitude"
                    className="rounded-2xl border border-[#E8DCCB] bg-white p-3 font-bold outline-none"
                  />

                  <input
                    type="text"
                    readOnly
                    value={form.longitude ?? ""}
                    placeholder="Longitude"
                    className="rounded-2xl border border-[#E8DCCB] bg-white p-3 font-bold outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-[#E8DCCB] bg-[#F8F3EA] p-3 font-bold text-[#2D1E17]">
                <input
                  type="checkbox"
                  checked={form.is_main}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      is_main: e.target.checked,
                    }))
                  }
                />
                Jadikan alamat utama
              </label>
            </div>

            <div className="sticky bottom-0 flex flex-col justify-end gap-3 border-t-4 border-[#2D1E17] bg-white p-5 sm:flex-row">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-2xl border border-[#E8DCCB] px-6 py-3 font-black uppercase text-[#2D1E17] transition hover:bg-[#F8F3EA]"
              >
                Nanti Saja
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSavingAddress}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2D1E17] px-6 py-3 font-black uppercase text-white transition hover:bg-[#463025] disabled:opacity-60"
              >
                {isSavingAddress ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}