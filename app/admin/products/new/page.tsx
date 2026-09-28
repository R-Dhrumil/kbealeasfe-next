"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { CATEGORIES as MOCK_CATEGORIES } from "@/data/categories";
import { BRANDS as MOCK_BRANDS } from "@/data/brands";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/api";
import { Brand } from "@/types/brand";
import { Category } from "@/types/category";

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [brandId, setBrandId] = useState("brand-vrinda");
  const [categoryId, setCategoryId] = useState("cat-tea-premixes");
  const [price, setPrice] = useState("450");
  const [mrp, setMrp] = useState("520");
  const [stock, setStock] = useState("100");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [packaging, setPackaging] = useState("Aroma-Lock Multi-Layer Foil Pouch");
  const [shelfLife, setShelfLife] = useState("12 Months");
  const [servingSize, setServingSize] = useState("14g per 100ml hot water");
  const [prepSteps, setPrepSteps] = useState([
    "Add 14g premix to ceramic cup.",
    "Pour 100ml steaming hot water (90°C - 95°C).",
    "Stir gently for 10 seconds and enjoy.",
  ]);
  const [isSaved, setIsSaved] = useState(false);
  
  const [brands, setBrands] = useState<Brand[]>(MOCK_BRANDS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [brandsData, catsData] = await Promise.all([
          fetchApi("/catalog/brands"),
          fetchApi("/catalog/categories")
        ]);
        if (Array.isArray(brandsData)) setBrands(brandsData);
        if (Array.isArray(catsData)) setCategories(catsData);
        
        if (Array.isArray(brandsData) && brandsData.length > 0) {
          setBrandId(brandsData[0].id);
        }
        if (Array.isArray(catsData) && catsData.length > 0) {
          setCategoryId(catsData[0].id);
        }
      } catch (err) {
        console.error("Failed to load reference data", err);
      }
    }
    loadData();
  }, []);

  const handleAddStep = () => {
    setPrepSteps([...prepSteps, ""]);
  };

  const handleUpdateStep = (index: number, val: string) => {
    const updated = [...prepSteps];
    updated[index] = val;
    setPrepSteps(updated);
  };

  const handleRemoveStep = (index: number) => {
    setPrepSteps(prepSteps.filter((_, idx) => idx !== index));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/catalog/products", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          slug: sku.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          brandId: brandId,
          categoryId: categoryId,
          tagline: tagline,
          shortDescription: description,
          basePrice: parseFloat(price),
          costPrice: null,
          sku: sku,
          isFeatured: false,
          isBestseller: false,
          isActive: true,
          displayOrder: 0,
          variants: [],
          images: [],
          // Mock some additional detail info using FullDescription as a JSON payload for now if needed
        }),
      });
      setIsSaved(true);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1000);
    } catch (err) {
      console.error("Failed to save product", err);
      alert("Failed to save product. Check console.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Product Catalog</span>
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#143425]">
            Add New Beverage Product
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Register a new tea premix, iced tea flavor, or roasted coffee SKU.
          </p>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Product SKU saved successfully! Returning to catalog...</span>
        </div>
      )}

      <form onSubmit={handleSaveProduct} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs">
          <h2 className="font-serif text-sm font-bold text-[#143425] pb-2 border-b border-stone-100">
            1. Core Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royal Saffron Cardamom Premix"
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                SKU Identifier *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. VRN-SAF-1KG"
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs uppercase font-mono focus:ring-1 focus:ring-[#143425]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                Brand *
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#143425]"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#143425]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
              Tagline / Subheading
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Kashmiri Saffron & Hand-Selected Assam CTC"
              className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
              Editorial Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sensory tasting notes, heritage inspiration, and leaf origin..."
              className="w-full p-3 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs">
          <h2 className="font-serif text-sm font-bold text-[#143425] pb-2 border-b border-stone-100">
            2. Commercial Pricing & Warehouse Stock
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs font-mono focus:ring-1 focus:ring-[#143425]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                MRP (₹) *
              </label>
              <input
                type="number"
                required
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs font-mono focus:ring-1 focus:ring-[#143425]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                Initial Stock Units *
              </label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs font-mono focus:ring-1 focus:ring-[#143425]"
              />
            </div>
          </div>
        </div>

        {/* Preparation Guide */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h2 className="font-serif text-sm font-bold text-[#143425]">
              3. Preparation Instructions
            </h2>
            <button
              type="button"
              onClick={handleAddStep}
              className="text-xs text-[#143425] font-semibold hover:text-[#C89B3C] flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          <div className="space-y-3">
            {prepSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-stone-100 text-stone-700 font-mono text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleUpdateStep(idx, e.target.value)}
                  placeholder={`Step ${idx + 1} instructions...`}
                  className="flex-1 h-9 px-3 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                />
                {prepSteps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-1.5 text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/admin/products">
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </Link>
          <Button variant="primary" size="md" type="submit">
            Save & Publish Product
          </Button>
        </div>
      </form>
    </div>
  );
}
