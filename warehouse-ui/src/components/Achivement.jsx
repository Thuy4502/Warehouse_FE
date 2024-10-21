import React from 'react';
import { Typography, Button, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';

const TringleImg = styled("img")({
    right: 0,
    bottom: 0,
    height: 170,
    position: "absolute"
});

const TrophyImg = styled("img")({
    right: 36,
    bottom: 20,
    height: 98,
    position: 'absolute'
});

const Achievement = () => {
    return (
        <div>
            <div className="mt-4">
                <div className="flex flex-wrap -mx-6">
                    {/* Achievement Item 1 */}
                    <div className="w-full px-6 sm:w-1/4 xl:w-1/4">
                        <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
                            <div className="p-3 bg-yellow-500 bg-opacity-75 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24">
                                    <path fill="white" d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z" />
                                </svg>
                            </div>
                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700">20</h4>
                                <div className="text-gray-500">Loại sách</div>
                            </div>
                        </div>
                    </div>

                    {/* Achievement Item 2 */}
                    <div className="w-full px-6 sm:w-1/4 xl:w-1/4">
                        <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
                            <div className="p-3 bg-indigo-600 bg-opacity-75 rounded-full">
                                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 2H9C7.34 2 6 3.34 6 5V19C6 20.66 7.34 22 9 22H19C20.66 22 22 20.66 22 19V5C22 3.34 20.66 2 19 2ZM20 19C20 19.55 19.55 20 19 20H9C8.45 20 8 19.55 8 19V5C8 4.45 8.45 4 9 4H19C19.55 4 20 4.45 20 5V19ZM4 6H2V20C2 21.66 3.34 23 5 23H17V21H5C4.45 21 4 20.55 4 20V6Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700">20</h4>
                                <div className="text-gray-500">Số lượng đầu sách</div>
                            </div>
                        </div>
                    </div>

                    {/* Achievement Item 3 */}
                    <div className="w-full px-6 sm:w-1/4 xl:w-1/4">
                        <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
                            <div className="p-3 bg-orange-600 bg-opacity-75 rounded-full">
                                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 2H6C4.89 2 4 2.89 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.89 19.1 2 18 2ZM18 20H6V4H18V20ZM8 6H16V8H8V6ZM8 10H16V12H8V10ZM8 14H13V16H8V14Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700">116</h4>
                                <div className="text-gray-500">Số lượng phiếu nhập</div>
                            </div>
                        </div>
                    </div>

                    {/* Achievement Item 4 */}
                    <div className="w-full px-6 sm:w-1/4 xl:w-1/4">
                        <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
                            <div className="p-3 bg-pink-600 bg-opacity-75 rounded-full">
                                <svg className="w-8 h-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="4" width="22" height="20" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"></rect>
                                    <line x1="7" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                                    <line x1="7" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                                    <line x1="7" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                                    <path d="M14 22L18 18L14 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"></path>
                                    <path d="M18 18H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
                                </svg>
                            </div>
                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700">20</h4>
                                <div className="text-gray-500">Số lượng phiếu xuất</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Achievement;
