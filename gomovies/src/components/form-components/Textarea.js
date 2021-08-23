const Textarea = ({ title, name, ...props }) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {title}
      </label>
      <textarea className="form-control" id={name} name={name} {...props} />
    </div>
  );
};
export default Textarea;
