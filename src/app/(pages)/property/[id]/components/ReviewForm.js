"use client";
import LoadingButton from "./LoadingButton";
import FormError from "./FormError";
export default function ReviewForm({ reviewForm, setReviewForm, submittingReview, reviewError, onSubmit }) {
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="space-y-2 mt-4">
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        placeholder="Write your review..."
        value={reviewForm.comment}
        onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
      />
      {reviewError && <FormError message={reviewError} />}
      <LoadingButton loading={submittingReview} type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
        Submit Review
      </LoadingButton>
    </form>
  );
}
