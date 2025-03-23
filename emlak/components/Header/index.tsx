"use client"
import Image from "next/image"
import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import ThemeToggler from "./ThemeToggler"
import menuData from "./menuData"

// User type
interface User {
  name: string
  email: string
  role?: string
  profileImage?: string
  securitySettings?: {
    lastLogin: string
  }
}

const Header = () => {
  const [user, setUser] = useState<User | null>(null)
  const pathName = usePathname()

  // Menu state
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [desktopUserMenuOpen, setDesktopUserMenuOpen] = useState(false)

  // Desktop menu state - track open menus by index
  const [activeMainMenu, setActiveMainMenu] = useState<number | null>(null)
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null)

  // Mobile menu state
  const [mobileMainMenu, setMobileMainMenu] = useState<number | null>(null)
  const [mobileSubMenu, setMobileSubMenu] = useState<number | null>(null)

  // Add these new state variables at the top of the component with the other state variables
  const [hoverMainMenu, setHoverMainMenu] = useState<number | null>(null)
  const [hoverSubMenu, setHoverSubMenu] = useState<number | null>(null)

  // Refs for click outside detection
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const mobileNavRef = useRef<HTMLDivElement>(null)

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Listen for user changes
  useEffect(() => {
    const handleUserChange = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        setUser(null)
      }
    }
    window.addEventListener("userChanged", handleUserChange)
    return () => window.removeEventListener("userChanged", handleUserChange)
  }, [])

  // Handle sticky header
  useEffect(() => {
    const handleStickyNavbar = () => {
      if (window.scrollY >= 80) setSticky(true)
      else setSticky(false)
    }
    window.addEventListener("scroll", handleStickyNavbar)
    return () => window.removeEventListener("scroll", handleStickyNavbar)
  }, [])

  // Close mobile user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close desktop user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        desktopUserMenuOpen &&
        e.target instanceof Node &&
        !document.getElementById("desktop-user-menu-trigger")?.contains(e.target as Node) &&
        !document.getElementById("desktop-user-menu")?.contains(e.target as Node)
      ) {
        setDesktopUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [desktopUserMenuOpen])

  // Close desktop menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMainMenu(null)
        setActiveSubMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close mobile menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navbarOpen && mobileNavRef.current && !mobileNavRef.current.contains(e.target as Node)) {
        setNavbarOpen(false)
        setMobileMainMenu(null)
        setMobileSubMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [navbarOpen])

  // Desktop menu handlers
  const handleMainMenuClick = (index: number) => {
    if (activeMainMenu === index) {
      setActiveMainMenu(null)
      setActiveSubMenu(null)
    } else {
      setActiveMainMenu(index)
      setActiveSubMenu(null)
    }
  }

  const handleSubMenuClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    if (activeSubMenu === index) {
      setActiveSubMenu(null)
    } else {
      setActiveSubMenu(index)
    }
  }

  // Tüm menüleri kapat
  const closeAllMenus = () => {
    // Desktop menüleri kapat
    setActiveMainMenu(null)
    setActiveSubMenu(null)
    setHoverMainMenu(null)
    setHoverSubMenu(null)
    
    // Mobile menüleri kapat
    setNavbarOpen(false)
    setMobileMainMenu(null)
    setMobileSubMenu(null)
    
    // Kullanıcı menülerini kapat
    setDesktopUserMenuOpen(false)
    setMobileUserMenuOpen(false)
  }

  // Add these new handlers after the existing handleSubMenuClick function
  const handleMainMenuMouseEnter = (index: number) => {
    setHoverMainMenu(index)
  }

  const handleMainMenuMouseLeave = () => {
    setHoverMainMenu(null)
    setHoverSubMenu(null)
  }

  const handleSubMenuMouseEnter = (index: number) => {
    setHoverSubMenu(index)
  }

  const handleSubMenuMouseLeave = () => {
    setHoverSubMenu(null)
  }

  // Mobile menu handlers
  const handleMobileMainMenuClick = (index: number) => {
    if (mobileMainMenu === index) {
      setMobileMainMenu(null)
      setMobileSubMenu(null)
    } else {
      setMobileMainMenu(index)
      setMobileSubMenu(null)
    }
  }

  const handleMobileSubMenuClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation() // Prevent the click from bubbling up

    if (mobileSubMenu === index) {
      setMobileSubMenu(null)
    } else {
      setMobileSubMenu(index)
    }
  }

  // Logout handling
  const openLogoutModal = () => setShowLogoutModal(true)
  const closeLogoutModal = () => setShowLogoutModal(false)
  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    window.dispatchEvent(new Event("userChanged"))
    closeLogoutModal()
    window.location.href = "/"
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(" ")
    return parts.map((part) => part.charAt(0).toUpperCase()).join("")
  }

  // Son tıklanan bağlantıyı izlemek için useEffect ekleyin
  useEffect(() => {
    // Sayfa değiştiğinde tüm menüleri kapat
    closeAllMenus();
  }, [pathName]);

  useEffect(() => {
    // Tema değişikliğini dinleyerek menüleri yeniden oluştur
    const handleThemeChange = () => {
      // Tema değişikliğinde tüm menü durumlarını sıfırla
      setActiveMainMenu(null);
      setActiveSubMenu(null);
      setHoverMainMenu(null);
      setHoverSubMenu(null);
      
      // Zorla yeniden render etmek için
      setNavbarOpen(navbarOpen);
    };
    
    // Tema değişikliği olayını dinle
    window.addEventListener('themeChanged', handleThemeChange);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, [navbarOpen]);

  return (
    <>
      <header
        className={`header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark fixed z-[9999] bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm transition"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            {/* Logo */}
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link href="/" className={`header-logo block w-full ${sticky ? "py-5 lg:py-2" : "py-8"}`}>
                <Image src="/images/logo/logo.png" alt="logo" width={140} height={30} className="w-full dark:hidden" />
                <Image
                  src="/images/logo/logo.png"
                  alt="logo"
                  width={140}
                  height={30}
                  className="hidden w-full dark:block"
                />
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex w-full items-center justify-between px-4">
              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setNavbarOpen(!navbarOpen)}
                id="navbarToggler"
                aria-label="Mobile Menu"
                className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
              >
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                    navbarOpen ? "top-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                    navbarOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                    navbarOpen ? "top-[-8px] -rotate-45" : ""
                  }`}
                />
              </button>

              {/* Desktop Navigation */}
              <div ref={menuRef} className="hidden lg:block" onMouseLeave={handleMainMenuMouseLeave}>
                <ul className="flex space-x-10">
                  {menuData.map((menuItem, mainIndex) => (
                    <li key={`menu-${mainIndex}-${sticky ? 'sticky' : 'normal'}`} className="relative" onMouseEnter={() => handleMainMenuMouseEnter(mainIndex)}>
                      {menuItem.path ? (
                        // Regular menu item with direct link
                        menuItem.path.startsWith("http") ? (
                          <a
                            href={menuItem.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex py-6 text-base ${
                              pathName === menuItem.path
                                ? "text-primary dark:text-white"
                                : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                            }`}
                            onClick={closeAllMenus}
                          >
                            {menuItem.title}
                          </a>
                        ) : (
                          <Link
                            href={menuItem.path}
                            className={`inline-flex py-6 text-base ${
                              pathName === menuItem.path
                                ? "text-primary dark:text-white"
                                : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                            }`}
                            onClick={closeAllMenus}
                          >
                            {menuItem.title}
                          </Link>
                        )
                      ) : (
                        // Menu item with submenu
                        <>
                          <button
                            onClick={(e) => handleSubMenuClick(e, mainIndex)}
                            className={`flex items-center justify-between py-6 text-base ${
                              activeMainMenu === mainIndex || hoverMainMenu === mainIndex
                                ? "text-primary dark:text-white"
                                : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                            }`}
                          >
                            {menuItem.title}
                            <span
                              className={`pl-1 transition-transform duration-300 ${
                                activeMainMenu === mainIndex || hoverMainMenu === mainIndex ? "rotate-180" : ""
                              }`}
                            >
                              <svg width="25" height="24" viewBox="5 0 20 24">
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                          </button>

                          {/* First level submenu */}
                          {(activeMainMenu === mainIndex || hoverMainMenu === mainIndex) && (
                            <div
                              className="absolute top-full left-0 z-30 w-[250px] rounded-md bg-white p-4 shadow-lg dark:bg-dark"
                              onMouseLeave={() => setHoverSubMenu(null)}
                            >
                              {menuItem.submenu?.map((submenuItem, subIndex) => {
                                if (submenuItem.submenu) {
                                  // Submenu item with its own submenu
                                  return (
                                    <div
                                      key={`submenu-${mainIndex}-${subIndex}-${sticky ? 'sticky' : 'normal'}`}
                                      className="relative"
                                      onMouseEnter={() => handleSubMenuMouseEnter(subIndex)}
                                    >
                                      <button
                                        onClick={(e) => handleSubMenuClick(e, subIndex)}
                                        className={`flex w-full items-center justify-between py-2 px-2 text-sm rounded ${
                                          activeSubMenu === subIndex || hoverSubMenu === subIndex
                                            ? "bg-gray-100 text-primary dark:bg-gray-800 dark:text-white"
                                            : "text-dark hover:bg-gray-50 hover:text-primary dark:text-white/70 dark:hover:bg-gray-800 dark:hover:text-white"
                                        }`}
                                      >
                                        {submenuItem.title}
                                        <svg
                                          className={`h-4 w-4 transition-transform duration-200 ${
                                            activeSubMenu === subIndex || hoverSubMenu === subIndex ? "rotate-90" : ""
                                          }`}
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                          />
                                        </svg>
                                      </button>

                                      {/* Second level submenu */}
                                      {(activeSubMenu === subIndex || hoverSubMenu === subIndex) && (
                                        <div className="absolute left-full top-0 z-40 w-[220px] rounded-md border border-gray-100 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-dark">
                                          {submenuItem.submenu.map((child, childIndex) =>
                                            child.path.startsWith("http") ? (
                                              <a
                                                key={`child-${mainIndex}-${subIndex}-${childIndex}-${sticky ? 'sticky' : 'normal'}`}
                                                href={child.path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block py-2 px-3 text-sm rounded hover:bg-gray-50 hover:text-primary dark:text-white/70 dark:hover:bg-gray-800 dark:hover:text-white"
                                              >
                                                {child.title}
                                              </a>
                                            ) : (
                                              <Link
                                                key={`child-${mainIndex}-${subIndex}-${childIndex}-${sticky ? 'sticky' : 'normal'}`}
                                                href={child.path}
                                                className="block py-2 px-3 text-sm rounded hover:bg-gray-50 hover:text-primary dark:text-white/70 dark:hover:bg-gray-800 dark:hover:text-white"
                                              >
                                                {child.title}
                                              </Link>
                                            ),
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )
                                } else {
                                  // Regular submenu item with link
                                  return submenuItem.path.startsWith("http") ? (
                                    <a
                                      key={`submenu-link-${mainIndex}-${subIndex}-${sticky ? 'sticky' : 'normal'}`}
                                      href={submenuItem.path}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block py-2 px-2 text-sm rounded hover:bg-gray-50 hover:text-primary dark:text-white/70 dark:hover:bg-gray-800 dark:hover:text-white"
                                    >
                                      {submenuItem.title}
                                    </a>
                                  ) : (
                                    <Link
                                      key={`submenu-link-${mainIndex}-${subIndex}-${sticky ? 'sticky' : 'normal'}`}
                                      href={submenuItem.path}
                                      className="block py-2 px-2 text-sm rounded hover:bg-gray-50 hover:text-primary dark:text-white/70 dark:hover:bg-gray-800 dark:hover:text-white"
                                    >
                                      {submenuItem.title}
                                    </Link>
                                  )
                                }
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile Navigation */}
              {navbarOpen && (
                <div
                  ref={mobileNavRef}
                  className="absolute top-full right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 shadow-lg dark:border-body-color/20 dark:bg-dark lg:hidden"
                >
                  <ul className="block">
                    {menuData.map((menuItem, mainIndex) => (
                      <li key={`mobile-menu-${mainIndex}-${sticky ? 'sticky' : 'normal'}`} className="border-b border-gray-200 last:border-0 dark:border-gray-700">
                        {menuItem.path ? (
                          // Regular menu item with direct link
                          menuItem.path.startsWith("http") ? (
                            <a
                              href={menuItem.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex py-2 text-base ${
                                pathName === menuItem.path
                                  ? "text-primary dark:text-white"
                                  : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                              }`}
                              onClick={closeAllMenus}
                            >
                              {menuItem.title}
                            </a>
                          ) : (
                            <Link
                              href={menuItem.path}
                              className={`flex py-2 text-base ${
                                pathName === menuItem.path
                                  ? "text-primary dark:text-white"
                                  : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                              }`}
                              onClick={closeAllMenus}
                            >
                              {menuItem.title}
                            </Link>
                          )
                        ) : (
                          // Menu item with submenu
                          <div className="py-2">
                            <button
                              onClick={() => handleMobileMainMenuClick(mainIndex)}
                              className="flex w-full items-center justify-between text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                            >
                              {menuItem.title}
                              <span
                                className={`transition-transform duration-300 ${mobileMainMenu === mainIndex ? "rotate-180" : ""}`}
                              >
                                <svg width="25" height="24" viewBox="5 0 20 24">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </button>

                            {/* Mobile first level submenu */}
                            {mobileMainMenu === mainIndex && (
                              <div className="pl-4 pt-2 pb-1">
                                {menuItem.submenu?.map((submenuItem, subIndex) => {
                                  if (submenuItem.submenu) {
                                    // Submenu item with its own submenu
                                    return (
                                      <div key={`mobile-submenu-${mainIndex}-${subIndex}-${sticky ? 'sticky' : 'normal'}`} className="mb-2">
                                        <button
                                          onClick={(e) => handleMobileSubMenuClick(e, subIndex)}
                                          className="flex w-full items-center justify-between py-1 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                                        >
                                          {submenuItem.title}
                                          <svg
                                            className={`h-4 w-4 transition-transform duration-200 ${mobileSubMenu === subIndex ? "rotate-90" : ""}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M9 5l7 7-7 7"
                                            />
                                          </svg>
                                        </button>

                                        {/* Mobile second level submenu */}
                                        {mobileSubMenu === subIndex && (
                                          <div className="pl-4 pt-1">
                                            {submenuItem.submenu.map((child, childIndex) =>
                                              child.path.startsWith("http") ? (
                                                <a
                                                  key={`mobile-child-${mainIndex}-${subIndex}-${childIndex}-${sticky ? 'sticky' : 'normal'}`}
                                                  href={child.path}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="block py-1 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                                                  onClick={closeAllMenus}
                                                >
                                                  {child.title}
                                                </a>
                                              ) : (
                                                <Link
                                                  key={`mobile-child-${mainIndex}-${subIndex}-${childIndex}-${sticky ? 'sticky' : 'normal'}`}
                                                  href={child.path}
                                                  className="block py-1 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                                                  onClick={closeAllMenus}
                                                >
                                                  {child.title}
                                                </Link>
                                              ),
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  } else {
                                    // Regular submenu item with link
                                    return submenuItem.path.startsWith("http") ? (
                                      <a
                                        key={`mobile-submenu-link-${mainIndex}-${subIndex}-${sticky ? 'sticky' : 'normal'}`}
                                        href={submenuItem.path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block py-1 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                                      >
                                        {submenuItem.title}
                                      </a>
                                    ) : (
                                      <Link
                                        key={`mobile-submenu-link-${mainIndex}-${subIndex}-${sticky ? 'sticky' : 'normal'}`}
                                        href={submenuItem.path}
                                        className="block py-1 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                                      >
                                        {submenuItem.title}
                                      </Link>
                                    )
                                  }
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Right side */}
              <div className="flex items-center justify-end pr-16 lg:pr-0 gap-3">
                {/* Desktop view: user or login/register */}
                <div className="hidden lg:flex items-center gap-3">
                  {user ? (
                    <>
                      <div className="relative">
                        <button
                          id="desktop-user-menu-trigger"
                          onClick={() => setDesktopUserMenuOpen(!desktopUserMenuOpen)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          {user.profileImage ? (
                            <div className="relative inline-flex h-10 w-10 overflow-hidden rounded-full border-2 border-primary">
                              <Image 
                                src={user.profileImage} 
                                alt={user.name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
                              {getInitials(user.name)}
                            </div>
                          )}
                          <div className="flex flex-col text-left">
                            <span className="text-dark dark:text-white/80">{user.name}</span>
                            <span className="text-xs text-gray-500">{user.email}</span>
                          </div>
                          <svg
  className={`h-4 w-4 transition-transform duration-300 text-gray-700 dark:text-gray-300 ${desktopUserMenuOpen ? "rotate-180" : ""}`}
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        
                        {desktopUserMenuOpen && (
                          <div 
                            id="desktop-user-menu"
                            className="absolute right-0 mt-2 w-60 rounded-md bg-white py-2 shadow-lg dark:bg-gray-800 animate-in fade-in slide-in-from-top-5 duration-200 z-50"
                          >
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                              <p className="font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                              {user.role && (
                                <div className="mt-1">
                                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                    {user.role}
                                  </span>
                                </div>
                              )}
                              {user?.securitySettings?.lastLogin && (
                                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">Son giriş: </span>
                                  23.03.2025 05:25:56
                                </div>
                              )}
                            </div>
                            <div className="py-1">
                              <Link
                                href="/hesabim"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                onClick={() => setDesktopUserMenuOpen(false)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mr-2 h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Hesabım
                              </Link>
                              <Link
                                href="/favoriler"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                onClick={() => setDesktopUserMenuOpen(false)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mr-2 h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                Favori İlanlarım
                              </Link>
                              
                              {/* Admin paneli bağlantısı - sadece admin ve moderator rolleri için görünür */}
                              {(user.role === "admin" || user.role === "moderator") && (
                                <Link
                                  href="/Admin"
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                  onClick={() => setDesktopUserMenuOpen(false)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-2 h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  Admin Paneli
                                </Link>
                              )}
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                              <button
                                onClick={openLogoutModal}
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mr-2 h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                  />
                                </svg>
                                Çıkış Yap
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        className="px-4 py-2 text-sm font-medium text-dark hover:opacity-70 dark:text-white"
                      >
                        Giriş Yap
                      </Link>
                      <Link
                        href="/signup"
                        className="rounded-sm bg-primary px-2 py-2 text-sm font-medium text-white transition duration-300 hover:bg-opacity-90"
                      >
                        Kayıt Ol
                      </Link>
                    </>
                  )}
                </div>

                {/* Mobile view: user or login/register */}
                <div className="lg:hidden flex items-center gap-4">
                  {user ? (
                    // Avatar + dropdown
                    <div className="relative" ref={mobileMenuRef}>
                      <button
                        onClick={() => setMobileUserMenuOpen(!mobileUserMenuOpen)}
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-white ring-2 ring-primary/20 transition-all duration-300 hover:ring-4 overflow-hidden"
                        aria-label="User menu"
                      >
                        {user.profileImage ? (
                          <Image 
                            src={user.profileImage} 
                            alt={user.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getInitials(user.name)
                        )}
                      </button>
                      {mobileUserMenuOpen && (
                        <div className="absolute left-0 mt-2 w-59 rounded-md bg-white py-2 shadow-lg dark:bg-gray-800 animate-in fade-in slide-in-from-top-5 duration-200">
                          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <p className="font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                            {user.role && (
                              <div className="mt-1">
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                  {user.role}
                                </span>
                              </div>
                            )}
                            {user?.securitySettings?.lastLogin && (
                              <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Son giriş: </span>
                                23.03.2025 05:25:56
                              </div>
                            )}
                          </div>
                          <div className="py-1">
                            <Link
                              href="/hesabim"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                              onClick={() => setMobileUserMenuOpen(false)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Hesabım
                            </Link>
                            <Link
                              href="/favoriler"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                              onClick={() => setMobileUserMenuOpen(false)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              Favorilerim
                            </Link>
                            
                            {/* Admin paneli bağlantısı - sadece admin ve moderator rolleri için görünür */}
                            {(user.role === "admin" || user.role === "moderator") && (
                              <Link
                                href="/Admin"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                onClick={() => setMobileUserMenuOpen(false)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mr-2 h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                Admin Paneli
                              </Link>
                            )}
                          </div>
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                            <button
                              onClick={openLogoutModal}
                              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              Çıkış Yap
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // No user
                    <>
                      <Link
                        href="/signin"
                        className="px-3 py-2 text-sm font-medium text-dark hover:opacity-70 dark:text-white"
                      >
                        Giriş Yap
                      </Link>
                      <Link
                        href="/signup"
                        className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
                      >
                        Kayıt Ol
                      </Link>
                    </>
                  )}
                </div>

                {/* Theme Toggle */}
                <ThemeToggler />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 animate-in zoom-in-95 duration-200">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
              Çıkış Yapmak İstediğinize Emin misiniz?
            </h2>
            <div className="mb-6 text-gray-600 dark:text-gray-300">
              Oturumunuz kapatılacak. Devam etmek istiyor musunuz?
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeLogoutModal}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                İptal
              </button>
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors duration-200"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header

