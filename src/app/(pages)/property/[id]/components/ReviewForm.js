"use client";
import LoadingButton from "./LoadingButton";
import FormError from "./FormError";
export default function ReviewForm({
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
        className="w-full p-3 rounded-lg border border-[#ececec] focus:border-[#eab308] focus:ring-2 focus:ring-[#eab308] text-lg text-[#222] bg-white min-h-[80px] resize-none"
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
        className="self-end bg-black text-white px-6 py-2 rounded font-semibold hover:bg-[#c59d0b] transition-colors text-base"
        disabled={submittingReview}
      >
        {submittingReview ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
