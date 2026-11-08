"use client";

import { useState, useTransition } from "react";
import { updateAssetMasterAction } from "@/app/actions/foundation-actions";

interface AssetEditFormProps {
  asset: {
    id: string;
    code: string;
    name: string;
    locationNote: string | null;
    isActive: boolean;
  };
}

export function AssetEditForm({ asset }: AssetEditFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const res = await updateAssetMasterAction(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setMessage(res.message ?? "Berhasil disimpan.");
        setIsOpen(false);
      }
    });
  }

  return (
    <div className="mt-2">
      {message && (
        <div className="mb-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-2 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
          {error}
        </div>
      )}

      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition cursor-pointer"
        >
          Ubah Data Master Aset (Catat AuditLog)
        </button>
      ) : (
        <form
          action={handleSubmit}
          className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs"
        >
          <input type="hidden" name="assetId" value={asset.id} />
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Nama Aset ({asset.code})
            </label>
            <input
              type="text"
              name="name"
              defaultValue={asset.name}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Titik Lokasi / Keterangan
            </label>
            <input
              type="text"
              name="locationNote"
              defaultValue={asset.locationNote || ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Status Aset
            </label>
            <select
              name="isActive"
              defaultValue={asset.isActive ? "true" : "false"}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5"
            >
              <option value="true">Aktif</option>
              <option value="false">Nonaktif</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
            >
              {isPending ? "Menyimpan..." : "Simpan & Catat di Riwayat"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

