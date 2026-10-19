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
  Star,
  ShieldCheck,
  Server,
  RefreshCw,
  X,
  Eye,
  EyeOff,
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
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<EmailAccount | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    displayName: "",
    host: "",
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
      password: "", // empty means keep existing
      enableSsl: account.enableSsl,
      useDefaultCredentials: account.useDefaultCredentials,
      isDefaultEmailAccount: account.isDefaultEmailAccount,
    });
    setShowPassword(false);
    setIsEditModalOpen(true);
  };

  const handleOpenTestModal = (account: EmailAccount) => {
    setSelectedAccount(account);
    setTestRecipient(account.email);
    setTestResult(null);
    setIsTestModalOpen(true);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (selectedAccount) {
        // Update
        await fetchApi(`/emailaccounts/${selectedAccount.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        setSuccessMessage(`Updated email account: ${formData.displayName}`);
      } else {
        // Create
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
      await loadAccounts();
    } catch (err: any) {
      setError(err?.message || "Failed to delete email account.");
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1C4834]/30">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[#143425] text-[#C89B3C] flex items-center justify-center border border-[#1C4834]">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
                Smartstore Email Accounts
              </h1>
              <p className="text-xs text-stone-500">
                Configure SMTP gateways, authentication credentials, and dispatch parameters.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAccounts}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#143425] hover:bg-[#1C4834] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4 text-[#C89B3C]" />
            <span>Add Email Account</span>
          </button>
        </div>
      </div>

      {/* Alert Banners */}
      {error && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-800 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Account Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-stone-500 bg-white rounded-xl border border-stone-200">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[#143425] mb-2" />
          <p className="text-xs">Loading email accounts...</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="p-12 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300">
          <Mail className="h-10 w-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-stone-800">No Email Accounts Configured</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            Connect an SMTP server to begin sending order receipts, shipment notifications, and welcome messages.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#143425] text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4 text-[#C89B3C]" />
            <span>Configure First Account</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`rounded-xl bg-white border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden ${
                account.isDefaultEmailAccount
                  ? "border-[#143425] ring-2 ring-[#143425]/15"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-stone-100 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-stone-900 text-sm">{account.displayName}</h3>
                      {account.isDefaultEmailAccount && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#143425] text-[#C89B3C]">
                          <Star className="h-3 w-3 fill-[#C89B3C]" />
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 font-mono">{account.email}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 flex items-center gap-1">
                      <Server className="h-3.5 w-3.5" /> SMTP Host
                    </span>
                    <span className="font-mono text-stone-700 font-medium">
                      {account.host}:{account.port}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> Security
                    </span>
                    <span className="font-medium text-stone-700">
                      {account.enableSsl ? "SSL/TLS Enabled" : "Plain / Non-SSL"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Username</span>
                    <span className="font-mono text-stone-600 truncate max-w-[150px]">
                      {account.username || "None"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenTestModal(account)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white border border-stone-200 hover:border-[#143425] hover:text-[#143425] text-stone-700 text-xs font-medium transition-colors shadow-2xs"
                >
                  <Send className="h-3 w-3 text-[#C89B3C]" />
                  <span>Test SMTP</span>
                </button>

                <div className="flex items-center gap-1">
                  {!account.isDefaultEmailAccount && (
                    <button
                      onClick={() => handleSetDefault(account)}
                      title="Set as Default Account"
                      className="p-1.5 rounded-md hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenEditModal(account)}
                    title="Edit Settings"
                    className="p-1.5 rounded-md hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(account)}
                    title="Delete Account"
                    className="p-1.5 rounded-md hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-[#143425] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#C89B3C]" />
                <h3 className="font-serif font-bold text-sm tracking-wide">
                  {selectedAccount ? "Edit Email Account" : "Add SMTP Gateway Account"}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-stone-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Display Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KB Ealeas Concierge"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Sender Email</label>
                  <input
                    type="email"
                    required
                    placeholder="support@kbealeas.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="font-medium text-stone-700">SMTP Host</label>
                  <input
                    type="text"
                    required
                    placeholder="smtp.gmail.com"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425] font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Port</label>
                  <input
                    type="number"
                    required
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 587 })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">SMTP Username</label>
                  <input
                    type="text"
                    placeholder="Username / Email"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425]"
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
                      className="w-full px-3 py-2 pr-9 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425]"
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

              <div className="pt-2 border-t border-stone-100 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.enableSsl}
                    onChange={(e) => setFormData({ ...formData, enableSsl: e.target.checked })}
                    className="rounded border-stone-300 text-[#143425] focus:ring-[#143425]"
                  />
                  <span>Enable SSL / TLS Encryption (Recommended)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isDefaultEmailAccount}
                    onChange={(e) => setFormData({ ...formData, isDefaultEmailAccount: e.target.checked })}
                    className="rounded border-stone-300 text-[#143425] focus:ring-[#143425]"
                  />
                  <span>Set as Default Email Account</span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#143425] hover:bg-[#1C4834] text-white font-semibold flex items-center gap-1.5"
                >
                  {isSubmitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>{selectedAccount ? "Update Account" : "Save Account"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEST EMAIL MODAL */}
      {isTestModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-[#143425] text-white flex items-center justify-between">
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

            <form onSubmit={handleSendTestEmail} className="p-5 space-y-4 text-xs">
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-stone-600 space-y-1">
                <p>
                  <strong>Testing Sender:</strong> {selectedAccount.displayName} &lt;{selectedAccount.email}&gt;
                </p>
                <p className="font-mono text-[11px] text-stone-500">
                  Host: {selectedAccount.host}:{selectedAccount.port} (SSL: {selectedAccount.enableSsl ? "Yes" : "No"})
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-700">Send Test Email To:</label>
                <input
                  type="email"
                  required
                  placeholder="Enter recipient email"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425]"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                    testResult.success
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

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="px-4 py-2 rounded-lg bg-[#143425] hover:bg-[#1C4834] text-white font-semibold flex items-center gap-1.5"
                >
                  {isSendingTest ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
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
