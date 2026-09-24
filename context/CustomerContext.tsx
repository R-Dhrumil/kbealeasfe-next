"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Order, OrderItem, ShippingAddress, PaymentMethod } from "@/types/order";
import { ORDERS as SEED_ORDERS } from "@/data/orders";

export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  memberTier: string;
  joinedDate: string;
  addresses: CustomerAddress[];
}

export interface PlaceOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
}

interface CustomerContextType {
  customer: CustomerProfile | null;
  isLoggedIn: boolean;
  isLoaded: boolean;
  orders: Order[];
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: { fullName: string; email: string; phone: string; password?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: { fullName: string; email: string; phone: string }) => void;
  addAddress: (address: Omit<CustomerAddress, "id">) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  placeOrder: (input: PlaceOrderInput) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

const CUSTOMER_STORAGE_KEY = "kb_customer_profile";
const ORDERS_STORAGE_KEY = "kb_customer_orders";
const AUTH_STATE_KEY = "kb_customer_is_logged_in";

const DEFAULT_DEMO_CUSTOMER: CustomerProfile = {
  id: "cust-demo-1",
  fullName: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  phone: "+91 98201 44521",
  memberTier: "KB Connoisseur Member",
  joinedDate: "March 2026",
  addresses: [
    {
      id: "addr-1",
      fullName: "Aarav Sharma",
      phone: "+91 98201 44521",
      addressLine1: "Flat 402, Nilgiri Heights, Baner Road",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411045",
      isDefault: true,
    },
    {
      id: "addr-2",
      fullName: "Aarav Sharma (Office)",
      phone: "+91 98201 44521",
      addressLine1: "Tech Park 4, Hinjewadi Phase 1",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411057",
      isDefault: false,
    },
  ],
};

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STATE_KEY);
      const savedCustomer = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);

      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
        }
      }

      if (savedCustomer) {
        setCustomer(JSON.parse(savedCustomer));
        setIsLoggedIn(savedAuth === "true");
      } else {
        // Pre-initialize demo account so the user can test account features right away
        setCustomer(DEFAULT_DEMO_CUSTOMER);
        setIsLoggedIn(true);
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_CUSTOMER));
        localStorage.setItem(AUTH_STATE_KEY, "true");
      }
    } catch {
      // fallback
      setCustomer(DEFAULT_DEMO_CUSTOMER);
      setIsLoggedIn(true);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync customer profile
  const syncCustomer = (updated: CustomerProfile | null, auth: boolean) => {
    setCustomer(updated);
    setIsLoggedIn(auth);
    if (updated) {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(AUTH_STATE_KEY, auth ? "true" : "false");
    } else {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      localStorage.setItem(AUTH_STATE_KEY, "false");
    }
  };

  // Sync orders
  const syncOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
    } catch {
      // ignore
    }
  };

  const login = async (email: string, _password?: string): Promise<boolean> => {
    const trimmed = email.trim().toLowerCase();
    let profile = customer;
    if (!profile || profile.email.toLowerCase() !== trimmed) {
      profile = {
        id: `cust-${Date.now()}`,
        fullName: trimmed.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email: trimmed,
        phone: "+91 98200 00000",
        memberTier: "KB Member",
        joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        addresses: [],
      };
    }
    syncCustomer(profile, true);
    return true;
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<boolean> => {
    const newProfile: CustomerProfile = {
      id: `cust-${Date.now()}`,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      memberTier: "KB Member",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      addresses: [],
    };
    syncCustomer(newProfile, true);
    return true;
  };

  const logout = () => {
    syncCustomer(customer, false);
  };

  const updateProfile = (data: { fullName: string; email: string; phone: string }) => {
    if (!customer) return;
    const updated: CustomerProfile = {
      ...customer,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
    };
    syncCustomer(updated, true);
  };

  const addAddress = (address: Omit<CustomerAddress, "id">) => {
    if (!customer) return;
    const newAddr: CustomerAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    let updatedAddrs = [...customer.addresses];
    if (newAddr.isDefault) {
      updatedAddrs = updatedAddrs.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddrs.push(newAddr);
    syncCustomer({ ...customer, addresses: updatedAddrs }, true);
  };

  const deleteAddress = (id: string) => {
    if (!customer) return;
    const updatedAddrs = customer.addresses.filter((a) => a.id !== id);
    syncCustomer({ ...customer, addresses: updatedAddrs }, true);
  };

  const setDefaultAddress = (id: string) => {
    if (!customer) return;
    const updatedAddrs = customer.addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    syncCustomer({ ...customer, addresses: updatedAddrs }, true);
  };

  const placeOrder = async (input: PlaceOrderInput): Promise<Order> => {
    const orderTimestamp = new Date().toISOString();
    const orderRandomNumber = Math.floor(1000 + Math.random() * 9000);
    const newOrderNumber = `KB-${orderRandomNumber}`;
    const newOrderId = `ord-${Date.now()}`;

    const newOrder: Order = {
      id: newOrderId,
      orderNumber: newOrderNumber,
      customerName: input.customerName || (customer ? customer.fullName : "Customer"),
      customerEmail: input.customerEmail || (customer ? customer.email : "customer@example.com"),
      customerPhone: input.customerPhone || (customer ? customer.phone : ""),
      createdAt: orderTimestamp,
      status: "Confirmed",
      paymentStatus: input.paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      paymentMethod: input.paymentMethod,
      shippingAddress: {
        fullName: input.shippingAddress.fullName,
        email: input.customerEmail,
        phone: input.shippingAddress.phone,
        addressLine1: input.shippingAddress.addressLine1,
        city: input.shippingAddress.city,
        state: input.shippingAddress.state,
        postalCode: input.shippingAddress.postalCode,
        country: "India",
      },
      items: input.items,
      subtotal: input.subtotal,
      shippingFee: input.shippingFee,
      discount: input.discount,
      tax: input.tax,
      total: input.total,
      trackingNumber: `BLR-${Math.floor(100000 + Math.random() * 900000)}`,
      carrier: "BlueDart Express",
      notes: "Aroma-locked protective container",
    };

    const nextOrders = [newOrder, ...orders];
    syncOrders(nextOrders);

    // If customer has no default address, save this address
    if (customer && customer.addresses.length === 0) {
      addAddress({
        fullName: input.shippingAddress.fullName,
        phone: input.shippingAddress.phone,
        addressLine1: input.shippingAddress.addressLine1,
        city: input.shippingAddress.city,
        state: input.shippingAddress.state,
        postalCode: input.shippingAddress.postalCode,
        isDefault: true,
      });
    }

    return newOrder;
  };

  const getOrderById = (id: string): Order | undefined => {
    const cleanId = id.trim().toLowerCase();
    return orders.find(
      (o) =>
        o.id.toLowerCase() === cleanId ||
        o.orderNumber.toLowerCase() === cleanId ||
        o.orderNumber.toLowerCase() === `#${cleanId}`
    );
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        isLoggedIn,
        isLoaded,
        orders,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        placeOrder,
        getOrderById,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
}
