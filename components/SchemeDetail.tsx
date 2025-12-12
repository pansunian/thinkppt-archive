import React, { useEffect, useState } from 'react';
import { Scheme } from '../types';

interface SchemeDetailProps {
  scheme: Scheme;
  onClose: () => void;
}

// Helper: Render Rich Text Array from Notion
const RichText: React.FC<{ textArr: any[] }> = ({ textArr }) => {
  if (!textArr || textArr.length === 0) return null;
  return (
    <span>
      {textArr.map((t, i) => {
        const { annotations, text, href } = t;
        let content = <span key={i}>{text.content}</span>;
        
        if (annotations.bold) content = <strong key={i} className="font-bold">{content}</strong>;
        if (annotations.italic) content = <em key={i} className="italic">{content}</em>;
        if (annotations.strikethrough) content = <s key={i} className="line-through">{content}</s>;
        if (annotations.underline) content = <u key={i} className="underline">{content}</u>;
        if (annotations.code) content = <code key={i} className="bg-gray-100 px-1 py-0.5 rounded font-mono text-red-500 text-sm">{content}</code>;
        if (annotations.color !== 'default') content = <span key={i} style={{ color: annotations.color }}>{content}</span>;
        
        if (href) return <a key={i} href={href} className="underline text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">{content}</a>;
        
        return content;
      })}
    </span>
  );
};

// Helper: Block Renderer
const NotionBlock: React.FC<{ block: any }> = ({ block }) => {
  const type = block.type;
  const value = block[type];

  switch (type) {
    case 'paragraph':
      if (!value.rich_text.length) return <br />; // Empty paragraph
      return <p className="text-base md:text-lg leading-relaxed text-gray-800 mb-4"><RichText textArr={value.rich_text} /></p>;
    
    case 'heading_1':
      return <h1 className="text-3xl font-black uppercase mt-8 mb-4"><RichText textArr={value.rich_text} /></h1>;
    
    case 'heading_2':
      return <h2 className="text-2xl font-bold mt-6 mb-3"><RichText textArr={value.rich_text} /></h2>;
    
    case 'heading_3':
      return <h3 className="text-xl font-bold mt-4 mb-2"><RichText textArr={value.rich_text} /></h3>;
    
    case 'bulleted_list_item':
      return (
        <li className="flex gap-2 mb-2 items-start">
           <span className="mt-2 w-1.5 h-1.5 bg-black rounded-full flex-shrink-0"></span>
           <span className="text-base leading-relaxed"><RichText textArr={value.rich_text} /></span>
        </li>
      );
      
    case 'numbered_list_item':
       return (
        <li className="flex gap-2 mb-2 items-start">
           <span className="font-mono text-gray-500 font-bold mt-0.5">1.</span>
           <span className="text-base leading-relaxed"><RichText textArr={value.rich_text} /></span>
        </li>
       );
       
    case 'quote':
      return (
        <blockquote className="border-l-4 border-black pl-4 py-2 my-4 bg-gray-50 italic">
          <RichText textArr={value.rich_text} />
        </blockquote>
      );

    case 'image':
       const src = value.type === 'external' ? value.external.url : value.file.url;
       const caption = value.caption?.[0]?.plain_text;
       return (
         <figure className="my-6">
            <img src={src} alt={caption || 'Notion Image'} className="w-full rounded-lg border border-gray-200" />
            {caption && <figcaption className="text-center text-xs text-gray-500 mt-2 font-mono">{caption}</figcaption>}
         </figure>
       );
    
    case 'divider':
        return <hr className="my-8 border-t border-dashed border-gray-300" />;

    default:
      return null;
  }
};

