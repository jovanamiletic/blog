import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./login.css";

export default function Login({
  setShowLogin,
  setTrenutnoKorisnickoIme,
  myStorage,
}) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      korisnickoime: usernameRef.current.value,
      lozinka: passwordRef.current.value,
    };
    try {
      const res = await axios.post(
        "http://localhost:8800/api/users/login",
        user
      );
      setTrenutnoKorisnickoIme(res.data.korisnickoime);
      // myStorage.setItem("user", res.data.korisnickoime);
      setShowLogin(false);
      setError(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room />
        Pin
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={usernameRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="loginBtn" type="submit">
          Login
        </button>
        {error && <span className="failure">Nesto nije u redu!</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}
