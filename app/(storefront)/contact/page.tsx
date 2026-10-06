"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2, Send, Building2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [inquiryType, setInquiryType] = useState<"general" | "wholesale" | "corporate">("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#A87E28]">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-normal text-[#143425] tracking-tight">
          We&apos;d Love to Hear From You
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Whether you have a question about our premix recipes, bulk wholesale requirements, or retail distribution opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info & Headquarters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
            <h2 className="font-serif text-xl font-bold text-[#143425] pb-3 border-b border-stone-100">
              Corporate Office & Care
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-stone-600">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#C89B3C] shrink-0 mt-0.5" />
                <div>
                  {/* <p className="font-bold text-stone-900">Headquarters & Manufacturing</p> */}
                  <p className="mt-0.5 leading-relaxed">
                    202,Sai Pancham Flat,
                    Gajanand Society.
                    B/S - Riddhi Avenue Appartment,
                    Near Arihant Super Market,
                    Manjalpur Naka, Manjalpur,
                    Vadodara- 390011
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#C89B3C] shrink-0" />
                <div>
                  <p className="font-mono mt-0.5">+91 96240 91000</p>
                  <p className="font-mono mt-0.5">+91 85111 16618 </p>

                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#E8F2EC]/60 rounded-3xl border border-[#1C4834]/20 p-6 space-y-2">
            <div className="flex items-center gap-2 text-[#143425] font-serif font-bold text-base">
              <Building2 className="h-5 w-5 text-[#A87E28]" />
              <h3>B2B & Institutional Supply</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              We supply automated premix vending machines and 1kg bulk foil packaging to corporate offices, university cafeterias, hotels, and airport lounges across India.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-2xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#143425]">
                Inquiry Received
              </h2>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Thank you for reaching out to KB Beverage. Our customer support or distribution team will contact you within 24 business hours.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSubmitted(false);
                  setMessage("");
                }}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Inquiry Type Toggle */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                  Inquiry Purpose
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "general", label: "Customer Care" },
                    { id: "wholesale", label: "Wholesale & B2B" },
                    { id: "corporate", label: "Corporate Gifts" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setInquiryType(t.id as any)}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${inquiryType === t.id
                        ? "border-[#143425] bg-[#143425] text-white shadow-2xs"
                        : "border-stone-200 bg-stone-50 hover:bg-white text-stone-700"
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#143425]/20 focus:border-[#143425]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#143425]/20 focus:border-[#143425]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full h-11 px-3.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#143425]/20 focus:border-[#143425]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                  Message Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you with our beverage portfolio?"
                  className="w-full p-3.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#143425]/20 focus:border-[#143425]"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full gap-2 shadow-sm font-semibold"
              >
                <span>Send Message</span>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
