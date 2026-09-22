"use client";

import React from "react";
import { Menu, Bell, Search, UserCheck } from "lucide-react";

export function AdminTopbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden sm:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search orders, SKUs, customers..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-stone-200 bg-stone-50 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#143425]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Catalog Live (Mock Mode)</span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-amber-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-stone-200">
          <div className="h-8 w-8 rounded-lg bg-[#143425] text-white flex items-center justify-center font-bold text-xs">
            OP
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-stone-900 leading-none">
              Operations Lead
            </p>
            <p className="text-[10px] text-stone-400 font-mono mt-0.5">
              admin@kbbeverage.com
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
