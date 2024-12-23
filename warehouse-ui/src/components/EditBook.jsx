import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../State/Category/Action';
import { getAllAuthors } from '../State/Author/Action';
import { getAllPublisher } from '../State/Publisher/Action';
import { Checkbox, FormControl, MenuItem, Select, Button, CircularProgress } from '@mui/material';
import { uploadImageToFirebase } from '../config/FirebaseConfig';
import { findBookById, getAllBooks, updateBook } from '../State/Book/Action';

const EditBook = ({ closeEditModal, bookId, onSuccess }) => {
    const defaultImage = 'https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg';
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(defaultImage);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);



    const dispatch = useDispatch();

    const CATEGORYS = useSelector((state) => state.category.categories?.data || []);
    const AUTHORS = useSelector((state) => state.author.authors?.data || []);
    const PUBLISHERS = useSelector((state) => state.publisher.publishers?.data || []);
    const book = useSelector((state) => state.book.book?.data || {});

    const [bookData, setBookData] = useState({
        bookId: '',
        bookName: '',
        edition: '',
        image: '',
        language: '',
        numberOfPage: '',
        isbn: '',
        price: '',
        publicationYear: '',
        quantity: '',
        status: '',
        title: '',
        authorIds: [],
        publisherId: '',
        categoryIds: [],
    });

    useEffect(() => {
        dispatch(getAllCategories());
        dispatch(getAllAuthors());
        dispatch(getAllPublisher());
        dispatch(findBookById(bookId));
    }, [dispatch, bookId]);

    useEffect(() => {
        if (book) {
            setBookData((prevData) => ({
                ...prevData,
                ...book,
                image: book.image || defaultImage,
                publisherId: book.publisher?.publisherId || '',
                authorIds: book.authors ? book.authors.map(author => author.authorId) : [],
                categoryIds: book.categoryBooks ? book.categoryBooks.map(cb => cb.category.categoryId) : [],
                language: book.language || '',
                isbn: book.isbn || ''
            }));
            setPreviewUrl(book.image || defaultImage);
        }
    }, [book]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBookData((prevData) => ({ ...prevData, image: reader.result }));
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBookData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleMultiSelectChange = (event) => {
        const { name, value } = event.target; 
        setBookData((prevData) => ({
            ...prevData,
            [name]: value, 
        }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let imageUrl = '';

            if (selectedFile) {
                imageUrl = await uploadImageToFirebase(selectedFile);
                bookData.image = imageUrl;
            }

            await dispatch(updateBook(bookId, bookData))
            onSuccess();
        } catch (error) {
            console.error("Error updating book:", error);
            setError('Error updating book. Please try again.');
        } finally {
            setLoading(false);
        }
        closeEditModal()
    };

    console.log("Cuốn sách đang được chỉnh sửa: ", book)

    return (
        <div>
            <div
                id="editBookModal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
                <div className="relative w-full max-w-2xl max-h-full">
                    <form className="relative bg-white rounded-lg shadow dark:bg-gray-700" onSubmit={handleSubmit}>
                        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Thay đổi thông tin sách</h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={closeEditModal}
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Đóng</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-6 gap-6">
                                <div className='col-span-12 flex justify-center sm:col-span-6'>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                </div>
                                <div className='col-span-12 flex justify-center sm:col-span-6'>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="bookName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Tên sách
                                    </label>
                                    <input
                                        type="text"
                                        name="bookName"
                                        id="bookName"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bookData.bookName}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="authorId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Tác giả
                                    </label>
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <Select
                                            name="authorIds"
                                            value={bookData.authorIds} // Sử dụng authorIds ở đây
                                            onChange={handleMultiSelectChange}
                                            multiple
                                            sx={{
                                                fontSize: '0.875rem',
                                                padding: '10px 14px',
                                                height: '42.5px',
                                                borderRadius: '0.5rem',
                                                backgroundColor: 'rgb(249 250 251)',
                                                border: '1px solid rgb(209 213 219)',
                                            }}
                                            renderValue={(selected) =>
                                                selected
                                                    .map((id) => AUTHORS.find((author) => author.authorId === id)?.authorName)
                                                    .join(', ') // Hiển thị tên tác giả đã chọn
                                            }
                                        >
                                            {AUTHORS.map((author) => (
                                                <MenuItem key={author.authorId} value={author.authorId}>
                                                    <Checkbox checked={bookData.authorIds.indexOf(author.authorId) > -1} />
                                                    {author.authorName}
                                                </MenuItem>
                                            ))}
                                        </Select>

                                    </FormControl>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="publisherId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Nhà xuất bản
                                    </label>
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <Select
                                            name="publisherId"
                                            value={bookData.publisherId}
                                            onChange={handleInputChange}
                                            sx={{
                                                fontSize: '0.875rem',
                                                padding: '10px 14px',
                                                height: '42.5px',
                                                borderRadius: '0.5rem',
                                                backgroundColor: 'rgb(249 250 251)',
                                                border: '1px solid rgb(209 213 219)',
                                            }}
                                        >
                                            {PUBLISHERS.map((publisher) => (
                                                <MenuItem key={publisher.publisherId} value={publisher.publisherId}>
                                                    {publisher.publisherName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="categoryId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Thể loại
                                    </label>
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <Select
                                            name="categoryIds"
                                            value={bookData.categoryIds}
                                            onChange={handleMultiSelectChange}
                                            multiple
                                            sx={{
                                                fontSize: '0.875rem',
                                                padding: '10px 14px',
                                                height: '42.5px',
                                                borderRadius: '0.5rem',
                                                backgroundColor: 'rgb(249 250 251)',
                                                border: '1px solid rgb(209 213 219)',
                                            }}
                                            renderValue={(selected) =>
                                                selected
                                                    .map((id) => CATEGORYS.find((category) => category.categoryId === id)?.categoryName)
                                                    .join(', ')
                                            }
                                        >
                                            {CATEGORYS.map((category) => (
                                                <MenuItem key={category.categoryId} value={category.categoryId}>
                                                    <Checkbox checked={bookData.categoryIds.includes(category.categoryId)} />
                                                    {category.categoryName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="edition" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Ngôn ngữ
                                    </label>
                                    <input
                                        type="text"
                                        name="edition"
                                        id="edition"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bookData.language}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="publicationYear" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        isbn
                                    </label>
                                    <input
                                        type="text"
                                        name="isbn"
                                        id="isbn"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bookData.isbn}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>
                                {/* <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="edition" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Phiên bản
                                    </label>
                                    <input
                                        type="text"
                                        name="edition"
                                        id="edition"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bookData.edition}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div> */}

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="publicationYear" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Năm xuất bản
                                    </label>
                                    <input
                                        type="text"
                                        name="publicationYear"
                                        id="publicationYear"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bookData.publicationYear}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="numberOfPage" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Số trang
                                    </label>
                                    <input
                                        type="number"
                                        name="numberOfPage"
                                        id="numberOfPage"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bookData.numberOfPage}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Số lượng
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        id="quantity"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bookData.quantity}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Giá
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bookData.price}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Trạng thái
                                    </label>
                                    <select
                                        name="status"
                                        id="status"
                                        value={bookData.status}
                                        onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        <option value="ACTIVE">Còn hàng</option>
                                        <option value="INACTIVE">Ngừng cung cấp</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-6 border-t border-gray-200 rounded-b">
                            <button
                                type="button"
                                className="text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm px-4 py-2 mr-2 border border-blue-600"
                                onClick={closeEditModal}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                            >
                                Cập nhật
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditBook;
