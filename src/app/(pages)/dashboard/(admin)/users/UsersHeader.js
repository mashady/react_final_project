// UsersHeader.js
import React from "react";
import { Plus } from "lucide-react";

export default function UsersHeader({ onAddUser }) {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-4xl text-black tracking-tight"
              style={{ fontWeight: 500 }}
            >
              Users Management
            </h1>
            <p className="text-[#333] mt-2 font-light">
              Manage your platform users with ease
            </p>
          </div>
          <button
            onClick={onAddUser}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Add New User
          </button>
        </div>
      </div>
    </div>
  );
}
