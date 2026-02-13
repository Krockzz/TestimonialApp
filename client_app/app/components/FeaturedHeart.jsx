import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function Featured({ testimonial }) {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URI = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (typeof testimonial?.featured?.enabled === "boolean") {
      setIsLiked(testimonial.featured.enabled);
    }
  }, [testimonial?.featured?.enabled]);

  const toggle = async () => {
    if (loading) return;

    setLoading(true);
    setIsLiked((p) => !p);

    try {
      await fetch(
        `${API_URI}/api/v1/users/Testimonial/toggle-featured/${testimonial._id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
    } catch {
      setIsLiked((p) => !p); // rollback
    } finally {
      setLoading(false);
    }
  };

  return (
    <Heart
      onClick={toggle}
      className={`w-4 h-4 cursor-pointer transition ${
        isLiked
          ? "text-red-400 fill-red-400"
          : "text-red-400 hover:scale-110"
      }`}
    />
  );
}
