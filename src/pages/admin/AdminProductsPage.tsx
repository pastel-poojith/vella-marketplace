import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { AdminLayout } from './AdminLayout';
import { formatCurrency } from '../../lib/utils';
import {
  Plus,
  Trash2,
  Edit,
  X,
  Star,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Product, ProductVariant } from '../../lib/types';

export const AdminProductsPage: React.FC = () => {
  const { products, categories, settings, addProduct, updateProduct, deleteProduct } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number>(100);
  const [comparePrice, setComparePrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);

  // Variants input state
  const [sizesInput, setSizesInput] = useState('');
  const [colorsInput, setColorsInput] = useState('');

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitle('');
    setSlug('');
    setCategoryId(categories[0]?.id || '');
    setSku(`VEL-${Math.floor(100 + Math.random() * 900)}`);
    setPrice(2499);
    setComparePrice(2999);
    setStock(15);
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80');
    setIsFeatured(false);
    setIsBestseller(false);
    setSizesInput('S, M, L, XL');
    setColorsInput('Noir, Ivory, Camel');
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setSlug(p.slug);
    setCategoryId(p.category_id);
    setSku(p.sku);
    setPrice(p.price);
    setComparePrice(p.compare_at_price || 0);
    setStock(p.stock);
    setDescription(p.description);
    setImageUrl(p.images?.[0]?.image_url || '');
    setIsFeatured(p.is_featured);
    setIsBestseller(p.is_bestseller);

    // Extract sizes and colors from variants
    const sizes = Array.from(new Set(p.variants?.map((v) => v.size).filter(Boolean)));
    const colors = Array.from(new Set(p.variants?.map((v) => v.color).filter(Boolean)));
    setSizesInput(sizes.join(', '));
    setColorsInput(colors.join(', '));
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingProduct) {
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

    // Generate variants array
    const sizes = sizesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const colors = colorsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const generatedVariants: ProductVariant[] = [];
    if (sizes.length > 0 || colors.length > 0) {
      if (sizes.length > 0 && colors.length > 0) {
        sizes.forEach((s) => {
          colors.forEach((c) => {
            generatedVariants.push({
              id: `var-${s}-${c}-${Date.now()}`,
              name: `${title} - ${s} / ${c}`,
              sku: `${sku}-${s}-${c}`.toUpperCase(),
              stock: Math.max(1, Math.floor(stock / (sizes.length * colors.length))),
              size: s,
              color: c,
              price: Number(price),
            });
          });
        });
      } else if (sizes.length > 0) {
        sizes.forEach((s) => {
          generatedVariants.push({
            id: `var-${s}-${Date.now()}`,
            name: `${title} - ${s}`,
            sku: `${sku}-${s}`.toUpperCase(),
            stock: Math.max(1, Math.floor(stock / sizes.length)),
            size: s,
            price: Number(price),
          });
        });
      } else if (colors.length > 0) {
        colors.forEach((c) => {
          generatedVariants.push({
            id: `var-${c}-${Date.now()}`,
            name: `${title} - ${c}`,
            sku: `${sku}-${c}`.toUpperCase(),
            stock: Math.max(1, Math.floor(stock / colors.length)),
            color: c,
            price: Number(price),
          });
        });
      }
    }

    const productPayload = {
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      category_id: categoryId,
      sku,
      price: Number(price),
      compare_at_price: comparePrice > 0 ? Number(comparePrice) : null,
      stock: Number(stock),
      description,
      is_featured: isFeatured,
      is_bestseller: isBestseller,
      rating: editingProduct?.rating || 4.8,
      reviews_count: editingProduct?.reviews_count || 1,
      variants: generatedVariants.length > 0 ? generatedVariants : undefined,
      images: [
        {
          id: `img-${Date.now()}`,
          product_id: editingProduct?.id || 'new',
          image_url: imageUrl,
          alt_text: title,
          sort_order: 1,
          is_primary: true,
        },
      ],
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, productPayload);
    } else {
      await addProduct(productPayload);
    }

    setModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand-200 gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink-900">Product Catalog Management</h2>
            <p className="text-xs text-sand-500">
              Add products, configure size/color variants, manage prices in {settings.currency_symbol}, and audit inventory.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-ink-900 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider hover:bg-accent-600 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand-50 text-sand-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-3">Item</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Inventory</th>
                <th className="py-3 px-3">Variants</th>
                <th className="py-3 px-3">Badges</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {products.map((p) => {
                const cat = categories.find((c) => c.id === p.category_id);
                const img =
                  p.images?.[0]?.image_url ||
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80';

                return (
                  <tr key={p.id} className="hover:bg-sand-50/50">
                    <td className="py-3 px-3 flex items-center gap-3">
                      <img
                        src={img}
                        alt={p.title}
                        className="w-10 h-12 object-cover rounded border border-sand-200 flex-shrink-0"
                      />
                      <div className="max-w-xs truncate">
                        <p className="font-semibold text-ink-900 text-sm truncate">{p.title}</p>
                        <p className="text-[10px] text-sand-500 font-mono">/{p.slug}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-sand-700">{p.sku}</td>
                    <td className="py-3 px-3 text-sand-700">{cat?.name || 'Unassigned'}</td>
                    <td className="py-3 px-3 font-semibold text-ink-900">
                      {formatCurrency(p.price, settings.currency_symbol)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                          p.stock === 0
                            ? 'bg-rose-100 text-rose-800'
                            : p.stock <= 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {p.variants && p.variants.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sand-100 text-sand-800 rounded font-semibold text-[10px]">
                          <Layers className="w-3 h-3 text-accent-700" />
                          {p.variants.length} options
                        </span>
                      ) : (
                        <span className="text-sand-400">Single SKU</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1">
                        {p.is_featured && (
                          <span className="p-1 bg-amber-50 text-amber-700 rounded" title="Featured">
                            <Sparkles className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {p.is_bestseller && (
                          <span className="p-1 bg-ink-900 text-sand-50 rounded" title="Bestseller">
                            <Star className="w-3.5 h-3.5 fill-sand-50" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1 text-sand-600 hover:text-ink-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you certain you wish to delete ${p.title}?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1 text-sand-400 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Product Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-sand-200">
                <h3 className="font-serif text-xl font-bold text-ink-900">
                  {editingProduct ? 'Edit Catalog Product' : 'Create New Catalog Product'}
                </h3>
                <button onClick={() => setModalOpen(false)}>
                  <X className="w-5 h-5 text-sand-400 hover:text-ink-900" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block uppercase font-semibold text-sand-600 mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-sm text-ink-900 focus:outline-none focus:border-accent-500"
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
                      Department Category *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase font-semibold text-sand-600 mb-1">
                      SKU Identifier *
                    </label>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-semibold text-sand-600 mb-1">
                      Retail Price ({settings.currency_symbol}) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-semibold text-sand-600 mb-1">
                      Compare At Price (Strike-through)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={comparePrice}
                      onChange={(e) => setComparePrice(Number(e.target.value))}
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-semibold text-sand-600 mb-1">
                      Available Stock Units *
                    </label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900"
                    />
                  </div>

                  {/* Size & Color Variants */}
                  <div>
                    <label className="block uppercase font-semibold text-sand-600 mb-1">
                      Size Options (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={sizesInput}
                      onChange={(e) => setSizesInput(e.target.value)}
                      placeholder="e.g. S, M, L, XL or 38, 40, 42"
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-semibold text-sand-600 mb-1">
                      Color Options (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={colorsInput}
                      onChange={(e) => setColorsInput(e.target.value)}
                      placeholder="e.g. Noir, Ivory, Camel"
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block uppercase font-semibold text-sand-600 mb-1">
                      Primary Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 font-mono text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block uppercase font-semibold text-sand-600 mb-1">
                      Detailed Editorial Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-300 rounded p-2 text-ink-900 text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                    <label className="flex items-center gap-2 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="rounded accent-ink-900"
                      />
                      Feature on Homepage Gallery
                    </label>
                    <label className="flex items-center gap-2 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isBestseller}
                        onChange={(e) => setIsBestseller(e.target.checked)}
                        className="rounded accent-ink-900"
                      />
                      Mark as Studio Bestseller
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-sand-200">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-sand-300 rounded text-ink-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-ink-900 hover:bg-accent-600 text-sand-50 rounded font-semibold uppercase tracking-wider"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
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
