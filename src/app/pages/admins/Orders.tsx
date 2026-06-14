"use client";

import { useState } from "react";
import {
  Eye,
  DollarSign,
  Calendar,
  AlertCircle,
  RefreshCw,
  Loader2,
  Phone,
  Truck,
  CreditCard,
  X,
  ImageIcon,
  MapPin,
  CheckCircle,
  PlayCircle,
  Ban,
  PackageCheck,
} from "lucide-react";

import {
  useAdminRental,
  AdminTabType,
  RentalItem,
} from "../../components/hooks/UseAdminRental";

const BACKEND_BASE_URL = "http://localhost/db_readytoshot";

function formatPrice(value?: number | string | null) {
  const numberValue = Number(value || 0);

  if (Number.isNaN(numberValue) || !Number.isFinite(numberValue)) {
    return "0";
  }

  return new Intl.NumberFormat("id-ID").format(numberValue);
}

function formatDate(date?: string | null) {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function buildBackendUrl(path?: string | null) {
  if (!path) return "";

  const cleanPath = String(path).trim();

  if (!cleanPath) return "";

  if (
    cleanPath.startsWith("http://") ||
    cleanPath.startsWith("https://")
  ) {
    return cleanPath;
  }

  return `${BACKEND_BASE_URL}/${cleanPath.replace(/^\/+/, "")}`;
}

function getPaymentProofUrl(order: RentalItem) {
  const paymentProofUrl =
    (order as RentalItem & { payment_proof_url?: string | null })
      .payment_proof_url || "";

  const paymentProof =
    (order as RentalItem & { payment_proof?: string | null }).payment_proof ||
    "";

  if (paymentProofUrl) {
    return buildBackendUrl(paymentProofUrl);
  }

  if (paymentProof) {
    return buildBackendUrl(paymentProof);
  }

  return "";
}

function getStatusClass(status?: string | null) {
  const value = status?.toLowerCase().trim() || "";

  if (
    value === "menunggu pembayaran" ||
    value === "pending" ||
    value === "menunggu verifikasi"
  ) {
    return "bg-amber-300 text-black";
  }

  if (
    value === "sedang disewa" ||
    value === "confirmed" ||
    value === "dikonfirmasi" ||
    value === "picked_up"
  ) {
    return "bg-blue-300 text-black";
  }

  if (value === "selesai" || value === "completed") {
    return "bg-green-300 text-black";
  }

  if (value === "dibatalkan" || value === "cancelled") {
    return "bg-red-400 text-white";
  }

  return "bg-gray-200 text-black";
}

function getOrderInfo(order: RentalItem) {
  const totalPrice = Number(order.total_price || 0);
  const dpAmount = Number(order.dp_amount || 0);
  const settlementAmount = Number(order.settlement_amount || 0);

  const finalDpAmount = dpAmount > 0 ? dpAmount : Math.round(totalPrice * 0.3);

  const finalSettlementAmount =
    settlementAmount > 0 ? settlementAmount : totalPrice - finalDpAmount;

  return {
    renterName: order.full_name || order.renter_name || "UNKNOWN_RENTER",
    renterWhatsapp: order.whatsapp || order.renter_whatsapp || "-",
    renterEmail: order.email || order.renter_email || "-",
    productName:
      order.product_name || order.camera_name || `Gear ID: ${order.product_id}`,
    productBrand: order.product_brand || order.camera_brand || "",
    totalPrice,
    dpAmount: finalDpAmount,
    settlementAmount: finalSettlementAmount,
    deliveryMethod: order.delivery_method || "-",
    deliveryDetails: order.delivery_details || "-",
    deliveryDistanceKm: Number(order.delivery_distance_km || 0),
    courierFee: Number(order.courier_fee || 0),
    paymentProofUrl: getPaymentProofUrl(order),
  };
}

function getNextActions(status?: string | null) {
  const value = status?.toLowerCase().trim() || "";

  if (
    value === "pending" ||
    value === "menunggu pembayaran" ||
    value === "menunggu verifikasi"
  ) {
    return [
      {
        label: "Verifikasi",
        status: "Dikonfirmasi",
        icon: CheckCircle,
        className: "bg-blue-600 text-white hover:bg-blue-700",
      },
      {
        label: "Batalkan",
        status: "Dibatalkan",
        icon: Ban,
        className: "bg-red-600 text-white hover:bg-red-700",
      },
    ];
  }

  if (value === "dikonfirmasi" || value === "confirmed") {
    return [
      {
        label: "Mulai Sewa",
        status: "Sedang Disewa",
        icon: PlayCircle,
        className: "bg-[#80243C] text-white hover:bg-[#96324f]",
      },
      {
        label: "Batalkan",
        status: "Dibatalkan",
        icon: Ban,
        className: "bg-red-600 text-white hover:bg-red-700",
      },
    ];
  }

  if (value === "sedang disewa" || value === "picked_up") {
    return [
      {
        label: "Selesaikan",
        status: "Selesai",
        icon: PackageCheck,
        className: "bg-green-600 text-white hover:bg-green-700",
      },
    ];
  }

  return [];
}

export default function AdminOrders() {
  const {
    activeTab,
    setActiveTab,
    rentals = [],
    stats,
    loading,
    updatingStatus,
    error,
    refreshData,
    updateRentalStatus,
  } = useAdminRental();

  const [selectedOrder, setSelectedOrder] = useState<RentalItem | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const tabOptions: AdminTabType[] = [
    "Semua",
    "Menunggu Pembayaran",
    "Sedang Disewa",
    "Selesai",
    "Dibatalkan",
  ];

  const menungguPembayaran = Number(stats?.menungguPembayaran || 0);
  const totalPendapatan = Number(stats?.totalPendapatan || 0);
  const totalDpMasuk = Number(stats?.totalDpMasuk || 0);

  const handleUpdateStatus = async (
    order: RentalItem,
    nextStatus: string
  ) => {
    const yakin = window.confirm(
      `Ubah status order #${order.id} menjadi "${nextStatus}"?`
    );

    if (!yakin) return;

    setUpdatingId(order.id);

    const result = await updateRentalStatus(order.id, nextStatus);

    setUpdatingId(null);

    if (result.status !== "success") {
      alert(result.message || "Gagal mengubah status rental");
      return;
    }

    alert(result.message || "Status rental berhasil diperbarui");

    if (selectedOrder?.id === order.id) {
      setSelectedOrder(null);
    }
  };

  if (loading && rentals.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center font-mono text-xs font-black uppercase text-secondary animate-pulse sm:text-sm">
        <Loader2 className="h-8 w-8 animate-spin" />
        <div>RETRIEVING_MYSQL_TRANSACTIONS...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-4 border-red-600 bg-red-100 p-4 shadow-[4px_4px_0_0_#000] sm:p-6">
        <div className="mb-2 flex items-center gap-3">
          <AlertCircle className="h-6 w-6 shrink-0 text-red-700" />
          <h2 className="font-black uppercase text-red-700">
            Gagal Memuat Data
          </h2>
        </div>

        <p className="break-words font-mono text-sm text-red-900">{error}</p>

        <button
          type="button"
          onClick={refreshData}
          className="mt-4 border-2 border-foreground bg-white px-4 py-2 text-xs font-black uppercase shadow-[2px_2px_0_0_#000] hover:bg-muted"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-8 animate-fadeIn text-foreground">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
            Pesanan Sewa
          </h1>

          <p className="mt-1 text-xs font-bold text-foreground/60 uppercase sm:text-sm">
            Data transaksi real-time dari tabel rentals.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshData}
          disabled={loading || updatingStatus}
          className="flex w-full items-center justify-center gap-2 border-2 border-foreground bg-white px-4 py-3 font-mono text-[10px] font-black uppercase shadow-[2px_2px_0_0_#000] transition-all hover:bg-muted active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-3 sm:py-1.5"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />
          REFRESH_DATA
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <div className="flex items-center justify-between gap-4 border-4 border-foreground bg-amber-100 p-4 shadow-[4px_4px_0_0_rgba(61,35,35,1)] sm:p-5">
          <div className="min-w-0">
            <h3 className="text-xs font-black uppercase text-foreground/60">
              Butuh Tindakan
            </h3>
            <p className="break-words font-mono text-xl font-black sm:text-2xl">
              {menungguPembayaran} Menunggu
            </p>
          </div>

          <AlertCircle className="h-8 w-8 shrink-0 text-amber-600" />
        </div>

        <div className="flex items-center justify-between gap-4 border-4 border-foreground bg-blue-100 p-4 shadow-[4px_4px_0_0_rgba(61,35,35,1)] sm:p-5">
          <div className="min-w-0">
            <h3 className="text-xs font-black uppercase text-foreground/60">
              DP Masuk
            </h3>
            <p className="break-words font-mono text-xl font-black sm:text-2xl">
              Rp {formatPrice(totalDpMasuk)}
            </p>
          </div>

          <CreditCard className="h-8 w-8 shrink-0 text-blue-600" />
        </div>

        <div className="flex items-center justify-between gap-4 border-4 border-foreground bg-green-100 p-4 shadow-[4px_4px_0_0_rgba(61,35,35,1)] sm:p-5">
          <div className="min-w-0">
            <h3 className="text-xs font-black uppercase text-foreground/60">
              Estimasi Pendapatan
            </h3>
            <p className="break-words font-mono text-xl font-black sm:text-2xl">
              Rp {formatPrice(totalPendapatan)}
            </p>
          </div>

          <DollarSign className="h-8 w-8 shrink-0 text-green-600" />
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto border-b-4 border-foreground pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
        {tabOptions.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setActiveTab(status)}
            className={`shrink-0 border-2 border-foreground px-4 py-2 text-xs font-black uppercase shadow-[2px_2px_0_0_#000] transition-all ${
              activeTab === status
                ? "bg-[#80243C] text-white"
                : "bg-white text-foreground hover:bg-muted"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:hidden">
        {rentals.length === 0 ? (
          <div className="border-4 border-foreground bg-white p-6 text-center text-xs font-black uppercase italic text-foreground/50 shadow-[4px_4px_0_0_#000]">
            Tidak ada transaksi dengan status ini.
          </div>
        ) : (
          rentals.map((order: RentalItem) => {
            const info = getOrderInfo(order);
            const actions = getNextActions(order.status);
            const isUpdatingThis = updatingId === order.id;

            return (
              <article
                key={order.id}
                className="border-4 border-foreground bg-white p-4 shadow-[4px_4px_0_0_rgba(61,35,35,1)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-black text-[#80243C]">
                      #{order.id}
                    </p>

                    <h2 className="break-words text-lg font-black uppercase leading-tight">
                      {info.renterName}
                    </h2>

                    <p className="mt-1 break-words text-xs font-black uppercase text-foreground/70">
                      {info.productBrand} {info.productName}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 border-2 border-foreground px-2 py-1 text-[10px] font-black uppercase ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status || "-"}
                  </span>
                </div>

                <div className="mt-4 space-y-2 font-mono text-xs font-bold">
                  <div className="flex items-center gap-2 text-green-600">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span className="break-all font-black">
                      {info.renterWhatsapp}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-foreground/60" />
                    <div>
                      <p>
                        {formatDate(order.start_date)} s/d{" "}
                        {formatDate(order.end_date)}
                      </p>
                      <p className="mt-0.5 text-[10px] font-black text-[#80243C]">
                        ({order.duration || 0} HARI)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="border-2 border-foreground/30 p-2">
                      <p className="text-[10px] uppercase text-foreground/50">
                        DP
                      </p>
                      <p className="font-black">
                        Rp {formatPrice(info.dpAmount)}
                      </p>
                    </div>

                    <div className="border-2 border-foreground/30 p-2">
                      <p className="text-[10px] uppercase text-foreground/50">
                        Sisa
                      </p>
                      <p className="font-black">
                        Rp {formatPrice(info.settlementAmount)}
                      </p>
                    </div>
                  </div>

                  <p className="pt-2 text-base font-black">
                    Total: Rp {formatPrice(info.totalPrice)}
                  </p>

                  {info.paymentProofUrl ? (
                    <a
                      href={info.paymentProofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 border-2 border-foreground bg-green-100 p-2 text-[10px] font-black uppercase shadow-[2px_2px_0_0_#000]"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Bukti DP Tersedia
                    </a>
                  ) : (
                    <div className="border-2 border-red-400 bg-red-50 p-2 text-center text-[10px] font-black uppercase text-red-600">
                      Bukti DP Kosong
                    </div>
                  )}
                </div>

                <div className="mt-4 grid gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="flex w-full items-center justify-center gap-2 border-2 border-foreground bg-white p-3 text-xs font-black uppercase shadow-[2px_2px_0_0_#000] transition-all hover:bg-muted active:shadow-none"
                  >
                    <Eye className="h-4 w-4" />
                    Lihat Detail
                  </button>

                  {actions.length > 0 && (
                    <div className="grid grid-cols-1 gap-2">
                      {actions.map((action) => {
                        const Icon = action.icon;

                        return (
                          <button
                            key={`${order.id}-${action.status}`}
                            type="button"
                            disabled={updatingStatus}
                            onClick={() =>
                              handleUpdateStatus(order, action.status)
                            }
                            className={`flex w-full items-center justify-center gap-2 border-2 border-foreground p-3 text-xs font-black uppercase shadow-[2px_2px_0_0_#000] transition-all active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 ${action.className}`}
                          >
                            {isUpdatingThis ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Icon className="h-4 w-4" />
                            )}
                            {action.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      <div className="hidden border-4 border-foreground bg-white shadow-[6px_6px_0_0_rgba(61,35,35,1)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] border-collapse text-left">
            <thead>
              <tr className="border-b-4 border-foreground bg-secondary/20 text-xs font-black uppercase">
                <th className="border-r-2 border-foreground p-4">ID Order</th>
                <th className="border-r-2 border-foreground p-4">
                  Penyewa & Alat
                </th>
                <th className="border-r-2 border-foreground p-4">Durasi</th>
                <th className="border-r-2 border-foreground p-4">Pembayaran</th>
                <th className="border-r-2 border-foreground p-4">Delivery</th>
                <th className="border-r-2 border-foreground p-4 text-center">
                  Status
                </th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="font-mono text-sm font-bold">
              {rentals.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center font-black uppercase italic text-foreground/50"
                  >
                    Tidak ada transaksi dengan status ini.
                  </td>
                </tr>
              ) : (
                rentals.map((order: RentalItem) => {
                  const info = getOrderInfo(order);
                  const actions = getNextActions(order.status);
                  const isUpdatingThis = updatingId === order.id;

                  return (
                    <tr
                      key={order.id}
                      className="border-b-2 border-foreground last:border-0 hover:bg-secondary/5"
                    >
                      <td className="border-r-2 border-foreground p-4 font-black text-[#80243C]">
                        #{order.id}
                      </td>

                      <td className="border-r-2 border-foreground p-4">
                        <div className="font-black uppercase">
                          {info.renterName}
                        </div>
                        <div className="text-xs uppercase text-foreground/70">
                          {info.productBrand} {info.productName}
                        </div>
                        <div className="mt-0.5 text-[10px] font-black text-green-600">
                          {info.renterWhatsapp}
                        </div>
                      </td>

                      <td className="border-r-2 border-foreground p-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-foreground/60" />
                          {formatDate(order.start_date)}
                        </div>
                        <div className="pl-4 text-foreground/50">
                          s/d {formatDate(order.end_date)}
                        </div>
                        <div className="mt-0.5 pl-4 text-[10px] font-black text-[#80243C]">
                          ({order.duration || 0} HARI)
                        </div>
                      </td>

                      <td className="border-r-2 border-foreground p-4 text-xs">
                        <div className="font-black">
                          Total: Rp {formatPrice(info.totalPrice)}
                        </div>
                        <div className="mt-1 text-blue-700">
                          DP: Rp {formatPrice(info.dpAmount)}
                        </div>
                        <div className="text-amber-700">
                          Sisa: Rp {formatPrice(info.settlementAmount)}
                        </div>

                        {info.paymentProofUrl ? (
                          <a
                            href={info.paymentProofUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1 border border-foreground bg-green-100 px-2 py-1 text-[10px] font-black uppercase text-green-700"
                          >
                            <ImageIcon className="h-3 w-3" />
                            Bukti DP
                          </a>
                        ) : (
                          <div className="mt-2 text-[10px] font-black uppercase text-red-500">
                            Bukti DP kosong
                          </div>
                        )}
                      </td>

                      <td className="border-r-2 border-foreground p-4 text-xs">
                        <div className="flex items-center gap-1 font-black uppercase">
                          <Truck className="h-3.5 w-3.5" />
                          {info.deliveryMethod}
                        </div>

                        {info.deliveryMethod === "courier" && (
                          <>
                            <div className="mt-1 text-foreground/60">
                              {info.deliveryDistanceKm} KM
                            </div>
                            <div className="text-foreground/60">
                              Ongkir: Rp {formatPrice(info.courierFee)}
                            </div>
                          </>
                        )}
                      </td>

                      <td className="border-r-2 border-foreground p-4 text-center">
                        <span
                          className={`block border-2 border-foreground px-2 py-1 text-xs font-black uppercase ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status || "-"}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="w-full border-2 border-foreground bg-white px-3 py-2 text-xs font-black uppercase shadow-[2px_2px_0_0_#000] transition-all hover:bg-muted active:shadow-none"
                          >
                            <Eye className="mx-auto h-4 w-4" />
                          </button>

                          {actions.map((action) => {
                            const Icon = action.icon;

                            return (
                              <button
                                key={`${order.id}-${action.status}`}
                                type="button"
                                disabled={updatingStatus}
                                onClick={() =>
                                  handleUpdateStatus(order, action.status)
                                }
                                className={`flex w-full items-center justify-center gap-1 border-2 border-foreground px-3 py-2 text-[10px] font-black uppercase shadow-[2px_2px_0_0_#000] transition-all active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 ${action.className}`}
                              >
                                {isUpdatingThis ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Icon className="h-3.5 w-3.5" />
                                )}
                                {action.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          updatingStatus={updatingStatus}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}

function OrderDetailModal({
  order,
  updatingStatus,
  onClose,
  onUpdateStatus,
}: {
  order: RentalItem;
  updatingStatus: boolean;
  onClose: () => void;
  onUpdateStatus: (order: RentalItem, status: string) => void;
}) {
  const info = getOrderInfo(order);
  const actions = getNextActions(order.status);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border-4 border-foreground bg-white shadow-[8px_8px_0_0_#000]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b-4 border-foreground bg-white p-4">
          <div>
            <p className="font-mono text-xs font-black text-[#80243C]">
              ORDER #{order.id}
            </p>
            <h2 className="text-xl font-black uppercase">Detail Pesanan</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border-2 border-foreground bg-white p-2 shadow-[2px_2px_0_0_#000] hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-2">
          <div className="border-2 border-foreground p-4">
            <h3 className="mb-3 flex items-center gap-2 font-black uppercase">
              <Phone className="h-4 w-4" />
              Data Penyewa
            </h3>

            <div className="space-y-2 text-sm font-bold">
              <p>Nama: {info.renterName}</p>
              <p>WhatsApp: {info.renterWhatsapp}</p>
              <p>Email: {info.renterEmail}</p>
              <p>Status: {order.status || "-"}</p>
            </div>
          </div>

          <div className="border-2 border-foreground p-4">
            <h3 className="mb-3 flex items-center gap-2 font-black uppercase">
              <Calendar className="h-4 w-4" />
              Detail Rental
            </h3>

            <div className="space-y-2 text-sm font-bold">
              <p>
                Produk: {info.productBrand} {info.productName}
              </p>
              <p>Mulai: {formatDate(order.start_date)}</p>
              <p>Selesai: {formatDate(order.end_date)}</p>
              <p>Durasi: {order.duration || 0} hari</p>
            </div>
          </div>

          <div className="border-2 border-foreground p-4">
            <h3 className="mb-3 flex items-center gap-2 font-black uppercase">
              <CreditCard className="h-4 w-4" />
              Pembayaran
            </h3>

            <div className="space-y-2 text-sm font-bold">
              <p>Total: Rp {formatPrice(info.totalPrice)}</p>
              <p>DP: Rp {formatPrice(info.dpAmount)}</p>
              <p>Sisa Pelunasan: Rp {formatPrice(info.settlementAmount)}</p>
            </div>
          </div>

          <div className="border-2 border-foreground p-4">
            <h3 className="mb-3 flex items-center gap-2 font-black uppercase">
              <Truck className="h-4 w-4" />
              Pengiriman
            </h3>

            <div className="space-y-2 text-sm font-bold">
              <p>Metode: {info.deliveryMethod}</p>
              <p>Alamat: {info.deliveryDetails}</p>
              <p>Jarak: {info.deliveryDistanceKm} KM</p>
              <p>Ongkir: Rp {formatPrice(info.courierFee)}</p>
            </div>
          </div>

          <div className="border-2 border-foreground p-4 md:col-span-2">
            <h3 className="mb-3 flex items-center gap-2 font-black uppercase">
              <ImageIcon className="h-4 w-4" />
              Bukti Pembayaran DP
            </h3>

            {info.paymentProofUrl ? (
              <div className="space-y-3">
                <img
                  src={info.paymentProofUrl}
                  alt="Bukti pembayaran DP"
                  className="max-h-[420px] w-full object-contain border-2 border-foreground bg-muted"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                <a
                  href={info.paymentProofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-foreground bg-white px-4 py-2 text-xs font-black uppercase shadow-[2px_2px_0_0_#000] hover:bg-muted"
                >
                  <Eye className="h-4 w-4" />
                  Buka Gambar
                </a>

                <p className="break-all text-[10px] font-black text-foreground/50">
                  {info.paymentProofUrl}
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-foreground/30 p-6 text-center text-xs font-black uppercase text-foreground/50">
                Bukti pembayaran DP belum tersedia.
              </div>
            )}
          </div>

          <div className="border-2 border-foreground p-4 md:col-span-2">
            <h3 className="mb-3 flex items-center gap-2 font-black uppercase">
              <MapPin className="h-4 w-4" />
              Catatan Alamat
            </h3>

            <p className="text-sm font-bold leading-relaxed">
              {info.deliveryDetails || "-"}
            </p>
          </div>

          {actions.length > 0 && (
            <div className="border-2 border-foreground p-4 md:col-span-2">
              <h3 className="mb-3 font-black uppercase">Aksi Admin</h3>

              <div className="flex flex-col gap-2 sm:flex-row">
                {actions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={`modal-${order.id}-${action.status}`}
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => onUpdateStatus(order, action.status)}
                      className={`flex items-center justify-center gap-2 border-2 border-foreground px-4 py-3 text-xs font-black uppercase shadow-[2px_2px_0_0_#000] transition-all active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 ${action.className}`}
                    >
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}