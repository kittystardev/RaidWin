import React from "react";

export default function RadioButton({
  name,
  value,
  checked,
  onChange,
  disabled,
  className,
}) {
  return (
    <label
      className={`block mb-2 font-bold verify-label bg-pickled-bluewood px-4 py-3 bg-opacity-[0.56] rounded-[36px] gap-3 text-sm tracking-wide`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={`form-radio focus:outline-none focus:shadow-outline-blue verify-input ${className}`}
        disabled={disabled}
      />{" "}
      <span className="verify-span">{value}</span>
    </label>
  );
}
