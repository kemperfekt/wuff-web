import React from 'react';
import hundIcon from '../assets/hund_icon_free.png';
import companionIcon from '../assets/companion_icon.png';
import humanIcon from '../assets/human_icon.png';

function MessageBubble({ text, sender }) {
  // Convert sender to lowercase for consistent comparison
  const senderLower = sender && sender.toLowerCase();
  
  // Check sender types
  const isUser = senderLower === 'user';
  const isError = senderLower === 'error';
  const isDog = senderLower === 'dog';
  const isTyping = senderLower === 'typing';
  const isCoach = senderLower === 'coach';
  const isCompanion = senderLower === 'companion';
  const isSystem = senderLower === 'system';

  // Neue Label-Komponente
  const renderLabel = () => {
    if (isDog || isTyping) {
      return <img src={hundIcon} alt="Hund" className="w-9 h-9 rounded-full" />;
    }
    if (isUser) {
      return <img src={humanIcon} alt="User" className="w-9 h-9 rounded-full" />;
    }
    if (isCompanion) {
      return <img src={companionIcon} alt="Companion" className="w-9 h-9 rounded-full" />;
    }
    const label = isError ? '⚠️'
      : isCoach ? '👨🏽‍⚕️'
      : isSystem ? '🔧'
      : '❓';
    return <span>{label}</span>;
  };

  // Tailwind classes for label (emoji)
  const labelStyle = "w-9 h-9 rounded-full text-xl flex items-center justify-center flex-shrink-0 bg-background";

  // Tailwind classes for message bubble
  const bubbleClass = `px-3 py-2 rounded-xl max-w-[80%] text-sm break-words ${
    isUser ? 'bg-primary text-background' :
    isError ? 'bg-red-500 text-white' :
    'bg-gray-100 text-gray-900 border border-gray-200'
  }`;

  return (
    <div
      className="message-row flex items-start mb-2 px-3"
      style={{
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      {!isUser && (
        <div className={labelStyle}>
          {renderLabel()}
        </div>
      )}
      {isTyping ? (
        <div
          className="flex items-center space-x-2 p-3 max-w-[70%] bg-white rounded-xl shadow-sm"
          aria-label="Antwort wird geschrieben"
        >
          <div className="flex space-x-1">
            <span className="dot bg-primary w-1.5 h-1.5 rounded-full animate-livelyBounce [animation-delay:-0.3s]"></span>
            <span className="dot bg-primary w-1.5 h-1.5 rounded-full animate-livelyBounce [animation-delay:-0.15s]"></span>
            <span className="dot bg-primary w-1.5 h-1.5 rounded-full animate-livelyBounce"></span>
          </div>
        </div>
      ) : (
        <div className={bubbleClass}>
          {(typeof text === 'string' ? text : '')}
        </div>
      )}
      {isUser && (
        <div className={labelStyle}>
          {renderLabel()}
        </div>
      )}
    </div>
  );
}

export default MessageBubble;