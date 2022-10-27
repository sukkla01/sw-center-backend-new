import React, { useState, useEffect } from 'react'
import { Select } from 'antd';
import axios from 'axios'
import config from '../../config'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const api = config.api


const Test = () => {

    const [num, setNum] = useState({ id: '', number: '' })
    const [getDeptAll, setgetDeptAll] = useState([])
    const { Option } = Select;

    const dataChart = [
        {
            "name": "Page A",
            "uv": 4000,
            "pv": 2400,
            "amt": 2400
        },
        {
            "name": "Page B",
            "uv": 3000,
            "pv": 1398,
            "amt": 2210
        },
        {
            "name": "Page C",
            "uv": 2000,
            "pv": 9800,
            "amt": 2290
        },
        {
            "name": "Page D",
            "uv": 2780,
            "pv": 3908,
            "amt": 2000
        },
        {
            "name": "Page E",
            "uv": 1890,
            "pv": 4800,
            "amt": 2181
        },
        {
            "name": "Page F",
            "uv": 2390,
            "pv": 3800,
            "amt": 2500
        },
        {
            "name": "Page G",
            "uv": 3490,
            "pv": 4300,
            "amt": 2100
        }
    ]

    useEffect(() => {
        getDept()
    }, [])

    //---------------------------------------------------------------------------------------------------------------------------- START GET DATA
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
    //---------------------------------------------------------------------------------------------------------------------------- END GET DATA

    const change = (value) => {
        setNum({
            ...num,
            id: '1',
            number: value
        })
    }

    const submit = () => {
        setNum({ id: '', number: '' })
    }

    return (
        <div>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="m-0">หน้าทดสอบ</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a>หน้าทดสอบ</a></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">

                    <div>
                        <LineChart width={730} height={250} data={dataChart} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend verticalAlign="top" height={36} />
                            <Line name="pv of pages" type="monotone" dataKey="pv" stroke="#8884d8" />
                            <Line name="uv of pages" type="monotone" dataKey="uv" stroke="#82ca9d" />
                        </LineChart>
                    </div>
                    <hr />
                    <Select
                        showSearch
                        style={{ width: 300 }}
                        placeholder="Search to Select"
                        optionFilterProp="children"
                        onChange={change}
                        value={num.number}
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

                    <button className='btn btn-sm btn-info' onClick={submit}>
                        บันทึก
                    </button>

                    <hr />
                    <br />
                    <div>
                        <div>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', marginTop: '6.0pt', marginRight: '0cm', marginBottom: '3.0pt', marginLeft: '0cm', lineHeight: '21.0pt' }}><span style={{ fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', marginTop: '6.0pt', textAlign: 'center', lineHeight: '21.0pt' }}><strong><span style={{ fontSize: 39, fontFamily: '"TH SarabunPSK",sans-serif' }}>บันทึกข้อความ</span></strong></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', marginTop: '6.0pt' }}><strong><span style={{ fontSize: 27, fontFamily: '"TH SarabunPSK",sans-serif' }}>ส่วนราชการ</span></strong><span style={{ fontSize: 27, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp;</span><u><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>กลุ่มงานสารสนเทศทางการแพทย์ &nbsp;ศูนย์ ไอซีที</span></u><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; โทร</span><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>.<strong>&nbsp; &nbsp; &nbsp; &nbsp;2143&nbsp;</strong></span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif' }}><strong><span style={{ fontSize: 27, fontFamily: '"TH SarabunPSK",sans-serif' }}>ที่</span></strong><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; สท&nbsp;</span><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>0032.202.1 / &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><strong><span style={{ fontSize: 27, fontFamily: '"TH SarabunPSK",sans-serif' }}>วันที่</span></strong><strong><span style={{ fontSize: 25, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp;</span></strong><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; สิงหาคม 2565 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif' }}><strong><span style={{ fontSize: 27, fontFamily: '"TH SarabunPSK",sans-serif' }}>เรื่อง</span></strong><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp;รายงานการออกนอกเขตจังหวัด</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', marginTop: '6.0pt', marginRight: '0cm', marginBottom: '.0001pt', marginLeft: '36.0pt', textIndent: '-36.0pt' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>เรียน</span><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp;&nbsp;ผู้ว่าราชการจังหวัดสุโขทัย&nbsp;</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', marginTop: '8.0pt' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>1.&nbsp;ข้าพเจ้า..........นายสุจินต์ สุกกล้า............................ตำแหน่ง...........นักวิชาการคอมพิวเตอร์ปฏิบัติการ................</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp;โทรศัพท์เคลื่อนที่.....0931368858..............................ผู้ปฏิบัติราชการแทนคือ.......นายชลทิตย์ ทักท้วง.............</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp;และคณะ จำนวน.....1.........คน สังกัด โรงพยาบาลศรีสังวรสุโขทัย สำนักงานสาธารณสุขจังหวัดสุโขทัย ดังนี้</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', lineHeight: '115%' }}><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;1.1.......นายกนต์ธร โทนทรัพย์........................................ตำแหน่ง........นักวิชาการคอมพิวเตอร์........</span><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>..........</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', lineHeight: '115%' }}><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;โทรศัพท์เคลื่อนที่.......0820893614....ผู้ปฏิบัติราชการแทนคือ........นายกฤษฎา อนันตะ</span><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>........................... &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;1.2.......................................................................................ตำแหน่ง............................................................</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', lineHeight: '115%' }}><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;โทรศัพท์เคลื่อนที่.................................ผู้ปฏิบัติราชการแทนคือ.............................</span><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>....................................... &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;1.3.......................................................................................ตำแหน่ง............................................................</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', lineHeight: '115%' }}><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;โทรศัพท์เคลื่อนที่.................................ผู้ปฏิบัติราชการแทนคือ.............................</span><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>.......................................</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', lineHeight: '115%' }}><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;1.</span><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>4.......................................................................................ตำแหน่ง............................................................</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', lineHeight: '115%' }}><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;โทรศัพท์เคลื่อนที่.................................ผู้ปฏิบัติราชการแทนคือ.............................</span><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>.......................................</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', lineHeight: '115%' }}><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;1.</span><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>5.......................................................................................ตำแหน่ง............................................................</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', lineHeight: '115%' }}><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;โทรศัพท์เคลื่อนที่.................................ผู้ปฏิบัติราชการแทนคือ.............................</span><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>.......................................</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', marginTop: '6.0pt' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>2. ขอรายงานการเดินทางออกนอกเขตจังหวัดเพื่อ....อบรมเชิงปฏิบัติการเพื่อพัฒนาศักยภาพการรักษาความมั่นคงปลอดภัยไซเบอร์ของโรงพยาบาลเขตสุขภาพที่ 2 ปีงบประมาณ 2565......................................................</span><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>..........</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>3. สถานที่ที่เดินทางไป..........สสจ.พิษณุโลก.....................................................................................................</span><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>.........</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>4. กำหนดเวลาตั้งแต่วันที่.....15 สิงหาคม 2565.........ถึงวันที่.......17 สิงหาคม 2565......................................</span><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>.......</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>5. จึงเรียนมาเพื่อโปรดทราบ/จึงเรียนมาเพื่อโปรดอนุมัติ (กรณีขออนุญาตไปราชการ)</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', marginTop: '18.0pt' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;(ลงชื่อ).......................................................</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;(......นายสุจินต์ สุกกล้า................)</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;ตำแหน่ง...นักวิชาการคอมพิวเตอร์ปฏิบัติการ........</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp;</span></p>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif' }}><span style={{ fontSize: 27, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp;</span></p>
                            <table style={{ borderCollapse: 'collapse', border: 'none' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '239.8pt', padding: '0cm 5.4pt', verticalAlign: 'top' }}>
                                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>เรียน ผู้อำนวยการฯ</span></p>
                                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp;เพื่อโปรดทราบ/อนุมัติ &nbsp;</span></p>
                                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', marginTop: '18.0pt', lineHeight: '115%' }}><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;........................................... &nbsp;&nbsp;</span></p>
                                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', lineHeight: '115%' }}><span style={{ fontSize: 21, lineHeight: '115%', fontFamily: '"TH SarabunPSK",sans-serif' }}>หัวหน้าฝ่าย/กลุ่มงาน/....................... &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span></p>
                                        </td>
                                        <td style={{ width: '239.85pt', padding: '0cm 5.4pt', verticalAlign: 'top' }}>
                                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', textAlign: 'center' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>ทราบ/อนุมัติ</span></p>
                                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', textAlign: 'center' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp;</span></p>
                                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', textAlign: 'center' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp;</span></p>
                                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', marginTop: '12.0pt', textAlign: 'center' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>...........................................</span></p>
                                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', textAlign: 'center' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>(...............................................)</span></p>
                                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif', textAlign: 'center' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>ปฏิบัติราชการแทนผู้ว่าราชการจังหวัดสุโขทัย</span></p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p style={{ margin: '0cm', fontSize: 16, fontFamily: '"Times New Roman",serif' }}><span style={{ fontSize: 21, fontFamily: '"TH SarabunPSK",sans-serif' }}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span></p>
                        </div>

                    </div>

                </div>
            </section>
        </div>
    )
}

export default Test