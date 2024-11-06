import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  addProductRequest,
  getAllCategoriesRequest,
  getAllBrandRequest,
  addProductRequestBatch
} from '../../redux/actions/actions'
import { uploadImageToFirebase,uploadImageToFirebaseExcel } from '../../firebase' // Import the function
import ExcelJS from 'exceljs';

const CreateProduct = () => {
  const dispatch = useDispatch()
  const message = useSelector((state) => state.addProduct)
  const categories = useSelector((state) => state.categories.categories)
  const brands = useSelector((state) => state.brands.brands)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false) // Loading state

  const [formData, setFormData] = useState({
    file: '',
    data: {
      product_name: '',
      status: 'ACTIVE',
      quantity: 0,
      price: 0,
      detail: '',
      band_material: '',
      band_width: '',
      case_diameter: '',
      case_material: '',
      case_thickness: '',
      color: '',
      dial_type: '',
      func: '',
      gender: '',
      machine_movement: '',
      model: '',
      series: '',
      water_resistance: '',
      brand_name: '',
      category_name: '',
      image: ''
    }
  })
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getAllCategoriesRequest())
    dispatch(getAllBrandRequest())
  }, [dispatch])

  const handleChange = (e) => {
    if (e.target.name === 'file') {
      setFormData({ ...formData, file: e.target.files[0] })
    } else {
      setFormData({
        ...formData,
        data: { ...formData.data, [e.target.name]: e.target.value }
      })
    }
  }
  const validate = () => {
    const errors = {}
    const { data, file } = formData

    if (!data.product_name) errors.product_name = 'Vui lòng nhập têm sản phẩm'
    if (!data.price || data.price <= 0) errors.price = 'Giá > 0'
    if (!file) errors.file = 'Vui lòng nhập hình ảnh'
    if (!data.category_name)
      errors.category_name = 'Vui lòng chọn loại sản phẩm'
    if (!data.brand_name) errors.brand_name = 'Vui lòng chọn hãng sản phẩm'

    // Add more validations as needed

    return errors
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true) // Set loading to true when starting submission

    let imageUrl = '' // Giữ URL hình ảnh hiện tại nếu không có hình ảnh mới

    if (formData.file) {
      try {
        // Tải lên hình ảnh mới vào Firebase và lấy URL
        imageUrl = await uploadImageToFirebase(formData.file)
      } catch (error) {
        setLoading(false) // Set loading to false if there's an error
        return
      }
    }

    // Tạo đối tượng mới để gửi đến máy chủ
    const dataToSend = {
      ...formData.data,
      image: imageUrl // Cập nhật với URL hình ảnh mới
    }
    // Gửi yêu cầu để cập nhật sản phẩm
    dispatch(addProductRequest(dataToSend))
  }

  useEffect(() => {
    if (message.code === 201) {
      setFormData({
        file: '',
        data: {
          product_name: '',
          status: '',
          quantity: 0,
          price: 0,
          detail: '',
          band_material: '',
          band_width: '',
          case_diameter: '',
          case_material: '',
          case_thickness: '',
          color: '',
          dial_type: '',
          func: '',
          gender: '',
          machine_movement: '',
          model: '',
          series: '',
          water_resistance: '',
          brand_name: '',
          category_name: ''
        }
      })
      setLoading(false)
      navigate('/manager/products')
    }
  }, [message, navigate])
  
  const handleExcelFile = async (file) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file); // Chờ tải workbook

    const worksheet = workbook.getWorksheet(1); // Lấy worksheet đầu tiên
    const productDataArray = []; // Mảng để lưu trữ dữ liệu sản phẩm

    // Lấy tất cả hình ảnh trong workbook
    const images = worksheet.getImages();
    const imageMap = {}; // Tạo một bản đồ để ánh xạ ID hình ảnh với dữ liệu của nó
    const orderedImageUrls = []; // Mảng để lưu URL hình ảnh theo thứ tự

    // Xử lý tất cả hình ảnh từng cái một
    for (const image of images) {
        const imageData = workbook.model.media[image.imageId];
        const imageExtension = imageData.extension;
        const imageBuffer = imageData.buffer;

        try {
            // Tải hình ảnh lên Firebase (hoặc nơi nào khác bạn muốn)
            const imageUrl = await uploadImageToFirebaseExcel(imageBuffer, imageExtension); // Gọi hàm tải hình ảnh lên
            imageMap[image.imageId] = imageUrl; // Lưu URL vào bản đồ
            orderedImageUrls.push(imageUrl); // Thêm URL vào mảng theo thứ tự
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }

    // Đọc dữ liệu sản phẩm từ worksheet, bắt đầu từ hàng thứ 2
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        // Bỏ qua hàng tiêu đề (hàng 1)
        if (rowNumber === 1) return;

        const productData = {
            brand_name: row.getCell('A').value,
            category_name: row.getCell('B').value,
            product_name: row.getCell('C').value,
            price: row.getCell('D').value,
            quantity: row.getCell('E').value,
            color: row.getCell('F').value,
            band_material: row.getCell('G').value,
            dial_type: row.getCell('H').value,
            func: row.getCell('I').value,
            gender: row.getCell('J').value,
            model: row.getCell('K').value,
            series: row.getCell('L').value,
            water_resistance: row.getCell('M').value,
            case_diameter: row.getCell('N').value,
            case_material: row.getCell('O').value,
            detail: row.getCell('P').value,
            machine_movement: row.getCell('Q').value,
            band_width: row.getCell('R').value,
            case_thickness: row.getCell('S').value,
            image: null, // Khởi tạo image là null trước
        };

        // Gán hình ảnh cho productData dựa trên hàng hiện tại (rowNumber - 2)
       

        if(productData.product_name && productData.category_name && productData.brand_name){
          if (rowNumber - 2 < orderedImageUrls.length) {
            productData.image = orderedImageUrls[rowNumber - 2];
        }
        productDataArray.push(productData);
        }
        
    });

    // Gọi hàm gửi dữ liệu Excel đi sau khi tất cả hình ảnh đã được tải lên
    await handleSendExcelData(productDataArray);
};


