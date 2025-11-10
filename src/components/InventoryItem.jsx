import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function InventoryItem({ item, onMarkSold, onDelete }) {
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [saleData, setSaleData] = useState({
    quantity: '',
    salePrice: '',
    saleDate: new Date().toISOString().split('T')[0],
    platform: ''
  });

  const availableQty = item.quantity - item.quantitySold;
  const totalProfit = item.sales.reduce((sum, sale) => sum + sale.profit, 0);

  const handleMarkSold = () => {
    const qty = parseInt(saleData.quantity);
    if (!saleData.quantity || !saleData.salePrice) {
      alert('Please enter quantity and sale price');
      return;
    }
    if (qty > availableQty) {
      alert(`Only ${availableQty} units available`);
      return;
    }
    onMarkSold(item.id, saleData.quantity, saleData.salePrice, saleData.saleDate, saleData.platform);
    setSaleData({
      quantity: '',
      salePrice: '',
      saleDate: new Date().toISOString().split('T')[0],
      platform: ''
    });
    setShowSaleForm(false);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white">{item.brand} {item.model}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              availableQty > 0 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {availableQty} / {item.quantity} Available
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-400">
            {item.size && <p>Size: <span className="text-white">{item.size}</span></p>}
            {item.colorway && <p>Colorway: <span className="text-white">{item.colorway}</span></p>}
            <p>Cost/Unit: <span className="text-white">${item.purchasePrice.toFixed(2)}</span></p>
            <p>Total Cost: <span className="text-white">${(item.purchasePrice * item.quantity).toFixed(2)}</span></p>
            {item.purchaseDate && <p>Purchased: <span className="text-white">{item.purchaseDate}</span></p>}
            {item.supplier && <p>From: <span className="text-white">{item.supplier}</span></p>}
            {item.quantitySold > 0 && (
              <>
                <p>Units Sold: <span className="text-purple-400">{item.quantitySold}</span></p>
                <p>Total Profit: <span className={totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
                  ${totalProfit.toFixed(2)}
                </span></p>
              </>
            )}
          </div>
          
          {item.notes && (
            <p className="mt-2 text-sm text-slate-400">Note: {item.notes}</p>
          )}

          {item.sales.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <p className="text-sm font-semibold mb-2 text-white">Sales History:</p>
              <div className="space-y-1">
                {item.sales.map((sale, idx) => (
                  <div key={idx} className="text-sm text-slate-400 flex gap-4">
                    <span>{sale.quantity} units @ ${sale.price}</span>
                    <span className="text-green-400">+${sale.profit.toFixed(2)}</span>
                    {sale.date && <span>{sale.date}</span>}
                    {sale.platform && <span>{sale.platform}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {availableQty > 0 && !showSaleForm && (
            <button
              onClick={() => setShowSaleForm(true)}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold transition-all text-white"
            >
              Record Sale
            </button>
          )}
          <button
            onClick={() => onDelete(item.id)}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg font-semibold transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {showSaleForm && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <h4 className="font-semibold mb-3 text-white">Record Sale ({availableQty} available)</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Quantity *"
              min="1"
              max={availableQty}
              value={saleData.quantity}
              onChange={(e) => setSaleData({...saleData, quantity: e.target.value})}
              className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Sale Price (per unit) *"
              value={saleData.salePrice}
              onChange={(e) => setSaleData({...saleData, salePrice: e.target.value})}
              className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={saleData.saleDate}
              onChange={(e) => setSaleData({...saleData, saleDate: e.target.value})}
              className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Platform (e.g., StockX)"
              value={saleData.platform}
              onChange={(e) => setSaleData({...saleData, platform: e.target.value})}
              className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {saleData.quantity && saleData.salePrice && (
            <p className="mt-2 text-sm text-slate-400">
              Expected profit: <span className="text-green-400">
                ${((parseFloat(saleData.salePrice) - item.purchasePrice) * parseInt(saleData.quantity)).toFixed(2)}
              </span>
            </p>
          )}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleMarkSold}
              className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold transition-all text-white"
            >
              Confirm Sale
            </button>
            <button
              onClick={() => setShowSaleForm(false)}
              className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg font-semibold transition-all text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}