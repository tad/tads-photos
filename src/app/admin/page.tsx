"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Trash2, LogOut, RefreshCw, ImageIcon } from "lucide-react";
import type { Photo } from "@/types/photo";

export default function AdminPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await fetch("/api/photos");
      const data = await response.json();
      if (data.photos) {
        setPhotos(data.photos);
      }
    } catch {
      setError("Failed to load photos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError("");
    setUploadProgress(`Uploading 0/${files.length} files...`);

    let uploaded = 0;
    const errors: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          errors.push(`${file.name}: ${data.error}`);
        } else {
          uploaded++;
        }
      } catch {
        errors.push(`${file.name}: Upload failed`);
      }

      setUploadProgress(`Uploading ${uploaded}/${files.length} files...`);
    }

    setIsUploading(false);
    setUploadProgress("");

    if (errors.length > 0) {
      setError(errors.join("\n"));
    }

    // Refresh photo list
    await fetchPhotos();

    // Reset file input
    e.target.value = "";
  };

  const handleDelete = async (photo: Photo) => {
    if (!confirm(`Delete ${photo.filename}?`)) return;

    try {
      const response = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: photo.src }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to delete");
        return;
      }

      // Remove from local state
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    } catch {
      setError("Failed to delete photo");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-gray-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Photo Admin</h1>
            <span className="text-muted text-sm">{photos.length} photos</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchPhotos}
              disabled={isLoading}
              className="p-2 hover:bg-card rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
            </button>

            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-5 h-5" />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-card rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-900/50 px-4 py-3 text-center">
          <p>{uploadProgress}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/50 px-4 py-3">
          <p className="max-w-6xl mx-auto text-red-300 whitespace-pre-line">{error}</p>
          <button
            onClick={() => setError("")}
            className="text-red-400 hover:text-red-300 text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Photo Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-16">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted">Loading photos...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted" />
            <p className="text-xl mb-2">No photos yet</p>
            <p className="text-muted">Upload your first photo to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square bg-card rounded-lg overflow-hidden"
              >
                <Image
                  src={photo.src}
                  alt={photo.filename}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />

                {/* Overlay with delete button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(photo)}
                    className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                    title="Delete photo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Filename */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs truncate">{photo.filename}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
