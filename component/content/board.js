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
import io from 'socket.io-client';

const api = config.api
const socket = io(api);
const Boards = (data) => {

    const router = useRouter()
    const [datatable, setDatatable] = React.useState({})
    const [Board, setBoard] = useState(false)
    const [formBoard, setFormBoard] = useState({ id: '', username: '', deptComment: '', boradComment: '', change: '', like: '', urgency_class: '', nameType: '', imageComplain: '' })
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        // let arr =[99,2]
        // ต่อไปต้องทำการ ค้นหาใน Arr ก่อน ถ้าไม่มี ให้เด้งออก
        if (data.data.status != '99' && data.data.status != '3') {
            router.push({
                pathname: '/main',
                query: {
                    path: 'dashboard',
                    error: 'AccessDenied'
                },
            })
        }
        getList()

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };

    }, [])


    // ---------------------------------------------------------------------------------------------------------------- START SENT CONFIRM
    const sentConfirm = async (id) => {
        // alert('Confirm alert-confirm' + id)

        try {
            // const token = localStorage.getItem('token')
            const res = await axios.get(`https://sw-center-line.diligentsoftinter.com/alert-confirm/${id}`)
            // console.log(res.data)
        } catch (error) {
            console.log(error)
            // toast.error('เกิดข้อผิดพลาด')
        }

        // try {
        //     const token = localStorage.getItem('token')
        //     let res = await axios.post(`https://sw-center-line.diligentsoftinter.com/alert-confirm/${id}`)
        //     console.log(res.data)
        // } catch (error) {
        //     // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
        //     console.log(error)
        // }
    }

    //---------------------------------------------------------------------------------------------------------------------------- START BACKWARD DATA
    const backwardBoardComment = async (id) => {
        const backData = {
            'id': id
        }
        // console.log(backData)
        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/update-backward-board-reply`, backData, { headers: { "token": token } })
            res.data.status == 'success' ? toast.success('ล้างข้อมูลสำเร็จ') : toast.error('ล้างข้อมูลล้มเหลว')
            getList()
            socket.emit('board')
        } catch (error) {
            // toast.error('เกิดข้อผิดพลาด')
            console.log(error)
        }
    }
    //---------------------------------------------------------------------------------------------------------------------------- END BACKWARD DATA


    const columns = [
        {
            label: '#',
            field: 'id',
        },
        {
            label: 'ความสำคัญ',
            field: 'urgency_class',
        },
        {
            label: 'หัวเรื่อง',
            field: 'heading',
        },
        {
            label: 'แผนก',
            field: 'nameDept',
        },
        {
            label: 'คำชี้แจงหน่วยงาน',
            field: 'dept_comment',
        },
        {
            label: 'วันที่ชี้แจง',
            field: 'dept_upDt',
        },
        {
            label: 'คำชี้แจงคณะกรรมการ',
            field: 'board_comment',
        },
        {
            label: 'วันที่ชี้แจง',
            field: 'board_upDt',
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
            const res = await axios.get(`${api}/get-complain-boards-all`, { headers: { "token": token } })
            // console.log(res.data)
            const dataInfo = []
            res.data.map((item, i) => {
                // console.log(item)
                dataInfo.push(
                    {
                        'id': i + 1,
                        'urgency_class': item.urgency_class == '0' ? <span className='text-warning text-bold'>ไม่ได้เลือก</span> : item.urgency_class == '1' ? <span className='text-danger text-bold'>ด่วน</span> : item.urgency_class == '2' ? <span className='text-success text-bold'>ปกติ</span> : '-',
                        'heading': item.name_type != null ? item.name_type : '-',
                        'nameDept': item.nameDept != null ? item.nameDept : '-',
                        'dept_comment': item.dept_comment != null ? item.dept_comment : '-',
                        'dept_upDt': item.dept_upDt != null ? moment(item.dept_upDt).add(543, 'year').format('ll') : '-',
                        'board_comment': item.board_comment != null ? item.board_comment : '-',
                        'board_upDt': item.board_upDt != null ? moment(item.board_upDt).add(543, 'year').format('ll') : '-',
                        'action':
                            (
                                <>
                                    <div className='btn-group'>
                                        {
                                            item.board_comment != null && item.board_upBy != null && item.board_upDt != null ?
                                                <>
                                                    <button type="button" className="btn btn-success btn-sm">
                                                        <i className="fa fa-check" />
                                                    </button>

                                                    <Popconfirm
                                                        title="คุณต้องการล้างข้อมูลคำชี้แจงนี้หรือไม่?"
                                                        onConfirm={() => backwardBoardComment(item.id)}
                                                        okText="ยืนยัน"
                                                        cancelText="ยกเลิก"
                                                    >
                                                        <button type="button" className="btn btn-danger btn-sm">
                                                            <i className="fa fa-backward" />
                                                        </button>
                                                    </Popconfirm>
                                                    {
                                                        item.user_id != 'admin' ?
                                                            <Popconfirm
                                                                title="คุณต้องการส่งคำตอบกลับนี้หรือไม่?"
                                                                onConfirm={() => sentConfirm(item.id)}
                                                                okText="ยืนยัน"
                                                                cancelText="ยกเลิก"
                                                            >
                                                                <button type="button" className="btn btn-info btn-sm">
                                                                    <i className="fa fa-paper-plane" />
                                                                </button>
                                                            </Popconfirm>
                                                            : ''
                                                    }
                                                </>
                                                :
                                                <button type="button" className="btn btn-warning btn-sm" onClick={() => showModal(item.id)}>
                                                    <i className="fa fa-edit" />
                                                </button>
                                        }


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

    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL
    const showModal = async (id) => {
        // console.log(id)
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-comment-dept-by-id/${id}`, { headers: { "token": token } })
            // console.log(res)
            res.data.map((item, i) => {
                // console.log(item)
                if (item.board_comment == null) {
                    setFormBoard({
                        ...formBoard,
                        id: id,
                        username: data.data.username,
                        change: item.sub_change_text,
                        like: item.sub_like_text,
                        deptComment: item.dept_comment,
                        boradComment: '',
                        urgency_class: item.urgency_class,
                        nameType: item.nameType,
                        imageComplain: item.attack_file

                    })
                } else {
                    setFormBoard({
                        ...formBoard,
                        id: id,
                        username: data.data.username,
                        change: item.sub_change_text,
                        like: item.sub_like_text,
                        deptComment: item.dept_comment,
                        boradComment: item.board_comment,
                        urgency_class: item.urgency_class,
                        nameType: item.nameType,
                        imageComplain: item.attack_file
                    })
                }
            })
        } catch (error) {
            console.log(error)
            // toast.error('เกิดข้อผิดพลาด')
        }
        // console.log(id)
        setBoard(true)
    }

    const handleOk = async () => {
        setBoard(false)

        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/update-report-board-reply`, formBoard, { headers: { "token": token } })
            // // console.log(res.data)
            res.data.status == 'success' ? toast.success('คณะกรรมการชี้แจงสำเร็จ') : toast.error('คณะกรรมการชี้แจงล้มเหลว')
            setFormBoard({ id: '', username: '', deptComment: '', boradComment: '', change: '', like: '', urgency_class: '', nameType: '', imageComplain: '' })
            getList()
            socket.emit('board')
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    const handleCancel = () => {
        setBoard(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL

    return (
        <>
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
                                <h1 className="m-0">คณะกรรมการ</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a>หน้าแรก</a></li>
                                    <li className="breadcrumb-item">คณะกรรมการ</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="content">
                    <div className="container-fluid">

                        <div className="card card-white">
                            <div className='card-body'>
                                <div className="table-responsive-lg">
                                    <MDBDataTableV5 hover entriesOptions={[10, 20, 30, 40, 50]} entries={10} pagesAmount={4} data={datatable} fullPagination />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL */}
                <Modal title={null} visible={Board} onOk={handleOk} onCancel={handleCancel} okText='บันทึก' cancelText='ยกเลิก' width={1000}>
                    <div>
                        {/* ความคิดเห็นคณะกรรมการ */}
                        <div className='card-header'>
                            <span className='h4 text-bold'>เรื่อง...{formBoard.nameType} </span>
                            <span className='h4 text-bold text-danger'>{formBoard.urgency_class == '0' ? <span className='text-warning text-bold'>[ไม่ได้เลือก]</span> : formBoard.urgency_class == '1' ? <span className='text-danger text-bold'>[ด่วน]</span> : formBoard.urgency_class == '2' ? <span className='text-success text-bold'>[ปกติ]</span> : '-'}</span>
                        </div>
                        <div className="card-body">
                            <div className='row'>
                                <div className="form-group col-lg-12 col-12">
                                    <label htmlFor="msg_change" className='h6'>เรื่องร้องเรียน</label>
                                    <p style={{ textAlign: 'justify', textIndent: '50px', fontSize: '17px' }}>{formBoard.change}</p>
                                </div>
                                <div className="form-group col-lg-12 col-12">
                                    <label htmlFor="msg_like" className='h6'>เรื่องชื่นชม</label>
                                    <p style={{ textAlign: 'justify', textIndent: '50px', fontSize: '17px' }}>{formBoard.like}</p>
                                </div>
                                {
                                    formBoard.imageComplain != null ?
                                        <div className="form-group col-lg-12 col-12">
                                            <label htmlFor="image" className='h6'>รูปภาพ (สามารถคลิกที่ภาพเพื่อดูภาพเต็มได้)</label>
                                            <div>
                                                <a href={api + '/file/' + formBoard.imageComplain} target={'_blank'}><img id='ComplainImage' src={api + '/file/' + formBoard.imageComplain} style={{ width: '25%', borderRadius: '20px' }} /></a>
                                            </div>
                                        </div>
                                        : ''
                                }
                                <div className="form-group col-lg-12 col-12">
                                    <label htmlFor="deptComment" className='h6'>คำชี้แจงของหน่วยงาน</label>
                                    <p style={{ textAlign: 'justify', textIndent: '50px', fontSize: '17px' }}>{formBoard.deptComment}</p>
                                </div>
                                <div className="form-group col-lg-12 col-12">
                                    <label htmlFor="boradComment" className='h6'>ความคิดเห็นคณะกรรมการ [ปรับแก้ไข]</label>
                                    <textarea rows="5" cols="50" type="text" className="form-control" id="boradComment" placeholder='ความคิดเห็นคณะกรรมการ [ปรับแก้ไข]' value={formBoard.boradComment}
                                        onChange={e => {
                                            setFormBoard({ ...formBoard, boradComment: e.target.value })
                                        }}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </Modal>
                {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL */}
            </div>
        </>
    )
}

export default Boards