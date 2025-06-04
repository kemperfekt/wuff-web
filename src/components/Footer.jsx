import React, { useRef, useEffect } from 'react';

function Footer({ input, onInputChange, onKeyDown, onSend, inputRef }) {
  const textareaRef = useRef(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
  };

  useEffect(() => {
    autoResize();
  }, [input]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-primary text-background px-4 py-2 border-t border-gray-300">
      <div className="flex items-end gap-2">
        <textarea
          ref={(el) => {
            textareaRef.current = el;
            if (inputRef) inputRef.current = el;
          }}
          rows={1}
          inputMode="text"
          value={input}
          onChange={(e) => {
            onInputChange(e.target.value);
            autoResize();
          }}
          onKeyDown={onKeyDown}
          placeholder="Schreib' hier..."
          className="flex-1 resize-none overflow-auto rounded-md border border-gray-300 p-2 text-base bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary max-h-40"
        />
        <button
          type="button"
          onClick={onSend}
          className="px-3 py-2 rounded-md bg-accent text-white text-sm hover:bg-secondary flex-shrink-0"
        >
          Wuff
        </button>
      </div>
      <div className="text-xs mt-2 w-full text-center space-x-4">
        <a href="/public/datenschutz.html" className="underline text-background/80 hover:text-background">Datenschutz</a>
        <a href="/public/impressum.html" className="underline text-background/80 hover:text-background">Impressum</a>
      </div>
    </div>
  );
}

export default Footer;
