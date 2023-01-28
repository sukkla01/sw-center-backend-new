import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../../config'
import { useRouter } from 'next/router'

const api = config.api

const Dashboard = (data) => {
    const router = useRouter()

    const complain = () => {
        router.push({
            pathname: '/main',
            query: {
                path: 'complain'
            },
        })
    }
    const agencyProblems = () => {
        router.push({
            pathname: '/main',
            query: {
                path: 'agencyProblems'
            },
        })
    }
    const board = () => {
        router.push({
            pathname: '/main',
            query: {
                path: 'board'
            },
        })
    }

    const [aa, setaa] = useState(0)
    const [acf, setacf] = useState(0)
    const [ancf, setancf] = useState(0)

    const [da, setda] = useState(0)
    const [dcf, setdcf] = useState(0)
    const [dncf, setdncf] = useState(0)

    const [ba, setba] = useState(0)
    const [bcf, setbcf] = useState(0)
    const [bncf, setbncf] = useState(0)

    useEffect(() => {
        // console.log(data.data.status)
        // ffff
        if (data.data.status == '1') {
            getNumCountAdmin()
        } else if (data.data.status == '2') {
            getNumCountDept()
        } else if (data.data.status == '3') {
            getNumCountDept()
            getNumCountBoard()
        } else if (data.data.status == '8') {
            getNumCountAdmin()
        } else if (data.data.status == '99') {
            getNumCountAdmin()
            getNumCountDept()
            getNumCountBoard()
        }
    }, [])

    // console.log(data.data.status)
    const token = localStorage.getItem('token')

    const getNumCountAdmin = async () => {
        try {
            const resAA = await axios.get(`${api}/get-number-complain-admin/all`, { headers: { "token": token } })
            // console.log(resA.data[0])
            setaa(resAA.data[0].NumAll)
        } catch (error) {
            console.log(error)
        }

        try {
            const resACF = await axios.get(`${api}/get-number-complain-admin/confirm`, { headers: { "token": token } })
            // console.log(resB.data[0])
            setacf(resACF.data[0].NumConfirm)
        } catch (error) {
            console.log(error)
        }

        try {
            const resANCF = await axios.get(`${api}/get-number-complain-admin/notconfirm`, { headers: { "token": token } })
            // console.log(resC.data[0])
            setancf(resANCF.data[0].NumNotConfirm)
        } catch (error) {
            console.log(error)
        }
    }

    const getNumCountDept = async () => {
        try {
            const resDA = await axios.get(`${api}/get-number-complain-dept/all/${data.data.dept}`, { headers: { "token": token } })
            // console.log(resDA.data[0])
            setda(resDA.data[0].NumAll)
        } catch (error) {
            console.log(error)
        }

        try {
            const resDCF = await axios.get(`${api}/get-number-complain-dept/confirm/${data.data.dept}`, { headers: { "token": token } })
            // console.log(resDCF.data[0])
            setdcf(resDCF.data[0].NumConfirm)
        } catch (error) {
            console.log(error)
        }

        try {
            const resDNCF = await axios.get(`${api}/get-number-complain-dept/notconfirm/${data.data.dept}`, { headers: { "token": token } })
            // console.log(resDNCF.data[0])
            setdncf(resDNCF.data[0].NumNotConfirm)
        } catch (error) {
            console.log(error)
        }
    }

    const getNumCountBoard = async () => {
        try {
            const resBA = await axios.get(`${api}/get-number-complain-board/all`, { headers: { "token": token } })
            // console.log(resBA.data[0])
            setba(resBA.data[0].NumAll)
        } catch (error) {
            console.log(error)
        }

        try {
            const resBCF = await axios.get(`${api}/get-number-complain-board/confirm`, { headers: { "token": token } })
            // console.log(resBCF.data[0])
            setbcf(resBCF.data[0].NumConfirm)
        } catch (error) {
            console.log(error)
        }

        try {
            const resBNCF = await axios.get(`${api}/get-number-complain-board/notconfirm`, { headers: { "token": token } })
            // console.log(resBNCF.data[0])
            setbncf(resBNCF.data[0].NumNotConfirm)
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
                            <h1 className="m-0">หน้าแรก</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a>หน้าแรก</a></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <section className="content">
                <div className="container-fluid">


                    {
                        data.data.status == '1' || data.data.status == '8' || data.data.status == '99' ?
                            <>
                                <h5><b>คำร้องเรียน</b></h5>
                                < div className='row'>
                                    <div className="col-lg-4 col-12">
                                        <div className="small-box bg-warning">
                                            <div className="inner">
                                                <h3>{ancf}</h3>
                                                <p>จำนวนที่ยังไม่ได้ส่งไปยังหน่วยงาน</p>
                                            </div>
                                            <div className="icon">
                                                <span className="iconify" data-icon="carbon:not-sent-filled" />
                                            </div>
                                            <a className="small-box-footer" onClick={complain}>More info <i className="fas fa-arrow-circle-right" /></a>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-12">
                                        <div className="small-box bg-success">
                                            <div className="inner">
                                                <h3>{acf}</h3>
                                                <p>จำนวนที่ส่งไปยังหน่วยงานแล้ว</p>
                                            </div>
                                            <div className="icon">
                                                <span className="iconify" data-icon="wpf:sent" />
                                            </div>
                                            <a className="small-box-footer" onClick={complain}>More info <i className="fas fa-arrow-circle-right" /></a>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-12">
                                        <div className="small-box bg-info">
                                            <div className="inner">
                                                <h3>{aa}</h3>
                                                <p>จำนวนคำร้องเรียนทั้งหมด</p>
                                            </div>
                                            <div className="icon">
                                                <span className="iconify" data-icon="carbon:edt-loop" />
                                            </div>
                                            <a className="small-box-footer" onClick={complain}>More info <i className="fas fa-arrow-circle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                            </>
                            : ''
                    }


                    {
                        data.data.status == '2' || data.data.status == '3' || data.data.status == '99' ?
                            <>
                                <h5><b>คำร้องเรียนของหน่วยงาน</b></h5>
                                <div className='row'>
                                    <div className="col-lg-4 col-12">
                                        <div className="small-box bg-warning">
                                            <div className="inner">
                                                <h3>{dncf}</h3>
                                                <p>จำนวนยังไม่ได้ชี้แจง</p>
                                            </div>
                                            <div className="icon">
                                                <span className="iconify" data-icon="ep:circle-close-filled" />
                                            </div>
                                            <a className="small-box-footer" onClick={agencyProblems}>More info <i className="fas fa-arrow-circle-right" /></a>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-12">
                                        <div className="small-box bg-success">
                                            <div className="inner">
                                                <h3>{dcf}</h3>
                                                <p>จำนวนชี้แจงแล้ว</p>
                                            </div>
                                            <div className="icon">
                                                <span className="iconify" data-icon="ep:success-filled" />
                                            </div>
                                            <a className="small-box-footer" onClick={agencyProblems}>More info <i className="fas fa-arrow-circle-right" /></a>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-12">
                                        <div className="small-box bg-info">
                                            <div className="inner">
                                                <h3>{da}</h3>
                                                <p>จำนวนที่ร้องเรียนของหน่วยงานทั้งหมด</p>
                                            </div>
                                            <div className="icon">
                                                <span className="iconify" data-icon="carbon:edt-loop" />
                                            </div>
                                            <a className="small-box-footer" onClick={agencyProblems}>More info <i className="fas fa-arrow-circle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                            </>
                            : ''
                    }

                    {
                        data.data.status == '3' || data.data.status == '99' ?
                            <>
                                <h5><b>คณะกรรมการ</b></h5>
                                <div className='row'>
                                    <div className="col-lg-4 col-12">
                                        <div className="small-box bg-warning">
                                            <div className="inner">
                                                <h3>{bncf}</h3>
                                                <p>จำนวนที่คณะกรรมการยังไม่ได้ชี้แจง</p>
                                            </div>
                                            <div className="icon">
                                                <span className="iconify" data-icon="ep:circle-close-filled" />
                                            </div>
                                            <a className="small-box-footer" onClick={board}>More info <i className="fas fa-arrow-circle-right" /></a>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-12">
                                        <div className="small-box bg-success">
                                            <div className="inner">
                                                <h3>{bcf}</h3>
                                                <p>จำนวนที่คณะกรรมการชี้แจงแล้ว</p>
                                            </div>
                                            <div className="icon">
                                                <span className="iconify" data-icon="ep:success-filled" />
                                            </div>
                                            <a className="small-box-footer" onClick={board}>More info <i className="fas fa-arrow-circle-right" /></a>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-12">
                                        <div className="small-box bg-info">
                                            <div className="inner">
                                                <h3>{ba}</h3>
                                                <p>จำนวนที่หน่วยงานชี้แจงมาแล้วทั้งหมด</p>
                                            </div>
                                            <div className="icon">
                                                <span className="iconify" data-icon="carbon:edt-loop" />
                                            </div>
                                            <a className="small-box-footer" onClick={board}>More info <i className="fas fa-arrow-circle-right" /></a>
                                        </div>
                                    </div>
                                </div>
                            </>
                            : ''
                    }

                </div>
            </section >
        </div >
    )
}

export default Dashboard