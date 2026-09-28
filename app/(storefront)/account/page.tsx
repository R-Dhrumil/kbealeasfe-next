"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  Settings,
  ArrowRight,
  ShieldCheck,
  Plus,
  Trash2,
  Check,
  LogOut,
  Edit2,
  Mail,
  Phone,
  Heart,
} from "lucide-react";
import { useCustomer, CustomerAddress } from "@/context/CustomerContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AccountPage() {
  const {
    customer,
    isLoggedIn,
    isLoaded,
    orders,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
  } = useCustomer();
  const { wishlistCount } = useWishlist();

  // Profile Edit modal/state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Add Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddressLine, setNewAddressLine] = useState("");
  const [newCity, setNewCity] = useState("Pune");
  const [newState, setNewState] = useState("Maharashtra");
  const [newPostalCode, setNewPostalCode] = useState("411045");
  const [newIsDefault, setNewIsDefault] = useState(false);

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-xs text-stone-400">
        Loading customer account profile...
      </div>
    );
  }

  // Not logged in state
  if (!isLoggedIn || !customer) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="h-16 w-16 mx-auto rounded-full bg-[#E8F2EC] flex items-center justify-center text-[#143425]">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#143425]">
            Customer Account Portal
          </h1>
          <p className="text-xs text-stone-500 mt-2 max-w-md mx-auto">
            Sign in to track beverage consignments, view order history, reorder premixes, and manage delivery addresses.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/account/login">
            <Button variant="primary" size="lg" className="gap-2">
              <span>Sign In / Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" size="lg">
              Explore Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Initials for avatar
  const initials = customer.fullName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "KB";

  const recentOrders = orders.slice(0, 3);
  const primaryAddress = customer.addresses.find((a) => a.isDefault) || customer.addresses[0];

  const handleStartEditProfile = () => {
    setEditName(customer.fullName);
    setEditPhone(customer.phone);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateProfile({
      fullName: editName,
      email: customer.email,
      phone: editPhone,
    });
    setIsEditingProfile(false);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLine.trim() || !newPostalCode.trim() || !newFullName.trim()) return;

    addAddress({
      fullName: newFullName,
      phone: newPhone || customer.phone,
      addressLine1: newAddressLine,
      city: newCity,
      state: newState,
      postalCode: newPostalCode,
      isDefault: newIsDefault || customer.addresses.length === 0,
    });

    setIsAddingAddress(false);
    setNewFullName("");
    setNewAddressLine("");
    setNewPostalCode("411045");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
      {/* Account Overview Header */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-[#143425] text-white font-serif font-bold text-2xl flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-2xl font-bold text-[#143425]">
                {customer.fullName}
              </h1>
              <Badge variant="gold">{customer.memberTier}</Badge>
            </div>
            <p className="text-xs text-stone-500">
              {customer.email} • {customer.phone}
            </p>
            <p className="text-[11px] text-stone-400">
              Member since {customer.joinedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleStartEditProfile}
            className="h-9 px-3.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="h-3.5 w-3.5 text-stone-500" />
            <span>Edit Profile</span>
          </button>

          <Link
            href="/account/orders"
            className="h-9 px-3.5 rounded-xl border border-stone-300 text-xs font-semibold text-[#143425] hover:bg-[#E8F2EC]/60 transition-colors flex items-center gap-1.5"
          >
            <Package className="h-4 w-4" />
            <span>Orders ({orders.length})</span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="h-9 px-3.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal / Drawer */}
      {isEditingProfile && (
        <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <h3 className="font-serif text-base font-bold text-[#143425]">
              Update Personal Details
            </h3>
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="text-xs text-stone-500 hover:text-stone-900"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#143425]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#143425]"
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-2 pt-2">
              <Button type="submit" variant="primary" size="sm">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditingProfile(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/account/orders"
          className="group p-6 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-400 transition-all hover:shadow-xs space-y-3"
        >
          <div className="h-10 w-10 rounded-xl bg-[#E8F2EC] text-[#143425] flex items-center justify-center">
            <Package className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#143425]">
              My Orders
            </h3>
            <span className="font-mono text-xs font-bold text-[#A87E28]">
              {orders.length} orders
            </span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Track active consignments, review delivery status, and reorder previous tea premixes.
          </p>
        </Link>

        <div className="p-6 rounded-2xl bg-white border border-stone-200/80 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-[#F2ECE1] text-[#6E4D38] flex items-center justify-center">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Primary Address
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {primaryAddress
              ? `${primaryAddress.addressLine1}, ${primaryAddress.city}, ${primaryAddress.state} - ${primaryAddress.postalCode}`
              : "No saved address yet. Add one below for faster checkout."}
          </p>
        </div>

        <Link
          href="/wishlist"
          className="p-6 rounded-2xl bg-white border border-stone-200/80 space-y-3 hover:border-[#C89B3C]/50 transition-colors group block"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#FBF5E8] text-[#A87E28] flex items-center justify-center">
              <Heart className="h-5 w-5" />
            </div>
            {wishlistCount > 0 && (
              <span className="h-6 px-2 bg-[#C89B3C] text-stone-950 font-bold text-[11px] rounded-full flex items-center justify-center">
                {wishlistCount} saved
              </span>
            )}
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#143425] transition-colors">
            Wishlist
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {wishlistCount > 0
              ? `You have ${wishlistCount} item${wishlistCount > 1 ? "s" : ""} saved. Tap to view your wishlist.`
              : "Save your favourite products here for easy access later."}
          </p>
        </Link>
      </div>

      {/* Saved Delivery Addresses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#143425]">
              Saved Delivery Addresses
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage your destinations for residential and commercial wholesale deliveries.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingAddress(!isAddingAddress)}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Address</span>
          </Button>
        </div>

        {/* Add Address Form */}
        {isAddingAddress && (
          <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 space-y-4">
            <h3 className="font-serif text-sm font-bold text-[#143425]">
              Add New Shipping Destination
            </h3>
            <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  required
                  placeholder={customer.fullName}
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#143425]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder={customer.phone}
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#143425]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Address Line (House/Flat, Street, Area)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plot 12, Senapati Bapat Marg"
                  value={newAddressLine}
                  onChange={(e) => setNewAddressLine(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#143425]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#143425]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#143425]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={newPostalCode}
                  onChange={(e) => setNewPostalCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#143425]"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="defaultAddressCheck"
                  checked={newIsDefault}
                  onChange={(e) => setNewIsDefault(e.target.checked)}
                  className="h-4 w-4 rounded text-[#143425] focus:ring-[#143425]"
                />
                <label htmlFor="defaultAddressCheck" className="text-xs font-semibold text-stone-700">
                  Set as default shipping address
                </label>
              </div>

              <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                <Button type="submit" variant="primary" size="sm">
                  Save Address
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingAddress(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {customer.addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 rounded-2xl border transition-all ${
                addr.isDefault
                  ? "bg-[#E8F2EC]/40 border-[#143425]/30 shadow-2xs"
                  : "bg-white border-stone-200/80"
              } space-y-3`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-[#143425]">
                    {addr.fullName}
                  </span>
                  {addr.isDefault && (
                    <Badge variant="brand" className="text-[10px]">
                      Default
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-[11px] font-semibold text-[#143425] hover:underline"
                    >
                      Make Default
                    </button>
                  )}
                  {customer.addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Delete address"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {addr.addressLine1}, {addr.city}, {addr.state} - {addr.postalCode}
              </p>
              <p className="text-[11px] text-stone-400">
                Phone: {addr.phone}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#143425]">
              Recent Orders
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Live tracking for recent tea premix dispatches.
            </p>
          </div>
          <Link
            href="/account/orders"
            className="text-xs font-semibold text-[#143425] hover:text-[#C89B3C] flex items-center gap-1"
          >
            <span>View All ({orders.length})</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-stone-200/80 text-center space-y-3">
            <Package className="h-10 w-10 text-stone-300 mx-auto" />
            <h4 className="font-serif text-base font-bold text-stone-900">
              No orders yet
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Your order history will appear here once you purchase tea premixes or beverages.
            </p>
            <Link href="/shop">
              <Button variant="primary" size="sm">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden divide-y divide-stone-100 shadow-2xs">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#143425]">
                      {order.orderNumber}
                    </span>
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "success"
                          : order.status === "Confirmed"
                          ? "brand"
                          : "default"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-500">
                    Placed on {formatDate(order.createdAt)} • {order.items.length} items • Tracking: {order.trackingNumber || "Pending"}
                  </p>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  <span className="font-mono font-bold text-sm sm:text-base text-stone-900">
                    {formatPrice(order.total)}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-xs font-semibold text-[#143425] hover:text-[#C89B3C] flex items-center gap-1"
                  >
                    <span>Track & Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
