import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { MdContentCopy } from "react-icons/md";

export default function ShowTestimonial({ testimonial, avatar, onClose }) {
  const publicLink = `${window.location.origin}/${testimonial._id}/show`;
  const rating = testimonial?.rating || 0;
  const isVideo = Boolean(testimonial?.videoURL);

  if (isVideo) {
  return (
    <div className="w-[500px] bg-white border border-gray-300 rounded-xl p-6 text-center shadow-xl">
      <div className="text-4xl mb-4">✅</div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Get the Link Here
      </h3>

      <div className="bg-[#1e1e1e] rounded-md border border-gray-700 p-4 overflow-x-auto text-sm font-mono leading-6 text-gray-300 whitespace-pre-wrap w-[420px] mx-auto mb-6">
        <code>
          <span className="text-green-400">http://</span>
          <span className="text-blue-400">
            {publicLink.replace(/^https?:\/\//, '')}
          </span>
        </code>
      </div>

      <div className="flex justify-end items-center gap-3">
        <button
          onClick={onClose}
          className="text-sm px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-black font-medium"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(publicLink);
            toast.success("Link copied!");
          }}
          className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex"
        >
          <MdContentCopy className="w-4 h-4" />
          Copy Code
        </button>
      </div>
    </div>
  );
}

  
  return (
    <div className="h-[600px] bg-white flex flex-col items-center justify-start px-4 py-6 overflow-y-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 self-start ml-4">
        Preview
      </h2>

      <div className="w-[700px] h-[450px] bg-white border-[5px] border-blue-500 rounded-xl p-6 text-center shadow-xl">
        <h1 className="text-2xl font-bold mb-5 text-blue-600">
          TestimonialApp
        </h1>

        {avatar && (
          <img
            src={avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          />
        )}

        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`mx-1 text-xl ${
                index < rating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <p className="text-gray-700 text-base mb-4 px-2">
          {testimonial?.text || "No testimonial found."}
        </p>

        <div className="flex items-center justify-center gap-3">
          {testimonial?.avatar && (
            <img
              src={testimonial.avatar}
              alt="avatar"
              className="w-16 h-16 rounded-full"
            />
          )}
          <p className="text-black font-semibold">{testimonial.name}</p>
        </div>
      </div>

      <div className="mt-8 w-full max-w-[800px] flex flex-col items-start">
        <label className="text-sm font-medium text-gray-700 mb-2">
          Public Link
        </label>

        <div className="bg-[#1e1e1e] rounded-md border border-gray-700 p-4 overflow-x-auto text-sm font-mono leading-6 text-gray-300 whitespace-pre-wrap w-full">
          <code>
            <span className="text-green-400">https://</span>
            <span className="text-blue-400">
              {publicLink.replace(/^https?:\/\//, '')}
            </span>
          </code>
        </div>

       <button
  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md shadow flex items-center gap-2"
  onClick={() => {
    navigator.clipboard.writeText(publicLink);
    toast.success("Public link copied!");
  }}
>
  <MdContentCopy className="w-4 h-4" />
  Copy Link
</button>

      </div>
    </div>
  );
}
