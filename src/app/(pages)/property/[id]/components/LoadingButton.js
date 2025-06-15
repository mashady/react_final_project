"use client";
import { Loader2 } from "lucide-react";
export default function LoadingButton({ loading, children, className, ...props }) {
  return (
    <button className={`flex items-center justify-center ${className}`} disabled={loading} {...props}>
      {loading && <Loader2 className="animate-spin mr-2" size={16} />}
      {children}
    </button>
  );
}
