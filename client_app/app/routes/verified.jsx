
export const handle = { skipLayout: true };

export default function Verified() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-green-600">
          ✅ Email Verified Successfully
        </h1>
        <p className="text-gray-600">
          Your testimonial has been confirmed and sent for review.
        </p>
      </div>
    </div>
  );
}
