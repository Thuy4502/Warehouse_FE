import { useEffect, useState } from 'react';
import { LuPlus, LuUpload, LuDownload } from "react-icons/lu";
import AddBook from '../components/AddBook';
import EditBook from '../components/EditBook';
import { getAllBooks, updateBook } from '../State/Book/Action';
import { useDispatch, useSelector } from 'react-redux';
import UploadExcelFile from '../components/UploadExcelFile';
import CommonUtils from '../utils/CommonUtils';
import { getAllStaff, updateStaff } from '../State/Staff/Action';
import AddStaff from '../components/AddStaff';

const Staff = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [statusToUpdate, setStatusToUpdate] = useState('');

  const { books } = useSelector((state) => state.book);
  const { staffs } = useSelector((state) => state.staff);

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
    const newStatus = !staff.isEnable; // Toggle the current status

    const updatedStaffData = {
      staffId: staff.staffId, // Ensure staff ID is included
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
        // Sending the updated status to the API
        await dispatch(updateStaff(selectedStaff, { isEnable: statusToUpdate }));
        closeConfirmModal();
        // Optionally, re-fetch staff data to ensure the UI reflects the latest state
        dispatch(getAllStaff());
      } catch (error) {
        console.error("Error updating staff status:", error);
      }
    }
  };

  const handleOnclickExport = async () => {
    if (books && books.data) {
      await CommonUtils.exportExcel(books.data, "Danh sách sách", "BookList");
    }
  };

  return (
    <div className="relative m-3 overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900">
        <div></div>
        <div className="flex items-center mr-5">
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative">
            <input
              type="text"
              id="table-search-users"
              className="block pt-2 pb-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for staffs"
            />
          </div>
          <div className='mx-2'>
            <button className='rounded-md border p-2 flex items-center bg-green-700 text-white' onClick={openUploadModel}> 
              <LuUpload className="mr-2" />Upload excel
            </button>
            <UploadExcelFile open={isUploadModalOpen} onClose={closeUploadModel} />
          </div>
          <div className=''>
            <button className='rounded-md border p-2 flex items-center bg-green-700 text-white' onClick={handleOnclickExport}>
              <LuDownload className="mr-2" />Export excel
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
            <th scope="col" className="px-6 py-3">Thay đổi trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {staffs?.data && staffs.data.length > 0 ? (
            staffs.data.map((staff, index) => (
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
                <td className="px-6 py-4">{staff?.phone_number}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center">
                    <div className={`h-2.5 w-2.5 rounded-full ${staff?.isEnable ? 'bg-green-500' : 'bg-red-500'} me-2`}></div>
                    {staff?.isEnable ? 'true' : 'false'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => openConfirmModal(staff)}
                    className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline ml-4"
                  >
                    Change Status
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="px-6 py-4 text-center">
                No staffs available
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
            <h3 className="text-lg font-semibold mb-4">Confirm Status Change</h3>
            <p>Are you sure you want to change the status of this staff?</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeStatus}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
