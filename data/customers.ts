import { Customer } from "@/types/customer";

export const CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    fullName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98201 44521",
    city: "Pune",
    state: "Maharashtra",
    totalOrders: 6,
    totalSpent: 4890,
    joinedDate: "2026-03-12",
    status: "Active",
  },
  {
    id: "cust-2",
    fullName: "Priyanka Nair",
    email: "priyanka.nair@example.com",
    phone: "+91 97412 88310",
    city: "Bengaluru",
    state: "Karnataka",
    totalOrders: 9,
    totalSpent: 8740,
    joinedDate: "2025-11-04",
    status: "Active",
  },
  {
    id: "cust-3",
    fullName: "Vikram Mehta",
    email: "vikram.mehta@example.com",
    phone: "+91 98110 56712",
    city: "New Delhi",
    state: "Delhi",
    totalOrders: 4,
    totalSpent: 3520,
    joinedDate: "2026-05-19",
    status: "Active",
  },
  {
    id: "cust-4",
    fullName: "Sneha Kulkarni",
    email: "sneha.k@example.com",
    phone: "+91 94220 19834",
    city: "Pune",
    state: "Maharashtra",
    totalOrders: 2,
    totalSpent: 710,
    joinedDate: "2026-08-30",
    status: "Active",
  },
  {
    id: "cust-5",
    fullName: "Rohan Varma",
    email: "rohan.v@example.com",
    phone: "+91 99014 33291",
    city: "Hyderabad",
    state: "Telangana",
    totalOrders: 1,
    totalSpent: 490,
    joinedDate: "2026-09-15",
    status: "Active",
  },
];

export function getCustomers(): Customer[] {
  return CUSTOMERS;
}
