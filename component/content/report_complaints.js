import React, { useEffect, useState } from 'react'
import { XAxis, YAxis, CartesianGrid, BarChart, Bar, LabelList, ResponsiveContainer, Tooltip, Legend, } from 'recharts'

import axios from 'axios'
import config from '../../config'
import * as moment from 'moment';
import 'moment/locale/th';
moment.locale('th')
import { useRouter } from 'next/router'

const api = config.api

const Report_complaints = (data) => {

    const YYear = moment().format("YYYY")

    const router = useRouter()

    const [yearARR, setyearARR] = useState([])
    const [dataChart, setdataChart] = useState([])
    const [dataSentOrNo, setdataSentOrNo] = useState([])
    const [dataReport5Year, setdataReport5Year] = useState([])
    const [year, setYear] = useState(YYear)
    const [complanTypeAll, setComplanTypeAll] = useState(0)

    useEffect(() => {
        if (data.data.status != '99' && data.data.status != '3') {
            router.push({
                pathname: '/main',
                query: {
                    path: 'dashboard',
                    error: 'AccessDenied'
                },
            })
        }
        getYearNumber()
        selectYears(YYear)
        getSentOrNo()
        getReport5Year()
    }, [])

    const getReport5Year = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-report-five-year`, { headers: { "token": token } })
            const Report5YearARR = []
            res.data.map((item, i) => {
                Report5YearARR.push({
                    'Year': parseInt(item.tyear) + 543,
                    'total': item.total,
                    'ตอบกลับแล้ว': item.replySuccess,
                    'ยังไม่ตอบกลับ': item.replyNot,
                    'อยู่ระหว่างการตอบกลับ': item.replyBetween,
                    'เลยกำหนดตอบกลับ': item.replyLead + item.replyLead2,
                })
            })
            setdataReport5Year(Report5YearARR)
        } catch (error) {
            console.log(error)
        }
    }

    const getYearNumber = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-year-number`, { headers: { "token": token } })
            setyearARR(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const selectYears = async (year) => {
        // console.log(year)
        const dataInfo = []
        const sumNumAll = 0
        const percen = 0
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-report-by-year/${year}`, { headers: { "token": token } })
            // console.log(res.data)

            res.data.map((item1, i) => {
                sumNumAll += item1.NumAll
            })
            setComplanTypeAll(sumNumAll)

            res.data.map((item2, i) => {
                sumNumAll != 0 ? percen = (item2.NumAll * 100) / sumNumAll : percen
                dataInfo.push({
                    'name': item2.name,
                    'percen': percen.toFixed(2) + '%',
                    'amount': item2.NumAll
                })
            })
            setdataChart(dataInfo)
        } catch (error) {
            console.log(error)
        }
    }

    const getSentOrNo = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-report-sent-or-no`, { headers: { "token": token } })
            setdataSentOrNo(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="m-0">รายงาน</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">หน้าแรก</li>
                                <li className="breadcrumb-item">รายงาน</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">
                    <div className='row'>
                        <div className='col-12 col-sm-12 col-lg-12'>
                            <div className="card card-danger">
                                <div className="card-header">
                                    <h3 className="card-title text-bold text-white">รายงานเกี่ยวกับการตอบกลับข้อร้องเรียน</h3>
                                </div>
                                <div className='card-body'>
                                    <div className="card-body p-0">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr className='text-center'>
                                                    <th>ชื่อแผนก</th>
                                                    <th>จำนวนข้อร้องเรียนทั้งหมด (เรื่อง)</th>
                                                    <th>จำนวนที่ตอบกลับแล้ว (เรื่อง)</th>
                                                    <th>จำนวนที่ยังไม่ตอบกลับ (เรื่อง)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    dataSentOrNo.map((item, i) => {
                                                        return <tr key={i}>
                                                            <td>{item.name}</td>
                                                            <td className='text-center'>{item.NumAll}</td>
                                                            <td className='text-center'>{item.NumSent}</td>
                                                            <td className='text-center text-bold' style={{ backgroundColor: item.NumAll - item.NumSent == 0 ? '' : '#D2001A', color: item.NumAll - item.NumSent == 0 ? '' : '#FFFFFF' }}>{item.NumAll - item.NumSent}</td>
                                                        </tr>
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 col-sm-12 col-md-12 col-lg-6'>
                            <div className="card card-purple">
                                <div className="card-header">
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-12 col-lg-7'>
                                            <h3 className="card-title text-white text-bold">ข้อร้องเรียน ปีงบประมาณ {parseInt(year) + 543} (ต.ค. {parseInt(year) + 543} - ก.ย. {parseInt(year) + 544})</h3>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-12 col-lg-5' style={{ textAlign: 'right' }}>
                                            <select className="browser-default custom-select" style={{ width: '100%' }}
                                                onChange={e => {
                                                    setYear(e.target.value)
                                                    selectYears(e.target.value)
                                                }}
                                            >
                                                <option value='0'>
                                                    กรุณาเลือกปีงบประมาณ
                                                </option>
                                                {
                                                    yearARR.map((item, i) => {
                                                        return <option value={item.YearNumber} key={i}>
                                                            ปีงบประมาณ {item.YearNumber + 543}
                                                        </option>
                                                    })
                                                }
                                            </select>
                                        </div>

                                    </div>
                                </div>
                                <div className='card-body'>
                                    <ResponsiveContainer width='100%' height={500}>
                                        <BarChart
                                            data={dataChart}
                                            margin={{ top: 15, right: 30, left: 20, bottom: 30 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <YAxis label={{ value: 'จำนวน (ข้อ)', angle: -90, position: 'insideLeft' }} />
                                            <Bar dataKey="amount" fill="#C47AFF">
                                                <LabelList dataKey="percen" position="top" />
                                                <LabelList dataKey="name" position="insideTop" />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className='card-footer'>
                                    <p>หมายเหตุ : ข้อร้องเรียน ปีงบประมาณ {parseInt(year) + 543} (ต.ค. {parseInt(year) + 543} - ก.ย. {parseInt(year) + 544}) จำนวน {complanTypeAll} ข้อร้องเรียน</p>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 col-sm-12 col-md-12 col-lg-6'>
                            <div className="card card-info">
                                <div className="card-header">
                                    <h3 className="card-title text-white text-bold">ข้อร้องเรียน ปีงบประมาณ 2564 - 2568</h3>
                                </div>

                                <div className='card-body'>
                                    <ResponsiveContainer width='100%' height={500}>
                                        <BarChart
                                            width={500}
                                            height={300}
                                            data={dataReport5Year}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="Year" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="ตอบกลับแล้ว" fill="#95CD41" />
                                            <Bar dataKey="ยังไม่ตอบกลับ" fill="#FF8E00" />
                                            <Bar dataKey="อยู่ระหว่างการตอบกลับ" fill="#B2B2B2" />
                                            <Bar dataKey="เลยกำหนดตอบกลับ" fill="#FA7070" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className='card-footer'>
                                    <span>หมายเหตุ : ข้อร้องเรียน<br /></span>
                                    {
                                        dataReport5Year.map((item, i) => {
                                            // console.log(item)
                                            return <span key={i}>&emsp;&emsp;{i + 1}) ปีงบประมาณ {item.Year} (ต.ค. {item.Year} - ก.ย. {item.Year}) จำนวน {item.total} ข้อร้องเรียน<br /></span>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    )
}

export default Report_complaints