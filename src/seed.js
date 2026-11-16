export const ADMIN = { email: "admin@library.edu", password: "admin123", name: "Head Librarian" };

const s = (id, name, email, course) => ({ id, name, email, course, password: "pass123" });
const b = (id, title, author, genre, copies) => ({ id, title, author, genre, copies, available: copies });

export const seed = {
  students: [
    s("S-1001", "Maya Santos", "maya@college.edu", "BSIT"),
    s("S-1002", "Leo Ramirez", "leo@college.edu", "BSCS"),
    s("S-1003", "Ana Villanueva", "ana@college.edu", "BSEd"),
    s("S-1004", "Jon Reyes", "jon@college.edu", "BSBA"),
    s("S-1005", "Kira Dela Cruz", "kira@college.edu", "BSN"),
  ],
  books: [
    b("B-001", "Clean Code", "Robert C. Martin", "Programming", 3),
    b("B-002", "The Pragmatic Programmer", "Hunt & Thomas", "Programming", 2),
    b("B-003", "Introduction to Algorithms", "Cormen et al.", "Computer Science", 2),
    b("B-004", "Database System Concepts", "Silberschatz", "Computer Science", 3),
    b("B-005", "Don't Make Me Think", "Steve Krug", "Design", 2),
    b("B-006", "The Design of Everyday Things", "Don Norman", "Design", 2),
    b("B-007", "Noli Me Tangere", "José Rizal", "Literature", 4),
    b("B-008", "El Filibusterismo", "José Rizal", "Literature", 4),
    b("B-009", "A Brief History of Time", "Stephen Hawking", "Science", 2),
    b("B-010", "Cosmos", "Carl Sagan", "Science", 2),
    b("B-011", "Principles of Economics", "N. Gregory Mankiw", "Business", 3),
    b("B-012", "The Lean Startup", "Eric Ries", "Business", 2),
    b("B-013", "Atomic Habits", "James Clear", "Self-Help", 3),
    b("B-014", "Sapiens", "Yuval Noah Harari", "History", 2),
    b("B-015", "Guns, Germs, and Steel", "Jared Diamond", "History", 1),
    b("B-016", "Calculus: Early Transcendentals", "James Stewart", "Mathematics", 3),
    b("B-017", "Linear Algebra Done Right", "Sheldon Axler", "Mathematics", 1),
    b("B-018", "Fundamentals of Nursing", "Potter & Perry", "Health", 2),
    b("B-019", "Educational Psychology", "Anita Woolfolk", "Education", 2),
    b("B-020", "Eloquent JavaScript", "Marijn Haverbeke", "Programming", 3),
  ],
  loans: [],
};