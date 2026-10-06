"use client";

import { useState } from "react";
import Image from "next/image";
import { apiError } from "@/store/apiError";
import {
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetBannersQuery,
  useUpdateBannerMutation,
  useUploadBannerImageMutation,
  type Banner,
} from "@/store/adminApi";

const emptyForm = { image: "", mobileImage: "", alt: "", href: "", active: true };

export function BannersManager() {
  const { data: banners = [], isLoading, error } = useGetBannersQuery();
  const [createBanner, { isLoading: creating }] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();
  const [uploadBannerImage, { isLoading: uploading }] = useUploadBannerImageMutation();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  function startCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setOpen(true);
  }

  function startEdit(banner: Banner) {
    setEditing(banner);
    setForm({
      image: banner.image,
      mobileImage: banner.mobileImage,
      alt: banner.alt,
      href: banner.href,
      active: banner.active,
    });
    setFormError("");
    setOpen(true);
  }

  async function upload(file: File | undefined, field: "image" | "mobileImage") {
    if (!file) return;
    setFormError("");
    const body = new FormData();
    body.append("file", file);
    try {
      const data = await uploadBannerImage(body).unwrap();
      setForm((current) => ({ ...current, [field]: data.url }));
    } catch (err) {
      setFormError(apiError(err, "Could not upload the image."));
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    try {
      if (editing) {
        await updateBanner({ id: editing.id, body: form }).unwrap();
      } else {
        await createBanner(form).unwrap();
      }
      setOpen(false);
    } catch (err) {
      setFormError(apiError(err, "Could not save the banner."));
    }
  }

  async function move(banner: Banner, direction: -1 | 1) {
    const ordered = [...banners].sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
    const index = ordered.findIndex((item) => item.id === banner.id);
    const neighbor = ordered[index + direction];
    if (!neighbor) return;
    await updateBanner({ id: banner.id, body: { sortOrder: neighbor.sortOrder } });
    await updateBanner({ id: neighbor.id, body: { sortOrder: banner.sortOrder } });
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Banners</h1>
          <p className="mt-1 text-sm text-gray-500">These pictures slide across the homepage hero. The first one shows first.</p>
        </div>
        <button type="button" onClick={startCreate} className="px-4 py-2.5 rounded-lg bg-[#4a142a] text-white text-sm font-semibold hover:bg-[#350e1e]">
          Add banner
        </button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">Could not load banners.</p> : null}

      <div className="space-y-3">
        {isLoading ? <p className="text-sm text-gray-500">Loading banners…</p> : null}
        {!isLoading && banners.length === 0 ? (
          <p className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500">No banners yet. The homepage keeps the current picture until you add one.</p>
        ) : null}
        {banners.map((banner, index) => (
          <article key={banner.id} className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex gap-4">
              <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-56">
                <Image src={banner.image} alt="" fill className="object-cover" sizes="224px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{banner.alt || "Empulse banner"}</p>
                <p className="mt-1 truncate text-xs text-gray-500">{banner.href || "No link"}</p>
                <p className="mt-1 text-xs text-gray-400">{banner.active ? "Showing on the site" : "Hidden"}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => move(banner, -1)} disabled={index === 0} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium disabled:opacity-40">
                Up
              </button>
              <button type="button" onClick={() => move(banner, 1)} disabled={index === banners.length - 1} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium disabled:opacity-40">
                Down
              </button>
              <button
                type="button"
                onClick={() => updateBanner({ id: banner.id, body: { active: !banner.active } })}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium"
              >
                {banner.active ? "Hide" : "Show"}
              </button>
              <button type="button" onClick={() => startEdit(banner)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium">
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete this banner?")) deleteBanner(banner.id);
                }}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={save} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">{editing ? "Edit banner" : "Add banner"}</h2>
            <p className="mt-1 text-sm text-gray-500">Wide pictures work best. A phone picture is optional.</p>

            <ImageField label="Desktop banner" url={form.image} uploading={uploading} onFile={(file) => upload(file, "image")} />
            <ImageField label="Phone banner (optional)" url={form.mobileImage} uploading={uploading} onFile={(file) => upload(file, "mobileImage")} />

            <label className="mt-4 block text-sm font-medium text-gray-700">
              Description
              <input
                value={form.alt}
                onChange={(event) => setForm({ ...form, alt: event.target.value })}
                placeholder="Empulse new arrivals"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="mt-4 block text-sm font-medium text-gray-700">
              Link (optional)
              <input
                value={form.href}
                onChange={(event) => setForm({ ...form, href: event.target.value })}
                placeholder="/shoes or https://..."
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} />
              Show on the homepage
            </label>
            {formError ? <p className="mt-3 text-sm text-red-700">{formError}</p> : null}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium">
                Cancel
              </button>
              <button type="submit" disabled={creating || uploading || !form.image} className="rounded-lg bg-[#4a142a] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                {creating ? "Saving…" : "Save banner"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function ImageField({
  label,
  url,
  uploading,
  onFile,
}: {
  label: string;
  url: string;
  uploading: boolean;
  onFile: (file: File | undefined) => void;
}) {
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      {url ? (
        <div className="relative mt-2 h-28 overflow-hidden rounded-xl bg-gray-100">
          <Image src={url} alt="" fill className="object-cover" sizes="480px" />
        </div>
      ) : null}
      <label className="mt-2 inline-flex cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700">
        {uploading ? "Uploading…" : url ? "Replace image" : "Upload image"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            onFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
