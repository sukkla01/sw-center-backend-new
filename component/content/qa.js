import React, { useEffect, useState } from 'react'
import { MDBDataTableV5 } from 'mdbreact'
import { ToastContainer, toast, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import config from '../../config'
import { Modal, Popconfirm } from 'antd'
import * as moment from 'moment';
import 'moment/locale/th';
moment.locale('th')
import { useRouter } from 'next/router'

const api = config.api

const Qa = (data) => {

    const router = useRouter()
    const [datatable, setDatatable] = React.useState({})
    const [AddQA, setAddQA] = useState(false)
    const [EditQA, setEditQA] = useState(false)
    const [formAddQA, setFormAddQA] = useState({ username: '', q: '', a: '' })
    const [formEditQA, setFormEditQA] = useState({ username: '', q: '', a: '' })

    useEffect(() => {
        if (data.data.status != '99' && data.data.status != '8') {
            router.push({
                pathname: '/main',
                query: {
                    path: 'dashboard',
                    error: 'AccessDenied'
                },
            })
        }
        getList()
    }, [])

    const columns = [
        {
            label: '#',
            field: 'id',
        },
        {
            label: 'คำถาม',
            field: 'q',
        },
        {
            label: 'คำตอบ',
            field: 'a',
        },
        {
            label: 'วันที่เพิ่ม',
            field: 'upDt',
        },
        {
            label: 'Action',
            field: 'action',
        },
    ]
    //---------------------------------------------------------------------------------------------------------------------------- START GET DATA
    const getList = async () => {

        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-questions-all`, { headers: { "token": token } })
            // console.log(res)
            const dataInfo = []
            res.data.map((item, i) => {
                dataInfo.push(
                    {
                        'id': i + 1,
                        'q': item.qa_question,
                        'a': item.qa_answer,
                        'upDt': moment(item.qa_insDt).add(543, 'year').format('ll'),
                        'action': (
                            <>
                                <div className="btn-group">
                                    {
                                        item.qa_status == '1' ?
                                            <button type="button" className='btn btn-success btn-sm' onClick={() => updateStatus(item.qa_id, '0')}>
                                                <i className='fa fa-power-off' />
                                            </button>
                                            :
                                            <button type="button" className='btn btn-danger btn-sm' onClick={() => updateStatus(item.qa_id, '1')}>
                                                <i className='fa fa-power-off' />
                                            </button>
                                    }
                                    <button type="button" className='btn btn-warning btn-sm' onClick={() => showModalEdit(item.qa_id)}>
                                        <i className='fas fa-edit' />
                                    </button>
                                    <Popconfirm
                                        title="คุณต้องการลบคำถาม คำตอบนี้หรือไม่?"
                                        onConfirm={() => delelte(item.qa_id)}
                                        okText="ยืนยัน"
                                        cancelText="ยกเลิก"
                                    >
                                        <button type="button" className="btn btn-danger btn-sm">
                                            <i className="fa fa-trash" />
                                        </button>
                                    </Popconfirm>
                                </div>
                            </>
                        )

                    }
                )
            })

            setDatatable(
                {
                    columns: columns,
                    rows: dataInfo
                }
            )
        } catch (error) {
            console.log(error)
            // toast.error('เกิดข้อผิดพลาด')
        }
    }
    //---------------------------------------------------------------------------------------------------------------------------- END GET DATA

    // ------------------------------------------------------------------------------------------------------------------------------------------ START DELETE
    const updateStatus = async (id, status) => {
        const updateData = {
            'id': id,
            'username': data.data.username,
            'status': status
        }
        // console.log(updateData)
        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/update-status-question`, updateData, { headers: { "token": token } })
            res.data.status == 'success' ? toast.success('Status Update Successful') : toast.error('Status Update Failed')
            getList()
        } catch (error) {
            // toast.error('เกิดข้อผิดพลาด')
            console.log(error)
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END DELETE

    // ------------------------------------------------------------------------------------------------------------------------------------------ START DELETE
    const delelte = async (id) => {
        const delData = {
            'id': id
        }
        // console.log(delData)
        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/delete-question`, delData, { headers: { "token": token } })
            res.data.status == 'success' ? toast.success('ลบข้อมูลสำเร็จ') : toast.error('ลบข้อมูลล้มเหลว')
            getList()
        } catch (error) {
            // toast.error('เกิดข้อผิดพลาด')
            console.log(error)
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END DELETE

    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL ADD
    const showModalAdd = () => {
        setFormAddQA({ ...formAddQA, username: data.data.username })
        setAddQA(true)
    }

    const handleOkAdd = async () => {
        setAddQA(false)

        try {
            // console.log(formAddQA)
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/add-question`, formAddQA, { headers: { "token": token } })
            // console.log(res.data)
            res.data.status == 'success' ? toast.success('เพิ่มข้อมูลแผนกสำเร็จ') : toast.error('การเพิ่มข้อมูลล้มเหลว')
            setFormAddQA({ username: '', q: '', a: '' })
            getList()
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    const handleCancelAdd = () => {
        setAddQA(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL ADD
    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL EDIT
    const showModalEdit = async (id) => {
        setEditQA(true)
        // console.log(id)
        // get-questions-by-id

        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-questions-by-id/${id}`, { headers: { "token": token } })
            // console.log(res.data)
            res.data.map((item, i) => {
                setFormEditQA({
                    ...formEditQA,
                    id: id,
                    username: data.data.username,
                    q: item.qa_question,
                    a: item.qa_answer
                })
            })

        } catch (error) {
            console.log(error)
        }


    }

    const handleOkEdit = async () => {
        setEditQA(false)
        // console.log(formEditQA)

        try {
            // console.log(formAddQA)
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/update-question`, formEditQA, { headers: { "token": token } })
            // console.log(res.data)
            res.data.status == 'success' ? toast.success('แก้ไขข้อมูลแผนกสำเร็จ') : toast.error('การแก้ไขข้อมูลล้มเหลว')
            setFormEditQA({ username: '', q: '', a: '' })
            getList()
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    const handleCancelEdit = () => {
        setEditQA(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL EDIT


    return (
        <div>
            <ToastContainer
                position="top-center"
                autoClose={2500}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={true}
                draggable={true}
                pauseOnHover={true}
                // transition={Flip}
                theme={'colored'}
            />
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="m-0">ถาม ตอบ</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a>หน้าแรก</a></li>
                                <li className="breadcrumb-item">ถาม ตอบ</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">

                    <div className="card card-white">
                        <div className="card-header">
                            {/* <h3 className="card-title"></h3> */}
                            <div style={{ textAlign: 'right' }}>
                                <button type="button" className="btn btn-primary btn-sm" onClick={showModalAdd} >เพิ่มคำถามคำตอบ</button>
                            </div>
                        </div>
                        <div className='card-body'>
                            <div className="table-responsive-lg">
                                <MDBDataTableV5 hover entriesOptions={[10, 20, 30, 40, 50]} entries={10} pagesAmount={4} data={datatable} fullPagination />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL ADD */}
            <Modal title="เพิ่มข้อมูลถามตอบ" visible={AddQA} onOk={handleOkAdd} onCancel={handleCancelAdd} okText='บันทึก' cancelText='ยกเลิก' width={1000}>
                <div>
                    <div className="card-body">
                        <div className='row'>
                            <div className="form-group col-lg-12 col-12">
                                <label htmlFor="q">คำถาม</label>

                                <textarea rows="5" cols="50" type="text" className="form-control" id="q" placeholder="คำถาม" value={formAddQA.q}
                                    onChange={e => {
                                        setFormAddQA({ ...formAddQA, q: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-12 col-12">
                                <label htmlFor="a">คำตอบ</label>

                                <textarea rows="5" cols="50" type="text" className="form-control" id="a" placeholder="คำตอบ" value={formAddQA.a}
                                    onChange={e => {
                                        setFormAddQA({ ...formAddQA, a: e.target.value })
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </Modal>
            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL ADD */}


            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL ADD */}
            <Modal title="แก้ไขข้อมูลถามตอบ" visible={EditQA} onOk={handleOkEdit} onCancel={handleCancelEdit} okText='บันทึก' cancelText='ยกเลิก' width={1000}>
                <div>
                    <div className="card-body">
                        <div className='row'>
                            <div className="form-group col-lg-12 col-12">
                                <label htmlFor="q">คำถาม</label>

                                <textarea rows="5" cols="50" type="text" className="form-control" id="q" placeholder="คำถาม"
                                    value={formEditQA.q}
                                    onChange={e => {
                                        setFormEditQA({ ...formEditQA, q: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-12 col-12">
                                <label htmlFor="a">คำตอบ</label>

                                <textarea rows="5" cols="50" type="text" className="form-control" id="a" placeholder="คำตอบ"
                                    value={formEditQA.a}
                                    onChange={e => {
                                        setFormEditQA({ ...formEditQA, a: e.target.value })
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </Modal>
            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL ADD */}



        </div>
    )
}

export default Qa