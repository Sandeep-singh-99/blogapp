import NavBarWrapper from "./components/NavBarWrapper";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
      <section>
        <NavBarWrapper>
        {children}
        </NavBarWrapper>
      </section>
    );
  }
  