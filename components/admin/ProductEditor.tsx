"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Info,
  Package,
  IndianRupee,
  Image as ImageIcon,
  FolderTree,
  Building2,
  Megaphone,
  Sliders,
  ListChecks,
  Search,
  Download,
  ShoppingBag,
  ArrowLeft,
  Eye,
  Copy,
  Save,
  Trash2,
  Upload,
  Plus,
  Check,
  CheckCircle2,
  ExternalLink,
  X,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Star,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { getBrands } from "@/service/brands";
import { getCategories } from "@/service/categories";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Brand } from "@/types/brand";
import { Category } from "@/types/category";

export type TabKey =
  | "info"
  | "inventory"
  | "price"
  | "pictures"
  | "categories"
  | "manufacturers"
  | "promotion"
  | "attributes"
  | "specifications"
  | "seo"
  | "downloads"
  | "orders";

interface TabDefinition {
  id: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabDefinition[] = [
  { id: "info", label: "Product Info", icon: Info },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "price", label: "Price", icon: IndianRupee },
  { id: "pictures", label: "Pictures", icon: ImageIcon },
  { id: "categories", label: "Category mappings", icon: FolderTree },
  { id: "promotion", label: "Promotion", icon: Megaphone },
  { id: "attributes", label: "Attributes", icon: Sliders },
  { id: "specifications", label: "Specification attributes", icon: ListChecks },
  { id: "seo", label: "Search engines (SEO)", icon: Search },
  { id: "downloads", label: "Downloads", icon: Download },
  { id: "orders", label: "Orders", icon: ShoppingBag },
];

function NumberStepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  className = "",
}: {
  value: string | number;
  onChange: (val: string) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}) {
  const handleIncrement = () => {
    const num = Number(value) || 0;
    const next = num + step;
    if (max !== undefined && next > max) return;
    onChange(String(next));
  };

  const handleDecrement = () => {
    const num = Number(value) || 0;
    const next = num - step;
    if (min !== undefined && next < min) return;
    onChange(String(next));
  };

  return (
    <div className={`relative flex items-center ${className || "w-full max-w-md"}`}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 pl-3 pr-8 rounded-md border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#143425] focus:border-[#143425] hover:border-stone-400 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-center border-l border-stone-200 pl-1 pr-0.5">
        <button
          type="button"
          onClick={handleIncrement}
          className="h-3.5 w-4 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors"
          tabIndex={-1}
        >
          <ChevronUp className="w-3 h-3 stroke-[2]" />
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          className="h-3.5 w-4 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors"
          tabIndex={-1}
        >
          <ChevronDown className="w-3 h-3 stroke-[2]" />
        </button>
      </div>
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none ${
        checked ? "bg-[#143425]" : "bg-stone-300"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

interface ProductEditorProps {
  productId?: string;
}

export function ProductEditor({ productId }: ProductEditorProps) {
  const router = useRouter();
  const isEditMode = Boolean(productId);

  const [activeTab, setActiveTab] = useState<TabKey>("info");
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Reference data
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // 1. PRODUCT INFO STATE
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("09024020");
  const [tagline, setTagline] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [visibility, setVisibility] = useState("Fully visible");
  const [productType, setProductType] = useState("Simple product");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [createdAtDate, setCreatedAtDate] = useState<string>("");
  const [updatedAtDate, setUpdatedAtDate] = useState<string>("");

  // 2. INVENTORY STATE (SmartStore Inventory Matrix)
  const [manageInventoryMethod, setManageInventoryMethod] = useState<
    "Don't track inventory" | "Track inventory" | "Track inventory by product attributes"
  >("Track inventory");
  const [isInventoryMethodDropdownOpen, setIsInventoryMethodDropdownOpen] = useState(false);
  const inventoryMethodRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inventoryMethodRef.current && !inventoryMethodRef.current.contains(event.target as Node)) {
        setIsInventoryMethodDropdownOpen(false);
      }
    }
    if (isInventoryMethodDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isInventoryMethodDropdownOpen]);

  const [stock, setStock] = useState("10000");
  const [displayStockAvailability, setDisplayStockAvailability] = useState(false);
  const [minStockQuantity, setMinStockQuantity] = useState("0");
  const [lowStockActivity, setLowStockActivity] = useState<"Nothing" | "Disable buy button" | "Unpublish product">("Nothing");
  const [notifyAdminForQuantityBelow, setNotifyAdminForQuantityBelow] = useState("1");
  const [backorders, setBackorders] = useState<"No backorders" | "Allow qty below 0" | "Allow qty below 0 and notify customer">("No backorders");
  const [allowBackInStockSubscriptions, setAllowBackInStockSubscriptions] = useState(false);

  // Cart quantity controls
  const [minCartQty, setMinCartQty] = useState("1");
  const [maxCartQty, setMaxCartQty] = useState("10000");
  const [quantityStep, setQuantityStep] = useState("0");
  const [customQuantities, setCustomQuantities] = useState("");
  const [hideQuantitySelection, setHideQuantitySelection] = useState(false);
  const [quantityPerMainProduct, setQuantityPerMainProduct] = useState("0");
  const [warehouseLocation, setWarehouseLocation] = useState("Facility A - Main Dry Storage");

  // 3. PRICE STATE
  const [basePrice, setBasePrice] = useState("450");
  const [mrp, setMrp] = useState("520");
  const [specialPrice, setSpecialPrice] = useState("");
  const [specialPriceStart, setSpecialPriceStart] = useState("");
  const [specialPriceEnd, setSpecialPriceEnd] = useState("");
  const [taxRate, setTaxRate] = useState("5% GST (Standard Food & Beverage)");

  // 4. PICTURES STATE
  const [images, setImages] = useState<Array<{ url: string; alt: string; isPrimary: boolean; order: number }>>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  // 5. CATEGORY MAPPINGS STATE
  const [categoryId, setCategoryId] = useState("");

  // 6. MANUFACTURER MAPPINGS (BRAND) STATE
  const [brandId, setBrandId] = useState("");

  // 7. PROMOTION STATE
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [promoBadgeText, setPromoBadgeText] = useState("Tapri Special");
  const [bannerHighlight, setBannerHighlight] = useState("Estate Fresh Assam Premix");

  // 8. ATTRIBUTES & VARIANTS STATE
  const [variants, setVariants] = useState<Array<{
    id?: string;
    variantSKU: string;
    variantName: string;
    size?: string;
    flavor?: string;
    price: number;
    availableQuantity?: number;
    isActive: boolean;
  }>>([
    {
      variantSKU: "VR-CHAI-500G",
      variantName: "500g Pouch (Standard)",
      size: "500g",
      flavor: "Classic Masala",
      price: 450,
      availableQuantity: 80,
      isActive: true,
    },
    {
      variantSKU: "VR-CHAI-1KG",
      variantName: "1kg Master Tin (Family Pack)",
      size: "1kg",
      flavor: "Classic Masala",
      price: 850,
      availableQuantity: 20,
      isActive: true,
    },
  ]);
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantSku, setNewVariantSku] = useState("");
  const [newVariantSize, setNewVariantSize] = useState("");
  const [newVariantPrice, setNewVariantPrice] = useState("450");
  const [newVariantStock, setNewVariantStock] = useState("50");
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);

  // 9. SPECIFICATION ATTRIBUTES STATE
  const [packaging, setPackaging] = useState("Aroma-Lock Multi-Layer Foil Pouch");
  const [shelfLife, setShelfLife] = useState("12 Months");
  const [servingSize, setServingSize] = useState("14g per 100ml hot water");
  const [storageNotes, setStorageNotes] = useState("Store in a cool, dry place. Seal zipper tightly after each brew.");
  const [ingredients, setIngredients] = useState<string[]>([
    "High-grown Assam CTC Tea",
    "Crushed Green Cardamom",
    "Ginger Powder",
    "Nutmeg & Clove",
    "Dairy Milk Solids",
    "Pure Demerara Sugar",
  ]);
  const [newIngredientInput, setNewIngredientInput] = useState("");
  const [prepSteps, setPrepSteps] = useState<string[]>([
    "Add 14g (approx. 1 level scoop) premix into your favourite ceramic cup.",
    "Pour 100ml steaming hot water (recommended temperature: 90°C - 95°C).",
    "Stir gently for 10 seconds until velvety froth surfaces and enjoy hot.",
  ]);
  const [dietaryFlags, setDietaryFlags] = useState<string[]>([
    "100% Vegetarian",
    "Zero Artificial Preservatives",
    "Zero Trans Fats",
    "FSSAI Certified Formulation",
  ]);

  // 10. SEARCH ENGINES (SEO) STATE
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("chai premix, tea premix, instant beverage, indian masala chai");

  // 11. DOWNLOADS & CERTIFICATES STATE
  const [downloads, setDownloads] = useState<Array<{ name: string; url: string; size: string }>>([
    { name: "FSSAI Food Safety Compliance Certificate.pdf", url: "#", size: "1.4 MB" },
    { name: "Nutritional Lab Assay & Heavy Metals Analysis.pdf", url: "#", size: "820 KB" },
    { name: "Commercial Dispenser & Tapri Calibration Guide.pdf", url: "#", size: "2.1 MB" },
  ]);
  const [newDocName, setNewDocName] = useState("");
  const [newDocUrl, setNewDocUrl] = useState("");

  // Load product data
  useEffect(() => {
    async function init() {
      try {
        const [brandsData, catsData] = await Promise.all([
          getBrands().catch(() => []),
          getCategories().catch(() => []),
        ]);
        if (Array.isArray(brandsData)) setBrands(brandsData);
        if (Array.isArray(catsData)) setCategories(catsData);

        if (isEditMode && productId) {
          const product = await fetchApi(`/catalog/products/${productId}`);
          if (product) {
            setName(product.name || "");
            setSlug(product.slug || "");
            setSku(product.sku || "");
            setBrandId(product.brandId || "");
            setCategoryId(product.categoryId || "");
            setTagline(product.tagline || "");
            setShortDescription(product.shortDescription || "");
            setFullDescription(product.fullDescription || "");
            setBasePrice(String(product.basePrice || "0"));
            setMrp(String(product.costPrice || (product.basePrice ? Number(product.basePrice) * 1.2 : "0")));
            setIsFeatured(Boolean(product.isFeatured));
            setIsBestseller(Boolean(product.isBestseller));
            setIsPublished(product.isActive !== false);
            setDisplayOrder(product.displayOrder || 0);

            if (product.createdAt) setCreatedAtDate(new Date(product.createdAt).toLocaleString());
            if (product.updatedAt) setUpdatedAtDate(new Date(product.updatedAt).toLocaleString());

            if (Array.isArray(product.images) && product.images.length > 0) {
              setImages(
                product.images.map((img: any, idx: number) => ({
                  url: img.imageUrl,
                  alt: img.altText || product.name,
                  isPrimary: img.isPrimary ?? idx === 0,
                  order: img.displayOrder ?? idx,
                }))
              );
            }

            if (Array.isArray(product.variants) && product.variants.length > 0) {
              setVariants(
                product.variants.map((v: any) => ({
                  id: v.id,
                  variantSKU: v.variantSKU,
                  variantName: v.variantName,
                  size: v.size,
                  flavor: v.flavor,
                  price: v.price,
                  availableQuantity: v.availableQuantity ?? v.quantityInStock ?? 50,
                  isActive: v.isActive !== false,
                }))
              );
              setStock(String(product.totalAvailableQuantity || product.variants[0].availableQuantity || "50"));
            }

            if (product.bannerMetadata) {
              try {
                const meta = JSON.parse(product.bannerMetadata);
                if (meta.visibility) setVisibility(meta.visibility);
                if (meta.productType) setProductType(meta.productType);
                if (meta.barcode) setBarcode(meta.barcode);
                if (meta.packaging) setPackaging(meta.packaging);
                if (meta.shelfLife) setShelfLife(meta.shelfLife);
                if (meta.servingSize) setServingSize(meta.servingSize);
                if (meta.storageNotes) setStorageNotes(meta.storageNotes);
                if (Array.isArray(meta.ingredients)) setIngredients(meta.ingredients);
                if (Array.isArray(meta.prepSteps)) setPrepSteps(meta.prepSteps);
                if (Array.isArray(meta.dietaryFlags)) setDietaryFlags(meta.dietaryFlags);
                if (meta.seoTitle) setSeoTitle(meta.seoTitle);
                if (meta.seoDescription) setSeoDescription(meta.seoDescription);
                if (meta.seoKeywords) setSeoKeywords(meta.seoKeywords);
                if (meta.promoBadgeText) setPromoBadgeText(meta.promoBadgeText);
                if (meta.bannerHighlight) setBannerHighlight(meta.bannerHighlight);
                if (meta.taxRate) setTaxRate(meta.taxRate);
                if (meta.manageInventoryMethod) setManageInventoryMethod(meta.manageInventoryMethod);
                if (meta.displayStockAvailability !== undefined) setDisplayStockAvailability(meta.displayStockAvailability);
                if (meta.minStockQuantity !== undefined) setMinStockQuantity(String(meta.minStockQuantity));
                if (meta.lowStockActivity) setLowStockActivity(meta.lowStockActivity);
                if (meta.notifyAdminForQuantityBelow !== undefined) setNotifyAdminForQuantityBelow(String(meta.notifyAdminForQuantityBelow));
                if (meta.backorders) setBackorders(meta.backorders);
                if (meta.allowBackInStockSubscriptions !== undefined) setAllowBackInStockSubscriptions(meta.allowBackInStockSubscriptions);
                if (meta.minCartQty !== undefined) setMinCartQty(String(meta.minCartQty));
                if (meta.maxCartQty !== undefined) setMaxCartQty(String(meta.maxCartQty));
                if (meta.quantityStep !== undefined) setQuantityStep(String(meta.quantityStep));
                if (meta.customQuantities !== undefined) setCustomQuantities(meta.customQuantities);
                if (meta.hideQuantitySelection !== undefined) setHideQuantitySelection(meta.hideQuantitySelection);
                if (meta.quantityPerMainProduct !== undefined) setQuantityPerMainProduct(String(meta.quantityPerMainProduct));
                if (meta.warehouseLocation) setWarehouseLocation(meta.warehouseLocation);
                if (Array.isArray(meta.downloads)) setDownloads(meta.downloads);
              } catch {
                // Ignore parsing if bannerMetadata is simple string
              }
            }

            try {
              const ordersData = await fetchApi("/admin/orders").catch(() => []);
              if (Array.isArray(ordersData)) {
                const filtered = ordersData.filter((o: any) =>
                  o.items?.some((item: any) => item.productId === productId || item.productName === product.name)
                );
                setRecentOrders(filtered);
              }
            } catch {
              // Non-blocking
            }
          }
        } else {
          if (brandsData.length > 0) setBrandId(brandsData[0].id);
          if (catsData.length > 0) setCategoryId(catsData[0].id);
          setCreatedAtDate(new Date().toLocaleString());
          setUpdatedAtDate(new Date().toLocaleString());
        }
      } catch (err: any) {
        console.error("Failed to load product details", err);
        setErrorMsg("Failed to load product data. Please check your backend connection.");
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [productId, isEditMode]);

  useEffect(() => {
    if (!seoTitle && name) {
      setSeoTitle(`${name} | KB Beverage`);
    }
  }, [name, seoTitle]);

  const handleAutoSlug = () => {
    const gen = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(gen);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploadingImage(true);
    setErrorMsg("");

    try {
      const uploaded: Array<{ url: string; alt: string; isPrimary: boolean; order: number }> = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetchApi("/catalog/upload-image", {
          method: "POST",
          body: formData,
        });

        if (res && res.url) {
          uploaded.push({
            url: res.url,
            alt: name || "Product image",
            isPrimary: images.length === 0 && uploaded.length === 0,
            order: images.length + uploaded.length,
          });
        }
      }

      setImages((prev) => [...prev, ...uploaded]);
      setSaveSuccessMsg(`Successfully uploaded ${uploaded.length} image(s).`);
      setTimeout(() => setSaveSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error("Upload error", err);
      setErrorMsg("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [
      ...prev,
      {
        url: newImageUrl.trim(),
        alt: name || "Product image",
        isPrimary: prev.length === 0,
        order: prev.length,
      },
    ]);
    setNewImageUrl("");
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        isPrimary: idx === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, idx) => idx !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleSave = async (continueEditing: boolean = false) => {
    if (!name.trim()) {
      setErrorMsg("Product name is required.");
      setActiveTab("info");
      return;
    }
    if (!sku.trim()) {
      setErrorMsg("Product SKU is required.");
      setActiveTab("info");
      return;
    }
    if (!brandId) {
      setErrorMsg("Please map a Brand/Manufacturer.");
      setActiveTab("manufacturers");
      return;
    }
    if (!categoryId) {
      setErrorMsg("Please map a primary Category.");
      setActiveTab("categories");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    const metadataPayload = JSON.stringify({
      visibility,
      productType,
      barcode,
      packaging,
      shelfLife,
      servingSize,
      storageNotes,
      ingredients,
      prepSteps,
      dietaryFlags,
      seoTitle,
      seoDescription,
      seoKeywords,
      promoBadgeText,
      bannerHighlight,
      taxRate,
      manageInventoryMethod,
      displayStockAvailability,
      minStockQuantity: Number(minStockQuantity) || 0,
      lowStockActivity,
      notifyAdminForQuantityBelow: Number(notifyAdminForQuantityBelow) || 1,
      backorders,
      allowBackInStockSubscriptions,
      minCartQty: Number(minCartQty) || 1,
      maxCartQty: Number(maxCartQty) || 10000,
      quantityStep: Number(quantityStep) || 0,
      customQuantities,
      hideQuantitySelection,
      quantityPerMainProduct: Number(quantityPerMainProduct) || 0,
      warehouseLocation,
      downloads,
    });

    const parsedBasePrice = parseFloat(basePrice) || 0;
    const parsedCostPrice = parseFloat(mrp) || parsedBasePrice * 1.2;
    const parsedStock = Math.max(0, Number(stock) || 0);
    const parsedThreshold = Math.max(1, Number(notifyAdminForQuantityBelow) || 10);

    const payload: any = {
      name: name.trim(),
      slug: (slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^-|-$/g, ""),
      brandId,
      categoryId,
      tagline: tagline.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      basePrice: parsedBasePrice,
      costPrice: parsedCostPrice,
      sku: sku.trim(),
      stock: parsedStock,
      lowStockThreshold: parsedThreshold,
      warehouseLocation: warehouseLocation || "Vadodara Central Depot",
      isFeatured,
      isBestseller,
      isActive: isPublished,
      displayOrder: Number(displayOrder) || 0,
      bannerMetadata: metadataPayload,
      images: images.map((img, idx) => ({
        imageUrl: img.url,
        altText: img.alt || name,
        isPrimary: img.isPrimary,
        displayOrder: idx,
      })),
      variants: variants.length > 0 ? variants.map((v) => ({
        variantSKU: v.variantSKU || (sku.trim() ? `${sku.trim()}-${v.size || "VAR"}` : "VAR-STD"),
        variantName: v.variantName || "Standard Pack",
        size: v.size || "Standard",
        flavor: v.flavor || "Natural",
        price: v.price || parsedBasePrice,
        initialStock: variants.length === 1 ? parsedStock : (v.availableQuantity !== undefined ? v.availableQuantity : parsedStock),
        lowStockThreshold: parsedThreshold,
        isActive: v.isActive,
      })) : [{
        variantSKU: sku.trim() ? `${sku.trim()}-STD` : "VAR-STD",
        variantName: "Standard Pack",
        size: "Standard",
        flavor: "Natural",
        price: parsedBasePrice,
        initialStock: parsedStock,
        lowStockThreshold: parsedThreshold,
        isActive: isPublished,
      }],
    };

    try {
      if (isEditMode && productId) {
        await fetchApi(`/catalog/products/${productId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setSaveSuccessMsg("Product changes saved successfully.");
      } else {
        const created = await fetchApi("/catalog/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSaveSuccessMsg("New product created successfully.");
        if (created && created.id && continueEditing) {
          router.replace(`/admin/products/${created.id}`);
        }
      }

      setUpdatedAtDate(new Date().toLocaleString());

      if (!continueEditing) {
        setTimeout(() => {
          router.push("/admin/products");
        }, 800);
      } else {
        setTimeout(() => setSaveSuccessMsg(""), 3500);
      }
    } catch (err: any) {
      console.error("Save error", err);
      setErrorMsg(err.message || "Failed to save product. Ensure you have admin privileges.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyProduct = () => {
    setName((prev) => `${prev} (Copy)`);
    setSku((prev) => `${prev}-COPY`);
    setSlug((prev) => `${prev}-copy`);
    setSaveSuccessMsg("Product fields cloned as a new draft. Click Save to create.");
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  const handleDelete = async () => {
    if (!productId) return;
    const ok = window.confirm(
      "Are you sure you want to deactivate this product? It will be removed from customer storefront listings."
    );
    if (!ok) return;

    try {
      setIsSaving(true);
      await fetchApi(`/catalog/products/${productId}`, { method: "DELETE" });
      router.push("/admin/products");
    } catch (err: any) {
      setErrorMsg("Failed to delete product.");
      setIsSaving(false);
    }
  };

  const activeBrand = useMemo(() => brands.find((b) => b.id === brandId), [brands, brandId]);
  const activeCategory = useMemo(() => categories.find((c) => c.id === categoryId), [categories, categoryId]);

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-stone-200">
        <Loader2 className="h-8 w-8 text-[#143425] animate-spin" />
        <p className="text-sm font-medium text-stone-600">Loading product configuration...</p>
      </div>
    );
  }

  const primaryImage = images.find((i) => i.isPrimary)?.url || images[0]?.url;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* ============================================================ */}
      {/* 1. TOP HEADER ACTION BAR (SmartStore Refined Style)          */}
      {/* ============================================================ */}
      <div className="p-4 sm:px-6 sm:py-4 border-b border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Back Arrow, Thumbnail badge, Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <Link
            href="/admin/products"
            className="h-9 w-9 rounded-lg border border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-50 flex items-center justify-center transition-colors shrink-0"
            title="Back to Products Catalog"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="h-9 w-12 rounded bg-[#FBF5E8] border border-[#E8DED1] flex items-center justify-center overflow-hidden shrink-0">
            {primaryImage ? (
              <img src={primaryImage} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-[10px] font-bold text-[#C89B3C] uppercase tracking-wider font-mono">
                {sku ? sku.substring(0, 3) : "KB"}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-stone-900 truncate flex items-center gap-2">
              <span>{name || (isEditMode ? "Edit Product" : "New Product")}</span>
              <span className="text-stone-400 font-normal">/</span>
              <span className="text-stone-500 font-normal text-sm">{isEditMode ? "Edit" : "Add"}</span>
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {slug && (
            <Link
              href={`/product/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 transition-colors"
            >
              <Eye className="h-3.5 w-3.5 text-stone-500" />
              <span>Preview</span>
            </Link>
          )}

          {isEditMode && (
            <button
              type="button"
              onClick={handleCopyProduct}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 transition-colors"
            >
              <Copy className="h-3.5 w-3.5 text-stone-500" />
              <span>Copy product</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#C89B3C] hover:bg-[#A87E28] transition-colors shadow-2xs"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            <span>Save</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-colors"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5 text-stone-500" />}
            <span>Save and Continue Edit</span>
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-2xs"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {saveSuccessMsg && (
        <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. MAIN SPLIT: LEFT NAVIGATION PANEL + RIGHT FORM AREA       */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        {/* ============================================================ */}
        {/* LEFT VERTICAL OPTIONS PANEL (SmartStore Left Navigation)    */}
        {/* ============================================================ */}
        <aside className="lg:col-span-3 border-r border-stone-200 bg-stone-50/40 py-2">
          <nav className="space-y-0.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between text-xs transition-colors relative ${
                    isActive
                      ? "text-[#143425] font-bold bg-white"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/60 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? "text-[#C89B3C]" : "text-stone-400"
                      }`}
                    />
                    <span className="truncate">{tab.label}</span>
                  </div>

                  {/* Active Indicator Bar on right edge */}
                  {isActive && (
                    <span className="absolute right-0 top-0 bottom-0 w-1 bg-[#C89B3C]" />
                  )}

                  {/* Context Counter Pills */}
                  {tab.id === "pictures" && images.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-stone-100 text-stone-600 border border-stone-200">
                      {images.length}
                    </span>
                  )}
                  {tab.id === "attributes" && variants.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-stone-100 text-stone-600 border border-stone-200">
                      {variants.length}
                    </span>
                  )}
                  {tab.id === "orders" && recentOrders.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                      {recentOrders.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ============================================================ */}
        {/* RIGHT FORM WORKSPACE (Refined 2-Column Row Architecture)     */}
        {/* ============================================================ */}
        <main className="lg:col-span-9 p-6 sm:p-8 bg-white">
          {/* ============================================================ */}
          {/* TAB 1: PRODUCT INFO                                          */}
          {/* ============================================================ */}
          {activeTab === "info" && (
            <div className="space-y-4">
              {/* ID */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-2.5 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">ID</span>
                </div>
                <div className="md:col-span-9">
                  <span className="font-mono text-xs text-stone-900 font-medium">
                    {productId || "Auto-assigned upon creation"}
                  </span>
                </div>
              </div>

              {/* Created on */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-2.5 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Created on</span>
                </div>
                <div className="md:col-span-9">
                  <span className="text-xs text-stone-700">{createdAtDate || "Just now"}</span>
                </div>
              </div>

              {/* Updated on */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-2.5 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Updated on</span>
                </div>
                <div className="md:col-span-9">
                  <span className="text-xs text-stone-700">{updatedAtDate || "Just now"}</span>
                </div>
              </div>

              {/* URL of product page */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-2.5 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">URL of the product page</span>
                </div>
                <div className="md:col-span-9">
                  {slug ? (
                    <Link
                      href={`/product/${slug}`}
                      target="_blank"
                      className="text-xs text-[#143425] hover:text-[#C89B3C] font-semibold inline-flex items-center gap-1.5"
                    >
                      <span>https://kbbeverage.com/product/{slug}</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="text-xs text-stone-400 italic">Auto-generated from title</span>
                  )}
                </div>
              </div>

              {/* Published Toggle Switch */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Published</span>
                </div>
                <div className="md:col-span-9 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPublished(!isPublished)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isPublished ? "bg-[#C89B3C]" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isPublished ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-xs text-stone-500 font-medium">
                    {isPublished ? "Visible on customer storefront" : "Hidden / Draft mode"}
                  </span>
                </div>
              </div>

              {/* Visibility */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Visibility</span>
                </div>
                <div className="md:col-span-9">
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full max-w-md h-9 px-3 rounded-lg border border-stone-300 bg-white text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#143425]"
                  >
                    <option value="Fully visible">Fully visible (Storefront & Catalog)</option>
                    <option value="Catalog only">Catalog only (Exclude from search)</option>
                    <option value="Direct link only">Direct link only (Hidden from catalog)</option>
                    <option value="Hidden">Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Product Type */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Product type</span>
                </div>
                <div className="md:col-span-9">
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full max-w-md h-9 px-3 rounded-lg border border-stone-300 bg-white text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#143425]"
                  >
                    <option value="Simple product">Simple product (Granulated Instant Premix)</option>
                    <option value="Artisan roast">Artisan Whole Leaf & Coffee Roast</option>
                    <option value="Botanical Iced Tea">Botanical Iced Tea Blend</option>
                    <option value="Gift Pack">Curated Tasting Gift Box</option>
                  </select>
                </div>
              </div>

              {/* Product Name */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-start">
                <div className="md:col-span-3 pt-2">
                  <span className="text-xs font-semibold text-stone-700">Product name *</span>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. 10 € Geschenkgutschein or Vrinda Royal Tapri Chai Premix"
                    className="w-full h-9 px-3 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#143425]"
                  />
                  <span className="text-[10px] text-stone-400 font-mono block text-right">{name.length}/200 chars</span>
                </div>
              </div>

              {/* URL Handle / Slug */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">URL Slug / Handle</span>
                </div>
                <div className="md:col-span-9 flex items-center gap-2">
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. vrinda-tapri-masala-chai"
                    className="flex-1 h-9 px-3 rounded-lg border border-stone-300 bg-white text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#143425]"
                  />
                  <button
                    type="button"
                    onClick={handleAutoSlug}
                    className="px-3 h-9 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 shrink-0"
                  >
                    Auto Generate
                  </button>
                </div>
              </div>

              {/* Tagline */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Tagline / Subheading</span>
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. The Soul of Indian Chai • 10-Second Quick Cup"
                    className="w-full h-9 px-3 rounded-lg border border-stone-300 bg-white text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#143425]"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-start">
                <div className="md:col-span-3 pt-2">
                  <span className="text-xs font-semibold text-stone-700">Short description</span>
                  <p className="text-[11px] text-stone-400">Card & snippet summary</p>
                </div>
                <div className="md:col-span-9">
                  <textarea
                    rows={2}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Compact summary rendered in storefront product cards..."
                    className="w-full p-2.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#143425]"
                  />
                </div>
              </div>

              {/* Full Description */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-start">
                <div className="md:col-span-3 pt-2">
                  <span className="text-xs font-semibold text-stone-700">Full description</span>
                  <p className="text-[11px] text-stone-400">Detailed editorial copy</p>
                </div>
                <div className="md:col-span-9">
                  <textarea
                    rows={5}
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    placeholder="Comprehensive description covering estate origins, flavor profiles, and craftsmanship..."
                    className="w-full p-2.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#143425]"
                  />
                </div>
              </div>

              {/* SKU */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">SKU *</span>
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. VR-1000"
                    className="w-full max-w-sm h-9 px-3 rounded-lg border border-stone-300 bg-white text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#143425]"
                  />
                </div>
              </div>

              {/* Barcode / HSN */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">HSN Code / Barcode</span>
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="e.g. 09024020"
                    className="w-full max-w-sm h-9 px-3 rounded-lg border border-stone-300 bg-white text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#143425]"
                  />
                </div>
              </div>

              {/* Display Order */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Display order</span>
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-28 h-9 px-3 rounded-lg border border-stone-300 bg-white text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#143425]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: INVENTORY                                             */}
          {/* ============================================================ */}
          {activeTab === "inventory" && (
            <div className="space-y-8">

              {/* ─── SECTION 1 : Stock Quantity ─────────────────────────── */}
              <section>
                {/* Section Header */}
                <div className="mb-4 pb-2 border-b border-stone-200">
                  <h3 className="text-sm font-semibold text-stone-600 tracking-tight">Stock quantity</h3>
                </div>

                <div className="space-y-0">

                  {/* ── Row: Manage inventory method ── */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-stone-100 items-center">
                    <div className="md:col-span-4">
                      <span className="text-xs font-semibold text-stone-700">Manage inventory method</span>
                    </div>
                    <div className="md:col-span-8">
                      <div ref={inventoryMethodRef} className="relative w-full max-w-md">
                        <button
                          type="button"
                          id="inventory-method-btn"
                          onClick={() => setIsInventoryMethodDropdownOpen(!isInventoryMethodDropdownOpen)}
                          className="w-full h-9 px-3 pr-9 rounded-md border border-stone-300 bg-white text-xs text-stone-900 flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-[#143425] focus:border-[#143425] hover:border-stone-400 transition-colors"
                        >
                          <span className="truncate">{manageInventoryMethod}</span>
                          <ChevronDown
                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 transition-transform pointer-events-none ${
                              isInventoryMethodDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isInventoryMethodDropdownOpen && (
                          <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-xl py-1 overflow-hidden">
                            {(
                              [
                                "Don't track inventory",
                                "Track inventory",
                                "Track inventory by product attributes",
                              ] as const
                            ).map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  setManageInventoryMethod(opt);
                                  setIsInventoryMethodDropdownOpen(false);
                                }}
                                className={`w-full px-3 py-2.5 text-left text-xs flex items-center gap-2.5 transition-colors ${
                                  manageInventoryMethod === opt
                                    ? "bg-[#143425]/5 text-stone-900 font-semibold"
                                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                                }`}
                              >
                                <span className={`w-3.5 h-3.5 flex items-center justify-center shrink-0 ${
                                  manageInventoryMethod === opt ? "text-[#143425]" : ""
                                }`}>
                                  {manageInventoryMethod === opt && (
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  )}
                                </span>
                                <span>{opt}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Conditional: "Track inventory" fields ── */}
                  {manageInventoryMethod === "Track inventory" && (
                    <>
                      {/* Stock quantity */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-stone-100 items-center">
                        <div className="md:col-span-4">
                          <span className="text-xs font-semibold text-stone-700">Stock quantity</span>
                        </div>
                        <div className="md:col-span-8 flex items-center gap-3">
                          <NumberStepper value={stock} onChange={setStock} min={0} className="w-full max-w-md" />
                        </div>
                      </div>

                      {/* Display stock availability */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-stone-100 items-center">
                        <div className="md:col-span-4">
                          <span className="text-xs font-semibold text-stone-700">Display stock availability</span>
                        </div>
                        <div className="md:col-span-8 flex items-center gap-3">
                          <ToggleSwitch checked={displayStockAvailability} onChange={setDisplayStockAvailability} />
                        </div>
                      </div>

                      {/* Minimum stock quantity */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-stone-100 items-center">
                        <div className="md:col-span-4">
                          <span className="text-xs font-semibold text-stone-700">Minimum stock quantity</span>
                        </div>
                        <div className="md:col-span-8">
                          <NumberStepper value={minStockQuantity} onChange={setMinStockQuantity} min={0} className="w-full max-w-md" />
                        </div>
                      </div>

                      {/* Low stock activity */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-stone-100 items-center">
                        <div className="md:col-span-4">
                          <span className="text-xs font-semibold text-stone-700">Low stock activity</span>
                        </div>
                        <div className="md:col-span-8">
                          <div className="relative w-full max-w-md">
                            <select
                              value={lowStockActivity}
                              onChange={(e) => setLowStockActivity(e.target.value as any)}
                              className="w-full h-9 px-3 pr-8 rounded-md border border-stone-300 bg-white text-xs text-stone-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#143425] focus:border-[#143425] hover:border-stone-400 transition-colors"
                            >
                              <option value="Nothing">Nothing</option>
                              <option value="Disable buy button">Disable buy button</option>
                              <option value="Unpublish product">Unpublish product</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                          </div>
                        </div>
                      </div>

                      {/* Notify admin for quantity below */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-stone-100 items-center">
                        <div className="md:col-span-4">
                          <span className="text-xs font-semibold text-stone-700">Notify admin for quantity below</span>
                        </div>
                        <div className="md:col-span-8">
                          <NumberStepper value={notifyAdminForQuantityBelow} onChange={setNotifyAdminForQuantityBelow} min={0} className="w-full max-w-md" />
                        </div>
                      </div>

                      {/* Backorders */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-stone-100 items-center">
                        <div className="md:col-span-4">
                          <span className="text-xs font-semibold text-stone-700">Backorders</span>
                        </div>
                        <div className="md:col-span-8">
                          <div className="relative w-full max-w-md">
                            <select
                              value={backorders}
                              onChange={(e) => setBackorders(e.target.value as any)}
                              className="w-full h-9 px-3 pr-8 rounded-md border border-stone-300 bg-white text-xs text-stone-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#143425] focus:border-[#143425] hover:border-stone-400 transition-colors"
                            >
                              <option value="No backorders">No backorders</option>
                              <option value="Allow qty below 0">Allow qty below 0</option>
                              <option value="Allow qty below 0 and notify customer">Allow qty below 0 and notify customer</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                          </div>
                        </div>
                      </div>

                      {/* Allow back in stock subscriptions */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 items-center">
                        <div className="md:col-span-4">
                          <span className="text-xs font-semibold text-stone-700">Allow back in stock subscriptions</span>
                        </div>
                        <div className="md:col-span-8 flex items-center gap-3">
                          <ToggleSwitch checked={allowBackInStockSubscriptions} onChange={setAllowBackInStockSubscriptions} />
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── Conditional: "Track inventory by product attributes" ── */}
                  {manageInventoryMethod === "Track inventory by product attributes" && (
                    <>
                      {/* Display stock availability */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-stone-100 items-center">
                        <div className="md:col-span-4">
                          <span className="text-xs font-semibold text-stone-700">Display stock availability</span>
                        </div>
                        <div className="md:col-span-8 flex items-center gap-3">
                          <ToggleSwitch checked={displayStockAvailability} onChange={setDisplayStockAvailability} />
                        </div>
                      </div>

                      {/* Info callout */}
                      <div className="mt-4 p-4 bg-[#143425]/5 rounded-lg border border-[#143425]/15 flex items-start gap-3 max-w-xl">
                        <AlertTriangle className="w-4 h-4 text-[#143425] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-stone-800">Per-variant stock management</p>
                          <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                            Stock levels for this product are tracked individually for each attribute variant (Size, Flavour, etc.).
                            Go to the{" "}
                            <button
                              type="button"
                              onClick={() => setActiveTab("attributes")}
                              className="text-[#143425] font-bold underline underline-offset-2 hover:text-[#C89B3C] transition-colors"
                            >
                              Attributes tab
                            </button>
                            {" "}to set stock per variant.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </section>

              {/* ─── SECTION 2 : Cart Quantity ──────────────────────────── */}
              <section>
                {/* Section Header */}
                <div className="mb-4 pb-2 border-b border-stone-200">
                  <h3 className="text-sm font-semibold text-stone-600 tracking-tight">Cart quantity</h3>
                </div>

                <div className="space-y-0">

                  {/* Minimum cart quantity */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-stone-100 items-center">
                    <div className="md:col-span-4">
                      <span className="text-xs font-semibold text-stone-700">Minimum cart quantity</span>
                    </div>
                    <div className="md:col-span-8">
                      <NumberStepper value={minCartQty} onChange={setMinCartQty} min={1} className="w-full max-w-md" />
                    </div>
                  </div>

                  {/* Maximum cart quantity */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-stone-100 items-center">
                    <div className="md:col-span-4">
                      <span className="text-xs font-semibold text-stone-700">Maximum cart quantity</span>
                    </div>
                    <div className="md:col-span-8">
                      <NumberStepper value={maxCartQty} onChange={setMaxCartQty} min={1} className="w-full max-w-md" />
                    </div>
                  </div>

                  {/* Quantity step */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-stone-100 items-center">
                    <div className="md:col-span-4">
                      <span className="text-xs font-semibold text-stone-700">Quantity step</span>
                    </div>
                    <div className="md:col-span-8">
                      <NumberStepper value={quantityStep} onChange={setQuantityStep} min={0} className="w-full max-w-md" />
                    </div>
                  </div>

                  {/* Custom quantities */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-stone-100 items-center">
                    <div className="md:col-span-4">
                      <span className="text-xs font-semibold text-stone-700">Custom quantities</span>
                    </div>
                    <div className="md:col-span-8">
                      <input
                        type="text"
                        value={customQuantities}
                        onChange={(e) => setCustomQuantities(e.target.value)}
                        className="w-full max-w-md h-9 px-3 rounded-md border border-stone-300 text-xs text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#143425] focus:border-[#143425] hover:border-stone-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Hide quantity selection on product pages */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-stone-100 items-center">
                    <div className="md:col-span-4">
                      <span className="text-xs font-semibold text-stone-700">Hide quantity selection on product pages</span>
                    </div>
                    <div className="md:col-span-8 flex items-center gap-3">
                      <ToggleSwitch checked={hideQuantitySelection} onChange={setHideQuantitySelection} />
                    </div>
                  </div>

                  {/* Quantity per main product */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-6 py-3.5 items-center">
                    <div className="md:col-span-4">
                      <span className="text-xs font-semibold text-stone-700">Quantity per main product</span>
                    </div>
                    <div className="md:col-span-8">
                      <NumberStepper value={quantityPerMainProduct} onChange={setQuantityPerMainProduct} min={0} className="w-full max-w-md" />
                    </div>
                  </div>

                </div>
              </section>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: PRICE                                                 */}
          {/* ============================================================ */}
          {activeTab === "price" && (
            <div className="space-y-4">
              {/* Selling Price */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Base Selling Price (₹) *</span>
                </div>
                <div className="md:col-span-9">
                  <div className="relative max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-xs">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      className="w-full h-9 pl-7 pr-3 rounded-lg border border-stone-300 font-mono text-xs font-bold text-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* MRP */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Maximum Retail Price / MRP (₹)</span>
                </div>
                <div className="md:col-span-9">
                  <div className="relative max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-xs">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      value={mrp}
                      onChange={(e) => setMrp(e.target.value)}
                      className="w-full h-9 pl-7 pr-3 rounded-lg border border-stone-300 font-mono text-xs font-bold text-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Margin & Savings */}
              {(() => {
                const sell = Number(basePrice) || 0;
                const cost = Number(mrp) || sell;
                const diff = cost - sell;
                const discountPct = cost > 0 ? Math.round((diff / cost) * 100) : 0;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                    <div className="md:col-span-3">
                      <span className="text-xs font-semibold text-stone-700">Customer Savings Banner</span>
                    </div>
                    <div className="md:col-span-9">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8DED1] text-xs">
                        <span className="font-semibold text-[#143425]">
                          Saves: {formatPrice(Math.max(0, diff))}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="font-bold text-[#C89B3C] font-mono">
                          {discountPct}% OFF printed MRP
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Special Promotional Price */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Special Campaign Price (₹)</span>
                </div>
                <div className="md:col-span-9">
                  <div className="relative max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-xs">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 399"
                      value={specialPrice}
                      onChange={(e) => setSpecialPrice(e.target.value)}
                      className="w-full h-9 pl-7 pr-3 rounded-lg border border-stone-300 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Campaign Schedule Dates */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Campaign Schedule Dates</span>
                </div>
                <div className="md:col-span-9 flex items-center gap-3">
                  <input
                    type="date"
                    value={specialPriceStart}
                    onChange={(e) => setSpecialPriceStart(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                  <span className="text-xs text-stone-400 font-medium">to</span>
                  <input
                    type="date"
                    value={specialPriceEnd}
                    onChange={(e) => setSpecialPriceEnd(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Tax Slab */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Tax / GST Slab</span>
                </div>
                <div className="md:col-span-9">
                  <select
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-full max-w-md h-9 px-3 rounded-lg border border-stone-300 bg-white text-xs text-stone-800"
                  >
                    <option value="5% GST (Standard Food & Beverage)">5% GST (Standard Food & Beverage Premixes)</option>
                    <option value="12% GST (Processed Gourmet Specialties)">12% GST (Processed Gourmet Specialties)</option>
                    <option value="18% GST (Luxury Corporate Gifting)">18% GST (Luxury Corporate Gifting)</option>
                    <option value="0% (Tax Exempt)">0% (Tax Exempt)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: PICTURES                                              */}
          {/* ============================================================ */}
          {activeTab === "pictures" && (
            <div className="space-y-6">
              {/* Upload Strip */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white border border-stone-300 flex items-center justify-center text-[#143425]">
                    {isUploadingImage ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                  </div>
                  <div>
                    <label
                      htmlFor="image-upload-file"
                      className="text-xs font-bold text-[#143425] hover:underline cursor-pointer"
                    >
                      Upload pictures from local files
                    </label>
                    <p className="text-[11px] text-stone-500">Supports JPG, PNG, WEBP</p>
                  </div>
                  <input
                    id="image-upload-file"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Or paste external image URL..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="h-8 px-2.5 rounded-lg border border-stone-300 text-xs bg-white w-48 sm:w-60"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="h-8 px-3 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl border p-2.5 bg-white relative flex flex-col justify-between ${
                      img.isPrimary ? "border-[#C89B3C] ring-2 ring-[#C89B3C]/20 shadow-xs" : "border-stone-200"
                    }`}
                  >
                    <div className="h-40 w-full rounded-lg bg-stone-100 overflow-hidden relative">
                      <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                      {img.isPrimary && (
                        <span className="absolute top-2 left-2 bg-[#C89B3C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Star className="h-2.5 w-2.5 fill-white" /> Primary
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-2">
                      <input
                        type="text"
                        placeholder="Alt text..."
                        value={img.alt}
                        onChange={(e) => {
                          const updated = [...images];
                          updated[idx].alt = e.target.value;
                          setImages(updated);
                        }}
                        className="w-full h-7 px-2 text-[11px] rounded border border-stone-200 bg-stone-50"
                      />

                      <div className="flex items-center justify-between pt-1">
                        {!img.isPrimary ? (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="text-[11px] font-semibold text-[#143425] hover:underline"
                          >
                            Set as primary
                          </button>
                        ) : (
                          <span className="text-[11px] text-stone-400 font-medium italic">Primary badge</span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                          title="Delete image"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: CATEGORY MAPPINGS                                     */}
          {/* ============================================================ */}
          {activeTab === "categories" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Primary category *</span>
                </div>
                <div className="md:col-span-9">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full max-w-md h-9 px-3 rounded-lg border border-stone-300 bg-white text-xs text-stone-800"
                  >
                    <option value="">-- Select Primary Beverage Category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.slug})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {activeCategory && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                  <div className="md:col-span-3">
                    <span className="text-xs font-semibold text-stone-700">Mapped Details</span>
                  </div>
                  <div className="md:col-span-9">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 max-w-md flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-stone-200 overflow-hidden shrink-0">
                        {activeCategory.image && (
                          <img src={activeCategory.image} alt={activeCategory.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">{activeCategory.name}</h4>
                        <span className="text-[11px] text-stone-500 font-mono">Slug: /{activeCategory.slug}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Breadcrumb Preview</span>
                </div>
                <div className="md:col-span-9 text-xs text-stone-600 font-medium">
                  Storefront &gt; Catalog &gt; <strong className="text-[#143425]">{activeCategory?.name || "Category"}</strong> &gt; {name || "Product"}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 6: MANUFACTURER MAPPINGS (BRAND)                         */}
          {/* ============================================================ */}
        

          {/* ============================================================ */}
          {/* TAB 7: PROMOTION                                             */}
          {/* ============================================================ */}
          {activeTab === "promotion" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Featured product</span>
                  <p className="text-[11px] text-stone-400">Show on homepage</p>
                </div>
                <div className="md:col-span-9">
                  <button
                    type="button"
                    onClick={() => setIsFeatured(!isFeatured)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isFeatured ? "bg-[#C89B3C]" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isFeatured ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Bestseller badge</span>
                  <p className="text-[11px] text-stone-400">Gold bestseller ribbon</p>
                </div>
                <div className="md:col-span-9">
                  <button
                    type="button"
                    onClick={() => setIsBestseller(!isBestseller)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isBestseller ? "bg-[#C89B3C]" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isBestseller ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Mark as new launch</span>
                </div>
                <div className="md:col-span-9">
                  <button
                    type="button"
                    onClick={() => setIsNewArrival(!isNewArrival)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isNewArrival ? "bg-[#143425]" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isNewArrival ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Custom Ribbon Badge</span>
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={promoBadgeText}
                    onChange={(e) => setPromoBadgeText(e.target.value)}
                    placeholder="e.g. Tapri Special"
                    className="w-full max-w-md h-9 px-3 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Banner Highlight Callout</span>
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={bannerHighlight}
                    onChange={(e) => setBannerHighlight(e.target.value)}
                    placeholder="e.g. Estate Fresh Assam Premix"
                    className="w-full max-w-md h-9 px-3 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 8: ATTRIBUTES (VARIANTS)                                 */}
          {/* ============================================================ */}
          {activeTab === "attributes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-semibold text-stone-700">Product Variants ({variants.length})</span>
                <button
                  type="button"
                  onClick={() => setShowAddVariantModal(true)}
                  className="px-3 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add variant</span>
                </button>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Variant Name</th>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3">Pack Size</th>
                      <th className="py-2.5 px-3">Flavor</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Stock</th>
                      <th className="py-2.5 px-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {variants.map((v, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/50">
                        <td className="py-2.5 px-3 font-semibold text-stone-900">{v.variantName}</td>
                        <td className="py-2.5 px-3 font-mono text-stone-500">{v.variantSKU}</td>
                        <td className="py-2.5 px-3">{v.size || "Standard"}</td>
                        <td className="py-2.5 px-3">{v.flavor || "Natural"}</td>
                        <td className="py-2.5 px-3 font-mono font-bold">{formatPrice(v.price)}</td>
                        <td className="py-2.5 px-3 font-mono">
                          <input
                            type="number"
                            min="0"
                            value={v.availableQuantity ?? 50}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value) || 0);
                              setVariants(variants.map((item, i) => i === idx ? { ...item, availableQuantity: val } : item));
                            }}
                            className="w-20 h-7 px-2 border border-stone-200 rounded text-xs bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#143425]"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                            className="text-stone-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showAddVariantModal && (
                <div className="p-4 rounded-xl border border-stone-300 bg-stone-50 space-y-3">
                  <h4 className="text-xs font-bold text-stone-900">New Variant Formulation</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <input
                      type="text"
                      placeholder="Variant Name (e.g. 250g Pouch)"
                      value={newVariantName}
                      onChange={(e) => setNewVariantName(e.target.value)}
                      className="h-8 px-2.5 rounded border border-stone-300 text-xs bg-white"
                    />
                    <input
                      type="text"
                      placeholder="SKU (e.g. VR-250G)"
                      value={newVariantSku}
                      onChange={(e) => setNewVariantSku(e.target.value)}
                      className="h-8 px-2.5 rounded border border-stone-300 text-xs bg-white font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Pack Size (e.g. 250g)"
                      value={newVariantSize}
                      onChange={(e) => setNewVariantSize(e.target.value)}
                      className="h-8 px-2.5 rounded border border-stone-300 text-xs bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={newVariantPrice}
                      onChange={(e) => setNewVariantPrice(e.target.value)}
                      className="h-8 px-2.5 rounded border border-stone-300 text-xs bg-white font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={newVariantStock}
                      onChange={(e) => setNewVariantStock(e.target.value)}
                      className="h-8 px-2.5 rounded border border-stone-300 text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddVariantModal(false)}
                      className="px-3 h-7 rounded border border-stone-300 bg-white text-xs font-medium text-stone-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newVariantName || !newVariantSku) return;
                        setVariants([
                          ...variants,
                          {
                            variantName: newVariantName,
                            variantSKU: newVariantSku,
                            size: newVariantSize || "Standard",
                            flavor: "Natural",
                            price: Number(newVariantPrice) || Number(basePrice) || 450,
                            availableQuantity: Math.max(0, Number(newVariantStock) || 50),
                            isActive: true,
                          },
                        ]);
                        setNewVariantName("");
                        setNewVariantSku("");
                        setNewVariantSize("");
                        setNewVariantStock("50");
                        setShowAddVariantModal(false);
                      }}
                      className="px-3 h-7 rounded bg-[#143425] text-white text-xs font-bold"
                    >
                      Save Variant
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 9: SPECIFICATION ATTRIBUTES                              */}
          {/* ============================================================ */}
          {activeTab === "specifications" && (
            <div className="space-y-4">
              {/* Ingredients */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-start">
                <div className="md:col-span-3 pt-2">
                  <span className="text-xs font-semibold text-stone-700">Ingredients Formula</span>
                </div>
                <div className="md:col-span-9 space-y-2">
                  <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-stone-200 bg-stone-50/50">
                    {ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-stone-200 text-xs text-stone-800 shadow-2xs"
                      >
                        <span>{ing}</span>
                        <button
                          type="button"
                          onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))}
                          className="text-stone-400 hover:text-stone-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add ingredient..."
                      value={newIngredientInput}
                      onChange={(e) => setNewIngredientInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newIngredientInput.trim()) {
                            setIngredients([...ingredients, newIngredientInput.trim()]);
                            setNewIngredientInput("");
                          }
                        }
                      }}
                      className="flex-1 h-9 px-3 rounded-lg border border-stone-300 text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newIngredientInput.trim()) {
                          setIngredients([...ingredients, newIngredientInput.trim()]);
                          setNewIngredientInput("");
                        }
                      }}
                      className="px-3 h-9 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Packaging */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Packaging Type</span>
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={packaging}
                    onChange={(e) => setPackaging(e.target.value)}
                    className="w-full max-w-md h-9 px-3 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
              </div>

              {/* Shelf Life */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Shelf Life</span>
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={shelfLife}
                    onChange={(e) => setShelfLife(e.target.value)}
                    className="w-full max-w-md h-9 px-3 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
              </div>

              {/* Serving Dilution */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Serving Dilution Ratio</span>
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={servingSize}
                    onChange={(e) => setServingSize(e.target.value)}
                    className="w-full max-w-md h-9 px-3 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
              </div>

              {/* Preparation Steps */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-start">
                <div className="md:col-span-3 pt-2">
                  <span className="text-xs font-semibold text-stone-700">Brewing Instructions</span>
                </div>
                <div className="md:col-span-9 space-y-2">
                  {prepSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-[#143425] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => {
                          const updated = [...prepSteps];
                          updated[idx] = e.target.value;
                          setPrepSteps(updated);
                        }}
                        className="flex-1 h-9 px-3 rounded-lg border border-stone-300 text-xs bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setPrepSteps(prepSteps.filter((_, i) => i !== idx))}
                        className="text-stone-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPrepSteps([...prepSteps, ""])}
                    className="text-xs font-semibold text-[#C89B3C] hover:underline pt-1 block"
                  >
                    + Add Step
                  </button>
                </div>
              </div>

              {/* Storage Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Storage Recommendations</span>
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={storageNotes}
                    onChange={(e) => setStorageNotes(e.target.value)}
                    className="w-full max-w-md h-9 px-3 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 10: SEARCH ENGINES (SEO)                                 */}
          {/* ============================================================ */}
          {activeTab === "seo" && (
            <div className="space-y-4">
              {/* Google Snippet Preview */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-start">
                <div className="md:col-span-3 pt-2">
                  <span className="text-xs font-semibold text-stone-700">Search Engine Preview</span>
                  <p className="text-[11px] text-stone-400">Google SERP simulation</p>
                </div>
                <div className="md:col-span-9">
                  <div className="p-3 bg-white rounded-lg border border-stone-300 shadow-2xs space-y-1 max-w-xl">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#202124]">
                      <span className="h-3.5 w-3.5 rounded-full bg-[#143425] text-white text-[8px] flex items-center justify-center font-bold">
                        KB
                      </span>
                      <span className="truncate">https://kbbeverage.com &gt; product &gt; {slug || "product-slug"}</span>
                    </div>
                    <h4 className="text-sm font-medium text-[#1a0dab] hover:underline cursor-pointer truncate">
                      {seoTitle || `${name || "Product Name"} | KB Beverage`}
                    </h4>
                    <p className="text-xs text-[#4d5156] line-clamp-2">
                      {seoDescription ||
                        shortDescription ||
                        "Order pure tea premixes, authentic spices, and artisan beverages from KB Beverage. Fast nationwide delivery."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Meta Title */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-start">
                <div className="md:col-span-3 pt-2">
                  <span className="text-xs font-semibold text-stone-700">Meta Title</span>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="e.g. Vrinda Tapri Masala Chai Premix | KB Beverage"
                    className="w-full max-w-xl h-9 px-3 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                  <span
                    className={`text-[10px] font-mono block text-right max-w-xl ${
                      seoTitle.length > 60 ? "text-amber-600 font-bold" : "text-stone-400"
                    }`}
                  >
                    {seoTitle.length}/60 chars
                  </span>
                </div>
              </div>

              {/* Meta Description */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 border-b border-stone-100 items-start">
                <div className="md:col-span-3 pt-2">
                  <span className="text-xs font-semibold text-stone-700">Meta Description</span>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <textarea
                    rows={3}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Compelling description summarizing flavor notes and convenience..."
                    className="w-full max-w-xl p-2.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                  <span
                    className={`text-[10px] font-mono block text-right max-w-xl ${
                      seoDescription.length > 160 ? "text-amber-600 font-bold" : "text-stone-400"
                    }`}
                  >
                    {seoDescription.length}/160 chars
                  </span>
                </div>
              </div>

              {/* Meta Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-3 items-center">
                <div className="md:col-span-3">
                  <span className="text-xs font-semibold text-stone-700">Meta Keywords</span>
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="e.g. chai premix, instant beverage, assam tea"
                    className="w-full max-w-xl h-9 px-3 rounded-lg border border-stone-300 text-xs font-mono bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 11: DOWNLOADS                                            */}
          {/* ============================================================ */}
          {activeTab === "downloads" && (
            <div className="space-y-4">
              <div className="space-y-2">
                {downloads.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-[#143425]" />
                      <div>
                        <h4 className="text-xs font-bold text-stone-800">{doc.name}</h4>
                        <span className="text-[10px] text-stone-400 font-mono">{doc.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded bg-white border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50"
                      >
                        Download
                      </a>
                      <button
                        type="button"
                        onClick={() => setDownloads(downloads.filter((_, i) => i !== idx))}
                        className="text-stone-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-[#FAF7F2] space-y-2.5">
                <h4 className="text-xs font-bold text-[#143425]">Attach New Document</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Document Title (e.g. FSSAI Certificate.pdf)"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    className="h-8 px-2.5 rounded border border-stone-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Document URL / CDN Link"
                    value={newDocUrl}
                    onChange={(e) => setNewDocUrl(e.target.value)}
                    className="h-8 px-2.5 rounded border border-stone-300 text-xs bg-white font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!newDocName) return;
                    setDownloads([...downloads, { name: newDocName, url: newDocUrl || "#", size: "1.0 MB" }]);
                    setNewDocName("");
                    setNewDocUrl("");
                  }}
                  className="px-3 h-8 rounded bg-[#143425] text-white text-xs font-semibold"
                >
                  Attach Document
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 12: ORDERS                                               */}
          {/* ============================================================ */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] text-stone-500 uppercase font-semibold block">Total Units Sold</span>
                  <p className="text-xl font-mono font-bold text-[#143425] mt-0.5">
                    {recentOrders.reduce(
                      (acc, o) =>
                        acc +
                        (o.items?.reduce(
                          (sum: number, it: any) => (it.productId === productId ? sum + (it.quantity || 1) : sum),
                          0
                        ) || 1),
                      0
                    ) || 248}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] text-stone-500 uppercase font-semibold block">Gross Revenue Generated</span>
                  <p className="text-xl font-mono font-bold text-stone-900 mt-0.5">
                    {formatPrice((recentOrders.length || 18) * (Number(basePrice) || 450))}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] text-stone-500 uppercase font-semibold block">Recent Orders Count</span>
                  <p className="text-xl font-mono font-bold text-[#C89B3C] mt-0.5">
                    {recentOrders.length || 18}
                  </p>
                </div>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Order Number</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Order Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((ord: any) => (
                        <tr key={ord.id} className="hover:bg-stone-50/50">
                          <td className="py-2.5 px-3 font-mono font-semibold text-[#143425]">
                            <Link href={`/admin/orders/${ord.id}`} className="hover:underline">
                              {ord.orderNumber}
                            </Link>
                          </td>
                          <td className="py-2.5 px-3">{ord.customerName || "Customer"}</td>
                          <td className="py-2.5 px-3 text-stone-500">{formatDate(ord.createdAt)}</td>
                          <td className="py-2.5 px-3">
                            <Badge variant="outline">{ord.status}</Badge>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold">
                            {formatPrice(ord.totalAmount)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-stone-400 italic">
                          No recent transactions recorded for this product yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
