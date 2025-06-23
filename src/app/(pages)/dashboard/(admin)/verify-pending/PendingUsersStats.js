import React from "react";
import { Clock, User, FileText, AlertCircle } from "lucide-react";

const PendingUsersStats = ({ filteredUsers }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">Total Pending</p>
          <p className="text-3xl font-light text-slate-800 mt-1">
            {filteredUsers.length}
          </p>
        </div>
        <div className="bg-amber-100 p-3 rounded-lg">
          <Clock size={24} className="text-amber-600" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">Students</p>
          <p className="text-3xl font-light text-slate-800 mt-1">
            {filteredUsers.filter((u) => u.role === "student").length}
          </p>
        </div>
        <div className="bg-green-100 p-3 rounded-lg">
          <User size={24} className="text-green-600" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">With Documents</p>
          <p className="text-3xl font-light text-slate-800 mt-1">
            {filteredUsers.filter((u) => u.verification_document).length}
          </p>
        </div>
        <div className="bg-blue-100 p-3 rounded-lg">
          <FileText size={24} className="text-blue-600" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">Urgent (7+ days)</p>
          <p className="text-3xl font-light text-slate-800 mt-1">
            {
              filteredUsers.filter((u) => {
                const daysDiff = Math.floor(
                  (new Date() - new Date(u.created_at)) / (1000 * 60 * 60 * 24)
                );
                return daysDiff >= 7;
              }).length
            }
          </p>
        </div>
        <div className="bg-red-100 p-3 rounded-lg">
          <AlertCircle size={24} className="text-red-600" />
        </div>
      </div>
    </div>
  </div>
);

export default PendingUsersStats;
