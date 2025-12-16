import { Film, BarChart3, Smile, MapPin, Calendar } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { useState } from "react";
import { toast } from "sonner";

function WhatsHappening() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [text, setText] = useState("");

  const handlePost = async () => {
    if (!text && !uploadedImage) {
      alert("please Create a post");
      return;
    }
    const newPost = {
      text,
      image: uploadedImage,
      createdAt: new Date(),
    };

    try {
      const res = await fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
        credentials: "include",
      });
      const data = await res.json();
      console.log("data: ", data);
      console.log(" Post created:", newPost);

      setText("");
      setUploadedImage(null);
      toast.success("Post Created successfully ");
    } catch (error) {
      toast.error(" Error saving post:", error);
    }
  };
  return (
    <div className="flex flex-col p-3 border border-b-gray-200">
      <div className="flex items-center gap-4">
        <img className="w-20" src="/avatar.png" alt="" />
        <input
          placeholder="What's Happening"
          value={text}
          type="text"
          className="border-none outline-none"
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="flex justify-between">
        <div className=" ml-24 flex  items-center gap-4 text-primary mt-2">
          <ImageUploader onImageUpload={setUploadedImage} />
          <Film size={20} />
          <BarChart3 size={20} />
          <Smile size={20} />
          <MapPin size={20} />
          <Calendar size={20} />
        </div>

        <button
          onClick={handlePost}
          className="bg-primary text-white font-semibold px-5 py-1 rounded-full "
        >
          Post
        </button>
      </div>

      {uploadedImage && (
        <div className="relative mt-4 w-[80%] ">
          <img
            className="w-full h-64 object-cover"
            src={uploadedImage}
            alt=""
          />
        </div>
      )}
    </div>
  );
}

export default WhatsHappening;
