import React from 'react';
import hundIcon from '../assets/hund_icon_free.png';
import companionIcon from '../assets/companion_icon.png';
import humanIcon from '../assets/human_icon.png';

// Add typing animation styles
const typingDotStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: '#4B7893',
  display: 'inline-block',
  animation: 'bounce 1.4s infinite ease-in-out both'
};

// Inject CSS animation keyframes
if (typeof document !== 'undefined' && !document.getElementById('typing-animation')) {
  const style = document.createElement('style');
  style.id = 'typing-animation';
  style.textContent = `
    @keyframes bounce {
      0%, 80%, 100% { 
        transform: scale(0);
      } 40% { 
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);
}

function MessageBubble({ text, sender }) {
  // Convert sender to lowercase for consistent comparison
  const senderLower = sender && sender.toLowerCase();
  
  // Check sender types
  const isUser = senderLower === 'user';
  const isError = senderLower === 'error';
  const isDog = senderLower === 'dog' || senderLower === 'agent' || senderLower === 'response' || senderLower === 'greeting';
  const isTyping = senderLower === 'typing';
  const isCoach = senderLower === 'coach';
  const isCompanion = senderLower === 'companion';
  const isSystem = senderLower === 'system';

  // Neue Label-Komponente
  const renderLabel = () => {
    if (isDog || isTyping) {
      return <img src={hundIcon} alt="Hund" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />;
    }
    if (isUser) {
      return <img src={humanIcon} alt="User" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />;
    }
    if (isCompanion) {
      return <img src={companionIcon} alt="Companion" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />;
    }
    const label = isError ? '⚠️'
      : isCoach ? '👨🏽‍⚕️'
      : isSystem ? '🔧'
      : '❓';
    return <span style={{ fontSize: '18px' }}>{label}</span>;
  };

  // Style for label container
  const labelStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: '#F7E5C9'
  };

  // Tailwind classes for message bubble
  const bubbleClass = `px-3 py-2 rounded-xl max-w-[80%] text-sm break-words ${
    isUser ? '' :
    isError ? 'bg-red-500 text-white' :
    'bg-gray-100 text-gray-900 border border-gray-200'
  }`;
  
  const getBubbleStyle = () => {
    if (isUser) {
      return { backgroundColor: '#4B7893', color: '#F7E5C9' };
    }
    if (isError) {
      return { backgroundColor: '#ef4444', color: 'white' };
    }
    return { backgroundColor: 'white', color: '#374151', border: '1px solid #e5e7eb' };
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '8px',
        padding: '0 12px',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      {!isUser && (
        <div style={labelStyle}>
          {renderLabel()}
        </div>
      )}
      {isTyping ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            maxWidth: '70%',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginLeft: '8px'
          }}
          aria-label="Antwort wird geschrieben"
        >
          <div style={{ display: 'flex', gap: '4px' }}>
            <span style={{ ...typingDotStyle, animationDelay: '0s' }}></span>
            <span style={{ ...typingDotStyle, animationDelay: '0.2s' }}></span>
            <span style={{ ...typingDotStyle, animationDelay: '0.4s' }}></span>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '8px 12px',
          borderRadius: '12px',
          maxWidth: '80%',
          fontSize: '14px',
          wordBreak: 'break-words',
          marginLeft: isUser ? '0' : '8px',
          marginRight: isUser ? '8px' : '0',
          ...getBubbleStyle()
        }}>
          {(typeof text === 'string' ? text : '')}
        </div>
      )}
      {isUser && (
        <div style={labelStyle}>
          {renderLabel()}
        </div>
      )}
    </div>
  );
}

export default MessageBubble;