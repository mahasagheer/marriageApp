import LogoTwo from "../../assets/logoTwo.png";

export const Footer = () => (
  <footer className="bg-[#0a1333] dark:bg-[#0a0f21] text-white pt-12 pb-6 px-4 transition-colors duration-300">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
      {/* Left: Logo and Description */}
      <div className="space-y-4">
        <div className="flex justify-center md:justify-start">
          <img src={LogoTwo} alt="Online Nikah" className="h-16 rounded-full" />
        </div>
        <p className="text-sm text-gray-300 dark:text-gray-400 max-w-xs mx-auto md:mx-0">
          This website is strictly for matrimonial purpose only and not a dating website.
        </p>
        <div className="flex justify-center md:justify-start gap-3">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              className="h-10 rounded bg-white dark:bg-gray-200"
            />
          </a>
        </div>
      </div>

      {/* Center: Terms and Conditions */}
      <div className="space-y-3">
        <h4 className="font-semibold text-xl font-mono text-gray-200 dark:text-white">Terms and Conditions</h4>
        <ul className="space-y-2 text-gray-300 dark:text-gray-400 text-sm">
          <li>
            <a href="#" className="hover:text-marriageHotPink transition-colors">Terms & Conditions</a>
          </li>
          <li>
            <a href="#" className="hover:text-marriageHotPink transition-colors">Privacy Policy</a>
          </li>
        </ul>
      </div>

      {/* Right: Contact Info */}
      <div className="space-y-3">
        <h4 className="font-semibold text-xl font-mono text-gray-200 dark:text-white">Contact</h4>
        <p className="text-sm text-gray-300 dark:text-gray-400">
          Feel free to get in touch with us via phone or send us a message.
        </p>
        <p className="text-marriageHotPink font-semibold">123-456-7890</p>
        <p className="text-yellow-400 text-sm">support@onlinenikah.com</p>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-gray-700 dark:border-gray-600 mt-10 pt-4 max-w-6xl mx-auto text-xs text-gray-400 dark:text-gray-500 flex flex-col md:flex-row justify-between items-center gap-3">
      <span>© OnlineNikah 2023 - All Rights Reserved</span>
      <div className="flex gap-6 tracking-wider">
        <a href="#" className="hover:text-marriageHotPink font-mono transition-colors">FACEBOOK</a>
        <a href="#" className="hover:text-marriageHotPink font-mono transition-colors">TWITTER</a>
        <a href="#" className="hover:text-marriageHotPink font-mono transition-colors">INSTAGRAM</a>
      </div>
    </div>
  </footer>
);
