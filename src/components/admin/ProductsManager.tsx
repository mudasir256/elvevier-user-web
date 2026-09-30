"use client";

import { useEffect, useMemo, useState } from "react";
import { productCategories } from "@/data/productCategories";
import type { ColorGallery, Product } from "@/types";
import { totalStock } from "@/lib/variants";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetAdminProductsQuery,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
  type ProductPayload,
} from "@/store/adminApi";
import { apiError } from "@/store/apiError";

type DraftVariant = { size: string; color: string; stock: string };

type Draft = {
  name: string;
  price: string;
  compareAtPrice: string;
  categoryId: string;
  subcategory: string;
  color: string;
  variants: DraftVariant[];
  colorImages: ColorGallery[];
  description: string;
  image: string;
  images: string[];
  featured: boolean;
  new: boolean;
  active: boolean;
};

const waistSizes = ["28", "30", "32", "34", "36", "38", "40", "42"];
const shoeSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

function sizeGuide(categoryId: string) {
  if (categoryId === "shoes") {
    return {
      label: "Shoe size",
      sizes: shoeSizes,
      hint: "Shoes use 40, 41, 42 and so on. Tap a size or type another number.",
    };
  }
  if (categoryId === "women" || categoryId === "men" || categoryId === "kids" || categoryId === "belts") {
    return {
      label: "Waist",
      sizes: waistSizes,
      hint: "Dresses, jackets and other clothes use waist sizes such as 30, 32, 34. Tap a size or type another one.",
    };
  }
  return {
    label: "Size",
    sizes: [] as string[],
    hint: "Type the size you want to add.",
  };
}

const emptyDraft: Draft = {
  name: "",
  price: "",
  compareAtPrice: "",
  categoryId: "women",
  subcategory: "",
  color: "",
  variants: [],
  colorImages: [],
  description: "",
  image: "",
  images: [],
  featured: false,
  new: true,
  active: true,
};

