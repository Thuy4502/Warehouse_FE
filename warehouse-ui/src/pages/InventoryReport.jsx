import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { LuDownload } from "react-icons/lu";
import * as XLSX from 'xlsx';
import { getInventoryReport } from '../State/Inventory/Action';
import { getTransactionHistories } from '../State/Transaction/Action';

const InventoryReport = () => {
    const dispatch = useDispatch();
    const inventoryReport = useSelector((state) => state?.inventory.inventoryReport.data || []);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const type = "Nhập";
    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(today    );


    useEffect(() => {
        const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';

        dispatch(getInventoryReport(formattedStartDate, formattedEndDate));
    }, [dispatch, startDate, endDate]);

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

    const handleOnclickExport = () => {
        const worksheetData = inventoryReport.map((item, index) => ({
            'STT': index + 1,
            'ISBN': item.isbn || "N/A",
            'Tên sách': item.bookName || "N/A",
            'Đơn vị': "Quyển",
            'Số lượng nhập đầu kỳ': item.startQuantity || 0,
            'Số lượng nhập trong kỳ': item.importQuantity || 0,
            'Số lượng xuất trong kỳ': item.exportQuantity || 0,
            'Tồn cuối kỳ - Số lượng': item.endQuantity || 0,
            'Tồn cuối kỳ - Đơn giá': formatCurrency(item.endPrice) || "N/A",
            'Tồn cuối kỳ - Thành tiền': formatCurrency(item.endAmount) || "N/A",
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Báo cáo tồn kho");
        XLSX.writeFile(workbook, "InventoryReport.xlsx");
    };
    
    

    const formatDate = (dateString) => {
        if (!dateString || isNaN(new Date(dateString))) return 'N/A';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    console.log("Inventory report ", inventoryReport)


    return (
        <div className="bg-white m-3">
            <div className="font-bold text-3xl p-3 ml-5">Báo cáo tồn kho</div>

            <div className="mr-5 p-5 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                        </div>
                        <DatePicker
                            id='start-date'
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Chọn ngày bắt đầu"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                        />
                    </div>

                    <span className="mx-4 text-gray-500">đến</span>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                        </div>
                        <DatePicker
                            id='end-date'
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Chọn ngày kết thúc"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                        />
                    </div>
                </div>
                <button id='btn-export-excel' className='flex rounded-md border p-2 items-center bg-green-700 text-white' onClick={() => handleOnclickExport()}>
                    <LuDownload className="mr-2" />Xuất file excel
                </button>
            </div>


            <div className="overflow-x-auto">
                <table id='table-inventory-report' className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wide">
                        <tr className='bg-blue-200'>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">STT</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">ISBN</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Tên sách</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">DVT</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Tồn đầu kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" colSpan="2">Trong kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Tồn cuối kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Đơn giá</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Giá trị hàng tồn</th>


                        </tr>
                        <tr className='bg-blue-200'>
                            <th className="border border-gray-300 px-4 py-2 text-center">Nhập</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Xuất</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryReport.map((item, index) => (
                            <tr key={index}>
                                <td id="index" className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                                <td id="isbn" className="border border-gray-300 px-4 py-2 text-center">{item.isbn || "N/A"}</td>
                                <td id="book-name" className="border border-gray-300 px-4 py-2 text-center">{item.bookName || "N/A"}</td>
                                <td id="unit" className="border border-gray-300 px-4 py-2 text-center">Quyển</td>
                                <td id="start-quantity" className="border border-gray-300 px-4 py-2 text-center">{item.startQuantity || 0}</td>
                                <td id="import-quantity" className="border border-gray-300 px-4 py-2 text-center">{item.importQuantity}</td>
                                <td id="export-quantity" className="border border-gray-300 px-4 py-2 text-center">{item.exportQuantity}</td>
                                <td id="end-quantity" className="border border-gray-300 px-4 py-2 text-center">{item.endQuantity || 0}</td>
                                <td id="end-price" className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(item.endPrice) || "N/A"}</td>
                                <td id="end-amount" className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(item.endAmount) || "N/A"}</td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default InventoryReport