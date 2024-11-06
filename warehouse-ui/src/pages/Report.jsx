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
    const type = null;

    useEffect(() => {
        dispatch(getTransactionHistories(type));
    }, [dispatch, type]);

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

    const filteredTransactions = transactionHistories.filter(transaction => {
        const transactionDate = new Date(transaction.createDate);
        return (!startDate || transactionDate >= startDate) &&
            (!endDate || transactionDate <= endDate);
    });

    const handleExportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredTransactions.map((transaction, index) => ({
            'STT': index + 1,
            'Ngày': transaction.createDate,
            'Mã phiếu': transaction.transactionCode,
            'Mã sách': transaction.bookId,
            'Tên sách': transaction.bookName,
            'Đơn giá': transaction.price,
            'Tồn đầu kỳ - Số lượng': transaction.startQty || 0,
            'Tồn đầu kỳ - Thành tiền': transaction.price * transaction.startQty || 0,
            'Nhập - Số lượng': transaction.typeId === 1 ? transaction.actualQuantity : 0,
            'Nhập - Thành tiền': transaction.typeId === 1 ? transaction.price * transaction.actualQuantity : 0,
            'Xuất - Số lượng': transaction.typeId === 2 ? transaction.actualQuantity : 0,
            'Xuất - Thành tiền': transaction.typeId === 2 ? transaction.price * transaction.actualQuantity : 0,
            'Tổng cuối kỳ - Số lượng': (transaction.startQty + transaction.actualQuantity) || 0,
            'Tổng cuối kỳ - Thành tiền': ((transaction.startQty + transaction.actualQuantity) * transaction.price) || 0
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
        XLSX.writeFile(workbook, 'Transaction_Report.xlsx');
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
                <button className='ml-auto rounded-md border p-2 flex items-center bg-green-700 text-white' onClick={() => handleExportToExcel()}>
                    <LuDownload className="mr-2" />Export excel
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wide">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" rowSpan="2">STT</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" rowSpan="2">Ngày</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" rowSpan="2">Mã phiếu</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" rowSpan="2">Mã sách</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" rowSpan="2">Tên sách</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" rowSpan="2">DVT</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" rowSpan="2">Đơn giá</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" colSpan="2">Tồn đầu kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center  bg-green-200" colSpan="2">Nhập trong kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center  bg-red-200" colSpan="2">Xuất trong kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200" colSpan="2">Tổng cuối kỳ</th>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200">Số lượng</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200">Thành tiền</th>
                            <th className="border border-gray-300 px-4 py-2 text-center  bg-green-200">Số lượng</th>
                            <th className="border border-gray-300 px-4 py-2 text-center  bg-green-200">Thành tiền</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-red-200">Số lượng</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-red-200">Thành tiền</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200">Số lượng</th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-blue-200">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((transaction, index) => {
                            const typeId = transaction.typeId || {};
                            console.log("Loại ", typeId)

                            return (
                                <tr className="text-sm" key={transaction.id}>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.createDate}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.transactionCode}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.bookId}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.bookName}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">quyển</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(transaction.price)}</td>

                                    {/* Tồn đầu kỳ (example values, adjust as needed) */}
                                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.startQty || 0}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(transaction.price * transaction.startQty || '')}</td>

                                    {/* Nhập trong kỳ */}
                                    {typeId === 1 ? (
                                        <>
                                            <td className="border border-gray-300 px-4 py-2 text-center bg-green-200">{transaction.actualQuantity || 0}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center bg-green-200">{formatCurrency(transaction.price * transaction.actualQuantity || '')}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="border border-gray-300 px-4 py-2 text-center"></td>
                                            <td className="border border-gray-300 px-4 py-2 text-center"></td>
                                        </>
                                    )}

                                    {/* Xuất trong kỳ */}
                                    {typeId === 2 ? (
                                        <>
                                            <td className="border border-gray-300 px-4 py-2 text-center bg-red-200">{transaction.actualQuantity || 0}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center bg-red-200">{formatCurrency(transaction.price * transaction.actualQuantity | '')}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="border border-gray-300 px-4 py-2 text-center"></td>
                                            <td className="border border-gray-300 px-4 py-2 text-center"></td>
                                        </>
                                    )}


                                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.startQty + transaction.actualQuantity || 0}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency((transaction.startQty + transaction.actualQuantity) * transaction.price || '')}</td>
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
