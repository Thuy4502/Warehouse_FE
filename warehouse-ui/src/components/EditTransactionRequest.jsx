import { React, useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Select, MenuItem, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllBooks } from '../State/Book/Action';
import { addTransactionRequest, updateTransactionRequest } from '../State/TransactionRequest/Action';

const EditTransactionRequest = ({ isOpen, onClose, transactionRequest }) => {

    const books = useSelector((state) => state.book.books.data || []);
    const dispatch = useDispatch();
    const staffId = localStorage.getItem("staffId");


    const [data, setData] = useState({
        createBy: transactionRequest?.createBy || '',
        phoneNumber: transactionRequest?.phoneNumber || '',
        position: transactionRequest?.position || '',
        department: transactionRequest?.department || '',
        reason: transactionRequest?.reason || '',
        transactionRequestItems: transactionRequest?.transactionRequestItems || [],
        staffId: transactionRequest?.staff.staffId || '',
        updateBy: staffId,
        totalValue: 0,
    });

    const handleSave = (event) => {
        event.preventDefault();
        dispatch(updateTransactionRequest(transactionRequest.transactionRequestId, data));
    };

    console.log("Dữ liệu để cập nhật ", data)


    const [rows, setRows] = useState([{ id: 1, bookId: '', quantity: '', price: '', note: '' }]);
    console.log("Dữ liệu staff", staffId)



    useEffect(() => {
        if (transactionRequest) {
            const formattedRows = (transactionRequest.transactionRequestItems || []).map((item, index) => ({
                id: index + 1,
                bookId: item.book?.bookId || '', 
                quantity: item.quantity || '',
                price: item.price || '',
                note: item.note || '',
            }));
    
            setRows(formattedRows);
    
            setData({
                createBy: transactionRequest.createBy || '',
                phoneNumber: transactionRequest.phoneNumber || '',
                position: transactionRequest.position || '',
                department: transactionRequest.department || '',
                reason: transactionRequest.reason || '',
                transactionRequestItems: formattedRows || [],  // Use formattedRows directly
                staffId: transactionRequest.staff?.staffId || '',
                updateBy: staffId,
                totalValue: transactionRequest.totalValue || 0,
            });
        }
    }, [transactionRequest, staffId]);
    
    


    useEffect(() => {
        dispatch(getAllBooks());
    }, [dispatch]);


    const handleAddRow = () => {
        const newRow = { id: rows.length + 1, bookId: '', quantity: '', price: '', note: '' };
        setRows([...rows, newRow]);
        setData((prevData) => ({
            ...prevData,
            transactionRequestItems: [...prevData.transactionRequestItems, newRow],
        }));
    };

    const handleRowChange = (index, field, value) => {
        const updatedRows = rows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
        );

        const totalValue = updatedRows.reduce((acc, row) => {
            const quantity = parseFloat(row.quantity) || 0;
            const unitPrice = parseFloat(row.price) || 0;
            return acc + quantity * unitPrice;
        }, 0);

        setRows(updatedRows);
        setData((prevData) => ({
            ...prevData,
            transactionRequestItems: updatedRows,
            totalValue: totalValue,
        }));
    };


    const handleDeleteRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);

        const totalValue = updatedRows.reduce((acc, row) => {
            const quantity = parseFloat(row.quantity) || 0;
            const unitPrice = parseFloat(row.unitPrice) || 0;
            return acc + quantity * unitPrice;
        }, 0);

        setData((prevData) => ({
            ...prevData,
            transactionRequestItems: updatedRows,
            totalValue: totalValue,
        }));
    };

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
                                    <h4 className='font-bold text-center'>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                                    <p className='italic text-center font-bold'>Độc lập - Tự do - Hạnh phúc</p>
                                    <p className='italic text-center'>Tp. Hồ Chí Minh, ngày...tháng...năm 2024</p>
                                </div>
                            </div>
                            <div className='text-center mt-10'>
                                <h2 className='text-xl font-bold'>PHIẾU YÊU CẦU NHẬP HÀNG</h2>
                                <p className='italic font-bold'>Ngày...tháng...năm...</p>
                                <p>Số: NK00012</p>
                            </div>
                            <div className="space-y-4 mr-5">
                                <div className="flex items-center">
                                    <p className="w-1/5">Người đề xuất:</p>
                                    <input
                                        type="text"
                                        value={data.createBy}
                                        onChange={(e) => handleFormChange('createBy', e.target.value)}
                                        placeholder="Nhập tên người đề xuất"
                                        className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <p className="w-1/5">Số điện thoại:</p>
                                    <input
                                        type="text"
                                        value={data.phoneNumber}
                                        onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
                                        placeholder="Nhập số điện thoại"
                                        className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <p className="w-1/5">Chức danh:</p>
                                    <input
                                        type="text"
                                        value={data.position}
                                        onChange={(e) => handleFormChange('position', e.target.value)}
                                        placeholder="Nhập chức danh"
                                        className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <p className="w-1/5">Bộ phận:</p>
                                    <input
                                        type="text"
                                        value={data.department}
                                        onChange={(e) => handleFormChange('department', e.target.value)}
                                        placeholder="Nhập bộ phận"
                                        className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <p className="w-1/5">Nội dung đề xuất:</p>
                                    <input
                                        type="text"
                                        value={data.reason}
                                        onChange={(e) => handleFormChange('reason', e.target.value)}
                                        placeholder="Nhập nội dung đề xuất"
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
                                        <th className="px-6 py-3 border border-gray-300">Số lượng</th>
                                        <th className="px-6 py-3 border border-gray-300">Đơn giá (VND)</th>
                                        <th className="px-6 py-3 border border-gray-300">Ghi chú</th>
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
                                                    className="w-full"
                                                >
                                                    <MenuItem value={row?.book?.bookId} disabled>
                                                     
                                                    </MenuItem>
                                                    {books.map((book) => (
                                                        <MenuItem key={book.bookId} value={book.bookId}>
                                                            {book.bookName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </td>

                                            <td className="px-6 py-4 border border-gray-300">Quyển</td>
                                            <td className="px-6 py-4 border border-gray-300">
                                                <input
                                                    type="number"
                                                    value={row.quantity}
                                                    onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
                                                    placeholder="Nhập số lượng"
                                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                                />
                                            </td>
                                            <td className="px-6 py-4 border border-gray-300">
                                                <input
                                                    type="number"
                                                    value={row.price}
                                                    onChange={(e) => handleRowChange(index, 'price', e.target.value)}
                                                    placeholder="Nhập đơn giá"
                                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                                />
                                            </td>
                                            <td className="px-6 py-4 border border-gray-300">
                                                <input
                                                    type="text"
                                                    value={row.note}
                                                    onChange={(e) => handleRowChange(index, 'note', e.target.value)}
                                                    placeholder=""
                                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                                />
                                            </td>
                                            <td className="px-6 py-4 border border-gray-300">
                                                <IconButton onClick={() => handleDeleteRow(index)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                            <div className="flex justify-between mb-5">
                                <p>Tổng giá trị: {data.totalValue} VND</p>
                                <IconButton onClick={handleAddRow}>
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </div>

                        <div className="flex justify-end px-6 pb-6">
                            <button
                                type="button"
                                className="mr-3 bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700"
                                onClick={onClose}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
                            >
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Dialog>
    );
};

export default EditTransactionRequest;
