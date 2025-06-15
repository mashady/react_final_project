import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

const ProfileImageUpload = ({ imagePreview, onRemove, onUpload }) => (
  <div className="space-y-3">
    {imagePreview ? (
      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
        <img
          src={imagePreview}
          alt="Profile preview"
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    ) : (
      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">No image</p>
        </div>
      </div>
    )}

    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => document.getElementById("imageUpload").click()}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Upload
      </Button>
      {imagePreview && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <X className="w-4 h-4" />
          Remove
        </Button>
      )}
    </div>

    <input
      id="imageUpload"
      type="file"
      accept="image/*"
      onChange={onUpload}
      className="hidden"
    />
  </div>
);
export { ProfileImageUpload };
