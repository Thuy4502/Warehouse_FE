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
import Staff from '../pages/Staff';
import PrivateRoute from '../components/PrivateRoute';
import NotFound from '../pages/NotFound';
import InventoryReport from '../pages/InventoryReport';
import ForgotPassword from '../pages/ForgotPassword';
import Author from '../pages/Author';

const AppRoutes = () => {
  const token = localStorage.getItem('token');
  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={<Layout/>}>
        
          <Route index element={<Home />} />
          <Route path='books' element={<Books />} />
          <Route path='category' element={<Category />} />
          <Route path='authors' element={<Author />} />
          <Route path='import-slip' element={<Import />} />
          <Route path='import-request' element={<ImportRequest />} />
          <Route path='export' element={<Export />} />
          <Route path='export-request' element={<ExportRequest />} />
          <Route path='import-report' element={<ImportReport />} />
          <Route path='export-report' element={<ExportReport />} />
          <Route path='report' element={<Report />} />
          <Route path='suppliers' element={<Supplier />} />
          <Route path='profile' element={<UserProfileCard />} />
          <Route path='inventory-report' element={<InventoryReport/>} />
          <Route path='not-found' element={<NotFound />} />
          <Route path="/admin" element={<PrivateRoute />}>
            <Route path="staffs" element={<Staff />} />
          </Route>



        </Route>
        <Route path='login' element={<Login />} />
        <Route path='forgot-password' element={<ForgotPassword />} />

        <Route path='*' element={<Navigate to='/not-found' replace />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
