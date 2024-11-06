import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ExcelJS from 'exceljs';
import { Modal, Button } from '@mui/material';
import { addBook, addBookByExcel } from '../State/Book/Action';
import { uploadImageToFirebaseExcel } from '../config/FirebaseConfig';

const UploadExcelFile = ({ open, onClose }) => {
    const [excelData, setExcelData] = useState(null);
    const [typeError, setTypeError] = useState(null);
    const dispatch = useDispatch();

    const handleExcelFile = async (file) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file);
        const worksheet = workbook.getWorksheet(1);
        const bookDataArray = [];
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
                const imageUrl = await uploadImageToFirebaseExcel(imageBuffer, imageExtension);
                orderedImageUrls[image.range.tl.nativeRow] = imageUrl; // Store image URL by row
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber === 1) return;

            const bookData = {
                bookName: row.getCell('A').value,
                image: orderedImageUrls[rowNumber - 1] || null, 
                edition: row.getCell('C').value,
                language: row.getCell('D').value,
                numberOfPage: row.getCell('E').value,
                publicationYear: row.getCell('F').value,
                quantity: row.getCell('G').value,
                title: row.getCell('H').value,
                categoryName: row.getCell('I').value,
                publisherName: row.getCell('J').value,
                authorName: [row.getCell('K').value],
                price: row.getCell('L').value
            };

            if (bookData.bookName && bookData.title && bookData.publicationYear) {
                bookDataArray.push(bookData);
            }
        });

        setExcelData(bookDataArray.slice(0, 10));
        console.log("Data to send:", bookDataArray);
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

    const handleSendExcelData = async () => {
        if (excelData) {
            dispatch(addBookByExcel(excelData));
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
                                <tr className='bg-gray-100'>
                                    {Object.keys(excelData[0]).map((key) => (
                                        <th key={key} className='border border-gray-300 px-4 py-2'>{key}</th>
                                    ))}
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

export default UploadExcelFile;
