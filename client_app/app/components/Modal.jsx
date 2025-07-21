function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 w-full h-screen bg-black bg-opacity-70" onClick={onClose}>
      <dialog
        className="fixed top-[25vh] w-[30rem] rounded-md bg-gray-50 animate-fade-slide-down"
        open
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </dialog>
    </div>
  );
}

export default Modal;
