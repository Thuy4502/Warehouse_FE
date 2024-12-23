import { useEffect, useState } from 'react';
import { LuPlus, LuUpload, LuDownload, LuSearch } from "react-icons/lu";
import AddBook from '../components/AddBook';
import EditBook from '../components/EditBook';
import { getAllBooks, updateBook } from '../State/Book/Action';
import { useDispatch, useSelector } from 'react-redux';
import UploadExcelFile from '../components/UploadExcelFile';
import CommonUtils from '../utils/CommonUtils';
import { changeStaffStatus, getAllStaff, updateStaff } from '../State/Staff/Action';
import AddStaff from '../components/AddStaff';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const Staff = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const role = localStorage.getItem("role");
  const { staffs } = useSelector((state) => state.staff);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBooks());
    dispatch(getAllStaff());
  }, [dispatch]);

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (staff) => {
    setSelectedStaff(staff.staffId);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedStaff(null);
  };

  const openUploadModel = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModel = () => {
    setIsUploadModalOpen(false);
  };

  const openConfirmModal = (staff) => {
    setSelectedStaff(staff.staffId);
    const newStatus = !staff.isEnable;

    const updatedStaffData = {
      staffId: staff.staffId,
      isEnable: newStatus,
    };

    setStatusToUpdate(newStatus);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedStaff(null);
  };

  const handleChangeStatus = async () => {
    if (selectedStaff) {
      try {
        await dispatch(changeStaffStatus(selectedStaff, { isEnable: statusToUpdate }));
        closeConfirmModal();
        dispatch(getAllStaff());
      } catch (error) {
        console.error("Error updating staff status:", error);
      }
    }
  };

  const handleOnclickExport = async () => {
    if (staffs && staffs.data) {
      await CommonUtils.exportExcel(staffs.data, "Danh sách nhân viên", "StaffList");
    }
  };

  const filteredStaffs = staffs?.data?.filter((staff) => {
    return (
      staff.staffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.phoneNumber?.includes(searchTerm) ||
      staff.email?.includes(searchTerm) ||
      String(staff.isEnable).includes(searchTerm)
    );
  });

  const paginatedStaff = filteredStaffs?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };



  return (
    <div className="relative m-3 overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900">
        <div></div>
        <div className="flex items-center mr-5">
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LuSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </span>
            <input
              type="text"
              id="table-search-users"
              className="block pt-2 pb-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Tìm kiếm nhân viên"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {(role === "Admin") && <div className='ml-2'>
            <button className='rounded-md border p-2 flex items-center bg-green-700 text-white' onClick={openUploadModel}>
              <LuUpload className="mr-2" />Tải lên file excel
            </button>
            <AddStaff open={isUploadModalOpen} onClose={closeUploadModel} />
          </div>}
          <div className=''>
            <button className='rounded-md border ml-2 p-2 flex items-center bg-green-700 text-white' onClick={handleOnclickExport}>
              <LuDownload className="mr-2" />Xuất file excel
            </button>
          </div>
        </div>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">STT</th>
            <th scope="col" className="px-6 py-3">Hình ảnh</th>
            <th scope="col" className="px-6 py-3">Tên tài khoản</th>
            <th scope="col" className="px-6 py-3">Quyền</th>
            <th scope="col" className="px-6 py-3">Họ và tên</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Số điện thoại</th>
            <th scope="col" className="px-6 py-3">Trạng thái</th>
            {(role === "Admin") && <th scope="col" className="px-6 py-3">Thay đổi trạng thái</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedStaff?.length > 0 ? (
            paginatedStaff?.map((staff, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <img className="w-10 h-10 rounded-full" src={staff.img} alt="Staff" />
                </th>
                <td className="px-6 py-4">{staff.account?.username}</td>
                <td className="px-6 py-4">{staff.account?.role.roleName}</td>
                <td className="px-6 py-4">{staff?.staffName}</td>
                <td className="px-6 py-4">{staff?.email}</td>
                <td className="px-6 py-4">{staff?.phoneNumber}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center">
                    <div className={`h-2.5 w-2.5 rounded-full ${staff?.isEnable ? 'bg-green-500' : 'bg-red-500'} me-2`}></div>
                    {staff?.isEnable ? 'true' : 'false'}
                  </div>
                </td>
                {(role === "Admin") && <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => openConfirmModal(staff)}
                    className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline ml-4 border rounded-md border-yellow-600 p-2"
                  >
                    Thay đổi
                  </button>
                </td>}

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="px-6 py-4 text-center">
                Không có nhân viên nào để hiển thị 
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && <AddBook closeModal={closeModal} />}
      {isEditModalOpen && <EditBook bookId={selectedStaff} closeEditModal={closeEditModal} />}

      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Xác nhận thay đổi trạng thái nhân viên</h3>
            <p>Bạn có chắc bạn muốn thay đổi thông tin của nhân viên này?</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800 mr-2"
              >
                Hủy
              </button>
              <button
                onClick={handleChangeStatus}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
              >
                Đồng ý
              </button>
            </div>
          </div>
          <div className='flex justify-center fixed bottom-0 left-0 w-full bg-white shadow-md'>

          </div>
        </div>
      )}
      <div className='flex justify-center fixed bottom-0 left-0 w-full bg-white shadow-md'>
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(filteredStaffs?.length / pageSize)}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
          />
        </Stack>
      </div>
    </div>
  );

};

export default Staff;
