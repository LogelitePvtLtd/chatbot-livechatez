const Modal = ({ isOpen, onCancel }) => {
    
    return (
        <>
            <div id="myModal" className="notification-modal" style={{display:"block"}} >
                <div className="notification-modal-content">
                <span className="notification-modal-close">&times;</span>
                    <p>Some text in the Modal..</p>
                </div>
            </div>
        </>
  )
}
export default Modal