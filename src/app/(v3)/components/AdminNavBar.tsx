import Link from "next/link";

export default function AdminNavbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b-2  shadow-lg  dark:border-b-gray-600 text-foreground">
      <Link href={"/"} className="text-xl font-bold">
        Admin Dashboard
      </Link>
    </nav>
  );
}
