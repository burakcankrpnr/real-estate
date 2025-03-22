import { useState, useEffect } from 'react';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.role === "admin" || parsedUser.role === "moderator") {
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error("Kimlik doğrulama hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading };
} 