export const SchemeDetail: React.FC<SchemeDetailProps> = ({ scheme, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';

    // Fetch Notion Content
    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/content?id=${scheme.id}`);
            if (res.ok) {
                const data = await res.json();
                // Notion API returns { object: 'list', results: [...] }
                setContent(data.results || []);
            }
        } catch (error) {
            console.error("Failed to load content", error);
        } finally {
            setLoading(false);
        }
    };

    if (scheme.id) {
        fetchContent();
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [scheme.id]);

  return (
    <div className={`fixed inset-0 z-[5000] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${mounted ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent invisible'}`}>
      
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Main Modal Wrapper */}
      <div 
        className={`relative w-full max-w-4xl bg-[#FDFBF7] h-[90vh] shadow-2xl rounded-2xl overflow-hidden flex flex-col transition-all duration-500 transform ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}
      >
        
        {/* Floating Close Button */}
        <div className="absolute top-4 right-4 z-50">
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors shadow-sm"
            >
              ✕
            </button>
        </div>

        {/* Unified Scroll Container */}
        <div className="w-full h-full overflow-y-auto custom-scrollbar bg-white">
            
            {/* 1. Hero Image Section */}
            <div className="w-full relative bg-gray-100 border-b-2 border-black">
                <div className="aspect-video w-full relative overflow-hidden">
                    <img 
                        src={scheme.imageUrl} 
                        alt={scheme.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
                
                {/* Badge */}
                <div 
                    className="absolute bottom-6 left-6 px-4 py-2 border-2 border-black rounded-full shadow-[4px_4px_0px_rgba(0,0,0,1)] font-mono text-xs font-bold text-black"
                    style={{ backgroundColor: scheme.color }}
                >
                    {scheme.category}
                </div>
            </div>

            {/* 2. Content Body Section */}
            <div className="relative">
                {/* Content Header */}
                <div className="p-8 pb-0">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-xs text-gray-400">REF: {scheme.id.slice(-6).toUpperCase()}</span>
                        <span className="font-mono text-xs text-gray-400">{scheme.date}</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6 leading-tight text-gray-900">
                    {scheme.title}
                    </h1>

                    {/* Meta Data Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <div>
                            <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Brand / Client</span>
                            <span className="font-bold text-sm block truncate">{scheme.brand}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Industry</span>
                            <span className="font-bold text-sm block truncate">{scheme.industry}</span>
                        </div>
                        <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-gray-200 pt-2 md:pt-0 md:pl-4 mt-2 md:mt-0 flex items-center">
                            <div>
                                <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Year</span>
                                <span className="font-bold text-xs bg-black text-white px-2 py-1 rounded inline-block">VOL. {scheme.year}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                    {scheme.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold font-mono rounded-full border border-gray-200">
                        {tag}
                        </span>
                    ))}
                    </div>
                </div>

                {/* Body Text / Fetched Notion Content */}
                <div className="p-8 space-y-2 pb-16 min-h-[300px]">
                    
                    {/* Database Description Fallback */}
                    <p className="text-base md:text-lg leading-relaxed text-gray-600 font-sans italic mb-8 border-l-2 border-gray-300 pl-4">
                        {scheme.description}
                    </p>

                    <div className="border-t border-dashed border-gray-300 my-8"></div>

                    {/* Async Content */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                            <span className="font-mono text-xs text-gray-400 animate-pulse">RETRIEVING ARCHIVE CONTENT...</span>
                        </div>
                    ) : content.length > 0 ? (
                        <div className="max-w-3xl mx-auto">
                            {content.map((block) => (
                                <NotionBlock key={block.id} block={block} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 font-mono text-xs">
                            [ NO ADDITIONAL CONTENT FOUND IN FILE ]
                        </div>
                    )}

                    {/* Download Action */}
                    <section className="pt-4 pb-8 border-t border-dashed border-gray-200 mt-12">
                        <div className="flex flex-col items-center justify-center text-center mb-6">
                            <h3 className="font-black text-2xl uppercase mb-2">Ready to use?</h3>
                            <p className="text-gray-500 text-sm max-w-md">Get full access to the source file and presentation structure.</p>
                        </div>
                        {scheme.downloadUrl ? (
                            <a 
                                href={scheme.downloadUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="group relative block w-full max-w-md mx-auto"
                            >
                                <div className="absolute inset-0 bg-black rounded-lg translate-y-1 translate-x-1 transition-transform group-hover:translate-y-2 group-hover:translate-x-2"></div>
                                <div className="relative w-full py-4 bg-[#FFDAC1] border-2 border-black rounded-lg text-black font-bold text-sm uppercase tracking-widest hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all flex items-center justify-center gap-2">
                                    <span>Download Source File</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                </div>
                            </a>
                        ) : (
                            <button disabled className="w-full max-w-md mx-auto block py-4 bg-gray-100 text-gray-400 font-bold text-sm uppercase tracking-widest cursor-not-allowed rounded-lg border border-gray-200">
                                No Download Available
                            </button>
                        )}
                    </section>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};