// Hàm xử lý thay đổi Excel
const handleChangeExcel = (e) => {
    if (e.target.name === 'file') {
        setFormData({ ...formData, file: e.target.files[0] });
    } else if (e.target.name === 'excel') {
        // Kiểm tra xem có tệp nào được chọn không
        if (e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            // Kiểm tra xem tệp có phải là một đối tượng File không
            if (selectedFile instanceof File) {
                handleExcelFile(selectedFile); // Gọi hàm xử lý tệp Excel
            } else {
                console.error('Invalid file type:', selectedFile);
            }
        } else {
            console.error('No file selected');
        }
    } else {
        setFormData({
            ...formData,
            data: { ...formData.data, [e.target.name]: e.target.value },
        });
    }
};
const handleSendExcelData = async (data) => {
  const productDataArray = await Promise.all(
      data.map(async (item) => {
          // Chuyển đổi quantity và price sang kiểu số nguyên
          const quantity = Number(item.quantity) || 0; // Chuyển đổi thành số nguyên, nếu không hợp lệ thì gán là 0
          const price = Number(item.price) || 0; // Tương tự với price
          // Trả về dữ liệu sản phẩm với URL ảnh
          return {
              product_name: item.product_name || formData.data.product_name,
              status: formData.data.status,
              quantity: quantity, // Đảm bảo quantity là kiểu số
              price: price, // Đảm bảo price là kiểu số
              detail: item.detail || formData.data.detail,
              band_material: item.band_material || formData.data.band_material,
              band_width: item.band_width || formData.data.band_width,
              case_diameter: item.case_diameter || formData.data.case_diameter,
              case_material: item.case_material || formData.data.case_material,
              case_thickness: item.case_thickness || formData.data.case_thickness,
              color: item.color || formData.data.color,
              dial_type: item.dial_type || formData.data.dial_type,
              func: item.func || formData.data.func,
              gender: item.gender || formData.data.gender,
              machine_movement: item.machine_movement || formData.data.machine_movement,
              model: item.model || formData.data.model,
              series: item.series || formData.data.series,
              water_resistance: item.water_resistance || formData.data.water_resistance,
              brand_name: item.brand_name || formData.data.brand_name,
              category_name: item.category_name || formData.data.category_name,
              image: item.image // URL Firebase sau khi upload
          };

      })
  );
  // Dispatch mảng dữ liệu sản phẩm để gửi đi
  dispatch(addProductRequestBatch(productDataArray));
};
  return (
    <>
      <div className="flex flex-col justify-center items-center ml-[18%]">
        <div className="flex mt-2 justify-center items-center">
          <h2 className="text-main font-RobotoSemibold text-[20px] uppercase">
            Create Product
          </h2>
        </div>
        <div className="w-[50%] p-2 rounded-md shadow-md bg-white text-primary mt-5">
          <form
            className="flex flex-col p-5 text-primary gap-5"
            onSubmit={handleSubmit}
          >
            <div className="relative">
              <input
                type="file"
                name="file"
                accept=".jpg, .jpeg, .png"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleChange}
              />
              <div className="bg-gray-200 rounded-md py-2 px-4 flex items-center justify-center gap-2 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {formData.file ? (
                  <span className="text-primary font-RobotoMedium">
                    {formData.file.name}
                  </span>
                ) : (
                  <span className="text-primary font-RobotoMedium">
                    Choose File
                  </span>
                )}
              </div>
            </div>
            {formData.file && (
              <img
                src={URL.createObjectURL(formData.file)}
                alt="Please select an image"
                className="w-full h-[280px] object-contain"
              />
            )}
            {errors.file && <p className="text-red text-sm">{errors.file}</p>}
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Product Name:
                </label>
                <input
                  className="border-b-2"
                  name="product_name"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
                {errors.product_name && (
                  <p className="text-red text-sm">{errors.product_name}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">Price:</label>
                <input
                  className="border-b-2"
                  name="price"
                  type="number"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
                {errors.price && (
                  <p className="text-red text-sm">{errors.price}</p>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Band Material:
                </label>
                <textarea
                  className="border-b-2"
                  name="band_material"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Band Width:
                </label>
                <textarea
                  className="border-b-2"
                  name="band_width"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Case Diameter:
                </label>
                <textarea
                  className="border-b-2"
                  name="case_diameter"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Case Material:
                </label>
                <textarea
                  className="border-b-2"
                  name="case_material"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Case Thickness:
                </label>
                <textarea
                  className="border-b-2"
                  name="case_thickness"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold"> Color:</label>
                <textarea
                  className="border-b-2"
                  name="color"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">Dial Type</label>
                <textarea
                  className="border-b-2"
                  name="dial_type"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">Quantity:</label>
                <input
                  className="border-b-2"
                  name="quantity"
                  type="number"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Functions:
                </label>
                <textarea
                  className="border-b-2"
                  name="func"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">Gender:</label>
                <textarea
                  className="border-b-2"
                  name="gender"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">Model:</label>
                <textarea
                  className="border-b-2"
                  name="model"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  {' '}
                  Movement:
                </label>
                <textarea
                  className="border-b-2"
                  name="machine_movement"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">Series:</label>
                <textarea
                  className="border-b-2"
                  name="series"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  {' '}
                  Water Resistance:
                </label>
                <textarea
                  className="border-b-2"
                  name="water_resistance"
                  onChange={handleChange}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block mb-5">Category:</label>
                <select
                  className="p-2 rounded-md border-none"
                  name="category_name"
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories?.data &&
                    categories?.data.map((category) => (
                      <option
                        key={category.category_id}
                        value={category.category_name}
                      >
                        {category.category_name}
                      </option>
                    ))}
                </select>
                {errors.category_name && (
                  <p className="text-red text-sm">{errors.category_name}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="text-[14px] block mb-5">Brand:</label>
                <select
                  className="p-2 rounded-md border-none"
                  name="brand_name"
                  onChange={handleChange}
                >
                  <option value="">Select Brand</option>
                  {brands?.data &&
                    brands?.data.map((brand) => (
                      <option key={brand.brand_id} value={brand.brand_name}>
                        {brand.brand_name}
                      </option>
                    ))}
                </select>
                {errors.brand_name && (
                  <p className="text-red text-sm">{errors.brand_name}</p>
                )}
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[14px] block font-bold">
                Description:
              </label>
              <textarea
                className="border-b-2"
                name="detail"
                onChange={handleChange}
                style={{ marginTop: '20px', width: '700px', height: '200px' }}
              />
            </div>
            {/* Thêm nút chọn file Excel */}
            <div className="relative">
              <input
                type="file"
                name="excel"
                accept=".xlsx, .xls"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleChangeExcel}
              />
              <div className="bg-gray-200 rounded-md py-2 px-4 flex items-center justify-center gap-2 cursor-pointer">
                <span className="text-primary font-RobotoMedium">
                  Chọn file Excel
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                className="w-[40%] bg-primary text-white rounded-md shadow-md py-3 uppercase font-RobotoMedium"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang thêm...' : 'Thêm sản phẩm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateProduct