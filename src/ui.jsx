import { useState } from "react";

export function Modal({ title, onClose, children }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function EditForm({ fields, initial, onSave, onCancel }) {
  const [v, setV] = useState(initial);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(v); }}>
      {fields.map((f) => (
        <label key={f.name}>
          {f.label}
          <input
            type={f.type || "text"} required min={f.type === "number" ? 1 : undefined}
            value={v[f.name] ?? ""}
            onChange={(e) => setV({ ...v, [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value })}
          />
        </label>
      ))}
      <div className="actions">
        <button className="btn alt" type="submit">Save</button>
        <button className="btn" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export const SearchBar = ({ value, onChange, placeholder }) => (
  <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label="Search" />
);