import './App.css';
import  { useState, useEffect  } from 'react';
import Frame from 'react-frame-component';
import Message from "./Components/Message";
import {socket, socketID } from './Components/mySocket';
import axios from 'axios';
import Cookies from 'js-cookie';
import {API_URL, BASE_URL} from './Components/config';

const Bot = ({siteConfig}) => {
  const [admin,setAdmin] = useState(1)
  const [isTyping,setTyping] = useState(false)
  
  
  
  let popUPState =true;
  if(window.localStorage.getItem('popUpVisible') === null){
    popUPState = true;
  }
  else if (window.localStorage.getItem('popUpVisible') !==null) {
    const localPopup =  (window.localStorage.getItem('popUpVisible')==='true');
    popUPState = localPopup;
  }git

 
  let formState =true;
  let user = Cookies.get("userDetail");
  if(user)
  formState = false;

  const [popUpVisible,showPopUp] = useState(popUPState)
  const [userForm,showForm] = useState(formState)

  const leftBotStyle:any ={  
    opacity: "1", 
    inset: "auto 10px 90px auto", 
    position: "fixed", 
    border: "0px", 
    padding:" 0px", 
    margin: "0px", 
    transitionProperty : "none", 
    transform: "none", 
    width: "350px ", 
    height: "575px", 
    minHeight: "575px", 
    display: (popUpVisible) ? 'block':'none',
    zIndex: "999", 
    clip: "auto", 
    bottom: "10px",
    left: "0"
  };

  const rightBotStyle:any ={  
    opacity: "1", 
    inset: "auto 10px 90px auto", 
    position: "fixed", 
    border: "0px", 
    padding:" 0px", 
    margin: "0px", 
    transitionProperty : "none", 
    transform: "none", 
    width: "350px ", 
    height: "575px", 
    minHeight: "575px", 
    display: (popUpVisible) ? 'block':'none',
    zIndex: "999", 
    clip: "auto", 
    bottom: "10px",
    right: "0"
  };

  const leftBotBtnStyle:any = {position: "fixed", left: "20px", bottom: "-78px", border: "0", width: "73px", zIndex: "1000"}
  const rightBotBtnStyle:any = {position: "fixed", right: "20px", bottom: "-78px", border: "0", width: "73px", zIndex: "1000"}

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    host: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  //States for chat
  // const user = "Binod";
  const [userData, setUser] = useState({name:'',id:''});
  const [messages, setMessages] = useState([] as string[])
  const [input, setInput] = useState("");

  const typingTimeout = 1000; // Set a timeout to consider user stopped typing

  let typing = false;
  let timeout:any;

  // Function to emit typing event
  const emitTyping = () => {
    // let user = window.localStorage.getItem("userDetail");
    let user = Cookies.get("userDetail");
    if (!typing) {
      typing = true;
      socket.emit('typing start',user);
    }

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      typing = false;
      socket.emit('typing stopped',user);
    }, typingTimeout);
  }

  socket.on('bot typing start', () => {
     setTyping(true)
  });
  socket.on('bot typing stopped', () => {
    setTyping(false)
});


  const openPopUp = () =>{
    showPopUp(true)
    window.localStorage.setItem('popUpVisible',JSON.stringify(true))
  }
  const closePopUp = () =>{
    showPopUp(false)
    window.localStorage.setItem('popUpVisible',JSON.stringify(false))
  }
  socket.on('welcome', (data:any) => {
    setMessages([...messages, data]);
  })
  socket.on('sendMessage', (data:any) => {
    setMessages([...messages, data]);
    scrollingDown()
  })
  

  

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    formData.host = window.location.origin+'/'
    const validation =validateForm(formData);
    if(validation){
        axios.post(API_URL+"/add-member", formData)
        .then((response) => {
          socket.emit('joined', {'name':formData.name as string ,'id':socketID,'type':'client','host': formData.host})
          socket.emit('hostName')

          setUser({'name':formData.name,'id':response.data.user})
          // localStorage.setItem("userDetail", JSON.stringify({"name":formData.name,"email":formData.email,'id':response.data.user}));
          Cookies.set('userDetail', JSON.stringify({"name":formData.name,"email":formData.email,'id':response.data.user,'host':formData.host}))
          showForm(false)
          window.localStorage.setItem('userForm',JSON.stringify(false))
        })
        .catch(error => {
          console.error('Error in adding member:', error);
        });
    }

  }
 
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  
  const validateForm = (data:any) => {
    // Define your validation rules here
    let errorFlag =0
    if (!data.name.trim()) {
      setErrors((errorData) => ({
        ...errorData,
        name: 'Name is required'
      }));
      errorFlag = 1;
    }
    else if(data.name.trim().length > 0){
      setErrors((errorData) => ({
        ...errorData,
        name: ''
      }));
    }

    if (!data.email.trim()) {
      setErrors((errorData) => ({
        ...errorData,
        email: 'Email is required',
      }));
      errorFlag =1
    } else if (!isValidEmail(data.email)) {
      setErrors((errorData) => ({
        ...errorData,
        email: 'Invalid Email!',
      }));
      errorFlag =1
    }
    else if (isValidEmail(data.email)) {
     
      setErrors((errorData) => ({
        ...errorData,
        email: '',
      }));
    }

    
    if(data.phone.trim().match(/^\d{10}$/g) || !data.phone.trim()){
      setErrors((errorData) => ({
        ...errorData,
        phone: '',
      }));
    }
    
    else{
      setErrors((errorData) => ({
        ...errorData,
        phone: 'Invalid Phone!',
      }));
      errorFlag =1

    }
   
    
    return (errorFlag==1)? false : true;
  };

  const isValidEmail = (email:any) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
 
  const send = async () => {
    setAdmin(1)
    let sender: any;
    let name: any;
    // let user = window.localStorage.getItem("userDetail");
    let user = Cookies.get("userDetail");
    if(!userData.id){
        if(user){
          name = JSON.parse(user as string ).name
          sender = JSON.parse(user as string ).id
        }
    }
    else{
      name = userData.name
      sender = userData.id
    }
  
    let message = {
      'sender':sender,
      'reciever':admin,
      'message':input
    };

   addMessage(message,name)

  }
  const handleKeyPress = (e:any) => {
    
    if (e.key === 'Enter' && input.trim().length>0) {
      e.preventDefault();
      send()
    }else{
      emitTyping()
    }
  };

  const scrollingDown = () => {
    const x = window.document.querySelector<HTMLIFrameElement>("#iframe-content")?.contentWindow;
    if (x) {
      var elem = x.document.querySelector<HTMLElement>("#chatContainer"); 
      var child = x.document.querySelector<HTMLElement>("#chatEnd"); 
        if (elem && child) {
          elem.scrollTo({
            top: child.offsetTop,
          });
        }
    }
  };

  const addMessage =async (message:any,name:any) => {
  
    // let user = window.localStorage.getItem("userDetail");
    let user = Cookies.get("userDetail");
    axios.post(API_URL+"/add-message", message)
    .then((response) => {
      console.log(response)
      socket.emit('message', {'user':name,'message':message.message,'id':socketID, 'to': 'Admin','senderId':JSON.parse(user as string ).id });
      setInput("")
      scrollingDown();
    })
    .catch(error => {
      console.error('Error uploading image:', error);
    });
  }

  const handleImageChange = async (event:any) => {
    const file = event.target.files[0];
    if(file){
      const formData = new FormData();
      formData.append('image', file);
      axios.post(API_URL+'/upload', formData, { headers: { 'Content-Type': 'multipart/form-data', } })
      .then(response => {
        // console.log('Image uploaded:', response.data.imagePath);
        let sender: any;
        let name: any;
        // let user = window.localStorage.getItem("userDetail");
        let user = Cookies.get("userDetail");
        if(!userData.id){
              if(user){
                name = JSON.parse(user as string ).name
                sender = JSON.parse(user as string ).id
              }
          }
          else{
            name = userData.name
            sender = userData.id
          }
      let message = {
        'sender':sender,
        'reciever':admin,
        'message':response.data.imagePath
      };

      addMessage(message,name)
      
    })
    .catch(error => {
        console.error('Error uploading image:', error);
    });
  
    }
  }

  useEffect(() => {
    let user = Cookies.get("userDetail");
    if(user){
      let username = JSON.parse(user as string ).name;
      socket.emit('joined',  {'name':username ,'id':socketID,'host': window.location.host,'type':'client'}, true)
      socket.emit('hostName')
      showPopUp(true)
      showForm(false)
      window.localStorage.setItem('popUpVisible',JSON.stringify(true))
      window.localStorage.setItem('userForm',JSON.stringify(false))
    }
  }, []); 


  return (
    <>
        <Frame initialContent={'<!DOCTYPE html><html><head><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"></head><body style="background:transparent"><div id="closeFrameBtn"></div></body></html>'} mountTarget='#closeFrameBtn' style={siteConfig.align=="right"?rightBotBtnStyle:leftBotBtnStyle}>
          <button className="chatbox-open" onClick={openPopUp} style={{border: "0", background:siteConfig.bgcolor,  padding: "12px", color:siteConfig.color, borderRadius: "50%"}}>
                 <img src={BASE_URL+"img/live-chat-icon.png"} className="img-responsive"/>
          </button>
        </Frame>
        <Frame     
            initialContent={'<!DOCTYPE html><html><head><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"><style>::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:'+siteConfig.bgcolor+'}::-webkit-scrollbar-thumb:hover{background:#777}.chat-Bot-Widget button.chatbox-close,.chat-Bot-Widget button.chatbox-open{position:fixed;bottom:0;right:0;width:52px;height:52px;background-position:center center;background-repeat:no-repeat;box-shadow:12px 15px 20px 0 rgba(46,61,73,.15);border:0;cursor:pointer;color:#fff;background-color:'+siteConfig.bgcolor+'}.chat-Bot-Widget .chatbox-panel,.chat-Bot-Widget .chatbox-popup{position:absolute;box-shadow:5px 5px 25px 0 rgba(46,61,73,.2);display:none;width:328px;background-color:#fff}body{margin:0;padding:0;font-family:Lato,sans-serif;}.chat-Bot-Widget h1{margin:0;font-size:16px;line-height:1}.chat-Bot-Widget button.chatbox-open{border-radius:50%;margin:16px}.chat-Bot-Widget button.chatbox-close{border-radius:50%;display:none;margin:16px calc(2 * 16px + 52px) 16px 16px}.chat-Bot-Widget textarea{box-sizing:border-box;width:100%;margin:0;height:calc(16px + 16px / 2);padding:0 calc(16px / 2);font-family:inherit;font-size:16px;line-height:calc(16px + 16px / 2);color:#000;background-color:none;border:0;outline:0!important;resize:none;overflow:hidden}.chat-Bot-Widget textarea::placeholder{color:#888}.chat-Bot-Widget .chatbox-popup{flex-direction:column;bottom:calc(2 * 16px + 52px);right:10px;height:auto;border-radius:16px}.chat-Bot-Widget .chatbox-popup .chatbox-popup__header{box-sizing:border-box;display:flex;width:100%;padding:16px;color:'+siteConfig.color+';background-color:'+siteConfig.bgcolor+';align-items:center;justify-content:space-around;border-top-right-radius:12px;border-top-left-radius:12px;height:75px;max-height:75px}.chat-Bot-Widget .chatbox-popup .chatbox-popup__header .chatbox-popup__avatar{margin-top:0;background-color:#fff;border:5px solid rgba(0,0,0,.1);border-radius:50%;height:45px;width:45px;}.chat-Bot-Widget .chatbox-popup .chatbox-popup__main{height:286px;overflow-y:scroll;box-sizing:border-box;width:100%;padding:10px 15px;line-height:calc(16px + 16px / 2);color:#888;}.chat-Bot-Widget .chatbox-popup .chatbox-popup__form{height:auto;overflow-y:scroll;box-sizing:border-box;width:100%;padding:calc(2 * 16px) 16px;line-height:calc(16px + 16px / 2);}.chat-Bot-Widget .chatbox-popup .chatbox-popup__footer{box-sizing:border-box;display:flex;width:100%;padding:16px;border-top:1px solid #ddd;align-items:center;justify-content:space-around;border-bottom-right-radius:12px;border-bottom-left-radius:12px}.chat-Bot-Widget .chatbox-panel{flex-direction:column;top:0;right:0;bottom:0}.chat-Bot-Widget .chatbox-panel .chatbox-panel__header{box-sizing:border-box;display:flex;width:100%;padding:16px;color:#fff;background-color:'+siteConfig.bgcolor+';align-items:center;justify-content:space-around;flex:0 0 auto}.chat-Bot-Widget .chatbox-panel .chatbox-panel__main{box-sizing:border-box;width:100%;padding:0 16px;line-height:calc(16px + 16px / 2);color:#888;text-align:center;flex:1 1 auto}.chat-Bot-Widget .chatbox-panel .chatbox-panel__footer{box-sizing:border-box;display:flex;width:100%;padding:16px;border-top:1px solid #ddd;align-items:center;justify-content:space-around;flex:0 0 auto}.notification-modal { display: none; position: fixed; z-index: 1; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); } .notification-modal-content { background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 80%; } .notification-modal-close { color: #aaaaaa; float: right; font-size: 28px; font-weight: bold; } .notification-modal-close:hover, .notification-modal-close:focus { color: #000; text-decoration: none; cursor: pointer; }.chatbox-popup__form .btn-primary { color: #fff; background-color: '+siteConfig.bgcolor+'; border-color: '+siteConfig.bgcolor+'; } .chatbox-popup__form  .btn-primary:hover,.chatbox-popup__form  .btn-primary:active { color: '+siteConfig.color+' !important; background-color: '+siteConfig.bgcolor+' !important; border-color: '+siteConfig.bgcolor+' !important; }.chatbox-popup__form form{border-left: 5px solid '+siteConfig.bgcolor+'; padding: 10px 10px 1px;background: #f5f5f5;}.form-group label{ font-size: 13px;margin:0}.chatbox-popup__form .form-control {border: 1px solid #70a7dd;font-size: 14px;color: #000;}</style></head><body style="background:transparent"><div id="content"></div></body></html>'} mountTarget='#content' id = "iframe-content2" style={siteConfig.align=="right"?rightBotStyle:leftBotStyle} >  
              <div className='chat-Bot-Widget frame-content' >
                <section className="chatbox-popup" style={{ display:  (popUpVisible)? 'block':'none'}}>
                  <header className="chatbox-popup__header">
                    <aside style={{ flex: 2 }}>
                      <img src={`${siteConfig.logo}`} className="chatbox-popup__avatar" />
                    </aside>
                    <aside style={{ flex: 8 }}>
                      {siteConfig.heading}<br/>
                      <span id='typing' style={{display:`${ isTyping ? "block" : "none" }`}}><small>Typing...</small></span>
                    </aside>
                    <aside style={{ flex: 1 }}>
                        <i className="fa fa-times" aria-hidden="true" onClick={closePopUp} />
                    </aside>
                  </header>
                
                  <main className="chatbox-popup__main" id='chatContainer' style={{ display: userForm ? 'none':'block'}}>
                    <div className="MessagesList" id='chat'>
                      {messages.map((item, i) => <Message key={i} config={siteConfig as any}  user={(item as any).user} message={(item as any).message}  />)}
                    </div>
                    <div style={{ float:"left", clear: "both", height:"150px" }} id='chatEnd'>
                    </div>

                  </main>
                  <main className="chatbox-popup__form" id='chatForm' style={{display: userForm?"block":"none"}}>
                    <form onSubmit={handleForm}>
                        <div className="form-group">
                          <label htmlFor="name">Name</label>
                          <input id='name' type="text" name="name" className={`form-control ${errors.name && 'is-invalid'} `} placeholder='Enter Name'  onChange={handleChange} value={formData.name}/>
                          {errors.name && <span className='text-danger'>{errors.name}</span>}
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input id='email' type="text" name='email' className={`form-control ${errors.email && 'is-invalid'} `} placeholder='Enter Email' onChange={handleChange} value={formData.email}/>
                          {errors.email && <span className='text-danger'>{errors.email}</span>}
                        </div>
                        <div className="form-group">
                          <label htmlFor="phone">Phone (optional)</label>
                          <input id='phone' type="text" name='phone' className={`form-control ${errors.phone && 'is-invalid'} `} placeholder='Enter Phone'  onChange={handleChange} value={formData.phone}/>
                          {errors.phone && <span className='text-danger'>{errors.phone}</span>}
                        </div>
                        <div className="form-group">
                            <button className='btn btn-primary'type='submit'>Send</button>
                        </div>
                    </form>
                  </main>
                  <footer className="chatbox-popup__footer"  style={{display: userForm?"none":"flex"}}>
                    <aside style={{ flex: 1, color: "#888", textAlign: "center" }}>
                      {/* <i className="fa fa-camera" aria-hidden="true" /> */}
                      <label htmlFor="fileInput" id="imageLabel">
                        <input type="file" id="fileInput" className='d-none' accept="image/*,application/pdf" onChange={handleImageChange} />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-paperclip"
                          onChange={handleImageChange}>
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                      </label>
                    </aside>
                    <aside style={{ flex: 10 }}>
                      <textarea
                        placeholder="Type your message here..."
                        autoFocus={false}
                        itemType='text'
                        id="msgBox"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e)}
                      />
                    </aside>
                    <aside style={{ flex: 1, color: siteConfig.bgcolor, textAlign: "center", cursor:"pointer" }} >
                      <i className="fa fa-paper-plane" aria-hidden="true" onClick={()=>send()} />
                    </aside>
                  </footer>
                </section>
                </div>
        </Frame>

  </>
  
  );
}

export default Bot;
