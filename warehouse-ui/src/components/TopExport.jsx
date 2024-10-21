import React from 'react'

const TopExport = () => {
    return (
        <div className="bg-white shadow-xl rounded-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5">
                <h2 className="text-xl font-bold tracking-tight text-gray-900">Top 3 đầu sách xuất nhiều nhất tháng</h2>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    {/* Product Item 1 */}
                    <div className="group relative">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg group-hover:opacity-75">
                            <img 
                                src="https://vnn-imgs-f.vgcloud.vn/2018/03/10/08/dac-nhan-tam-co-ban-dich-moi.jpg" 
                                alt="Front of men's Basic Tee in black." 
                                className="h-48 w-48 object-cover object-center mx-auto" // Kích thước ảnh không có viền
                            />
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3 className="text-sm text-gray-700">
                                    <p className='text-lg font-bold'>Đắc nhân tâm</p>
                                    <p>Quantity: 13</p>
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Product Item 2 */}
                    <div className="group relative">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg group-hover:opacity-75">
                            <img 
                                src="https://vnn-imgs-f.vgcloud.vn/2018/03/10/08/dac-nhan-tam-co-ban-dich-moi.jpg" 
                                alt="Front of men's Basic Tee in black." 
                                className="h-48 w-48 object-cover object-center mx-auto" // Kích thước ảnh không có viền
                            />
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3 className="text-sm text-gray-700">
                                    <p className='text-lg font-bold'>Đắc nhân tâm</p>
                                    <p>Quantity: 13</p>
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Product Item 3 */}
                    <div className="group relative">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg group-hover:opacity-75">
                            <img 
                                src="https://vnn-imgs-f.vgcloud.vn/2018/03/10/08/dac-nhan-tam-co-ban-dich-moi.jpg" 
                                alt="Front of men's Basic Tee in black." 
                                className="h-48 w-48 object-cover object-center mx-auto" // Kích thước ảnh không có viền
                            />
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3 className="text-sm text-gray-700">
                                    <p className='text-lg font-bold'>Đắc nhân tâm</p>
                                    <p>Quantity: 13</p>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopExport;
