import React, { useState } from 'react';
import { Petition, Signature } from '../types';
import { ArrowLeft, Users, CheckCircle2 } from 'lucide-react';

interface PetitionDetailProps {
  petition: Petition;
  onBack: () => void;
  onSign: (id: string, signature: Omit<Signature, 'id' | 'timestamp'>) => void;
}

const PetitionDetail: React.FC<PetitionDetailProps> = ({ petition, onBack, onSign }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [hasSigned, setHasSigned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSign(petition.id, formData);
    setHasSigned(true);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button 
        onClick={onBack} 
        className="mb-6 flex items-center gap-2 font-bold text-black/70 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> 返回列表
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-tnt-black">
            {petition.imageUrl && (
              <img 
                src={petition.imageUrl} 
                alt={petition.title} 
                className="w-full h-64 sm:h-96 object-cover"
              />
            )}
            <div className="p-8">
              <h1 className="text-3xl sm:text-4xl font-black text-tnt-black mb-6 leading-tight">
                {petition.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-black font-medium">
                  发起人: {petition.author || 'TNT 粉丝'}
                </span>
                <span>•</span>
                <span>创建于 {new Date(petition.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="prose prose-lg text-gray-700 whitespace-pre-wrap">
                <p>{petition.description}</p>
              </div>
            </div>
          </div>
          
          {/* Signatures List (Mini) */}
          <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-md">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" /> 最近签名
            </h3>
            <div className="space-y-3">
              {petition.signatures.slice(-5).reverse().map((sig) => (
                <div key={sig.id} className="flex items-center gap-3 text-sm border-b border-gray-100 pb-2 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-tnt-orange/20 flex items-center justify-center text-xs font-bold text-tnt-orange">
                    {sig.lastName[0]}
                  </div>
                  <div>
                    <span className="font-bold">{sig.lastName}{sig.firstName}</span> 刚刚签署了请愿
                  </div>
                </div>
              ))}
              {petition.signatures.length === 0 && (
                <p className="text-gray-400 italic">还没有人签名，快来做第一个吧！</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Sign Form */}
        <div className="lg:col-span-1 lg:sticky lg:top-8">
          <div className="bg-white rounded-3xl shadow-xl border-2 border-tnt-black p-6">
            <div className="mb-6 flex flex-col items-center justify-center bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-tnt-orange">{petition.signatures.length}</span>
              </div>
              <span className="text-gray-500 font-bold uppercase tracking-wider text-sm mt-1">人已支持</span>
            </div>

            {hasSigned ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-xl text-green-800 mb-1">感谢支持！</h3>
                <p className="text-green-600 text-sm">您的签名已成功提交。</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-xl">✍️ 签署请愿</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">姓氏</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-tnt-orange focus:outline-none focus:ring-0 transition-colors"
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      placeholder="张"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">名字</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-tnt-orange focus:outline-none focus:ring-0 transition-colors"
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      placeholder="小炸"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">电子邮箱</label>
                  <input
                    required
                    type="email"
                    className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-tnt-orange focus:outline-none focus:ring-0 transition-colors"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="fan@example.com"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-4 bg-tnt-black text-white rounded-xl font-black text-lg shadow-lg hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  确认签名
                </button>
                <p className="text-center text-xs text-gray-400">
                  您的信息将严格保密，仅用于本次请愿计数。
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetitionDetail;