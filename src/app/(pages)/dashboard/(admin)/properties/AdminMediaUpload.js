import React from "react";
import { Upload, X, Video } from "lucide-react";
import Image from "next/image";
const AdminMediaUpload = ({ media, setMedia }) => {
  const handleMediaUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*,video/*";
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      const validFiles = files.filter((file) => {
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
        const isValidType =
          file.type.startsWith("image/") || file.type.startsWith("video/");
        return isValidSize && isValidType;
      });
      if (validFiles.length !== files.length) {
        alert(
          "Some files were skipped. Please ensure all files are images/videos under 10MB."
        );
      }
      const newImages = [...media, ...validFiles];
      setMedia(newImages);
    };
    input.click();
  };

  const handleRemoveMedia = (index) => {
    const newGallery = [...media];
    newGallery.splice(index, 1);
    setMedia(newGallery);
  };

  const handleRemoveAllMedia = () => {
    setMedia([]);
  };

  const getImageUrl = (file) => {
    if (typeof file === "string") return file;
    return URL.createObjectURL(file);
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-black flex items-center ">
          Media
        </h2>
      </div>
      <div className="p-6">
        <label className="block text-xs font-medium text-black mb-2">
          Upload media files (images/videos):
        </label>
        <p className="text-xs text-blue-500 mb-4">
          Upload images and videos (max 10MB each). The first image will be
          displayed in lists.
        </p>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={handleMediaUpload}
            className="flex items-center gap-1 px-3 py-2 text-xs text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-50 transition-colors"
          >
            <Upload className="w-3 h-3" />
            Upload Media
          </button>
          {media.length > 0 && (
            <button
              type="button"
              onClick={handleRemoveAllMedia}
              className="flex items-center gap-1 px-3 py-2 text-xs text-red-600 bg-white border border-red-600 rounded hover:bg-red-50 transition-colors"
            >
              Remove All
            </button>
          )}
        </div>
        {media.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {media.map((file, index) => (
              <div
                key={index}
                className="relative group border rounded-md overflow-hidden"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {file.type?.startsWith("image/") ? (
                    <Image
                      src={getImageUrl(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Video className="w-8 h-8 text-gray-500" />
                      <span className="sr-only">Video file</span>
                    </div>
                  )}
                  <div className="w-full h-full hidden items-center justify-center bg-gray-200">
                    <Image className="w-8 h-8 text-gray-500" alt="Video file" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-[#000000e0] bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(index)}
                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    aria-label={`Remove media ${index + 1}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Image
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
              alt="No media files uploaded"
            />
            <p className="text-sm text-gray-500">No media files uploaded yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Click &quot;Upload Media&quot; to add images and videos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMediaUpload;
