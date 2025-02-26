"use client"

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { SessionProvider } from "next-auth/react";

export default function NavBarWrapper({children}: {children: React.ReactNode}) {
    const pathName = usePathname();

    const hiddenPaths = ["/admin-dashboard", "/login"];

    const shouldHideNavBar = hiddenPaths.some((path) => pathName.startsWith(path));

    if (shouldHideNavBar) {
        return <>{children}</>
    }
    return (
        <>
        <SessionProvider>
        <NavBar/>
        {children}
        <Footer/>
        </SessionProvider>
        </>
    );
}