import React, { useEffect, useState } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import config from "../../config";
import { Modal, Popconfirm } from "antd";
import * as moment from "moment";
import "moment/locale/th";
moment.locale("th");
import { useRouter } from "next/router";
import io from "socket.io-client";

const api = config.api;
const socket = io(api);

const Agency = (data) => {
  const router = useRouter();
  const [datatable, setDatatable] = React.useState({});
  const [Agency, setAgency] = useState(false);
  const [formReport, setFormReport] = useState({
    id: "",
    report: "",
    username: "",
    change: "",
    like: "",
    urgency_class: "",
    name_type: "",
    imageComplain: "",
  });
  const [isConnected, setIsConnected] = useState(socket.connected);

  // console.log(data.data.status)
  useEffect(() => {
    // let arr =[99,2]
    // ต่อไปต้องทำการ ค้นหาใน Arr ก่อน ถ้าไม่มี ให้เด้งออก
    // kkgkgg
    if (
      data.data.status != "99" &&
      data.data.status != "2" &&
      data.data.status != "3"
    ) {
      router.push({
        pathname: "/main",
        query: {
          path: "dashboard",
          error: "AccessDenied",
        },
      });
    }
    getList();

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL ADD
  const showModal = async (id) => {
    // console.log(id)
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/get-comment-dept-by-id/${id}`, {
        headers: { token: token },
      });
      // console.log(showDataById.todept)

      res.data.map((item, i) => {
        // console.log(item)
        if (item.dept_comment != null) {
          setFormReport({
            ...formReport,
            username: data.data.username,
            id: id,
            change: item.sub_change_text,
            like: item.sub_like_text,
            report: item.dept_comment,
            urgency_class: item.urgency_class,
            name_type: item.nameType,
            imageComplain: item.attack_file,
          });
        } else {
          setFormReport({
            ...formReport,
            username: data.data.username,
            id: id,
            change: item.sub_change_text,
            like: item.sub_like_text,
            report: "",
            urgency_class: item.urgency_class,
            name_type: item.nameType,
            imageComplain: item.attack_file,
          });
        }
      });
    } catch (error) {
      console.log(error);
      // toast.error('เกิดข้อผิดพลาด')
    }

    // console.log(id)
    setAgency(true);
  };

  const handleOk = async () => {
    setAgency(false);
    // console.log(formReport)
    try {
      const token = localStorage.getItem("token");
      let res = await axios.post(
        `${api}/update-report-dept-reply`,
        formReport,
        { headers: { token: token } }
      );
      // console.log(res.data)
      res.data.status == "success"
        ? toast.success("เพิ่มข้อชี้แจงสำเร็จ")
        : toast.error("การเพิ่มข้อชี้แจงล้มเหลว");
      setFormReport({
        id: "",
        report: "",
        username: "",
        change: "",
        like: "",
        urgency_class: "",
        name_type: "",
        imageComplain: "",
      });
      getList();
      socket.emit("dept");
    } catch (error) {
      // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
      console.log(error);
    }
  };

  const handleCancel = () => {
    setAgency(false);
  };
  // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL ADD

  const columns = [
    {
      label: "#",
      field: "id",
    },
    {
      label: "ความสำคัญ",
      field: "urgency_class",
    },
    {
      label: "หัวเรื่อง",
      field: "heading",
    },
    {
      label: "วันที่แอดมินส่งมา",
      field: "staff_upDt",
    },
    {
      label: "คำชี้แจงของหน่วยงาน",
      field: "dept_comment",
    },
    {
      label: "วันที่ชี้แจง",
      field: "dept_upDt",
    },
    {
      label: "action",
      field: "action",
    },
  ];

  //---------------------------------------------------------------------------------------------------------------------------- START GET ALL DATA
  const getList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${api}/get-complainDept-by-id/${data.data.dept}`,
        { headers: { token: token } }
      );
      // console.log(res.data)
      const dataInfo = [];
      res.data.map((item, i) => {
        // console.log(item)
        dataInfo.push({
          id: i + 1,
          urgency_class:
            item.urgency_class == "0" ? (
              <span className="text-warning text-bold">ไม่ได้เลือก</span>
            ) : item.urgency_class == "1" ? (
              <span className="text-danger text-bold">ด่วน</span>
            ) : item.urgency_class == "2" ? (
              <span className="text-success text-bold">ปกติ</span>
            ) : (
              "-"
            ),
          heading: item.name_type != null ? item.name_type : "-",
          staff_upDt:
            item.staff_upDt != null
              ? moment(item.staff_upDt).add(543, "year").format("ll")
              : "-",
          dept_comment: item.dept_comment != null ? item.dept_comment : "-",
          dept_upDt:
            item.dept_upDt != null
              ? moment(item.dept_upDt).add(543, "year").format("ll")
              : "-",
          action: (
            <>
              <div className="btn-group">
                {item.dept_comment == null &&
                item.dept_upBy == null &&
                item.dept_upDt == null ? (
                  <button
                    type="button"
                    className="btn btn-warning btn-sm"
                    onClick={() => showModal(item.id)}
                  >
                    <i className="fa fa-edit" />
                  </button>
                ) : (
                  <button type="button" className="btn btn-success btn-sm">
                    <i className="fa fa-check" />
                  </button>
                )}
                {item.dept_comment != null &&
                item.dept_upDt != null &&
                item.board_comment == null &&
                item.board_upBy == null &&
                item.board_upDt == null ? (
                  <Popconfirm
                    title="คุณต้องการล้างข้อมูลคำชี้แจงนี้หรือไม่?"
                    onConfirm={() => backward(item.id)}
                    okText="ยืนยัน"
                    cancelText="ยกเลิก"
                  >
                    <button type="button" className="btn btn-danger btn-sm">
                      <i className="fa fa-backward" />
                    </button>
                  </Popconfirm>
                ) : (
                  ""
                )}
              </div>
            </>
          ),
        });
      });

      setDatatable({
        columns: columns,
        rows: dataInfo,
      });
    } catch (error) {
      console.log(error);
      // toast.error('เกิดข้อผิดพลาด')
    }
  };
  //---------------------------------------------------------------------------------------------------------------------------- END GET ALL DATA

  //---------------------------------------------------------------------------------------------------------------------------- START BACKWARD DATA
  const backward = async (id) => {
    const backData = {
      id: id,
    };
    try {
      const token = localStorage.getItem("token");
      let res = await axios.post(
        `${api}/update-backward-dept-reply`,
        backData,
        { headers: { token: token } }
      );
      res.data.status == "success"
        ? toast.success("ล้างข้อมูลสำเร็จ")
        : toast.error("ล้างข้อมูลล้มเหลว");
      getList();
      socket.emit("dept");
    } catch (error) {
      // toast.error('เกิดข้อผิดพลาด')
      console.log(error);
    }
  };
  //---------------------------------------------------------------------------------------------------------------------------- END BACKWARD DATA

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
          theme={"colored"}
        />
        <div className="content-header">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-6">
                <h1 className="m-0">คำร้องเรียนของหน่วยงาน</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a>หน้าแรก</a>
                  </li>
                  <li className="breadcrumb-item">คำร้องเรียนของหน่วยงาน</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="card card-white">
              <div className="card-body">
                <div className="table-responsive-lg">
                  <MDBDataTableV5
                    hover
                    entriesOptions={[10, 20, 30, 40, 50]}
                    entries={10}
                    pagesAmount={4}
                    data={datatable}
                    fullPagination
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL ADD */}
        <Modal
          title={null}
          visible={Agency}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="บันทึก"
          cancelText="ยกเลิก"
          width={1000}
        >
          <div>
            <div className="card-header">
              <span className="h4 text-bold">
                เรื่อง...{formReport.name_type}{" "}
              </span>
              <span className="h4 text-bold text-danger">
                {formReport.urgency_class == "0" ? (
                  <span className="text-warning text-bold">[ไม่ได้เลือก]</span>
                ) : formReport.urgency_class == "1" ? (
                  <span className="text-danger text-bold">[ด่วน]</span>
                ) : formReport.urgency_class == "2" ? (
                  <span className="text-success text-bold">[ปกติ]</span>
                ) : (
                  "-"
                )}
              </span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="form-group col-lg-12 col-12">
                  <label htmlFor="msg_change" className="h6">
                    เรื่องร้องเรียน
                  </label>
                  <p
                    style={{
                      textAlign: "justify",
                      textIndent: "50px",
                      fontSize: "17px",
                    }}
                  >
                    {formReport.change}
                  </p>
                </div>
                <div className="form-group col-lg-12 col-12">
                  <label htmlFor="msg_like" className="h6">
                    เรื่องชื่นชม
                  </label>
                  <p
                    style={{
                      textAlign: "justify",
                      textIndent: "50px",
                      fontSize: "17px",
                    }}
                  >
                    {formReport.like}
                  </p>
                </div>
                {formReport.imageComplain != null ? (
                  <div className="form-group col-lg-12 col-12">
                    <label htmlFor="image" className="h6">
                      รูปภาพ (สามารถคลิกที่ภาพเพื่อดูภาพเต็มได้)
                    </label>
                    <div>
                      <a
                        href={api + "/file/" + formReport.imageComplain}
                        target={"_blank"}
                      >
                        <img
                          id="ComplainImage"
                          src={api + "/file/" + formReport.imageComplain}
                          style={{ width: "25%", borderRadius: "20px" }}
                        />
                      </a>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div className="form-group col-lg-12 col-12">
                  <label htmlFor="report" className="h6">
                    คำชี้แจงของหน่วยงาน
                  </label>
                  <textarea
                    rows="5"
                    cols="50"
                    type="text"
                    className="form-control"
                    id="report"
                    placeholder="คำชี้แจงของหน่วยงาน"
                    value={formReport.report}
                    onChange={(e) => {
                      setFormReport({ ...formReport, report: e.target.value });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL ADD */}
      </div>
    </>
  );
};

export default Agency;
