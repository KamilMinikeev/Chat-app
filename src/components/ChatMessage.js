import React, { useState, useEffect, useRef } from "react";
import { library } from "../utils/iconConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChatMessage = ({ onMessageChange }) => {
  const inputRef = useRef();

  const [isPlaceholderVisible, setPlaceholderVisible] = useState(true);
  const [message, setMessage] = useState("");

  const saveInputValue = () => {
    const textContent = inputRef.current.textContent;
    setPlaceholderVisible(
      textContent === "" || textContent === "Type a message"
    );
    setMessage(textContent);
    //onChange(text);
  };

  const onKeyDown = (event) => {
    const ENTER_KEY_CODE = 13;

    if (event.keyCode === ENTER_KEY_CODE && event.shiftKey === false) {
      event.stopPropagation();
      event.preventDefault();
      const textContent = inputRef.current.innerText;

      console.log(textContent);

      //submit(textContent);
    }
  };

  const handleKeyDown = (event) => {
    // Проверяем, является ли нажатая клавиша буквой или цифрой
    if (
      /^[a-zA-Z0-9]$/.test(event.key) &&
      document.activeElement.tagName !== "INPUT"
    ) {
      inputRef.current.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  useEffect(() => {
    const currentInputRef = inputRef.current;

    document.addEventListener("keydown", handleKeyDown);

    currentInputRef.addEventListener("keydown", onKeyDown);
    currentInputRef.addEventListener("paste", handlePaste);
    currentInputRef.addEventListener("input", saveInputValue);

    currentInputRef.focus();

    return () => {
      currentInputRef.removeEventListener("input", saveInputValue);
      currentInputRef.removeEventListener("keydown", onKeyDown);
      currentInputRef.removeEventListener("paste", handlePaste);

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    //onMessageChange(value);
  };

  // const placeholderHtml = isPlaceholderVisible
  //   ? '<div class="chat-placeholder">Type a message</div>'
  //   : "";

  return (
    <div className="chat-message">
      <div className="chat-message__container">
        <div className="chat-message__inner">
          <button className="emoji">
            <FontAwesomeIcon icon="fa-regular fa-face-smile" />
          </button>
          {isPlaceholderVisible && (
            <div
              className="chat-placeholder"
              onClick={() => inputRef.current.focus()}
            >
              Type a message
            </div>
          )}
          <div
            className="chat-input"
            ref={inputRef}
            placeholder="Type a message"
            contentEditable
            // dangerouslySetInnerHTML={{ __html: placeholderHtml }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
