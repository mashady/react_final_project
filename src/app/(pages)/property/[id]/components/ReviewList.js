"use client";
export default function ReviewList({ reviews }) {
  if (!reviews.length)
    return (
      <div className="text-[#888] text-lg bg-[#f7f7f7] rounded-xl p-6 border border-[#ececec]">
        No reviews yet.
      </div>
    );
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-6 border border-[#ececec] rounded-xl bg-[#f7f7f7] shadow-sm"
        >
          <div className="font-semibold text-[#222] text-lg mb-1">
            {review.user?.name || "Anonymous"}
          </div>
          <div className="text-[#666] text-base">{review.content}</div>
        </div>
      ))}
    </div>
  );
}
