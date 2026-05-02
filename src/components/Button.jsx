// frontend/src/components/Button.jsx
function Button({ 
  text, 
  variant = "primary", 
  style, 
  onClick, 
  disabled = false,
  type = "button" 
}) {
  const classes = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    purple: "btn-purple",
    purpleDisabled: "btn-purple-disabled",
    outline: "btn-outline",
  };

  return (
    <button
      type={type}  
      className={classes[variant]}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;