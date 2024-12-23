import { useEffect, useState } from 'react';
import { LuPlus, LuUpload, LuDownload, LuSearch } from "react-icons/lu";
import AddBook from '../components/AddBook';
import EditBook from '../components/EditBook';
import { getAllBooks, updateBook } from '../State/Book/Action';
import { useDispatch, useSelector } from 'react-redux';
import UploadExcelFile from '../components/UploadExcelFile';
import CommonUtils from '../utils/CommonUtils';
import { getAllCategories } from '../State/Category/Action';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import * as XLSX from 'xlsx';


const Books = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  const userRole = localStorage.getItem("role");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { books } = useSelector((state) => state.book);
  const { categories } = useSelector((state) => state.category);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredBooks = books.data
    ? books.data.filter((book) =>
      book.bookName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory
        ? book.categoryBooks.some((categoryBook) =>
          categoryBook.category.categoryId === Number(selectedCategory)
        )
        : true)
    )
    : [];


  const dispatch = useDispatch();

  const [bookData, setBookData] = useState({
    status: '',
    categoryId: '',
    publisherId: '',
    authorId: []

  });

  useEffect(() => {
    dispatch(getAllBooks());
    dispatch(getAllCategories())
  }, [dispatch]);

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (book) => {
    setSelectedBook(book.bookId);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBook(null);
  };

  const openUploadModel = () => {
    setIsUploadModalOpen(true)
  }

  const closeUploadModel = () => {
    setIsUploadModalOpen(false)
  }

  const openConfirmModal = (book, currentStatus) => {
    setSelectedBook(book.bookId);
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const authorIds = book.authors ? book.authors.map((author) => author.authorId) : [];
    const categoryIds = book.categories ? book.categories.map((category) => category.categoryId) : [];


    const updatedBookData = {
      ...bookData,
      status: newStatus, 
      categoryIds: categoryIds,  
      publisherId: book.publisher ? book.publisher.publisherId : null, 
      authorIds: authorIds, 
    };

    setBookData(updatedBookData);
    setIsConfirmModalOpen(true);
  };

  const handleChangeStatus = () => {
    if (selectedBook && bookData.status) {

      dispatch(updateBook(selectedBook, bookData))
        .then(() => {
          closeConfirmModal();
          dispatch(getAllBooks())
        })
        .catch((error) => {
          console.error("Failed to update book status:", error);
        });
    }
  };


  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedBook(null);
  };



  // let handleOnclickExport = async () => {
  //   console.log("Dữ liệu để xuất ", books.data)
  //   if (books) {
  //     await CommonUtils.exportExcel(books.data, "Danh sách sách", "BookList")
  //   }
  // }

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    dispatch(updateBook(book.bookId, updatedBookData));
  };

  const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

  console.log("Danh sách cách cuốn sách ", books)

  const handleOnclickExport = () => {
    const worksheetData = filteredBooks.map((book, index) => ({
      'STT': index + 1,
      'Tên sách': book.bookName || "N/A",
      'ISBN': book.isbn || "N/A",
      'Ảnh': book.image,
      'Tiêu đề': book.title,
      'Năm xuất bản': book.publicationYear,
      'Tái bản lần thứ': book.edition,
      'Ngôn ngữ': book.language,
      'Số trang': book.numberOfPage,
      'Gía': book.price,
      'Số lượng': book.quantity,
      'Nhà xuất bản': book.publisher?.publisherName || "N/A",
      'Tác giả': book.authors.map(author => author.authorName).join(", ") || "N/A",
      'Thể loại': book.categoryBooks
        .map(categoryBook => categoryBook.category?.categoryName)
        .join(", ") || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách sách");
    XLSX.writeFile(workbook, "Book_List.xlsx");
  };



  return (
    <div className="relative m-3 overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900">
        <div>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 rounded-md p-2 ml-3"
          >
            <option value="">Thể loại</option>
            {categories.data &&
              categories.data.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
          </select>
        </div>
        <div className="flex items-center mr-5">
          <label htmlFor="table-search" className="sr-only">Tìm kiếm</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LuSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </span>
            <input
              type="text"
              id="table-search-users"
              className="block pt-2 pb-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Tìm kiếm sách"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {(userRole == "Admin" || userRole == "Warehousekeeper") && (
            <div className="ml-2">
              <button className="bg-indigo-600 text-white p-2 rounded-md flex items-center" onClick={openAddModal}>
                <LuPlus />
                <p className="pl-1">Thêm</p>
              </button>
            </div>
          )}

          {(userRole == "Warehousekeeper") && (
            <div className='mx-2'>
              <button className='rounded-md border p-2 flex items-center bg-green-700 text-white' onClick={openUploadModel}>
                <LuUpload className="mr-2" />Tải lên file excel
              </button>
              <UploadExcelFile open={isUploadModalOpen} onClose={closeUploadModel} />
            </div>
          )}

          <div className=' ml-2'>
            <button className='rounded-md border p-2 flex items-center bg-green-700 text-white' onClick={() => handleOnclickExport()}><LuDownload className="mr-2" />Xuất file excel</button>
          </div>
        </div>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Hình ảnh</th>
            <th scope="col" className="px-6 py-3">Tên sách</th>
            <th scope="col" className="px-6 py-3">Giá</th>
            <th scope="col" className="px-6 py-3">Số lượng</th>
            <th scope="col" className="px-6 py-3">Trạng thái</th>
            {(userRole == "Warehousekeeper" || userRole == "Admin") && (<th scope="col" className="px-6 py-3">Chi tiết<table></table></th>)}
            {(userRole == "Warehousekeeper") && (
              <th scope="col" className="px-6 py-3">Thay đổi trạng thái</th>
            )}



          </tr>
        </thead>
        <tbody>
          {paginatedBooks.length > 0 ? (
            paginatedBooks.map((book, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <img className="w-10 h-10" src={book.image} alt={book.title} />
                </th>
                <td className="px-6 py-4">{book.bookName}</td>
                <td className="px-6 py-4">{formatCurrency(book.price)}</td>
                <td className="px-6 py-4">{book.quantity}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full ${book.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'} me-2`}></div>
                    {book.status}
                  </div>
                </td>
                {(userRole === "Warehousekeeper" || userRole == "Admin") && (
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => openEditModal(book)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline border p-2 rounded-md border-blue-600"
                    >
                      Chi tiết
                    </button>
                  </td>
                )}
                {(userRole == "Warehousekeeper") && (<td className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => openConfirmModal(book, book.status)}
                  className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline ml-4 border p-2 rounded-md border-yellow-600"
                >
                  Thay đổi
                </button>
              </td>)}
        </tr>
        ))
        ) : (
        <tr>
          <td colSpan="7" className="px-6 py-4 text-center">
            No books available
          </td>
        </tr>
          )}
      </tbody>
    </table>

      { isModalOpen && <AddBook closeModal={closeModal} onSuccess={() => dispatch(getAllBooks())} /> }
  { isEditModalOpen && <EditBook bookId={selectedBook} closeEditModal={closeEditModal} onSuccess={() => dispatch(getAllBooks())} /> }

  {
    isConfirmModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
        <div className="bg-white rounded-lg p-5 shadow-lg">
          <h2 className="text-lg font-semibold">Xác nhận thay đổi trạng thái</h2>
          <p>Bạn có chắc chắn muốn thay đổi trạng thái của cuốn sách này không?</p>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-2"
              onClick={closeConfirmModal}
            >
              Hủy
            </button>
            <button
              className="bg-red-600 text-white rounded px-4 py-2"
              onClick={handleChangeStatus}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    )
  }
  <div className='flex justify-center fixed bottom-0 left-0 w-full bg-white shadow-md'>
    <Stack spacing={2}>
      <Pagination
        count={Math.ceil(filteredBooks.length / pageSize)}
        page={currentPage}
        onChange={handlePageChange}
        shape="rounded"
      />
    </Stack>
  </div>
    </div >
  );
};

export default Books;
