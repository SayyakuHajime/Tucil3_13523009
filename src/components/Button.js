// components/Button.js
export const PrimaryButton = ({ onClick, label, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-primary text-secondary border-2 border-secondary px-7 py-1 rounded-lg 
        font-bold tracking-widest uppercase font-baloo cursor-pointer
        transition-all duration-150
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-primary-hover active:scale-95"
        }
      `}
    >
      {label}
    </button>
  );
};

export const SecondaryButton = ({ onClick, label, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-secondary text-primary border-2 border-primary px-7 py-1 rounded-lg 
        font-bold tracking-widest uppercase font-baloo cursor-pointer
        transition-all duration-150
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-secondary-hover active:scale-95"
        }
      `}
    >
      {label}
    </button>
  );
};
