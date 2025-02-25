"use client"

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function NavBarWrapper({children}: {children: React.ReactNode}) {
    const pathName = usePathname();

    const hiddenPaths = ["/admin-dashboard"];

    const shouldHideNavBar = hiddenPaths.some((path) => pathName.startsWith(path));

    if (shouldHideNavBar) {
        return <>{children}</>
    }
    return (
        <>
        <NavBar/>
        {children}
        <Footer/>
        </>
    );
}