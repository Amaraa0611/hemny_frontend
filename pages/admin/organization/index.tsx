import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import { categoryService } from '../../../services/categoryService';

interface Category {
  id: number;
  name_en: string;
  name_mn: string;
  description_en: string | null;
  description_mn: string | null;
  parent_id: number | null;
  children?: Category[];
}

type CategoryForm = Omit<Category, 'id' | 'children'>;

const emptyForm: CategoryForm = {
  name_en: '',
  name_mn: '',
  description_en: '',
  description_mn: '',
  parent_id: null,
};

const OrganizationAdminPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<{ [id: number]: boolean }>({});

  // Fetch all categories
  const fetchCategories = () => {
    setLoading(true);
    setError(null);
    categoryService.getAll()
      .then(setCategories)
      .catch(() => setError('Failed to load categories.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Modal open/close helpers
  const openCreateModal = () => {
    setForm(emptyForm);
    setModalMode('create');
    setModalOpen(true);
    setEditId(null);
  };
  const openEditModal = (cat: Category) => {
    setForm({
      name_en: cat.name_en,
      name_mn: cat.name_mn,
      description_en: cat.description_en || '',
      description_mn: cat.description_mn || '',
      parent_id: cat.parent_id,
    });
    setModalMode('edit');
    setEditId(cat.id);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setEditId(null);
    setError(null);
    setSuccessMsg(null);
  };

  // Create or update
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      if (modalMode === 'create') {
        await categoryService.createCategory(form);
        setSuccessMsg('Category created successfully!');
      } else if (modalMode === 'edit' && editId) {
        await categoryService.updateCategory(editId, form);
        setSuccessMsg('Category updated successfully!');
      }
      fetchCategories();
      setTimeout(() => {
        closeModal();
      }, 800);
    } catch (err: any) {
      setError(err?.message || 'Failed to save category');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete
  const handleDelete = async (cat: Category) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await categoryService.deleteCategory(cat.id);
      setSuccessMsg('Category deleted successfully!');
      fetchCategories();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete category');
    } finally {
      setActionLoading(false);
    }
  };

  // Expand/collapse
  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Render parent categories only
  const renderParentCategoryList = (): React.ReactNode => (
    <ul className="mb-4">
      {categories.filter(cat => cat.parent_id === null).map(parent => (
        <li key={parent.id} className="mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleExpand(parent.id)}>
              {parent.children && parent.children.length > 0 && (
                <span className="text-xs text-gray-500 hover:text-gray-800">
                  {expanded[parent.id] ? '▼' : '▶'}
                </span>
              )}
              <span className="font-medium text-gray-900">{parent.name_en}</span>
              <span className="text-gray-400 text-xs">/ {parent.name_mn}</span>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-2 py-1 rounded text-xs transition"
                onClick={e => { e.stopPropagation(); openEditModal(parent); }}
                disabled={actionLoading}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                onClick={e => { e.stopPropagation(); handleDelete(parent); }}
                disabled={actionLoading}
              >
                Delete
              </button>
            </div>
          </div>
          {expanded[parent.id] && parent.children && parent.children.length > 0 && (
            <ul className="ml-8 pl-6 border-l-2 border-gray-200 mt-2">
              {parent.children.map(child => (
                <li key={child.id} className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{child.name_en}</span>
                    <span className="text-gray-400 text-xs">/ {child.name_mn}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-2 py-1 rounded text-xs transition"
                      onClick={e => { e.stopPropagation(); openEditModal(child); }}
                      disabled={actionLoading}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      onClick={e => { e.stopPropagation(); handleDelete(child); }}
                      disabled={actionLoading}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">Categories</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mb-6"
          onClick={openCreateModal}
        >
          + New Category
        </button>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <div>
            {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
            {renderParentCategoryList()}
          </div>
        )}

        {/* Modal for create/edit */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={closeModal}
                disabled={actionLoading}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-4">{modalMode === 'create' ? 'Create Category' : 'Edit Category'}</h2>
              {error && <div className="text-red-500 mb-2">{error}</div>}
              {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
              <form onSubmit={handleModalSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium">Name (EN)</label>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={form.name_en}
                    onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Name (MN)</label>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={form.name_mn}
                    onChange={e => setForm(f => ({ ...f, name_mn: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Description (EN)</label>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={form.description_en || ''}
                    onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Description (MN)</label>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={form.description_mn || ''}
                    onChange={e => setForm(f => ({ ...f, description_mn: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Parent Category</label>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={form.parent_id ?? ''}
                    onChange={e => setForm(f => ({ ...f, parent_id: e.target.value ? Number(e.target.value) : null }))}
                  >
                    <option value="">No Parent</option>
                    {categories
                      .filter(c => modalMode === 'create' || c.id !== editId)
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.name_en}</option>
                      ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded transition"
                    type="submit"
                    disabled={actionLoading}
                  >
                    {modalMode === 'create' ? 'Create' : 'Update'}
                  </button>
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-1 rounded"
                    type="button"
                    onClick={closeModal}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrganizationAdminPage; 