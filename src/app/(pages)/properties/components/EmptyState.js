"use client";
import { Home } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <Home className="w-16 h-16 mx-auto mb-4" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No properties found
      </h3>
      <p className="text-gray-500">
        Try adjusting your filters or search criteria
      </p>
    </div>
  );
}
