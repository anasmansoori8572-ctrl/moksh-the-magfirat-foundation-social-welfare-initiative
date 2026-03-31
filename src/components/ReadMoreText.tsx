import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TranslateText from './TranslateText';

interface ReadMoreTextProps {
  text: string;
  lines?: number;
  className?: string;
  showTranslation?: boolean;
}

const ReadMoreText: React.FC<ReadMoreTextProps> = ({ text, lines = 6, className = "", showTranslation = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className={`${isExpanded ? '' : `line-clamp-${lines}`} transition-all duration-300`}>
        {text.split('\n').map((paragraph, index) => (
          <p key={index} className={index > 0 ? 'mt-4' : ''}>
            {paragraph}
          </p>
        ))}
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-primary font-bold flex items-center hover:opacity-80 transition-opacity text-sm"
      >
        <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
        {isExpanded ? (
          <ChevronUp className="ml-1" size={14} />
        ) : (
          <ChevronDown className="ml-1" size={14} />
        )}
      </button>
      {showTranslation && <TranslateText originalText={text} />}
    </div>
  );
};

export default ReadMoreText;
