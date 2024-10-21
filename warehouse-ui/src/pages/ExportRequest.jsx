import { React, useState } from 'react'
import { LuPlus } from "react-icons/lu";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const AddExportRequestModal = ({ isOpen, onClose }) => (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
        <div
            id="editCategoryModal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
            <div className="relative w-full max-w-5xl max-h-full">
                <form className="relative bg-white rounded-lg shadow dark:bg-gray-700 font-times-new-roman text-black">
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
                            <h2 className='text-xl font-bold'>PHIẾU YÊU CẦU XUẤT HÀNG</h2>
                            <p className='italic font-bold'>Ngày...tháng...năm...</p>
                            <p>Số: NK00012</p>
                        </div>

                        <div>
                            <p>Người đề xuất</p>
                            <p>Chức danh:</p>
                            <p>Bộ phận:</p>
                            <p>Nội dung đề xuất:</p>

                        </div>
                        <div>
                            <table className="mt-3 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse border border-gray-200 mb-10">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 border border-gray-300">
                                            STT
                                        </th>
                                        <th scope="col" className="px-6 py-3 border border-gray-300">
                                            Tên sách
                                        </th>
                                        <th scope="col" className="px-6 py-3 border border-gray-300">
                                            Đơn vị tính
                                        </th>
                                        <th scope="col" className="px-6 py-3 border border-gray-300">
                                            Số lượng
                                        </th>
                                        <th scope="col" className="px-6 py-3 border border-gray-300">
                                            Đơn giá (VND)
                                        </th>
                                        <th scope="col" className="px-6 py-3 border border-gray-300">
                                            Ghi chú
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 border border-gray-300">1</td>
                                        <td className="px-6 py-4 border border-gray-300">Tuổi trẻ đáng giá bao nhiêu</td>
                                        <td className="px-6 py-4 border border-gray-300">Quyển</td>
                                        <td className="px-6 py-4 border border-gray-300">100</td>
                                        <td className="px-6 py-4 border border-gray-300">100</td>
                                        <td className="px-6 py-4 border border-gray-300"></td>
                                       

                                    </tr>
                                
                                </tbody>
                            </table>
                           
                            <div className="flex justify-between mb-20">
                                <div>
                                    <p className='font-bold'>Đại diện BGD</p>
                                    <p className='italic text-center'>Ký họ tên</p>
                                </div>
                                <div>
                                    <p className='font-bold'>Kế toán trưởng</p>
                                    <p className='italic text-center'>Ký họ tên</p>
                                </div>
                                <div >
                                    <p className='font-bold'>Thủ kho</p>
                                    <p className='italic text-center'>Ký họ tên</p>
                                </div>
                                <div className=''>
                                    <p className='font-bold'>Người lập phiếu</p>
                                    <p className='italic text-center'>Ký họ tên</p>
                                </div>
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


const ExportRequest = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <div className='bg-white m-3'>
                <div className='font-bold text-3xl p-3 ml-5'>Quản lý phiếu yêu cầu xuất</div>

                <div className="mr-5 p-5 flex justify-between items-center" style={{ float: 'right', width: '100%' }}>
                    {/* Phần tử Date Range Picker nằm ở đầu */}
                    <div className="flex items-center pl-5">
                        <div className="flex items-center">
                            {/* DatePicker for Start Date */}
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
                                    placeholderText="Select date start"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>

                            <span className="mx-4 text-gray-500">to</span>

                            {/* DatePicker for End Date */}
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
                                    placeholderText="Select date end"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />

                            </div>
                        </div>
                    </div>

                    {/* Phần tử Tìm kiếm và Nút thêm nằm ở cuối */}
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
                                placeholder="Tìm kiếm thể loại sách"
                            />
                        </div>
                        <div className="ml-2">
                            <button className="bg-indigo-600 text-white p-2 rounded-md flex items-center" onClick={() => setIsAddModalOpen(true)}>
                                <LuPlus />
                                <p className="pl-1">Thêm</p>
                            </button>
                        </div>
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
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    1
                                </th>
                                <td className="px-6 py-4">
                                    PN01
                                </td>
                                <td className="px-6 py-4">
                                    10.000.000
                                </td>
                                <td className="px-6 py-4">
                                    Chưa duyệt
                                </td>
                                <td className="px-6 py-4">
                                    Ms.Thuy
                                </td>
                                <td className="px-6 py-4">
                                    04/10/2024
                                </td>
                                <td className="px-6 py-4">
                                    Ms. Trang
                                </td>
                                <td className="px-6 py-4">
                                    <div className='flex'>
                                        <div className='mr-1'>
                                            <button className="flex p-1 bg-yellow-500 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div>
                                            <button className="flex p-1 bg-red-500 rounded-xl hover:rounded-3xl hover:bg-red-600 transition-all duration-300 text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>

            </div>
            <AddExportRequestModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    )
}


export default ExportRequest