export function ProductsManager() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [formError, setFormError] = useState("");
  const [customSize, setCustomSize] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [palette, setPalette] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading: loading, error: loadError } = useGetAdminProductsQuery({
    category,
    search: debouncedSearch,
  });
  const products = data ?? [];
  const error = loadError ? apiError(loadError, "Could not load products.") : "";
  const [createProduct, { isLoading: creatingProduct }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updatingProduct }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [uploadImagesRequest, { isLoading: uploading }] = useUploadProductImagesMutation();
  const [uploadingColor, setUploadingColor] = useState("");
  const saving = creatingProduct || updatingProduct;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const subcategoryOptions = useMemo(
    () => productCategories.find((item) => item.id === draft.categoryId)?.subcategories ?? [],
    [draft.categoryId]
  );
  const sizes = useMemo(() => sizeGuide(draft.categoryId), [draft.categoryId]);

  function sameOption(variant: DraftVariant, size: string, color: string) {
    return variant.size.trim().toLowerCase() === size.trim().toLowerCase() && variant.color.trim().toLowerCase() === color.trim().toLowerCase();
  }

  function addColor(raw: string) {
    const color = raw.trim().replace(/\s+/g, " ");
    if (!color) return;
    if (palette.some((item) => item.toLowerCase() === color.toLowerCase())) {
      setColorInput("");
      return;
    }
    setFormError("");
    setPalette((current) => [...current, color]);
    setDraft((current) => {
      const sizes = [...new Set(current.variants.map((variant) => variant.size.trim()).filter(Boolean))];
      const variants = [...current.variants];
      for (const size of sizes) {
        if (!variants.some((variant) => sameOption(variant, size, color))) {
          variants.push({ size, color, stock: "1" });
        }
      }
      const colorImages = current.colorImages.some((item) => item.color.toLowerCase() === color.toLowerCase())
        ? current.colorImages
        : [...current.colorImages, { color, images: [] }];
      return { ...current, color: [...palette, color].join(" / "), variants, colorImages };
    });
    setColorInput("");
  }

  function removeColor(color: string) {
    const nextPalette = palette.filter((item) => item.toLowerCase() !== color.toLowerCase());
    setPalette(nextPalette);
    setDraft((current) => ({
      ...current,
      color: nextPalette.join(" / "),
      variants: current.variants.filter((variant) => variant.color.trim().toLowerCase() !== color.toLowerCase()),
      colorImages: current.colorImages.filter((item) => item.color.toLowerCase() !== color.toLowerCase()),
    }));
  }

  function colorPhotos(color: string) {
    return draft.colorImages.find((item) => item.color.toLowerCase() === color.toLowerCase())?.images ?? [];
  }

  function updateColorPhotos(color: string, images: string[]) {
    setDraft((current) => {
      const next = images.slice(0, 8);
      const exists = current.colorImages.some((item) => item.color.toLowerCase() === color.toLowerCase());
      const colorImages = exists
        ? current.colorImages.map((item) => (item.color.toLowerCase() === color.toLowerCase() ? { ...item, images: next } : item))
        : [...current.colorImages, { color, images: next }];
      return { ...current, colorImages };
    });
  }

  async function uploadColorImages(color: string, files: File[]) {
    if (!files.length) return;
    setFormError("");
    setUploadingColor(color);
    try {
      const body = new FormData();
      files.forEach((file) => body.append("file", file));
      const data = await uploadImagesRequest(body).unwrap();
      const urls = data.urls ?? [];
      setDraft((current) => {
        const existing = current.colorImages.find((item) => item.color.toLowerCase() === color.toLowerCase())?.images ?? [];
        const images = [...existing, ...urls].slice(0, 8);
        const colorImages = current.colorImages.some((item) => item.color.toLowerCase() === color.toLowerCase())
          ? current.colorImages.map((item) => (item.color.toLowerCase() === color.toLowerCase() ? { ...item, images } : item))
          : [...current.colorImages, { color, images }];
        return { ...current, colorImages };
      });
    } catch (err) {
      setFormError(apiError(err, "Could not upload the images."));
    } finally {
      setUploadingColor("");
    }
  }

  function addVariantSize(size: string) {
    const next = size.trim();
    if (!next) return;
    if (!palette.length) {
      setFormError("Add a color first. The same size is then added in every color.");
      return;
    }
    setFormError("");
    setDraft((current) => {
      const variants = [...current.variants];
      for (const color of palette) {
        if (!variants.some((variant) => sameOption(variant, next, color))) {
          variants.push({ size: next, color, stock: "1" });
        }
      }
      return { ...current, variants };
    });
    setCustomSize("");
  }

  function setVariantStock(size: string, color: string, stock: string) {
    setDraft((current) => ({
      ...current,
      variants: current.variants.map((variant) => (sameOption(variant, size, color) ? { ...variant, stock } : variant)),
    }));
  }

  function removeVariant(size: string, color: string) {
    setDraft((current) => ({
      ...current,
      variants: current.variants.filter((variant) => !sameOption(variant, size, color)),
    }));
  }

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setPalette([]);
    setColorInput("");
    setCustomSize("");
    setFormError("");
    setCreating(true);
  }

  function openEdit(product: Product) {
    setCreating(false);
    setEditing(product);
    setCustomSize("");
    setColorInput("");
    setFormError("");
    const variantColors = [...new Set((product.variants ?? []).map((variant) => variant.color.trim()).filter(Boolean))];
    const savedColors = product.color && product.color !== "—" ? product.color.split("/").map((item) => item.trim()).filter(Boolean) : [];
    setPalette(variantColors.length ? variantColors : savedColors);
    setDraft({
      name: product.name,
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
      categoryId: product.categoryId,
      subcategory: product.subcategory ?? "",
      color: product.color === "—" ? "" : product.color,
      variants: (product.variants ?? []).map((variant) => ({
        size: variant.size,
        color: variant.color,
        stock: String(variant.stock),
      })),
      colorImages: product.colorImages ?? [],
      description: product.description ?? "",
      image: product.image,
      images: product.images?.length ? product.images : [product.image],
      featured: Boolean(product.featured),
      new: Boolean(product.new),
      active: product.active !== false,
    });
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
  }

  async function uploadImages(files: File[]) {
    if (!files.length) return;
    setFormError("");
    try {
      const body = new FormData();
      files.forEach((file) => body.append("file", file));
      const data = await uploadImagesRequest(body).unwrap();
      const urls = data.urls ?? [];
      setDraft((current) => {
        const images = [...current.images, ...urls].slice(0, 8);
        return { ...current, images, image: images[0] ?? "" };
      });
    } catch (err) {
      setFormError(apiError(err, "Could not upload the images."));
    }
  }

  function addImageUrl(url: string) {
    const next = url.trim();
    if (!next) return;
    setDraft((current) => {
      const images = [...current.images, next].slice(0, 8);
      return { ...current, images, image: images[0] ?? "" };
    });
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    const payload: ProductPayload = {
      ...draft,
      price: Number(draft.price),
      compareAtPrice: draft.compareAtPrice,
      color: palette.join(" / "),
      variants: draft.variants
        .map((variant) => ({
          size: variant.size.trim(),
          color: variant.color.trim(),
          stock: Math.max(0, Math.floor(Number(variant.stock) || 0)),
        }))
        .filter((variant) => variant.size && variant.color),
      colorImages: palette
        .map((color) => ({
          color,
          images: (draft.colorImages.find((item) => item.color.toLowerCase() === color.toLowerCase())?.images ?? []).slice(0, 8),
        }))
        .filter((item) => item.images.length),
    };
    try {
      if (editing) await updateProduct({ id: editing.id, body: payload }).unwrap();
      else await createProduct(payload).unwrap();
      closeForm();
    } catch (err) {
      setFormError(apiError(err, "Could not save the product."));
    }
  }

  async function remove(id: string) {
    try {
      await deleteProduct(id).unwrap();
      setDeleteId(null);
    } catch (err) {
      setFormError(apiError(err, "Could not delete the product."));
    }
  }

  const formOpen = creating || Boolean(editing);

  useEffect(() => {
    if (!formOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeForm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [formOpen]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Add and update the store catalog by category</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2.5 rounded-lg bg-[#4a142a] text-white text-sm font-semibold hover:bg-[#350e1e]"
        >
          Add product
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold ${category === "all" ? "bg-[#4a142a] text-white" : "bg-white border border-gray-200 text-gray-600"}`}
        >
          All
        </button>
        {productCategories.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold ${category === item.id ? "bg-[#4a142a] text-white" : "bg-white border border-gray-200 text-gray-600"}`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name, color, or type"
        className="mb-4 w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm"
      />

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-8 text-sm text-gray-500">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="p-8 text-sm text-gray-500">No products in this category yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-11 overflow-hidden rounded-lg bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.color}{product.subcategory ? ` · ${product.subcategory}` : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {productCategories.find((item) => item.id === product.categoryId)?.name ?? product.categoryId}
                    </td>
                    <td className="px-4 py-3 font-medium">Rs. {Number(product.price).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {product.variants?.length ? totalStock(product.variants) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {product.active === false ? <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px]">Hidden</span> : <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] text-green-700">Live</span>}
                        {product.new ? <span className="rounded-full bg-[#f4e6ec] px-2 py-0.5 text-[11px] text-[#4a142a]">New</span> : null}
                        {product.featured ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] text-amber-800">Featured</span> : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => openEdit(product)} className="text-[#4a142a] font-medium mr-3">Edit</button>
                      {deleteId === product.id ? (
                        <button type="button" onClick={() => remove(product.id)} className="text-red-700 font-medium">Confirm</button>
                      ) : (
                        <button type="button" onClick={() => setDeleteId(product.id)} className="text-gray-500">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={closeForm}>
          <form
            onSubmit={save}
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[min(92vh,900px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold">{editing ? "Edit product" : "New product"}</h2>
              <button type="button" onClick={closeForm} className="text-sm text-gray-500">Close</button>
            </div>
            <div className="space-y-4 overflow-y-auto px-6 py-5">
              <Field label="Name">
                <input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (Rs.)">
                  <input required type="number" min="1" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                </Field>
                <Field label="Compare-at price">
                  <input type="number" min="1" value={draft.compareAtPrice} onChange={(event) => setDraft({ ...draft, compareAtPrice: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                </Field>
              </div>
              <Field label="Category">
                <select
                  value={draft.categoryId}
                  onChange={(event) => setDraft({ ...draft, categoryId: event.target.value, subcategory: "" })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                >
                  {productCategories.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </Field>
              {subcategoryOptions.length > 0 ? (
                <Field label="Type">
                  <select value={draft.subcategory} onChange={(event) => setDraft({ ...draft, subcategory: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm">
                    <option value="">Any</option>
                    {subcategoryOptions.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </Field>
              ) : null}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Colors</span>
                  <span className="text-xs text-gray-500">
                    {draft.variants.reduce((sum, variant) => sum + Math.max(0, Math.floor(Number(variant.stock) || 0)), 0)} articles
                  </span>
                </div>
                <p className="mb-2 text-xs text-gray-500">Add every color this product comes in. The same size is kept separately in each color, with its own stock.</p>
                <div className="mb-3 flex gap-2">
                  <input
                    value={colorInput}
                    onChange={(event) => setColorInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      addColor(colorInput);
                    }}
                    placeholder="Color, e.g. Black"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                  <button type="button" onClick={() => addColor(colorInput)} className="shrink-0 rounded-xl bg-[#f4e6ec] px-3 py-2 text-sm font-medium text-[#4a142a]">
                    Add color
                  </button>
                </div>
                {palette.length > 0 ? (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {palette.map((color) => (
                      <span key={color} className="inline-flex items-center gap-1 rounded-full bg-[#4a142a] px-2.5 py-1 text-xs font-medium text-white">
                        {color}
                        <button type="button" onClick={() => removeColor(color)} className="text-white/80" aria-label={`Remove ${color}`}>
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}
                <p className="mb-2 text-xs text-gray-500">{sizes.hint}</p>
                {sizes.sizes.length > 0 ? (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {sizes.sizes.map((size) => {
                      const selected = palette.length > 0 && palette.every((color) => draft.variants.some((variant) => sameOption(variant, size, color)));
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => addVariantSize(size)}
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                            selected ? "border-[#4a142a] bg-[#4a142a] text-white" : "border-gray-200 text-[#4a142a]"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
                <div className="mb-3 flex gap-2">
                  <input
                    value={customSize}
                    onChange={(event) => setCustomSize(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      addVariantSize(customSize);
                    }}
                    placeholder={
                      draft.categoryId === "shoes"
                        ? "Custom shoe size, e.g. 44"
                        : sizes.sizes.length
                          ? "Custom waist, e.g. 33"
                          : "Custom size"
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => addVariantSize(customSize)}
                    className="shrink-0 rounded-xl bg-[#f4e6ec] px-3 py-2 text-sm font-medium text-[#4a142a]"
                  >
                    Add size
                  </button>
                </div>
                <div className="space-y-3">
                  {palette.map((color) => {
                    const rows = draft.variants.filter((variant) => variant.color.trim().toLowerCase() === color.toLowerCase() && variant.size.trim());
                    return (
                      <div key={color} className="rounded-xl border border-gray-200 p-3">
                        <p className="text-sm font-semibold text-[#4a142a]">{color}</p>
                        {rows.length === 0 ? (
                          <p className="mt-2 text-xs text-gray-500">Add a size and it will show here for this color.</p>
                        ) : (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {rows.map((variant) => (
                              <div key={`${color}-${variant.size}`} className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1">
                                <span className="min-w-6 text-sm font-medium">{variant.size}</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={variant.stock}
                                  aria-label={`${color} ${variant.size} stock`}
                                  onChange={(event) => setVariantStock(variant.size, color, event.target.value)}
                                  className="w-14 rounded-lg border border-gray-200 px-2 py-1 text-sm"
                                />
                                <button type="button" onClick={() => removeVariant(variant.size, color)} className="px-1 text-xs font-medium text-red-700" aria-label={`Remove ${color} ${variant.size}`}>
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="mt-3 text-xs text-gray-500">Photos for {color}. These show when a customer selects this color.</p>
                        <div className="mt-2 grid grid-cols-4 gap-2">
                          {colorPhotos(color).map((url, index) => (
                            <div key={`${color}-${url}-${index}`} className="relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt="" className="h-16 w-full rounded-lg bg-gray-100 object-cover" />
                              <button
                                type="button"
                                onClick={() => updateColorPhotos(color, colorPhotos(color).filter((_, itemIndex) => itemIndex !== index))}
                                className="absolute right-1 top-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                        <label className="mt-2 inline-flex cursor-pointer text-sm font-medium text-[#4a142a]">
                          {uploadingColor === color ? "Uploading…" : `Upload ${color} photos`}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            className="sr-only"
                            onChange={(event) => {
                              const files = [...(event.target.files ?? [])];
                              event.target.value = "";
                              if (files.length) uploadColorImages(color, files);
                            }}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Field label="Description">
                <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              </Field>
              <Field label="Images">
                <p className="mb-2 text-xs text-gray-500">Backup photos, used when a color does not have its own pictures. Add up to 8.</p>
                <div className="grid grid-cols-3 gap-2">
                  {draft.images.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-24 w-full rounded-lg object-cover bg-gray-100" />
                      <span className="absolute left-1 top-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-[#4a142a]">
                        {index === 0 ? "Cover" : index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((current) => {
                            const images = current.images.filter((_, itemIndex) => itemIndex !== index);
                            return { ...current, images, image: images[0] ?? "" };
                          })
                        }
                        className="absolute right-1 top-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-red-700"
                      >
                        Remove
                      </button>
                      {index > 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((current) => {
                              const images = [...current.images];
                              const [chosen] = images.splice(index, 1);
                              images.unshift(chosen);
                              return { ...current, images, image: images[0] };
                            })
                          }
                          className="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-[#4a142a]"
                        >
                          Make cover
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
                <label className="mt-3 inline-flex cursor-pointer text-sm font-medium text-[#4a142a]">
                  {uploading ? "Uploading…" : "Upload images"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="sr-only"
                    onChange={(event) => {
                      const files = [...(event.target.files ?? [])];
                      event.target.value = "";
                      if (files.length) uploadImages(files);
                    }}
                  />
                </label>
                <input
                  placeholder="Or paste an image address and press Enter"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    const input = event.currentTarget;
                    addImageUrl(input.value);
                    input.value = "";
                  }}
                />
              </Field>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} /> Visible in store</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={draft.new} onChange={(event) => setDraft({ ...draft, new: event.target.checked })} /> New arrival</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} /> Featured</label>
              </div>
              {formError ? <p className="text-sm text-red-700">{formError}</p> : null}
              <button type="submit" disabled={saving || uploading} className="w-full py-3 rounded-xl bg-[#4a142a] text-white font-semibold disabled:opacity-50">
                {saving ? "Saving…" : "Save product"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}
