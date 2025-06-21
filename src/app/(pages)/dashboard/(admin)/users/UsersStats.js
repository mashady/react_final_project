// UsersStats.js
import React from "react";
import { User, Shield, CheckCircle, Clock } from "lucide-react";

export default function UsersStats({ filteredUsers }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total Users</p>
            <p className="text-3xl font-light text-slate-800 mt-1">{filteredUsers.length}</p>
          </div>
          <div className="bg-slate-100 p-3 rounded-lg">
            <User size={24} className="text-slate-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Owners</p>
            <p className="text-3xl font-light text-slate-800 mt-1">{filteredUsers.filter((u) => u.role === "owner").length}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <Shield size={24} className="text-purple-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Students</p>
            <p className="text-3xl font-light text-slate-800 mt-1">{filteredUsers.filter((u) => u.role === "student").length}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <User size={24} className="text-green-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Verified</p>
            <p className="text-3xl font-light text-slate-800 mt-1">{filteredUsers.filter((u) => u.verification_status === "verified").length}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Pending</p>
            <p className="text-3xl font-light text-slate-800 mt-1">{filteredUsers.filter((u) => u.verification_status === "pending").length}</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <Clock size={24} className="text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
