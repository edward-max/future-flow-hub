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
      editorRef.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount to set initial value to avoid cursor jumping

  const exec = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
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
      onClick={() => exec(command, arg)}
      className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2 bg-gray-50">
        <ToolbarButton icon={<Bold size={18} />} command="bold" title="Bold" />
        <ToolbarButton icon={<Italic size={18} />} command="italic" title="Italic" />
        <ToolbarButton icon={<Heading1 size={18} />} command="formatBlock" arg="H1" title="Heading 1" />
        <ToolbarButton icon={<Heading2 size={18} />} command="formatBlock" arg="H2" title="Heading 2" />
        <ToolbarButton icon={<List size={18} />} command="insertUnorderedList" title="Bullet List" />
        <ToolbarButton icon={<Quote size={18} />} command="formatBlock" arg="blockquote" title="Quote" />
        <button
           type="button"
           onClick={() => {
             const url = prompt('Enter URL:');
             if(url) exec('createLink', url);
           }}
           className="p-2 hover:bg-gray-100 rounded text-gray-600"
        >
          <LinkIcon size={18} />
        </button>
      </div>
      <div
        ref={editorRef}
        className="rich-text-editor p-4 min-h-[300px] outline-none max-w-none prose"
        contentEditable
        onInput={handleInput}
      />
    </div>
  );
};