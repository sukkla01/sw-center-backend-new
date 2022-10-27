import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import moment from "moment";
import axios from "axios";
import config from "../config";
import Dashboard from "../component/content/dashboard";
import Controluser from "../component/content/controluser";
import Qa from "../component/content/qa";
import Deptadd from "../component/content/deptadd";
import Complain_head from "../component/content/complain";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Agency from "../component/content/agency";
import Boards from "../component/content/board";
import Chats from "../component/Jub/Chat";
import { Modal } from "antd";
import io from "socket.io-client";
import Test from "../component/content/test";
import Report_complaints from "../component/content/report_complaints";
import Complain_phone from "../component/content/complain_phone";

const api = config.api;
const socket = io(api);

const Main = () => {
  const router = useRouter();
  const { path, error } = router.query;
  const [Token, setToken] = useState("");
  const [profile, setProfile] = useState({});
  const [editPassword, seteditPassword] = useState(false);
  const [oldPassword, setoldPassword] = useState("");
  const [inputPassword, setinputPassword] = useState("");
  const [typeCheck, setTypeCheck] = useState(0);
  const [passwordNew, setpasswordNew] = useState({
    cid: "",
    username: "",
    newPassword: "",
    newPasswordConfrim: "",
  });
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [numberNotiComplain, setNumberNotiComplain] = useState(0);
  const [numberNotiDept, setNumberNotiDept] = useState(0);
  const [numberNotiBoard, setNumberNotiBoard] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token == null) {
      back();
    }

    const decodeToken = jwt_decode(token);
    setToken(token);
    setProfile(decodeToken);

    // console.log(decodeToken.dept)

    complainNumberNoti();
    DeptNumberNoti(decodeToken.dept);
    BoardNumberNoti();

    // ------------------------------------------------------------------------------------------------- START CONNECT SOCKET
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    // ------------------------------------------------------------------------------------------------- END CONNECT SOCKET

    socket.on("notifyNumberComplain", () => {
      complainNumberNoti();
    });

    socket.on("notifyNumberAdminSent", () => {
      complainNumberNoti();
      DeptNumberNoti(decodeToken.dept);
    });

    socket.on("notifyNumberDept", () => {
      DeptNumberNoti(decodeToken.dept);
      BoardNumberNoti();
    });

    socket.on("notifyNumberBoard", () => {
      BoardNumberNoti();
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  // --------------------------------------------------------------------------------------------------------------------------- START GET NUMBER NOTIFY
  const complainNumberNoti = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/get-notify-Number-Complain`, {
        headers: { token: token },
      });
      // console.log(res.data[0].numberComplain)
      setNumberNotiComplain(res.data[0].numberComplain);
    } catch (error) {
      console.log(error);
    }
  };

  const DeptNumberNoti = async (id) => {
    // console.log(id)
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/get-notify-Number-dept/${id}`, {
        headers: { token: token },
      });
      // console.log(res.data)
      setNumberNotiDept(res.data[0].numberDept);
    } catch (error) {
      console.log(error);
    }
  };

  const BoardNumberNoti = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/get-notify-Number-board`, {
        headers: { token: token },
      });
      // console.log(res.data[0].numberComplain)
      setNumberNotiBoard(res.data[0].numberBoard);
    } catch (error) {
      console.log(error);
    }
  };
  // --------------------------------------------------------------------------------------------------------------------------- END GET NUMBER NOTIFY

  // ---------------------------------------------------------------------------------------------------------------------------- START ALL ROUTER
  const Home = () => {
    router.push({
      pathname: "/main",
      query: {
        path: "dashboard",
      },
    });
  };

  const ControlUser = () => {
    router.push({
      pathname: "/main",
      query: {
        path: "controluser",
      },
    });
  };

  const QA = () => {
    router.push({
      pathname: "/main",
      query: {
        path: "QA",
      },
    });
  };

  const dept = () => {
    router.push({
      pathname: "/main",
      query: {
        path: "dept",
      },
    });
  };

  const Complain = () => {
    router.push({
      pathname: "/main",
      query: {
        path: "complain",
      },
    });
  };

  const agencyProblems = () => {
    router.push({
      pathname: "/main",
      query: {
        path: "agencyProblems",
      },
    });
  };

  const Board = () => {
    router.push({
      pathname: "/main",
      query: {
        path: "board",
      },
    });
  };

  const Report_Complaints = () => {
    router.push({
      pathname: "/main",
      query: {
        path: "Report-Complaints",
      },
    });
  };

  const Chat = () => {
    router.push({
      pathname: "/main",
      query: {
        path: "chat",
      },
    });
  };

  const back = () => {
    router.push({
      pathname: "/",
    });
  };

  const logOut = () => {
    localStorage.removeItem("token");
    router.push({
      pathname: "/",
    });
  };
  // ---------------------------------------------------------------------------------------------------------------------------- END ALL ROUTER

  //--------------------------------------------------------------------------------------------------------------------- START EDIT AND NEW PASSWORD
  const showModal = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/get-user/${data.cid}`, {
        headers: { token: token },
      });
      // console.log(res.data[0])
      // console.log(profile.username)
      setoldPassword(res.data[0].usr_password);
      setpasswordNew({
        ...passwordNew,
        cid: res.data[0].usr_cid,
        username: profile.username,
      });
    } catch (error) {
      console.log(error);
    }
    seteditPassword(true);
  };

  const handleOk = async () => {
    if (
      passwordNew.newPassword.length > 0 &&
      passwordNew.newPasswordConfrim.length > 0
    ) {
      if (passwordNew.newPassword == passwordNew.newPasswordConfrim) {
        try {
          const token = localStorage.getItem("token");
          let res = await axios.post(
            `${api}/edit-password-by-person`,
            passwordNew,
            { headers: { token: token } }
          );
          logOut();
          // console.log(res)
          // res.data.status == 'success' ? toast.success('แก้ไขรหัสผ่านสำเร็จ') : toast.error('แก้ไขรหัสผ่านล้มเหลว')
        } catch (error) {
          // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
          console.log(error);
        }
      } else {
        toast.error("รหัสผ่านไม่ตรงกัน กรุณากรอกใหม่");
      }
    }
  };

  const handleCancel = () => {
    seteditPassword(false);
  };

  const onCheck = () => {
    if (inputPassword == oldPassword) {
      setTypeCheck(1);
    } else {
      toast.error("รหัสผ่านไม่ถูกต้อง");
    }
  };
  //--------------------------------------------------------------------------------------------------------------------- END EDIT AND NEW PASSWORD

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
        theme={"colored"}
      />
      {Token == null || Token == "" ? (
        ""
      ) : (
        <div className="wrapper">
          {/* --------------------------------------------------------------------------------------------------------------------------------------------- NAV */}
          <nav
            className="main-header navbar navbar-expand navbar-white navbar-light"
            style={{ zIndex: 5 }}
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" data-widget="pushmenu" role="button">
                  <i className="fas fa-bars" />
                </a>
              </li>
              <li className="nav-item d-none d-sm-inline-block">
                <a className="nav-link" onClick={Home}>
                  หน้าแรก
                </a>
              </li>
            </ul>

            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" onClick={() => showModal(profile)}>
                  <i className="fa fa-cogs" />
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link">
                  <i className="far fa-bell" />
                  <span className="badge badge-danger navbar-badge">
                    {numberNotiComplain + numberNotiDept + numberNotiBoard > 0
                      ? profile.status == 99
                        ? numberNotiComplain + numberNotiDept + numberNotiBoard
                        : profile.status == 8
                        ? numberNotiComplain
                        : profile.status == 3
                        ? numberNotiBoard + numberNotiDept
                        : profile.status == 2
                        ? numberNotiDept
                        : profile.status == 1
                        ? numberNotiComplain
                        : ""
                      : ""}
                  </span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-widget="fullscreen" role="button">
                  <i className="fas fa-expand-arrows-alt" />
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={logOut}>
                  <i className="fas fa-sign-out-alt" />
                </a>
              </li>
            </ul>

            {/* //------------------------------------------------------------------------------------------------------------------------ START EDIT PASSWORD */}
            <Modal
              title="เปลี่ยนรหัสผ่าน"
              footer={null}
              visible={editPassword}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              {typeCheck == 0 ? (
                <>
                  <div className="form-group col-lg-12 col-12">
                    <label htmlFor="passwordOld">รหัสผ่านเดิม</label>
                    <input
                      type="password"
                      className="form-control"
                      id="passwordOld"
                      placeholder="รหัสผ่านเดิม"
                      onChange={(e) => {
                        setinputPassword(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group col-lg-12 col-12">
                    <button
                      className="btn btn-info btn-sm btn-block"
                      onClick={onCheck}
                    >
                      ยืนยัน
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="row">
                    <div className="form-group col-lg-12 col-12">
                      <label htmlFor="passwordNew">รหัสผ่านใหม่</label>

                      <input
                        type="password"
                        className="form-control"
                        id="passwordNew"
                        placeholder="รหัสผ่านใหม่"
                        onChange={(e) => {
                          setpasswordNew({
                            ...passwordNew,
                            newPassword: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="form-group col-lg-12 col-12">
                      <label htmlFor="passwordConfirm">
                        ยืนยันรหัสผ่านใหม่{" "}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="passwordConfirm"
                        placeholder="ยืนยันรหัสผ่านใหม่"
                        onChange={(e) => {
                          setpasswordNew({
                            ...passwordNew,
                            newPasswordConfrim: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="form-group col-lg-12 col-12">
                      <button
                        className="btn btn-info btn-sm btn-block"
                        onClick={handleOk}
                      >
                        บันทึก
                      </button>
                    </div>
                  </div>
                </>
              )}
            </Modal>
            {/* //------------------------------------------------------------------------------------------------------------------------ START EDIT PASSWORD */}
          </nav>
          {/* --------------------------------------------------------------------------------------------------------------------------------------------- NAV */}

          {/* --------------------------------------------------------------------------------------------------------------------------------------------- SIDEBAR */}
          <aside className="main-sidebar sidebar-dark-primary elevation-4">
            <a className="brand-link" onClick={Home}>
              <img
                src="static/dist/img/logo.png"
                alt="AdminLTE Logo"
                className="brand-image img-circle elevation-3"
                style={{ opacity: ".8" }}
              />
              <span className="brand-text font-weight-light">
                รพ.ศรีสังวร ร้องเรียน
              </span>
            </a>
            <div className="sidebar">
              <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                <div className="image">
                  <img
                    src="static/dist/img/default.jpg"
                    className="img-circle elevation-2"
                    alt="User Image"
                  />
                </div>
                <div className="info">
                  <a className="d-block" onClick={Home}>
                    {profile.fullname}
                  </a>
                </div>
              </div>
              {/* <div className="form-inline">
                                    <div className="input-group" data-widget="sidebar-search">
                                        <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                                        <div className="input-group-append">
                                            <button className="btn btn-sidebar">
                                                <i className="fas fa-search fa-fw" />
                                            </button>
                                        </div>
                                    </div>
                                </div> */}
              <nav className="mt-2">
                <ul
                  className="nav nav-pills nav-sidebar flex-column"
                  data-widget="treeview"
                  role="menu"
                  data-accordion="false"
                >
                  {profile.status == "99" || profile.status == "8" ? (
                    <li className="nav-header">Setting And Control</li>
                  ) : (
                    ""
                  )}

                  {profile.status == "99" || profile.status == "8" ? (
                    <li className="nav-item">
                      <a
                        className={
                          path == "controluser" ? "nav-link active" : "nav-link"
                        }
                        onClick={ControlUser}
                      >
                        <i className="nav-icon fa fa-cogs" />
                        <p>จัดการผู้ใช้งาน</p>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  {profile.status == "99" || profile.status == "8" ? (
                    <li className="nav-item">
                      <a
                        className={
                          path == "dept" ? "nav-link active" : "nav-link"
                        }
                        onClick={dept}
                      >
                        <i className="nav-icon fa fa-plus-circle " />
                        <p>เพิ่มแผนก</p>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  {profile.status == "99" || profile.status == "8" ? (
                    <li className="nav-item">
                      <a
                        className={
                          path == "QA" ? "nav-link active" : "nav-link"
                        }
                        onClick={QA}
                      >
                        <i className="nav-icon fa fa-question" />
                        <p>ถาม ตอบ</p>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  <li className="nav-header">Functional</li>

                  {profile.status == "99" ||
                  profile.status == "8" ||
                  profile.status == "1" ? (
                    <li className="nav-item">
                      <a
                        className={
                          path == "complain" ? "nav-link active" : "nav-link"
                        }
                        onClick={Complain}
                      >
                        <i className="nav-icon fa fa-comment" />
                        <p>คำร้องเรียน</p>
                        {numberNotiComplain > 0 ? (
                          <span className="right badge badge-danger">
                            {numberNotiComplain}
                          </span>
                        ) : (
                          ""
                        )}
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  {profile.status == "99" ||
                  profile.status == "2" ||
                  profile.status == "3" ? (
                    <li className="nav-item">
                      <a
                        className={
                          path == "agencyProblems"
                            ? "nav-link active"
                            : "nav-link"
                        }
                        onClick={agencyProblems}
                      >
                        <i className="nav-icon fa fa-comment" />
                        <p>คำร้องเรียนของหน่วยงาน</p>
                        {numberNotiDept > 0 ? (
                          <span className="right badge badge-danger">
                            {numberNotiDept}
                          </span>
                        ) : (
                          ""
                        )}
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  {profile.status == "99" || profile.status == "3" ? (
                    <li className="nav-item">
                      <a
                        className={
                          path == "board" ? "nav-link active" : "nav-link"
                        }
                        onClick={Board}
                      >
                        <i className="nav-icon fa fa-comment" />
                        <p>คณะกรรมการ</p>
                        {numberNotiBoard > 0 ? (
                          <span className="right badge badge-danger">
                            {numberNotiBoard}
                          </span>
                        ) : (
                          ""
                        )}
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  {profile.status == "99" ? (
                    <li className="nav-item">
                      <a
                        className={
                          path == "chat" ? "nav-link active" : "nav-link"
                        }
                        onClick={Chat}
                      >
                        <i className="nav-icon fa fa-comments" />
                        <p>แชท</p>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}

                  {profile.status == "99" || profile.status == "3" ? (
                    <>
                      <li className="nav-header">Report</li>
                      <li className="nav-item">
                        <a
                          className={
                            path == "Report-Complaints"
                              ? "nav-link active"
                              : "nav-link"
                          }
                          onClick={Report_Complaints}
                        >
                          <i className="nav-icon fas fa-chart-pie" />
                          <p>รายงาน</p>
                        </a>
                      </li>
                    </>
                  ) : (
                    ""
                  )}
                  <li className="nav-header">Manual</li>

                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="static/dist/manual/manual.pdf"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      <i className="nav-icon fa fa-file-pdf" />
                      <p>คู่มือการใช้งานระบบ</p>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
          {/* --------------------------------------------------------------------------------------------------------------------------------------------- SIDEBAR */}

          {/* --------------------------------------------------------------------------------------------------------------------------------------------- CONTENT */}
          <div className="content-wrapper">
            {path == "controluser" ? (
              <Controluser data={profile} />
            ) : path == "complain" ? (
              <Complain_head data={profile} />
            ) : path == "agencyProblems" ? (
              <Agency data={profile} />
            ) : path == "dept" ? (
              <Deptadd data={profile} />
            ) : path == "QA" ? (
              <Qa data={profile} />
            ) : path == "chat" ? (
              <Chats />
            ) : path == "board" ? (
              <Boards data={profile} />
            ) : path == "Report-Complaints" ? (
              <Report_complaints data={profile} />
            ) : path == "test" ? (
              <Test />
            ) : path == "complain_phone" ? (
              <Complain_phone data={profile} />
            ) : (
              <Dashboard data={profile} />
            )}
          </div>
          {/* --------------------------------------------------------------------------------------------------------------------------------------------- CONTENT */}

          {/* --------------------------------------------------------------------------------------------------------------------------------------------- FOOTER */}
          <footer className="main-footer">
            <strong>
              Copyright © 2021 - {moment().format("YYYY")}{" "}
              <a
                href="https://www.facebook.com/profile.php?id=100080703297745"
                target={"_blank"}
                rel="noreferrer"
              >
                กนต์ธร โทนทรัพย์
              </a>{" "}
              All rights reserved.
            </strong>
            <div className="float-right d-none d-sm-inline-block">
              <b>Version</b> 0.0.3
            </div>
          </footer>
          {/* --------------------------------------------------------------------------------------------------------------------------------------------- FOOTER */}
        </div>
      )}
    </div>
  );
};

export default Main;
