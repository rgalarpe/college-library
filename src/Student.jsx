import { useState } from "react";
import { db, useDb } from "./db";
import { SearchBar } from "./ui";

export default function Student({ user, onLogout }) {
  const [data, refresh] = useDb();
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");

  const mine = data.loans.filter((l) => l.studentId === user.id && !l.returned);
  const bookOf = (id) => data.books.find((b) => b.id === id);
  const books = data.books.filter((b) =>
    [b.title, b.author, b.genre].some((x) => x.toLowerCase().includes(q.toLowerCase()))
  );

  const borrow = (id) => { setMsg(db.borrow(user.id, id) || ""); refresh(); };
  const giveBack = (id) => { db.giveBack(id); setMsg(""); refresh(); };

  return (
    <div className="wrap">
      <div className="topbar">
        <h1 style={{ fontSize: "clamp(36px,8vw,64px)" }}>Hi, {user.name.split(" ")[0]}!</h1>
        <button className="btn" onClick={onLogout}>Log out</button>
      </div>

      <h2>My books ({mine.length})</h2>
      {mine.length === 0 && <div className="card">Nothing borrowed yet.</div>}
      {mine.map((l) => (
        <div key={l.id} className="card teal">
          <div className="row">
            <div className="grow">
              <strong>{bookOf(l.bookId)?.title}</strong>
              <div className="muted">Borrowed {l.date}</div>
            </div>
            <button className="btn sm alt" onClick={() => giveBack(l.id)}>Return</button>
          </div>
        </div>
      ))}

      <h2 style={{ marginTop: 30 }}>Browse books</h2>
      {msg && <div className="err">{msg}</div>}
      <div className="card"><SearchBar value={q} onChange={setQ} placeholder="Search title, author, genre..." /></div>
      {books.map((b, i) => (
        <div key={b.id} className={"card " + ["", "yellow", "pink", "blue"][i % 4]}>
          <div className="row">
            <div className="grow">
              <strong>{b.title}</strong>
              <div className="muted">{b.author} · {b.genre}</div>
            </div>
            <span className={"badge" + (b.available ? "" : " out")}>{b.available} left</span>
            <button className="btn sm" disabled={!b.available} onClick={() => borrow(b.id)}>Borrow</button>
          </div>
        </div>
      ))}
    </div>
  );
}