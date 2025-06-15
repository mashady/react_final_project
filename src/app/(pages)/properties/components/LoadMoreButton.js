"use client";

export default function LoadMoreButton({ onClick, loading }) {
  return (
    <div className="flex justify-center mt-8">
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700" />
      ) : (
        <button
          onClick={onClick}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          Load More Properties
        </button>
      )}
    </div>
  );
}
