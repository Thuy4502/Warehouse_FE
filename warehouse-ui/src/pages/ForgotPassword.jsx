import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../State/Auth/Action";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError("Vui lòng nhập email");
            return;
        }

        try {
            setError("");
            setSuccessMessage("");
            await dispatch(forgotPassword(email)); 
            setSuccessMessage("Yêu cầu đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra email để nhận mật khẩu mới.");
        } catch (err) {
            setError("Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.");
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) setError(""); // Reset lỗi khi nhập lại
    };

    return (
        <div>
            <div className="mt-7 w-[400px] m-auto bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                            {successMessage ? "Đặt lại mật khẩu" : "Quên mật khẩu?"}
                        </h1>
                        {!successMessage && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Bạn nhớ mật khẩu?{" "}
                                <span
                                    onClick={() => navigate("/login")}
                                    className="text-blue-600 decoration-2 hover:underline font-medium cursor-pointer"
                                >
                                    Đăng nhập
                                </span>
                            </p>
                        )}
                    </div>

                    <div className="mt-5">
                        {!successMessage ? (
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold ml-1 mb-2 dark:text-white">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={email}
                                                onChange={handleEmailChange}
                                                className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                                                required
                                                aria-describedby="email-error"
                                            />
                                        </div>
                                        {error && (
                                            <p className="text-xs text-red-600 mt-2" id="email-error">
                                                {error}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                                    >
                                        Lấy lại mật khẩu
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="mt-4">
                                <p className="text-sm text-green-600">{successMessage}</p>
                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                    Bạn có thể{" "}
                                    <span
                                        onClick={() => navigate("/login")}
                                        className="text-blue-600 decoration-2 hover:underline font-medium cursor-pointer"
                                    >
                                        Đăng nhập
                                    </span>
                                    {" "}bằng mật khẩu đã nhận được trong email.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
