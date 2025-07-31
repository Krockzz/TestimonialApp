import { Link } from "@remix-run/react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import FeatureSection from "./FeatureSection"; 
import { Sparkles } from "lucide-react"; 
import ShowcaseEmbed from "./EmbedPreview";

export default function Hero({ isAuthenticated }) {
  const targetRoute = isAuthenticated ? "/space" : "/space";

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const features = [
    {
      title: "A dedicated landing page",
      description:
        "Create a dedicated landing page for your business. Share the page link easily via email, social media, or even SMS. Setup can be done in two minutes.",
      image: "/public/Testimonial1.png",
    },
    {
      title: "Collect Video and text Testimonial",
      description:
        "Support both video and written testimonials with a smooth, easy-to-use interface. Let your happiest customers share their stories in just a few clicks.",
      image: "/images/embed.png",
      reverse: true,
    },
    {
      title: "A dashboard to manage all testimonials",
      description:
        "You will have a simple & clean dashboard to manage all testimonials in one place. It's like your email inbox, but it's designed for your social proof!",
      image: "/public/Testimonial3.png",
    },
    {
      title: "Embed Anywhere, Instantly",
      description:
        "Copy and paste one HTML snippet to embed your testimonial like this 👉 No dev needed.",
      image: "/public/Testimonial2.png",
      reverse: true,
    },
  ];

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden text-center py-36 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-700/30 rounded-full blur-[150px] z-0"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mb-6" data-aos="fade-down">
            <h2 className="flex items-center justify-center gap-2 text-sm uppercase tracking-widest text-blue-400 font-semibold">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Your Social Proof Engine
            </h2>
          </div>

          <h1
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent"
            data-aos="fade-up"
          >
            Collect Powerful Testimonials
          </h1>

          <p
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Effortlessly gather text and video testimonials from your customers
            to build trust, showcase your product, and grow faster.
          </p>

          <Link to={targetRoute}>
            <button
              className="relative group bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-xl"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <span className="absolute inset-0 rounded-full bg-blue-500 blur-xl opacity-20 group-hover:opacity-30 transition-all duration-300"></span>
              <span className="relative z-10">Get Started for Free</span>
            </button>
          </Link>
        </div>

        {/* Divider */}
        <div className="w-full mt-36" data-aos="fade-in">
          <div className="border-b border-gray-700 w-full"></div>
        </div>

        {/* Teaser Section */}
        <div className="text-center space-y-6 mt-28" data-aos="fade-up">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-snug">
            Add testimonials to your website <br className="hidden md:block" />
            with zero coding!
          </h2>

          <div className="mt-10 mb-6">
            <ShowcaseEmbed />
          </div>

          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Simply copy and paste our embed code. Works on any no-code platform!
          </p>
        </div>

        {/* Divider */}
        <div className="w-full mt-36 mb-20" data-aos="fade-in">
          <div className="border-b border-gray-700 w-full"></div>
        </div>

        {/* Intro to Features */}
        <div className="text-center space-y-6 mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-snug">
            Collect and display testimonials <br /> all in one solution
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            No need for separate tools—manage everything in one place and
            showcase your customer love with ease.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-24">
        {features.map((feature, index) => (
          <FeatureSection
            key={index}
            title={feature.title}
            description={feature.description}
            image={feature.image}
            reverse={feature.reverse}
          />
        ))}
      </div>
    </section>
  );
}
