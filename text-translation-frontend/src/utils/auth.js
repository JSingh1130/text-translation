export const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
  
    try {
      const [, payload] = token.split('.');
      const decoded = JSON.parse(atob(payload));
      const exp = decoded.exp * 1000; // Convert seconds to milliseconds
      return Date.now() < exp;
    } catch {
      return false;
    }
  };
  