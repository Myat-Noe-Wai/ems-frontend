export const logoutUser = (navigate, setIsAuthenticated) => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/");
  };
  