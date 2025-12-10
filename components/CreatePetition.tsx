import React, { useState } from 'react';
import { Petition } from '../types';
import { SENSITIVE_WORDS } from '../constants';
import { ImagePlus, X, Send, AlertCircle } from 'lucide-react';

interface CreatePetitionProps {
  onSubmit: (petition: Omit<Petition, 'id' | 'signatures' | 'createdAt'>) => void;
  onCancel: () => void;
}

const CreatePetition: React.FC<CreatePetitionProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [author, setAuthor] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setError(null);
      
      console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      // Check file type - reject HEIC/HEIF as browsers don't support them natively
      if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
        setError('不支持 HEIC/HEIF 格式，请使用 JPG/PNG 格式的图片，或在手机相机设置中改为"最兼容"格式');
        setImageFile(null);
        return;
      }
      
      // Simple approach: just convert to base64 with size limit check
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('图片太大，请选择小于5MB的图片');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        console.log('File read complete, length:', result.length);
        
        // For non-HEIC images, try to compress using canvas
        const img = new Image();
        img.onload = () => {
          console.log('Image loaded successfully, dimensions:', img.width, 'x', img.height);
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            console.error('Canvas context is null');
            setImagePreview(result);
            return;
          }
          
          // Resize to max 600px width
          const maxWidth = 600;
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          console.log('Resizing to:', width, 'x', height);
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressed = canvas.toDataURL('image/jpeg', 0.6);
          console.log('Compression complete, new size:', compressed.length);
          setImagePreview(compressed);
        };
        
        img.onerror = (err) => {
          console.error('Image load error:', err);
          setError('图片格式不支持或已损坏，请选择 JPG/PNG 格式');
          setImageFile(null);
          setImagePreview(null);
        };
        
        img.src = result;
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        setError('文件读取失败，请重试');
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Content moderation check
    const contentToCheck = `${title} ${description} ${author}`.toLowerCase();
    const foundSensitiveWord = SENSITIVE_WORDS.find(word => contentToCheck.includes(word.toLowerCase()));

    if (foundSensitiveWord) {
      setError(`提交失败：内容包含敏感词汇，请修改后重试。为了维护良好的社区环境，请礼貌发言。`);
      return;
    }

    onSubmit({
      title,
      description,
      imageUrl: imagePreview, // Base64 encoded image
      author: author || '匿名爆米花'
    });
    
    console.log('Submitting petition with image:', imagePreview ? 'Yes' : 'No');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-2xl border-4 border-tnt-black">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-tnt-black mb-2">发起新的心愿</h2>
        <p className="text-gray-500">大声说出你的愿望，召集伙伴们一起实现！</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-600 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">心愿名称</label>
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：强烈要求 TNT 举办夏日海边演唱会！"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-tnt-orange focus:outline-none transition-colors text-lg font-bold placeholder-gray-300"
          />
          <p className="text-xs text-gray-400 mt-1">使用强有力的语言来号召支持！</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">发起人昵称</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="你的名字"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-tnt-orange focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">简述你的愿望内容</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="描述发生了什么，为什么你关心，以及你现在希望发生什么..."
            rows={6}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-tnt-orange focus:outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">上传图片 (可选)</label>
          <p className="text-xs text-gray-500 mb-2">支持 JPG、PNG 格式。iPhone 用户请在相机设置中选择"最兼容"格式</p>
          <div className="flex items-center gap-4">
            <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-tnt-orange transition-colors">
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" onChange={handleImageChange} className="hidden" />
              <ImagePlus className="w-8 h-8 text-gray-400 mb-1" />
              <span className="text-xs text-gray-400">选择图片</span>
            </label>
            {imagePreview && (
              <div className="relative w-32 h-32">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl border border-gray-200" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-[2] py-3 bg-tnt-orange text-black font-black rounded-xl shadow-lg border-2 border-black hover:bg-yellow-400 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            发布愿望
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePetition;