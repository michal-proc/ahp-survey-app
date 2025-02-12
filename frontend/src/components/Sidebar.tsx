import React from "react";
import {
    RiAddCircleLine,
    RiDownloadLine,
    RiMenuUnfoldLine,
    RiMenuFoldLine,
    RiBookOpenLine
} from "react-icons/ri";
import {
    Sidebar as ProSidebar,
    Menu,
    MenuItem
} from "react-pro-sidebar";
import {Link} from "react-router-dom";
import {FaListUl} from "react-icons/fa";

interface SidebarProps {
    collapsed: boolean;
    onCollapsed: (isCollapsed: boolean) => void;
}

function Sidebar({collapsed, onCollapsed}: SidebarProps) {

    const handleCollapsedChange = () => {
        onCollapsed(!collapsed);
    };

    return (
        <ProSidebar
            className={`app sidebar transition-all duration-300 bg-black text-white !border-[#444444]`}
            style={{height: "100%", position: "fixed", backgroundColor: "black", color: "white"}}
            collapsed={collapsed}
            // @ts-ignore
            handleCollapsedChange={handleCollapsedChange}
        >
            <div>
                <button
                    onClick={handleCollapsedChange}
                    style={{
                        fontSize: "32px",
                        margin: "20px",
                    }}
                >
                    {collapsed ? <RiMenuUnfoldLine/> : <RiMenuFoldLine/>}
                </button>
            </div>
            <div
                className={`flex items-center justify-center transition-all duration-300 ${
                    collapsed ? "w-full" : "w-[90%]"
                } mx-auto my-4`}
            >
                <Link to="/" className="flex items-center">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="transition-all duration-300"
                    />
                </Link>
            </div>
            <main>
                <Menu>
                    <Link to="/surveys">
                        <MenuItem
                            icon={<FaListUl className="text-xl" style={{strokeWidth: 0.5}}/>}
                        >
                            <p className="font-bold">
                                Lista ankiet
                            </p>
                        </MenuItem>
                    </Link>
                    <Link to="/surveys/create">
                        <MenuItem
                            icon={<RiAddCircleLine className="text-xl" style={{strokeWidth: 0.5}}/>}
                        >
                            <p className="font-bold">
                                Stwórz ankietę
                            </p>
                        </MenuItem>
                    </Link>
                    <Link to="/surveys/import">
                        <MenuItem
                            icon={<RiDownloadLine className="text-xl" style={{strokeWidth: 0.5}}/>}
                        >
                            <p className="font-bold">
                                Import ankiety
                            </p>
                        </MenuItem>
                    </Link>
                    <a href={`${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_DOCS}`} target="_blank">
                        <MenuItem
                            icon={<RiBookOpenLine className="text-xl" style={{strokeWidth: 0.5}}/>}
                        >
                            <p className="font-bold">
                                Dokumentacja API
                            </p>
                        </MenuItem>
                    </a>
                </Menu>
            </main>
        </ProSidebar>
    );
}

export default Sidebar;