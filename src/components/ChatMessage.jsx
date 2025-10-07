import React from 'react';
import { motion } from 'framer-motion';
import '../styles/ChatMessage.css';

const ChatMessage = ({ message, isUser, language }) => {
  return (
    <motion.div
      className={`chat-message ${isUser ? 'user' : 'assistant'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="message-avatar">
        {isUser ? '👤' : '🎵'}
      </div>
      <div className="message-content">
        <p>{message}</p>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
