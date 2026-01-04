
import React, { useRef, useEffect } from 'react';
import { Bold, Italic, List, Heading1, Heading2, Link as LinkIcon, Quote } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (document.activeElement !== editorRef.current || value === '') {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const exec = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const ToolbarButton: React.FC<{ icon: React.ReactNode; command: string; arg?: string; title: string }> = ({ icon, command, arg, title }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        exec(command, arg);
      }}
      className="p-2 hover:bg-blue-100 hover:text-blue-900 rounded text-gray-600 transition-all active:scale-95"
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-transparent transition-all shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2 bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
        <ToolbarButton icon={<Bold size={18} />} command="bold" title="Bold (Ctrl+B)" />
        <ToolbarButton icon={<Italic size={18} />} command="italic" title="Italic (Ctrl+I)" />
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        <ToolbarButton icon={<Heading1 size={18} />} command="formatBlock" arg="H1" title="Heading 1" />
        <ToolbarButton icon={<Heading2 size={18} />} command="formatBlock" arg="H2" title="Heading 2" />
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        <ToolbarButton icon={<List size={18} />} command="insertUnorderedList" title="Bullet List" />
        <ToolbarButton icon={<Quote size={18} />} command="formatBlock" arg="blockquote" title="Quote" />
        <button
           type="button"
           onMouseDown={(e) => {
             e.preventDefault();
             const url = prompt('Enter URL:');
             if(url) exec('createLink', url);
           }}
           className="p-2 hover:bg-blue-100 hover:text-blue-900 rounded text-gray-600 transition-all"
        >
          <LinkIcon size={18} />
        </button>
      </div>
      <div
        ref={editorRef}
        className="rich-text-editor p-6 min-h-[400px] outline-none max-w-none prose prose-slate text-black bg-white"
        contentEditable="true"
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onBlur={handleInput}
        style={{ color: 'black', backgroundColor: 'white' }}
      />
      {(!value || value === '<p><br></p>') && (
        <div className="absolute top-[108px] left-6 text-gray-400 pointer-events-none italic text-sm">
          Type your article content here...
        </div>
      )}
    </div>
  );
};
