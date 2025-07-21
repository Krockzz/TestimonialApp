export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
          <p className="text-gray-400 mb-4">support@example.com</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
          <div className="flex justify-center space-x-4">
            <a
              href="https://twitter.com"
              className="text-blue-400 hover:text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a
              href="https://facebook.com"
              className="text-blue-400 hover:text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href="https://linkedin.com"
              className="text-blue-400 hover:text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>

        
      

    

        <div className="border-t border-gray-700 pt-6 mt-6">
          <p className="text-gray-400">
            &copy; 2025 YourCompany. All Rights Reserved.
          </p>
        </div>
      </div>

      

    </footer>
  );
}
