"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, ShieldCheck, Users, Hotel, Stethoscope, Briefcase } from "lucide-react";

interface Client {
  id: string;
  name: string;
  sector: "Hospitality & Cafes" | "Corporate & Finance" | "Healthcare & Clinics" | "Design & Studios";
  subtitle: string;
  location?: string;
  badge: string;
}

const CLIENTS_LIST: Client[] = [
  {
    id: "prakruti-resort",
    name: "Prakruti Resort",
    sector: "Hospitality & Cafes",
    subtitle: "Experience a Great Tradition in Hospitality",
    badge: "Resort & Luxury Hospitality",
  },
  {
    id: "rushee",
    name: "Ruşhee",
    sector: "Hospitality & Cafes",
    subtitle: "Artisan Dining & Cafe Solutions",
    badge: "Cafe & Fine Dining",
  },
  {
    id: "anju-corp",
    name: "Anju Corporation",
    sector: "Corporate & Finance",
    subtitle: "Commercial & Business Operations",
    badge: "Corporate Enterprise",
  },
  {
    id: "jv-finance",
    name: "JV Finance",
    sector: "Corporate & Finance",
    subtitle: "Your Growth, Our Commitment",
    badge: "Financial Advisory",
  },
  {
    id: "d-associates",
    name: "D Associates",
    sector: "Corporate & Finance",
    subtitle: "Associate with Prosperity",
    badge: "Consulting & Legal Advisory",
  },
  {
    id: "superbizzlead",
    name: "Superbizzlead Private Limited",
    sector: "Corporate & Finance",
    subtitle: "Enterprise Technology & Business Services",
    badge: "Technology & Services",
  },
  {
    id: "trinity-smiles",
    name: "Trinity Smiles",
    sector: "Healthcare & Clinics",
    subtitle: "Care • Excellence • Quality",
    badge: "Dental Specialty Care",
  },
  {
    id: "dr-aditya-shah-aura",
    name: "Dr. Aditya Shah's Aura",
    sector: "Healthcare & Clinics",
    subtitle: "Laser & Cosmetic Clinic",
    badge: "Aesthetic Healthcare",
  },
  {
    id: "the-tooth-clinic",
    name: "The Tooth Clinic",
    sector: "Healthcare & Clinics",
    subtitle: "Multispeciality Dental Clinic & Implant Centre",
    badge: "Multispeciality Healthcare",
  },
  {
    id: "sheel-design",
    name: "Sheel Design Studio",
    sector: "Design & Studios",
    subtitle: "Architect | Planner | Interior Designer",
    badge: "Architecture & Planning",
  },
  {
    id: "sapphire-studio",
    name: "Sapphire Studio",
    sector: "Design & Studios",
    subtitle: "Vinit Upadhyay Creative Media Production",
    badge: "Creative Media Studio",
  },
];

const SECTOR_TABS = [
  "All Sectors",
  "Hospitality & Cafes",
  "Corporate & Finance",
  "Healthcare & Clinics",
  "Design & Studios",
] as const;

export function ClienteleShowcase() {
  const [activeTab, setActiveTab] = useState<(typeof SECTOR_TABS)[number]>("All Sectors");

  const filteredClients =
    activeTab === "All Sectors"
      ? CLIENTS_LIST
      : CLIENTS_LIST.filter((client) => client.sector === activeTab);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 md:my-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#143425]/10 text-xs font-semibold uppercase tracking-widest text-[#143425]">
          <ShieldCheck className="h-4 w-4 text-[#A87E28]" />
          <span>Brewing Trust, Serving Excellence</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#143425] tracking-tight font-normal">
          Our Esteemed Clientele
        </h2>

        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Proudly serving leading luxury resorts, corporate enterprises, multi-specialty healthcare clinics, and premier design studios across India with authentic tea, coffee, and iced beverage premixes.
        </p>
      </div>

      {/* Trust Numbers Grid (Extracted directly from official brochure) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8DED1] text-center">
          <p className="text-2xl sm:text-3xl font-serif font-bold text-[#143425]">100+</p>
          <p className="text-xs text-stone-600 font-medium mt-1">Distribution Partners</p>
          <span className="text-[10px] text-stone-400 block mt-0.5">Across India</span>
        </div>

        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8DED1] text-center">
          <p className="text-2xl sm:text-3xl font-serif font-bold text-[#143425]">11+</p>
          <p className="text-xs text-stone-600 font-medium mt-1">Key Flagship Clients</p>
          <span className="text-[10px] text-stone-400 block mt-0.5">Corporate &amp; HoReCa</span>
        </div>

        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8DED1] text-center">
          <p className="text-2xl sm:text-3xl font-serif font-bold text-[#143425]">4 Lines</p>
          <p className="text-xs text-stone-600 font-medium mt-1">Tea, Iced Tea, Coffee, Cocoa</p>
          <span className="text-[10px] text-stone-400 block mt-0.5">Unified Collections</span>
        </div>

        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8DED1] text-center">
          <p className="text-2xl sm:text-3xl font-serif font-bold text-[#143425]">100%</p>
          <p className="text-xs text-stone-600 font-medium mt-1">Consistent Quality</p>
          <span className="text-[10px] text-stone-400 block mt-0.5">0 Chemical Preservatives</span>
        </div>
      </div>

      {/* Official Brochure Feature Banner */}
      <div className="mb-12 relative rounded-3xl overflow-hidden border border-[#E8DED1] shadow-md bg-stone-900 group">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
          <Image
            src="/assets/clients/clientele-brochure.jpg"
            alt="KB Beverage Official Clientele - Brewing Trust, Serving Excellence"
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.01]"
            priority
          />
        </div>

        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#143425] to-[#1C4834] text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
            <span className="font-medium text-stone-200">
              Verified Clientele Showcase from the official KB Beverage Corporation Business Portfolio.
            </span>
          </div>
          <span className="text-[11px] text-[#D4AF37] font-semibold uppercase tracking-wider">
            Tea • Coffee • Iced Beverages
          </span>
        </div>
      </div>

      {/* Sector Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {SECTOR_TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#143425] text-white shadow-xs"
                  : "bg-[#F7F4EE] text-stone-600 hover:text-stone-950 hover:bg-[#EAE4D7]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Interactive Client Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-[#143425]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#143425]/10 text-[#143425]">
                  {client.badge}
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" title="Active Client Partner" />
              </div>

              <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                {client.name}
              </h3>

              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {client.subtitle}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>{client.sector}</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Partner
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* B2B Partnership Callout Footer */}
      <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-[#F6F0E6] to-[#EDE4D6] border border-[#E8DED1] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A87E28]">
            Corporate &amp; Institutional Supply
          </span>
          <h3 className="text-xl sm:text-2xl font-serif text-[#143425] font-normal">
            Deliver Pure Taste to Your Guests, Patients &amp; Teams
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Partner with KB Beverage for specialized tea premixes, cold brewed iced teas, artisan coffees, and chocolate drinks with dedicated wholesale pricing.
          </p>
        </div>

        <Link
          href="/contact"
          className="h-12 px-7 rounded-xl bg-[#143425] hover:bg-[#1C4834] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-sm hover:shadow inline-flex items-center gap-2 shrink-0 group"
        >
          <span>Partner With Us</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
