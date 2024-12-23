import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionHistories } from '../State/Transaction/Action';
import * as XLSX from 'xlsx';
import { LuDownload } from "react-icons/lu";


const ExportReport = () => {
    const dispatch = useDispatch();
    const transactionHistories = useSelector((state) => state.transaction?.transactionHistory.data || []);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const type = "Xuất";

    useEffect(() => {
        dispatch(getTransactionHistories(type));
    }, [dispatch, type]);

    console.log("Transaction History ", transactionHistories)

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

    const filteredTransactions = transactionHistories.filter(transaction => {
        const transactionDate = new Date(transaction.logDate);
        return (!startDate || transactionDate >= startDate) &&
            (!endDate || transactionDate <= endDate);
    });

    const handleOnclickExport = () => {
        const worksheetData = filteredTransactions.map((transaction, index) => ({
            'STT': index + 1,
            'Ngày xuất': transaction.logDate || "N/A",
            'Mã phiếu xuất': transaction.transactionCode || "N/A",
            'Mã sách': transaction.book?.isbn || "N/A",
            'Tên sách': transaction.book?.bookName || "N/A",
            'Đơn vị': "Quyển",

            // Tồn đầu kỳ
            'Tồn đầu kỳ - Số lượng': transaction.startQuantity || 0,
            'Tồn đầu kỳ - Đơn giá': formatCurrency(transaction.startPrice || 0),
            'Tồn đầu kỳ - Thành tiền': formatCurrency(transaction.startAmount || 0),

            // Xuất trong kỳ
            'Xuất trong kỳ - Số lượng': transaction.exportQuantity || 0,
            'Xuất trong kỳ - Đơn giá': formatCurrency(transaction.exportPrice || 0),
            'Xuất trong kỳ - Thành tiền': formatCurrency(transaction.exportAmount || 0),

            // Tồn cuối kỳ
            'Tồn cuối kỳ - Số lượng': transaction.endQuantity || 0,
            'Tồn cuối kỳ - Thành tiền': formatCurrency(transaction.endAmount || 0),
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Lịch sử xuất");

        XLSX.writeFile(workbook, "Lich_Su_Xuat.xlsx");
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
            <div className="font-bold text-3xl p-3 ml-5">Nhật ký xuất</div>

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
                <button id='btn-export-excel' className='ml-auto rounded-md border p-2 flex items-center bg-green-700 text-white' onClick={() => handleOnclickExport()}>
                    <LuDownload id='btn-export-excel' className="mr-2" />Xuất file excel
                </button>
            </div>

            <div className="overflow-x-auto">
                <table id='table-import-report' className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wide">
                        <tr className='bg-blue-200'>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">STT</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Ngày xuất</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Mã PN</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">ISBN</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Tên sách</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Đơn vị</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" colSpan="3">Tồn đầu kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" colSpan="3">Xuất trong kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" colSpan="3">Tồn cuối kỳ</th>
                        </tr>
                        <tr className='bg-blue-200'>
                            <th className="border border-gray-300 px-4 py-2 text-center">Số lượng</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Đơn giá</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Thành tiền</th>

                            <th className="border border-gray-300 px-4 py-2 text-center">Số lượng</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Đơn giá</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Thành tiền</th>

                            <th className="border border-gray-300 px-4 py-2 text-center">Số lượng</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Thành tiền</th>

                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((transaction, index) => (
                            <tr key={index}>
                                <td id="index" className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                                <td id="date" className="border border-gray-300 px-4 py-2 text-center">{formatDate(transaction.logDate) || "N/A"}</td>
                                <td id="transaction-code" className="border border-gray-300 px-4 py-2 text-center">{transaction.transactionCode || "N/A"}</td>
                                <td id="book-id" className="border border-gray-300 px-4 py-2 text-center">{transaction?.book?.isbn || "N/A"}</td>
                                <td id="book-name" className="border border-gray-300 px-4 py-2 text-center">{transaction?.bookName || "N/A"}</td>
                                <td id="unit" className="border border-gray-300 px-4 py-2 text-center">Quyển</td>
                                <td id="start-quantity" className="border border-gray-300 px-4 py-2 text-center">{transaction.startQuantity || 0}</td>
                                <td id="start-price" className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(transaction.startPrice)}</td>
                                <td id="opening-sub-total" className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(transaction.startAmount)}</td>
                                <td id="export-quantity" className="border border-gray-300 px-4 py-2 text-center">{transaction.exportQuantity || 0}</td>
                                <td id="export-price" className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(transaction.exportPrice)}</td>
                                <td id="exporting-sub-total" className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(transaction.exportAmount)}</td>
                                <td id="end-quantity" className="border border-gray-300 px-4 py-2 text-center">{transaction.endQuantity || 0}</td>
                                <td id="end-sub-total" className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(transaction.endAmount)}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default ExportReport;
