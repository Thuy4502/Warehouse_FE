import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getUser } from '../State/Auth/Action'; 
import { useDispatch, useSelector } from 'react-redux';
import { updateStaff } from '../State/Staff/Action';
import { uploadBytes } from 'firebase/storage';
import { uploadStaffImageToFirebase, uploadStaffImageToFirebaseExcel } from '../config/FirebaseConfig';

const ProfileCard = () => {
    const dispatch = useDispatch();
const token = localStorage.getItem("token");
const userInfor = useSelector((state) => state.auth.user);
const [selectedFile, setSelectedFile] = useState(null);
const [previewUrl, setPreviewUrl] = useState(userInfor?.data?.img || 'https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg');

const [formData, setFormData] = useState({
    staffName: '',
    email: '',
    phone_number: '',
    address: '',
    dob: '',
    img: '',
    isEnable: '',
});




const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState('success');
const [loading, setLoading] = useState(true);

useEffect(() => {
    if (token) {
        dispatch(getUser(token))
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }
}, [dispatch, token]);

const formatDateToInput = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date)) {
        return date.toISOString().split('T')[0]; 
    }
    return '';
};

const formatDateToDisplay = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date)) {
        return date.toLocaleDateString('vi-VN'); 
    }
    return '';
};

useEffect(() => {
    if (userInfor) {
        setFormData({
            staffName: userInfor.data?.staffName || '',
            email: userInfor.data?.email || '',
            phone_number: userInfor.data?.phone_number || '',
            address: userInfor.data?.address || '',
            dob: userInfor.data?.dob ? formatDateToInput(userInfor.data.dob) : '',
            img: userInfor.data?.img || '',
            isEnable: userInfor.data?.isEnable || '',

        });
        setPreviewUrl(userInfor.data?.img || 'https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg');
    }
}, [userInfor]);




const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
        ...formData,
        [id]: value
    });
};



const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFile(file); 
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result); 
        };
        reader.readAsDataURL(file);
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        let imageUrl = formData.img;  
        if (selectedFile) {
            imageUrl = await uploadStaffImageToFirebase(selectedFile); // Tải lên Firebase và nhận URL
            setFormData((prevData) => ({
                ...prevData,
                img: imageUrl,  // Lưu URL vào formData
            }));
        }
        await dispatch(updateStaff(userInfor?.data.staffId, { ...formData, img: imageUrl }));
        setSnackbarMessage('Profile updated successfully!');
        setSnackbarSeverity('success');
    } catch (error) {
        console.error("Error updating profile:", error);
        setSnackbarMessage('Failed to update profile. Please try again.');
        setSnackbarSeverity('error');
    } finally {
        setOpenSnackbar(true);
    }
};


const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
};

console.log("Thông tin nhân viên  ", userInfor)
console.log("Dữ liệu gửi đi ", formData)

if (loading) {
    return <div>Loading...</div>;
}
    return (
        <div>
            <div className="w-full px-4 pb-8 mt-8 sm:max-w-xl shadow-md rounded-lg bg-white p-3">
                <h2 className="pl-4 text-2xl font-bold sm:text-xl">Profile</h2>
                <div className="grid max-w-2xl mx-auto mt-8">
                    <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                        <img
                            className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                            src={formData.img}
                            alt="Avatar"
                        />
                        <div className="flex flex-col space-y-5 sm:ml-8">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="upload-button"
                            />
                            <label htmlFor="upload-button" className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200 cursor-pointer">
                                Change picture
                            </label>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="grid max-w-2xl mx-auto mt-8">
                    <div className="items-center mt-2 sm:mt-14 text-[#202142]">
                        <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                            <div className="w-full">
                                <label
                                    htmlFor="staffName"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Full name
                                </label>
                                <input
                                    type="text"
                                    id="staffName"
                                    className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="Your full name"
                                    value={formData.staffName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-2 sm:mb-6">
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                placeholder="your.email@mail.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-2 sm:mb-6">
                            <label
                                htmlFor="phone_number"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Phone number
                            </label>
                            <input
                                type="text"
                                id="phone_number"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                placeholder="Phone number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-2 sm:mb-6">
                            <label
                                htmlFor="address"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                placeholder="Your Address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-2 sm:mb-6">
                            <label
                                htmlFor="dob"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                id="dob"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="border bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ProfileCard;
