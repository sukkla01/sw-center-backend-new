import { MDBDataTableV5 } from 'mdbreact'
import React, { useEffect, useState } from 'react'
import { Modal, Popconfirm } from 'antd'
import axios from 'axios'
import config from '../../config'
import { ToastContainer, toast, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import ReactInputMask from 'react-input-mask'
import { Select } from 'antd';

const api = config.api
const Controluser = (data) => {

    const router = useRouter()
    const [block, setBlock] = useState(true)
    const [getDeptAll, setgetDeptAll] = useState([])
    const [datatable, setDatatable] = React.useState({})
    const [addDataUser, setaddDataUser] = useState(false)
    const [editDataUser, seteditDataUser] = useState(false)
    const [classCss, setclassCss] = useState('form-control')
    const [formAddDataUser, setFormAddDataUser] = useState({ fullname: '', username: '', password: '', cid: '', by: '', dept: '', status: '' })
    const [formEditDataUser, setFormEditDataUser] = useState({ fullname: '', username: '', password: '', cid: '', by: '', dept: '', status: '' })
    const { Option } = Select;

    useEffect(() => {
        setFormAddDataUser({ ...formAddDataUser, by: data.data.username })
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
        getDept()
    }, [])

    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL ADD
    const showModalAdd = () => {
        setaddDataUser(true)
    }

    const handleOkAdd = async () => {
        setaddDataUser(false)
        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/add-user`, formAddDataUser, { headers: { "token": token } })
            // console.log(res)
            res.data.status == 'success' ? toast.success('เพิ่มข้อมูลผู้ใช้งานสำเร็จ') : toast.error('การเพิ่มข้อมูลล้มเหลว')
            setFormAddDataUser({ fullname: '', username: '', password: '', cid: '', by: data.data.username, dept: '', status: '' })
            setclassCss('form-control')
            setBlock(true)
            getList()
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    const handleCancelAdd = () => {
        setaddDataUser(false)
    }

    const handleChange = (value) => {
        setFormAddDataUser({ ...formAddDataUser, dept: value })
        if (value != 0 && formAddDataUser.username != '' && formAddDataUser.password != '' && formAddDataUser.fullname != '' && formAddDataUser.cid.length == 13 && formAddDataUser.status != 0) {
            setBlock(false)
        } else {
            setBlock(true)
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL ADD

    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL EDIT
    const showModaledit = async (edit_cid, usernames) => {
        seteditDataUser(true)
        // console.log(edit_cid)
        getDataEdit(edit_cid, usernames)
    }

    const handleOkedit = async () => {
        seteditDataUser(false)
        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/update-user`, formEditDataUser, { headers: { "token": token } })
            // console.log(res)
            res.data.status == 'success' ? toast.success('แก้ไขข้อมูลสำเร็จ') : toast.error('แก้ไขข้อมูลล้มเหลว')
            getList()
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    const handleCanceledit = () => {
        seteditDataUser(false)
    }

    const handleChangeEdit = (value) => {
        setFormEditDataUser({ ...formEditDataUser, dept: value })
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL EDIT

    // ------------------------------------------------------------------------------------------------------------------------------------------ START GET DATA EDIT
    const getDataEdit = async (edit_cid, usernames) => {
        // console.log(formEditDataUser)
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-user/${edit_cid}`, { headers: { "token": token } })
            res.data.map((item, i) => {
                setFormEditDataUser({
                    ...formEditDataUser,
                    fullname: item.usr_fullname,
                    cid: item.usr_cid,
                    username: item.usr_username,
                    password: item.usr_password,
                    dept: item.usr_dept,
                    by: usernames,
                    status: item.usr_status
                })
            })
        } catch (error) {
            console.log(error)
            // toast.error('เกิดข้อผิดพลาด')
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END GET DATA EDIT

    // ------------------------------------------------------------------------------------------------------------------------------------------ START STATUS
    const updateStatus = async (up_cid, up_status, by) => {
        // console.log(up_cid + '  -  ' + up_status)
        const statusData = {
            'cid': up_cid,
            'by': by,
            'status': up_status
        }

        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/update-status-user`, statusData, { headers: { "token": token } })
            res.data.status == 'success' ? toast.success('ปรับสถานะสำเร็จ') : toast.error('ปรับสถานะล้มเหลว')
            getList()
        } catch (error) {
            // toast.error('เกิดข้อผิดพลาด')
            console.log(error)
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END STATUS

    // ------------------------------------------------------------------------------------------------------------------------------------------ START DELETE
    const delelte = async (del_cid) => {
        // console.log(del_cid)
        const delData = {
            'cid': del_cid
        }
        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/delete-user`, delData, { headers: { "token": token } })
            res.data.status == 'success' ? toast.success('ลบข้อมูลสำเร็จ') : toast.error('ลบข้อมูลล้มเหลว')
            getList()
        } catch (error) {
            // toast.error('เกิดข้อผิดพลาด')
            console.log(error)
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END DELETE


    // ------------------------------------------------------------------------------------------------------------------------------------------ START GET DATA BY CID
    const getUserByCID = async (cid) => {
        // console.log(formEditDataUser)
        setclassCss('form-control')
        if (cid.length > 12) {
            try {
                const token = localStorage.getItem('token')
                const res = await axios.get(`${api}/get-user/${cid}`, { headers: { "token": token } })
                if (res.data.length == 1) {
                    setclassCss('form-control is-invalid')
                    toast.error('มี User ที่ใช้ 13 หลักนี้แล้ว')
                } else {
                    setclassCss('form-control is-valid')
                }
            } catch (error) {
                console.log(error)
                // toast.error('เกิดข้อผิดพลาด')
            }
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END GET DATA BY CID


    const columns = [
        {
            label: '#',
            field: 'id',
        },
        {
            label: 'เลขบัตรประชาชน',
            field: 'cid',
        },
        {
            label: 'Username',
            field: 'username',
        },
        {
            label: 'Password',
            field: 'password',
        },
        {
            label: 'ชื่อ-สกุล',
            field: 'fullname',
        },
        {
            label: 'แผนก',
            field: 'dept',
        },
        {
            label: 'ตำแหน่ง',
            field: 'status',
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
            const res = await axios.get(`${api}/get-user-all`, { headers: { "token": token } })
            // console.log(res)
            const dataInfo = []
            res.data.map((item, i) => {
                dataInfo.push(
                    {
                        'id': i + 1,
                        'cid': formatCid(item.usr_cid),
                        'username': item.usr_username,
                        'password': item.usr_password != null ? data.data.status == '99' ? item.usr_password : '*******' : '-',
                        'fullname': item.usr_fullname,
                        'dept': item.nameDept,
                        'status'
                            : item.usr_status == '99' ? (<span className='right badge badge-danger'>Super Admin</span>)
                                : item.usr_status == '8' ? (<span className='right badge badge-danger'>Admin</span>)
                                    : item.usr_status == '3' ? (<span className='right badge badge-success'>คณะกรรมการ</span>)
                                        : item.usr_status == '2' ? (<span className='right badge badge-warning'>หัวหน้าแผนก</span>)
                                            : item.usr_status == '1' ? (<span className='right badge badge-info'>เจ้าหน้าที่เพิ่มข้อมูล</span>)
                                                : (<span className='right badge badge-secondary'>ยังไม่ได้รับอนุญาติ</span>),
                        'action': (
                            <div className="btn-group">
                                {
                                    item.usr_status != 99 ?
                                        item.usr_status != 0 ?
                                            <Popconfirm
                                                title="ปิดการใช้งาน ?"
                                                onConfirm={() => updateStatus(item.usr_cid, '0', data.data.username)}
                                                okText="ยืนยัน"
                                                cancelText="ยกเลิก"
                                            >
                                                <button type="button" className='btn btn-success btn-sm'>
                                                    <i className='fa fa-power-off' />
                                                </button>
                                            </Popconfirm>
                                            :
                                            <Popconfirm
                                                title="เปิดการใช้งาน ?"
                                                onConfirm={() => updateStatus(item.usr_cid, '1', data.data.username)}
                                                okText="ยืนยัน"
                                                cancelText="ยกเลิก"
                                            >
                                                <button type="button" className='btn btn-danger btn-sm'>
                                                    <i className='fa fa-power-off' />
                                                </button>
                                            </Popconfirm>
                                        :
                                        data.data.status == 99 ?
                                            item.usr_status != 0 ?
                                                <Popconfirm
                                                    title="ปิดการใช้งาน ?"
                                                    onConfirm={() => updateStatus(item.usr_cid, '0', data.data.username)}
                                                    okText="ยืนยัน"
                                                    cancelText="ยกเลิก"
                                                >
                                                    <button type="button" className='btn btn-success btn-sm'>
                                                        <i className='fa fa-power-off' />
                                                    </button>
                                                </Popconfirm>
                                                :
                                                <Popconfirm
                                                    title="เปิดการใช้งาน ?"
                                                    onConfirm={() => updateStatus(item.usr_cid, '1', data.data.username)}
                                                    okText="ยืนยัน"
                                                    cancelText="ยกเลิก"
                                                >
                                                    <button type="button" className='btn btn-danger btn-sm'>
                                                        <i className='fa fa-power-off' />
                                                    </button>
                                                </Popconfirm>
                                            : ''
                                }
                                {
                                    item.usr_status != 0 && item.usr_status != 99 ?
                                        <button type="button" className='btn btn-warning btn-sm' onClick={() => showModaledit(item.usr_cid, data.data.username)}>
                                            <i className='fas fa-edit' />
                                        </button>
                                        :
                                        data.data.status == 99 ?
                                            <button type="button" className='btn btn-warning btn-sm' onClick={() => showModaledit(item.usr_cid, data.data.username)}>
                                                <i className='fas fa-edit' />
                                            </button>
                                            : ''
                                }
                                {
                                    item.usr_status != 99 ?
                                        <Popconfirm
                                            title="คุณต้องการลบเจ้าหน้าที่นี้หรือไม่?"
                                            onConfirm={() => delelte(item.usr_cid)}
                                            okText="ยืนยัน"
                                            cancelText="ยกเลิก"
                                        >
                                            <button type="button" className="btn btn-danger btn-sm">
                                                <i className="fa fa-trash" />
                                            </button>
                                        </Popconfirm>
                                        :
                                        data.data.status == 99 ?
                                            <Popconfirm
                                                title="คุณต้องการลบเจ้าหน้าที่นี้หรือไม่?"
                                                onConfirm={() => delelte(item.usr_cid)}
                                                okText="ยืนยัน"
                                                cancelText="ยกเลิก"
                                            >
                                                <button type="button" className="btn btn-danger btn-sm">
                                                    <i className="fa fa-trash" />
                                                </button>
                                            </Popconfirm>
                                            : ''
                                }
                            </div>
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

    //---------------------------------------------------------------------------------------------------------------------------- START GET DATA DEPT
    const getDept = async () => {

        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-dept-all`, { headers: { "token": token } })
            setgetDeptAll(res.data)
        } catch (error) {
            console.log(error)
            // toast.error('เกิดข้อผิดพลาด')
        }
    }
    //---------------------------------------------------------------------------------------------------------------------------- END GET DATA DEPT


    //---------------------------------------------------------------------------------------------------------------------------- START FORMAT CID
    function formatCid(CidString) {
        var cleaned = ('' + CidString).replace(/\D/g, '');
        var match = cleaned.match(/^(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})$/);
        // console.log(match)
        if (match) {
            return match[1] + '-' + match[2] + '-' + 'xxxxx' + '-' + match[4] + '-' + match[5];
        }
        return CidString;
    }
    //---------------------------------------------------------------------------------------------------------------------------- END FORMAT CID

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
                            <h1 className="m-0">จัดการผู้ใช้งาน</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a>หน้าแรก</a></li>
                                <li className="breadcrumb-item">จัดการผู้ใช้งาน</li>
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
                                <button type="button" className="btn btn-primary btn-sm" onClick={showModalAdd}>เพิ่มข้อมูล</button>
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
            <Modal title="เพิ่มข้อมูลผู้ใช้งาน" visible={addDataUser} onOk={handleOkAdd} onCancel={handleCancelAdd} okButtonProps={{ disabled: block }} okText='บันทึก' cancelText='ยกเลิก' width={1000}>
                <div>
                    <div className="card-body">
                        <div className='row'>
                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="username">Username</label>
                                <input type="text" className="form-control" id="username" placeholder="Username" value={formAddDataUser.username}
                                    onChange={e => {
                                        setFormAddDataUser({ ...formAddDataUser, username: e.target.value })
                                        if (e.target.value != '' && formAddDataUser.password != '' && formAddDataUser.fullname != '' && formAddDataUser.cid.length == 13 && formAddDataUser.dept != 0 && formAddDataUser.status != 0) {
                                            setBlock(false)
                                        } else {
                                            setBlock(true)
                                        }
                                    }}
                                />
                            </div>

                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Password" value={formAddDataUser.password}
                                    onChange={e => {
                                        setFormAddDataUser({ ...formAddDataUser, password: e.target.value })
                                        if (e.target.value != '' && formAddDataUser.username != '' && formAddDataUser.fullname != '' && formAddDataUser.cid.length == 13 && formAddDataUser.dept != 0 && formAddDataUser.status != 0) {
                                            setBlock(false)
                                        } else {
                                            setBlock(true)
                                        }
                                    }}
                                />
                            </div>

                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="fullname">ชื่อ-สกุล</label>
                                <input type="text" className="form-control" id="fullname" placeholder="ชื่อ-สกุล" value={formAddDataUser.fullname}
                                    onChange={e => {
                                        setFormAddDataUser({ ...formAddDataUser, fullname: e.target.value })
                                        if (e.target.value != '' && formAddDataUser.username != '' && formAddDataUser.password != '' && formAddDataUser.cid.length == 13 && formAddDataUser.dept != 0 && formAddDataUser.status != 0) {
                                            setBlock(false)
                                        } else {
                                            setBlock(true)
                                        }
                                    }}
                                />
                            </div>

                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="cid">13 หลัก</label>
                                <ReactInputMask type="text" className={classCss} id="cid" placeholder="13 หลัก" value={formAddDataUser.cid} mask="9-9999-99999-99-9"
                                    onChange={e => {
                                        let cid1 = e.target.value.replaceAll('-', '')
                                        let cid2 = cid1.replaceAll('_', '')
                                        setFormAddDataUser({ ...formAddDataUser, cid: cid2 })
                                        getUserByCID(cid2)
                                        if (cid2.length == 13 && formAddDataUser.username != '' && formAddDataUser.password != '' && formAddDataUser.fullname != '' && formAddDataUser.dept != 0 && formAddDataUser.status != 0) {
                                            setBlock(false)
                                        } else {
                                            setBlock(true)
                                        }
                                    }}
                                />
                            </div>

                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="dept">แผนก</label>
                                {/* <select className="browser-default custom-select" id='todept' value={formAddDataUser.dept}
                                    onChange={e => {
                                        setFormAddDataUser({ ...formAddDataUser, dept: e.target.value })
                                        if (e.target.value != 0 && formAddDataUser.username != '' && formAddDataUser.password != '' && formAddDataUser.fullname != '' && formAddDataUser.cid.length == 13 && formAddDataUser.status != 0) {
                                            setBlock(false)
                                        } else {
                                            setBlock(true)
                                        }
                                    }}
                                >
                                    <option value='0'>
                                        กรุณาเลือกแผนก
                                    </option>
                                    {
                                        getDeptAll.map((item, i) => {
                                            // console.log(item)
                                            return <option value={item.id} label={item.name} key={i}>
                                                {item.name}
                                            </option>
                                        })
                                    }
                                </select> */}
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="ค้นหา หรือ เลือกแผนก"
                                    optionFilterProp="children"
                                    onChange={handleChange}
                                    size='large'
                                    value={formAddDataUser.dept}
                                >
                                    <Option value="">กรุณาเลือกแผนก</Option>
                                    {
                                        getDeptAll.map((item, i) => {
                                            return <Option value={item.id} key={i}>
                                                {item.name}
                                            </Option>
                                        })
                                    }
                                </Select>
                            </div>

                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="status">ตำแหน่ง</label>
                                <select className="browser-default custom-select" id='status' value={formAddDataUser.status}
                                    onChange={e => {
                                        setFormAddDataUser({ ...formAddDataUser, status: e.target.value })
                                        if (e.target.value != 0 && formAddDataUser.username != '' && formAddDataUser.password != '' && formAddDataUser.fullname != '' && formAddDataUser.cid.length == 13 && formAddDataUser.dept != 0) {
                                            setBlock(false)
                                        } else {
                                            setBlock(true)
                                        }
                                    }}
                                >
                                    <option value="0">
                                        กรุณาเลือกตำแหน่ง
                                    </option>
                                    <option value="1">
                                        เจ้าหน้าที่เพิ่มข้อมูล
                                    </option>
                                    <option value="2">
                                        หัวหน้าแผนก
                                    </option>
                                    <option value="3">
                                        คณะกรรมการ
                                    </option>
                                    <option value="8">
                                        Admin
                                    </option>
                                    {
                                        data.data.status == '99' ?
                                            <option value="99">
                                                Super Admin
                                            </option>
                                            : ''
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL ADD */}

            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL EDIT */}
            <Modal title="แก้ไขข้อมูลผู้ใช้งาน" visible={editDataUser} onOk={handleOkedit} onCancel={handleCanceledit} okText='บันทึก' cancelText='ยกเลิก' width={1000}>
                <div>
                    <div className="card-body">
                        <div className='row'>
                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="username">Username</label>
                                <input type="text" className="form-control" id="username" placeholder="Username" value={formEditDataUser.username}
                                    onChange={e => {
                                        setFormEditDataUser({ ...formEditDataUser, username: e.target.value })
                                    }}
                                />
                            </div>

                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Password" value={formEditDataUser.password}
                                    onChange={e => {
                                        setFormEditDataUser({ ...formEditDataUser, password: e.target.value })
                                    }}
                                />
                            </div>

                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="fullname">ชื่อ-สกุล</label>
                                <input type="text" className="form-control" id="fullname" placeholder="ชื่อ-สกุล" value={formEditDataUser.fullname}
                                    onChange={e => {
                                        setFormEditDataUser({ ...formEditDataUser, fullname: e.target.value })
                                    }}
                                />
                            </div>

                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="cid">13 หลัก</label>
                                <ReactInputMask type="text" className="form-control" id="cid" placeholder="13 หลัก" value={formEditDataUser.cid} disabled mask="9-9999-99999-99-9" />
                            </div>

                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="dept">แผนก</label>
                                {/* <select className="browser-default custom-select" id='todept' value={formEditDataUser.dept}
                                    onChange={e => {
                                        setFormEditDataUser({ ...formEditDataUser, dept: e.target.value })
                                    }}
                                >
                                    <option value='0'>
                                        กรุณาเลือกแผนก
                                    </option>
                                    {
                                        getDeptAll.map((item, i) => {
                                            // console.log(item)
                                            return <option value={item.id} label={item.name} key={i}>
                                                {item.name}
                                            </option>
                                        })
                                    }
                                </select> */}
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="ค้นหา หรือ เลือกแผนก"
                                    optionFilterProp="children"
                                    onChange={handleChangeEdit}
                                    value={parseInt(formEditDataUser.dept)}
                                    size='large'
                                >
                                    {
                                        getDeptAll.map((item, i) => {
                                            return <Option value={item.id} key={i}>
                                                {item.name}
                                            </Option>
                                        })
                                    }
                                </Select>
                            </div>





                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="status">ตำแหน่ง</label>
                                <select className="browser-default custom-select" id='status' value={formEditDataUser.status}
                                    onChange={e => {
                                        setFormEditDataUser({ ...formEditDataUser, status: e.target.value })
                                    }}
                                >
                                    <option value="0">
                                        กรุณาเลือกตำแหน่ง
                                    </option>
                                    <option value="1">
                                        เจ้าหน้าที่เพิ่มข้อมูล
                                    </option>
                                    <option value="2">
                                        หัวหน้าแผนก
                                    </option>
                                    <option value="3">
                                        คณะกรรมการ
                                    </option>
                                    <option value="8">
                                        Admin
                                    </option>
                                    {
                                        data.data.status == '99' ?
                                            <option value="99">
                                                Super Admin
                                            </option>
                                            : ''
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal >
            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL EDIT */}
        </div >
    )
}

export default Controluser