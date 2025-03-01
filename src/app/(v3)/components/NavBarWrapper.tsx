"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
import AdminNavbar from './AdminNavBar';

export default function NavBarWrapper( {children}: {children: React.ReactNode}) {
    const pathName = usePathname();

    const hiddenPaths = ["/admin-dashboard/admin-login"];

    const shouldHideNavBar = hiddenPaths.some((path) => pathName.startsWith(path));

    if (shouldHideNavBar) {
        return <>{children}</>
    }
  return (
    <>
    <AdminNavbar/>
    {children}
    </>
  )
}
