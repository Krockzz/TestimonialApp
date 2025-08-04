import { Download } from "lucide-react";
import { Linkedin, Instagram } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";


export default function SocialMediaImport() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col px-6 ">
      <div className="text-3xl font-bold mb-3">Social media testimonials</div>
      <p className="text-muted-foreground mb-10 max-w-md">
        Import and track testimonials across social media.
      </p>

      <div className="flex flex-col items-center space-y-4">
        <Download className="w-8 h-8" />
        <h2 className="text-xl font-semibold">Import from</h2>
        <p className="text-sm text-muted-foreground text-center">
          Select a platform to import your social media posts
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <PlatformButton icon={<FaXTwitter size={20} />} label="Twitter" />
          <PlatformButton icon={<Linkedin size={20} />} label="LinkedIn" />
          {/* <PlatformButton icon={<X size={20} />} label="TikTok" /> */}
          <PlatformButton icon={<Instagram size={20} />} label="Instagram" />
        </div>
      </div>
    </div>
  );
}

function PlatformButton({ icon, label }) {
  return (
  <button
    type="button"
    className="flex items-center space-x-2 bg-gray-800 border border-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
  >
    {icon}
    <span>{label}</span>
  </button>
);

}
