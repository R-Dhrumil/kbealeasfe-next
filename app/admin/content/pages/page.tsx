"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/api";
import { triggerRevalidate } from "@/service/cms";

interface PageRecord {
  id: string;
  title: string;
  slug: string;
  metaDescription?: string | null;
  htmlContent?: string;
  isPublished: boolean;
  updatedAt: string;
}

export default function AdminCustomPagesPage() {
  const [pages, setPages] = useState<PageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formMetaDesc, setFormMetaDesc] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [activeEditorTab, setActiveEditorTab] = useState<"edit" | "preview">("edit");
  const [isCustomSlug, setIsCustomSlug] = useState(false);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const loadPages = async () => {
    try {
      setIsLoading(true);
      const data = await fetchApi("/content/pages");
      if (Array.isArray(data)) {
        setPages(data);
      }
    } catch (err: any) {
      console.error("Failed to load custom pages:", err);
      showStatus("error", "Failed to load pages. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!isCustomSlug && !editingPageId) {
      setFormSlug(generateSlugFromTitle(val));
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPageId(null);
    setFormTitle("");
    setFormSlug("");
    setFormMetaDesc("");
    setFormContent("<h2>1. Section Heading</h2>\n<p>Enter your editorial or policy content here. You can use standard formatting or clean HTML tags.</p>");
    setFormIsPublished(true);
    setIsCustomSlug(false);
    setActiveEditorTab("edit");
    setModalOpen(true);
  };

  const handleOpenEditModal = async (pageSummary: PageRecord) => {
    try {
      setIsLoading(true);
      const fullPage = await fetchApi(`/content/pages/id/${pageSummary.id}`);
      setEditingPageId(fullPage.id);
      setFormTitle(fullPage.title);
      setFormSlug(fullPage.slug);
      setFormMetaDesc(fullPage.metaDescription || "");
      setFormContent(fullPage.htmlContent || "");
      setFormIsPublished(fullPage.isPublished);
      setIsCustomSlug(true);
      setActiveEditorTab("edit");
      setModalOpen(true);
    } catch (err: any) {
      showStatus("error", "Failed to load page content for editing.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showStatus("error", "Please provide a page title.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      title: formTitle.trim(),
      slug: formSlug.trim() || generateSlugFromTitle(formTitle),
      metaDescription: formMetaDesc.trim() || null,
      htmlContent: formContent,
      isPublished: formIsPublished,
    };

    try {
      if (editingPageId) {
        await fetchApi(`/content/pages/${editingPageId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        showStatus("success", "Page updated successfully!");
      } else {
        await fetchApi("/content/pages", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showStatus("success", "New page published successfully!");
      }

      await triggerRevalidate("pages");
      await triggerRevalidate(`page-${payload.slug}`);
      setModalOpen(false);
      await loadPages();
    } catch (err: any) {
      showStatus("error", err?.message || "Failed to save page.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (page: PageRecord) => {
    try {
      await fetchApi(`/content/pages/${page.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: page.title,
          slug: page.slug,
          metaDescription: page.metaDescription,
          htmlContent: page.htmlContent,
          isPublished: !page.isPublished,
        }),
      });
      await triggerRevalidate("pages");
      await triggerRevalidate(`page-${page.slug}`);
      showStatus("success", `Page ${!page.isPublished ? "published" : "set to draft"}!`);
      await loadPages();
    } catch {
      showStatus("error", "Failed to update page status.");
    }
  };

  const handleDeletePage = async (id: string, slug: string) => {
    if (!confirm("Are you sure you want to permanently delete this page?")) return;
    try {
      await fetchApi(`/content/pages/${id}`, { method: "DELETE" });
      await triggerRevalidate("pages");
      await triggerRevalidate(`page-${slug}`);
      showStatus("success", "Page deleted successfully!");
      await loadPages();
    } catch {
      showStatus("error", "Failed to delete page.");
    }
  };

  // Quick formatting helpers for the rich content editor
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("page-content-editor") as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = formContent.substring(start, end);
    const replacement = `${prefix}${selected || "Sample Text"}${suffix}`;
    const newContent = formContent.substring(0, start) + replacement + formContent.substring(end);
    setFormContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 11));
    }, 0);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E8F2EC] text-[#143425] text-xs font-semibold mb-1">
            <FileText className="h-3.5 w-3.5 text-[#A87E28]" />
            <span>Storefront Legal & Informational CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#143425]">
            Custom Pages & Legal Policies
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage static and policy pages (Privacy Policy, Terms of Service, Shipping, FAQs). Changes reflect instantly on live URLs.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreateModal}
          className="gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Page</span>
        </Button>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Pages Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        {isLoading && pages.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#143425]" />
            <p className="text-xs text-stone-500 font-medium">Loading pages...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="h-10 w-10 mx-auto text-stone-300" />
            <p className="font-bold text-sm text-stone-700">No Custom Pages Found</p>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Create your first static page such as an About Us, FAQ, or Policy page.
            </p>
            <Button variant="primary" size="sm" onClick={handleOpenCreateModal}>
              Create First Page
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-stone-50/70 text-[11px] font-bold uppercase tracking-wider text-stone-500">
              <span className="col-span-5">Page Title & URL</span>
              <span className="col-span-3">Status</span>
              <span className="col-span-2">Last Updated</span>
              <span className="col-span-2 text-right">Actions</span>
            </div>

            {pages.map((page) => (
              <div
                key={page.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-stone-50/50 transition-colors text-xs"
              >
                <div className="col-span-5 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-stone-900 text-sm">
                      {page.title}
                    </span>
                    <Link
                      href={`/${page.slug}`}
                      target="_blank"
                      className="text-stone-400 hover:text-[#143425] p-1 rounded transition-colors"
                      title="View live page"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <p className="text-[11px] font-mono text-stone-400">/{page.slug}</p>
                </div>

                <div className="col-span-3">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(page)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[11px] transition-colors ${
                      page.isPublished
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-stone-100 text-stone-600 border border-stone-200"
                    }`}
                  >
                    {page.isPublished ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    <span>{page.isPublished ? "Published" : "Draft"}</span>
                  </button>
                </div>

                <div className="col-span-2 text-[11px] text-stone-400 font-mono">
                  {new Date(page.updatedAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </div>

                <div className="col-span-2 flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(page)}
                    className="p-2 rounded-xl text-stone-500 hover:text-[#143425] hover:bg-stone-100 transition-colors"
                    title="Edit Page"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePage(page.id, page.slug)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Page"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-[#143425]">
                {editingPageId ? "Edit Custom Page" : "Create New Custom Page"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Shipping & Delivery Policy"
                    className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    URL Slug *
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-stone-400 font-mono">/</span>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={(e) => {
                        setIsCustomSlug(true);
                        setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                      }}
                      placeholder="shipping-policy"
                      className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs font-mono focus:ring-1 focus:ring-[#143425]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    SEO Meta Description (optional)
                  </label>
                  <input
                    type="text"
                    value={formMetaDesc}
                    onChange={(e) => setFormMetaDesc(e.target.value)}
                    placeholder="Brief 150-character summary for Google search results..."
                    className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                  />
                </div>

                {/* Content Editor Zone */}
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                      Page Content (HTML / Text) *
                    </label>
                    <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs">
                      <button
                        type="button"
                        onClick={() => setActiveEditorTab("edit")}
                        className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                          activeEditorTab === "edit" ? "bg-white text-[#143425] shadow-2xs" : "text-stone-500"
                        }`}
                      >
                        Editor
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveEditorTab("preview")}
                        className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                          activeEditorTab === "preview" ? "bg-white text-[#143425] shadow-2xs" : "text-stone-500"
                        }`}
                      >
                        Live Preview
                      </button>
                    </div>
                  </div>

                  {activeEditorTab === "edit" ? (
                    <div className="space-y-1.5 border border-stone-300 rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-[#143425]">
                      {/* Editor Toolbar */}
                      <div className="flex flex-wrap items-center gap-1 p-2 bg-stone-50 border-b border-stone-200 text-stone-600">
                        <button
                          type="button"
                          onClick={() => insertFormatting("<strong>", "</strong>")}
                          className="p-1.5 rounded hover:bg-stone-200"
                          title="Bold"
                        >
                          <Bold className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("<em>", "</em>")}
                          className="p-1.5 rounded hover:bg-stone-200"
                          title="Italic"
                        >
                          <Italic className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-px h-4 bg-stone-300 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormatting("<h2>", "</h2>\n")}
                          className="p-1.5 rounded hover:bg-stone-200"
                          title="Heading 2"
                        >
                          <Heading1 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("<h3>", "</h3>\n")}
                          className="p-1.5 rounded hover:bg-stone-200"
                          title="Heading 3"
                        >
                          <Heading2 className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-px h-4 bg-stone-300 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormatting("<ul>\n  <li>", "</li>\n</ul>\n")}
                          className="p-1.5 rounded hover:bg-stone-200"
                          title="Bullet List"
                        >
                          <List className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("<ol>\n  <li>", "</li>\n</ol>\n")}
                          className="p-1.5 rounded hover:bg-stone-200"
                          title="Numbered List"
                        >
                          <ListOrdered className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("<blockquote>\n  ", "\n</blockquote>\n")}
                          className="p-1.5 rounded hover:bg-stone-200"
                          title="Blockquote"
                        >
                          <Quote className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('<a href="https://" class="text-[#143425] underline">', "</a>")}
                          className="p-1.5 rounded hover:bg-stone-200"
                          title="Insert Link"
                        >
                          <LinkIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("<p>", "</p>\n")}
                          className="p-1.5 rounded hover:bg-stone-200 text-[11px] font-mono font-bold"
                          title="Paragraph"
                        >
                          &lt;p&gt;
                        </button>
                      </div>

                      <textarea
                        id="page-content-editor"
                        rows={12}
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        placeholder="Write content using standard headings, paragraphs, and lists..."
                        className="w-full p-4 text-xs font-mono border-0 focus:ring-0 leading-relaxed"
                      />
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/50 min-h-[300px] max-h-[450px] overflow-y-auto prose prose-stone prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: formContent }} />
                    </div>
                  )}
                </div>

                {/* Publish Toggle */}
                <div className="sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPublished}
                      onChange={(e) => setFormIsPublished(e.target.checked)}
                      className="h-4 w-4 rounded text-[#143425] focus:ring-[#143425]"
                    />
                    <span className="text-xs font-semibold text-stone-700">
                      Publish immediately on live storefront (unchecked keeps page in Draft)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving Page..." : editingPageId ? "Update Page" : "Publish Page"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
