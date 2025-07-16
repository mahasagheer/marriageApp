import logo from "../../assets/logo.png";
import { Button } from "./Button";
export const NavBar = ({ onLoginClick, onRegisterClick }) => {
    return (
      <nav className="bg-white/90 py-4 px-[15%] flex justify-between items-center font-serif">
        <div className="flex items-center">
          <img 
            src={logo} 
            alt="WedLink" 
            className="h-16 bg-white"
          />
        </div>
        {/* <div className="flex space-x-4">
          <Button btnText={"Login"} btnColor={"marriageHotPink"} onClick={onLoginClick} />
          <Button btnText={"Register"} btnColor={"marriageHotPink"} />
        </div> */}
      </nav>
    );
  };