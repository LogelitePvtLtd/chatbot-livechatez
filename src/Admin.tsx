
import './Chat.css';
import './App.css';
import  { useState, useEffect  } from 'react';
import socketIO from "socket.io-client";
import Adminmessage from "./Components/Adminmessage";

const ENDPOINT = "ws://localhost:4500/";
const socket = socketIO(ENDPOINT);

const Admin = () => {

  //States for chat
  const [id, setid] = useState("");
  const [messages, setMessages] = useState([] as string[])

  const [input, setInput] = useState("");
  const user = "Admin"
  const scrollingDown = () => {
    const x = document.querySelector<HTMLIFrameElement>(".chatContainerScroll");
    if (x) {
        var child = document.querySelector<HTMLElement>("#chatEnd")
         if(child){
            x.scrollTo({
                top: child.offsetTop,
                behavior: "smooth"
              });
         }

    }
  };

  
  const send = () => {
    socket.emit('message', {'user':user,'message':input,'id':id});
    setInput("")
  }
  const handleKeyPress = (e:any) => {
    if (e.key === 'Enter' && input.trim().length>0) {
      e.preventDefault();
      send()
    }
  };
 
 
  useEffect(() => {
      socket.on('connect', () => {
          setid(socket.id);
      })
      socket.emit('joined',  {user})
      socket.on('welcome', (data) => {
          setMessages([...messages, data]);
          setid(socket.id);
      })
      socket.on('userJoined', (data) => {
          setMessages([...messages, data]);
          setid(socket.id);
      })
      socket.on('leave', (data) => {
          setMessages([...messages, data]);
      })
     
  }, [])

  useEffect(() => {
      socket.on('sendMessage', (data) => {
          setMessages([...messages, data]);
          scrollingDown()
      })
      return () => {
          socket.off();
      }
  }, [messages])
  return (
    <>
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"></link>
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet"/>
      <div className="container">

          <div className="page-title">
              <div className="row gutters">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                      <h5 className="title mt-4">Chat App</h5>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12"> </div>
              </div>
          </div>

          <div className="content-wrapper mt-3">

              <div className="row gutters">

                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">

                      <div className="card m-0">

                          <div className="row no-gutters">
                              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3 d-none" >
                                  <div className="users-container">
                                      <div className="chat-search-box">
                                          <div className="input-group">
                                              <input className="form-control" placeholder="Search"/>
                                              <div className="input-group-btn">
                                                  <button type="button" className="btn btn-info">
                                                      <i className="fa fa-search"></i>
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                      <ul className="users">
                                          <li className="person" data-chat="person1">
                                              <div className="user">
                                                  <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin"/>
                                                  <span className="status busy"></span>
                                              </div>
                                              <p className="name-time">
                                                  <span className="name">Steve Bangalter</span>
                                                  <span className="time">15/02/2019</span>
                                              </p>
                                          </li>
                                          <li className="person" data-chat="person1">
                                              <div className="user">
                                                  <img src="https://www.bootdey.com/img/Content/avatar/avatar1.png" alt="Retail Admin"/>
                                                  <span className="status offline"></span>
                                              </div>
                                              <p className="name-time">
                                                  <span className="name">Steve Bangalter</span>
                                                  <span className="time">15/02/2019</span>
                                              </p>
                                          </li>
                                          <li className="person active-user" data-chat="person2">
                                              <div className="user">
                                                  <img src="https://www.bootdey.com/img/Content/avatar/avatar2.png" alt="Retail Admin"/>
                                                  <span className="status away"></span>
                                              </div>
                                              <p className="name-time">
                                                  <span className="name">Peter Gregor</span>
                                                  <span className="time">12/02/2019</span>
                                              </p>
                                          </li>
                                          <li className="person" data-chat="person3">
                                              <div className="user">
                                                  <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin"/>
                                                  <span className="status busy"></span>
                                              </div>
                                              <p className="name-time">
                                                  <span className="name">Jessica Larson</span>
                                                  <span className="time">11/02/2019</span>
                                              </p>
                                          </li>
                                          <li className="person" data-chat="person4">
                                              <div className="user">
                                                  <img src="https://www.bootdey.com/img/Content/avatar/avatar4.png" alt="Retail Admin"/>
                                                  <span className="status offline"></span>
                                              </div>
                                              <p className="name-time">
                                                  <span className="name">Lisa Guerrero</span>
                                                  <span className="time">08/02/2019</span>
                                              </p>
                                          </li>
                                          <li className="person" data-chat="person5">
                                              <div className="user">
                                                  <img src="https://www.bootdey.com/img/Content/avatar/avatar5.png" alt="Retail Admin"/>
                                                  <span className="status away"></span>
                                              </div>
                                              <p className="name-time">
                                                  <span className="name">Michael Jordan</span>
                                                  <span className="time">05/02/2019</span>
                                              </p>
                                          </li>
                                      </ul>
                                  </div>
                              </div>
                              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                  <div className="selected-user">
                                      <span>To: <span className="name">Emily Russell</span></span>
                                  </div>
                                  <div className="chat-container">  
                                      <ul className="chat-box chatContainerScroll">
                                      {messages.map((item, i) => <Adminmessage key={i}  user={(item as any).user} message={(item as any).message||[]} />)}
                                      <li id='chatEnd' style={{height:"100px",clear:"both"}}></li>
                                      </ul>
                                      <div className="form-group mt-3 mb-0">
                                          <textarea className="form-control"  placeholder="Type your message here..." onKeyDown={(e) => handleKeyPress(e)}  value={input} onChange={(e) => setInput(e.target.value)}/>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                  </div>

              </div>

          </div>

      </div>
    </>
  );
}

export default Admin;
