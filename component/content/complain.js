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

const Complain_head = (data) => {
  const router = useRouter();
  const [datatable, setDatatable] = React.useState({});
  const [dataPhone, setDataPhone] = React.useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [noGen, setNoGen] = useState("");
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
    /* //--------------------------------------------------------------------------------------------------------------------------------- ??????????????? ????????????????????????????????????????????????????????????????????? */
  }
  const showModal = async (id, noGen) => {
    // console.log(id)
    setNoGen(noGen);
    getComplainDetail(id);
    setIdComplainDetail(id);
    setSendInfo({ ...sendInfo, id: id });
    //---------------------------------------------------------------------------------------------------------------------- START GET COMPLAIN
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/get-admin-complain-by-id/${id}`, {
        headers: { token: token },
      });
      console.log(showDataById.todept);

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
      // toast.error('??????????????????????????????????????????')
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
        ? toast.success("?????????????????????????????????????????????")
        : toast.error("????????????????????????????????????????????????");
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
      // toast.error('???????????????????????????????????????????????????????????????????????????')
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  {
    /* //--------------------------------------------------------------------------------------------------------------------------------- ?????? ????????????????????????????????????????????????????????????????????? */
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
      // toast.error('??????????????????????????????????????????')
    }
  };
  //---------------------------------------------------------------------------------------------------------------------- END GET COMPLAIN DETAIL

  //------------------------------------------------------------------------------------------------- ??????????????? ?????????????????? ???????????? && ??????????????????
  const onSubmitData = async () => {
    // console.log(sendInfo)
    try {
      const token = localStorage.getItem("token");
      let res = await axios.post(`${api}/update-complain-detail`, sendInfo, {
        headers: { token: token },
      });
      // console.log(res)
      res.data.status == "success"
        ? toast.success("???????????????????????????????????????????????????")
        : toast.error("??????????????????????????????????????????????????????");
      setSendInfo({ ...sendInfo, todept: "", type: 0 });
      setBlock(true);
      getComplainDetail(IdComplainDetail);
    } catch (error) {
      // toast.error('???????????????????????????????????????????????????????????????????????????')
      console.log(error);
    }
  };
  //------------------------------------------------------------------------------------------------- ?????? ?????????????????? ???????????? && ??????????????????

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
        ? toast.success("??????????????????????????????????????????")
        : toast.error("?????????????????????????????????????????????");
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
      label: "???????????????????????????????????????????????????",
      field: "date",
    },
    {
      label: "??????????????????",
      field: "no",
    },
    {
      label: "????????????",
      field: "dept",
    },
    {
      label: "?????????????????????????????????",
      field: "change_text",
    },
    {
      label: "????????????",
      field: "like_text",
    },
    {
      label: "???????????????",
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
        dataInfo.push({
          id: i + 1,
          no: item.no,
          staff_upBy: item.staff_upBy,
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
                      onClick={() => showModal(item.id, item.no)}
                    >
                      <i className="fa fa-share" aria-hidden="true" />
                    </button>
                    {item.staff_upBy != null && item.staff_upDt != null ? (
                      <button type="button" className="btn btn-success btn-sm">
                        ?????????????????????
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
                    title="????????????????????????????????????????????????????????????????????????????????????????????????????"
                    onConfirm={() => deleteComplainAddByBackend(item.id)}
                    okText="??????????????????"
                    cancelText="??????????????????"
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
      // toast.error('??????????????????????????????????????????')
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
      // toast.error('??????????????????????????????????????????')
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
      // toast.error('??????????????????????????????????????????')
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
        ? toast.success("??????????????????????????????????????????????????????????????????????????????")
        : toast.error("???????????????????????????????????????????????????????????????");
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
      // toast.error('???????????????????????????????????????????????????????????????????????????')
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
        ? toast.success("??????????????????????????????????????????")
        : toast.error("?????????????????????????????????????????????");
      getComplainDetail(IdComplainDetail);
    } catch (error) {
      // toast.error('??????????????????????????????????????????')
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
      <div style={{ marginTop: 8 }}>?????????????????????</div>
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
              <h1 className="m-0">???????????????????????????????????????????????????????????????</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a>?????????????????????</a>
                </li>
                <li className="breadcrumb-item">???????????????????????????????????????????????????????????????</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* desktop */}
      <div className="d-none d-sm-block">
        <section className="content">
          <div className="container-fluid">
            <div className="card mt-2">
              <div className="card-header">
                {/* <h3 className="card-title"></h3> */}
                <div style={{ textAlign: "right" }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={showAddComplain}
                  >
                    ????????????????????????????????????????????????
                  </button>
                </div>
              </div>
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
      </div>

      {/* end desktop */}

      {/* phone */}
      <div className="d-lg-none">
        <div className="container-fluid content-header ">
          <div className="row">
            {dataPhone.map((item, i) => {
              return (
                <div className="col-sm-12 col-md-12 col-lg-3">
                  <div className="card  shadow">
                    <div
                      className="card-header"
                      style={{ backgroundColor: "#0C488D" }}
                    >
                      <h3 className="card-title" style={{ color: "white" }}>
                        ?????????????????? {item.no}
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
                        <b>???????????????????????????????????????????????????</b> : {item.date}
                      </div>
                      <br />
                      <div style={{ marginTop: -10 }}>
                        <b>???????????? :</b> {item.dept}
                      </div>
                      <br />
                      <div style={{ marginTop: -10 }}>
                        <b>????????????????????????????????? :</b> {item.change_text}
                      </div>
                      <br />
                      <div style={{ marginTop: -10 }}>
                        <b>???????????? :</b> {item.like_text}
                      </div>
                      <br />
                      <div
                        className="btn-group btn-block btn-group-toggle"
                        data-toggle="buttons"
                      >
                        <label
                          className="btn btn-info  "
                          onClick={() => showModal(item.id, item.no)}
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
                        {item.staff_upBy == null ? (
                          ""
                        ) : (
                          <label className="btn btn-success">
                            <input
                              type="radio"
                              name="options"
                              id="option_b2"
                              autoComplete="off"
                            />{" "}
                            ?????????????????????
                          </label>
                        )}
                        {/* <Popconfirm
                          title="????????????????????????????????????????????????????????????????????????????????????????????????????"
                          onConfirm={() => deleteComplainAddByBackend(item.id)}
                          okText="??????????????????"
                          cancelText="??????????????????"
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
                        </Popconfirm> */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* end phone */}

      {/* //--------------------------------------------------------------------------------------------------------------------------------- ??????????????? ???????????????????????????????????????????????????????????????????????? */}
      <Modal
        title="??????????????????????????????????????????????????????????????????????????????/?????????????????????"
        visible={AddComplain}
        onOk={handleOkAdd}
        onCancel={handleCancelAdd}
        okText="??????????????????"
        cancelText="??????????????????"
        width={1000}
      >
        <div className="card-body">
          <div className="row">
            <div className="form-group col-12">
              <label htmlFor="image">????????????????????????????????????</label>
              <ConfigProvider locale={th_TH}>
                <DatePicker className="form-control" onChange={onChange} />
              </ConfigProvider>
              <input
                type="text"
                className="form-control mt-2"
                id="dept"
                placeholder="???????????????????????????????????????"
                value={formAddComplain.dept}
                onChange={(e) => {
                  setFormAddComplain({
                    ...formAddComplain,
                    dept: e.target.value,
                  });
                }}
              />
              <input
                type="text"
                className="form-control mt-2"
                id="fullname"
                placeholder="????????????-???????????? ?????????????????????"
                value={formAddComplain.fullname}
                onChange={(e) => {
                  setFormAddComplain({
                    ...formAddComplain,
                    fullname: e.target.value,
                  });
                }}
              />
              <ReactInputMask
                type="text"
                className="form-control mt-2"
                id="tel"
                placeholder="?????????????????????????????????????????????"
                value={formAddComplain.tel}
                mask="999-999-9999"
                onChange={(e) => {
                  let values = e.target.value.replaceAll("-", "");
                  let value = values.replaceAll("_", "");
                  // console.log(value)
                  setFormAddComplain({ ...formAddComplain, tel: value });
                }}
              />
              <select
                className="browser-default custom-select mt-2"
                id="typeUser"
                value={formAddComplain.typeUser}
                onChange={(e) => {
                  setFormAddComplain({
                    ...formAddComplain,
                    typeUser: e.target.value,
                  });
                }}
              >
                <option value="0">???????????????????????????????????????????????????????????????????????????????????????</option>
                <option value="1">?????????????????????</option>
                <option value="2">????????????</option>
                <option value="3">?????????????????????????????????</option>
                <option value="4">???????????????</option>
              </select>
            </div>
            <div className="form-group col-12">
              <label htmlFor="like">????????????????????????????????????</label>
              <textarea
                rows="5"
                cols="50"
                type="text"
                className="form-control"
                id="like"
                placeholder="????????????????????????????????????"
                value={formAddComplain.like}
                onChange={(e) => {
                  setFormAddComplain({
                    ...formAddComplain,
                    like: e.target.value,
                  });
                }}
              />
            </div>
            <div className="form-group col-12">
              <label htmlFor="change">
                ????????????????????????????????????????????????????????????????????????????????????????????????????????????
              </label>
              <textarea
                rows="5"
                cols="50"
                type="text"
                className="form-control"
                id="change"
                placeholder="????????????????????????????????????????????????????????????????????????????????????????????????????????????"
                value={formAddComplain.change}
                onChange={(e) => {
                  setFormAddComplain({
                    ...formAddComplain,
                    change: e.target.value,
                  });
                }}
              />
            </div>

            <div className="form-group col-12">
              <label htmlFor="rate">???????????????</label>
              <div>
                <Rate
                  value={formAddComplain.rate}
                  onChange={(e) => {
                    setFormAddComplain({ ...formAddComplain, rate: e });
                  }}
                />
              </div>
            </div>

            <div className="form-group col-12">
              <label htmlFor="image">???????????????????????????????????????</label>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                value={formAddComplain.image}
                beforeUpload={() => {
                  return false;
                }}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              {formAddComplain.image == "failed" ? (
                <span className="text-danger">
                  ***????????????????????????????????????????????????????????????????????? [.JPEG , .JPG (.jpg) & PNG (.png)]
                  ????????????????????????***
                </span>
              ) : (
                ""
              )}
              <Modal
                visible={previewVisible}
                title={null}
                footer={null}
                onCancel={handleCancels}
                width={1000}
              >
                <img style={{ width: "100%" }} src={previewImage} />
              </Modal>
            </div>

            <div className="form-group col-12">
              <label htmlFor="consent">????????????????????????</label>
              <div className="row">
                <div className="col-6">
                  <button
                    className={
                      formAddComplain.consent == 0
                        ? "btn btn-outline-danger btn-block active"
                        : "btn btn-outline-danger btn-block"
                    }
                    onClick={() => fnconsent(0)}
                  >
                    ??????????????????????????????????????????????????????????????????
                  </button>
                </div>
                <div className="col-6">
                  <button
                    className={
                      formAddComplain.consent == 1
                        ? "btn btn-outline-success btn-block active"
                        : "btn btn-outline-success btn-block"
                    }
                    onClick={() => fnconsent(1)}
                  >
                    ?????????????????????????????????????????????????????????
                  </button>
                  {/* active */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* //--------------------------------------------------------------------------------------------------------------------------------- ?????? ???????????????????????????????????????????????????????????????????????? */}

      {/* //--------------------------------------------------------------------------------------------------------------------------------- ??????????????? ????????????????????????????????????????????????????????????????????? */}
      <Modal
        title={"?????????????????? " + noGen}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="?????????"
        cancelText="??????????????????"
        okButtonProps={{ disabled: blockSend }}
        width={1200}
      >
        <div className="card-body">
          <div className="row">
            <div className="form-group col-lg-6 col-12">
              <label htmlFor="date">??????????????????????????????</label>
              <input
                type="text"
                className="form-control"
                id="date"
                value={showDataById.date}
                disabled
              />
            </div>
            <div className="form-group col-lg-6 col-12">
              <label htmlFor="dept">????????????</label>
              <input
                type="text"
                className="form-control"
                id="dept"
                value={showDataById.dept}
                disabled
              />
            </div>
            <div className="form-group col-lg-6 col-12">
              <label htmlFor="change">?????????????????????????????????????????????</label>
              <textarea
                rows="5"
                cols="50"
                type="text"
                className="form-control"
                id="change"
                value={showDataById.change}
                onChange={(e) => {
                  setshowDataById({ ...showDataById, change: e.target.value });
                }}
              />
            </div>
            <div className="form-group col-lg-6 col-12">
              <label htmlFor="like">????????????????????????????????????</label>
              <textarea
                rows="5"
                cols="50"
                type="text"
                className="form-control"
                id="like"
                value={showDataById.like}
                onChange={(e) => {
                  setshowDataById({ ...showDataById, like: e.target.value });
                }}
              />
            </div>

            {showDataById.img_complain != null ? (
              <div className="form-group col-lg-12 col-12">
                <label htmlFor="ComplainImage">
                  ?????????????????? (???????????????????????????????????????????????????????????????????????????????????????????????????)
                </label>
                <div>
                  <a
                    href={api + "/file/" + showDataById.img_complain}
                    target={"_blank"}
                  >
                    <img
                      id="ComplainImage"
                      src={api + "/file/" + showDataById.img_complain}
                      style={{ width: "40%", borderRadius: "20px" }}
                    />
                  </a>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="form-group col-lg-4 col-12">
              <label htmlFor="urgencyClass">
                ??????????????????????????????????????? <span className="text-danger">*</span>
              </label>
              <select
                className="browser-default custom-select"
                id="urgencyClass"
                value={showDataById.urgencyClass}
                onChange={(e) => {
                  setshowDataById({
                    ...showDataById,
                    urgencyClass: e.target.value,
                  });
                  // console.log(e.target.value)
                  // console.log(sendInfoArr.length)
                  if (e.target.value > 0 && sendInfoArr.length > 0) {
                    setBlockSend(false);
                  } else {
                    setBlockSend(true);
                  }
                }}
              >
                <option value="0">??????????????????????????????????????????????????????</option>
                <option value="1">????????????</option>
                <option value="2">?????????????????????</option>
              </select>
            </div>
            <div className="form-group col-lg-4 col-12">
              <label htmlFor="agree">????????????????????????</label>
              <input
                type="text"
                className="form-control"
                id="agree"
                value={
                  showDataById.is_agree == 1
                    ? "?????????????????????????????????????????????????????????"
                    : "??????????????????????????????????????????????????????????????????"
                }
                disabled
              />
            </div>
            <div className="form-group col-lg-4 col-12">
              <label htmlFor="rate">???????????????</label>
              <div>
                <Rate disabled value={showDataById.rate} />
              </div>
            </div>
            {showDataById.is_agree == 1 ? (
              <>
                <div className="form-group col-lg-6 col-12">
                  <label htmlFor="fullname">?????????????????????????????????</label>
                  {data.data.private == 1 ? (
                    <input
                      type="text"
                      className="form-control"
                      id="fullname"
                      value={showDataById.fullname}
                      disabled
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      id="fullname"
                      value="?????????????????????????????????????????????????????????????????????????????????????????????"
                      disabled
                    />
                  )}
                </div>
                <div className="form-group col-lg-6 col-12">
                  <label htmlFor="tel">????????????????????????</label>
                  {data.data.private == 1 ? (
                    <input
                      type="text"
                      className="form-control"
                      id="tel"
                      value={showDataById.tel}
                      disabled
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      id="tel"
                      value="?????????????????????????????????????????????????????????????????????????????????????????????????????????"
                      disabled
                    />
                  )}
                </div>
              </>
            ) : (
              ""
            )}
            <div className="form-group col-lg-6 col-12">
              <label htmlFor="todept">
                ???????????? <span className="text-danger">*</span>
              </label>
              {/* <select className="browser-default custom-select" id='todept' value={sendInfo.todept}
                                onChange={e => {
                                    setSendInfo({ ...sendInfo, todept: e.target.value })
                                    if (e.target.value > 0 && sendInfo.type > 0) {
                                        setBlock(false)
                                    } else {
                                        setBlock(true)
                                    }
                                }}
                            >
                                <option value='0'>
                                    ??????????????????????????????????????????
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
                style={{ width: "100%" }}
                placeholder="??????????????? ???????????? ???????????????????????????"
                optionFilterProp="children"
                onChange={handleChangeSent}
                size="large"
                value={sendInfo.todept}
              >
                <Option value="">??????????????????????????????????????????</Option>
                {getDeptAll.map((item, i) => {
                  return (
                    <Option value={item.id} key={i}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
            {/* {console.log(sendInfo)} */}
            <div className="form-group col-lg-5 col-12">
              <label htmlFor="type">
                ????????????????????????????????????????????????????????????????????? <span className="text-danger">*</span>
              </label>
              <select
                className="browser-default custom-select"
                id="type"
                value={sendInfo.type}
                onChange={(e) => {
                  setSendInfo({ ...sendInfo, type: e.target.value });
                  if (e.target.value > 0 && sendInfo.todept > 0) {
                    setBlock(false);
                  } else {
                    setBlock(true);
                  }
                }}
              >
                <option value="0">?????????????????????????????????????????????????????????????????????</option>
                {getComplainTypeAll.map((item, i) => {
                  // console.log(item)
                  return (
                    <option value={item.id} label={item.name} key={i}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-group col-lg-1 col-12">
              <label htmlFor="action">Action</label>
              <div>
                <button
                  id="action"
                  type="button"
                  className="btn btn-info btn-block"
                  disabled={block}
                  onClick={onSubmitData}
                >
                  <i className="fa fa-paper-plane" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="form-group col-lg-12 col-12">
              <div className="card">
                <div className="card-body p-0">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th style={{ width: "50%" }}>????????????</th>
                        <th style={{ width: "40%" }}>
                          ?????????????????????????????????????????????????????????????????????
                        </th>
                        <th style={{ width: "10%" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sendInfoArr.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td>{item.nameDept}</td>
                            <td>{item.nameType}</td>
                            <td>
                              <button
                                id="action"
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteSendTo(item.id)}
                              >
                                <i className="fa fa-trash" aria-hidden="true" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* //--------------------------------------------------------------------------------------------------------------------------------- ?????? ????????????????????????????????????????????????????????????????????? */}
    </div>
  );
};

export default Complain_head;
