import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getTopSellingBooks } from '../State/Statistic/Action';

const TopExport = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.statistic.topSellingBooks || []);
    const statisticList = state?.data || []; 

    useEffect(() => {
        dispatch(getTopSellingBooks());
    }, [dispatch]);
    

    return (
        <div className="bg-white rounded-lg h-full shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5">
                <h2 className="text-xl font-bold tracking-tight text-gray-900">Top 3 đầu sách xuất nhiều nhất tháng</h2>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    {statisticList.map((book, index) => (
                        <div key={index} className="group relative">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg group-hover:opacity-75">
                                <img 
                                    src={book.image} 
                                    alt={book.bookName} 
                                    className="h-48 w-48 object-cover object-center mx-auto" 
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700">
                                        <p className="text-lg font-bold">{book.bookName}</p>
                                        <p>Số lượng đã bán: {book.totalSold}</p>
                                        <p>Tồn kho: {book.quantity}</p>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopExport;
