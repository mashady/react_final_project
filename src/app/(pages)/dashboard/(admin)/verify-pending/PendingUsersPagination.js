import React from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PendingUsersPagination = ({
  currentPage,
  totalPages,
  indexOfFirstUser,
  indexOfLastUser,
  filteredUsers,
  paginate,
  goToNextPage,
  goToPrevPage,
  goToFirstPage,
  goToLastPage,
  getPageNumbers,
}) => (
  <div className="flex items-center justify-between px-6 py-4 border-t border-amber-200">
    <div className="text-sm text-slate-600">
      Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
      <span className="font-medium">
        {Math.min(indexOfLastUser, filteredUsers.length)}
      </span>{" "}
      of <span className="font-medium">{filteredUsers.length}</span> pending
      users
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={goToFirstPage}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg ${
          currentPage === 1
            ? "text-slate-300 cursor-not-allowed"
            : "text-slate-600 hover:bg-amber-100"
        }`}
      >
        <ChevronsLeft size={18} />
      </button>
      <button
        onClick={goToPrevPage}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg ${
          currentPage === 1
            ? "text-slate-300 cursor-not-allowed"
            : "text-slate-600 hover:bg-amber-100"
        }`}
      >
        <ChevronLeft size={18} />
      </button>
      {getPageNumbers().map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg ${
            currentPage === number
              ? "bg-amber-600 text-white"
              : "text-slate-600 hover:bg-amber-100"
          }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg ${
          currentPage === totalPages
            ? "text-slate-300 cursor-not-allowed"
            : "text-slate-600 hover:bg-amber-100"
        }`}
      >
        <ChevronRight size={18} />
      </button>
      <button
        onClick={goToLastPage}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg ${
          currentPage === totalPages
            ? "text-slate-300 cursor-not-allowed"
            : "text-slate-600 hover:bg-amber-100"
        }`}
      >
        <ChevronsRight size={18} />
      </button>
    </div>
  </div>
);

export default PendingUsersPagination;
