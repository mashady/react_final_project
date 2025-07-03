"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Plus, User, Globe, WalletCards } from "lucide-react"; // Added Globe icon
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/features/user/userSlice";
import { useTranslation } from "@/TranslationContext";

const defaultUser =
  "https://secure.gravatar.com/avatar/placeholder?s=76&d=mm&r=g";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { data: user, token } = useSelector((state) => state.user);
  const isLoggedIn = !!token;
  const userRole = user?.role;
  const toggleMenu = () => setIsMenuOpen((open) => !open);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };
  const { t, locale, changeLanguage } = useTranslation();
  const NAV_LINKS = [
    { label: t("navbarLinkOne"), href: "/" },
    { label: t("navbarLinkTwo"), href: "/properties" },
    { label: t("navbarLinkFour"), href: "/contact-us" },
    ...(userRole !== "student" && userRole !== "admin"
      ? [{ label: t("navbarLinkThree"), href: "/plans" }]
      : []),
  ];
  const baseDropdownItems =
    userRole === "admin"
      ? []
      : [
          { href: "/dashboard", label: t("navbarDropMyProfile") },
          {
            href: "/dashboard/edit-profile",
            label: t("navbarDropEditProfile"),
          },
          { href: "/dashboard/messages", label: t("navbarDropMessages") },
        ];

  const studentDropdownItems = [
    { href: "/dashboard/my-wishlist", label: t("navbarDropMyWishlist") },
  ];

  const ownerDropdownItems = [
    { href: "/dashboard/my-packages", label: t("navbarDropMyPackages") },
    { href: "/dashboard/my-properties", label: t("navbarDropMyProperties") },
    { href: "/dashboard/add-property", label: t("navbarAddProperty") },
    { href: "/cart", label: t("navbarCart") },
  ];

  const adminDropdownItems = [
    { href: "/dashboard/users", label: t("navbarUsers") },
    { href: "/dashboard/properties", label: t("navbarAllProperties") },
    { href: "/dashboard/verify-pending", label: t("navbarVerifyPending") },
    { href: "/dashboard/plans", label: t("adminPlans") },
    { href: "/dashboard/payments", label: t("adminPayment") },
  ];

  const getDropdownItems = () => {
    let items = [...baseDropdownItems];

    if (userRole === "student") {
      items = [...items, ...studentDropdownItems];
    } else if (userRole === "owner") {
      items = [...items, ...ownerDropdownItems];
    } else if (userRole === "admin") {
      items = [...items, ...adminDropdownItems];
    }

    return items;
  };
  const dropdownItems = getDropdownItems();

  return (
    <nav className="bg-white">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-1 flex items-center">
            <Link href="/">
              {/* <img
                src="https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/logo-main.png"
                alt="New Home Logo"
                className="h-10 w-auto"
              /> */}
              <span className="text-xl" style={{ fontWeight: 500 }}>
                Homyfy
              </span>
            </Link>
          </div>

          <div className="hidden md:block flex-1">
            <div className="flex justify-center items-baseline space-x-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-black hover:underline transition-all px-3 py-2 text font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-end space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <img
                  src={
                    user?.owner_profile?.picture ||
                    user?.student_profile?.picture ||
                    defaultUser
                  }
                  alt="User"
                  className="w-8 h-8 rounded object-cover"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span
                      className="text-sm text-black text-[14px] cursor-pointer"
                      style={{ fontWeight: 500 }}
                    >
                      {user?.name || "User"}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-50 mt-4">
                    {dropdownItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <DropdownMenuItem className="cursor-pointer">
                          {item.label}
                        </DropdownMenuItem>
                      </Link>
                    ))}
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600"
                      onClick={handleLogout}
                    >
                      {t("navbarLogout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link
                href="/register"
                className="bg-white text-black pl-4 py-2 rounded font-medium hover:text-yellow-600 transition-colors"
              >
                <User className="inline-block w-5 h-5 mr-1" />
                {t("navbarJoin")}
              </Link>
            )}
            {userRole === "owner" && (
              <Link href="/dashboard/add-property">
                <button className="bg-white text-gray-900 px-4 py-2 text font-medium hover:text-yellow-600 transition-colors flex items-center space-x-2 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  <span>{t("navbarAddProperty")}</span>
                </button>
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex cursor-pointer items-center space-x-1 text-black hover:text-gray-600 transition-colors outline-0">
                  <Globe className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {locale === "en" ? "EN" : "AR"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 mt-4">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => changeLanguage("en")}
                >
                  <span className={`${locale === "en" ? "font-bold" : ""}`}>
                    English (EN)
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => changeLanguage("ar")}
                >
                  <span className={`${locale === "ar" ? "font-bold" : ""}`}>
                    العربية (AR)
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 text-base font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => changeLanguage("en")}
                  className={`text-sm ${locale === "en" ? "font-bold" : ""}`}
                >
                  English (EN)
                </button>
                <button
                  onClick={() => changeLanguage("ar")}
                  className={`text-sm ${locale === "ar" ? "font-bold" : ""}`}
                >
                  العربية (AR)
                </button>
              </div>
            </div>

            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={
                      user?.owner_profile?.picture ||
                      user?.student_profile?.picture ||
                      defaultUser
                    }
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-700">
                    {user?.name || "User"}
                  </span>
                </div>
                {userRole === "owner" && (
                  <Link href="/dashboard/add-property">
                    <button className="w-full bg-white text-black px-4 py-2 text-sm font-medium hover:text-yellow-600 transition-colors flex items-center justify-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>{t("navbarAddProperty")}</span>
                    </button>
                  </Link>
                )}
              </>
            ) : (
              <Link
                href="/register"
                className="block w-full bg-yellow-500 text-white px-4 py-2 rounded font-medium text-center hover:bg-yellow-600 transition-colors"
              >
                {t("navbarJoin")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
