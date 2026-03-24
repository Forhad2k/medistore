import React, { useEffect, useState } from "react";
import { Search, Users, Ban, CheckCircle } from "lucide-react";
import { User, PaginationMeta } from "../../types";
import { adminApi } from "../../api/admin";
import { formatDate, getErrorMessage } from "../../utils";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/common/Spinner";
import Badge from "../../components/common/Badge";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import toast from "react-hot-toast";

const AdminUsersPage: React.FC = () => {
  const [users, setUsers]           = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [updating, setUpdating]     = useState<string | null>(null);

  const load = (p = 1) => {
    setLoading(true);
    adminApi.getUsers({ page: p, search: search || undefined, role: roleFilter || undefined })
      .then((r) => { setUsers(r.data.data.users); setPagination(r.data.data.pagination); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);
  useEffect(() => { setPage(1); load(1); }, [search, roleFilter]);

  const toggleBan = async (user: User) => {
    setUpdating(user.id);
    try {
      await adminApi.updateStatus(user.id, !user.isBanned);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, isBanned: !u.isBanned } : u));
      toast.success(user.isBanned ? "User unbanned" : "User banned");
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setUpdating(null); }
  };

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-100">Users</h1>
          {pagination && <p className="text-gray-600 text-sm mt-0.5">{pagination.total} registered users</p>}
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-lg pl-9 pr-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-500/50"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-surface-card border border-surface-border rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none focus:border-brand-500/50"
          >
            <option value="">All roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="SELLER">Seller</option>
          </select>
        </div>

        {loading ? <Spinner size={28} className="py-20" /> : users.length === 0 ? (
          <EmptyState icon={<Users size={28} />} title="No users found" />
        ) : (
          <>
            <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border">
                    {["User", "Role", "Joined", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-surface-border last:border-0 hover:bg-surface-hover transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-brand-400 text-xs font-bold">{u.name[0].toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-300">{u.name}</p>
                            <p className="text-xs text-gray-600">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${u.role === "SELLER" ? "text-purple-400" : "text-blue-400"}`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Badge className={u.isBanned ? "text-red-400 bg-red-400/10 border-red-400/20" : "text-brand-400 bg-brand-400/10 border-brand-400/20"}>
                          {u.isBanned ? "Banned" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleBan(u)}
                          disabled={updating === u.id}
                          className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg border transition-all disabled:opacity-50
                            ${u.isBanned
                              ? "text-brand-400 border-brand-500/20 hover:bg-brand-500/10"
                              : "text-red-400 border-red-500/20 hover:bg-red-500/10"}`}
                        >
                          {u.isBanned ? <><CheckCircle size={12} /> Unban</> : <><Ban size={12} /> Ban</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && <Pagination meta={pagination} onPageChange={setPage} />}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsersPage;
