export const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div
        className="spinner-grow text-primary"
        role="status"
        style={{ width: "4rem", height: "4rem" }}
      />
    </div>
  );
};
