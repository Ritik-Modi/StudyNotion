import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation, matchPath } from 'react-router-dom'
import Logo from '../../assets/Logo/Logo-Full-Light.png'
import { NavbarLinks } from '../../data/navbar-links'
import { BsChevronDown } from 'react-icons/bs'
import { AiOutlineShoppingCart, AiOutlineMenu } from 'react-icons/ai'
import { categories } from '../../services/apis'
import { apiConnector } from '../../services/apiConnector'
import { ACCOUNT_TYPE } from '../../utils/constants'
import ProfileDropdown from '../core/Auth/ProfileDropdown'

function Navbar() {
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const { totalItems } = useSelector((state) => state.cart);
    const location = useLocation();

    const [subLinks, setSubLinks] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const res = await apiConnector("GET", categories.CATEGORIES_API)
                setSubLinks(res.data)
                console.log(res.data)
            } catch (e) {
                console.log("Could not fetch categories", e)
            }
            setLoading(false)
        })()
    }, [])

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname)
    }

    return (
        <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${location.pathname !== "/" ? "bg-richblack-800" : ""} transition-all duration-200`}>
            <div className='flex items-center justify-between w-11/12 max-w-maxContent'>

                {/* Logo */}
                <Link to='/'>
                    <img src={Logo} alt="Logo" width={160} height={32} loading='lazy' />
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:block">
                    <ul className="flex gap-x-6 text-richblack-25">
                        {NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {link.title === "Catalog" ? (
                                    <div
                                        className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName")
                                            ? "text-yellow-25"
                                            : "text-richblack-25"
                                            }`}
                                    >
                                        <p>{link.title}</p>
                                        <BsChevronDown />
                                        <div className="invisible absolute left-1/2 top-1/2 z-[1000] flex w-[200px] -translate-x-1/2 translate-y-[3em] flex-col rounded-lg bg-white/10 backdrop-blur-xl p-4 text-richblack-5 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[200px]">
                                            {loading ? (
                                                <p className="text-center">Loading...</p>
                                            ) : subLinks && subLinks.length > 0 ? (
                                                subLinks.map((subLink, i) => (
                                                    <Link
                                                        to={`/catalog/${subLink.name
                                                            .split(" ")
                                                            .join("-")
                                                            .toLowerCase()}`}
                                                        className="py-4 pl-4 bg-transparent rounded-lg hover:bg-richblack-50"
                                                        key={i}
                                                    >
                                                        <p>{subLink.name}</p>
                                                    </Link>
                                                ))
                                            ) : (
                                                <p className="text-center">No Categories</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Link to={link?.path}>
                                        <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                            {link.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Login / Signup / Dashboard / Cart */}
                <div className="items-center hidden gap-x-4 md:flex">
                    {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                        <Link to="/dashboard/cart" className="relative">
                            <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                            {totalItems > 0 && (
                                <span className="absolute grid w-5 h-5 overflow-hidden text-xs font-bold text-center text-yellow-100 rounded-full -bottom-2 -right-2 place-items-center bg-richblack-600">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}
                    {token === null && (
                        <>
                            <Link to="/login">
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                    Log in
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                    Sign up
                                </button>
                            </Link>
                        </>
                    )}
                    {token !== null && <ProfileDropdown />}
                </div>

                {/* Mobile Menu Icon */}
                <button className="mr-4 md:hidden">
                    <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
                </button>
            </div>
        </div>
    )
}

export default Navbar
