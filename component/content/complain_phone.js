import React, { useEffect, useState } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import config from "../../config";
import * as moment from "moment";
import "moment/locale/th";
moment.locale("th");
import th_TH from "antd/lib/locale/th_TH";
import { ConfigProvider } from "antd";
import { DatePicker } from "antd";
import { Rate } from "antd";
import { Modal, Upload, Popconfirm } from "antd";
import { useRouter } from "next/router";
import { PlusOutlined } from "@ant-design/icons";
import ReactInputMask from "react-input-mask";
import io from "socket.io-client";
import { Select } from "antd";

const api = config.api;
const socket = io(api);

const complainPhone = (data) => {
  const router = useRouter();
  const [datatable, setDatatable] = React.useState({});
  const [dataPhone, setDataPhone] = React.useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [block, setBlock] = useState(true);
  const [blockSend, setBlockSend] = useState(true);
  const [showDataById, setshowDataById] = useState({
    username: "",
    id: "",
    date: "",
    is_agree: "",
    fullname: "",
    tel: "",
    dept: "",
    change: "",
    like: "",
    rate: 1,
    img_complain: "",
    urgencyClass: 0,
  });
  const [sendInfo, setSendInfo] = useState({ id: "", todept: "", type: 0 });
  const [IdComplainDetail, setIdComplainDetail] = useState("");
  const [sendInfoArr, setSendInfoArr] = useState([]);
  const [getDeptAll, setgetDeptAll] = useState([]);
  const [getComplainTypeAll, setgetComplainTypeAll] = useState([]);
  const [AddComplain, setAddComplain] = useState(false);

  const [formAddComplain, setFormAddComplain] = useState({
    username: "admin",
    date: "",
    dept: "",
    fullname: "",
    tel: "",
    typeUser: "",
    like: "",
    change: "",
    rate: 1,
    image: "",
    consent: 1,
  });
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { Option } = Select;

  useEffect(() => {
    if (
      data.data.status != "99" &&
      data.data.status != "8" &&
      data.data.status != "1"
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
    getDept();
    getComplainType();

    //--------------------------------------------------------------------------------------------------------------------- START CONNECT SOCKET
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
    //--------------------------------------------------------------------------------------------------------------------- END CONNECT SOCKET
  }, []);

  {
    /* //--------------------------------------------------------------------------------------------------------------------------------- เริ่ม ส่งข้อมูลไปยังแต่ละแผนก */
  }
  const showModal = async (id) => {
    // console.log(id)
    getComplainDetail(id);
    setIdComplainDetail(id);
    setSendInfo({ ...sendInfo, id: id });
    //---------------------------------------------------------------------------------------------------------------------- START GET COMPLAIN
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/get-admin-complain-by-id/${id}`, {
        headers: { token: token },
      });
      // console.log(showDataById.todept)

      res.data.map((item, i) => {
        if (item.urgency_class > 0) {
          setBlockSend(false);
        } else {
          setBlockSend(true);
        }

        setshowDataById({
          ...showDataById,
          username: data.data.username,
          id: id,
          is_agree: item.is_agree,
          fullname: item.tname != null ? item.tname : "-",
          tel: item.tel != null ? formatPhoneNumber(item.tel) : "-",
          date: moment(item.date_service).add(543, "year").format("LL"),
          dept: item.dept != null ? item.dept : "-",
          change:
            item.sub_change_text != null
              ? item.sub_change_text
              : item.change_text != null
              ? item.change_text
              : "-",
          like:
            item.sub_like_text != null
              ? item.sub_like_text
              : item.like_text != null
              ? item.like_text
              : "-",
          rate: item.rate,
          // urgencyClass: item.urgency_class != null ? item.urgency_class : 0,
          img_complain: item.attack_file,
        });
      });
    } catch (error) {
      console.log(error);
      // toast.error('เกิดข้อผิดพลาด')
    }
    //---------------------------------------------------------------------------------------------------------------------- END GET COMPLAIN

    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    // console.log(showDataById)
    try {
      const token = localStorage.getItem("token");
      let res = await axios.post(`${api}/update-complain-reply`, showDataById, {
        headers: { token: token },
      });
      // console.log(res)
      res.data.status == "success"
        ? toast.success("ส่งข้อมูลสำเร็จ")
        : toast.error("ส่งข้อมูลล้มเหลว");
      setshowDataById({
        username: "",
        id: "",
        date: "",
        is_agree: "",
        fullname: "",
        tel: "",
        dept: "",
        change: "",
        like: "",
        rate: 1,
        img_complain: "",
        urgencyClass: 0,
      });
      setSendInfo({ id: "", todept: "", type: 0 });
      getList();
      socket.emit("adminsent");
    } catch (error) {
      // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  {
    /* //--------------------------------------------------------------------------------------------------------------------------------- จบ ส่งข้อมูลไปยังแต่ละแผนก */
  }

  //---------------------------------------------------------------------------------------------------------------------- START GET COMPLAIN DETAIL
  const getComplainDetail = async (id) => {
    // console.log(sendInfo)
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/get-complain-detail-by-id/${id}`, {
        headers: { token: token },
      });

      if (res.data.length > 0 && showDataById.urgencyClass > 0) {
        setBlockSend(false);
      } else {
        setBlockSend(true);
      }
      setSendInfoArr(res.data);
    } catch (error) {
      console.log(error);
      // toast.error('เกิดข้อผิดพลาด')
    }
  };
  //---------------------------------------------------------------------------------------------------------------------- END GET COMPLAIN DETAIL

  //------------------------------------------------------------------------------------------------- เริ่ม บันทึก แผนก && ประเภท
  const onSubmitData = async () => {
    // console.log(sendInfo)
    try {
      const token = localStorage.getItem("token");
      let res = await axios.post(`${api}/update-complain-detail`, sendInfo, {
        headers: { token: token },
      });
      // console.log(res)
      res.data.status == "success"
        ? toast.success("เพิ่มข้อมูลสำเร็จ")
        : toast.error("เพิ่มข้อมูลล้มเหลว");
      setSendInfo({ ...sendInfo, todept: "", type: 0 });
      setBlock(true);
      getComplainDetail(IdComplainDetail);
    } catch (error) {
      // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
      console.log(error);
    }
  };
  //------------------------------------------------------------------------------------------------- จบ บันทึก แผนก && ประเภท

  const deleteComplainAddByBackend = async (id) => {
    const delData = {
      id: id,
    };

    try {
      const token = localStorage.getItem("token");
      let resA = await axios.post(
        `${api}/delete-complain-by-backend-CH`,
        delData,
        { headers: { token: token } }
      );
      getList();
    } catch (error) {
      console.log(error);
    }

    try {
      const token = localStorage.getItem("token");
      let resB = await axios.post(
        `${api}/delete-complain-by-backend-CD`,
        delData,
        { headers: { token: token } }
      );
      resB.data.status == "success2"
        ? toast.success("ลบข้อมูลสำเร็จ")
        : toast.error("ลบข้อมูลล้มเหลว");
      getList();
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(showDataById)
  const columns = [
    {
      label: "#",
      field: "id",
    },
    {
      label: "วันที่พบเหตุการณ์",
      field: "date",
    },
    {
      label: "แผนก",
      field: "dept",
    },
    {
      label: "คำร้องเรียน",
      field: "change_text",
    },
    {
      label: "คำชม",
      field: "like_text",
    },
    {
      label: "คะแนน",
      field: "rate",
    },
    {
      label: "Action",
      field: "action",
    },
  ];

  //---------------------------------------------------------------------------------------------------------------------------- START GET DATA
  const getList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/get-complain-all`, {
        headers: { token: token },
      });
      // console.log(res)
      const dataInfo = [];
      res.data.map((item, i) => {
        // console.log(item)
        dataInfo.push({
          id: i + 1,
          no: item.no,
          date: moment(item.date_service).add(543, "year").format("ll"),
          dept: item.dept != null ? item.dept : "-",
          change_text:
            item.sub_change_text != null
              ? item.sub_change_text.substring(0, 30) + "..."
              : item.change_text != null
              ? item.change_text.substring(0, 30) + "..."
              : "-",
          like_text:
            item.sub_like_text != null
              ? item.sub_like_text.substring(0, 30) + "..."
              : item.like_text != null
              ? item.like_text.substring(0, 30) + "..."
              : "-",
          rate: (
            <>
              <Rate disabled value={item.rate} />
            </>
          ),
          action: (
            <>
              <div className="btn-group">
                {/* onClick={() => showModalEdit(item.id)} */}
                {/* <button type='button' className='btn btn-warning btn-sm'>
                                        <i className="fa fa-edit" aria-hidden="true" />
                                    </button> */}
                {data.data.status != 1 ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-info btn-sm"
                      onClick={() => showModal(item.id)}
                    >
                      <i className="fa fa-share" aria-hidden="true" />
                    </button>
                    {item.staff_upBy != null && item.staff_upDt != null ? (
                      <button type="button" className="btn btn-success btn-sm">
                        ส่งแล้ว
                      </button>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  ""
                )}

                {item.user_id == "admin" ? (
                  <Popconfirm
                    title="คุณต้องการลบคำร้องเรียนนี้หรือไม่?"
                    onConfirm={() => deleteComplainAddByBackend(item.id)}
                    okText="ยืนยัน"
                    cancelText="ยกเลิก"
                  >
                    <button type="button" className="btn btn-danger btn-sm">
                      <i className="fa fa-trash" />
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

      setDataPhone(dataInfo);
      setDatatable({
        columns: columns,
        rows: dataInfo,
      });
    } catch (error) {
      console.log(error);
      // toast.error('เกิดข้อผิดพลาด')
    }
  };
  //---------------------------------------------------------------------------------------------------------------------------- END GET DATA

  //---------------------------------------------------------------------------------------------------------------------------- START GET DATA
  const getDept = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/get-dept-all`, {
        headers: { token: token },
      });
      setgetDeptAll(res.data);
    } catch (error) {
      console.log(error);
      // toast.error('เกิดข้อผิดพลาด')
    }
  };
  //---------------------------------------------------------------------------------------------------------------------------- END GET DATA

  //---------------------------------------------------------------------------------------------------------------------------- START GET DATA
  const getComplainType = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/get-complain-type-all`, {
        headers: { token: token },
      });
      // console.log(res.data)
      setgetComplainTypeAll(res.data);
    } catch (error) {
      console.log(error);
      // toast.error('เกิดข้อผิดพลาด')
    }
  };
  //---------------------------------------------------------------------------------------------------------------------------- END GET DATA

  //---------------------------------------------------------------------------------------------------------------------------- START FORMAT PHONE NUMBER
  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    // console.log(match)
    if (match) {
      return match[1] + "-" + match[2] + "-" + match[3];
    }
    return phoneNumberString;
  }
  //---------------------------------------------------------------------------------------------------------------------------- END FORMAT PHONE NUMBER

  // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL ADD
  const showAddComplain = () => {
    // setFormAddQA({ ...formAddQA, username: data.data.username })
    setAddComplain(true);
  };

  const handleOkAdd = async () => {
    let postAddDataComplain = {
      user_id: formAddComplain.username,
      date_service: formAddComplain.date,
      dept: formAddComplain.dept,
      type: formAddComplain.typeUser,
      tname: formAddComplain.fullname,
      tel: formAddComplain.tel,
      rate: formAddComplain.rate,
      like_text: formAddComplain.like,
      change_text: formAddComplain.change,
      ok: formAddComplain.consent,
      attackFlie: formAddComplain.image,
    };
    setAddComplain(false);
    // console.log(formAddComplain)
    // console.log(postAddDataComplain)
    try {
      // console.log(formAddQA)
      const token = localStorage.getItem("token");
      let res = await axios.post(`${api}/add-complain`, postAddDataComplain, {
        headers: { token: token },
      });
      // console.log(res.data)
      res.data.status == "ok"
        ? toast.success("เพิ่มข้อมูลร้องเรียนสำเร็จ")
        : toast.error("การเพิ่มข้อมูลล้มเหลว");
      setFormAddComplain({
        username: "admin",
        date: "",
        dept: "",
        fullname: "",
        tel: "",
        typeUser: "",
        like: "",
        change: "",
        rate: 1,
        image: "",
        consent: 1,
      });
      getList();
      setFileList([]);
      socket.emit("complain");
    } catch (error) {
      // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
      console.log(error);
    }
  };

  const handleCancelAdd = () => {
    setAddComplain(false);
  };

  const handleChangeSent = (value) => {
    // console.log(value)
    setSendInfo({ ...sendInfo, todept: value });
    if (value > 0 && sendInfo.type > 0) {
      setBlock(false);
    } else {
      setBlock(true);
    }
  };

  // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL ADD

  const deleteSendTo = async (id) => {
    const delData = {
      id: id,
    };
    // console.log(delData)
    try {
      const token = localStorage.getItem("token");
      let res = await axios.post(`${api}/delete-detail`, delData, {
        headers: { token: token },
      });
      res.data.status == "success"
        ? toast.success("ลบข้อมูลสำเร็จ")
        : toast.error("ลบข้อมูลล้มเหลว");
      getComplainDetail(IdComplainDetail);
    } catch (error) {
      // toast.error('เกิดข้อผิดพลาด')
      console.log(error);
    }
  };

  //---------------------------------------------------------------------------------------------------------------------------------------- add file ant
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleCancels = () => {
    setPreviewVisible(false);
  };
  const handlePreview = async (file) => {
    // console.log(file)
    if (!file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.preview);
    setPreviewVisible(true);
  };

  const handleChange = async ({ fileList: newFileList }) => {
    // image
    setFileList(newFileList);
    if (newFileList[0] != null) {
      // console.log(newFileList[0].type.split('/')[0])
      if (newFileList[0].type.split("/")[0] == "image") {
        let NewBase64 = await getBase64(newFileList[0].originFileObj);
        setFormAddComplain({ ...formAddComplain, image: NewBase64 });
      } else {
        setFormAddComplain({ ...formAddComplain, image: "failed" });
      }
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>ไฟล์แนบ</div>
    </div>
  );
  //---------------------------------------------------------------------------------------------------------------------------------------- add file ant
  const onChange = async (date, dateString) => {
    // console.log(dateString)
    setFormAddComplain({ ...formAddComplain, date: dateString });
  };
  const fnconsent = async (value) => {
    // console.log(value)
    setFormAddComplain({ ...formAddComplain, consent: value });
  };

  return (
    <div className="container-fluid content-header ">
      <div className="row">
        {console.log(dataPhone)}
        {dataPhone.map((item, i) => {
          return (
            <div className="col-sm-12 col-md-12 col-lg-3">
              <div className="card  shadow">
                <div
                  className="card-header"
                  style={{ backgroundColor: "#0C488D" }}
                >
                  <h3 className="card-title" style={{ color: "white" }}>
                    เลขที่ {item.no}
                  </h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="remove"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div>
                    <b>วันที่พบเหตุการณ์</b> : {item.date}
                  </div>
                  <br />
                  <div style={{ marginTop: -10 }}>
                    <b>แผนก :</b> {item.dept}
                  </div>
                  <br />
                  <div style={{ marginTop: -10 }}>
                    <b>คำร้องเรียน :</b> {item.change_text}
                  </div>
                  <br />
                  <div style={{ marginTop: -10 }}>
                    <b>คำชม :</b> {item.like_text}
                  </div>
                  <br />
                  <div
                    className="btn-group btn-block btn-group-toggle"
                    data-toggle="buttons"
                  >
                    <label
                      className="btn btn-info  "
                      onClick={() => showModal(item.id)}
                    >
                      <input
                        type="radio"
                        name="options"
                        id="option_b1"
                        autoComplete="off"
                        defaultChecked
                      />{" "}
                      <i className="fa fa-share" aria-hidden="true" />
                    </label>
                    <label className="btn btn-success">
                      <input
                        type="radio"
                        name="options"
                        id="option_b2"
                        autoComplete="off"
                      />{" "}
                      ส่งแล้ว
                    </label>
                    <Popconfirm
                      title="คุณต้องการลบคำร้องเรียนนี้หรือไม่?"
                      onConfirm={() => deleteComplainAddByBackend(item.id)}
                      okText="ยืนยัน"
                      cancelText="ยกเลิก"
                    >
                      <label className="btn btn-danger">
                        <input
                          type="radio"
                          name="options"
                          id="option_b3"
                          autoComplete="off"
                        />{" "}
                        <i className="fa fa-trash" aria-hidden="true" />
                      </label>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default complainPhone;
