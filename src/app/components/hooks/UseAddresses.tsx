import { useCallback, useEffect, useState } from "react";

const API_BASE = "http://localhost/db_readytoshot";

export interface UserAddress {
  id: number;
  user_id?: number;
  receiver_name: string;
  phone: string;
  province_city_district: string;
  street_address: string;
  detail_address?: string | null;
  label: string;
  latitude: number | null;
  longitude: number | null;
  is_main: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AddressPayload {
  id?: number;
  receiver_name: string;
  phone: string;
  province_city_district: string;
  street_address: string;
  detail_address?: string;
  label: string;
  latitude: number | null;
  longitude: number | null;
  is_main: boolean;
}

interface AddressResponse {
  status: "success" | "error";
  message?: string;
  data?: UserAddress[];
}

async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    console.error("Response bukan JSON:", text);
    return null;
  }
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [errorAddress, setErrorAddress] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    setIsLoadingAddresses(true);
    setErrorAddress(null);

    try {
      const response = await fetch(`${API_BASE}/address_crud.php`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await parseJson<AddressResponse>(response);

      if (!response.ok || !result || result.status !== "success") {
        throw new Error(result?.message || "Gagal mengambil alamat");
      }

      setAddresses(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Fetch addresses error:", error);
      setErrorAddress(
        error instanceof Error
          ? error.message
          : "Gagal mengambil alamat"
      );
      setAddresses([]);
    } finally {
      setIsLoadingAddresses(false);
    }
  }, []);

  const saveAddress = useCallback(
    async (payload: AddressPayload) => {
      setIsSavingAddress(true);
      setErrorAddress(null);

      try {
        const response = await fetch(`${API_BASE}/address_crud.php`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            action: "save",
            ...payload,
          }),
        });

        const result = await parseJson<AddressResponse>(response);

        if (!response.ok || !result || result.status !== "success") {
          throw new Error(result?.message || "Gagal menyimpan alamat");
        }

        await fetchAddresses();

        return {
          status: "success" as const,
          message: result.message || "Alamat berhasil disimpan",
        };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Gagal menyimpan alamat";

        setErrorAddress(message);

        return {
          status: "error" as const,
          message,
        };
      } finally {
        setIsSavingAddress(false);
      }
    },
    [fetchAddresses]
  );

  const deleteAddress = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(`${API_BASE}/address_crud.php`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            action: "delete",
            id,
          }),
        });

        const result = await parseJson<AddressResponse>(response);

        if (!response.ok || !result || result.status !== "success") {
          throw new Error(result?.message || "Gagal menghapus alamat");
        }

        await fetchAddresses();

        return {
          status: "success" as const,
          message: result.message || "Alamat berhasil dihapus",
        };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Gagal menghapus alamat";

        return {
          status: "error" as const,
          message,
        };
      }
    },
    [fetchAddresses]
  );

  const setMainAddress = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(`${API_BASE}/address_crud.php`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            action: "set_main",
            id,
          }),
        });

        const result = await parseJson<AddressResponse>(response);

        if (!response.ok || !result || result.status !== "success") {
          throw new Error(result?.message || "Gagal mengubah alamat utama");
        }

        await fetchAddresses();

        return {
          status: "success" as const,
          message: result.message || "Alamat utama berhasil diubah",
        };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Gagal mengubah alamat utama";

        return {
          status: "error" as const,
          message,
        };
      }
    },
    [fetchAddresses]
  );

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    isLoadingAddresses,
    isSavingAddress,
    errorAddress,
    fetchAddresses,
    saveAddress,
    deleteAddress,
    setMainAddress,
  };
}