import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionHistories } from '../State/Transaction/Action';
import { LuDownload } from "react-icons/lu";
import * as XLSX from 'xlsx';

const ImportReport = () => {
    const dispatch = useDispatch();
    const transactionHistories = useSelector((state) => state.transaction?.transactionHistory.data || []);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const type = "Nhập";

    useEffect(() => {
        dispatch(getTransactionHistories(type));
    }, [dispatch, type]);

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

    const filteredTransactions = transactionHistories.filter(transaction => {
        const transactionDate = new Date(transaction.createDate);
        return (!startDate || transactionDate >= startDate) &&
            (!endDate || transactionDate <= endDate);
    });

    const handleOnclickExport = () => {
        const worksheetData = filteredTransactions.map((transaction, index) => ({
            STT: index + 1,
            NgayNhap: transaction.createDate || "N/A",
            MaPN: transaction.transactionCode || "N/A",
            MaSach: transaction.bookId || "N/A",
            TenSach: transaction.bookName || "N/A",
            DonVi: "quyển",
            DonGia: formatCurrency(transaction.price),
            TonDauKy_SoLuong: transaction.startQty || 0,
            TonDauKy_ThanhTien: formatCurrency((transaction.startQty || 0) * (transaction.price || 0)),
            NhapTrongKy_SoLuong: transaction.actualQuantity || 0,
            NhapTrongKy_ThanhTien: formatCurrency((transaction.actualQuantity || 0) * (transaction.price || 0)),
            TonCuoiKy_SoLuong: transaction.startQty + transaction.actualQuantity || 0,
            TonCuoiKy_ThanhTien: formatCurrency(((transaction.startQty + transaction.actualQuantity) || 0) * (transaction.price || 0))
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ImportHistory");

        XLSX.writeFile(workbook, "ImportHistory.xlsx");
    };

    return (
        <div className="bg-white m-3">
            <div className="font-bold text-3xl p-3 ml-5">Nhật ký nhập</div>

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
                <button className='ml-auto rounded-md border p-2 flex items-center bg-green-700 text-white' onClick={() => handleOnclickExport()}>
                    <LuDownload className="mr-2" />Export excel
                </button>
            </div>


            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wide">
                        <tr className='bg-blue-200'>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">STT</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Ngày nhập</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Mã PN</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Mã sách</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Tên sách</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Đơn vị</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" rowSpan="2">Đơn giá</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" colSpan="2">Tồn đầu kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" colSpan="2">Nhập trong kỳ</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" colSpan="2">Tồn cuối kỳ</th>
                        </tr>
                        <tr className='bg-blue-200'>
                            <th className="border border-gray-300 px-4 py-2 text-center">Số lượng</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Thành tiền</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Số lượng</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Thành tiền</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Số lượng</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((transaction, index) => (
                            <tr key={transaction.id} className="text-sm">
                                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{transaction.createDate || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{transaction.transactionCode || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{transaction.bookId || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{transaction.bookName || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">quyển</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(transaction.price)}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{transaction.startQty || 0}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency((transaction.startQty || 0) * (transaction.price || 0))}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{transaction.actualQuantity || 0}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency((transaction.actualQuantity || 0) * (transaction.price || 0))}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{transaction.startQty + transaction.actualQuantity || 0}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{formatCurrency(((transaction.startQty + transaction.actualQuantity) || 0) * (transaction.price || 0))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ImportReport;
