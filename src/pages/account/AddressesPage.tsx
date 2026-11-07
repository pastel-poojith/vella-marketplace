import React, { useState } from 'react';
import { AccountLayout } from './AccountLayout';
import { MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Address } from '../../lib/types';
import { useAuth } from '../../contexts/AuthContext';

export const AddressesPage: React.FC = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 'addr-1',
      user_id: user?.id || 'demo-user',
      full_name: 'Elena Rostova',
      address_line1: '780 Mission Street, Apt 14A',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94103',
      country: 'United States',
      phone: '+1 (415) 320-8910',
      is_default: true,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLine1, setNewLine1] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newLine1 || !newCity) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      user_id: user?.id || 'demo-user',
      full_name: newName,
      address_line1: newLine1,
      city: newCity,
      state: newState,
      postal_code: newZip,
      country: 'United States',
      phone: newPhone,
      is_default: addresses.length === 0,
    };

    setAddresses([...addresses, newAddr]);
    setIsAdding(false);
    setNewName('');
    setNewLine1('');
    setNewCity('');
    setNewState('');
    setNewZip('');
    setNewPhone('');
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        is_default: a.id === id,
      }))
    );
  };

  return (
    <AccountLayout>
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-sand-200">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink-900">Saved Delivery Addresses</h2>
            <p className="text-xs text-sand-500">Manage residential and concierge delivery locations.</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-2 bg-ink-900 text-sand-50 rounded text-xs uppercase font-semibold tracking-wider hover:bg-accent-600 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Address
          </button>
        </div>

        {/* Add Address Form */}
        {isAdding && (
          <form onSubmit={handleAddAddress} className="p-5 bg-sand-50 rounded-xl border border-sand-300 space-y-4">
            <h3 className="font-serif text-base font-bold text-ink-900">New Destination Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white border border-sand-300 rounded p-2"
                />
              </div>
              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-white border border-sand-300 rounded p-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block uppercase font-semibold text-sand-600 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newLine1}
                  onChange={(e) => setNewLine1(e.target.value)}
                  className="w-full bg-white border border-sand-300 rounded p-2"
                />
              </div>
              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full bg-white border border-sand-300 rounded p-2"
                />
              </div>
              <div>
                <label className="block uppercase font-semibold text-sand-600 mb-1">State / Postal Code</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full bg-white border border-sand-300 rounded p-2"
                  />
                  <input
                    type="text"
                    required
                    placeholder="ZIP"
                    value={newZip}
                    onChange={(e) => setNewZip(e.target.value)}
                    className="w-full bg-white border border-sand-300 rounded p-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-ink-900 text-white rounded text-xs uppercase font-semibold"
              >
                Save Destination
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-sand-200 text-ink-800 rounded text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Address Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 rounded-xl border relative space-y-2 text-xs ${
                addr.is_default
                  ? 'border-ink-900 bg-sand-50/70 shadow-xs'
                  : 'border-sand-200 bg-white'
              }`}
            >
              {addr.is_default && (
                <span className="absolute top-4 right-4 bg-ink-900 text-sand-50 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                  Default Address
                </span>
              )}
              <div className="flex items-center gap-1.5 font-bold text-sm text-ink-900">
                <MapPin className="w-4 h-4 text-accent-700" />
                {addr.full_name}
              </div>
              <p className="text-sand-700">{addr.address_line1}</p>
              <p className="text-sand-700">
                {addr.city}, {addr.state} {addr.postal_code}
              </p>
              <p className="text-sand-700">{addr.country}</p>
              <p className="text-sand-500 font-mono pt-1">Tel: {addr.phone}</p>

              <div className="pt-3 border-t border-sand-200 flex items-center justify-between">
                {!addr.is_default ? (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs text-accent-700 hover:underline font-medium"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active Delivery Primary
                  </span>
                )}
                {addresses.length > 1 && (
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-sand-400 hover:text-rose-600 p-1"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
};
