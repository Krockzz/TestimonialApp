import { Mail, Twitter, Facebook, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white py-16 px-6 rounded-t-3xl shadow-inner shadow-blue-900/30">
      <div className="max-w-6xl mx-auto text-center space-y-10">
        {/* Contact */}
        <div data-aos="fade-up">
          <h3 className="text-2xl font-bold text-blue-400 flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Us
          </h3>
          <p className="text-gray-400 mt-2 hover:text-gray-200 transition-colors duration-300">
            support@example.com
          </p>
        </div>

        {/* Social Links */}
        <div data-aos="fade-up" data-aos-delay="100">
          <h3 className="text-2xl font-bold text-blue-400 mb-4">Follow Us</h3>
          <div className="flex justify-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:scale-110 transition transform duration-300"
            >
              <Twitter className="w-6 h-6 text-blue-400 group-hover:text-blue-500" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:scale-110 transition transform duration-300"
            >
              <Facebook className="w-6 h-6 text-blue-400 group-hover:text-blue-500" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:scale-110 transition transform duration-300"
            >
              <Linkedin className="w-6 h-6 text-blue-400 group-hover:text-blue-500" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6" data-aos="fade-in">
          <p className="text-sm text-gray-500">
            &copy; 2025 <span className="text-blue-400 font-medium">YourCompany</span>. All rights reserved.
          </p>
        </div>
      </div>

   <iframe src="http://localhost:5173/688631f7166bdccc403cb26a/embed?borderColor=%239CA3AF&borderWidth=32&borderRadius=20px&textColor=%233B82F6&fontFamily=monospace&designStyle=largeImage&cardColor=%23ffffff&backgroundColor=%23ffffff" width="600" height="350" style= {{border :"none"}} loading="lazy"></iframe>
    </footer>
  );
}
