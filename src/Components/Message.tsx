import { BASE_URL  } from "./config";
const Message = ({ config, user, message }) => {
    const recievedMessage = message
    const imageUrl = (recievedMessage.includes('http'))?recievedMessage:null;
    const parts = (imageUrl)? imageUrl.split('.'):null;
    const extension = (parts)? parts.pop().trim():null; // Get the last part after splitting
    const urlSegments = ( extension && extension === "pdf") ? recievedMessage.split('/') : null;
    const pdf = (urlSegments)?urlSegments[urlSegments.length - 1]:null;
    if (user=='Admin') {
        if(extension == "pdf"){
            return (
                <div className="d-flex flex-row justify-content-start mb-4">
                    <img src={`${config.logo}`}
                    alt="avatar 1"  style={{width: "45px", height: "100%"}}/>
                    <div className="ml-2" style={{borderRadius: "22px 4px 24px 0", backgroundColor: config.bgcolor, color:config.color, padding: "7px 1.25rem", lineHeight: "30px"}}>
                    <p className="small mb-0"> <a href={message} target="_blank" download><i className="fa fa-arrow-circle-o-down fa-2x text-white"></i></a> <span style={{ verticalAlign:"super"}}>{pdf}</span></p>
                    </div>
                </div>
            )
        }
        else if(extension && extension !== "pdf"){
            return (
                <div className="d-flex flex-row justify-content-start mb-4">
                    <img src={`${config.logo}`}
                    alt="avatar 1"  style={{width: "45px", height: "100%"}}/>
                    <div className="ml-2" style={{borderRadius: "22px 4px 24px 0", backgroundColor: config.bgcolor, color:config.color, padding: "7px 1.25rem", lineHeight: "30px"}}>
                    <p className="small mb-0"> <a href={message} target="_blank"><img className="img-fluid" src={message}/></a></p>
                    </div>
                </div>
            )
        }
        else{
            return (
                <div className="d-flex flex-row justify-content-start mb-4">
                    <img src={`${config.logo}`}
                    alt="avatar 1"  style={{width: "45px", height: "100%"}}/>
                    <div className="ml-2" style={{borderRadius: "22px 4px 24px 0", backgroundColor: config.bgcolor,color:config.color, padding: "7px 1.25rem", lineHeight: "30px"}}>
                    <p className="small mb-0"> {` ${message}`}</p>
                    </div>
                </div>
            )
        }
    }
    else {
     
        if(extension == "pdf"){
            return (
                <div className="d-flex flex-row justify-content-end mb-4"><div className="mr-2 border" style={{borderRadius: " 15px 15px 0 15px", backgroundColor: "#efebeb",color:"#000", padding: "7px 18px", lineHeight: "30px"}}> <p className="small mb-0"> <a href={message} download target="_blank"><i className="fa fa-arrow-circle-o-down fa-2x"></i></a> <span style={{ verticalAlign:"super"}}>{pdf}</span></p> </div> <img src={`${BASE_URL}img/user.png`} alt="avatr 1" style={{height:"45px"}}/></div>
            )
        }
        else if(extension && extension !== "pdf"){
            return (
                <div className="d-flex flex-row justify-content-end mb-4"><div className="mr-2 border" style={{borderRadius: " 15px 15px 0 15px", backgroundColor: "#efebeb",color:"#000", padding: "7px 18px", lineHeight: "30px"}}> <p className="small mb-0"><a href={message} target="_blank"><img className="img-fluid" src={message}/></a></p> </div> <img src={`${BASE_URL}img/user.png`} alt="avatr 1" style={{height:"45px"}}/></div>
            )
        }
        else{
            return (
                <div className="d-flex flex-row justify-content-end mb-4"><div className="mr-2 border" style={{borderRadius: " 15px 15px 0 15px", backgroundColor: "#efebeb",color:"#000", padding: "7px 18px", lineHeight: "30px"}}>  <p className="small mb-0"> {message}</p> </div> <img src={`${BASE_URL}img/user.png`} alt="avatr 1" style={{height:"45px"}}/></div>
            )
        }

    }
}

export default Message
