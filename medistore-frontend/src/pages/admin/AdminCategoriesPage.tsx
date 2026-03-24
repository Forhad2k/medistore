import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { Category } from "../../types";
import { categoriesApi } from "../../api/categories";
import { getErrorMessage } from "../../utils";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import toast from "react-hot-toast";

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Category | null>(null);
  const [form, setForm]           = useState({ name: "", description: "" });
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState<string | null>(null);

  const load = () => {
    categoriesApi.getAll().then((r) => setCategories(r.data.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm({ name: "", description: "" }); setModalOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, description: c.description ?? "" }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      if (editing) { await categoriesApi.update(editing.id, form); toast.success("Category updated"); }
      else { await categoriesApi.create(form); toast.success("Category created"); }
      setModalOpen(false); load();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    setDeleting(id);
    try {
      await categoriesApi.remove(id);
      toast.success("Category deleted");
      load();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setDeleting(null); }
  };

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-100">Categories</h1>
            <p className="text-gray-600 text-sm mt-0.5">{categories.length} categories</p>
          </div>
          <Button onClick={openAdd} icon={<Plus size={15} />}>Add Category</Button>
        </div>

        {loading ? <Spinner size={28} className="py-20" /> : categories.length === 0 ? (
          <EmptyState icon={<Tag size={28} />} title="No categories" action={<Button onClick={openAdd} size="sm">Add first category</Button>} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-surface-card border border-surface-border rounded-xl p-4 flex items-start justify-between gap-3 hover:border-brand-500/20 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-brand-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Tag size={15} className="text-brand-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-300">{cat.name}</p>
                    {cat.description && <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{cat.description}</p>}
                    {cat._count && <p className="text-xs text-gray-700 mt-1">{cat._count.medicines} medicines</p>}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(cat)} className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-surface-hover rounded-lg transition-all">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} disabled={deleting === cat.id} className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "Add Category"} size="sm">
        <div className="flex flex-col gap-4">
          <Input label="Category name *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Pain Relief" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Brief description..."
              className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-500/50 resize-none" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? "Update" : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminCategoriesPage;
