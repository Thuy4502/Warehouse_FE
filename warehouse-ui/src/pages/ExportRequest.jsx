import { React, useState, useEffect } from 'react'
import { LuPlus } from "react-icons/lu";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Select, MenuItem, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllBooks } from '../State/Book/Action';
import { addTransactionRequest, getAllTransactionRequest } from '../State/TransactionRequest/Action';
import EditTransactionRequest from '../components/EditTransactionRequest';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const AddExportRequestModal = ({ isOpen, onClose, onSuccess }) => {
    // const books = useSelector((state) => state.book.books.data || []);
    const allBooks = useSelector((state) => state.book.books.data || []);
    const books = allBooks.filter((book) => book.status !== 'INACTIVE');

    const dispatch = useDispatch();
    const staff = localStorage.getItem("staffId")

    const [data, setData] = useState({
        createBy: '',
        phoneNumber: '',
        position: '',
        department: '',
        reason: '',
        type: 'Xuất',
        transactionRequestItems: [],
        staffId: staff,
        totalValue: 0,

    })

    const transactionRequests = useSelector((state) => state.transactionRequest.transactionRequests.data || []);

    const handleSave = async (event) => {
        event.preventDefault();
        dispatch(addTransactionRequest(data));
        dispatch(getAllTransactionRequest("Xuất"))
        onSuccess();
        onClose()
    };


    useEffect(() => {
        dispatch(getAllBooks());
        dispatch(getAllTransactionRequest("Xuất"))
    }, [dispatch]);


    const [rows, setRows] = useState([{ id: 1, bookId: '', quantity: '', price: '', note: '' }]);

    const handleAddRow = () => {
        const newRow = { id: rows.length + 1, bookId: '', quantity: '', price: '', note: '' };
        setRows([...rows, newRow]);
        setData((prevData) => ({
            ...prevData,
            transactionRequestItems: [...prevData.transactionRequestItems, newRow],
        }));
    };

    const handleRowChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);

        const totalValue = updatedRows.reduce((acc, row) => {
            const quantity = parseFloat(row.quantity) || 0;
            const price = parseFloat(row.price) || 0;
            return acc + quantity * price;
        }, 0);

        setData((prevData) => ({
            ...prevData,
            transactionRequestItems: updatedRows,
            totalValue: totalValue
        }));
    };

    const handleDeleteRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    const handleFormChange = (field, value) => {
        setData({ ...data, [field]: value });
    };

    console.log("Phiếu yêu cầu xuất ", data)

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
                                    <p className='italic text-center'>Tp. Hồ Chí Minh, ngày...tháng...năm 2024</p>
                                </div>
                            </div>
                            <div className='text-center mt-10'>
                                <h2 className='text-xl font-bold'>PHIẾU ĐỀ NGHỊ XUẤT HÀNG</h2>
                            </div>
                            <div className="space-y-4 mr-5 mt-5">
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
                                    <select
                                        value={data.position}
                                        onChange={(e) => handleFormChange('position', e.target.value)}
                                        className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>Chọn chức danh</option>
                                        <option value="Thủ Kho">Thủ kho</option>
                                        <option value="Nhân viên phòng kinh doanh">Nhân viên phòng kinh doanh</option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <p className="w-1/5">Bộ phận:</p>
                                    <select
                                        value={data.department}
                                        onChange={(e) => handleFormChange('department', e.target.value)}
                                        className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>Chọn bộ phận</option>
                                        <option value="Kho">Kho</option>
                                        <option value="Phòng kinh doanh">Phòng kinh doanh</option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <p className="w-1/5">Nội dung đề xuất:</p>
                                    <input
                                        type="text"
                                        value={data.proposalContent}
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
                                                    value={row.bookName}
                                                    onChange={(e) => handleRowChange(index, 'bookId', e.target.value)}
                                                    displayEmpty
                                                    fullWidth
                                                    className="w-full border rounded py-2 h-10"
                                                >
                                                    <MenuItem value="" disabled>Chọn sách</MenuItem>
                                                    {books.map((book, i) => (
                                                        <MenuItem key={i} value={book.bookId}>{book.bookName}</MenuItem>
                                                    ))}
                                                </Select>
                                            </td>
                                            <td className="px-6 py-4 border border-gray-300">Quyển</td>
                                            <td className="px-6 py-4 border border-gray-300">
                                                <input
                                                    type="number"
                                                    value={row.quantity}
                                                    onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
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

                            <div className="flex justify-center items-center mb-5">
                                <IconButton onClick={handleAddRow} color="primary">
                                    <AddIcon />
                                </IconButton>
                            </div>

                            <div className="mb-4">
                                <p className="font-bold">Tổng tiền: {data.totalValue.toLocaleString()} VND</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
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
                                Đóng
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Dialog>
    );
};

