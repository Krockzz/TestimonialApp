import FeatureCard from "./FeatureCard.jsx";

export default function Features() {
  return (
    <section className="py-16 px-6 bg-gray-900">
      <h2 className="text-2xl font-semibold text-center mb-12 text-white">Why Choose Us?</h2>
      <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
        <FeatureCard
          title="Easy to Use"
          description="Simple dashboard to manage all your spaces and testimonials."
        />
        <FeatureCard
          title="Video & Text Support"
          description="Let customers send you written or recorded video testimonials."
        />
        <FeatureCard
          title="Embed Anywhere"
          description="Easily embed testimonials on any website with a few lines of code."
        />
      </div>
    </section>
  );
}
