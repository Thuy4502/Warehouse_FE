import React, { useState } from 'react'
import { TbHome, TbFileImport, TbReport, TbPackageImport,TbUsers } from "react-icons/tb";
import { AiOutlineProduct } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import { PiExportBold, PiBookBold, PiWarehouse, PiCaretDownBold, PiCaretUpBold, PiUserCircle } from "react-icons/pi";
import { BiPurchaseTagAlt } from "react-icons/bi";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState(0);
  const [subMenuOpen, setSubMenuOpen] = useState(null); 
  const navigate = useNavigate(); 

  const handleNavigate = () => {
      navigate('/profile'); 
  }

  const handleLinkClick = (index, hasSubmenu, path) => {
    setActiveLink(index);

    if (!hasSubmenu) {
      navigate(path);
    } else {
      toggleSubMenu(index); 
    }
  };

  const toggleSubMenu = (index) => {
    if (subMenuOpen === index) {
      setSubMenuOpen(null); 
    } else {
      setSubMenuOpen(index); 
    }
  };

  const SIDEBAR_LINK = [
    { id: 1, path: "/", name: "Dashboard", icon: TbHome },
    { id: 2, path: "/category", name: "Thể loại sách", icon: AiOutlineProduct },
    { id: 3, path: "/books", name: "Sách", icon: PiBookBold },
    {
      id: 4, path: "/import", name: "Nhập hàng", icon: TbFileImport,
      submenu: true,
      submenuItems: [
        { title: "Phiếu yêu cầu", path: "/import-request" },
        { title: "Phiếu nhập", path: "/import-slip" }
      ]
    },
    {
      id: 5, path: "/export", name: "Xuất hàng", icon: TbPackageImport,
      submenu: true,
      submenuItems: [
        { title: "Phiếu yêu cầu", path: "/export-request" },
        { title: "Phiếu xuất", path: "/export" }
      ]
    },
    {
      id: 6, path: "/report", name: "Báo cáo", icon: TbReport,
      submenu: true,
      submenuItems: [
        { title: "Nhật ký nhập", path: "/import-report" },
        { title: "Nhật ký xuất", path: "/export-report" },
        { title: "Nhật ký nhập xuất", path: "/report"}
      ]
    },
    { id: 7, path: "/suppliers", name: "Nhà cung cấp", icon: BiPurchaseTagAlt },
    { id: 8, path: "/staffs", name: "Nhân viên", icon: TbUsers },
    { id: 9, path: "/uploadImage", name: "Upload Image", icon: TbUsers },




  ];

  return (
    <div className='w-20 md:w-64 fixed left-0 top-0 z-10 h-screen border-r pt-8 px-4 bg-white'>
      <div className='mb-8'>
        <div className='flex items-center pl-5'>
          <PiWarehouse style={{ fontSize: '50px' }} />
          <div className='flex font-bold text-2xl pl-2 hidden md:flex'>Warehouse</div>
        </div>
      </div>

      <ul className='mt-6 space-y-4'>
        {SIDEBAR_LINK.map((link, index) => (
          <li key={index}>
            <div
              className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-indigo-00 ${activeLink === index ? "bg-indigo-100 text-indigo-500" : ""}`}
            >
              <div
                className='flex justify-between items-center cursor-pointer md:space-x-5'
                onClick={() => handleLinkClick(index, link.submenu, link.path)}
              >
                <div className='flex justify-center md:justify-start items-center space-x-5'>
                  <span>{React.createElement(link.icon)}</span>
                  <span className='text-sm text-gray-500 hidden md:flex'>{link.name}</span>
                </div>
                {link.submenu && (
                  <span>
                    {subMenuOpen === index ? (
                      <PiCaretUpBold />
                    ) : (
                      <PiCaretDownBold />
                    )}
                  </span>
                )}
              </div>
            </div>
            {link.submenu && subMenuOpen === index && (
              <ul className='pl-12 space-y-2 bg-indigo-100 rounded-md mt-1 p-2 font-medium ml-2'>
                {link.submenuItems.map((subItem, subIndex) => (
                  <li className='text-sm' key={subIndex}>
                    <Link
                      to={subItem.path}
                      className='block text-sm text-gray-500 hover:text-indigo-500 transition-all duration-200 ease-in-out'
                    >
                      {subItem.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div className='w-full absolute bottom-5 left-0 px-4 py-2 cursor-pointer text-center'>
            <p
                className='flex items-center space-x-2 text-xs text-white justify-center py-2 px-5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-md'
                onClick={handleNavigate} // Add onClick event
            >
                <span className='hidden md:flex font-semibold items-center'>
                    <PiUserCircle className='text-2xl' /> 
                    <span className='ml-2'>Tài khoản</span> 
                </span>
            </p>
        </div>

    </div>
  );
};

export default Sidebar;
