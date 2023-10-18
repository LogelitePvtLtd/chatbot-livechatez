const Adminmessage = ({ user, message }) => {
    if (user) {
        return (
            <li className="chat-right">
                <div className="chat-text">{`${user}: ${message}`}.</div>
                <div className="chat-avatar">
                    <img src="./img/ava1-bg.png" alt="Retail Admin"/>
                    <div className="chat-name">{`${user}`}</div>
                </div>
            </li>
        )
    }
    else {
        return (
            <li className="chat-left">
                <div className="chat-avatar">
                    <img src="./img/ava2-bg.png" alt="Retail Admin"/>
                    <div className="chat-name">User</div>
                </div>
                <div className="chat-text"> {`User: ${message}`}</div>
            </li>
        )
    }
}
export default Adminmessage