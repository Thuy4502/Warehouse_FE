import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ExcelJS from 'exceljs';
import { Modal, Button } from '@mui/material';
import { addStaff } from '../State/Staff/Action';
import { uploadStaffImageToFirebaseExcel } from '../config/FirebaseConfig';


const AddStaff = ({ open, onClose }) => {
    const [excelData, setExcelData] = useState(null);
    const [typeError, setTypeError] = useState(null);
    const dispatch = useDispatch();

    const handleExcelFile = async (file) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(await file.arrayBuffer());
        const worksheet = workbook.getWorksheet(1);
        const staffDataArray = [];
        const images = worksheet.getImages();
        const orderedImageUrls = new Array(worksheet.rowCount).fill(null);

        for (const image of images) {
            const imageData = workbook.model.media[image.imageId];
            const imageExtension = imageData.extension;
            const imageBuffer = imageData.buffer;

            if (!imageBuffer) {
                console.error("No image buffer available for imageId:", image.imageId);
                continue;
            }

            try {
                const imageUrl = await uploadStaffImageToFirebaseExcel(imageBuffer, imageExtension);
                orderedImageUrls[image.range.tl.nativeRow] = imageUrl;
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber === 1) return;

            const emailCell = row.getCell('E').value;
            const email = emailCell && emailCell.hyperlink ? emailCell.text : emailCell;

            const staffData = {
                username: row.getCell('A').value,
                roleName: row.getCell('B').value,
                staffName: row.getCell('C').value,
                phoneNumber: row.getCell('D').value,
                email: email,
                picture: orderedImageUrls[rowNumber - 1] || null,
                address: row.getCell('G').value,
                dob: row.getCell('H').value,

            };

            if (staffData.username && staffData.roleName && staffData.staffName) {
                staffDataArray.push(staffData);
            }
        });

        setExcelData(staffDataArray.slice(0, 10));
        console.log("Data to send:", staffDataArray);
    };

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        const fileTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv'
        ];

        if (selectedFile && fileTypes.includes(selectedFile.type)) {
            setTypeError(null);
            handleExcelFile(selectedFile);
        } else {
            setTypeError("Please select only Excel file types (XLSX, CSV).");
        }
    };

    const handleSendExcelData = () => {
        if (excelData) {
            dispatch(addStaff(excelData));
            onClose();
        } else {
            setTypeError("No data to upload. Please upload an Excel file first.");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                minWidth: '900px',
                maxHeight: '80vh',
                overflowY: 'auto',
                margin: 'auto',
                marginTop: '50px'
            }}>
                <h2 className='font-bold text-2xl'>Upload & View Excel Sheets</h2>
                <hr className='my-5' />
                <input type="file" className='form-control w-full mb-3' onChange={handleFile} required />
                {typeError && (
                    <div className='alert alert-danger' role='alert'>{typeError}</div>
                )}
                <div className='viewer'>
                    {excelData ? (
                        <table className='table-auto border-collapse border border-gray-300 w-full'>
                            <thead>
                                <tr className="bg-gray-100">
                                    {excelData && excelData.length > 0 ? (
                                        Object.keys(excelData[0]).map((key) => (
                                            <th key={key} className="border border-gray-300 px-4 py-2">{key}</th>
                                        ))
                                    ) : (
                                        <th className="border border-gray-300 px-4 py-2">No Data</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {excelData.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((cell, i) => (
                                            <td key={i} className='border border-gray-300 px-4 py-2'>
                                                {typeof cell === 'object' ? JSON.stringify(cell) : cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div>No file is uploaded yet!</div>
                    )}
                </div>
                <div>
                    <Button variant="contained" color="success" onClick={handleSendExcelData} className="mt-3">Tải lên</Button>
                </div>
            </div>
        </Modal>
    );
};

export default AddStaff;
