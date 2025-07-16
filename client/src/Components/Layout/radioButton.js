// Radio input component
export const RadioInput = ({ name, value, checked, onChange, label, icon: Icon }) => (
    <label className="flex flex-row items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-marriageHotPink focus:ring-marriageHotPink"
      />
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </label>
  );