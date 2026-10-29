import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import { getBrands } from "@/service/brands";
import { getNavigationTree } from "@/service/cms";

export async function Footer() {
  const [displayBrands, quickLinks, legalLinks] = await Promise.all([
    getBrands().catch(() => []),
    getNavigationTree("FooterQuickLinks").catch(() => []),
    getNavigationTree("FooterLegal").catch(() => []),
  ]);

  const defaultQuickLinks = [
    { label: "About Heritage", url: "/about" },
    { label: "Track Your Order", url: "/account/orders" },
    { label: "Saved Wishlist", url: "/wishlist" },
    { label: "Customer Account", url: "/account" },
  ];

  const defaultLegalLinks = [
    { label: "Privacy Policy", url: "/privacy-policy" },
    { label: "Terms of Service", url: "/terms-of-service" },
    { label: "Shipping & Delivery", url: "/shipping-policy" },
    { label: "Returns & Refunds", url: "/returns-policy" },
  ];

  const renderedQuickLinks = quickLinks && quickLinks.length > 0 ? quickLinks : defaultQuickLinks;
  const renderedLegalLinks = legalLinks && legalLinks.length > 0 ? legalLinks : defaultLegalLinks;

  return (
    <footer className="bg-[#143425] text-[#F9F6F0] pt-16 pb-12 border-t border-[#1C4834]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-stone-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative h-12 w-16 overflow-hidden rounded-xl bg-white p-1 border border-white/20 shadow-xs">
                <Image
                  src="/kbealeas_logo.jpeg"
                  alt="KB Beverage - Pure Taste, Every Time"
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-white block leading-none">
                  KB BEVERAGE
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#C89B3C] font-semibold block mt-1">
                  Pure Taste, Every Time.
                </span>
              </div>
            </Link>

            <p className="text-stone-300 text-sm max-w-sm leading-relaxed">
              Crafting authentic Indian tea premixes, invigorating iced teas, and artisan roasted beverages with unyielding dedication to purity, hygiene, and natural origin.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#C89B3C]">
              <Sparkles className="h-4 w-4" />
              <span>Certified Processing • Vacuum Aroma Retention</span>
            </div>
          </div>

          {/* Brands Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C89B3C] mb-4">
              Our Brands
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-300">
              {displayBrands.map((brand) => (
                <li key={brand.id}>
                  <Link href={`/brands/${brand.slug || brand.id}`} className="hover:text-white transition-colors">
                    {brand.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop"
                  className="text-[#C89B3C] hover:underline inline-flex items-center gap-1 text-xs font-medium pt-1"
                >
                  View All Products <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C89B3C] mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-300">
              {renderedQuickLinks.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    target={"openInNewTab" in link && link.openInNewTab ? "_blank" : undefined}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate & Support Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C89B3C] mb-4">
              Contact & Inquiries
            </h3>
            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#C89B3C] shrink-0 mt-0.5" />
                <span>202,Sai Pancham Flat,
                  Gajanand Society.
                  B/S - Riddhi Avenue Appartment,
                  Near Arihant Super Market,
                  Manjalpur Naka, Manjalpur,
                  Vadodara- 390011</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#C89B3C] shrink-0" />
                <div className="flex flex-col">
                  <span>+91 96240 91000</span>
                  <span>+91 85111 16618</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-block text-xs font-semibold bg-[#1C4834] text-white px-3 py-1.5 rounded-lg hover:bg-[#255D43] transition-colors border border-stone-700"
                >
                  B2B Distribution Inquiries
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Dynamic Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} KB Beverage Operations. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {renderedLegalLinks.map((legal) => (
              <Link
                key={legal.url}
                href={legal.url}
                target={"openInNewTab" in legal && legal.openInNewTab ? "_blank" : undefined}
                className="hover:text-stone-200 transition-colors"
              >
                {legal.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
