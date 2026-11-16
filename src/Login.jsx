import { useState } from "react";
import { db } from "./db";
import { ADMIN } from "./seed";

const STUDENT = { email: "maya@college.edu", password: "pass123" };

// 12-point starburst, drawn once
const burstPoints = Array.from({ length: 24 }, (_, i) => {
  const a = (i * Math.PI) / 12;
  const r = i % 2 ? 36 : 48;
  return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
}).join(" ");

const Burst = () => (
  <div className="lg-burst" aria-hidden="true">
    <svg viewBox="0 0 100 100">
      <polygon points={burstPoints} fill="var(--yellow)" stroke="#111" strokeWidth="3" strokeLinejoin="round" />
    </svg>
    <span>Open<br />24/7*</span>
  </div>
);

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", course: "", password: "" });
  const [err, setErr] = useState("");
  const [showHint, setShowHint] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const fill = (cred) => {
    setMode("login");
    setErr("");
    setF({ ...f, ...cred });
  };

  const submit = (e) => {
    e.preventDefault();
    const { students } = db.snapshot();
    if (mode === "login") {
      if (f.email === ADMIN.email && f.password === ADMIN.password)
        return onLogin({ role: "admin", name: ADMIN.name });
      const st = students.find((x) => x.email === f.email && x.password === f.password);
      if (!st) return setErr("Wrong email or password.");
      return onLogin({ role: "student", id: st.id, name: st.name });
    }
    if (students.some((x) => x.email === f.email)) return setErr("Email already registered.");
    db.create("students", { name: f.name, email: f.email, course: f.course, password: f.password });
    const st = db.snapshot().students.find((x) => x.email === f.email);
    onLogin({ role: "student", id: st.id, name: st.name });
  };

  return (
    <main className="lg-page">
      <header className="lg-hero">
        <Burst />
        <h1>Campus<br />Library</h1>
        <p className="label lg-tag">Borrow. Read. Return. Repeat.</p>
        <div className="lg-chips">
          <span className="badge chip c-pink">20+ titles</span>
          <span className="badge chip c-blue">1-tap borrow</span>
          <span className="badge chip c-orange">$0 late fees*</span>
        </div>
      </header>

      <form className="card pink lg-card" onSubmit={submit}>
        <h2>{mode === "login" ? "Log in" : "Join the club"}</h2>
        {err && <div className="err">{err}</div>}

        {mode === "register" && (
          <>
            <label>Full name<input required value={f.name} onChange={set("name")} /></label>
            <label>Course<input required value={f.course} onChange={set("course")} placeholder="BSIT" /></label>
          </>
        )}
        <label>Email<input type="email" required value={f.email} onChange={set("email")} /></label>
        <label>Password<input type="password" required value={f.password} onChange={set("password")} /></label>

        <div className="actions">
          <button className="btn" type="submit">{mode === "login" ? "Log in" : "Create account"}</button>
          <button
            className="btn alt" type="button"
            onClick={() => { setErr(""); setMode(mode === "login" ? "register" : "login"); }}
          >
            {mode === "login" ? "New student?" : "Back to login"}
          </button>
          <button
            type="button" className={"icon-btn" + (showHint ? " on" : "")}
            onClick={() => setShowHint(!showHint)}
            aria-label="Show demo credentials" aria-expanded={showHint}
          >i</button>
        </div>

        {showHint && (
          <div className="hintbox" role="note">
            <div className="label">Demo logins</div>
            <div className="hint-row">
              <span>Admin<br /><b>{ADMIN.email}</b> / <b>{ADMIN.password}</b></span>
              <button type="button" className="btn sm" onClick={() => fill({ email: ADMIN.email, password: ADMIN.password })}>Use</button>
            </div>
            <div className="hint-row">
              <span>Student<br /><b>{STUDENT.email}</b> / <b>{STUDENT.password}</b></span>
              <button type="button" className="btn sm" onClick={() => fill(STUDENT)}>Use</button>
            </div>
          </div>
        )}
      </form>

      <p className="muted lg-foot">*Terms may or may not apply. It's a mock library.</p>
    </main>
  );
}