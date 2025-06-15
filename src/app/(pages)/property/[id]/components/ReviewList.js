"use client";
export default function ReviewList({ reviews }) {
  if (!reviews.length) return <div className="text-gray-500">No reviews yet.</div>;
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="p-3 border rounded-lg bg-gray-50">
          <div className="font-semibold text-gray-800">{review.user?.name || "Anonymous"}</div>
          <div className="text-gray-600 text-sm">{review.content}</div>
        </div>
      ))}
    </div>
  );
}
