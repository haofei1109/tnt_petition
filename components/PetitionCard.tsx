import React from 'react';
import { Petition } from '../types';

interface PetitionCardProps {
  petition: Petition;
  onClick: (id: string) => void;
}

const PetitionCard: React.FC<PetitionCardProps> = ({ petition, onClick }) => {
  return (
    <div className="bg-white flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 rounded-sm overflow-hidden group">
      {/* Image Section */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
        {petition.imageUrl ? (
          <img 
            src={petition.imageUrl} 
            alt={petition.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
             <span className="text-4xl font-serif italic">TNT</span>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-black text-base text-gray-800 leading-snug mb-3 line-clamp-3 group-hover:text-tnt-orange transition-colors">
          {petition.title}
        </h3>
        
        {/* Spacer to push bottom content down */}
        <div className="flex-grow"></div>
        
        {/* Stats */}
        <div className="mt-4 mb-4">
          <span className="text-tnt-orange font-bold text-sm">
            {petition.signatures.length.toLocaleString()} 人已支持
          </span>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => onClick(petition.id)}
          className="w-full py-2 bg-tnt-orange/90 hover:bg-tnt-orange text-white font-bold tracking-wider text-sm rounded-sm transition-colors"
        >
          立即签名
        </button>
      </div>
    </div>
  );
};

export default PetitionCard;