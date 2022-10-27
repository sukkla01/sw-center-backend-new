import React, { useEffect, useState } from 'react'
import { MDBDataTableV5 } from 'mdbreact'
import { ToastContainer, toast, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import config from '../../config'
import { Modal, Popconfirm } from 'antd'
import { useRouter } from 'next/router'

const api = config.api

const Deptadd = (data) => {

    const router = useRouter()
    const [datatable, setDatatable] = React.useState({})
    const [AddDept, setAddDept] = useState(false)
    const [EditDept, setEditDept] = useState(false)
    const [formAddDept, setFormAddDept] = useState({ nameDept: '', telDept: '', tokenGroupDept: '' })
    const [formEdit, setFormEdit] = useState({ id: '', nameEdit: '', telEdit: '', tokenEdit: '' })

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
            label: 'ชื่อแผนก',
            field: 'name',
        },
        {
            label: 'เบอร์โทร',
            field: 'tel',
        },
        {
            label: 'Token Line',
            field: 'token',
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
            const res = await axios.get(`${api}/get-dept-all`, { headers: { "token": token } })
            // console.log(res)
            const dataInfo = []
            res.data.map((item, i) => {
                // console.log(item)
                dataInfo.push(
                    {
                        'id': i + 1,
                        'name': item.name.toLocaleUpperCase(),
                        'tel': item.tel != null && item.tel != '' ? item.tel : '-',
                        'token': item.token != null && item.token != '' ? item.token : '-',
                        'action': (
                            <>
                                <div className="btn-group">
                                    <button type="button" className='btn btn-warning btn-sm' onClick={() => showModalEdit(item.id)} >
                                        <i className='fas fa-edit' />
                                    </button>
                                    <Popconfirm
                                        title="คุณต้องการลบแผนกนี้หรือไม่?"
                                        onConfirm={() => delelte(item.id)}
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
    const delelte = async (id) => {
        const delData = {
            'id': id
        }
        // console.log(delData)
        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/delete-dept`, delData, { headers: { "token": token } })
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
        setAddDept(true)
    }

    const handleOkAdd = async () => {
        setAddDept(false)

        try {
            // console.log(formAddDept)
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/add-dept`, formAddDept, { headers: { "token": token } })
            // console.log(res)
            res.data.status == 'success' ? toast.success('เพิ่มข้อมูลแผนกสำเร็จ') : toast.error('การเพิ่มข้อมูลล้มเหลว กรุณาใส่ชื่อแผนก')
            // console.log(res.data.status)
            setFormAddDept({ nameDept: '', telDept: '', tokenGroupDept: '' })
            getList()
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    const handleCancelAdd = () => {
        setAddDept(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL ADD

    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL EDIT
    const showModalEdit = async (id) => {
        setEditDept(true)

        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-dept-by-id/${id}`, { headers: { "token": token } })
            // console.log(res.data)
            res.data.map((item, i) => {
                // console.log(item)
                setFormEdit({
                    ...formEdit,
                    id: item.id,
                    nameEdit: item.name,
                    telEdit: item.tel != null ? item.tel : '',
                    tokenEdit: item.token != null ? item.token : ''
                })
            })
        } catch (error) {
            console.log(error)
            // toast.error('เกิดข้อผิดพลาด')
        }
    }

    const handleOkEdit = async () => {
        setEditDept(false)
        // console.log(formEdit)

        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/update-dept`, formEdit, { headers: { "token": token } })
            res.data.status == 'success' ? toast.success('แก้ไขข้อมูลสำเร็จ') : toast.error('การเพิ่มข้อมูลล้มเหลว กรุณาใส่ชื่อแผนก')
            // console.log(res.data.status)
            getList()
        } catch (error) {
            // toast.error('เกิดข้อผิดพลาด')
            console.log(error)
        }
    }

    const handleCancelEdit = () => {
        setEditDept(false)
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
                            <h1 className="m-0">เพิ่มแผนก</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a>หน้าแรก</a></li>
                                <li className="breadcrumb-item">เพิ่มแผนก</li>
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
                                <button type="button" className="btn btn-primary btn-sm" onClick={showModalAdd} >เพิ่มแผนก</button>
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
            <Modal title="เพิ่มข้อมูลแผนก" visible={AddDept} onOk={handleOkAdd} onCancel={handleCancelAdd} okText='บันทึก' cancelText='ยกเลิก' width={1000}>
                <div>
                    <div className="card-body">
                        <div className='row'>
                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="nameDept">ชื่อแผนก</label>
                                <input type="text" className="form-control" id="nameDept" placeholder="ชื่อแผนก" value={formAddDept.nameDept}
                                    onChange={e => {
                                        setFormAddDept({ ...formAddDept, nameDept: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="telDept">เบอร์โทรแผนก</label>
                                <input type="text" className="form-control" id="telDept" placeholder="เบอร์โทรแผนก" value={formAddDept.telDept}
                                    onChange={e => {
                                        setFormAddDept({ ...formAddDept, telDept: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="tokenGroupDept">Token</label>
                                <input type="text" className="form-control" id="tokenGroupDept" placeholder="Token" value={formAddDept.tokenGroupDept}
                                    onChange={e => {
                                        setFormAddDept({ ...formAddDept, tokenGroupDept: e.target.value })
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </Modal>
            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL ADD */}

            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL EDIT */}
            <Modal title="แก้ไขข้อมูลแผนก" visible={EditDept} onOk={handleOkEdit} onCancel={handleCancelEdit} okText='บันทึก' cancelText='ยกเลิก' width={1000}>
                <div>
                    <div className="card-body">
                        <div className='row'>
                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="nameEdit">ชื่อแผนก</label>
                                <input type="text" className="form-control" id="nameEdit" placeholder="ชื่อแผนก" value={formEdit.nameEdit}
                                    onChange={e => {
                                        setFormEdit({ ...formEdit, nameEdit: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="telEdit">เบอร์โทรแผนก</label>
                                <input type="text" className="form-control" id="telEdit" placeholder="เบอร์โทรแผนก"
                                    value={formEdit.telEdit}
                                    onChange={e => {
                                        setFormEdit({ ...formEdit, telEdit: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="tokenGroupEdit">Token</label>
                                <input type="text" className="form-control" id="tokenGroupEdit" placeholder="Token"
                                    value={formEdit.tokenEdit}
                                    onChange={e => {
                                        setFormEdit({ ...formEdit, tokenEdit: e.target.value })
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </Modal>
            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL EDIT */}
        </div>
    )
}

export default Deptadd