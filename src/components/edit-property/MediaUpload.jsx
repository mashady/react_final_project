"use client";
import React from "react";
import { Upload, X, Image, Video } from "lucide-react";
import { useFormikContext } from "formik";
import axios from "axios";

const MediaUpload = ({ onRemoveAllMedia, propertyId, showToast }) => {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const { media } = values;
  const hasError = touched.media && errors.media;

  const handleMediaUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*,video/*";
  
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      const validFiles = files.filter((file) => {
        // Convert bytes to MB for comparison
        const fileSizeMB = file.size / (1024 * 1024); 
        const isValidSize = fileSizeMB <= 20;
        const isValidType =
          file.type.startsWith("image/") || file.type.startsWith("video/");
        
        if (!isValidSize) {
          console.warn(`File ${file.name} is too large (${fileSizeMB.toFixed(2)}MB)`);
        }
        if (!isValidType) {
          console.warn(`File ${file.name} has invalid type: ${file.type}`);
        }
        
        return isValidSize && isValidType;
      });
  
      if (validFiles.length !== files.length) {
        showToast("Some files were skipped. Only images/videos under 20MB are allowed.", "warning");
      }
  
      // Combine with existing media (keeping both old and new)
      const newGallery = [...media, ...validFiles];
      setFieldValue("media", newGallery);
    };
  
    input.click();
  };

  const handleRemoveMedia = async (index) => {
    const newGallery = [...media];
    const fileToRemove = newGallery[index];

    try {
      if (fileToRemove?.id) {
     
        await axios.delete(`http://127.0.0.1:8000/api/media/${fileToRemove.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
       
        URL.revokeObjectURL(fileToRemove);
      }

      newGallery.splice(index, 1);
      setFieldValue("media", newGallery);
    } catch (err) {
      console.error("Failed to delete media:", err);
    }
  };

  const handleRemoveAllMedia = () => {
    media.forEach((file) => {
      if (!file?.id && typeof file === "object") {
        URL.revokeObjectURL(file);
      }
    });

    onRemoveAllMedia(); 
  };

  const getImageUrl = (file) => {
    if (typeof file === "string") return file;
    if (file?.file_path) return file.file_path;
    return URL.createObjectURL(file);
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-black">Media</h2>
      </div>

      <div className="p-6">
        <label className="block text-xs font-medium text-black mb-2">
          Upload media files (images/videos):
        </label>

        <p className="text-xs text-blue-500 mb-4">
          Upload images and videos (max 20MB each). First image appears in lists.
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

        {hasError && <p className="text-xs text-red-500 mb-4">{errors.media}</p>}
        
        
        {media.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {media.map((file, index) => {
              const isImage = file?.media_type === "image" || file?.type?.startsWith("image/");
              const isVideo = file?.media_type === "video" || file?.type?.startsWith("video/");
              const imageUrl = getImageUrl(file);

              return (
                <div
                  key={index}
                  className="relative group border rounded-md overflow-hidden"
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {isImage ? (
                      <img
                        src={imageUrl}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : isVideo ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Video className="w-8 h-8 text-gray-500" />
                        <span className="sr-only">Video file</span>
                      </div>
                    ) : (
                      <Image className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* Delete button */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      aria-label={`Remove media ${index + 1}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Index label */}
                  <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No media files uploaded yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Click "Upload Media" to add images and videos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUpload;
