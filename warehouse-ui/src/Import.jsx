import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addTransaction, getAllTransaction } from '../State/Transaction/Action';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Select, MenuItem, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllBooks } from '../State/Book/Action';
import EditTransaction from '../components/EditTransaction';
import CommonUtils from '../utils/CommonUtils';
import { LuPlus, LuUpload, LuDownload } from "react-icons/lu";
import { Snackbar, Alert } from '@mui/material';
import { getAllSupplier } from '../State/Supplier/Action';
import { getAllTransactionRequest } from '../State/TransactionRequest/Action';



const AddImportModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.book.books.data || []);
  const suppliers = useSelector((state) => state.supplier.suppliers.data || [])
  const transactionRequests = useSelector((state) => state.transactionRequest.transactionRequests.data || [])
  const staff = localStorage.getItem("staffId")
  const listRequest = transactionRequests.filter(
    (request) => request.status === 'ACCEPTED'
  );


  const [data, setData] = useState({
    businessPartner: '',
    billCode: '',
    address: '',
    phone_number: '',
    type: '',
    transactionCode: '',
    transactionRequestId: listRequest.length > 0 ? listRequest[0].transactionRequestId : '',
    transactionItems: [],
    staffId: staff,
    type: "Nhập",
    deliveryPerson: '',
    totalValue: 0,

  })

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      await dispatch(addTransaction(data));
      setSnackbar({ open: true, message: 'Tạo phiếu nhập thành công!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Tạo phiếu nhập thất bại!', severity: 'error' });
    }
  };


  useEffect(() => {
    dispatch(getAllBooks());
    dispatch(getAllSupplier());
    dispatch(getAllTransactionRequest(data.type))
  }, [dispatch]);

  console.log("Danh sách phiếu yêu cầu nhập ", listRequest)

  

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);

    const totalValue = updatedRows.reduce((acc, row) => {
      const requestQuantity = parseFloat(row.requestQuantity) || 0;
      const actualQuantity = parseFloat(row.actualQuantity) || 0;

      const price = parseFloat(row.price) || 0;
      return acc + actualQuantity * price;
    }, 0);

    setData((prevData) => ({
      ...prevData,
      transactionItems: updatedRows,
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

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const selectedTransactionRequest = transactionRequests.find(
    (request) => request.transactionRequestId === data.transactionRequestId
  );

  const [rows, setRows] = useState(selectedTransactionRequest?.transactionRequestItems);

  const handleAddRow = () => {
    const newRow = { id: rows.length + 1, bookId: 0, requestQuantity: '', actualQuantity: '', price: '', note: '' };
    setRows([...rows, newRow]);
    setData((prevData) => ({
      ...prevData,
      transactionItems: [...prevData.transactionItems, newRow],
    }));
  };

  console.log("Phiếu yêu cầu nhập hàng được chọn nhập gửi đi ", selectedTransactionRequest)

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
                    value={data.createBy}
                    onChange={(e) => handleFormChange('transactionCode', e.target.value)}
                    placeholder="Nhập số PN"
                    className="w-[100px] py-2   "
                  />
                </span>
              </div>
              <div className="space-y-4 mr-5">
                <div className="flex items-center">
                  <p className="w-1/5">Họ và tên người giao:</p>
                  <input
                    type="text"
                    value={data.deliveryPerson}
                    onChange={(e) => handleFormChange('deliveryPerson', e.target.value)}
                    placeholder="Nhập họ và tên người giao"
                    className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-4 mr-5 mt-4">
                <div className="flex items-center">
                  <p className="w-1/5">Nhà cung cấp:</p>
                  <select
                    value={data.businessPartner}
                    onChange={(e) => {
                      handleFormChange('businessPartner', e.target.value);
                    }}
                    className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>Chọn nhà cung cấp</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.supplierId} value={supplier.supplierName}>
                        {supplier.supplierName}
                      </option>
                    ))}
                  </select>
                </div>


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
                  <select
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
                {/* <div className="flex items-center">
                  <p className="w-1/5">Theo phiếu yêu cầu số:</p>
                  <select
                    value={data.transactionRequestId}
                    onChange={(e) => {
                      const selectedRequest = listRequest.find(
                        (request) => request.transactionRequestId === e.target.value
                      );
                      handleFormChange('transactionRequest', selectedRequest);
                    }}
                    className="w-4/5 rounded py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>Chọn phiếu yêu cầu</option>
                    {listRequest.map((request) => (
                      <option key={request.transactionRequestId} value={request.transactionRequestId}>
                        {request.transactionRequestCode}
                      </option>
                    ))}
                  </select>
                </div> */}


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
                          value={row.book.bookName || ''}
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
                          value={row.quantity || ''}
                          onChange={(e) => handleRowChange(index, 'requestQuantity', e.target.value)}
                          className="w-full rounded py-2 h-8 border-none"
                        />
                      </td>
                      <td className="px-6 py-4 border border-gray-300">
                        <input
                          type="number"
                          value={row.actualQuantity || ''}
                          onChange={(e) => handleRowChange(index, 'actualQuantity', e.target.value)}
                          className="w-full rounded py-2 h-8 border-none"
                        />
                      </td>
                      <td className="px-6 py-4 border border-gray-300">
                        <input
                          type="number"
                          value={row.price || ''}
                          onChange={(e) => handleRowChange(index, 'price', e.target.value)}
                          className="w-full rounded py-2 h-8 border-none"
                        />
                      </td>
                      <td className="px-6 py-4 border border-gray-300">
                        <input
                          type="text"
                          value={row.note || ''}
                          onChange={(e) => handleRowChange(index, 'note', e.target.value)}
                          className="w-full rounded py-2 h-8 border-none"
                        />
                      </td>
                      <td className="px-6 py-4 border border-gray-300">
                        <input
                          type="text"
                          value={(row.actualQuantity * row.price) || 0}
                          className="w-full rounded py-2 h-8 border-none"
                          readOnly
                        />
                      </td>
                      <td className="px-6 py-4 border border-gray-300">
                        <IconButton onClick={() => handleDeleteRow(index)} sx={{ color: 'red' }}>
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mb-4">
                <p className="font-bold">Tổng tiền: {data.totalValue.toLocaleString()} VND</p>
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
      </div>
    </Dialog>
  );
};



