import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ fontSize: '72px', color: '#FF6B6B' }}>404</h1>
            <h2 style={{ fontSize: '24px', color: '#333' }}>Trang không tồn tại</h2>
            <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
            <Link to="/" style={{ color: '#3498DB', textDecoration: 'underline' }}>
                Quay lại trang chủ
            </Link>
        </div>
    );
};

export default NotFound;
