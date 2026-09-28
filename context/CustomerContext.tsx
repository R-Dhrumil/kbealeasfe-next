"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Order, OrderItem, ShippingAddress, PaymentMethod } from "@/types/order";
import { ORDERS as SEED_ORDERS } from "@/data/orders";
import { fetchApi } from "@/lib/api";

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
  updateProfile: (data: { fullName: string; email: string; phone: string }) => Promise<void>;
  addAddress: (address: Omit<CustomerAddress, "id">) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  placeOrder: (input: PlaceOrderInput) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

const CUSTOMER_STORAGE_KEY = "kb_customer_profile";
const ORDERS_STORAGE_KEY = "kb_customer_orders";
const AUTH_TOKEN_KEY = "kb_auth_token";

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
    async function loadUser() {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      
      try {
        const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (savedOrders) {
          const parsed = JSON.parse(savedOrders);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed);
          }
        }

        if (token) {
          // Verify token and load user
          const meData = await fetchApi("/auth/me");
          if (meData) {
            // Can also fetch /account/profile and /account/addresses here
            try {
              const addressesData = await fetchApi("/account/addresses");
              const addresses = Array.isArray(addressesData) ? addressesData.map(a => ({
                id: a.id,
                fullName: a.recipientName,
                phone: a.phone,
                addressLine1: a.streetAddress,
                city: a.city,
                state: a.state,
                postalCode: a.postalCode,
                isDefault: a.isDefaultShipping
              })) : [];

              setCustomer({
                id: meData.id,
                fullName: meData.fullName,
                email: meData.email,
                phone: meData.phone || "+91 00000 00000",
                memberTier: meData.role === "Admin" ? "Admin" : "KB Member",
                joinedDate: new Date(meData.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                addresses: addresses
              });
              setIsLoggedIn(true);
              
              // Load Orders
              try {
                const fetchedOrders = await fetchApi("/account/orders");
                if (Array.isArray(fetchedOrders) && fetchedOrders.length > 0) {
                  setOrders(fetchedOrders);
                }
              } catch (err) {
                console.error("Error fetching orders from server", err);
              }
            } catch (err) {
              console.error("Error loading profile/addresses", err);
              // Fallback if profile fails but auth is valid
              setCustomer({
                id: meData.id,
                fullName: meData.fullName,
                email: meData.email,
                phone: meData.phone || "",
                memberTier: "KB Member",
                joinedDate: new Date(meData.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                addresses: []
              });
              setIsLoggedIn(true);
            }
          } else {
            // Invalid token
            localStorage.removeItem(AUTH_TOKEN_KEY);
          }
        }
      } catch (err) {
        console.error("Auth load error", err);
        localStorage.removeItem(AUTH_TOKEN_KEY);
      } finally {
        setIsLoaded(true);
      }
    }
    
    loadUser();
  }, []);

  // Sync customer profile
  const syncCustomer = (updated: CustomerProfile | null, auth: boolean) => {
    setCustomer(updated);
    setIsLoggedIn(auth);
    if (updated) {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updated));
    } else {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
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

  const login = async (email: string, password?: string): Promise<boolean> => {
    if (!password) {
      // For demo fallback if needed, but we should always have password now
      password = "Password@123"; 
    }

    try {
      const res = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ emailOrPhone: email, password })
      });
      
      if (res && res.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, res.token);
        
        // Fetch user data
        const meData = await fetchApi("/auth/me");
        if (meData) {
          setCustomer({
            id: meData.id,
            fullName: meData.fullName,
            email: meData.email,
            phone: meData.phone || "",
            memberTier: "KB Member",
            joinedDate: new Date(meData.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            addresses: []
          });
          setIsLoggedIn(true);

          try {
            const fetchedOrders = await fetchApi("/account/orders");
            if (Array.isArray(fetchedOrders) && fetchedOrders.length > 0) {
              setOrders(fetchedOrders);
            }
          } catch (err) {
            console.error("Error fetching orders after login", err);
          }
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<boolean> => {
    const password = data.password || "Password@123";
    
    try {
      const res = await fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          password: password,
          confirmPassword: password
        })
      });
      
      if (res && res.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, res.token);
        
        const meData = await fetchApi("/auth/me");
        if (meData) {
          setCustomer({
            id: meData.id,
            fullName: meData.fullName,
            email: meData.email,
            phone: meData.phone || "",
            memberTier: "KB Member",
            joinedDate: new Date(meData.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            addresses: []
          });
          setIsLoggedIn(true);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetchApi("/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error", err);
    }
    localStorage.removeItem(AUTH_TOKEN_KEY);
    syncCustomer(null, false);
  };

  const updateProfile = async (data: { fullName: string; email: string; phone: string }) => {
    if (!customer) return;
    try {
      await fetchApi("/account/profile", {
        method: "PUT",
        body: JSON.stringify({
          fullName: data.fullName.trim(),
          phone: data.phone.trim(),
        }),
      });
      const updated: CustomerProfile = {
        ...customer,
        fullName: data.fullName.trim(),
        // email can't be updated in this endpoint
        phone: data.phone.trim(),
      };
      syncCustomer(updated, true);
    } catch (err) {
      console.error("Failed to update profile", err);
      throw err;
    }
  };

  const addAddress = async (address: Omit<CustomerAddress, "id">) => {
    if (!customer) return;
    try {
      const created = await fetchApi("/account/addresses", {
        method: "POST",
        body: JSON.stringify({
          recipientName: address.fullName,
          phone: address.phone,
          streetAddress: address.addressLine1,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: "India",
          isDefaultShipping: address.isDefault,
          isDefaultBilling: address.isDefault,
        }),
      });

      const newAddr: CustomerAddress = {
        ...address,
        id: created.id,
      };
      
      let updatedAddrs = [...customer.addresses];
      if (newAddr.isDefault) {
        updatedAddrs = updatedAddrs.map((a) => ({ ...a, isDefault: false }));
      }
      updatedAddrs.push(newAddr);
      syncCustomer({ ...customer, addresses: updatedAddrs }, true);
    } catch (err) {
      console.error("Failed to add address", err);
      throw err;
    }
  };

  const deleteAddress = async (id: string) => {
    if (!customer) return;
    try {
      // Don't let users delete mock addresses from local storage if they are not in DB, but since we re-fetched them they should be real DB ids.
      if (!id.startsWith("addr-")) {
        await fetchApi(`/account/addresses/${id}`, {
          method: "DELETE",
        });
      }
      const updatedAddrs = customer.addresses.filter((a) => a.id !== id);
      syncCustomer({ ...customer, addresses: updatedAddrs }, true);
    } catch (err) {
      console.error("Failed to delete address", err);
      throw err;
    }
  };

  const setDefaultAddress = async (id: string) => {
    if (!customer) return;
    try {
      if (!id.startsWith("addr-")) {
        await fetchApi(`/account/addresses/${id}/set-default-shipping`, {
          method: "PATCH",
        });
      }
      const updatedAddrs = customer.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }));
      syncCustomer({ ...customer, addresses: updatedAddrs }, true);
    } catch (err) {
      console.error("Failed to set default address", err);
      throw err;
    }
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
