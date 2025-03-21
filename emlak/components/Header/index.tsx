"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";

// User tipi
interface User {
  name: string;
  email: string;
  role?: string;
}

const Header = () => {
  const [user, setUser] = useState<User | null>(null);

  // İkinci seviye submenu aç/kapa
  const [openSubSubIndex, setOpenSubSubIndex] = useState(-1);
  const handleSubSubmenu = (subIndex: number) => {
    setOpenSubSubIndex(openSubSubIndex === subIndex ? -1 : subIndex);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleUserChange = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };
    window.addEventListener("userChanged", handleUserChange);
    return () => window.removeEventListener("userChanged", handleUserChange);
  }, []);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("userChanged"));
    closeLogoutModal();
  };

  // Navbar aç/kapa
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) setSticky(true);
    else setSticky(false);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  // Birinci seviye submenu aç/kapa
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  // Kullanıcı isminin baş harflerini alan yardımcı
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.map((part) => part.charAt(0).toUpperCase()).join("");
  };

  // Mevcut path
  const pathName = usePathname();

  // --- MobiLde Avatar Menu Aç/Kapa ---
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Menü açıkken dışarı tıklayınca kapatma
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-5 lg:py-2" : "py-8"
                }`}
              >
                <Image
                  src="/images/logo/logo.png"
                  alt="logo"
                  width={140}
                  height={30}
                  className="w-full dark:hidden"
                />
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
              {/* Mobil Menu Toggle Butonu */}
              <div>
                <button
                  onClick={navbarToggleHandler}
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

                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-10">
                  {menuData.map((menuItem, index) => (
  <li key={index} className="group relative">
    {menuItem.path ? (
      menuItem.path.startsWith("http") ? (
        <a
          href={menuItem.path}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
            pathName === menuItem.path
              ? "text-primary dark:text-white"
              : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
          }`}
        >
          {menuItem.title}
        </a>
      ) : (
        <Link
          href={menuItem.path}
          className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
            pathName === menuItem.path
              ? "text-primary dark:text-white"
              : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
          }`}
        >
          {menuItem.title}
        </Link>
      )
    ) : (
      <>
        <p
          onClick={() => handleSubmenu(index)}
          className="flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:text-primary dark:text-white/70 dark:group-hover:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6"
        >
          {menuItem.title}
          <span className="pl-3">
            <svg width="25" height="24" viewBox="9 0 20 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </p>
        <div
  className={`
    rounded-sm bg-white transition-[top] duration-300 dark:bg-dark 
    lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[150px] lg:p-4 lg:opacity-0 lg:shadow-lg 
    group-hover:visible group-hover:opacity-100 group-hover:top-full 
    ${openIndex === index ? "block" : "hidden"}
  `}
>

          {menuItem.submenu?.map((submenuItem, subIndex) => {
            if (submenuItem.submenu) {
              return (
                <div key={subIndex} className="relative">
                  <p
                    onClick={() => handleSubSubmenu(subIndex)}
                    className="flex cursor-pointer items-center justify-between py-2 text-sm text-dark dark:text-white/70"
                  >
                    {submenuItem.title}
                  </p>
                  <div
  className={`${
    openSubSubIndex === subIndex ? "block" : "hidden"
  } bg-white dark:bg-dark shadow-lg w-[180px] lg:absolute lg:left-[105%] lg:top-[-10px]`}
>

                    {submenuItem.submenu.map((child, childIndex) =>
                      child.path.startsWith("http") ? (
                        <a
                          key={childIndex}
                          href={child.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block py-2 px-3 text-sm hover:text-primary dark:text-white/70 dark:hover:text-white"
                        >
                          {child.title}
                        </a>
                      ) : (
                        <Link
                          key={childIndex}
                          href={child.path}
                          className="block py-2 px-2 text-sm hover:text-primary dark:text-white/70 dark:hover:text-white"
                        >
                          {child.title}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              );
            } else {
              return submenuItem.path.startsWith("http") ? (
                <a
                  key={subIndex}
                  href={submenuItem.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                >
                  {submenuItem.title}
                </a>
              ) : (
                <Link
                  key={subIndex}
                  href={submenuItem.path}
                  className="block py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                >
                  {submenuItem.title}
                </Link>
              );
            }
          })}
        </div>
      </>
    )}
  </li>
))}

                  </ul>
                </nav>
              </div>

              {/* Sağ kısım */}
              <div className="flex items-center justify-end pr-16 lg:pr-0 gap-3">
                {/* Masaüstü görünüm: kullanıcı veya giriş/kayıt */}
                <div className="hidden lg:flex items-center gap-3">
                  {user ? (
                    <>
                      <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
                        {getInitials(user.name)}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-dark dark:text-white/80">
                          {user.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.email}
                        </span>
                      </div>
                      {/* Sadece admin ise */}
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={openLogoutModal}
                        className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
                      >
                        Çıkış Yap
                      </button>
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
                        className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white transition duration-300 hover:bg-opacity-90"
                      >
                        Kayıt Ol
                      </Link>
                    </>
                  )}
                </div>

                {/* Mobil görünüm: kullanıcı veya giriş/kayıt */}
                <div className="lg:hidden flex items-center gap-4">
                  {/* Mobilde user varsa avatar, yoksa Giriş/Kayıt */}
                  {user ? (
                    // Avatar + dropdown
                    <div className="relative" ref={mobileMenuRef}>
                      <button
                        onClick={() => setMobileUserMenuOpen((prev) => !prev)}
                        className="h-12 w-12 flex items-center justify-center rounded-full bg-primary text-white"
                      >
                        {getInitials(user.name)}
                      </button>
                      {mobileUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white py-2 shadow-lg dark:bg-gray-800">
                          <p className="px-4 pb-2 text-sm text-gray-600 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                            {user.name}
                          </p>
                          {user.role === "admin" && (
                            <Link
                              href="/admin"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                              Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={openLogoutModal}
                            className="block w-full text-left px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-md"
                            >
                            Çıkış Yap
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // User yoksa
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

                {/* Tema Değiştirme */}
                <ThemeToggler />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Çıkış Yap Modal'ı */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-dark">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
              Çıkış Yapmak İstediğinize Emin misiniz?
            </h2>
            <div className="mb-6 text-gray-600 dark:text-gray-300">
              Oturumunuz kapatılacak. Devam etmek istiyor musunuz?
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeLogoutModal}
                className="rounded bg-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-400"
              >
                İptal
              </button>
              <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
