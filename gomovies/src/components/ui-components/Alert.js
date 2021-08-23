const Alert = ({ alertType, alertMessage }) => {
  return (
    <div className={`alert ${alertType}`} role="alert">
      {alertMessage}
    </div>
  );
};
export default Alert;
