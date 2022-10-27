import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ReactLoading from 'react-loading';
import config from '../../config'
import io from 'socket.io-client';
// import '../../styles/chat.css'
const api = config.api
const socket = io(api);




const Chats = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [dataGroup, setDataGroup] = useState([])
  const [data, setData] = useState([])
  const [dataUser, setDataUser] = useState([])
  const [select, setSelect] = useState('xxx')
  const [isLoading, setIsLoading] = useState(true);
  const [detail, setDetail] = useState('');
  const [imageT, setImageT] = useState('');
  const [name, setName] = useState('');


  useEffect(() => {
    getDataGroup()


    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('message_admin', (user_id) => {
      // // getChat(user_id)
      // console.log('message_admin')
      // console.log(user_id)
      // console.log(select)
      getDataGroup()
      // if (user_id == select) {
      //     getChat(user_id)
      //     console.log('====')

      // }else{
      //   console.log('<>>')

      // }

    });
    // socket.on(select, (user_id) => {
    //     console.log(select)
    //     getChat(user_id)
    // });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, [select])

  const getDataGroup = async () => {
    socket.on('message_admin', (user_id) => {
      // getChat(user_id)
      // console.log('message_admin')
      // console.log(user_id)
      // console.log(select)
      if (user_id == select) {
          getChat(user_id)
          // console.log('====')

      }else{
        console.log('<>>')

      }

    });
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${api}/get-chat-group`, { headers: { "token": token } })
      setDataGroup(res.data)
      console.log(res.data)

    } catch (error) {
      console.log(error)
      // toast.error('เกิดข้อผิดพลาด')
    }
  }

  const getChat = async (user_id) => {
    const token = localStorage.getItem('token')
    // console.log('chat')
    try {
      let res = await axios.get(`${api}/get-chat/${user_id}`, { headers: { "token": token } })
      // console.log(res.data)
      setData(res.data)
      // setDataUser(res.data)
      setIsLoading(false)

    } catch (error) {
      console.log(error)
    }

  }

  const sendMSG = async () => {
    const token = localStorage.getItem('token')

    let post = {
      user_id: select,
      detail: detail,
      staff: 'admin',
      image: null,
      name: 'admin'
    }
    try {
      let res = await axios.post(`${api}/add-chat`, post, { headers: { "token": token } })
      // setData(res.data)
      getChat(select)
      socket.emit('message', { user_id: select, type: 'admin' })
      setDetail('')
      // console.log(user_id)

    } catch (error) {
      console.log(error)
    }
  }

  const onselect = (id, image, name) => {
    // console.log(id)
    setImageT(image)
    setName(name)
    setSelect(id)
    getChat(id)
  }





  return (
    <>
      <style jsx>{`
    /* Chat */
    .chat {
      margin-top: auto;
      margin-bottom: auto;
    }
    
    .card {
      height: 80vh;
      border-radius: 15px !important;
      background-color: rgba(0, 0, 0, 0.4) !important;
    }
    
    .contacts_body {
      padding: 0.75rem 0 !important;
      overflow-y: auto;
      white-space: nowrap;
    }
    
    .msg_card_body {
      overflow-y: auto;
    }
    
    .card-header {
      border-radius: 15px 15px 0 0 !important;
      border-bottom: 0 !important;
    }
    .card-body {
      -ms-flex: 1 1 auto;
      flex: 1 1 auto;
      min-height: 1px;
      padding: 1.25rem;
    }
    
    .card-footer {
      border-radius: 0 0 15px 15px !important;
      border-top: 0 !important;
    }
    
    .container {
      align-content: center;
    }
    
    .search {
      border-radius: 15px 0 0 15px !important;
      background-color: rgba(0, 0, 0, 0.3) !important;
      border: 0 !important;
      color: white !important;
    }
    
    .search:focus {
      box-shadow: none !important;
      outline: 0px !important;
    }
    
    .type_msg {
      background-color: rgba(0, 0, 0, 0.3) !important;
      border: 0 !important;
      color: white !important;
      height: 60px !important;
      overflow-y: auto;
    }
    
    .type_msg:focus {
      box-shadow: none !important;
      outline: 0px !important;
    }
    
    .attach_btn {
      border-radius: 15px 0 0 15px !important;
      background-color: rgba(0, 0, 0, 0.3) !important;
      border: 0 !important;
      color: white !important;
      cursor: pointer;
    }
    
    .send_btn {
      border-radius: 0 15px 15px 0 !important;
      background-color: rgba(0, 0, 0, 0.3) !important;
      border: 0 !important;
      color: white !important;
      cursor: pointer;
    }
    
    .search_btn {
      border-radius: 0 15px 15px 0 !important;
      background-color: rgba(0, 0, 0, 0.3) !important;
      border: 0 !important;
      color: white !important;
      cursor: pointer;
    }
    
    .contacts {
      list-style: none;
      padding: 0;
      padding-top: -10px;
    }
    
    .contacts li {
      width: 100% !important;
      padding: 5px 10px;
      margin-bottom: 15px !important;
    }
    
    .active {
      background-color: rgba(0, 0, 0, 0.3);
    }
    
    .user_img {
      height: 70px;
      width: 70px;
      border: 1.5px solid #f5f6fa;
    
    }
    
    .user_img_msg {
      height: 40px;
      width: 40px;
      border: 1.5px solid #f5f6fa;
    
    }
    
    .img_cont {
      position: relative;
      height: 70px;
      width: 70px;
    }
    
    .img_cont_msg {
      height: 40px;
      width: 40px;
    }
    
    .online_icon {
      position: absolute;
      height: 15px;
      width: 15px;
      background-color: #4cd137;
      border-radius: 50%;
      bottom: 0.2em;
      right: 0.4em;
      border: 1.5px solid white;
    }
    
    .offline {
      background-color: #c23616 !important;
    }
    
    .user_info {
      margin-top: auto;
      margin-bottom: auto;
      margin-left: 15px;
    }
    
    .user_info span {
      font-size: 20px;
      color: white;
    }
    
    .user_info p {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.6);
    }
    
    .video_cam {
      margin-left: 50px;
      margin-top: 5px;
    }
    
    .video_cam span {
      color: white;
      font-size: 20px;
      cursor: pointer;
      margin-right: 20px;
    }
    
    .msg_cotainer {
      margin-top: auto;
      margin-bottom: auto;
      margin-left: 10px;
      border-radius: 25px;
      background-color: #82ccdd;
      padding: 10px;
      position: relative;
    }
    
    .msg_cotainer_send {
      margin-top: auto;
      margin-bottom: auto;
      margin-right: 10px;
      border-radius: 25px;
      background-color: #78e08f;
      padding: 10px;
      position: relative;
    }
    
    .msg_time {
      position: absolute;
      left: 0;
      bottom: -15px;
      color: rgba(255, 255, 255, 0.5);
      font-size: 10px;
    }
    
    .msg_time_send {
      position: absolute;
      right: 0;
      bottom: -15px;
      color: rgba(255, 255, 255, 0.5);
      font-size: 10px;
    }
    
    .msg_head {
      position: relative;
    }
    
    #action_menu_btn {
      position: absolute;
      right: 10px;
      top: 10px;
      color: white;
      cursor: pointer;
      font-size: 20px;
    }
    
    .action_menu {
      z-index: 1;
      position: absolute;
      padding: 15px 0;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      border-radius: 15px;
      top: 30px;
      right: 15px;
      display: none;
    }
    
    .action_menu ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .action_menu ul li {
      width: 100%;
      padding: 10px 15px;
      margin-bottom: 5px;
    }
    
    .action_menu ul li i {
      padding-right: 10px;
    
    }
    
    .action_menu ul li:hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.2);
    }
    
    @media(max-width: 576px) {
      .contacts_card {
        margin-bottom: 15px !important;
      }
    }
    
    
    
    /* end  chat */
      `}</style>

      <div className="container-fluid h-200">
        <div className="row justify-content-center h-100 ">
          <div className="col-md-4 col-xl-3 chat  mt-3">
            <div className="card mb-sm-3 mb-md-0 contacts_card">
              <div className="card-header">
                <div className="input-group">
                  <input type="text" placeholder="Search..." name className="form-control search" />
                  <div className="input-group-prepend">
                    <span className="input-group-text search_btn"><i className="fas fa-search" /></span>
                  </div>
                </div>
              </div>
              <div className="card-bod_y contacts_body">
                {dataGroup.map((item, i) => {
                  return <ui className="contacts" onClick={() => onselect(item.user_id, item.image, item.name)} key={i}>
                    <li className={item.user_id == select ? "active" : ''}>
                      <div className="d-flex bd-highlight">
                        <div className="img_cont">
                          <img src={item.image} className="rounded-circle user_img" />
                          <span className="online_icon" />
                        </div>
                        <div className="user_info">
                          <span>{item.name}</span>
                          <p>Kalid is online</p>
                        </div>
                      </div>
                    </li>

                  </ui>
                })}

              </div>
              <div className="card-footer" />
            </div></div>
          <div className="col-md-8 col-xl-6 chat  mt-3">
            <div className="card">
              <div className="card-header msg_head">
                <div className="d-flex bd-highlight">
                  <div className="img_cont">
                    <img src={imageT} className="rounded-circle user_img" />
                    <span className="online_icon" />
                  </div>
                  <div className="user_info">
                    <span>{name}</span>
                    {/* <p>1767 Messages</p> */}
                  </div>
                  {/* <div className="video_cam">
                                  <span><i className="fas fa-video" /></span>
                                  <span><i className="fas fa-phone" /></span>
                              </div> */}
                </div>
                {/* <span id="action_menu_btn"><i className="fas fa-ellipsis-v" /></span>
                          <div className="action_menu">
                              <ul>
                                  <li><i className="fas fa-user-circle" /> View profile</li>
                                  <li><i className="fas fa-users" /> Add to close friends</li>
                                  <li><i className="fas fa-plus" /> Add to group</li>
                                  <li><i className="fas fa-ban" /> Block</li>
                              </ul>
                          </div> */}
              </div>
              <hr />
              <div>เพิ่มเติม</div>

              {select == '' ? <div></div> :
                <div className="card-body msg_card_body">
                  
                  {isLoading ?
                    <div className="d-flex justify-content-center">
                      <ReactLoading type='spinningBubbles' color='#ffffff' height={'10%'} width={'10%'} />
                    </div> : <div></div>}
                  {data.map((item, i) => {
                    let type_class = item.type == 'client' ?
                      <div className='d-flex justify-content-start mb-4' key={i}>

                        <div className="msg_cotainer">
                          {item.detail}
                          {/* <span className="msg_time">2022-08-24 10:05:47</span> */}
                        </div>
                      </div> :

                      <div className="d-flex justify-content-end mb-4" key={i}>
                        <div className="msg_cotainer_send">
                          {item.detail}
                          {/* <span className="msg_time_send">2022-08-24 10:05:47</span> */}
                        </div>
                        <div className="img_cont_msg">
                          <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" className="rounded-circle user_img_msg" width={20} height={20} />
                        </div>
                      </div>

                    return type_class
                  })}
                </div>}
              <div className="card-footer">
                <div className="input-group">
                  <div className="input-group-append">
                    <span className="input-group-text attach_btn"><i className="fas fa-paperclip" /></span>
                  </div>
                  <textarea name className="form-control type_msg" defaultValue={""} placeholder="พิมพ์ข้อความ..."
                    value={detail} onChange={e => {
                      // setIsCode(false)
                      setDetail(e.target.value)

                    }} />
                  <div className="input-group-append">
                    <span className="input-group-text send_btn" onClick={sendMSG}><i className="fas fa-location-arrow" /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default Chats