"use client";
import { X, Plus, Minus } from "lucide-react";

export default function CartTable({ items, updateQuantity, removeItem }) {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-4 font-medium text-gray-700">
              Product
            </th>
            <th className="text-left py-4 px-4 font-medium text-gray-700">
              Price
            </th>
            <th className="text-left py-4 px-4 font-medium text-gray-700">
              Quantity
            </th>
            <th className="text-left py-4 px-4 font-medium text-gray-700">
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-6 px-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
              </td>
              <td className="py-6 px-4 font-medium">
                {item.price.toFixed(2)} $
              </td>
              <td className="py-6 px-4">
                <div className="flex items-center border border-gray-300 w-fit">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-gray-50 transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} className="text-gray-600" />
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value) || 1)
                    }
                    className="w-12 text-center border-0 outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} className="text-gray-600" />
                  </button>
                </div>
              </td>
              <td className="py-6 px-4 font-medium">
                {(item.price * item.quantity).toFixed(2)} $
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
