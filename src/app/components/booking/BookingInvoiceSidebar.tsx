import { CreditCard, Camera } from "lucide-react";
import { ProductData, DeliveryMethod } from "./BookingTypes";

interface SidebarProps {
  product: ProductData;
  calculatedDuration: number;
  discountPercent: number;
  discountAmount: number;
  deliveryMethod: DeliveryMethod;
  courierFee: number;
  totalPrice: number;
  dpAmount: number;
  settlementAmount: number;
}

const PRODUCT_IMAGE_BASE =
  "http://localhost/db_readytoshot/config/assets/products/";

function formatPrice(price?: number | string | null) {
  return new Intl.NumberFormat("id-ID").format(Number(price || 0));
}

function getProductPrice(product: ProductData) {
  return Number(product.price_per_day || product.price || 0);
}

function getProductImage(product: ProductData) {
  const imageSource =
    product.image ||
    product.image_path ||
    "";

  if (!imageSource) {
    return null;
  }

  if (
    imageSource.startsWith("http://") ||
    imageSource.startsWith("https://")
  ) {
    return imageSource;
  }

  const fileName = imageSource.split("/").pop();

  return fileName ? `${PRODUCT_IMAGE_BASE}${fileName}` : null;
}

export function BookingInvoiceSidebar({
  product,
  calculatedDuration,
  discountPercent,
  discountAmount,
  deliveryMethod,
  courierFee,
  totalPrice,
  dpAmount,
  settlementAmount,
}: SidebarProps) {
  const productPrice = getProductPrice(product);
  const productImage = getProductImage(product);

  return (
    <aside className="lg:col-span-1 w-full">
      <div className="lg:sticky lg:top-24 border-[3px] border-foreground bg-card p-4 sm:p-5 space-y-4 shadow-[6px_6px_0_0_#000] rounded-none">
        {/* HEADER */}
        <h3 className="text-lg sm:text-xl font-black uppercase italic border-b-2 border-foreground/10 pb-3 tracking-tight font-mono text-secondary">
          GEAR INVOICE
        </h3>

        {/* PRODUCT INFO */}
        <div className="flex gap-4 items-center border-b-2 border-foreground/10 pb-4">
          <div className="w-16 h-16 border-2 border-foreground overflow-hidden flex-shrink-0 bg-muted rounded-none">
            {productImage ? (
              <img
                src={productImage}
                alt={product.name || "Product"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-foreground/40" />
              </div>
            )}
          </div>

          <div className="space-y-0.5 min-w-0">
            <span className="text-secondary text-[9px] font-black uppercase tracking-[0.2em] block truncate">
              {product.brand || "READYTOSHOT"}
            </span>

            <p className="font-black uppercase italic leading-tight text-base sm:text-lg truncate">
              {product.name || "UNKNOWN GEAR"}
            </p>

            {product.category && (
              <p className="text-[9px] font-black uppercase text-foreground/40 tracking-widest truncate">
                {product.category}
              </p>
            )}
          </div>
        </div>

        {/* PRICE DETAIL */}
        <div className="space-y-2.5 font-mono text-[10px] font-black uppercase tracking-[0.15em] border-b-2 border-foreground/10 pb-4">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Daily Rate</span>
            <span className="text-right">
              IDR {formatPrice(productPrice)}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Duration</span>
            <span className="text-secondary text-right">
              {calculatedDuration || 0} HARI
            </span>
          </div>

          {discountPercent > 0 && discountAmount > 0 && (
            <div className="flex justify-between gap-4 text-red-500">
              <span>Promo_Disc ({discountPercent}%)</span>
              <span className="text-right">
                -IDR {formatPrice(discountAmount)}
              </span>
            </div>
          )}

          {deliveryMethod === "courier" && courierFee > 0 && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Courier_Fee</span>
              <span className="text-right">
                IDR {formatPrice(courierFee)}
              </span>
            </div>
          )}

          <div className="flex justify-between gap-4 border-t border-dashed border-foreground/20 pt-2 text-xs">
            <span className="text-muted-foreground">Sub Total</span>
            <span className="text-right">
              IDR {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        {/* PAYMENT DETAIL */}
        <div className="space-y-2 font-mono text-[10px] font-black uppercase tracking-[0.15em]">
          <div className="flex justify-between gap-4 text-secondary">
            <span>Required_DP (30%)</span>
            <span className="text-sm sm:text-base font-black text-right">
              IDR {formatPrice(dpAmount)}
            </span>
          </div>

          <div className="flex justify-between gap-4 text-foreground/60">
            <span>Settlement Field</span>
            <span className="text-right">
              IDR {formatPrice(settlementAmount)}
            </span>
          </div>
        </div>

        {/* GRAND TOTAL */}
        <div className="pt-4 border-t-2 border-foreground flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
          <div className="leading-none">
            <span className="text-[9px] text-secondary block mb-1 italic">
              NET CHARGE
            </span>

            <span className="text-2xl font-black italic tracking-tighter">
              GRAND
            </span>
          </div>

          <span className="text-2xl font-black italic tracking-tighter text-secondary break-all sm:text-right">
            IDR {formatPrice(totalPrice)}
          </span>
        </div>

        {/* NOTICE */}
        <div className="bg-muted p-3 border-l-4 border-secondary text-[9px] font-bold uppercase leading-relaxed text-muted-foreground font-mono">
          <CreditCard className="w-4 h-4 mb-2 text-secondary" />
          SYSTEM_NOTICE: Bayar DP terlebih dahulu. Pelunasan dapat dicek dan
          diselesaikan melalui halaman Profile.
        </div>
      </div>
    </aside>
  );
}