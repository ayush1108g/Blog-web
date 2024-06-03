"use client";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import Image from 'next/image';
import { useLogin } from "@/context/LoginContext";

interface NavbarLink {
    id: number;
    link: string;
    title: string;
}
const Navbar = () => {
    const [nav, setNav] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const LoginCtx = useLogin();

    let links:NavbarLink[] = [
        { id: 1, link: "/blogs", title: 'Blogs' },
        { id: 2, link:  LoginCtx.isLoggedIn ? "/blogs/create": "/login", title: 'Write a Blog' },
        ...(LoginCtx.isLoggedIn ? [] : [{ id: 3, link: "/login", title: 'Login/Signup' }]), // Spread the array if user is not logged in
        { id: 5, link: "/contactus", title: 'Contact us' },
    ];
    links = links.filter((link) => link !== null)

    const handleSearchClick = () => {
        setSearchVisible(!searchVisible);
    };

    return (
        <div className="flex justify-between items-center w-full h-20 px-4 text-white bg-black fixed z-50">
            <div>
                <h2 className="text-4xl font-signature ml-2">
                    <a href="/" className="link-underline link-underline-black ease-in-out delay-150  hover:decoration-solid" rel="noreferrer">
                        Logo
                    </a>
                </h2>
            </div>

            <ul className="hidden md:flex">
                {links.map(({ id, link, title }) => (
                    <li key={id} className="nav-links px-4 cursor-pointer font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
                        <Link href={link}>{title}</Link>
                    </li>
                ))}
            </ul>

            <div className="flex items-center">
                {searchVisible && (
                    <div className="relative hidden md:flex">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-800 text-white border border-gray-700 rounded-md pl-10 pr-4 py-1"
                            placeholder="Search..."
                        />
                        <FaSearch onClick={handleSearchClick} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" size={20} />
                    </div>
                )}
                {searchVisible ? 
                    <IoCloseSharp onClick={handleSearchClick} className="cursor-pointer text-gray-500 ml-4 hidden md:flex" size={20} /> : 
                    <FaSearch onClick={handleSearchClick} className="cursor-pointer text-gray-500 ml-4 hidden md:flex" size={20} />
                }

                {LoginCtx.isLoggedIn && (
                    <>
                    <div className="ml-4 pr-2">
                        <Image
                            src={LoginCtx?.user?.photo ||  "https://picsum.photos/200/200"}
                            alt="Profile Picture"
                            width={30}
                            height={30}
                            className="rounded-full cursor-pointer "
                        />
                    </div>
                    <div onClick={() => setNav(!nav)} className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden">
                        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
                    </div>
                   </>
                )
                }

            </div>

            {nav && (
                <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500">
                    {links.map(({ id, link, title }) => (
                        <li key={id} className="px-4 cursor-pointer capitalize py-6 text-4xl">
                            <Link onClick={() => setNav(!nav)} href={link}>
                                {title}
                            </Link>
                        </li>
                    ))}
                    <div className="flex items-center mt-6">
                        {searchVisible && (
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-1 ml-2"
                                placeholder="Search..."
                            />
                        )}
                        <FaSearch onClick={handleSearchClick} className="cursor-pointer text-gray-500 ml-4" size={20} />
                    </div>
                </ul>
            )}
        </div>
    );
};

export default Navbar;