// routes/pricing.jsx
import PricingCard from "../components/PricingCard.jsx";

export default function PricingPage() {
  const plans = [
    {
      title: "Basic",
      price: "$19/month",
      features: [
        "1 User Account",
        "Basic Support",
        "Limited Storage",
        "Access to Core Features",
      ],
    },
    {
      title: "Standard",
      price: "$39/month",
      features: [
        "5 User Accounts",
        "Priority Support",
        "500GB Storage",
        "All Core Features",
        "Advanced Analytics",
      ],
    },
    {
      title: "Premium",
      price: "$79/month",
      features: [
        "Unlimited User Accounts",
        "24/7 Premium Support",
        "2TB Storage",
        "Advanced Features",
        "Custom Reports",
      ],
    },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-12">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Our Pricing Plans</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <PricingCard key={index} title={plan.title} price={plan.price} features={plan.features} />
          ))}
        </div>
      </div>
    </div>
  );
}
