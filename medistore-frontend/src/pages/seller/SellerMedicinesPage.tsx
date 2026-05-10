import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Package, Upload } from "lucide-react";
import { Medicine, Category } from "../../types";
import { medicinesApi, MedicineFormData } from "../../api/medicines";
import { categoriesApi } from "../../api/categories";
import { formatPrice, getErrorMessage } from "../../utils";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Modal from "../../components/common/Modal";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import { PaginationMeta } from "../../types";
import toast from "react-hot-toast";
import axios from "axios";

// Cloudinary config
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

const empty: MedicineFormData = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  manufacturer: "",
  imageUrl: "",
  categoryId: "",
  isAvailable: true,
};

const SellerMedicinesPage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Medicine | null>(null);

  const [form, setForm] = useState<MedicineFormData>(empty);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // blob URL for preview
  const [uploading, setUploading] = useState(false);

  const load = (p = 1) => {
    setLoading(true);

    medicinesApi
      .getMine({ page: p, limit: 10 })
      .then((r) => {
        setMedicines(r.data.data.medicines);
        setPagination(r.data.data.pagination);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(page);
  }, [page]);

  useEffect(() => {
    categoriesApi.getAll().then((r) => setCategories(r.data.data));
  }, []);

  // Revoke blob URL when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetImageState = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageFile(null);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    resetImageState();
    setModalOpen(true);
  };

  const openEdit = (m: Medicine) => {
    setEditing(m);

    setForm({
      name: m.name,
      description: m.description ?? "",
      price: Number(m.price),
      stock: m.stock,
      manufacturer: m.manufacturer ?? "",
      imageUrl: m.imageUrl ?? "",
      categoryId: m.category.id,
      isAvailable: m.isAvailable,
    });

    resetImageState();
    setModalOpen(true);
  };

  const handleModalClose = () => {
    resetImageState();
    setModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke old blob URL before creating a new one
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (): Promise<string> => {
    if (!imageFile) return form.imageUrl as string;

    try {
      setUploading(true);

      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", UPLOAD_PRESET);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data
      );

      return response.data.secure_url as string;
    } catch (error) {
      toast.error("Image upload failed");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.categoryId || form.price <= 0) {
      toast.error("Please fill required fields");
      return;
    }

    setSaving(true);

    try {
      // Upload image first, then save medicine
      const imageUrl = await uploadImageToCloudinary();

      const payload: MedicineFormData = {
        ...form,
        imageUrl,
      };

      if (editing) {
        await medicinesApi.update(editing.id, payload);
        toast.success("Medicine updated");
      } else {
        await medicinesApi.create(payload);
        toast.success("Medicine added");
      }

      handleModalClose();
      load(page);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this medicine?")) return;

    setDeleting(id);

    try {
      await medicinesApi.remove(id);
      toast.success("Medicine deleted");
      load(page);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(null);
    }
  };

  const setF =
    (field: keyof MedicineFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm((p) => ({
        ...p,
        [field]:
          field === "price" || field === "stock"
            ? Number(e.target.value)
            : e.target.value,
      }));

  return (
    <DashboardLayout requiredRole="SELLER">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-100">
              Inventory
            </h1>

            {pagination && (
              <p className="text-gray-600 text-sm mt-0.5">
                {pagination.total} medicines listed
              </p>
            )}
          </div>

          <Button onClick={openAdd} icon={<Plus size={15} />}>
            Add Medicine
          </Button>
        </div>

        {loading ? (
          <Spinner size={28} className="py-20" />
        ) : medicines.length === 0 ? (
          <EmptyState
            icon={<Package size={28} />}
            title="No medicines yet"
            description="Add your first product"
            action={
              <Button onClick={openAdd} size="sm" icon={<Plus size={13} />}>
                Add Medicine
              </Button>
            }
          />
        ) : (
          <>
            <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border">
                    {[
                      "Medicine",
                      "Category",
                      "Price",
                      "Stock",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {medicines.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-surface-border last:border-0 hover:bg-surface-hover transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-surface overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {m.imageUrl ? (
                              <img
                                src={m.imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package size={13} className="text-gray-700" />
                            )}
                          </div>

                          <span className="font-medium text-gray-300 truncate max-w-[140px]">
                            {m.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-gray-500">
                        {m.category.name}
                      </td>

                      <td className="px-4 py-3 text-brand-400 font-medium">
                        {formatPrice(m.price)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`font-medium ${
                            m.stock === 0
                              ? "text-red-400"
                              : m.stock < 10
                              ? "text-yellow-400"
                              : "text-brand-400"
                          }`}
                        >
                          {m.stock}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            m.isAvailable
                              ? "text-brand-400 bg-brand-500/10 border-brand-500/20"
                              : "text-gray-500 bg-gray-500/10 border-gray-500/20"
                          }`}
                        >
                          {m.isAvailable ? "Active" : "Hidden"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(m)}
                            className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-surface-hover rounded-lg transition-all"
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            onClick={() => handleDelete(m.id)}
                            disabled={deleting === m.id}
                            className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && (
              <Pagination meta={pagination} onPageChange={setPage} />
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        title={editing ? "Edit Medicine" : "Add Medicine"}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              label="Medicine name *"
              value={form.name}
              onChange={setF("name")}
              placeholder="e.g. Paracetamol 500mg"
            />
          </div>

          <Input
            label="Price (৳) *"
            type="number"
            min={0}
            step={0.01}
            value={form.price}
            onChange={setF("price")}
          />

          <Input
            label="Stock *"
            type="number"
            min={0}
            value={form.stock}
            onChange={setF("stock")}
          />

          <Select
            label="Category *"
            value={form.categoryId}
            onChange={
              setF("categoryId") as React.ChangeEventHandler<HTMLSelectElement>
            }
            options={[
              { value: "", label: "Select category..." },
              ...categories.map((c) => ({
                value: c.id,
                label: c.name,
              })),
            ]}
          />

          <Input
            label="Manufacturer"
            value={form.manufacturer ?? ""}
            onChange={setF("manufacturer")}
            placeholder="e.g. Square Pharma"
          />

          {/* Cloudinary Image Upload */}
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-300 block mb-2">
              Product Image
            </label>

            <label className="flex items-center gap-2 px-4 py-3 border border-surface-border rounded-lg bg-surface cursor-pointer hover:bg-surface-hover transition">
              <Upload size={16} />

              <span className="text-sm text-gray-300">
                {imageFile ? imageFile.name : "Choose image"}
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {/* Image preview — uses blob URL for new file, Cloudinary URL for existing */}
            {(previewUrl || form.imageUrl) && (
              <div className="mt-3">
                <img
                  src={previewUrl ?? form.imageUrl}
                  alt="Preview"
                  className="w-28 h-28 rounded-lg object-cover border border-surface-border"
                />
              </div>
            )}
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-300 block mb-1.5">
              Description
            </label>

            <textarea
              value={form.description ?? ""}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
              rows={3}
              placeholder="Product description..."
              className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-500/50 resize-none"
            />
          </div>

          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="avail"
              checked={form.isAvailable}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  isAvailable: e.target.checked,
                }))
              }
              className="w-4 h-4 accent-brand-500"
            />

            <label htmlFor="avail" className="text-sm text-gray-400">
              Listed / Available for purchase
            </label>
          </div>
        </div>

        <div className="flex gap-2 mt-5 justify-end">
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>

          <Button onClick={handleSave} loading={saving || uploading}>
            {editing ? "Update" : "Add Medicine"}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default SellerMedicinesPage;