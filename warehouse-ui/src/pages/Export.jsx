import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addTransaction, getAllTransaction } from '../State/Transaction/Action';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Dialog, Select, MenuItem, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllBooks } from '../State/Book/Action';
import EditTransaction from '../components/EditTransaction';
import CommonUtils from '../utils/CommonUtils';
import { LuPlus, LuUpload, LuDownload } from "react-icons/lu";
import { Snackbar, Alert } from '@mui/material';
import { getAllSupplier } from '../State/Supplier/Action';
import { getAllTransactionRequest } from '../State/TransactionRequest/Action';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';




const AddExportModal = ({ isOpen, onClose, onSuccess }) => {
  const books = useSelector((state) => state.book.books.data || []);
  const dispatch = useDispatch();
  const transactionRequests = useSelector((state) => state.transactionRequest.transactionRequests.data || []);
  const staff = localStorage.getItem("staffId")
  const [errors, setErrors] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedTransactionRequest, setSelectedTransactionRequest] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [rows, setRows] = useState([{ id: 1, bookId: 0, requestQuantity: '', actualQuantity: '', price: '', note: '' }]);
  const errorMessage = useSelector((state) => state.transaction.error || null);


  const [data, setData] = useState({
    businessPartner: '',
    address: '',
    phone_number: '',
    type: '',
    transactionCode: '',
    transactionRequestId: '',
    transactionItems: [],
    staffId: staff,
    type: "Xuất",
    totalValue: 0,

  })

  const handleSave = async (event) => {
    event.preventDefault();
    if (validateFields()) {
      try {
        await dispatch(addTransaction(data));
        if (errorMessage != null) {
          setSnackbar({ open: true, message: 'Tạo phiếu xuât thành công!', severity: 'success' });
          onClose()

        }
        // onSuccess()

      } catch (error) {
        setSnackbar({ open: true, message: 'Tạo phiếu xuất thất bại!', severity: 'error' });
      }
    }

  };

  useEffect(() => {
    dispatch(getAllBooks());
    dispatch(getAllTransactionRequest("Xuất"))
  }, [dispatch]);


  const validateFields = () => {
    const newErrors = {};
    if (!data.transactionRequestId) newErrors.transactionRequestId = "Không được bỏ trống phiếu yêu cầu xuất";
    if (!data.businessPartner) newErrors.businessPartner = "Không được bỏ trống tên khách hàng";
    if (!data.address) newErrors.address = "Không được bỏ trống địa chỉ";

    rows.forEach((item, index) => {
      if (item.bookId === '' || item.bookId === null || item.bookId === 0) {
        newErrors[`bookId-${index}`] = "Không được bỏ trống tên sách";
      }
      if (item.actualQuantity === '' || item.actualQuantity === null || item.actualQuantity <= 0) {
        newErrors[`actualQuantity-${index}`] = "Không được bỏ trống số lượng";
      }
      if (item.actualQuantity > 999999) {
        newErrors[`actualQuantity-${index}`] = "Số lượng vượt quá giới hạn (999,999)";
      }
      if (item.note && item.note.length > 500) {
        console.log("Độ dài note ", item.note.length)
        newErrors[`note-${index}`] = "Số lượng ký tự giới hạn là 500 ký tự";
      }
      if (!item.price || item.price <= 0) {
        newErrors[`price-${index}`] = "Không được bỏ trống đơn giá";
      } else if (item.price > 999999) {
        newErrors[`price-${index}`] = "Đơn giá vượt quá giới hạn (999,999)";
      }
    });

    setErrors(newErrors);
    console.error("lỗi la ", newErrors)
    return Object.keys(newErrors).length === 0;
  };

  const handleAddRow = () => {
    const newRow = { id: rows.length + 1, bookId: 0, requestQuantity: '', actualQuantity: '', price: '', note: '' };
    setRows([...rows, newRow]);
    setData((prevData) => ({
      ...prevData,
      transactionItems: [...prevData.transactionItems, newRow],
    }));
  };

  const listRequest = transactionRequests.filter(
    (request) => request.status === 'Đã duyệt' && request.type.typeId === 2
  );

  console.log("error", errorMessage)


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

    const totalValue = updatedRows.reduce((acc, row) => {
      const requestQuantity = parseFloat(row.requestQuantity) || 0;
      const actualQuantity = parseFloat(row.actualQuantity) || 0;
      const price = parseFloat(row.price) || 0;
      return acc + actualQuantity * price;
    }, 0);

    setData((prevData) => ({
      ...prevData,
      transactionItems: updatedTransactionItems,
      totalValue: totalValue,
    }));
  };;

  const handleDeleteRow = () => {
    let index = selectedRow
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    closeConfirmModal()
  };

  const openConfirmModal = (index) => {
    setSelectedRow(index)
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleFormChange = (field, value) => {
    if (field === "transactionRequestId") {
      const foundRequest = listRequest.find(
        (request) => request.transactionRequestId == value
      );

      setSelectedTransactionRequest(foundRequest);

      if (foundRequest && foundRequest.transactionRequestItems) {
        const newRows = foundRequest.transactionRequestItems.map((item, index) => ({
          id: index + 1,
          bookId: item.book.bookId || 0,
          requestQuantity: item.requestQuantity || 0,
          actualQuantity: '',
          price: item.price || '',
          note: item.note || '',
        }));

        setRows(newRows);
        console.log("Dữ liệu của hàng ", newRows);
      }
    }

    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: null,
      }));
    }

    setData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const checkSpecialChar = (e) => {
    if (!e || !e.target || typeof e.target.value !== 'string') {
      return;
    }

    const value = e.target.value;
    const sanitizedValue = value.replace(/[&!\/\\#,+()$~%.'":*?<>{}0-9]/g, '');
    e.target.value = sanitizedValue;
  };

  const checkSpecialCharForAddress = (e) => {
    if (!e || !e.target || typeof e.target.value !== 'string') {
      return;
    }

    const value = e.target.value;
    const sanitizedValue = value.replace(/[&!\\\#+$~%'":*?<>{}]/g, '');
    e.target.value = sanitizedValue;
  };



  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <div
        id="addTransactionModal"
        tabIndex="-1"
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative w-full max-w-5xl max-h-full">
          <form className="relative bg-white rounded-lg shadow dark:bg-gray-700 font-times-new-roman text-black" onSubmit={handleSave}>
            <div className='px-3 pt-3' id="add-transaction-modal">
              <div className='flex justify-between'>
                <div>
                  <h4>CÔNG TY QUẢN LÝ KHO AN AN</h4>
                  <p>Số 97 Man Thiện, P. Tăng Nhơn Phú A, Tp. Thủ Đức</p>
                </div>
              </div>
              <div className='text-center mt-10'>
                <h2 className='text-xl font-bold mb-5'>PHIẾU XUẤT KHO</h2>
              </div>
              <div className="space-y-4 mr-5 mt-3">
                <div className="flex items-center">
                  <p className="w-1/5">Tên khách hàng:</p>
                  <TextField
                    type="text"
                    value={data.businessPartner}
                    onChange={(e) => {
                      checkSpecialChar(e);
                      const value = e.target.value;
                      handleFormChange('businessPartner', value);

                    }}
                    error={!!errors.businessPartner}
                    helperText={errors.businessPartner}
                    placeholder="Nhập họ và tên khách hàng"
                    id='field-customer-name'
                    className="w-4/5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    size="small" />
                </div>

                <div className="flex items-center">
                  <p className="w-1/5">Địa chỉ:</p>
                  <TextField
                    type="text"
                    value={data.address}
                    onChange={(e) => {
                      checkSpecialCharForAddress(e);
                      const value = e.target.value;
                      handleFormChange('address', value);
                    }}
                    error={!!errors.address}
                    helperText={errors.address}
                    placeholder="Nhập địa chỉ"
                    id="field-address"
                    className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    size="small"
                  />
                </div>

                <div className="flex items-center">
                  <p className="w-1/5">Theo phiếu yêu cầu số:</p>
                  <select
                    id="select-transaction-request"
                    value={data.transactionRequestId}
                    onChange={(e) => handleFormChange('transactionRequestId', e.target.value)}
                    className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>Chọn phiếu yêu cầu</option>
                    {listRequest.map((request) => (
                      <option key={request.transactionRequestId} value={request.transactionRequestId}>
                        {request.transactionRequestCode}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.transactionRequestId && (
                  <p id='error-transaction-request' className="ml-[200px] text-red-500  text-xs">{errors.transactionRequestId}</p>
                )}
              </div>
              <div>
                <table id='table-transaction-item' className="mt-3 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse border border-gray-200">
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
                        SL theo chứng từ
                      </th>
                      <th scope="col" className="px-6 py-3 border border-gray-300">
                        Thực xuất
                      </th>
                      <th scope="col" className="px-6 py-3 border border-gray-300">
                        Đơn giá (VND)
                      </th>
                      <th className="px-6 py-3 border border-gray-300">Ghi chú</th>
                      <th scope="col" className="px-6 py-3 border border-gray-300">
                        Thành tiền
                      </th>
                      <th className="px-6 py-3 border border-gray-300">Xóa dòng</th>

                    </tr>
                  </thead>
                  <tbody>
                    {rows?.map((row, index) => (
                      <tr key={index}
                        index={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4 border border-gray-300">{index + 1}</td>

                        <td className="px-6 py-4 border border-gray-300">
                          {row.bookId ? (
                            <span className="block">{books.find((book) => book.bookId === row.bookId)?.bookName}</span>
                          ) : (
                            <select
                              value={row.bookId || ''}
                              onChange={(e) => handleRowChange(index, 'bookId', e.target.value)}
                              className="w-full border rounded py-2 h-10"
                            >
                              <option value="" disabled>Chọn sách</option>
                              {books.map((book, i) => (
                                <option key={i} value={book.bookId}>
                                  {book.bookName}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>


                        <td className="px-6 py-4 border border-gray-300">Quyển</td>
                        <td className="px-6 py-4 border border-gray-300">
                          <input
                            type="number"
                            value={row?.requestQuantity || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value > 0) {
                                handleRowChange(index, 'requestQuantity', value);
                              }
                            }}
                            id='field-rest-quantity'
                            className="w-full rounded py-2 h-8 border-none"
                            style={{ textAlign: 'center', verticalAlign: 'middle' }}
                          />
                        </td>
                        <td className="px-6 py-4 border border-gray-300">
                          <TextField
                            type="number"
                            value={row.actualQuantity || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (value > 0) {
                                handleRowChange(index, 'actualQuantity', value);
                              } else if (value < 0) {
                                handleRowChange(index, 'actualQuantity', Math.abs(value));
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const pasteValue = e.clipboardData.getData('Text');
                              const sanitizedValue = pasteValue.replace(/[^0-9]/g, '');

                              if (sanitizedValue) {
                                handleRowChange(index, 'actualQuantity', parseInt(sanitizedValue, 10));
                              }
                            }}
                            id="field-actual-quantity"
                            className="w-full rounded py-2 h-8 border-none"
                            style={{ textAlign: 'center', verticalAlign: 'middle' }}
                            size="small"
                            error={!!errors[`actualQuantity-${index}`]}
                            helperText={errors[`actualQuantity-${index}`] || ''}
                          />
                        </td>


                        <td className="px-6 py-4 border border-gray-300">
                          <TextField
                            type="number"
                            size='small'
                            value={row.price || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (value > 0) {
                                handleRowChange(index, 'price', value);
                              } else if (value < 0) {
                                handleRowChange(index, 'price', Math.abs(value));
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const pasteValue = e.clipboardData.getData('Text');
                              const sanitizedValue = pasteValue.replace(/[^0-9]/g, '');

                              if (sanitizedValue) {
                                handleRowChange(index, 'price', parseInt(sanitizedValue, 10));
                              }
                            }}
                            id='field-price'
                            className="w-full rounded py-2 h-8 border-none"
                            error={!!errors[`price-${index}`]}
                            helperText={errors[`price-${index}`] || ''}
                          />
                        </td>
                        <td className="px-6 py-4 border border-gray-300">
                          <TextField
                            type="text"
                            value={row.note || ''}
                            onChange={(e) => handleRowChange(index, 'note', e.target.value)}
                            id='field-note'
                            className="w-full rounded py-2 h-8 border-none"
                            error={!!errors[`note-${index}`]}
                            helperText={errors[`note-${index}`] || ''}
                            size='small'
                          />
                        </td>
                        <td className="px-6 py-4 border border-gray-300">
                          <input
                            type="text"
                            id='field-total-price'
                            value={(row.actualQuantity * row.price) || 0}
                            className="w-full rounded py-2 h-8 border-none"
                            readOnly
                          />
                        </td>
                        <td className="px-6 py-4 border border-gray-300">
                          <IconButton
                            id="icon-delete"
                            onClick={() => openConfirmModal(index)} sx={{ color: 'red' }}>
                            <DeleteIcon />
                          </IconButton>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-center mb-5">
                  <IconButton id='icon-add-row' onClick={handleAddRow} color="primary">
                    <AddIcon />
                  </IconButton>
                </div>

                <div className="mb-4">
                  <p id='txt-total-amount' className="font-bold">Tổng tiền: {data.totalValue.toLocaleString()} VND</p>
                </div>

                {errorMessage && (
                  <div
                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4"
                    role="alert"
                  >
                    <p className="font-bold">Lỗi</p>
                    <p>{errorMessage}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                id='btn-save'
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Lưu
              </button>
              <button
                id="btn-cancel"
                type="button"
                onClick={onClose}
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
              >
                Đóng
              </button>
            </div>
          </form>
        </div>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        {isConfirmModalOpen && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
              <h3 className="text-lg font-semibold mb-4">Xác nhận xóa dòng</h3>
              <p>Bạn có chắc bạn muốn xóa thông tin của sản phẩm này?</p>
              <div className="mt-6 flex justify-end">
                <button
                  id='btn-cancel-confirm'
                  onClick={closeConfirmModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800 mr-2"
                >
                  Hủy
                </button>
                <button
                  id='btn-confirm'
                  onClick={handleDeleteRow}
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
  )
};


const Export = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const type = 'Xuất';
  const role = localStorage.getItem("role")


  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleEditButtonClick = (request) => {
    setSelectedTransaction(request);
    setIsEditModalOpen(true);
  };

  const transactions = useSelector((state) => state.transaction.transactions.data || []);

  useEffect(() => {
    dispatch(getAllTransaction(type));
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString))) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.createAt);
    const transactionId = transaction.transactionId?.toString() || '';
    const billCode = transaction.bill?.billCode?.toLowerCase() || '';
    const supplierName = transaction?.businessPartner.toLowerCase() || '';
    const createBy = transaction.staff.staffName.toLowerCase() || '';
    const transactionRequestId = transaction.transactionRequest?.transactionRequestId.toString() || '';

    return (
      (!startDate || transactionDate >= startDate) &&
      (!endDate || transactionDate <= endDate) &&
      (!searchTerm ||
        transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        billCode.includes(searchTerm.toLowerCase()) ||
        supplierName.includes(searchTerm.toLowerCase()) ||
        createBy.includes(searchTerm.toLowerCase()) ||
        transactionRequestId.includes(searchTerm.toLowerCase())
      )
    );
  });

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <div className='bg-white m-3'>
        <div className='font-bold text-3xl p-3 ml-5'>Quản lý phiếu xuất</div>

        <div className="mr-5 p-5 flex justify-between items-center" style={{ float: 'right', width: '100%' }}>
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
                placeholder="Tìm kiếm phiếu xuất"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {role === 'Warehousekeeper' && (
              <div className="ml-2">
                <button
                  className="bg-indigo-600 text-white p-2 rounded-md flex items-center"
                  onClick={() => setIsAddModalOpen(true)}
                >
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
                  Phiếu yêu cầu xuất
                </th>
                <th scope="col" className="px-6 py-3">
                  Nhà cung cấp
                </th>
                <th scope="col" className="px-6 py-3">
                  Ngày tạo
                </th>
                <th scope="col" className="px-6 py-3">
                  Người tạo
                </th>
                <th scope="col" className="px-6 py-3">
                  Quản lý
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions?.map((transaction, index) => (
                <tr key={transaction.id} className="bg-white border-b">
                  <td className="px-6 py-4">{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="px-6 py-4">{transaction.transactionCode}</td>
                  <td className="px-6 py-4">{transaction.transactionRequest?.transactionRequestCode}</td>
                  <td className="px-6 py-4">{transaction.businessPartner}</td>
                  <td className="px-6 py-4">{formatDate(transaction.createAt)}</td>
                  <td className="px-6 py-4">{transaction?.staff?.staffName}</td>

                  <td className="px-6 py-4">
                    <td className="px-6 py-4">
                      <div className='flex'>
                        <div className='mr-1'>
                          <button className="flex p-1 bg-yellow-500 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white" onClick={() => handleEditButtonClick(transaction)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>

                      </div>
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='flex justify-center fixed bottom-0 left-0 w-full bg-white shadow-md'>
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(filteredTransactions.length / pageSize)}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
          />
        </Stack>
      </div>
      <AddExportModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          dispatch(getAllTransaction(type));
        }}
        onSuccess={() => dispatch(getAllTransaction())}

      />
      <EditTransaction isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        transaction={selectedTransaction}
        onSuccess={() => dispatch(getAllTransaction())}
      />

    </div>
  )
}

export default Export