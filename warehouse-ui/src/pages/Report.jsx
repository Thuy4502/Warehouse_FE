import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Report = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    
    return (
        <div className="bg-white m-3">
            <div className="font-bold text-3xl p-3 ml-5">Nhật ký nhập xuất</div>

            <div className="mr-5 p-5 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                        </div>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Select date start"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                        />
                    </div>

                    <span className="mx-4 text-gray-500">to</span>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                        </div>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Select date end"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wide">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowspan="2">Mã sách</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowspan="2">Tên sách</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowspan="2">Mã phiếu</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowspan="2">Ngày nhập</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowspan="2">Đơn giá</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" colspan="2">Tồn dầu kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" colspan="2">Nhập trong kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" colspan="2">Xuất trong kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" colspan="2">Tổng cuối kỳ</th>

                        </tr>
                        <tr>
                        <th className="border border-gray-300 px-4 py-2 text-center" >Số lượng</th>
                        <th className="border border-gray-300 px-4 py-2 text-center" >Thành tiền</th>
                        <th className="border border-gray-300 px-4 py-2 text-center" >Số lượng</th>
                        <th className="border border-gray-300 px-4 py-2 text-center" >Thành tiền</th>
                        <th className="border border-gray-300 px-4 py-2 text-center" >Số lượng</th>
                        <th className="border border-gray-300 px-4 py-2 text-center" >Thành tiền</th>
                        <th className="border border-gray-300 px-4 py-2 text-center" >Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-sm">
                            <td className="border border-gray-300 px-4 py-2 text-center">1234</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">Item Name</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">quyển</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">100</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">50</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">20</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">130</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">10,000</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">10,000</td>

                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Report;
