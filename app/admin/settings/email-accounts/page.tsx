"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Plus,
  CheckCircle2,
  AlertCircle,
  Send,
  Trash2,
  Edit2,
  Check,
  MoreHorizontal,
  RotateCw,
  X,
  Eye,
  EyeOff,
  Server,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { fetchApi } from "@/lib/api";

interface EmailAccount {
  id: string;
  email: string;
  displayName: string;
  host: string;
  port: number;
  username: string;
  enableSsl: boolean;
  useDefaultCredentials: boolean;
  isDefaultEmailAccount: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EmailAccountsPage() {
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Active Dropdown Menu with fixed positioning to avoid overflow clipping
  const [openMenu, setOpenMenu] = useState<{
    account: EmailAccount;
    top: number;
    left: number;
  } | null>(null);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<EmailAccount | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    displayName: "",
    host: "smtp.gmail.com",
    port: 587,
    username: "",
    password: "",
    enableSsl: true,
    useDefaultCredentials: false,
    isDefaultEmailAccount: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Test Email State
  const [testRecipient, setTestRecipient] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  // Close context menu on outside click, scroll, or window resize
  useEffect(() => {
    const handleClose = () => setOpenMenu(null);
    window.addEventListener("click", handleClose);
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);
    return () => {
      window.removeEventListener("click", handleClose);
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, []);

  const handleToggleMenu = (account: EmailAccount, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (openMenu?.account.id === account.id) {
      setOpenMenu(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 190;
    const menuHeight = 180;

    // Position horizontally aligned to right edge of button, clamped to screen
    const left = Math.min(window.innerWidth - menuWidth - 16, Math.max(16, rect.right - menuWidth));

    // If near bottom of viewport, drop up; otherwise drop down
    const opensUpward = rect.bottom + menuHeight > window.innerHeight;
    const top = opensUpward ? Math.max(16, rect.top - menuHeight - 4) : rect.bottom + 4;

    setOpenMenu({ account, top, left });
  };

  const loadAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchApi("/emailaccounts");
      if (Array.isArray(data)) {
        setAccounts(data);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load email accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(accounts.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenCreateModal = () => {
    setSelectedAccount(null);
    setFormData({
      email: "",
      displayName: "",
      host: "smtp.gmail.com",
      port: 587,
      username: "",
      password: "",
      enableSsl: true,
      useDefaultCredentials: false,
      isDefaultEmailAccount: accounts.length === 0,
    });
    setShowPassword(false);
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (account: EmailAccount) => {
    setSelectedAccount(account);
    setFormData({
      email: account.email,
      displayName: account.displayName,
      host: account.host,
      port: account.port,
      username: account.username,
      password: "",
      enableSsl: account.enableSsl,
      useDefaultCredentials: account.useDefaultCredentials,
      isDefaultEmailAccount: account.isDefaultEmailAccount,
    });
    setShowPassword(false);
    setIsEditModalOpen(true);
    setOpenMenu(null);
  };

  const handleOpenTestModal = (account: EmailAccount) => {
    setSelectedAccount(account);
    setTestRecipient(account.email);
    setTestResult(null);
    setIsTestModalOpen(true);
    setOpenMenu(null);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (selectedAccount) {
        await fetchApi(`/emailaccounts/${selectedAccount.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        setSuccessMessage(`Updated email account: ${formData.displayName}`);
      } else {
        await fetchApi("/emailaccounts", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        setSuccessMessage(`Created email account: ${formData.displayName}`);
      }

      setIsEditModalOpen(false);
      await loadAccounts();
    } catch (err: any) {
      setError(err?.message || "Failed to save email account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (account: EmailAccount) => {
    try {
      await fetchApi(`/emailaccounts/${account.id}/set-default`, {
        method: "POST",
      });
      setSuccessMessage(`Default email account set to ${account.displayName}`);
      setOpenMenu(null);
      await loadAccounts();
    } catch (err: any) {
      setError(err?.message || "Failed to set default account.");
    }
  };

  const handleDelete = async (account: EmailAccount) => {
    if (!confirm(`Are you sure you want to delete ${account.displayName} (${account.email})?`)) {
      return;
    }

    try {
      await fetchApi(`/emailaccounts/${account.id}`, {
        method: "DELETE",
      });
      setSuccessMessage(`Deleted email account: ${account.displayName}`);
      setOpenMenu(null);
      await loadAccounts();
    } catch (err: any) {
      setError(err?.message || "Failed to delete email account.");
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Delete ${selectedIds.length} selected accounts?`)) return;
    try {
      for (const id of selectedIds) {
        await fetchApi(`/emailaccounts/${id}`, { method: "DELETE" });
      }
      setSelectedIds([]);
      setSuccessMessage("Selected email accounts deleted.");
      await loadAccounts();
    } catch (err: any) {
      setError(err?.message || "Failed to delete selected accounts.");
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !testRecipient) return;

    setIsSendingTest(true);
    setTestResult(null);

    try {
      const response = await fetchApi(`/emailaccounts/${selectedAccount.id}/test`, {
        method: "POST",
        body: JSON.stringify({ sendTo: testRecipient }),
      });
      setTestResult({
        success: true,
        message: response?.message || `Test email dispatched successfully to ${testRecipient}!`,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || "SMTP handshake test failed. Check host, port, or password credentials.",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Smartstore Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Email Accounts
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Configure SMTP gateway credentials for order receipts, customer care, and automated system dispatch.
          </p>
        </div>
      </div>

      {/* Alert Banners */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-800 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
            {error.toLowerCase().includes("log in") && (
              <a
                href="/account/login?redirect=/admin/settings/email-accounts"
                className="underline font-bold text-[#143425] hover:text-[#C89B3C] ml-1"
              >
                Sign In Now &rarr;
              </a>
            )}
          </div>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Smartstore Table Container (Card) */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Top Action Bar matching Screenshot 1 */}
        <div className="p-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-[#143425] hover:bg-stone-50 text-stone-800 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5 text-[#143425]" />
              <span>Add new...</span>
            </button>
          </div>

          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedIds.length > 0
                ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                : "text-stone-400 border border-stone-200 cursor-not-allowed bg-stone-100/60"
              }`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete selected</span>
          </button>
        </div>

        {/* Smartstore Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 text-stone-700 font-semibold border-b border-stone-200">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={accounts.length > 0 && selectedIds.length === accounts.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-stone-300 text-[#143425] focus:ring-[#143425]"
                  />
                </th>
                <th className="px-4 py-3.5">Email address</th>
                <th className="px-4 py-3.5">Email display name</th>
                <th className="px-4 py-3.5">Host</th>
                <th className="px-4 py-3.5">Port</th>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5 text-center">Is default email account</th>
                <th className="px-4 py-3.5 text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500">
                    <RotateCw className="h-5 w-5 animate-spin mx-auto text-[#143425] mb-2" />
                    <span>Loading email accounts...</span>
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500">
                    <Mail className="h-8 w-8 text-stone-300 mx-auto mb-2" />
                    <span>No email accounts configured. Click "+ Add new..." to create your first gateway.</span>
                  </td>
                </tr>
              ) : (
                accounts.map((account) => {
                  const isChecked = selectedIds.includes(account.id);
                  const isMenuOpen = openMenu?.account.id === account.id;

                  return (
                    <tr
                      key={account.id}
                      className={`hover:bg-sky-50/40 transition-colors ${isChecked ? "bg-sky-50/60" : ""
                        }`}
                    >
                      <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(account.id, e as any)}
                          className="h-4 w-4 rounded border-stone-300 text-[#143425] focus:ring-[#143425]"
                        />
                      </td>

                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleOpenEditModal(account)}
                          className="font-semibold text-[#143425] hover:text-[#C89B3C] hover:underline"
                        >
                          {account.email}
                        </button>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-stone-900">
                        {account.displayName}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-stone-600">
                        {account.host}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-stone-600">
                        {account.port}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-stone-600">
                        {account.username || "—"}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        {account.isDefaultEmailAccount ? (
                          <div className="inline-flex items-center justify-center text-emerald-600">
                            <Check className="h-4 w-4 stroke-[2.5]" />
                          </div>
                        ) : null}
                      </td>

                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenTestModal(account)}
                            className="p-1.5 rounded-lg border border-transparent hover:bg-stone-100 text-stone-500 hover:text-[#C89B3C] transition-colors"
                            title="Send test email"
                          >
                            <Send className="h-4 w-4 text-[#C89B3C]" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleToggleMenu(account, e)}
                            className={`p-1.5 rounded-lg border transition-colors ${isMenuOpen
                                ? "bg-stone-200 border-stone-300 text-stone-900"
                                : "bg-transparent border-transparent hover:bg-stone-100 text-stone-500 hover:text-stone-900"
                              }`}
                            title="Actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Smartstore Bottom Pagination Bar matching Screenshot 1 */}
        <div className="px-4 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <button
              onClick={loadAccounts}
              title="Refresh Grid"
              className="p-1 rounded-md hover:bg-stone-200 text-stone-600 transition-colors"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <div className="flex items-center gap-1 border-l border-stone-200 pl-3">
              <button disabled className="p-1 rounded-md text-stone-300">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="h-6 w-6 flex items-center justify-center rounded-md bg-white border border-stone-300 text-stone-800 font-semibold shadow-2xs">
                1
              </span>
              <button disabled className="p-1 rounded-md text-stone-300">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px]">
              Displaying items {accounts.length > 0 ? `1-${accounts.length}` : "0"} of{" "}
              {accounts.length}
            </span>
            <div className="flex items-center gap-2 border-l border-stone-200 pl-3">
              <span className="font-medium text-stone-700">25 per page</span>
              <Settings className="h-3.5 w-3.5 text-stone-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Fixed Context Menu (Breaks completely out of all table overflow clipping!) */}
      {openMenu && (
        <>
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setOpenMenu(null)}
          />
          <div
            style={{
              position: "fixed",
              top: `${openMenu.top}px`,
              left: `${openMenu.left}px`,
            }}
            className="z-50 w-44 rounded-xl bg-white border border-stone-200 shadow-2xl py-1 text-left text-xs animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                handleOpenEditModal(openMenu.account);
                setOpenMenu(null);
              }}
              className="w-full px-3.5 py-2 text-stone-700 hover:bg-stone-100 flex items-center gap-2.5 transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5 text-stone-500" />
              <span>Edit Details</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleOpenTestModal(openMenu.account);
                setOpenMenu(null);
              }}
              className="w-full px-3.5 py-2 text-stone-700 hover:bg-stone-100 flex items-center gap-2.5 transition-colors"
            >
              <Send className="h-3.5 w-3.5 text-[#C89B3C]" />
              <span>Send Test Email</span>
            </button>
            {!openMenu.account.isDefaultEmailAccount && (
              <button
                type="button"
                onClick={() => {
                  handleSetDefault(openMenu.account);
                  setOpenMenu(null);
                }}
                className="w-full px-3.5 py-2 text-stone-700 hover:bg-stone-100 flex items-center gap-2.5 transition-colors"
              >
                <Star className="h-3.5 w-3.5 text-stone-500" />
                <span>Set as Default</span>
              </button>
            )}
            <div className="my-1 border-t border-stone-100" />
            <button
              type="button"
              onClick={() => {
                handleDelete(openMenu.account);
                setOpenMenu(null);
              }}
              className="w-full px-3.5 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}

      {/* CREATE / EDIT SMTP ACCOUNT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#143425] text-white flex items-center justify-between border-b border-[#1C4834]">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#C89B3C]" />
                <h3 className="font-serif font-bold text-sm tracking-wide">
                  {selectedAccount ? `Edit Email Account - ${selectedAccount.displayName}` : "Add New Email Account"}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-stone-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Email Display Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KB Orders Concierge"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="orders@kbealeas.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div className="col-span-2 space-y-1">
                  <label className="font-medium text-stone-700">SMTP Host</label>
                  <input
                    type="text"
                    required
                    placeholder="smtp.gmail.com"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425] font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Port</label>
                  <input
                    type="number"
                    required
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 587 })}
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">SMTP Username</label>
                  <input
                    type="text"
                    placeholder="Username / Login"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">
                    SMTP Password {selectedAccount && <span className="text-stone-400 font-normal">(Leave blank to keep)</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="App password or secret"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3.5 py-2 pr-9 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.enableSsl}
                    onChange={(e) => setFormData({ ...formData, enableSsl: e.target.checked })}
                    className="h-4 w-4 rounded border-stone-300 text-[#143425] focus:ring-[#143425]"
                  />
                  <span>Enable SSL / TLS Encryption</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isDefaultEmailAccount}
                    onChange={(e) => setFormData({ ...formData, isDefaultEmailAccount: e.target.checked })}
                    className="h-4 w-4 rounded border-stone-300 text-[#143425] focus:ring-[#143425]"
                  />
                  <span>Set as Default Email Account</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#143425] hover:bg-[#1C4834] text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  {isSubmitting && <RotateCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>Save Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEST EMAIL MODAL */}
      {isTestModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#143425] text-white flex items-center justify-between border-b border-[#1C4834]">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-[#C89B3C]" />
                <h3 className="font-serif font-bold text-sm tracking-wide">
                  Live SMTP Handshake Test
                </h3>
              </div>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="text-stone-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSendTestEmail} className="p-6 space-y-4 text-xs">
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-stone-600 space-y-1">
                <p>
                  <strong>Testing Sender:</strong> {selectedAccount.displayName} &lt;{selectedAccount.email}&gt;
                </p>
                <p className="font-mono text-[11px] text-stone-500">
                  Host: {selectedAccount.host}:{selectedAccount.port} (SSL: {selectedAccount.enableSsl ? "Enabled" : "Disabled"})
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-700">Recipient Email Address:</label>
                <input
                  type="email"
                  required
                  placeholder="Enter email to receive test message"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425]"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2 ${testResult.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{testResult.message}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="px-5 py-2 rounded-lg bg-[#143425] hover:bg-[#1C4834] text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  {isSendingTest ? (
                    <>
                      <RotateCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending Test...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 text-[#C89B3C]" />
                      <span>Send Test Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
