const Select = ({ name, placeholder, title, options, value, handleChange }) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {title}
      </label>
      <select
        className="form-select"
        name={name}
        value={value}
        onChange={handleChange}
      >
        <option className="form-select">{placeholder} </option>
        {options.map((opt, i) => (
          <option
            className="form-select"
            key={opt.id}
            value={opt.id}
            label={opt.value}
          >
            {opt.value}
          </option>
        ))}
      </select>
    </div>
  );
};
export default Select;
