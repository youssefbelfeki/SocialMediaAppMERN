/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";

export default function AvatarUploader({
  src,
  size = 64,
  disabled = false,
  onUploaded,
}) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const pick = () => {
    if (!disabled) {
      fileRef.current?.click();
    }
  };

  const onChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "posts_unsigned");
    formData.append("folder", "avatars");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxe3zrtqf/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (!data.secure_url) throw new Error("Cloudinary upload failed");
      onUploaded(data.secure_url);
      setSuccess("Avatar uploaded ✅");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Avatar upload failed");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="relative">
      <div
        onClick={pick}
        className={`rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${
          !disabled ? "cursor-pointer hover:opacity-80" : "cursor-default"
        }`}
        style={{ width: size, height: size }}
      >
        {src ? (
          <img src={src} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-2xl">👤</span>
        )}
      </div>

      {!disabled && (
        <button
          type="button"
          onClick={pick}
          className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 shadow-lg"
          disabled={uploading}
          title="Change avatar"
        >
          {uploading ? (
            <span className="text-xs">⏳</span>
          ) : (
            <span className="text-xs">📷</span>
          )}
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
