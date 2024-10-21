import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

const Statistic = () => {
    const chartRef = useRef(null);

    const options = {
        series: [
            {
                name: "Nhập",
                data: [150, 141, 145, 152, 135, 125],
                color: "#1A56DB",
            },
            {
                name: "Xuất",
                data: [643, 413, 765, 412, 142, 173],
                color: "#7E3BF2",
            },
        ],
        chart: {
            height: "100%",
            type: "area",
            fontFamily: "Inter, sans-serif",
            dropShadow: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        tooltip: {
            enabled: true,
            x: {
                show: true,
            },
        },
        legend: {
            show: false,
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
                shade: "#1C64F2",
                gradientToColors: ["#1C64F2"],
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 6,
        },
        grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
                left: 20, // Tăng padding bên trái để không đè lên trục y
                right: 2,
                top: 0,
            },
        },
        xaxis: {
            categories: ['01 February', '02 February', '03 February', '04 February', '05 February', '06 February', '07 February'],
            labels: {
                show: true, // Hiển thị thông tin trên trục x
                style: {
                    colors: '#9CA3AF', // Màu của chữ trên trục x
                    fontSize: '12px',
                }
            },
            axisBorder: {
                show: true, // Hiển thị đường kẻ trục x
                color: '#D1D5DB', // Màu của đường kẻ trục x
            },
            axisTicks: {
                show: true, // Hiển thị đánh dấu trên trục x
            },
        },
        yaxis: {
            show: true, // Hiển thị trục y
            labels: {
                show: true, // Hiển thị thông tin trên trục y
                formatter: function (value) {
                    return '$' + value; // Định dạng giá trị trên trục y
                },
                style: {
                    colors: '#9CA3AF', // Màu của chữ trên trục y
                    fontSize: '12px',
                }
            },
            axisBorder: {
                show: true, // Hiển thị đường kẻ trục y
                color: '#D1D5DB', // Màu của đường kẻ trục y
            },
            axisTicks: {
                show: true, // Hiển thị đánh dấu trên trục y
            },
            offsetX: -10, // Di chuyển trục y ra xa dữ liệu để tránh bị đè
        },
    };

    useEffect(() => {
        if (chartRef.current && typeof ApexCharts !== 'undefined') {
            const chart = new ApexCharts(chartRef.current, options);
            chart.render();
            return () => {
                chart.destroy(); // Clean up the chart instance
            };
        }
    }, [options]);

    return (
        <div className="w-full">
            <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
                <div className="flex justify-between">
                    <div>
                        <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">Thống kê nhập - xuất</h5>
                    </div>
                </div>
                <div ref={chartRef} id="data-series-chart"></div>
            </div>
        </div>

    );
}

export default Statistic;
