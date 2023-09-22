function ErrorMessage({ errorMessage }) {
  return (
    <p>
      <span>😠 </span>
      <b>{errorMessage}</b>
      <span> 😠</span>
    </p>
  );
}

export default ErrorMessage;
