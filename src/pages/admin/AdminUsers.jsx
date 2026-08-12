import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, Ban, Download, Shield, ShieldOff, Plus, ClipboardList, Edit, X, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userService, taskService } from "../../services/api";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const { user: currentUser } = useAuth();
  
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = currentUser?.role === "superadmin";
  const isAdmin = currentUser?.role === "admin";

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ fullName: "", email: "" });
  const [mockInviteLink, setMockInviteLink] = useState("");

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ assignedTo: null, title: "", description: "" });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ userId: null, fullName: "", email: "", phone: "", role: "", status: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll({ limit: 100 }); // Pagination can be added later
      setUsersList(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const canEditUser = (targetRole) => {
    if (isSuperAdmin && targetRole !== "superadmin") return true;
    if (isAdmin && targetRole === "donor") return true;
    return false;
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.inviteAdmin(inviteForm);
      setMockInviteLink(response.data.setupUrl || `http://localhost:5173/setup-password/${response.data.adminId}`);
      fetchUsers();
    } catch (error) {
      console.error("Invite failed:", error);
      alert("Failed to invite admin.");
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await taskService.create({
        title: taskForm.title,
        description: taskForm.description,
        assignedTo: taskForm.assignedTo,
        priority: "Medium"
      });
      setShowTaskModal(false);
      setTaskForm({ assignedTo: null, title: "", description: "" });
      alert("Task assigned successfully.");
    } catch (error) {
      console.error("Failed to assign task:", error);
      alert("Failed to assign task.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.update(editForm.userId, {
        fullName: editForm.fullName,
        email: editForm.email,
        phone: editForm.phone,
        role: editForm.role,
        status: editForm.status
      });
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user.");
    }
  };

  const handleDeleteUser = async (userId, fullName) => {
    if (window.confirm(`Are you sure you want to suspend/delete ${fullName}? This action cannot be undone.`)) {
      try {
        await userService.delete(userId);
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  const filteredUsers = usersList.filter(u => 
    u.fullName.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900 dark:text-white">Donors & Admins</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Manage users, admins, and roles.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-primary text-neutral-900 dark:text-white"
            />
          </div>
          {isSuperAdmin && (
            <button onClick={() => { setMockInviteLink(""); setShowInviteModal(true); }} className="btn-primary py-2 px-4 text-sm rounded-xl flex items-center gap-2 shrink-0">
              <Plus className="w-4 h-4" />
              Invite Admin
            </button>
          )}
          <button className="btn-secondary py-2 px-4 text-sm rounded-xl flex items-center gap-2 shrink-0">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-neutral-500">Loading users...</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {filteredUsers.map(u => (
                  <tr key={u._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {u.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-neutral-900 dark:text-white">{u.fullName}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${u.role === 'superadmin' ? 'bg-amber-500/10 text-amber-600' : 
                          u.role === 'admin' ? 'bg-primary/10 text-primary' : 
                          'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
                        ${u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isSuperAdmin && u.role === 'admin' && (
                          <button 
                            onClick={() => { setTaskForm({ ...taskForm, assignedTo: u._id }); setShowTaskModal(true); }}
                            className="p-2 text-neutral-400 hover:text-blue-500 transition-colors bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-blue-500/50 shadow-sm" 
                            title="Assign Task"
                          >
                            <ClipboardList className="w-4 h-4" />
                          </button>
                        )}
                        
                        {canEditUser(u.role) ? (
                          <>
                            <button 
                              onClick={() => { 
                                setEditForm({ 
                                  userId: u._id, 
                                  fullName: u.fullName,
                                  email: u.email,
                                  phone: u.phone || "",
                                  role: u.role,
                                  status: u.status
                                }); 
                                setShowEditModal(true); 
                              }}
                              className="p-2 text-neutral-400 hover:text-primary transition-colors bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm" 
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-neutral-400 hover:text-primary transition-colors bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-primary/50 shadow-sm" title="Email User"><Mail className="w-4 h-4" /></button>
                            <button className="p-2 text-neutral-400 hover:text-red-500 transition-colors bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-red-500/50 shadow-sm" title={u.status === 'Active' ? "Suspend User" : "Activate User"}><Ban className="w-4 h-4" /></button>
                            <button 
                              onClick={() => handleDeleteUser(u._id, u.fullName)}
                              className="p-2 text-neutral-400 hover:text-red-600 transition-colors bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-red-600/50 shadow-sm ml-2" 
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs font-semibold text-neutral-400 px-2">Secured</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-md relative">
              <button onClick={() => setShowInviteModal(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white">Invite New Admin</h2>
              {!mockInviteLink ? (
                <form onSubmit={handleInviteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 dark:text-neutral-300">Full Name</label>
                    <input type="text" required value={inviteForm.fullName} onChange={(e) => setInviteForm({...inviteForm, fullName: e.target.value})} className="w-full px-4 py-2 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 dark:text-neutral-300">Email Address</label>
                    <input type="email" required value={inviteForm.email} onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})} className="w-full px-4 py-2 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white" />
                  </div>
                  <button type="submit" className="w-full btn-primary py-3 rounded-xl mt-2">Send Invitation</button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-neutral-500 mb-4">Invitation sent! The new admin can set up their password using the link below:</p>
                  <a href={mockInviteLink} target="_blank" rel="noreferrer" className="text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-lg break-all inline-block hover:underline">{mockInviteLink}</a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-md relative">
              <button onClick={() => setShowTaskModal(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white">Assign Task</h2>
              <form onSubmit={handleTaskSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-neutral-300">Task Title</label>
                  <input type="text" required value={taskForm.title} onChange={(e) => setTaskForm({...taskForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-neutral-300">Description</label>
                  <textarea required value={taskForm.description} onChange={(e) => setTaskForm({...taskForm, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl h-24 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"></textarea>
                </div>
                <button type="submit" className="w-full btn-primary py-3 rounded-xl mt-2">Assign Task</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto pt-24 pb-12">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-md relative my-auto">
              <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white">Edit User Details</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-neutral-300">Full Name</label>
                  <input type="text" required value={editForm.fullName} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} className="w-full px-4 py-2 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-neutral-300">Email Address</label>
                  <input type="email" required value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full px-4 py-2 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-neutral-300">Phone</label>
                  <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full px-4 py-2 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 dark:text-neutral-300">Role</label>
                    <select 
                      value={editForm.role} 
                      onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white ${!isSuperAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!isSuperAdmin || editForm.role === 'superadmin'}
                    >
                      <option value="donor">Donor</option>
                      <option value="admin">Admin</option>
                      {editForm.role === 'superadmin' && <option value="superadmin">Super Admin</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 dark:text-neutral-300">Status</label>
                    <select 
                      value={editForm.status} 
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full px-4 py-2 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending Setup">Pending Setup</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full btn-primary py-3 rounded-xl mt-4">Save Changes</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
