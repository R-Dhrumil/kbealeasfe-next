"use client";

import React, { useState, useEffect } from "react";
import {
  MailCheck,
  Search,
  ArrowLeft,
  Eye,
  Copy,
  Check,
  Trash2,
  FileText,
  Mail,
  Globe,
  RotateCw,
  X,
  Send,
  AlertCircle,
  CheckCircle2,
  Code,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { fetchApi } from "@/lib/api";

interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
  to?: string;
  replyTo?: string;
  bccEmailAddresses?: string;
  isActive: boolean;
  onlySendManually: boolean;
  emailAccountId?: string;
  emailAccountName?: string;
  attachment1Path?: string;
  attachment2Path?: string;
  attachment3Path?: string;
  availableTokens: string[];
  createdAt: string;
  updatedAt: string;
}

interface EmailAccount {
  id: string;
  displayName: string;
  email: string;
}

export default function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // View state: 'list' | 'edit'
  const [currentView, setCurrentView] = useState<"list" | "edit">("list");
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    subject: "",
    to: "",
    replyTo: "",
    bccEmailAddresses: "",
    isActive: true,
    onlySendManually: false,
    emailAccountId: "",
    attachment1Path: "",
    attachment2Path: "",
    attachment3Path: "",
    body: "",
  });

  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSubject, setPreviewSubject] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Live Test Modal
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testRecipient, setTestRecipient] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [templatesData, accountsData] = await Promise.all([
        fetchApi("/messagetemplates"),
        fetchApi("/emailaccounts"),
      ]);

      if (Array.isArray(templatesData)) setTemplates(templatesData);
      if (Array.isArray(accountsData)) setEmailAccounts(accountsData);
    } catch (err: any) {
      setError(err?.message || "Failed to load message templates.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setFormState({
      subject: template.subject,
      to: template.to || "{{ Customer.FullName }} <{{ Customer.Email }}>",
      replyTo: template.replyTo || "",
      bccEmailAddresses: template.bccEmailAddresses || "",
      isActive: template.isActive,
      onlySendManually: template.onlySendManually || false,
      emailAccountId: template.emailAccountId || "",
      attachment1Path: template.attachment1Path || "",
      attachment2Path: template.attachment2Path || "",
      attachment3Path: template.attachment3Path || "",
      body: template.body,
    });
    setCurrentView("edit");
  };

  const handleSave = async (continueEditing: boolean = false) => {
    if (!editingTemplate) return;

    setIsSaving(true);
    setError(null);

    try {
      const updated = await fetchApi(`/messagetemplates/${editingTemplate.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formState,
          emailAccountId: formState.emailAccountId ? formState.emailAccountId : null,
          description: editingTemplate.description,
        }),
      });

      setSuccessMessage(`Saved template: ${editingTemplate.name}`);
      await loadData();

      if (continueEditing && updated) {
        setEditingTemplate(updated);
      } else {
        setCurrentView("list");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to save template.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingTemplate) return;
    if (!confirm(`Are you sure you want to delete template '${editingTemplate.name}'?`)) return;

    try {
      await fetchApi(`/messagetemplates/${editingTemplate.id}`, {
        method: "DELETE",
      });
      setSuccessMessage(`Deleted template: ${editingTemplate.name}`);
      setCurrentView("list");
      await loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to delete template.");
    }
  };

  const handleCopyTemplate = () => {
    if (!editingTemplate) return;
    navigator.clipboard.writeText(formState.body);
    setSuccessMessage("Template body code copied to clipboard.");
  };

  const handleOpenPreview = async () => {
    if (!editingTemplate) return;
    setIsPreviewOpen(true);
    setIsLoadingPreview(true);

    try {
      const res = await fetchApi(`/messagetemplates/${editingTemplate.id}/preview`, {
        method: "POST",
        body: JSON.stringify({ sendTo: "alexander@example.com" }),
      });
      if (res) {
        setPreviewSubject(res.subject || formState.subject);
        setPreviewHtml(res.body || formState.body);
      }
    } catch {
      let sub = formState.subject;
      let bdy = formState.body;
      const sampleMap: Record<string, string> = {
        "Store.Name": "KB Ealeas",
        "Store.Url": "http://localhost:3000",
        "Customer.FullName": "Alexander Vance",
        "Customer.Email": "alexander@example.com",
        "Order.OrderNumber": "KB-94821",
        "Order.Status": "Confirmed",
        "Order.Total": "$148.50",
      };
      Object.entries(sampleMap).forEach(([k, v]) => {
        sub = sub.replaceAll(`{{ ${k} }}`, v).replaceAll(`{{${k}}}`, v).replaceAll(`%${k}%`, v);
        bdy = bdy.replaceAll(`{{ ${k} }}`, v).replaceAll(`{{${k}}}`, v).replaceAll(`%${k}%`, v);
      });
      setPreviewSubject(sub);
      setPreviewHtml(bdy);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate || !testRecipient) return;

    setIsSendingTest(true);
    setTestResult(null);

    try {
      const res = await fetchApi(`/messagetemplates/${editingTemplate.id}/send-test`, {
        method: "POST",
        body: JSON.stringify({ sendTo: testRecipient }),
      });
      setTestResult({
        success: true,
        message: res?.message || `Test email dispatched successfully to ${testRecipient}!`,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || "Failed to send test email. Check SMTP gateway configuration.",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleInsertToken = (token: string) => {
    setFormState((prev) => ({
      ...prev,
      body: prev.body + ` ${token} `,
    }));
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bodyLines = formState.body.split("\n");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Alert Notifications */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-800 text-xs shadow-2xs">
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

      {/* ========================================================================= */}
      {/* VIEW A: MASTER LIST OF TEMPLATES                                          */}
      {/* ========================================================================= */}
      {currentView === "list" && (
        <div className="space-y-5">
          {/* Page Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                Message Templates
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Configure transactional email layouts, dynamic Liquid tokens, and assigned sender email accounts.
              </p>
            </div>

            <button
              onClick={loadData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search template name, subject, or trigger..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:border-[#143425]"
            />
          </div>

          {/* Templates Grid / Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#143425] text-white font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Template Name (Trigger)</th>
                  <th className="px-5 py-3.5">Subject Line</th>
                  <th className="px-5 py-3.5">Sender Email Account</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-stone-500">
                      <RotateCw className="h-5 w-5 animate-spin mx-auto text-[#143425] mb-2" />
                      <span>Loading templates...</span>
                    </td>
                  </tr>
                ) : filteredTemplates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-stone-500">
                      <MailCheck className="h-8 w-8 text-stone-300 mx-auto mb-2" />
                      <span>No message templates found.</span>
                    </td>
                  </tr>
                ) : (
                  filteredTemplates.map((template) => (
                    <tr
                      key={template.id}
                      className="hover:bg-stone-50/80 transition-colors cursor-pointer"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <td className="px-5 py-4">
                        <div className="font-mono font-semibold text-stone-900">
                          {template.name}
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">
                          {template.description}
                        </div>
                      </td>

                      <td className="px-5 py-4 font-medium text-stone-800 line-clamp-1">
                        {template.subject}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-stone-600 font-mono text-[11px]">
                          <Mail className="h-3 w-3 text-[#C89B3C]" />
                          {template.emailAccountName || "Default Account"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            template.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {template.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>

                      <td
                        className="px-5 py-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleSelectTemplate(template)}
                          className="px-3 py-1.5 rounded-md bg-[#143425] hover:bg-[#1C4834] text-white text-xs font-semibold shadow-2xs transition-colors"
                        >
                          Configure
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: SMARTSTORE 6 TEMPLATE DETAILS EDITOR (SCREENSHOTS 2 & 3)          */}
      {/* ========================================================================= */}
      {currentView === "edit" && editingTemplate && (
        <div className="space-y-6">
          {/* Smartstore Top Action Bar matching Screenshot 2 */}
          <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title with Back Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView("list")}
                title="Back to list"
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 transition-colors shadow-2xs"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h1 className="text-base font-bold text-stone-900 tracking-tight">
                  Edit message template details - {editingTemplate.name}
                </h1>
              </div>
            </div>

            {/* Smartstore Action Buttons Group */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <button
                type="button"
                onClick={handleOpenPreview}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs"
              >
                <Eye className="h-3.5 w-3.5 text-stone-500" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                onClick={handleCopyTemplate}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs"
              >
                <Copy className="h-3.5 w-3.5 text-stone-500" />
                <span>Copy template</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C89B3C] hover:bg-[#A87E28] text-white font-bold shadow-xs transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Save</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold transition-colors shadow-2xs"
              >
                <span>Save and Continue Edit</span>
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors shadow-2xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Form Content (Card) */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs divide-y divide-stone-100 overflow-hidden">
            {/* Upper Metadata Section (Horizontal label-input layout like Screenshot 2) */}
            <div className="p-6 md:p-8 space-y-5 text-xs">
              {/* Name */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                <span className="w-44 font-semibold text-stone-700 shrink-0">Name</span>
                <span className="font-mono text-stone-900 font-medium">
                  {editingTemplate.name}
                </span>
              </div>

              {/* Active Toggle Switch */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                <span className="w-44 font-semibold text-stone-700 shrink-0">Active</span>
                <button
                  type="button"
                  onClick={() =>
                    setFormState((prev) => ({ ...prev, isActive: !prev.isActive }))
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    formState.isActive ? "bg-[#C89B3C]" : "bg-stone-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      formState.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Only Send Manually Toggle Switch */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                <span className="w-44 font-semibold text-stone-700 shrink-0">
                  Only send manually
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFormState((prev) => ({
                      ...prev,
                      onlySendManually: !prev.onlySendManually,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    formState.onlySendManually ? "bg-[#C89B3C]" : "bg-stone-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      formState.onlySendManually ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Limited to stores */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                <span className="w-44 font-semibold text-stone-700 shrink-0">
                  Limited to stores
                </span>
                <div className="flex-1 max-w-2xl">
                  <input
                    type="text"
                    readOnly
                    value="All stores"
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Language Flags Bar matching Screenshot 2 */}
              <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-800 text-white font-medium text-xs shadow-2xs"
                >
                  <Globe className="h-3.5 w-3.5 text-stone-300" />
                  <span>Standard</span>
                </button>
                <div className="flex items-center gap-1 text-sm pl-2">
                  <span title="English (United States)">🇺🇸</span>
                  <span title="German">🇩🇪</span>
                  <span title="French">🇫🇷</span>
                  <span title="Spanish">🇪🇸</span>
                  <span title="Italian">🇮🇹</span>
                  <span title="Japanese">🇯🇵</span>
                  <span title="Hindi">🇮🇳</span>
                </div>
              </div>

              {/* Email Account Dropdown (Crucial Purpose Linkage!) */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                <label className="w-44 font-semibold text-stone-700 shrink-0">
                  Email account
                </label>
                <div className="flex-1 max-w-2xl">
                  <select
                    value={formState.emailAccountId}
                    onChange={(e) =>
                      setFormState({ ...formState, emailAccountId: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:border-[#143425] font-medium"
                  >
                    <option value="">Global Default Email Account</option>
                    {emailAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.displayName} ({acc.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* To field */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                <label className="w-44 font-semibold text-stone-700 shrink-0">To</label>
                <div className="flex-1 max-w-2xl">
                  <input
                    type="text"
                    value={formState.to}
                    onChange={(e) => setFormState({ ...formState, to: e.target.value })}
                    placeholder="{{ Customer.FullName }} <{{ Customer.Email }}>"
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425] font-mono text-xs"
                  />
                </div>
              </div>

              {/* Reply to field */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                <label className="w-44 font-semibold text-stone-700 shrink-0">Reply to</label>
                <div className="flex-1 max-w-2xl">
                  <input
                    type="text"
                    value={formState.replyTo}
                    onChange={(e) => setFormState({ ...formState, replyTo: e.target.value })}
                    placeholder="support@kbealeas.com"
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425] font-mono text-xs"
                  />
                </div>
              </div>

              {/* BCC field */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                <label className="w-44 font-semibold text-stone-700 shrink-0">BCC</label>
                <div className="flex-1 max-w-2xl">
                  <input
                    type="text"
                    value={formState.bccEmailAddresses}
                    onChange={(e) =>
                      setFormState({ ...formState, bccEmailAddresses: e.target.value })
                    }
                    placeholder="orders-archive@kbealeas.com"
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425] font-mono text-xs"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                <label className="w-44 font-semibold text-stone-700 shrink-0">Subject</label>
                <div className="flex-1 max-w-2xl">
                  <input
                    type="text"
                    required
                    value={formState.subject}
                    onChange={(e) =>
                      setFormState({ ...formState, subject: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425]"
                  />
                </div>
              </div>

              {/* Attachment 1, 2, 3 dropzones matching Screenshot 2 */}
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8 pt-1"
                >
                  <label className="w-44 font-semibold text-stone-700 shrink-0 pt-2">
                    Attachment {num}
                  </label>
                  <div className="flex-1 max-w-2xl">
                    <div className="border border-dashed border-stone-300 rounded-xl p-4 bg-stone-50/60 flex items-center justify-between hover:bg-stone-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-stone-200/60 flex items-center justify-center text-stone-400">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-stone-700 font-medium text-xs">
                            To upload files drop them here or click.
                          </p>
                          <p className="text-[11px] text-stone-400">PDF, JPG, PNG (Max 5MB)</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-3.5 py-2 rounded-lg bg-[#143425] hover:bg-[#1C4834] text-white text-xs font-semibold shadow-2xs transition-colors"
                      >
                        Browse media...
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Smartstore Dynamic Token Helper Shelf */}
            <div className="p-5 bg-stone-50/70 border-t border-stone-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#C89B3C]" />
                  <span>Available Dynamic Variables (Click to copy or insert):</span>
                </span>
                <span className="text-stone-400 text-[10px] font-mono">
                  Smartstore Liquid {"{{ Variable }}"} syntax
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {editingTemplate.availableTokens.map((token) => (
                  <button
                    key={token}
                    type="button"
                    onClick={() => handleInsertToken(token)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-stone-300 hover:border-[#143425] hover:text-[#143425] text-[11px] font-mono text-stone-700 transition-colors shadow-2xs"
                  >
                    <span>{token}</span>
                    {copiedToken === token ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-stone-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Smartstore Code Editor with Line Numbers (Screenshot 3) */}
            <div className="p-6 md:p-8 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-stone-800 text-xs flex items-center gap-1.5">
                  <Code className="h-4 w-4 text-[#143425]" />
                  <span>HTML & Liquid Template Source</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTestRecipient("");
                      setTestResult(null);
                      setIsTestModalOpen(true);
                    }}
                    className="text-xs text-[#143425] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Send className="h-3 w-3 text-[#C89B3C]" />
                    <span>Send Test Email</span>
                  </button>
                  <span className="text-[11px] font-mono text-stone-400">
                    {bodyLines.length} lines
                  </span>
                </div>
              </div>

              {/* Code Editor Container */}
              <div className="border border-stone-300 rounded-xl overflow-hidden bg-white shadow-2xs flex">
                {/* Line numbers gutter */}
                <div className="bg-stone-100/80 text-stone-400 select-none py-3.5 px-3 text-right font-mono text-xs border-r border-stone-200">
                  {bodyLines.map((_, i) => (
                    <div key={i} className="leading-6">
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Textarea Code Input */}
                <textarea
                  rows={Math.max(16, bodyLines.length + 2)}
                  value={formState.body}
                  onChange={(e) =>
                    setFormState({ ...formState, body: e.target.value })
                  }
                  className="flex-1 p-3.5 font-mono text-xs text-stone-800 focus:outline-hidden leading-6 resize-y bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PREVIEW MODAL                                                             */}
      {/* ========================================================================= */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#143425] text-white flex items-center justify-between border-b border-[#1C4834]">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#C89B3C]" />
                <h3 className="font-serif font-bold text-sm tracking-wide">
                  Live Preview: {previewSubject}
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-stone-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-stone-100 space-y-4">
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 shadow-2xs">
                <p>
                  <strong>Rendered Subject:</strong> {previewSubject}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  <strong>Simulated Recipient:</strong> Alexander Vance &lt;alexander@example.com&gt;
                </p>
              </div>

              {isLoadingPreview ? (
                <div className="p-12 text-center text-stone-500">
                  <RotateCw className="h-6 w-6 animate-spin mx-auto text-[#143425] mb-2" />
                  <p className="text-xs">Rendering preview...</p>
                </div>
              ) : (
                <div
                  className="bg-white rounded-xl shadow-xs overflow-hidden p-3 border border-stone-200"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEND TEST EMAIL MODAL                                                     */}
      {/* ========================================================================= */}
      {isTestModalOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#143425] text-white flex items-center justify-between border-b border-[#1C4834]">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-[#C89B3C]" />
                <h3 className="font-serif font-bold text-sm tracking-wide">
                  Send Test Template Email
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
                  <strong>Template:</strong> {editingTemplate.name}
                </p>
                <p className="text-[11px] text-stone-500">
                  Will render with mock customer/order tokens and dispatch through the configured email gateway.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-700">Recipient Email Address:</label>
                <input
                  type="email"
                  required
                  placeholder="Enter email to receive test"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425]"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2 ${
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
