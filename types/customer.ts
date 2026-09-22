export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  status: "Active" | "Inactive";
}
