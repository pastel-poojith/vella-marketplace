import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { AdminLayout } from './AdminLayout';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Category } from '../../lib/types';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80');
    setModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description);
    setImageUrl(c.image_url);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name,
        slug,
        description,
        image_url: imageUrl,
      });
    } else {
      await addCategory({
        name,
        slug,
        description,
        image_url: imageUrl,
      });
    }
    setModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand-200 gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink-900">Department Disciplines</h2>
            <p className="text-xs text-sand-500">Configure catalog categories and their imagery representations.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-ink-900 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider hover:bg-accent-600 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => {
            const count = products.filter((p) => p.category_id === c.id).length;

            return (
              <div
                key={c.id}
                className="rounded-xl border border-sand-200 overflow-hidden bg-sand-50/50 flex flex-col"
              >
                <div className="aspect-[16/9] relative overflow-hidden bg-sand-200">
                  <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-ink-900/90 text-sand-50 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur">
                    {count} {count === 1 ? 'Product' : 'Products'}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col space-y-2">
                  <h3 className="font-serif text-xl font-bold text-ink-900">{c.name}</h3>
                  <p className="text-xs text-sand-500 font-mono">slug: {c.slug}</p>
                  <p className="text-xs text-sand-700 line-clamp-2 font-light leading-relaxed">
                    {c.description}
                  </p>

                  <div className="pt-4 border-t border-sand-200 mt-auto flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(c)}
                      className="px-3 py-1.5 bg-white border border-sand-300 rounded text-xs text-ink-800 hover:bg-sand-100 flex items-center gap-1 font-medium"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    {categories.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${c.name}? Products in this department should be reassigned.`)) {
                            deleteCategory(c.id);
                          }
                        }}
                        className="p-1.5 text-sand-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-sand-200">
                <h3 className="font-serif text-xl font-bold text-ink-900">
                  {editingCategory ? 'Edit Department' : 'Create New Department'}
                </h3>
                <button onClick={() => setModalOpen(false)}>
                  <X className="w-5 h-5 text-sand-400 hover:text-ink-900" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase font-semibold text-sand-600 mb-1">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-sm text-ink-900"
                  />
                </div>

                <div>
                  <label className="block uppercase font-semibold text-sand-600 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block uppercase font-semibold text-sand-600 mb-1">
                    Banner Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block uppercase font-semibold text-sand-600 mb-1">
                    Editorial Department Manifesto / Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-sand-200">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-sand-300 rounded text-ink-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded font-semibold uppercase tracking-wider"
                  >
                    Save Department
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
