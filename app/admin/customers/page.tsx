"use client";

import React, { useState } from "react";
import { CUSTOMERS } from "@/data/customers";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { Search, UserCheck } from "lucide-react";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const filteredCustomers = CUSTOMERS.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#143425]">
            Customer Directory
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Registered customer accounts, repeat order metrics, and geographic distribution.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or city..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#143425]"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50/80 border-b border-stone-200 font-serif font-bold text-stone-700">
              <tr>
                <th className="py-3.5 px-4">Customer Name & Contact</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Account Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-stone-900">{cust.fullName}</p>
                    <p className="text-[11px] text-stone-400">{cust.email} • {cust.phone}</p>
                  </td>

                  <td className="py-3.5 px-4 text-stone-600">
                    {cust.city}, {cust.state}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                    {cust.totalOrders} orders
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                    {formatPrice(cust.totalSpent)}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-stone-500">
                    {formatDate(cust.joinedDate)}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="success">{cust.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
