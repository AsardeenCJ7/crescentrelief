import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MoreVertical, Edit, Trash2, Eye } from "lucide-react";

const MOCK_CAMPAIGNS = [
  { id: 1, title: "Gaza Emergency Relief", category: "Emergency", target: "$500,000", raised: "$350,000", status: "Active", urgent: true },
  { id: 2, title: "Clean Water for Yemen", category: "Water", target: "$100,000", raised: "$85,000", status: "Active", urgent: false },
  { id: 3, title: "Orphan Sponsorship Program", category: "Education", target: "$200,000", raised: "$50,000", status: "Active", urgent: false },
  { id: 4, title: "Ramadan Food Parcels", category: "Food", target: "$50,000", raised: "$55,000", status: "Completed", urgent: false },
  { id: 5, title: "Syria Medical Supplies", category: "Medical", target: "$150,000", raised: "$20,000", status: "Paused", urgent: false },
];

export default function AdminCampaigns() {
  const [search, setSearch] = useState("");

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900 dark:text-white">Campaigns</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Manage and track all fundraising campaigns.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-primary dark:focus:border-primary text-neutral-900 dark:text-white transition-colors"
            />
          </div>
          <button className="btn-primary py-2 px-4 text-sm rounded-xl flex items-center gap-2 w-full sm:w-auto justify-center shrink-0">
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Table Container - Mobile Responsive */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Campaign Name</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Target / Raised</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {MOCK_CAMPAIGNS.map(campaign => (
                <tr key={campaign.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {campaign.urgent && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>}
                      <span className="font-bold text-sm text-neutral-900 dark:text-white">{campaign.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">{campaign.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">{campaign.raised}</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">of {campaign.target}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
                      ${campaign.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 
                        campaign.status === 'Completed' ? 'bg-primary/10 text-primary' : 
                        'bg-amber-500/10 text-amber-500'}`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-neutral-400 hover:text-primary transition-colors bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-primary/50 shadow-sm"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-neutral-400 hover:text-primary transition-colors bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-primary/50 shadow-sm"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 text-neutral-400 hover:text-red-500 transition-colors bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-red-500/50 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
          <span>Showing 1 to 5 of 24 campaigns</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-neutral-200 dark:border-neutral-800 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">Prev</button>
            <button className="px-3 py-1 bg-primary text-white rounded-md">1</button>
            <button className="px-3 py-1 border border-neutral-200 dark:border-neutral-800 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">2</button>
            <button className="px-3 py-1 border border-neutral-200 dark:border-neutral-800 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">Next</button>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
