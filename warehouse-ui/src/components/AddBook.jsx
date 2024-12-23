import { useState, useEffect } from 'react';

import { getAllCategories } from '../State/Category/Action';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAuthors } from '../State/Author/Action';
import { getAllPublisher } from '../State/Publisher/Action';
import { Checkbox, FormControl, MenuItem, Select, Snackbar, Alert } from '@mui/material';
import { uploadImageToFirebase } from '../config/FirebaseConfig';
import { addBook, getAllBooks } from '../State/Book/Action';
import UploadExcelFile from './UploadExcelFile';

const AddBook = ({ closeModal, onSuccess}) => {
    const defaultImage = 'https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg';
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(defaultImage);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const dispatch = useDispatch();

    const CATEGORYS = useSelector((state) => state.category.categories?.data || []);
    const AUTHORS = useSelector((state) => state.author.authors?.data || []);
    const PUBLISHERS = useSelector((state) => state.publisher.publishers?.data || []);


    useEffect(() => {
        dispatch(getAllCategories());
        dispatch(getAllAuthors());
        dispatch(getAllPublisher())
    }, [dispatch]);


    const LANGUAGES = [
        { languageId: 1, languageName: "Việt Nam" },
        { languageId: 2, languageName: "English" },
    ]


    const [bookData, setBookData] = useState({
        bookName: '',
        title: '',
        price: '',
        isbn: '',
        quantity: '',
        publicationYear: '',
        image: defaultImage,
        authorIds: [],
        categoryIds: [],
        language: '',
        publisherId: '',
        edition: '',
        numberOfPage: ''
    });

    const handleCategoryChange = (event) => {
        const { value } = event.target;
        setBookData((prevState) => ({
            ...prevState,
            categoryIds: value,
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBookData((prevData) => ({ ...prevData, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };


    const handleAuthorChange = (event) => {
        const value = event.target.value;
        setBookData((prevData) => ({ ...prevData, authorIds: value }));
    };

    const handlePublisherChange = (event) => {
        setBookData((prevData) => ({ ...prevData, publisherId: event.target.value }));
    };

    const handleLanguageChange = (event) => {
        setBookData((prevData) => ({ ...prevData, language: event.target.value }));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBookData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage(null);
        setError(null);

        try {
            let imageUrl = '';
            console.log("Selected File", selectedFile);

            if (selectedFile) {
                imageUrl = await uploadImageToFirebase(selectedFile);
                console.log("Uploaded image URL:", imageUrl);
                bookData.image = imageUrl;
            } else {
                console.log("No selected file for upload.");
            }

            await dispatch(addBook(bookData));
            setSuccessMessage("Sách đã được thêm thành công!");
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            onSuccess();
            closeModal();

        } catch (error) {
            console.error("Error creating book:", error);
            setError('Error creating book. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };
    
    const closeModalUpload = () => {
        setIsUploadModalOpen(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };


    console.log("Thông tin sách ", bookData)



    return (
        <div>
            <div
                id="addBookModal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
                <div className="relative w-full max-w-2xl max-h-full">
                    <form className="relative bg-white rounded-lg shadow dark:bg-gray-700" onSubmit={handleSubmit}>
                        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Thêm sách</h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={closeModal}
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
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6 bo">

                            <div className="grid grid-cols-6 gap-6">
                                <div className='col-span-12 flex justify-center sm:col-span-6'>
                                    <img
                                        src={bookData.image}
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
                                            name="authorId"
                                            value={bookData.authorIds}
                                            onChange={handleAuthorChange}
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
                                                    .join(', ')
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
                                            onChange={handlePublisherChange}
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
                                        Thể loại sách
                                    </label>
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <Select
                                            name="categoryId"
                                            value={bookData.categoryIds}
                                            onChange={handleCategoryChange}
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
                                                    <Checkbox checked={bookData.categoryIds.indexOf(category.categoryId) > -1} />
                                                    {category.categoryName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="languageId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Ngôn ngữ
                                    </label>
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <Select
                                            name="languageId"
                                            value={bookData.language}
                                            onChange={handleLanguageChange}
                                            sx={{
                                                fontSize: '0.875rem',
                                                padding: '10px 14px',
                                                height: '42.5px',
                                                borderRadius: '0.5rem',
                                                backgroundColor: 'rgb(249 250 251)',
                                                border: '1px solid rgb(209 213 219)',
                                            }}
                                        >
                                            {LANGUAGES.map((language) => (
                                                <MenuItem key={language.languageId} value={language.languageName}>
                                                    {language.languageName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
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
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="publicationYear" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Năm xuất bản
                                    </label>
                                    <input
                                        type="number"
                                        name="publicationYear"
                                        id="publicationYear"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bookData.yearPublished}
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
                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Giá sách
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

                                <div className="col-span-full">
                                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Mô tả
                                    </label>
                                    <textarea
                                        name="title"
                                        id="title"
                                        rows="4"
                                        className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bookData.title}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-600">
                            <button
                                type="button"
                                className="text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm px-4 py-2 mr-2"
                                onClick={closeModal}
                            >
                                Hủy
                            </button>
                            <button type="submit" onClick={handleSubmit} className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800">
                                Thêm
                            </button>
                        </div>
                    </form>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                            {successMessage || error}
                        </Alert>
                    </Snackbar>
                </div>

            </div>

        </div>


    )
}

export default AddBook