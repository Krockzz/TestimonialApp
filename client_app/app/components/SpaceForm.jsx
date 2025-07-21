import { useNavigation, Form } from "@remix-run/react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SpaceForm({
  initialData = {},
  method = "post",
  action = "/space/create",
  isEdit = false,
}) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [avatarPreview, setAvatarPreview] = useState(initialData.avatar || null);

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }

  return (
    <section className="py-20 px-4 bg-gray-950 min-h-screen text-white">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-semibold text-white mb-4">
            {isEdit ? "Edit Space" : "Create New Space"}
          </h1>
          <p className="text-gray-400 mb-10">
            {isEdit
              ? "Update your testimonial space details."
              : "Fill in the details to set up your testimonial space."}
          </p>

          <div
            className={`bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-lg ${
              isSubmitting ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <Form
              method={method}
              encType="multipart/form-data"
              action={action}
              className="space-y-6"
            >
              {/* Space Name */}
              <div>
                <label className="block mb-1 text-sm text-gray-300 font-medium">
                  Space Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={initialData.name || ""}
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g. Krunal's Space"
                />
              </div>

              {/* Header Title */}
              <div>
                <label className="block mb-1 text-sm text-gray-300 font-medium">
                  Header Title
                </label>
                <input
                  type="text"
                  name="HeaderTitle"
                  defaultValue={initialData.HeaderTitle || ""}
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g. Share Your Thoughts"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 text-sm text-gray-300 font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={initialData.description || ""}
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  placeholder="Tell users what this space is about..."
                />
              </div>

              {/* Custom Message */}
              <div>
                <label className="block mb-1 text-sm text-gray-300 font-medium">
                  Custom Message
                </label>
                <input
                  type="text"
                  name="customMessage"
                  defaultValue={initialData.customMessage || ""}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g. Thanks for sharing!"
                />
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block mb-1 text-sm text-gray-300 font-medium">
                  Avatar Image
                </label>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 hover:file:bg-blue-700"
                />
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="mt-4 w-20 h-20 rounded-lg object-cover border border-gray-700"
                  />
                )}
              </div>

              {/* Submit Button */}
              <button
  type="submit"
  disabled={isSubmitting}
  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 flex items-center justify-center gap-2"
>
  {isSubmitting ? (
    <>
      
      {isEdit ? "Updating" : "Creating"}
     <svg
  className="h-4 w-auto"
  viewBox="0 0 100 20"
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
>
  <circle cx="15" cy="10" r="5">
    <animate
      attributeName="r"
      values="5;8;5"
      dur="0.8s"
      repeatCount="indefinite"
      begin="0s"
    />
  </circle>
  <circle cx="50" cy="10" r="5">
    <animate
      attributeName="r"
      values="5;8;5"
      dur="0.8s"
      repeatCount="indefinite"
      begin="0.2s"
    />
  </circle>
  <circle cx="85" cy="10" r="5">
    <animate
      attributeName="r"
      values="5;8;5"
      dur="0.8s"
      repeatCount="indefinite"
      begin="0.4s"
    />
  </circle>
</svg>


    </>
  ) : (
    isEdit ? "Update Space" : "Create Space"
  )}
</button>

            </Form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
