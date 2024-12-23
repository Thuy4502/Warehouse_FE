import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionHistories } from '../State/Transaction/Action';
import * as XLSX from 'xlsx';
import { LuDownload } from "react-icons/lu";


const Report = () => {
    const dispatch = useDispatch();
    const transactionHistories = useSelector((state) => state.transaction?.transactionHistory.data || []);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const type = "ALL";

    useEffect(() => {
        dispatch(getTransactionHistories(type));
    }, [dispatch, type]);

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

    const filteredTransactions = transactionHistories.filter(transaction => {
        const transactionDate = new Date(transaction.logDate);
        return (!startDate || transactionDate >= startDate) &&
            (!endDate || transactionDate <= endDate);
    });

    const handleExportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredTransactions.map((transaction, index) => {
            const isExportTransaction = transaction.transactionCode?.includes("PX");
            const isImportTransaction = transaction.transactionCode?.includes("PN");

            return {
                'STT': index + 1,
                'Ngày': transaction.logDate || "N/A",
                'Mã phiếu': transaction.transactionCode || "N/A",
                'Mã sách': transaction.book?.bookId || "N/A",
                'Tên sách': transaction.book?.bookName || "N/A",
                'Đơn vị': "Quyển",

                'Tồn đầu kỳ - Số lượng': transaction.startQuantity || 0,
                'Tồn đầu kỳ - Đơn giá': formatCurrency(transaction.startPrice || 0),
                'Tồn đầu kỳ - Thành tiền': formatCurrency(transaction.startAmount || 0),

                'Nhập - Số lượng': isImportTransaction ? transaction.importQuantity || 0 : "",
                'Nhập - Đơn giá': isImportTransaction ? formatCurrency(transaction.importPrice || 0) : "",
                'Nhập - Thành tiền': isImportTransaction ? formatCurrency(transaction.importAmount || 0) : "",

                'Xuất - Số lượng': isExportTransaction ? transaction.exportQuantity || 0 : "",
                'Xuất - Đơn giá': isExportTransaction ? formatCurrency(transaction.exportPrice || 0) : "",
                'Xuất - Thành tiền': isExportTransaction ? formatCurrency(transaction.exportAmount || 0) : "",

                'Tồn cuối kỳ - Số lượng': transaction.endQuantity || 0,
                'Tồn cuối kỳ - Thành tiền': formatCurrency(transaction.endAmount || 0),
            };
        }));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
        XLSX.writeFile(workbook, 'Transaction_Report.xlsx');
    };

    const formatDate = (dateString) => {
        if (!dateString || isNaN(new Date(dateString))) return 'N/A';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    return (
        <div className="bg-white m-3">
            <div className="font-bold text-3xl p-3 ml-5">Nhật ký kho chung</div>

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
                <button className='ml-auto rounded-md border p-2 flex items-center bg-green-700 text-white' onClick={() => handleExportToExcel()}>
                    <LuDownload id='btn-export-excel' className="mr-2" />Xuất file excel
                </button>
            </div>

            <div className="overflow-x-auto">
                <table id='table-report' className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wide">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" rowSpan="2">STT</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" rowSpan="2">Ngày</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" rowSpan="2">Mã phiếu</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" rowSpan="2">ISBN</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" rowSpan="2">Tên sách</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" rowSpan="2">DVT</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" colSpan="3">Tồn đầu kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-green-200" colSpan="3">Nhập trong kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-red-200" colSpan="3">Xuất trong kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" colSpan="2">Tổng cuối kỳ</th>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200">Số lượng</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200">Đơn giá</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200">Thành tiền</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-green-200">Số lượng</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-green-200">Đơn giá</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-green-200">Thành tiền</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-red-200">Số lượng</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-red-200">Đơn giá</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-red-200">Thành tiền</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200">Số lượng</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((transaction, index) => {
                            const isExportTransaction = transaction.transactionCode?.includes("PX");
                            const isImportTransaction = transaction.transactionCode?.includes("PN");

                            return (
                                <tr className="text-sm" key={transaction.id}>
                                    <td id="index" className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                                    <td id="date" className="border border-gray-300 px-4 py-2 text-center">{formatDate(transaction.logDate) || "N/A"}</td>
                                    <td id="transaction-code" className="border border-gray-300 px-4 py-2 text-center">{transaction.transactionCode || "N/A"}</td>
                                    <td id="book-id" className="border border-gray-300 px-4 py-2 text-center">{transaction.book?.isbn || "N/A"}</td>
                                    <td id="book-name" className="border border-gray-300 px-4 py-2 text-center">{transaction.book?.bookName || "N/A"}</td>
                                    <td id="unit" className="border border-gray-300 px-4 py-2 text-center">Quyển</td>

                                    {/* Tồn đầu kỳ */}
                                    <td id="start-quantity" className="border border-gray-300 px-4 py-2 text-center">{transaction.startQuantity || 0}</td>
                                    <td id="start-price" className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(transaction.startPrice || 0)}</td>
                                    <td id="opening-sub-total" className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(transaction.startAmount || 0)}</td>

                                    {/* Nhập trong kỳ */}
                                    <td id="import-quantity" className="border border-gray-300 px-4 py-2 text-center">
                                        {isImportTransaction ? transaction.importQuantity || 0 : ""}
                                    </td>
                                    <td id="import-price" className="border border-gray-300 px-4 py-2 text-center">
                                        {isImportTransaction ? formatCurrency(transaction.importPrice || 0) : ""}
                                    </td>
                                    <td id="importing-sub-total" className="border border-gray-300 px-4 py-2 text-center">
                                        {isImportTransaction ? formatCurrency(transaction.importAmount || 0) : ""}
                                    </td>

                                    {/* Xuất trong kỳ */}
                                    <td id="export-quantity" className="border border-gray-300 px-4 py-2 text-center">
                                        {isExportTransaction ? transaction.exportQuantity || 0 : ""}
                                    </td>
                                    <td id="export-price" className="border border-gray-300 px-4 py-2 text-center">
                                        {isExportTransaction ? formatCurrency(transaction.exportPrice || 0) : ""}
                                    </td>
                                    <td id="exporting-sub-total" className="border border-gray-300 px-4 py-2 text-center">
                                        {isExportTransaction ? formatCurrency(transaction.exportAmount || 0) : ""}
                                    </td>

                                    {/* Tồn cuối kỳ */}
                                    <td id="end-quantity" className="border border-gray-300 px-4 py-2 text-center">{transaction.endQuantity || 0}</td>
                                    <td id="end-sub-total" className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(transaction.endAmount || 0)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default Report;
