import Image from "next/image";

export default function Footer() {
  return (
    <footer className="px-6 py-8 md:py-14 bg-white dark:bg-[#09090b]">
      <div className="container mx-auto flex flex-col gap-10 md:gap-14">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-10">
          {/* Logo & Social Media */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/logo.svg"
                width={30}
                height={100}
                alt="logo image"
              />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Blog App
              </h1>
            </div>
            {/* Social Icons */}
            <div className="flex space-x-3">
              <Image
                src="/assets/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
              />
              <Image
                src="/assets/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
              />
              <Image
                src="/assets/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
              />
              <Image
                src="/assets/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
              />
              <Image
                src="/assets/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            {/* Address */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Address
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Level 1, 12 Sample St, Sydney NSW 2000
              </p>
            </div>

            {/* Phone */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Phone Number
              </h2>
              <p className="text-gray-600 dark:text-gray-400">1800 123 4567</p>
            </div>

            {/* Email */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Email
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                blog@template.io
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-0 border-t border-gray-300 dark:border-gray-700 pt-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; 2023 Blog App. All rights reserved.
          </p>
          {/* Links */}
          <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Cookies Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
