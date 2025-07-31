const colorMap = {
  marriageHotPink: "bg-marriageHotPink",
  marriagePink: "bg-marriagePink",
  marriageRed: "bg-marriageRed",
};

export const Button = ({BtnIcon, onClick,padding = "px-7", textColor = "text-white", btnText, btnColor = "marriageHotPink", hoverColor='bg-marriageRed' }) => {
  return (
    <button
      onClick={onClick}
      className={`${padding} font-sans py-2 transition-all hover:${hoverColor} ${colorMap[btnColor] || btnColor} ${textColor} flex items-center justify-center gap-2`}
    >
      {BtnIcon && <BtnIcon className="w-5 h-5" />}  {btnText}
    </button>
  );
};