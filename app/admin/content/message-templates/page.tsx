"use client";

import React, { useState, useEffect } from "react";
import {
  MailCheck,
  Search,
  Plus,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  Code,
  Copy,
  Check,
  RefreshCw,
  X,
  FileText,
  Mail,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { fetchApi } from "@/lib/api";

interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
  bccEmailAddresses?: string;
  isActive: boolean;
  emailAccountId?: string;
  emailAccountName?: string;
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

  // Editor Modal States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewSubject, setPreviewSubject] = useState<string>("");
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    body: "",
    bccEmailAddresses: "",
    isActive: true,
    emailAccountId: "",
  });
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Test Send State
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

  const handleOpenEditor = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      subject: template.subject,
      description: template.description || "",
      body: template.body,
      bccEmailAddresses: template.bccEmailAddresses || "",
      isActive: template.isActive,
      emailAccountId: template.emailAccountId || "",
    });
    setActiveTab("edit");
    setIsEditorOpen(true);
  };

  const handleLoadPreview = async () => {
    if (!selectedTemplate) return;
    setIsLoadingPreview(true);
    try {
      const res = await fetchApi(`/messagetemplates/${selectedTemplate.id}/preview`, {
        method: "POST",
        body: JSON.stringify({ sendTo: "alexander@example.com" }),
      });
      if (res) {
        setPreviewSubject(res.subject || formData.subject);
        setPreviewHtml(res.body || formData.body);
      }
    } catch {
      // Fallback local preview
      let sub = formData.subject;
      let bdy = formData.body;
      const sampleMap: Record<string, string> = {
        "%Store.Name%": "KB Ealeas",
        "%Store.Url%": "http://localhost:3000",
        "%Customer.FullName%": "Alexander Vance",
        "%Customer.Email%": "alexander@example.com",
        "%Order.OrderNumber%": "KB-94821",
        "%Order.Status%": "Confirmed",
        "%Order.Total%": "$148.50",
      };
      Object.keys(sampleMap).forEach((k) => {
        sub = sub.replaceAll(k, sampleMap[k]);
        bdy = bdy.replaceAll(k, sampleMap[k]);
      });
      setPreviewSubject(sub);
      setPreviewHtml(bdy);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    setIsSaving(true);
    setError(null);
    try {
      await fetchApi(`/messagetemplates/${selectedTemplate.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          emailAccountId: formData.emailAccountId ? formData.emailAccountId : null,
        }),
      });

      setSuccessMessage(`Saved template: ${selectedTemplate.name}`);
      setIsEditorOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to update template.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleInsertToken = (token: string) => {
    setFormData((prev) => ({
      ...prev,
      body: prev.body + ` ${token} `,
    }));
    handleCopyToken(token);
  };

  const handleOpenTestModal = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setTestRecipient("");
    setTestResult(null);
    setIsTestModalOpen(true);
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !testRecipient) return;

    setIsSendingTest(true);
    setTestResult(null);
    try {
      const res = await fetchApi(`/messagetemplates/${selectedTemplate.id}/send-test`, {
        method: "POST",
        body: JSON.stringify({ sendTo: testRecipient }),
      });
      setTestResult({
        success: true,
        message: res?.message || `Test email dispatched to ${testRecipient}!`,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || "Failed to send test email. Check SMTP settings.",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1C4834]/30">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[#143425] text-[#C89B3C] flex items-center justify-center border border-[#1C4834]">
              <MailCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
                Smartstore Message Templates
              </h1>
              <p className="text-xs text-stone-500">
                Manage transactional email layouts, dynamic tokens (%Tokens%), and system automated triggers.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
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

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search template name, subject, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:border-[#143425]"
          />
        </div>
      </div>

      {/* Templates Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#143425] text-white uppercase text-[10px] tracking-wider font-semibold border-b border-[#1C4834]">
            <tr>
              <th className="px-5 py-3.5">Template Name & Trigger</th>
              <th className="px-5 py-3.5">Subject Line</th>
              <th className="px-5 py-3.5">Sender Gateway</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-stone-500">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto text-[#143425] mb-2" />
                  <span>Loading message templates...</span>
                </td>
              </tr>
            ) : filteredTemplates.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-stone-500">
                  <MailCheck className="h-8 w-8 text-stone-400 mx-auto mb-2" />
                  <span>No message templates found matching your search.</span>
                </td>
              </tr>
            ) : (
              filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <div className="font-mono font-semibold text-stone-900 flex items-center gap-2">
                        <span>{template.name}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{template.description}</p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-medium text-stone-800 line-clamp-1">{template.subject}</span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-stone-600 font-mono text-[11px]">
                      <Mail className="h-3 w-3 text-stone-400" />
                      {template.emailAccountName || "Global Default Account"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        template.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {template.isActive ? "ACTIVE" : "DISABLED"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenTestModal(template)}
                        title="Send Test Email"
                        className="p-1.5 rounded-md hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors border border-stone-200"
                      >
                        <Send className="h-3.5 w-3.5 text-[#C89B3C]" />
                      </button>

                      <button
                        onClick={() => handleOpenEditor(template)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#143425] hover:bg-[#1C4834] text-white text-xs font-semibold shadow-2xs transition-colors"
                      >
                        <Edit3 className="h-3 w-3 text-[#C89B3C]" />
                        <span>Edit Template</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SMARTSTORE TEMPLATE EDITOR MODAL */}
      {isEditorOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#143425] text-white flex items-center justify-between border-b border-[#1C4834]">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#1C4834] flex items-center justify-center text-[#C89B3C]">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm tracking-wide">
                    Edit Template: {selectedTemplate.name}
                  </h3>
                  <p className="text-[11px] text-stone-300">
                    Smartstore CMS Tokenized HTML Messaging Layout
                  </p>
                </div>
              </div>

              {/* Tabs & Close */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#1C4834] p-1 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      activeTab === "edit" ? "bg-[#143425] text-white shadow-xs" : "text-stone-300 hover:text-white"
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("preview");
                      handleLoadPreview();
                    }}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      activeTab === "preview" ? "bg-[#143425] text-white shadow-xs" : "text-stone-300 hover:text-white"
                    }`}
                  >
                    Live Preview
                  </button>
                </div>

                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1 rounded-md text-stone-300 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {activeTab === "edit" ? (
              <form onSubmit={handleSaveTemplate} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                {/* Meta Settings Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-medium text-stone-700">Subject Line</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-stone-700">Email Gateway (Account)</label>
                    <select
                      value={formData.emailAccountId}
                      onChange={(e) => setFormData({ ...formData, emailAccountId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-hidden focus:border-[#143425] bg-white"
                    >
                      <option value="">Default Account</option>
                      {emailAccounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.displayName} ({acc.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-stone-700">Active Status</label>
                    <div className="pt-1.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                          formData.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {formData.isActive ? (
                          <>
                            <ToggleRight className="h-4 w-4" />
                            <span>Enabled</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-4 w-4" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Available Dynamic Tokens Drawer */}
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-800 text-[11px] uppercase tracking-wider">
                      Dynamic %Tokens% Available for this Template:
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Click any token to insert into body or copy
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {selectedTemplate.availableTokens.map((token) => (
                      <button
                        key={token}
                        type="button"
                        onClick={() => handleInsertToken(token)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-stone-300 hover:border-[#143425] hover:text-[#143425] text-[11px] font-mono text-stone-700 transition-colors shadow-2xs"
                      >
                        <span>{token}</span>
                        {copiedToken === token ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Plus className="h-3 w-3 text-stone-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* HTML Body Editor */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-stone-700 flex items-center gap-1.5">
                      <Code className="h-3.5 w-3.5 text-[#143425]" />
                      <span>HTML Body Template</span>
                    </label>
                    <span className="text-[11px] text-stone-400">Full HTML with inline styling</span>
                  </div>
                  <textarea
                    rows={12}
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    className="w-full p-3 font-mono text-xs rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#143425] leading-relaxed"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("preview");
                      handleLoadPreview();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Switch to Preview</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditorOpen(false)}
                      className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2 rounded-lg bg-[#143425] hover:bg-[#1C4834] text-white font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      {isSaving && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                      <span>Save Template</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                  <p className="text-stone-500">
                    <strong>Simulated Subject:</strong>{" "}
                    <span className="text-stone-900 font-semibold">{previewSubject}</span>
                  </p>
                </div>

                {isLoadingPreview ? (
                  <div className="p-12 text-center text-stone-500">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[#143425] mb-2" />
                    <p className="text-xs">Rendering dynamic tokens...</p>
                  </div>
                ) : (
                  <div className="p-4 bg-stone-100 rounded-xl border border-stone-200">
                    <div
                      className="bg-white rounded-lg shadow-xs overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEND TEST EMAIL MODAL */}
      {isTestModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-[#143425] text-white flex items-center justify-between">
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

            <form onSubmit={handleSendTestEmail} className="p-5 space-y-4 text-xs">
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-stone-600 space-y-1">
                <p>
                  <strong>Template:</strong> {selectedTemplate.name}
                </p>
                <p className="text-[11px] text-stone-500">
                  Will render with mock customer/order tokens and dispatch through the configured SMTP account.
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
                      <span>Send Test Template</span>
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
