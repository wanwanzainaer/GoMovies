const Input = ({
  name,
  value,
  type,
  placeholder,
  title,
  handleChange,
  errorMsg,
  errorDiv,
  className,
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {title}
      </label>
      <input
        type={type}
        className={`form-control ${className}`}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <div className={errorDiv}>{errorMsg}</div>
    </div>
  );
};
export default Input;
