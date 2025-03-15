import Image from "next/image";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="px-4 sm:px-6 py-8 md:py-12 bg-white dark:bg-[#09090b] text-gray-900 dark:text-white">
      <div className="container mx-auto flex flex-col gap-8 sm:gap-10 md:gap-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 sm:gap-8 md:gap-10">
          {/* Logo & Social Media */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/logo.svg"
                width={28}
                height={28}
                alt="Blog App Logo"
                className="w-7 h-7 sm:w-8 sm:h-8"
              />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Blog App
              </h1>
            </div>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://github.com"
                aria-label="Github"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://linkedin.com"
                aria-label="Linkedin"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center md:text-left">
            {/* Address */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Address</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Level 1, 12 Sample St, Sydney NSW 2000
              </p>
            </div>

            {/* Phone */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold">
                Phone Number
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                1800 123 4567
              </p>
            </div>

            {/* Email */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Email</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                blog@template.io
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 border-t border-gray-200 dark:border-gray-800 pt-6">
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            © {new Date().getFullYear()} Blog App. All rights reserved.
          </p>
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Cookies Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
