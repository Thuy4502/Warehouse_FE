import React from 'react';
import { GoBell } from 'react-icons/go';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const imageUrl = localStorage.getItem('img');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <div>
        {/* <h1 className="text-xs">Chào mừng trở lại</h1>
        <p className="text-xl font-semibold">Meii</p> */}
      </div>
      <div className="flex items-center space-x-5">
        <div className="hidden md:flex">
          <input
            type="text"
            name=""
            id=""
            placeholder="Tìm kiếm..."
            className="bg-indigo-100 px-4 py-2 rounded-lg focus:outline-0 focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div className="flex items-center space-x-5">
          <button className="relative text-2xl text-gray-600">
            <GoBell size={32} />
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex justify-center items-center bg-indigo-600 text-white font-semibold text-[10px] w-5 h-4 rounded-full border-2 border-white">
              9
            </span>
          </button>
          <div>
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="ml-2 inline-flex rounded-full focus:ring-2 focus:outline-none focus:ring-neutral-300">
                  <span className="sr-only">Open</span>
                  <div
                    className="w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${imageUrl || 'https://i.pinimg.com/564x/b5/71/c9/b571c94777b1f87f968867080e12724d.jpg'})`,
                    }}
                  >
                    <span className="sr-only">Profile Picture</span>
                  </div>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-40 rounded-md bg-white shadow-md p-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        className={`${active ? 'bg-indigo-500 text-white' : 'text-gray-700'} block cursor-pointer px-4 py-2 rounded-md`}
                        onClick={() => navigate('/admin/profile')}
                      >
                        Your Profile
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        className={`${active ? 'bg-indigo-500 text-white' : 'text-gray-700'} block cursor-pointer px-4 py-2 rounded-md`}
                        onClick={() => navigate('/login')}
                      >
                        Settings
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        className={`${active ? 'bg-indigo-500 text-white' : 'text-gray-700'} block cursor-pointer px-4 py-2 rounded-md`}
                        onClick={handleLogout}
                      >
                        Logout
                      </div>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;


