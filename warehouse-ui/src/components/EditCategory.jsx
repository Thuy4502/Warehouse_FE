import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateCategory } from '../State/Category/Action';

const EditCategory = ({ isOpen, onClose, category}) => {
    const dispatch = useDispatch();
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');
    const staffId = localStorage.getItem("staffId")

    useEffect(() => {
        if (category) {
            setCategoryName(category.categoryName);
            setDescription(category.description);
        }
    }, [category]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedCategory = {
            ...category,
            categoryName,
            description,
            staffId: staffId,
        };
    
        console.log("Thông tin category trước khi gửi:", updatedCategory);
    
        try {
            const result = await dispatch(updateCategory(category.categoryId, updatedCategory));
    
            if (result) {
                console.log("Thông tin category được cập nhật thành công:", result);
                onClose();
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin category:", error);
        }
    };
    

   


    return (
        <div>
            <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
                <div
                    id="editCategoryModal"
                    tabIndex="-1"
                    aria-hidden="true"
                    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                    <div className="relative w-full max-w-2xl max-h-full">
                        <form className="relative bg-white rounded-lg shadow dark:bg-gray-700" onSubmit={handleSubmit}>
                            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Thay đổi thông tin thể loại sách</h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={onClose}
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
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-6">
                                        <label htmlFor="category-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên thể loại sách</label>
                                        <input
                                            type="text"
                                            name="category-name"
                                            id="category-name"
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Tên thể loại"
                                            value={categoryName}
                                            onChange={(e) => setCategoryName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-6">
                                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mô tả</label>
                                        <textarea
                                            name="description"
                                            id="description"
                                            rows="3"
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Mô tả về thể loại"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        />
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
        </div>
    );
};

export default EditCategory;
