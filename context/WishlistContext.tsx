"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "kb_beverage_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setWishlistIds(JSON.parse(saved));
        }

        // Try to fetch from server if logged in
        if (localStorage.getItem("kb_auth_token")) {
          const { fetchApi } = await import("@/lib/api");
          const serverWishlist = await fetchApi("/wishlist");
          if (Array.isArray(serverWishlist)) {
            const ids = serverWishlist.map((p: any) => p.id);
            setWishlistIds(ids);
          }
        }
      } catch {
        // ignore
      } finally {
        setIsInitialized(true);
      }
    }
    loadWishlist();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds, isInitialized]);

  const toggleWishlist = async (productId: string) => {
    const isAdding = !wishlistIds.includes(productId);
    
    setWishlistIds((prev) =>
      isAdding
        ? [...prev, productId]
        : prev.filter((id) => id !== productId)
    );

    try {
      if (localStorage.getItem("kb_auth_token")) {
        const { fetchApi } = await import("@/lib/api");
        if (isAdding) {
          await fetchApi(`/wishlist/${productId}`, { method: "POST" });
        } else {
          await fetchApi(`/wishlist/${productId}`, { method: "DELETE" });
        }
      }
    } catch {
      // ignore
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
