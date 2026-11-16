import { useState } from "react";
import { db, useDb } from "./db";
import { Modal, EditForm, SearchBar } from "./ui";

const CFG = {
  books: {
    fields: [
      { name: "title", label: "Title" }, { name: "author", label: "Author" },
      { name: "genre", label: "Genre" }, { name: "copies", label: "Copies", type: "number" },
    ],
    blank: { title: "", author: "", genre: "", copies: 1 },
  },
  students: {
    fields: [
      { name: "name", label: "Name" }, { name: "email", label: "Email", type: "email" },
      { name: "course", label: "Course" }, { name: "password", label: "Password" },
    ],
    blank: { name: "", email: "", course: "", password: "pass123" },
  },
};
const ACCENTS = ["", "yellow", "teal", "blue", "cyan"];

export default function Admin({ user, onLogout }) {
  const [data, refresh] = useDb();
  const [tab, setTab] = useState("books");
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState(null); // { row, isNew }

  const cfg = CFG[tab];
  const rows = data[tab].filter((r) =>
    cfg.fields.some((f) => String(r[f.name]).toLowerCase().includes(q.toLowerCase()))
  );
  const borrowedBy = (id) => data.loans.filter((l) => l.studentId === id && !l.returned).length;

  const save = (v) => {
    edit.isNew ? db.create(tab, v) : db.update(tab, edit.row.id, v);
    setEdit(null); refresh();
  };
  const del = (r) => {
    if (confirm(`Delete "${r.title || r.name}"?`)) { db.remove(tab, r.id); refresh(); }
  };

  return (
    <div className="wrap">
      <div className="topbar">
        <h1 style={{ fontSize: "clamp(36px,8vw,64px)" }}>Admin</h1>
        <div className="actions">
          <button className="btn alt" onClick={() => { if (confirm("Reset all mock data?")) { db.reset(); refresh(); } }}>Reset data</button>
          <button className="btn" onClick={onLogout}>Log out</button>
        </div>
      </div>

      <div className="tabs">
        {["books", "students"].map((t) => (
          <button key={t} className={"tab" + (tab === t ? " on" : "")} onClick={() => { setTab(t); setQ(""); }}>
            {t} ({data[t].length})
          </button>
        ))}
      </div>

      <div className="card">
        <div className="row">
          <div className="grow"><SearchBar value={q} onChange={setQ} placeholder={`Search ${tab}...`} /></div>
          <button className="btn" onClick={() => setEdit({ row: cfg.blank, isNew: true })}>+ Add {tab === "books" ? "book" : "student"}</button>
        </div>
      </div>

      {rows.length === 0 && <div className="card">Nothing found.</div>}

      {rows.map((r, i) => (
        <div key={r.id} className={"card " + ACCENTS[i % ACCENTS.length]}>
          <div className="row">
            <div className="grow">
              {tab === "books" ? (
                <>
                  <strong>{r.title}</strong>
                  <div className="muted">{r.author} · {r.genre} · {r.id}</div>
                </>
              ) : (
                <>
                  <strong>{r.name}</strong>
                  <div className="muted">{r.email} · {r.course} · {r.id}</div>
                </>
              )}
            </div>
            {tab === "books" ? (
              <span className={"badge" + (r.available ? "" : " out")}>{r.available}/{r.copies} in</span>
            ) : (
              <span className="badge">{borrowedBy(r.id)} borrowed</span>
            )}
            <div className="actions">
              <button className="btn sm" onClick={() => setEdit({ row: r })}>Edit</button>
              <button className="btn sm alt" onClick={() => del(r)}>Delete</button>
            </div>
          </div>
        </div>
      ))}

      {edit && (
        <Modal title={(edit.isNew ? "Add " : "Edit ") + (tab === "books" ? "book" : "student")} onClose={() => setEdit(null)}>
          <EditForm fields={cfg.fields} initial={edit.row} onSave={save} onCancel={() => setEdit(null)} />
        </Modal>
      )}
    </div>
  );
}