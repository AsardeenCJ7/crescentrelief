import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, X, Loader2, Image, AlertTriangle, CheckCircle, Save, ChevronDown, Filter } from "lucide-react";
import { FaYoutube } from "react-icons/fa6";
import { campaignService, miscService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const DONATION_CATEGORIES = [
  "Zakat", "Sadaqah", "Lillah", "Qurbani / Udhiya", "Fidya",
  "Sadaqatul Fitr / Fitrana", "Food Pack", "Mosque Project",
  "Shelter Project", "Widows Support", "Water Project",
  "Emergency Relief", "Orphan Support", "Education Support",
  "Medical Aid", "Winter Appeal", "Palestine / Gaza Emergency Appeal",
  "General Donation"
];

const STATUS_OPTIONS = ["Active", "Draft", "Closed", "Paused", "Completed"];

const FIELD_CLASS = "w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-neutral-700 transition-all text-sm";
const LABEL_CLASS = "block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5";

const defaultForm = {
  title: "", description: "", longDescription: "",
  category: "General Donation", goal: "",
  image: "", videoUrl: "", urgent: false, status: "Active",
  startDate: "", endDate: ""
};

const statusBadge = (status) => {
  const styles = {
    Active:    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    Draft:     "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    Closed:    "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300",
    Completed: "bg-primary/10 text-primary",
    Paused:    "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    Archived:  "bg-red-100 dark:bg-red-900/30 text-red-500",
  };
  return `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${styles[status] || styles.Draft}`;
};

export default function AdminCampaigns() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // campaign obj to confirm delete

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingFile(true);
      const res = await miscService.uploadFile(file);
      if (res.url) set("image", res.url);
    } catch (err) {
      showToast(err.message || "Upload failed.", "error");
    } finally {
      setUploadingFile(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await campaignService.getAll({ status: "all", limit: 100 });
      setCampaigns(res.data || []);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, overrideStatus) => {
    e?.preventDefault();
    const statusToSave = overrideStatus || formData.status;
    try {
      if (overrideStatus === "Draft") setSavingDraft(true); else setSubmitting(true);
      const payload = {
        ...formData,
        status: statusToSave,
        goal: Number(formData.goal),
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      };
      if (editingId) {
        await campaignService.update(editingId, payload);
        showToast("Campaign updated successfully!");
      } else {
        await campaignService.create(payload);
        showToast(statusToSave === "Draft" ? "Campaign saved as draft!" : "Campaign published successfully!");
      }
      closeModal();
      fetchCampaigns();
    } catch (err) {
      showToast(err.message || "Failed to save campaign.", "error");
    } finally {
      setSubmitting(false);
      setSavingDraft(false);
    }
  };

  const handleEditClick = (campaign) => {
    setFormData({
      title: campaign.title || "",
      description: campaign.description || "",
      longDescription: campaign.longDescription || "",
      category: campaign.category || "General Donation",
      goal: campaign.goal || "",
      image: campaign.image || "",
      videoUrl: campaign.videoUrl || "",
      urgent: !!campaign.urgent,
      status: campaign.status || "Active",
      startDate: campaign.startDate ? campaign.startDate.split("T")[0] : "",
      endDate: campaign.endDate ? campaign.endDate.split("T")[0] : "",
    });
    setEditingId(campaign._id);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    try {
      const isArchived = confirmDelete.status === "Archived";
      await campaignService.delete(confirmDelete._id, isArchived);
      showToast(isArchived ? "Campaign permanently deleted." : "Campaign archived successfully.");
      setConfirmDelete(null);
      fetchCampaigns();
    } catch (err) {
      showToast(err.message || "Failed to delete campaign.", "error");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(defaultForm);
    setEditingId(null);
  };

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const filtered = campaigns.filter(c => {
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase()) || c.category?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" ? c.status !== "Archived" : c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = campaigns.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -24, scale: 0.95 }}
            className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl font-semibold text-sm text-white ${toast.type === "error" ? "bg-red-600" : "bg-emerald-600"}`}
          >
            {toast.type === "error" ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Dialog */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" onClick={() => setConfirmDelete(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
              className="pointer-events-none">
              <div className="pointer-events-auto bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="font-bold text-neutral-900 dark:text-white text-lg mb-2">
                  {confirmDelete.status === "Archived" ? "Delete Permanently" : "Archive Campaign"}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
                  "<strong className="text-neutral-700 dark:text-neutral-300">{confirmDelete.title}</strong>" will be {confirmDelete.status === "Archived" ? "permanently deleted from the database. This action cannot be undone." : "archived. You can restore it later if needed."}
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleDeleteConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors">
                    {confirmDelete.status === "Archived" ? "Delete Permanently" : "Archive"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900 dark:text-white">Campaigns</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-0.5">
            {campaigns.length} total · {counts.Active || 0} active · {counts.Draft || 0} drafts
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl overflow-x-auto no-scrollbar">
            {["all", "Active", "Draft", "Closed", "Completed", "Paused", "Archived"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === s ? "bg-white dark:bg-neutral-700 shadow text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"}`}>
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" placeholder="Search campaigns..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-52 pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-primary text-neutral-900 dark:text-white transition-colors" />
          </div>
          <button onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-neutral-400" />
            </div>
            <p className="font-semibold text-neutral-900 dark:text-white">No campaigns found</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Try changing your filter or create a new campaign.</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="block md:hidden divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map(c => (
                <div key={c._id} className="p-4 flex items-start gap-3">
                  {c.image ? (
                    <img src={c.image} alt={c.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Image className="w-7 h-7 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      {c.urgent && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                      <span className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1">{c.title}</span>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{c.category}</span>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="text-sm font-bold text-neutral-900 dark:text-white">£{(c.raised || 0).toLocaleString()}</span>
                        <span className="text-xs text-neutral-400 ml-1">/ £{(c.goal || 0).toLocaleString()}</span>
                      </div>
                      <span className={statusBadge(c.status)}>{c.status}</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(((c.raised || 0) / (c.goal || 1)) * 100, 100)}%` }} />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <a href={`/campaigns/${c._id}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-primary border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 transition-colors">
                        <Eye className="w-3.5 h-3.5" /> View
                      </a>
                      <button onClick={() => handleEditClick(c)} className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-primary border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 transition-colors">
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      {isSuperAdmin && (
                        <button onClick={() => setConfirmDelete(c)} className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-red-500 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" /> Archive
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
                    <th className="px-6 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Campaign</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filtered.map(c => (
                    <tr key={c._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {c.image ? (
                            <img src={c.image} alt={c.title} className="w-11 h-11 rounded-xl object-cover shrink-0 ring-1 ring-black/5" />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <Image className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              {c.urgent && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]" />}
                              <span className="font-semibold text-sm text-neutral-900 dark:text-white">{c.title}</span>
                            </div>
                            <span className="text-xs text-neutral-400">{c.donors || 0} donors</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2.5 py-1 rounded-lg">{c.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-36">
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-neutral-900 dark:text-white">£{(c.raised || 0).toLocaleString()}</span>
                            <span className="text-neutral-400">/ £{(c.goal || 0).toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(((c.raised || 0) / (c.goal || 1)) * 100, 100)}%` }} />
                          </div>
                          <span className="text-[10px] text-neutral-400 mt-0.5 block">{Math.min(Math.round(((c.raised || 0) / (c.goal || 1)) * 100), 100)}% funded</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={statusBadge(c.status)}>{c.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-0.5">
                          {c.startDate && <div>Start: {new Date(c.startDate).toLocaleDateString()}</div>}
                          {c.endDate && <div>End: {new Date(c.endDate).toLocaleDateString()}</div>}
                          {!c.startDate && !c.endDate && <span className="text-neutral-300 dark:text-neutral-600">—</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a href={`/campaigns/${c._id}`} target="_blank" rel="noreferrer"
                            className="p-2 text-neutral-400 hover:text-primary bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary/40 transition-all" title="View">
                            <Eye className="w-4 h-4" />
                          </a>
                          <button onClick={() => handleEditClick(c)}
                            className="p-2 text-neutral-400 hover:text-primary bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary/40 transition-all" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          {isSuperAdmin && (
                            <button onClick={() => setConfirmDelete(c)}
                              className="p-2 text-neutral-400 hover:text-red-500 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-red-400/40 transition-all" title="Archive">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
              className="bg-black/60 backdrop-blur-sm z-[9998]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", zIndex: 9999 }}
              className="pointer-events-none"
            >
              <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl flex flex-col pointer-events-auto"
                style={{ maxHeight: "min(92vh, 820px)" }}>

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${editingId ? "bg-blue-100 dark:bg-blue-900/30" : "bg-primary/10"}`}>
                      {editingId ? <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <Plus className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                        {editingId ? "Edit Campaign" : "Create New Campaign"}
                      </h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {editingId ? "Update campaign details" : "Fill in the details below"}
                      </p>
                    </div>
                  </div>
                  <button onClick={closeModal}
                    className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5" style={{ overscrollBehavior: "contain" }}>
                  <form id="campaignForm" onSubmit={handleSubmit}>
                    <div className="space-y-5">

                      {/* Row 1: Title + Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={LABEL_CLASS}>Campaign Title *</label>
                          <input type="text" required value={formData.title} onChange={e => set("title", e.target.value)}
                            className={FIELD_CLASS} placeholder="e.g., Clean Water for Yemen" />
                        </div>
                        <div>
                          <label className={LABEL_CLASS}>Category *</label>
                          <select value={formData.category} onChange={e => set("category", e.target.value)} className={FIELD_CLASS}>
                            {DONATION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Row 2: Goal + Status + Urgent */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className={LABEL_CLASS}>Goal Amount (£) *</label>
                          <input type="number" required min="1" value={formData.goal} onChange={e => set("goal", e.target.value)}
                            className={FIELD_CLASS} placeholder="50000" />
                        </div>
                        <div>
                          <label className={LABEL_CLASS}>Status</label>
                          <select value={formData.status} onChange={e => set("status", e.target.value)} className={FIELD_CLASS}>
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="flex items-end pb-0.5">
                          <label className="flex items-center gap-3 cursor-pointer group w-full p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:border-primary/50 transition-all">
                            <div className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${formData.urgent ? "bg-red-500" : "bg-neutral-300 dark:bg-neutral-600"}`}>
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.urgent ? "translate-x-5" : "translate-x-1"}`} />
                              <input type="checkbox" className="sr-only" checked={formData.urgent} onChange={e => set("urgent", e.target.checked)} />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                                {formData.urgent && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />} Urgent Appeal
                              </span>
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">Flag as critical</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Row 3: Start Date + End Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={LABEL_CLASS}>Start Date</label>
                          <input type="date" value={formData.startDate} onChange={e => set("startDate", e.target.value)} className={FIELD_CLASS} />
                          <p className="text-xs text-neutral-400 mt-1">Leave blank to start immediately</p>
                        </div>
                        <div>
                          <label className={LABEL_CLASS}>End Date</label>
                          <input type="date" value={formData.endDate} min={formData.startDate || undefined} onChange={e => set("endDate", e.target.value)} className={FIELD_CLASS} />
                          <p className="text-xs text-neutral-400 mt-1">Leave blank for open-ended campaign</p>
                        </div>
                      </div>

                      {/* Short Description */}
                      <div>
                        <label className={LABEL_CLASS}>Short Description *</label>
                        <textarea required rows={2} value={formData.description} onChange={e => set("description", e.target.value)}
                          className={`${FIELD_CLASS} resize-none`} placeholder="Brief summary shown on campaign cards..." />
                      </div>

                      {/* Full Story */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className={LABEL_CLASS + " mb-0"}>Full Story (Markdown)</label>
                          <span className="text-xs text-neutral-400 font-mono">### Heading · **bold** · - list</span>
                        </div>
                        <textarea rows={7} value={formData.longDescription} onChange={e => set("longDescription", e.target.value)}
                          className={`${FIELD_CLASS} resize-y font-mono text-xs`}
                          placeholder={"### The Crisis\n\nDescribe the situation...\n\n### Our Response\n\nExplain what we're doing...\n\n### How Your Donation Helps\n\n- £10 provides...\n- £50 provides..."} />
                      </div>

                      {/* Image + Video */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={LABEL_CLASS}><span className="flex items-center gap-1.5"><Image className="w-3.5 h-3.5" /> Cover Image</span></label>
                          <div className="space-y-2">
                            <div className="relative group border-2 border-dashed border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary rounded-xl p-3 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-800 transition-all cursor-pointer min-h-[80px]">
                              <input type="file" accept="image/*" onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={uploadingFile} />
                              {uploadingFile ? (
                                <div className="flex flex-col items-center gap-1">
                                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                  <span className="text-xs font-semibold text-neutral-500">Uploading...</span>
                                </div>
                              ) : formData.image ? (
                                <div className="text-center w-full">
                                  <img src={formData.image} alt="Preview" className="w-full h-20 object-cover rounded-lg mb-1" onError={e => e.target.style.display = "none"} />
                                  <span className="text-xs text-primary font-bold group-hover:underline">Click to replace</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center text-center">
                                  <Image className="w-5 h-5 text-neutral-400 mb-1 group-hover:text-primary transition-colors" />
                                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Upload cover image</span>
                                  <span className="text-[10px] text-neutral-400 mt-0.5">PNG, JPG, WEBP up to 5MB</span>
                                </div>
                              )}
                            </div>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-neutral-400 uppercase tracking-wider pointer-events-none">OR</span>
                              <input type="url" value={formData.image} onChange={e => set("image", e.target.value)}
                                className={FIELD_CLASS + " pl-10"} placeholder="Paste image URL..." />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className={LABEL_CLASS}><span className="flex items-center gap-1.5"><FaYoutube className="w-3.5 h-3.5 text-red-500" /> YouTube Video URL</span></label>
                          <input type="url" value={formData.videoUrl} onChange={e => set("videoUrl", e.target.value)}
                            className={FIELD_CLASS} placeholder="https://youtube.com/watch?v=..." />
                          <p className="text-xs text-neutral-400 mt-1.5">Paste any YouTube link — embeds automatically.</p>
                        </div>
                      </div>

                    </div>
                  </form>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between shrink-0 bg-neutral-50 dark:bg-neutral-900/50">
                  <button type="button" onClick={closeModal}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-sm text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    Cancel
                  </button>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    {/* Save as Draft */}
                    <button type="button" onClick={() => handleSubmit(null, "Draft")}
                      disabled={savingDraft || submitting}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all disabled:opacity-60">
                      {savingDraft ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {savingDraft ? "Saving..." : "Save Draft"}
                    </button>
                    {/* Publish / Update */}
                    <button type="submit" form="campaignForm"
                      disabled={submitting || savingDraft}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/25 hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {submitting ? "Saving..." : editingId ? "Update Campaign" : "Publish Campaign"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
