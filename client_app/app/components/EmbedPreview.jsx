import React from "react";
import { MdContentCopy } from "react-icons/md";
import toast from "react-hot-toast";

export default function EmbedBox() {
  const link = `<iframe src="http://localhost:5173/688631f7166bdccc403cb26a/embed?borderColor=%239CA3AF&borderWidth=32&borderRadius=20px&textColor=%233B82F6&fontFamily=monospace&designStyle=largeImage&cardColor=%23ffffff&backgroundColor=%23ffffff" width="600" height="350" style="border:none;" loading="lazy"></iframe>`;

  return (
    <div className="bg-[#1e293b] text-white p-6 rounded-xl shadow-md max-w-4xl mx-auto mt-12">
      <h2 className="text-2xl font-semibold mb-2">Try our sample embed code</h2>
      <p className="mb-4 text-gray-300">
        Embed the wall of love to your website in 1 minute
      </p>

      <div className="bg-[#111827]  rounded-md overflow-x-auto px-4 py-4 text-sm font-mono whitespace-pre-wrap leading-relaxed">
        <code>
          <span className="text-[#7dd3fc">&lt;</span>
          <span className="text-[#f472b6]">iframe</span>{" "}
          <span className="text-[#facc15]">src</span>=
          <span className="text-[#34d399]">"http://localhost:5173/688631f7166bdccc403cb26a/embed?borderColor=%239CA3AF&amp;borderWidth=32&amp;borderRadius=20px&amp;textColor=%233B82F6&amp;fontFamily=monospace&amp;designStyle=largeImage&amp;cardColor=%23ffffff&amp;backgroundColor=%23ffffff"</span>{" "}
          <span className="text-[#facc15]">width</span>=
          <span className="text-[#34d399]">"600"</span>{" "}
          <span className="text-[#facc15]">height</span>=
          <span className="text-[#34d399]">"350"</span>{" "}
          <span className="text-[#facc15]">style</span>=
          <span className="text-[#34d399]">"border:none;"</span>{" "}
          <span className="text-[#facc15]">loading</span>=
          <span className="text-[#34d399]">"lazy"</span>
          <span className="text-[#7dd3fc]">&gt;&lt;/</span>
          <span className="text-[#f472b6]">iframe</span>
          <span className="text-[#7dd3fc]">&gt;</span>
        </code>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => {
            navigator.clipboard.writeText(link);
            toast.success("Link Copied Successfully!");
          }}
          className="bg-[#e0e7ff] text-[#2563eb] px-4 py-2 rounded-md font-medium hover:bg-[#c7d2fe] transition flex items-center gap-2"
        >
          <MdContentCopy /> Copy
        </button>
      </div>
    </div>
  );
}