const ExportRequest = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const transactionRequests = useSelector((state) => state.transactionRequest.transactionRequests.data || []);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTransactionRequest, setSelectedTransactionRequest] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const role = localStorage.getItem("role")
    const dispatch = useDispatch();
    const type = "Xuất"


    const handleEditButtonClick = (request) => {
        setSelectedTransactionRequest(request);
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        dispatch(getAllTransactionRequest(type));
    }, [dispatch]);

    const filteredTransactionsRequest = transactionRequests.filter(transactionRequest => {
        const transactionRequestId = String(transactionRequest?.transactionRequestId || '').toLowerCase();
        const transactionDate = new Date(transactionRequest.createAt);
        const createBy = transactionRequest.createBy.toLowerCase() || '';
        const status = transactionRequest.status.toLowerCase() || '';
        const updatedBy = transactionRequest?.staff.staffName.toLowerCase() || '';

        return (
            (!startDate || transactionDate >= startDate) &&
            (!endDate || transactionDate <= endDate) &&
            (!searchTerm ||
                createBy.includes(searchTerm.toLowerCase()) ||
                status.includes(searchTerm.toLowerCase()) ||
                transactionRequestId.includes(searchTerm.toLowerCase()) ||
                updatedBy.includes(searchTerm.toLowerCase())

            )
        );
    });

    const paginatedTransactions = filteredTransactionsRequest.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const formatDate = (dateString) => {
        if (!dateString || isNaN(new Date(dateString))) return 'N/A';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
    console.log("Phiếu yêu cầu xuất ", transactionRequests)

    return (
        <div>
            <div className='bg-white m-3'>
                <div className='font-bold text-3xl p-3 ml-5'>Quản lý phiếu đề nghị xuất</div>

                <div className="mr-5 p-5 flex justify-between items-center" style={{ float: 'right', width: '100%' }}>
                    <div className="flex items-center pl-5">
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none z-10">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                    </svg>
                                </div>

                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    placeholderText="Chọn ngày bắt đầu"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>

                            <span className="mx-4 text-gray-500">đến</span>

                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none z-10">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                    </svg>
                                </div>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    placeholderText="Chọn ngày kết thúc"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />

                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="table-search-users"
                                className="block pt-2.5 pb-2.5 items-center ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Tìm kiếm phiếu yêu cầu xuất"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {role === "Salesperson" && (
                            <div className="ml-2">
                                <button className="bg-indigo-600 text-white p-2 rounded-md flex items-center" onClick={() => setIsAddModalOpen(true)}>
                                    <LuPlus />
                                    <p className="pl-1">Thêm</p>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div>

                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    STT
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Số phiếu
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tổng tiền
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Trạng thái
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ngày tạo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Người tạo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Người duyệt
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Quản lý
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTransactions.map((request, index) => (
                                <tr
                                    key={request.id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {(currentPage - 1) * pageSize + index + 1}
                                    </th>
                                    <td className="px-6 py-4">
                                        {request.transactionRequestCode}
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatCurrency(request.totalValue)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {request.status}
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatDate(request.createAt)}

                                    </td>
                                    <td className="px-6 py-4">
                                        {request.createBy}
                                    </td>
                                    <td className="px-6 py-4">
                                        {request.staffUpdate?.staffName || ''}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className='flex'>
                                            <div className='mr-1'>
                                                <button className="flex p-1 bg-yellow-500 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white" onClick={() => handleEditButtonClick(request)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                            </div>

                                        </div>
                                    </td>
                                </tr>
                            ))}


                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center fixed bottom-0 left-0 w-full bg-white shadow-md">
                    <Stack spacing={2}>
                        <Pagination
                            count={Math.ceil(filteredTransactionsRequest.length / pageSize)}
                            page={currentPage}
                            onChange={handlePageChange}
                            shape="rounded"
                        />
                    </Stack>
                </div>
            </div>
            <AddExportRequestModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false)
                    dispatch(getAllTransactionRequest("Xuất"));

                }}
                onSuccess={() => dispatch(getAllTransactionRequest(type))}
            />
            <EditTransactionRequest
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    dispatch(getAllTransactionRequest(type))
                }}
                transactionRequest={selectedTransactionRequest}
                onSuccess={() => dispatch(getAllTransactionRequest(type))}
            />
        </div>
    )
}


export default ExportRequest