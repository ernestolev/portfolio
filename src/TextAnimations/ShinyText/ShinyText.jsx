/*
	jsrepo 1.29.1
	Installed from https://reactbits.dev/default/
	29-1-2025
*/

import "./ShinyText.css";

const ShinyText = ({ text, disabled = false, speed = 5, className = "" }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`shiny-text ${disabled ? "disabled" : ""} ${className}`}
      style={{ animationDuration }}
    >
      {text}
    </div>
  );
};

export default ShinyText;
