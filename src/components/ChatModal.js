import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const ChatModal = ({ isModalOpened, closeModal }) => {
  return (
    <div className={`chat-modal ${isModalOpened ? "active" : ""}`}>
      <div className="chat-modal__wrapper">
        <div className="chat-modal__inner">
          <div className="chat-modal__content">
            <div className="chat-modal__header">
              <button className="chat-modal__close" onClick={closeModal}>
                <CloseIcon />
              </button>
              <h3 className="chat-modal__title"></h3>
            </div>
            <div className="chat-modal__info">
              {/* {selectedFile && selectedFile instanceof File && (
            <div>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Выбранное фото"
              />
            </div>
          )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
