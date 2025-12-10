import React, { useState } from 'react';
import { generateVeoVideo } from '../services/geminiService';
import { Loader2, Video, Upload, Sparkles, AlertCircle } from 'lucide-react';

const VeoGenerator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setError("请上传图片文件");
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
      setGeneratedVideoUrl(null);
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);

      // Check for API Key
      if (!window.aistudio) {
        throw new Error("AI Studio environment not detected.");
      }

      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        // Check again after dialog potentially closes, though we assume success
      }

      const url = await generateVeoVideo(file, "Make this image come to life in a cinematic, energetic style suitable for a music idol fan video.", aspectRatio);
      setGeneratedVideoUrl(url);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "生成视频时出错，请重试。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-tnt-black">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-tnt-orange p-3 rounded-full border-2 border-black">
          <Sparkles className="w-6 h-6 text-black" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">TNT 魔法视频站</h2>
          <p className="text-gray-600 text-sm">上传照片，使用 Veo AI 生成动态应援视频！</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-6">
          
          <div className="space-y-2">
            <label className="block text-sm font-bold">1. 上传图片</label>
            <div className="relative border-2 border-dashed border-gray-400 rounded-xl p-8 hover:bg-yellow-50 transition-colors text-center cursor-pointer group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="mx-auto h-48 object-contain rounded-lg shadow-sm" />
              ) : (
                <div className="flex flex-col items-center text-gray-400 group-hover:text-tnt-orange">
                  <Upload className="w-10 h-10 mb-2" />
                  <span className="text-sm font-medium">点击上传应援图</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold">2. 选择比例</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setAspectRatio('16:9')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                  aspectRatio === '16:9' 
                    ? 'bg-tnt-black text-white border-tnt-black' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-tnt-orange'
                }`}
              >
                16:9 (横屏)
              </button>
              <button 
                 onClick={() => setAspectRatio('9:16')}
                 className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                  aspectRatio === '9:16' 
                    ? 'bg-tnt-black text-white border-tnt-black' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-tnt-orange'
                }`}
              >
                9:16 (竖屏)
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!file || isLoading}
            className={`w-full py-4 rounded-xl font-black text-lg shadow-lg border-2 border-black transform transition-all active:scale-95 ${
              !file || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
                : 'bg-tnt-orange hover:bg-yellow-400 text-black'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" />
                正在施展魔法 (需几分钟)...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Video />
                生成魔法视频
              </span>
            )}
          </button>
          
          <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded-lg">
            注意：Veo 视频生成需要付费 API Key。如果未设置，系统会提示您选择。生成过程可能需要 1-2 分钟。
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-100 p-4 rounded-xl flex items-start gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Right: Output */}
        <div className="flex flex-col">
          <label className="block text-sm font-bold mb-2">生成结果</label>
          <div className={`flex-1 min-h-[300px] bg-black/5 rounded-2xl border-2 border-black/10 flex items-center justify-center overflow-hidden relative ${
            generatedVideoUrl ? 'bg-black' : ''
          }`}>
            {generatedVideoUrl ? (
              <video 
                src={generatedVideoUrl} 
                controls 
                autoPlay 
                loop 
                className="max-w-full max-h-[500px] w-full h-auto object-contain"
              />
            ) : (
              <div className="text-center text-gray-400 p-8">
                 {isLoading ? (
                    <div className="flex flex-col items-center animate-pulse">
                        <div className="w-16 h-16 bg-tnt-orange/20 rounded-full flex items-center justify-center mb-4">
                            <Loader2 className="w-8 h-8 text-tnt-orange animate-spin" />
                        </div>
                        <p>AI 正在绘制每一帧...</p>
                        <p className="text-xs mt-2">请耐心等待</p>
                    </div>
                 ) : (
                    <>
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Video className="w-6 h-6 text-gray-300" />
                        </div>
                        <p>视频将在这里展示</p>
                    </>
                 )}
              </div>
            )}
          </div>
          {generatedVideoUrl && (
             <a 
                href={generatedVideoUrl} 
                download="tnt-magic-video.mp4"
                className="mt-4 block w-full py-3 bg-black text-white font-bold rounded-xl text-center hover:bg-gray-800 transition-colors"
                target="_blank"
                rel="noreferrer"
             >
                下载视频
             </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default VeoGenerator;