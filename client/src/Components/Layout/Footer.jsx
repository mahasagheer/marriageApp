import logo from "../../assets/logo.png";
import LogoTwo from "../../assets/logoTwo.png";

export const Footer = () => (
  <footer className="bg-[#0a1333] text-white pt-12 pb-4 px-4">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-0 text-center md:text-left">
      {/* Left: Logo, description, app buttons */}
      <div className="flex-1 min-w-[220px] flex flex-col items-center md:items-start mb-8 md:mb-0">
        <div className="flex items-center mb-3 justify-center md:justify-start w-full">
          <img src={LogoTwo} alt="Online Nikah" className="h-16 mr-2" />
        </div>
        <p className="text-sm text-gray-300 mb-6 max-w-xs mx-auto md:mx-0">
          This website is strictly for matrimonial purpose only and not a dating website.
        </p>
        <div className="flex gap-3 justify-center md:justify-start">
          <a href="#">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10 rounded bg-white" />
          </a>
        </div>
      </div>
      {/* Center: Terms */}
      <div className="flex-1 min-w-[180px] mt-8 md:mt-0 flex flex-col items-center md:items-start">
        <h4 className="font-semibold mb-3 text-xl font-mono text-gray-200">Terms and conditions</h4>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li><a href="#" className="hover:text-marriageHotPink">Terms & Conditions</a></li>
          <li><a href="#" className="hover:text-marriageHotPink">Privacy Policy</a></li>
        </ul>
      </div>
      {/* Right: Contact */}
      <div className="flex-1 min-w-[220px] mt-8 md:mt-0 flex flex-col items-center md:items-start">
        <h4 className="font-semibold mb-3 text-xl font-mono text-gray-200">Contacts</h4>
        <p className="text-sm text-gray-300 mb-2">Feel free to get in touch with us via phone or send us a message.</p>
        <p className="text-marriageHotPink font-semibold mb-1">123-456-7890</p>
        <p className="text-yellow-400 text-sm">support@onlinenikah.com</p>
      </div>
    </div>
    {/* Bottom bar */}
    <div className="border-t border-gray-700 mt-10 pt-4 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto text-xs text-gray-400 text-center md:text-left gap-2">
      <div className="mb-2 md:mb-0">© OnlineNikah 2023 - All Rights Reserved</div>
      <div className="flex gap-6 justify-center md:justify-end w-full md:w-auto">
        <a href="#" className="hover:text-marriageHotPink font-mono tracking-wider">FACEBOOK</a>
        <a href="#" className="hover:text-marriageHotPink font-mono tracking-wider">TWITTER</a>
        <a href="#" className="hover:text-marriageHotPink font-mono tracking-wider">INSTAGRAM</a>
      </div>
    </div>
  </footer>
); 