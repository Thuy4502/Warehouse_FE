import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { addTransaction, getAllTransaction, updateTransaction } from '../State/Transaction/Action';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Select, MenuItem, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllBooks } from '../State/Book/Action';


const EditTransaction = ({ isOpen, onClose, transaction }) => {
    const books = useSelector((state) => state.book.books.data || []);
    const dispatch = useDispatch();
    const staff = localStorage.getItem("staffId")
    const [rows, setRows] = useState([{ id: 1, bookId: '', requestQuantity: '', actualQuantity: '', price: '', note: '' }]);

    const handleAddRow = () => {
        const newRow = { id: rows.length + 1, bookId: '', requestQuantity: '', actualQuantity: '', price: '', note: '' };
        setRows([...rows, newRow]);
        setData((prevData) => ({
            ...prevData,
            transactionItems: [...prevData.transactionItems, newRow],
        }));
    };

    console.log("Rowwww", rows)

    const handleRowChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);

        const updatedTransactionItems = updatedRows.map((row) => ({
            bookId: row.bookId,
            requestQuantity: row.requestQuantity,
            actualQuantity: row.actualQuantity,
            price: row.price,
            note: row.note,
        }));

        const totalValue = updatedTransactionItems.reduce((acc, row) => {
            const actualQuantity = parseFloat(row.actualQuantity) || 0;
            const price = parseFloat(row.price) || 0;
            return acc + actualQuantity * price;
        }, 0);

        setData((prevData) => ({
            ...prevData,
            transactionItems: updatedTransactionItems,
            totalValue: totalValue,
        }));
    };
    const handleDeleteRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };


    console.log("Chi tiết PN ", transaction)

    const [data, setData] = useState({
        businessPartner: transaction?.businessPartner || '',
        address: transaction?.address || '',
        phone_number: transaction?.phone_number || '',
        billCode: transaction?.bill?.billCode || '',
        transactionCode: transaction?.transactionCode || '',
        transactionRequestId: transaction?.transactionRequest?.transactionRequestId || '',
        transactionItems: rows || [],
        staffId: transaction?.staff?.staffId || '',
        updateBy: staff,
        typeId: transaction?.type.typeId || '',
        totalValue: transaction?.totalValue || 0,

    })

    console.log("Dữ liệu gửi đi ", data)


    const handleSave = (event) => {
        event.preventDefault();
        dispatch(updateTransaction(transaction?.transactionId, data));
    };

    useEffect(() => {
        dispatch(getAllBooks());
    }, [dispatch]);

    useEffect(() => {
        if (transaction && transaction.transactionItems) {
            const formattedRows = transaction.transactionItems.map((item, index) => ({
                id: index + 1,
                bookId: item.book?.bookId || '',
                requestQuantity: item.requestQuantity || '',
                actualQuantity: item.actualQuantity || '',
                price: item.price || '',
                note: item.note || '',
            }));

            setRows(formattedRows);

            setData({
                businessPartner: transaction.businessPartner || '',
                address: transaction.address || '',
                phone_number: transaction.phone_number || '',
                billCode: transaction.bill?.billCode || '',
                transactionCode: transaction.transactionCode || '',
                transactionRequestId: transaction.transactionRequest?.transactionRequestId || '',
                transactionItems: formattedRows,
                staffId: transaction.staff?.staffId || '',
                typeId: transaction.type?.typeId || '',
                updateBy: staff,
                totalValue: transaction.totalValue || 0,
            });
        }
    }, [transaction, staff]);



    const handleFormChange = (field, value) => {
        setData({ ...data, [field]: value });
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <div
                id="editCategoryModal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
                <div className="relative w-full max-w-5xl max-h-full">
                    <form className="relative bg-white rounded-lg shadow dark:bg-gray-700 font-times-new-roman text-black" onSubmit={handleSave}>
                        <div className='px-3 pt-3'>
                            <div className='flex justify-between'>
                                <div>
                                    <h4>CÔNG TY CỔ PHẦN ĐẦU TƯ VÀ CÔNG NGHỆ X</h4>
                                    <p>Số 97 Man Thiện, P. Tăng Nhơn Phú A, Tp. Thủ Đức</p>
                                </div>
                                <div>
                                    <h4 className='font-bold text-center'>Mẫu số: 01 - VT</h4>
                                    <p className='italic text-center'>Ban hành theo thông tư số 133/2016/TT-BTC</p>
                                    <p className='italic text-center'>Ngày 26/08/2016 của Bộ Tài Chính</p>
                                </div>
                            </div>
                            <div className='text-center mt-10'>
                                <h2 className='text-xl font-bold'>PHIẾU NHẬP KHO</h2>
                                <p className='italic font-bold'>Ngày...tháng...năm...</p>
                                <span className='flex justify-center items-center'>
                                    <p className='mr-2'>Số: </p>
                                    <input
                                        type="text"
                                        value={data.transactionCode}
                                        onChange={(e) => handleFormChange('transactionCode', e.target.value)}
                                        placeholder="Nhập số PN"
                                        className="w-[100px] py-2   "
                                    />
                                </span>
                            </div>
                            <div className="space-y-4 mr-5">
                                <div className="flex items-center">
                                    <p className="w-1/5">{transaction?.type.typeName == 'Xuất' ? "Tên khách hàng: " : 'Nhà cung cấp: '}</p>
                                    <input
                                        type="text"
                                        value={data.businessPartner}
                                        onChange={(e) => handleFormChange('businessPartner', e.target.value)}
                                        placeholder="Nhập tên nhà cung cấp"
                                        className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {transaction?.type.typeName === 'Nhập' && (
                                    <div className="flex items-center">
                                        <p className="w-1/5">Theo hóa đơn số:</p>
                                        <input
                                            type="text"
                                            value={data.billCode}
                                            onChange={(e) => handleFormChange('billCode', e.target.value)}
                                            placeholder="Nhập số hóa đơn"
                                            className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}




                                <div className="flex items-center">
                                    <p className="w-1/5">Địa chỉ:</p>
                                    <input
                                        type="text"
                                        value={data.address}
                                        onChange={(e) => handleFormChange('address', e.target.value)}
                                        placeholder="Nhập địa chỉ"
                                        className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <p className="w-1/5">Theo phiếu yêu cầu số:</p>
                                    <input
                                        type="text"
                                        value={data.transactionRequestId}
                                        onChange={(e) => handleFormChange('transactionRequestId', e.target.value)}
                                        placeholder="Nhập số phiếu yêu cầu"
                                        className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <table className="mt-3 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse border border-gray-200 mb-10">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3 border border-gray-300">STT</th>
                                        <th className="px-6 py-3 border border-gray-300">Tên sách</th>
                                        <th className="px-6 py-3 border border-gray-300">Đơn vị tính</th>
                                        <th className="px-6 py-3 border border-gray-300">SL theo chứng từ</th>
                                        <th className="px-6 py-3 border border-gray-300">Thực nhập</th>
                                        <th className="px-6 py-3 border border-gray-300">Đơn giá (VND)</th>
                                        <th className="px-6 py-3 border border-gray-300">Ghi chú</th>
                                        <th className="px-6 py-3 border border-gray-300">Thành tiền</th>
                                        <th className="px-6 py-3 border border-gray-300">Xóa dòng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, index) => (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4 border border-gray-300">{index + 1}</td>
                                            <td className="px-6 py-4 border border-gray-300">
                                                <Select
                                                    value={row.bookId || ''}
                                                    onChange={(e) => handleRowChange(index, 'bookId', e.target.value)}
                                                    displayEmpty
                                                    fullWidth
                                                    className="w-full border rounded py-2 h-10"
                                                >
                                                    <MenuItem value="" disabled></MenuItem>
                                                    {books.map((book) => (
                                                        <MenuItem key={book.bookId} value={book.bookId}>{book.bookName}</MenuItem>
                                                    ))}
                                                </Select>
                                            </td>
                                            <td className="px-6 py-4 border border-gray-300">Quyển</td>
                                            <td className="px-6 py-4 border border-gray-300">
                                                <input
                                                    type="number"
                                                    value={row.requestQuantity}
                                                    onChange={(e) => handleRowChange(index, 'requestQuantity', e.target.value)}
                                                    className="w-full rounded py-2 h-8 border-none"
                                                />
                                            </td>
                                            <td className="px-6 py-4 border border-gray-300">
                                                <input
                                                    type="number"
                                                    value={row.actualQuantity}
                                                    onChange={(e) => handleRowChange(index, 'actualQuantity', e.target.value)}
                                                    className="w-full rounded py-2 h-8 border-none"
                                                />
                                            </td>
                                            <td className="px-6 py-4 border border-gray-300">
                                                <input
                                                    type="number"
                                                    value={row.price}
                                                    onChange={(e) => handleRowChange(index, 'price', e.target.value)}
                                                    className="w-full rounded py-2 h-8 border-none"
                                                />
                                            </td>
                                            <td className="px-6 py-4 border border-gray-300">
                                                <input
                                                    type="text"
                                                    value={row.note}
                                                    onChange={(e) => handleRowChange(index, 'note', e.target.value)}
                                                    className="w-full rounded py-2 h-8 border-none"
                                                />
                                            </td>
                                            <td className="px-6 py-4 border border-gray-300">
                                                <input
                                                    type="text"
                                                    value={row.actualQuantity * row.price}
                                                    className="w-full rounded py-2 h-8 border-none"
                                                />
                                            </td>
                                            <td className="px-6 py-4 border border-gray-300">
                                                <IconButton
                                                    onClick={() => handleDeleteRow(index)}
                                                    sx={{ color: 'red' }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mb-4">
                                <p className="font-bold">
                                    Tổng tiền: {Number(data.totalValue).toLocaleString()} VND
                                </p>
                            </div>


                            <div className="flex justify-center mb-5">
                                <IconButton onClick={handleAddRow} color="primary">
                                    <AddIcon />
                                </IconButton>
                            </div>
                            <div className="flex justify-between mb-20">
                                <div>
                                    <p className='font-bold'>Người lập phiếu</p>
                                    <p className='italic text-center'>Ký họ tên</p>
                                </div>
                                <div>
                                    <p className='font-bold'>Người giao hàng</p>
                                    <p className='italic text-center'>Ký họ tên</p>
                                </div>
                                <div>
                                    <p className='font-bold'>Thủ kho</p>
                                    <p className='italic text-center'>Ký họ tên</p>
                                </div>
                                <div>
                                    <p className='font-bold'>Kế toán trưởng</p>
                                    <p className='italic text-center'>Ký họ tên</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button
                                type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Lưu
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Dialog>
    );
};


export default EditTransaction