const Import = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const type = 'Nhập';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleEditButtonClick = (request) => {
    setSelectedTransaction(request);
    setIsEditModalOpen(true);
  };

  const transactions = useSelector((state) => state.transaction.transactions.data || []);
  console.log('Danh sách phiếu nhập ', transactions);


  useEffect(() => {
    dispatch(getAllTransaction(type));
  }, [dispatch]);


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

  return (
    <div>
      <div className='bg-white m-3'>
        <div className='font-bold text-3xl p-3 ml-5'>Quản lý phiếu nhập</div>

        <div className="mr-5 p-5 flex justify-between items-center" style={{ float: 'right', width: '100%' }}>
          <div className="flex items-center pl-5">
            {/* Date Range Picker */}
            <div className="flex items-center">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select date start"
                className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5"
              />
              <span className="mx-4 text-gray-500">to</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select date end"
                className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5"
              />
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              className="block pt-2.5 pb-2.5 text-sm text-gray-900 border rounded-lg w-80 bg-gray-50"
              placeholder="Tìm kiếm phiếu nhập"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-indigo-600 text-white p-2 rounded-md flex items-center ml-2" onClick={() => setIsAddModalOpen(true)}>
              <LuPlus />
              <p className="pl-1">Thêm</p>
            </button>
          </div>
        </div>

        <div>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">STT</th>
                <th scope="col" className="px-6 py-3">Số phiếu</th>
                <th scope="col" className="px-6 py-3">Hóa đơn</th>
                <th scope="col" className="px-6 py-3">Phiếu yêu cầu nhập</th>
                <th scope="col" className="px-6 py-3">Nhà cung cấp</th>
                <th scope="col" className="px-6 py-3">Ngày tạo</th>
                <th scope="col" className="px-6 py-3">Người tạo</th>
                <th scope="col" className="px-6 py-3">Quản lý</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={transaction.id} className="bg-white border-b">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{transaction.transactionId}</td>
                  <td className="px-6 py-4">{transaction?.bill?.billCode || ''}</td>
                  <td className="px-6 py-4">{transaction.transactionRequest?.transactionRequestId}</td>
                  <td className="px-6 py-4">{transaction.bill?.supplier?.supplierName}</td>
                  <td className="px-6 py-4">{transaction.createAt}</td>
                  <td className="px-6 py-4">{transaction.staff?.staffName}</td>
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

                        <div>
                          <button className="flex p-1 bg-red-500 rounded-xl hover:rounded-3xl hover:bg-red-600 transition-all duration-300 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
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
      <AddImportModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditTransaction isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} transaction={selectedTransaction} />
    </div>
  );
};


export default Import;


