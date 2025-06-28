"use client";
import React from "react";

export default function OwnerReviewForm({
  reviewForm,
  setReviewForm,
  submittingReview,
  reviewError,
  onSubmit,
}) {
  return (
    <form
      className="flex flex-col gap-4 bg-[#f7f7f7] p-6 rounded-xl border border-[#ececec] shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <textarea
        className="w-full h-[105px] p-3 rounded-lg border border-[#ececec]  text-lg text-[#222] bg-white min-h-[80px] resize-none"
        placeholder="Write your review..."
        value={reviewForm.comment}
        onChange={(e) =>
          setReviewForm({ ...reviewForm, comment: e.target.value })
        }
        disabled={submittingReview}
      />
      {reviewError && (
        <div className="text-red-500 text-base font-medium">{reviewError}</div>
      )}
      <button
        type="submit"
        style={{ fontWeight: 500 }}
        className="self-end bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-black px-6 py-2 rounded transition-colors text-base"
        disabled={submittingReview}
      >
        {submittingReview ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
