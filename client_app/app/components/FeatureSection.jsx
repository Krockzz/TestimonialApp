import { Link } from "@remix-run/react";

export default function FeatureSection({ title, description, image, reverse = false }) {
  return (
    <div
      className={`flex flex-col md:flex-row ${
        reverse ? "md:flex-row-reverse" : ""
      } items-center justify-between gap-14 px-6 max-w-6xl mx-auto py-20`}
      data-aos="fade-up"
    >
      {/* Image */}
      <div className="md:w-1/2 w-full">
        <img
          src={image}
          alt={title}
          className="w-full rounded-2xl shadow-2xl object-cover"
          loading="lazy"
        />
      </div>

      {/* Text Content */}
      <div className="md:w-1/2 w-full space-y-6 text-left">
        <h3 className="text-3xl md:text-4xl font-bold text-white">{title}</h3>
        <p className="text-lg text-gray-400">{description}</p>

        <Link to="/space">
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 ease-in-out shadow-md hover:shadow-xl">
            Try for Free
          </button>
        </Link>
      </div>
    </div>
  );
}
