import { React, useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Select, MenuItem, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllBooks } from '../State/Book/Action';
import { addTransactionRequest, approveTransactionRequest, getAllTransactionRequest, rejectTransactionRequest, updateTransactionRequest } from '../State/TransactionRequest/Action';

const EditTransactionRequest = ({ isOpen, onClose, transactionRequest, onSuccess }) => {

    const books = useSelector((state) => state.book.books.data || []);
    const dispatch = useDispatch();
    const staffId = localStorage.getItem("staffId");
    const role = localStorage.getItem("role");
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    const [data, setData] = useState({
        createBy: transactionRequest?.createBy || '',
        phoneNumber: transactionRequest?.phoneNumber || '',
        position: transactionRequest?.position || '',
        department: transactionRequest?.department || '',
        reason: transactionRequest?.reason || '',
        transactionRequestItems: transactionRequest?.transactionRequestItems || [],
        staffId: transactionRequest?.staff.staffId || '',
        updateBy: staffId,
        totalValue: transactionRequest?.totalValue,
    });

    const handleSave = async (event) => {
        event.preventDefault();
        await dispatch(updateTransactionRequest(transactionRequest.transactionRequestId, data));
        onSuccess();
        onClose()
    };

    const handleApprove = (event) => {
        event.preventDefault();
        dispatch(approveTransactionRequest(transactionRequest.transactionRequestId, staffId));
        closeApproveModal();
    };

    const handleReject = (event) => {
        event.preventDefault();
        dispatch(rejectTransactionRequest(transactionRequest.transactionRequestId));
        closeRejectModal();
    };

    console.log("Dữ liệu để cập nhật ", data)


    const [rows, setRows] = useState([{ id: 1, bookId: '', quantity: '', price: '', note: '' }]);

    useEffect(() => {
        if (transactionRequest) {
            const formattedRows = (transactionRequest.transactionRequestItems || []).map((item, index) => ({
                id: index + 1,
                bookId: item.book?.bookId || '',
                quantity: item.requestQuantity || '',
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
                transactionRequestItems: formattedRows || [],
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

    const openApproveModal = () => {
        setIsApproveModalOpen(true);
    };

    const closeApproveModal = () => {
        setIsApproveModalOpen(false);
    };

    const openRejectModal = () => {
        setIsRejectModalOpen(true);
    };

    const closeRejectModal = () => {
        setIsRejectModalOpen(false);
    };

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);



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
                                    <h4>CÔNG TY QUẢN LÝ KHO AN AN</h4>
                                    <p>Số 97 Man Thiện, P. Tăng Nhơn Phú A, Tp. Thủ Đức</p>
                                </div>
                                <div>
                                    <h4 className='font-bold text-center'>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                                    <p className='italic text-center font-bold'>Độc lập - Tự do - Hạnh phúc</p>
                                    {/* <p className='italic text-center'>Tp. Hồ Chí Minh, ngày...tháng...năm 2024</p> */}
                                </div>
                            </div>
                            <div className='text-center mt-10'>
                                <h2 className='text-xl font-bold'>PHIẾU ĐỀ NGHỊ XUẤT HÀNG</h2>
                                {/* <p className='italic font-bold'>Ngày...tháng...năm...</p> */}
                                <p className='mb-5'>Mã phiếu: {transactionRequest?.transactionRequestCode}</p>
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
                            <div className="flex justify-center mb-5">
                                <IconButton onClick={handleAddRow}>
                                    <AddIcon />
                                </IconButton>
                            </div>
                            <div>
                                <p>Tổng giá trị: {formatCurrency(data.totalValue)}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">

                            <button
                                type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Lưu thay đổi
                            </button>
                            {
                                ((role === "Admin" && transactionRequest?.type.typeName === "Nhập") || ((role === "Warehousekeeper" && transactionRequest?.type.typeName === "Xuất"))) && (
                                    <button
                                        type="button"
                                        onClick={() => openApproveModal()}
                                        sx={{
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: transactionRequest?.status === "Chưa duyệt" ? 'blue' : 'gray',
                                            },
                                        }}
                                        disabled={transactionRequest?.status !== "Chưa duyệt"}
                                        className={`font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                                        ${transactionRequest?.status === "Chưa duyệt" ? 'bg-blue-700 hover:bg-blue-800' : 'bg-gray-400'} 
                                       text-white border border-gray-200 dark:text-white dark:focus:ring-blue-800`}
                                    >
                                        Duyệt
                                    </button>
                                )
                            }


                            {
                                ((role === "Admin" && transactionRequest?.type.typeName === "Nhập") || ((role === "Warehousekeeper" && transactionRequest?.type.typeName === "Xuất"))) && (
                                    <button
                                        type="button"
                                        onClick={() => openRejectModal()}
                                        sx={{
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: transactionRequest?.status === "Chưa duyệt" ? 'darkred' : 'gray',
                                            },
                                        }}
                                        disabled={transactionRequest?.status === "Đã hủy" || transactionRequest?.status !== "Chưa duyệt"}
                                        className={`font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                                        ${transactionRequest?.status === "Chưa duyệt" ? 'bg-red-500' : 'bg-gray-400'} 
                                        ${transactionRequest?.status === "Chưa duyệt" ? 'hover:bg-red-700' : 'bg-gray-400'} 
                                        text-white border border-gray-200 dark:text-white dark:focus:ring-red-800`}
                                    >
                                        Từ chối
                                    </button>
                                )
                            }

                            <button
                                type="button"
                                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
                                onClick={onClose}
                            >
                                Đóng
                            </button>

                        </div>
                    </form>
                </div>

                {isApproveModalOpen && (
                    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                        <div id='confirm-modal' className="bg-white p-6 rounded-md shadow-md w-96">
                            <h3 className="text-lg font-semibold mb-4">Xác nhận duyệt phiếu</h3>
                            <p>Bạn có chắc bạn muốn duyệt phiếu này?</p>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={closeApproveModal}
                                    id='btn-cancel-confirm'
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800 mr-2"
                                >
                                    Hủy
                                </button>
                                <button
                                    id='btn-confirm'
                                    onClick={handleApprove}
                                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
                                >
                                    Đồng ý
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isRejectModalOpen && (
                    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                        <div id='confirm-modal' className="bg-white p-6 rounded-md shadow-md w-96">
                            <h3 className="text-lg font-semibold mb-4">Xác nhận từ chối phiếu</h3>
                            <p>Bạn có chắc bạn muốn từ chối phiếu này?</p>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={closeRejectModal}
                                    id='btn-cancel-confirm'
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800 mr-2"
                                >
                                    Hủy
                                </button>
                                <button
                                    id='btn-confirm'
                                    onClick={handleReject}
                                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
                                >
                                    Đồng ý
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default EditTransactionRequest;
