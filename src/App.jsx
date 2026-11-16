import { useState } from "react";
import Login from "./Login";
import Admin from "./Admin";
import Student from "./Student";

const SKEY = "library_session";
const loadSession = () => {
  try { return JSON.parse(sessionStorage.getItem(SKEY)); } catch { return null; }
};

export default function App() {
  const [user, setUser] = useState(loadSession);

  const login = (u) => { try { sessionStorage.setItem(SKEY, JSON.stringify(u)); } catch {} setUser(u); };
  const logout = () => { try { sessionStorage.removeItem(SKEY); } catch {} setUser(null); };

  if (!user) return <Login onLogin={login} />;
  return user.role === "admin"
    ? <Admin user={user} onLogout={logout} />
    : <Student user={user} onLogout={logout} />;
}