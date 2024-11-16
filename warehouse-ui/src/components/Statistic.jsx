import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { getMonthlyTransaction } from '../State/Statistic/Action';

const Statistic = () => {
    const chartRef = useRef(null);
    const dispatch = useDispatch();

    const state = useSelector((state) => state.statistic.monthlyTransactions || {});
    const statisticList = state?.data || [];

    useEffect(() => {
        dispatch(getMonthlyTransaction(2024));
    }, [dispatch]);

    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    const importData = statisticList.map((item) => parseFloat(item.importValue.replace(/,/g, '')));
    const exportData = statisticList.map((item) => parseFloat(item.exportValue.replace(/,/g, '')));
    const month = statisticList.map((item) => monthNames[item.month - 1]);
    console.log(month);

    const options = {
        series: [
            {
                name: "Nhập",
                data: importData,
                color: "#1A56DB",
            },
            {
                name: "Xuất",
                data: exportData,
                color: "#7E3BF2",
            },
        ],
        chart: {
            height: "300px",
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
                left: 20,
                right: 2,
                top: 0,
            },
        },
        xaxis: {
            categories: month,
            labels: {
                show: true,
                style: {
                    colors: '#9CA3AF',
                    fontSize: '12px',
                }
            },
            axisBorder: {
                show: true,
                color: '#D1D5DB',
            },
            axisTicks: {
                show: true,
            },
        },
        yaxis: {
            show: true,
            labels: {
                show: true,
                formatter: function (value) {
                    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                },
                style: {
                    colors: '#9CA3AF',
                    fontSize: '12px',
                }
            },
            axisBorder: {
                show: true,
                color: '#D1D5DB',
            },
            axisTicks: {
                show: true,
            },
            offsetX: -10,
        },
    };

    useEffect(() => {
        if (chartRef.current && typeof ApexCharts !== 'undefined') {
            const chart = new ApexCharts(chartRef.current, options);
            chart.render();
            return () => {
                chart.destroy();
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
};

export default Statistic;
