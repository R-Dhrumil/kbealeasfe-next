"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Award,
  ShoppingCart,
  Users,
  Warehouse,
  FileText,
  TicketPercent,
  MessageSquare,
  BarChart3,
  Settings,
  Store,
  ChevronDown,
  Mail,
  MailCheck,
  Compass,
  Globe,
  MessageSquareQuote,
  Files,
  HardDrive
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    group: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    group: "Catalog Management",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Four Brands", icon: FolderTree },
    ],
  },
  {
    group: "Operations & Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/inventory", label: "Inventory & Stock", icon: Warehouse },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    group: "Marketing & CMS",
    items: [
      { href: "/admin/content", label: "Homepage CMS", icon: FileText },
      { href: "/admin/content/pages", label: "Custom Pages", icon: Files },
      { href: "/admin/navigation", label: "Navigation Menus", icon: Compass },
      { href: "/admin/content/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/content/message-templates", label: "Message Templates", icon: MailCheck },
      { href: "/admin/coupons", label: "Coupons & Discounts", icon: TicketPercent },
      { href: "/admin/reviews", label: "Review Moderation", icon: MessageSquare },
    ],
  },
  {
    group: "System & Insights",
    items: [
      { href: "/admin/reports", label: "Sales Reports", icon: BarChart3 },
      { href: "/admin/settings", label: "Store Settings", icon: Settings },
      { href: "/admin/settings/storage", label: "Media & Storage", icon: HardDrive },
      { href: "/admin/settings/seo", label: "Global SEO", icon: Globe },
      { href: "/admin/settings/email-accounts", label: "Email Accounts", icon: Mail },
    ],
  },
];

export function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#143425] text-white flex flex-col border-r border-[#1C4834] transition-transform duration-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#1C4834]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#C89B3C] text-[#143425] font-serif font-bold text-base flex items-center justify-center">
              KB
            </div>
            <div>
              <span className="font-serif font-bold text-sm tracking-wide text-white block">
                KB ADMIN
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#C89B3C] block font-mono">
                OPERATIONS UI
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_ITEMS.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[#A87E28]">
                {section.group}
              </p>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <NextLink
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors select-none",
                        isActive
                          ? "bg-[#1C4834] text-white font-semibold"
                          : "text-stone-300 hover:text-white hover:bg-[#1C4834]/50"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", isActive ? "text-[#C89B3C]" : "text-stone-400")} />
                      <span>{item.label}</span>
                    </NextLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Exit to Storefront button */}
        <div className="p-3 border-t border-[#1C4834]">
          <NextLink
            href="/"
            className="flex items-center justify-center gap-2 h-10 w-full rounded-lg bg-[#1C4834] hover:bg-[#255D43] text-stone-200 hover:text-white text-xs font-semibold transition-colors"
          >
            <Store className="h-4 w-4 text-[#C89B3C]" />
            <span>Return to Storefront</span>
          </NextLink>
        </div>
      </aside>
    </>
  );
}
