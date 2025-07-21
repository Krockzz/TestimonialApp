import FeatureCard from "./FeatureCard.jsx";

const featuresList = [
  {
    title: "Collect Video Testimonials",
    description: "Let your users easily record and submit video testimonials right from their browser.",
  },
  {
    title: "Text Testimonials",
    description: "Accept and display written testimonials to showcase customer trust.",
  },
  {
    title: "Embed Anywhere",
    description: "Copy & paste embeddable cards or carousels into any site—no coding required.",
  },
  {
    title: "Custom Branding",
    description: "Make your testimonials match your brand’s colors and style perfectly.",
  },
  {
    title: "Analytics",
    description: "Track views, clicks, and performance of each testimonial.",
  },
  {
    title: "Multiple Spaces",
    description: "Organize testimonials by project, team, or brand using separate spaces.",
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-16 px-6 bg-gray-950 text-white">
      <h2 className="text-3xl font-bold text-center mb-12 text-blue-400">
        Powerful Features to Boost Your Brand
      </h2>
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {featuresList.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}
