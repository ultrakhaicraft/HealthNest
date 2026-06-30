

const Modal = ({ title, children, onClose }: any) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>{title}</h2>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);

export default Modal;