  import { useEffect, useState } from 'react';
  import { LuPlus } from "react-icons/lu";
  import AddBook from '../components/AddBook';
  import EditBook from '../components/EditBook';
  import { getAllBooks, updateBook } from '../State/Book/Action';
  import { useDispatch, useSelector } from 'react-redux';

  const Books = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [statusToUpdate, setStatusToUpdate] = useState('');

    const { books } = useSelector((state) => state.book);
    const dispatch = useDispatch();

    const [bookData, setBookData] = useState({
      status: '',
      categoryId: '',
      publisherId: '',
      authorId: []

    });

    useEffect(() => {
      dispatch(getAllBooks());
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

    const openConfirmModal = (book, currentStatus) => {
    
      setSelectedBook(book.bookId);
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const authorIds = book.authors ? book.authors.map((author) => author.authorId) : [];
    
      const updatedBookData = {
        ...bookData,
        status: newStatus,
        categoryId: book.category.categoryId,
        publisherId: book.publisher.publisherId,
        authorId: authorIds,
      };
    
      setBookData(updatedBookData);
    
      dispatch(updateBook(book.bookId, updatedBookData));
    
      setIsConfirmModalOpen(true);
  
    };
    

    const closeConfirmModal = () => {
      setIsConfirmModalOpen(false);
      setSelectedBook(null);
    };

    const handleChangeStatus = () => {
      if (selectedBook) {
        dispatch(updateBook(selectedBook, statusToUpdate));
        closeConfirmModal();
      }
    };

    return (
      <div className="relative m-3 overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900">
          <div>
            <button
              id="dropdownActionButton"
              className="inline-flex items-center ml-5 text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button"
            >
              Thể loại
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center mr-5">
            <label htmlFor="table-search" className="sr-only">Search</label>
            <div className="relative">
              <input
                type="text"
                id="table-search-users"
                className="block pt-2 pb-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for books"
              />
            </div>
            <div className="ml-2">
              <button className="bg-indigo-600 text-white p-2 rounded-md flex items-center" onClick={openAddModal}>
                <LuPlus />
                <p className="pl-1">Add book</p>
              </button>
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
              <th scope="col" className="px-6 py-3">Action</th>
              <th scope="col" className="px-6 py-3">Thay đổi trạng thái</th>


            </tr>
          </thead>
          <tbody>
            {books.data && books.data.length > 0 ? (
              books.data.map((book, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                    <img className="w-10 h-10 rounded-full" src={book.image} alt={book.title} />
                  </th>
                  <td className="px-6 py-4">{book.bookName}</td>
                  <td className="px-6 py-4">{book.price} VND</td>
                  <td className="px-6 py-4">{book.quantity}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full ${book.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'} me-2`}></div>
                      {book.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => openEditModal(book)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit book
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => openConfirmModal(book, book.status)}
                      className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline ml-4"
                    >
                      Change Status
                    </button>
                  </td>
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

        {isModalOpen && <AddBook closeModal={closeModal} />}
        {isEditModalOpen && <EditBook bookId={selectedBook} closeEditModal={closeEditModal} />}

        {isConfirmModalOpen && (
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
        )}
      </div>
    );
  };

  export default Books;
