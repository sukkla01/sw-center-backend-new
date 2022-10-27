import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import config from '../config'
import { ToastContainer, toast, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const api = config.api

const Login = () => {

    const [dataLogin, setDataLogin] = useState({ username: '', password: '' })
    const [Token, setToken] = useState('')
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token == null) {
            router.push({
                pathname: '/',
            })
        } else {
            setToken(token)
            router.push({
                pathname: '/main',
                query: {
                    path: 'dashboard'
                },
            })
        }
    }, [])

    //------------------------------------------------------------------------------------------------------- START LOGIN
    const onSubmit = async () => {
        let data = JSON.stringify({
            username: dataLogin.username,
            password: dataLogin.password
        })

        // console.log(data)

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow_origin': '*'
            }
        }

        try {
            let res = await axios.post(`${api}/signin`, data, axiosConfig)
            // console.log(res)
            localStorage.setItem('token', res.data.token)
            // console.log(res)
            router.push({
                pathname: '/main',
                query: {
                    path: 'dashboard'
                },
            })
        } catch (error) {
            if (error.response.data == 'Bad Request') {
                toast.error('กรุณากรอกข้อมูลให้ครบถ้วน!')
            } else {
                if (error.response.data.error.message == 'userError') {
                    toast.error('username ไม่ถูกต้อง!')
                }
                if (error.response.data.error.message == 'passError') {
                    toast.error('password ไม่ถูกต้อง!')
                }
                if (error.response.data.error.message == 'statusError') {
                    toast.error('คุณยังไม่ได้รับอนุญาตเข้าใช้งานระบบ')
                }
            }
        }
    }
    //------------------------------------------------------------------------------------------------------- END LOGIN


    return (
        <>
            {
                Token == null || Token == '' ?
                    <div className='hold-transition login-page bgimg'>
                        <ToastContainer
                            position="top-center"
                            autoClose={5000}
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
                        <div className="login-box">
                            <div className="card card-outline card-success">
                                <div className="card-header text-center">
                                    <span className="h1"><b>ระบบร้องเรียน</b></span>
                                </div>
                                <form action=''>
                                    <div className="card-body">
                                        <div className="input-group mb-3">
                                            <input type="text" className="form-control" placeholder="Username"
                                                value={dataLogin.username} onChange={e => { setDataLogin({ ...dataLogin, username: e.target.value }) }}
                                            />
                                            <div className="input-group-append">
                                                <div className="input-group-text">
                                                    <span className="fas fa-user" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="input-group mb-3">
                                            <input type="password" className="form-control" placeholder="Password"
                                                value={dataLogin.password} onChange={e => { setDataLogin({ ...dataLogin, password: e.target.value }) }}
                                            />
                                            <div className="input-group-append">
                                                <div className="input-group-text">
                                                    <span className="fas fa-lock" />
                                                </div>
                                            </div>
                                        </div>

                                        <button type="submit" className="btn btn-success btn-block"
                                            onClick={e => {
                                                e.preventDefault()
                                                onSubmit()
                                            }} >
                                            เข้าสู่ระบบ
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    : ''
            }
        </>
    )
}

export default Login