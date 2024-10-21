import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Category from '../pages/Category';
import Books from '../pages/Books';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Import from '../pages/Import';
import ImportRequest from '../pages/ImportRequest';
import Export from '../pages/Export';
import ExportRequest from '../pages/ExportRequest';
import ImportReport from '../pages/ImportReport';
import ExportReport from '../pages/ExportReport';
import Report from '../pages/Report';
import Supplier from '../pages/Supplier';
import UserProfileCard from '../pages/UserProfile';
import FirebaseImageUpload from '../components/FirebaseImageUpload';

const AppRoutes = () => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage để kiểm tra trạng thái đăng nhập

  return (
    <div>
      <Routes>
        {/* Nếu người dùng chưa đăng nhập, điều hướng đến trang /login */}
        <Route
          path='/'
          element={token ? <Layout /> : <Navigate to='/login' replace />}
        >
          <Route index element={<Home />} />
          <Route path='books' element={<Books />} />
          <Route path='category' element={<Category />} />
          <Route path='import-slip' element={<Import />} />
          <Route path='import-request' element={<ImportRequest />} />
          <Route path='export' element={<Export />} />
          <Route path='export-request' element={<ExportRequest />} />
          <Route path='import-report' element={<ImportReport />} />
          <Route path='export-report' element={<ExportReport />} />
          <Route path='report' element={<Report />} />
          <Route path='suppliers' element={<Supplier />} />
          <Route path='profile' element={<UserProfileCard />} />
          <Route path='uploadImage' element={<FirebaseImageUpload />} />

        </Route>
        <Route path='login' element={<Login />} />
        {/* Nếu truy cập một đường dẫn không hợp lệ thì cũng điều hướng đến /login */}
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
