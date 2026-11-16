import { useState } from "react";
import { seed } from "./seed";

const KEY = "library_mock_db_v1";

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return structuredClone(seed);
};

// keeps "available" in sync with active loans on every write
const write = (d) => {
  d.books = d.books.map((bk) => ({
    ...bk,
    available: Math.max(0, bk.copies - d.loans.filter((l) => l.bookId === bk.id && !l.returned).length),
  }));
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {}
};

const uid = (p) => p + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();

export const db = {
  snapshot: read,

  create(table, item) {
    const d = read();
    d[table].push({ id: uid(table[0].toUpperCase()), ...item });
    write(d);
  },
  update(table, id, patch) {
    const d = read();
    d[table] = d[table].map((r) => (r.id === id ? { ...r, ...patch } : r));
    write(d);
  },
  remove(table, id) {
    const d = read();
    d[table] = d[table].filter((r) => r.id !== id);
    if (table === "students") d.loans = d.loans.filter((l) => l.studentId !== id);
    if (table === "books") d.loans = d.loans.filter((l) => l.bookId !== id);
    write(d);
  },
  borrow(studentId, bookId) {
    const d = read();
    const book = d.books.find((x) => x.id === bookId);
    if (!book || book.available < 1) return "No copies available.";
    if (d.loans.some((l) => l.studentId === studentId && l.bookId === bookId && !l.returned))
      return "You already borrowed this book.";
    d.loans.push({ id: uid("L"), studentId, bookId, date: new Date().toISOString().slice(0, 10), returned: false });
    write(d);
    return null;
  },
  giveBack(loanId) {
    const d = read();
    d.loans = d.loans.map((l) => (l.id === loanId ? { ...l, returned: true } : l));
    write(d);
  },
  reset() {
    try { localStorage.removeItem(KEY); } catch {}
  },
};

// returns [data, refresh]; call refresh() after any db write
export function useDb() {
  const [data, setData] = useState(db.snapshot);
  return [data, () => setData(db.snapshot())];
}