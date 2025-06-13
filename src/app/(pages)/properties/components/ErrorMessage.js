"use client";

export default function ErrorMessage({ error }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <div className="text-red-600 text-sm">
          <strong>API Connection Error:</strong> {error}
        </div>
      </div>
      <div className="text-red-500 text-xs mt-1">
        Showing demo data. Please check if the API server is running at
        http://127.0.0.1:8000
      </div>
    </div>
  );
}
