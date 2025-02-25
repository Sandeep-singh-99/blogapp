import AdminNavbar from "./components/AdminNavBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
      <section className="admin-theme">
        <AdminNavbar/>
        {children}
      </section>
    );
  }
  