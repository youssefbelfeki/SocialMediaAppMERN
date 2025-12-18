/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../authContext/UserCotenxt";
import { getMeApi, updateMyAvatar } from "../api/auth";
import { deletePost, getPostsByUser } from "../api/posts";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import WhatsHappening from "../components/WhatsHappening";
import AvatarUploader from "../components/AvatarUploader";

function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const u = await getMeApi(id);
      setProfile(u);

      const myPosts = await getPostsByUser(id);
      setPosts(myPosts);
    })();
  }, [id]);

  const onDelete = useCallback(async (postId) => {
    await deletePost(postId);
    setPosts((prev) => prev.filter((p) => p._id !== postId));

    toast.success("Post deleted successfully ");
  }, []);

  const handleAvatarUploaded = async (url) => {
    try {
      toast.loading("uploading avatar...");
      const res = await updateMyAvatar(profile._id, url);
      setProfile((prev) => (prev ? { ...prev, avatar: url } : prev));
      toast.success("Avatar updated");
    } catch (error) {
      toast.error("Failed to save avatar");
    } finally {
      toast.dismiss();
    }
  };

  if (!profile) return <div className="p-6 mt-10">Loading...</div>;
  const isOwner = user?._id === profile._id;
  
  return (
    <div className="max-w-2xl mx-auto p-4 ">
      <WhatsHappening />
      <div className="flex items-center mt-8 gap-4">
        <div className="relative  cursor-pointer">
          <img src={profile?.image} alt=""/>

          <AvatarUploader
            src={profile?.avatar}
            size={64}
            disabled={!isOwner}
            onUploaded={handleAvatarUploaded}
          />
        </div>
        <div>
          <h1>{profile?.name}</h1>
          <span className="text-gray-500">{profile?.email}</span>
        </div>
      </div>

      <hr className="my-6" />

      <div className="space-y-4">
        {posts?.map((post) => (
          <article
            key={post._id}
            className="border-b border-gray-200 pb-4 relative"
          >
            {post?.image && (
              <img
                src={post?.image}
                className="mt-3 rounded-2xl max-h-[600px] w-full object-cover"
                loading="lazy"
                alt=""
              />
            )}

            <div className="text-xs  text-gray-500 mt-2">
              {new Date(post?.createdAt).toLocaleString()}
              {isOwner && (
                <button
                  className=" absolute right-3 top-3  text-sm text-red-600 mt-2"
                  onClick={() => onDelete(post?._id)}
                >
                  <Trash />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Profile;
