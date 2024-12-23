import { React, useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { LuPlus } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../State/Category/Action';
import EditCategory from '../components/EditCategory';
import AddCategory from '../components/AddCategory';

const Category = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const dispatch = useDispatch();
    const role = localStorage.getItem("role");

    const categories = useSelector((state) => state.category.categories.data || []);

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    const handleEditClick = (category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    return (
        <div className='bg-white m-3'>
            <div className="mr-5 p-5 flex" style={{ float: 'right' }}>
                <label htmlFor="table-search" className="sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="table-search-users"
                        className="block pt-2 pb-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            <div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">STT</th>
                            <th scope="col" className="px-6 py-3">Thể loại sách</th>
                            <th scope="col" className="px-6 py-3">Mô tả</th>
                            <th scope="col" className="px-6 py-3">Ngày chỉnh sửa</th>
                            {role !== "Salesperson" && (<th scope="col" className="px-6 py-3">Chỉnh sửa</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">No categories found.</td>
                            </tr>
                        ) : (
                            categories.map((category, index) => (
                                <tr key={category.categoryId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                        {index + 1} 
                                    </th>
                                    <td className="px-6 py-4">{category.categoryName}</td>
                                    <td
                                        className="px-6 py-4 max-w-xs text-ellipsis overflow-hidden whitespace-nowrap"
                                        title={category.description}
                                    >
                                        {category.description}
                                    </td>

                                    <td className="px-6 py-4">
                                        {category.updateAt && !isNaN(new Date(category.updateAt)) ? new Date(category.updateAt).toLocaleDateString() : ''}
                                    </td>
                                    {role !== "Salesperson" && (<td className="px-6 py-4 text-center">
                                        <button onClick={() => handleEditClick(category)} className="font-medium flex justify-center text-blue-600 dark:text-blue-500 hover:underline">Chi tiết</button>
                                    </td>)}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <EditCategory
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                category={selectedCategory}
            />
            <AddCategory
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onCategoryAdded={() => dispatch(getAllCategories())}
            />

        </div>
    );
};

export default Category;
