import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Package, DollarSign, Download, RefreshCw } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './services/firebase';
import { syncToGoogleSheets } from './services/googleSheets';
import { exportToCSV } from './utils/exportCSV';
import StatsCard from './components/StatsCard';
import FilterBar from './components/FilterBar';
import SyncStatus from './components/SyncStatus';
import AddItemForm from './components/AddItem';
import InventoryItem from './components/InventoryItem';


export default function App() {
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    size: '',
    colorway: '',
    quantity: '',
    purchasePrice: '',
    purchaseDate: '',
    supplier: '',
    notes: ''
  });

  // Load inventory from Firebase
  useEffect(() => {
    const q = query(collection(db, 'inventory'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setInventory(items);
      setLoading(false);
      
      // Auto-sync to Google Sheets when data changes
      if (items.length > 0) {
        handleSyncToSheets(items);
      }
    }, (err) => {
      console.error("Error loading inventory:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSyncToSheets = async (data) => {
    setSyncStatus('syncing');
    const result = await syncToGoogleSheets(data);
    
    if (result.success) {
      setSyncStatus('success');
    } else {
      setSyncStatus('error');
    }
    
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  const addItem = async () => {
    if (!formData.brand || !formData.model || !formData.purchasePrice || !formData.quantity) {
      alert('Please fill in brand, model, quantity, and purchase price');
      return;
    }

    const newItem = {
      ...formData,
      quantity: parseInt(formData.quantity),
      quantitySold: 0,
      purchasePrice: parseFloat(formData.purchasePrice),
      sales: [],
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'inventory'), newItem);
      setFormData({
        brand: '',
        model: '',
        size: '',
        colorway: '',
        quantity: '',
        purchasePrice: '',
        purchaseDate: '',
        supplier: '',
        notes: ''
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding item:", err);
      alert('Failed to add item. Please try again.');
    }
  };

  const markAsSold = async (id, quantitySold, salePrice, saleDate, platform) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const qty = parseInt(quantitySold);
    const price = parseFloat(salePrice);
    const sale = {
      quantity: qty,
      price: price,
      date: saleDate,
      platform: platform,
      profit: (price * qty) - (item.purchasePrice * qty)
    };

    try {
      const itemRef = doc(db, 'inventory', id);
      await updateDoc(itemRef, {
        quantitySold: item.quantitySold + qty,
        sales: [...item.sales, sale]
      });
    } catch (err) {
      console.error("Error updating item:", err);
      alert('Failed to record sale. Please try again.');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteDoc(doc(db, 'inventory', id));
    } catch (err) {
      console.error("Error deleting item:", err);
      alert('Failed to delete item. Please try again.');
    }
  };

  const stats = {
    totalItems: inventory.reduce((sum, i) => sum + i.quantity, 0),
    available: inventory.reduce((sum, i) => sum + (i.quantity - i.quantitySold), 0),
    sold: inventory.reduce((sum, i) => sum + i.quantitySold, 0),
    inventoryValue: inventory.reduce((sum, i) => 
      sum + (i.purchasePrice * (i.quantity - i.quantitySold)), 0),
    totalProfit: inventory.reduce((sum, i) => 
      sum + i.sales.reduce((saleSum, sale) => saleSum + sale.profit, 0), 0)
  };

  const filteredInventory = inventory.filter(item => {
    const available = item.quantity - item.quantitySold;
    const matchesFilter = filter === 'all' || 
      (filter === 'available' && available > 0) ||
      (filter === 'sold' && item.quantitySold > 0);
    const matchesSearch = searchTerm === '' || 
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.colorway && item.colorway.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 animate-pulse text-blue-400" size={48} />
          <p className="text-xl">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Resale Inventory Manager
              </h1>
              <p className="text-slate-400">Real-time sync with Firebase & Google Sheets</p>
            </div>
            <div className="flex gap-2">
              {inventory.length > 0 && (
                <>
                  <button
                    onClick={() => exportToCSV(inventory)}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold transition-all"
                  >
                    <Download size={20} />
                    CSV
                  </button>
                  <button
                    onClick={() => handleSyncToSheets(inventory)}
                    disabled={syncStatus === 'syncing'}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                  >
                    <RefreshCw size={20} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                    Sync
                  </button>
                </>
              )}
            </div>
          </div>
          <SyncStatus status={syncStatus} />
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Items" value={stats.totalItems} icon={Package} color="blue" />
          <StatsCard title="Available" value={stats.available} color="green" />
          <StatsCard title="Inventory Value" value={`${stats.inventoryValue.toFixed(2)}`} icon={DollarSign} color="yellow" />
          <StatsCard title="Total Profit" value={`${stats.totalProfit.toFixed(2)}`} icon={TrendingUp} color="green" />
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <Plus size={20} />
            Add New Item
          </button>

          <FilterBar 
            filter={filter} 
            setFilter={setFilter} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
        </div>

        {/* Add Item Form */}
        {showForm && (
          <AddItemForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={addItem}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Inventory List */}
        <div className="space-y-4">
          {filteredInventory.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-12 text-center">
              <Package className="mx-auto mb-4 text-slate-600" size={48} />
              <p className="text-slate-400 text-lg">
                {inventory.length === 0 ? 'No items in inventory. Add your first item!' : 'No items match your filters.'}
              </p>
            </div>
          ) : (
            filteredInventory.map(item => (
              <InventoryItem 
                key={item.id} 
                item={item} 
                onMarkSold={markAsSold}
                onDelete={deleteItem}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}