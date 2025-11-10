import React from 'react';

export default function AddItemForm({ formData, setFormData, onSubmit, onCancel }) {
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Add New Item</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Brand *"
          value={formData.brand}
          onChange={(e) => handleChange('brand', e.target.value)}
          className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Model *"
          value={formData.model}
          onChange={(e) => handleChange('model', e.target.value)}
          className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Size"
          value={formData.size}
          onChange={(e) => handleChange('size', e.target.value)}
          className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Colorway"
          value={formData.colorway}
          onChange={(e) => handleChange('colorway', e.target.value)}
          className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Quantity *"
          value={formData.quantity}
          onChange={(e) => handleChange('quantity', e.target.value)}
          className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Purchase Price (per unit) *"
          value={formData.purchasePrice}
          onChange={(e) => handleChange('purchasePrice', e.target.value)}
          className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          placeholder="Purchase Date"
          value={formData.purchaseDate}
          onChange={(e) => handleChange('purchaseDate', e.target.value)}
          className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Supplier"
          value={formData.supplier}
          onChange={(e) => handleChange('supplier', e.target.value)}
          className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={onSubmit}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold transition-all text-white"
        >
          Add Item
        </button>
        <button
          onClick={onCancel}
          className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg font-semibold transition-all text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}