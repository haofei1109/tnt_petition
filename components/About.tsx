import React from 'react';
import { ArrowLeft, Heart, Sparkles, MessageCircle, Mail } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack} 
          className="mb-8 flex items-center gap-2 font-bold text-black/70 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> 返回首页
        </button>

        <div className="bg-white rounded-3xl shadow-xl border-t-8 border-tnt-yellow overflow-hidden">
          {/* Header */}
          <div className="bg-tnt-black text-white p-8 md:p-12 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 transform -rotate-12"><Heart size={100} fill="currentColor" /></div>
                <div className="absolute bottom-10 right-10 transform rotate-12"><Sparkles size={100} /></div>
             </div>
             <h1 className="text-3xl md:text-5xl font-black relative z-10 mb-4">关于请愿站</h1>
             <p className="text-tnt-yellow text-lg font-serif italic relative z-10">
               "每一个爆米花的声音都值得被听见"
             </p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            
            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-tnt-black flex items-center gap-3">
                <span className="w-8 h-8 bg-tnt-yellow text-black rounded-full flex items-center justify-center text-sm">01</span>
                时代少年团请愿网站是什么？
              </h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed pl-11">
                <p className="mb-6">
                  这是一个普通却深爱小炸们的爆米花搭建的小角落。没有组织，没有阵营，希望是一个能让人安心、温柔表达的地方。
                </p>
                <p className="mb-6">
                  你可以在这里轻轻写下心里的话，也可以遇见同样有着类似心意的人。
                  无论是对小炸的爱、对团队的建议，还是一个忽然冒出来的小愿望，都可以留下来；如果你认同其他人的想法，也可以在后面签上自己的名字。
                </p>
                <p>
                  请愿网站本意应该是许愿的人数达到一定数量，就会得到官方的关注和回应。但目前这里还做不到，这里目前只是 “民间”的小地方，所以声音暂时未必能被看到。但相信，真诚的心意聚在一起，会慢慢长出力量。我们可以先走走看看~
                </p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-tnt-black flex items-center gap-3">
                <span className="w-8 h-8 bg-tnt-yellow text-black rounded-full flex items-center justify-center text-sm">02</span>
                为什么会做这个网站？
              </h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed pl-11">
                <p className="mb-6">
                  作为一个小小的粉丝，也有很多对小炸的爱控制不住的想表达，也有很多的建议想被看见，也时常为他们有很多的担心焦虑想得到缓解。但因为我有点社恐又不会吵架，也搞不清楚很多的规则，很多时候跟不上节奏，或者不想被莫名带了节奏失去了本身的判断。
                </p>
                <p className="mb-6">
                  所以我常希望能有一个“魔法传声筒”，让我也能轻轻说一句，也许会有跟我想法一致同频的人能让我也被看见被听见呢？演唱会线下见到的爆米花都是温柔善良的小仙女，我就在想会不会有人和我一样…
                </p>
                <p>
                  于是就创建了这样一个小地方，让想表达的人可以有一个温柔的空间，让情绪与想法能够被安放。在这里，不会被评论、不被定义，只是被允许做自己。你可以在这里，勇敢地、温柔地，表达自己，许下愿望。或许幸运的，也会发现，其实许多人跟你是同频的，我们可以让自己的想法被更多的人看见和听见。
                </p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-tnt-black flex items-center gap-3">
                <span className="w-8 h-8 bg-tnt-yellow text-black rounded-full flex items-center justify-center text-sm">03</span>
                在这里你具体可以做什么？
              </h2>
              <div className="bg-gray-50 p-6 rounded-2xl pl-11 border border-gray-100">
                <div className="mb-8">
                  <h3 className="font-bold text-lg text-tnt-orange mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    如果你有话想说
                  </h3>
                  <p className="text-gray-600 mb-2">或者对团队/公司有具体的建议，可以发出你的心声：</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                    <li>找到网站里的“发起心愿”入口</li>
                    <li>写下你的愿望/建议/疑问，起个标题，说明背景和你的具体想法。</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg text-tnt-orange mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    如果你看见有和你想法一致的愿望
                  </h3>
                  <p className="text-gray-600 mb-2">可以在旁边签下你的名字：</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                    <li>点击你认同的愿望进入详情页</li>
                    <li>签下你的名字</li>
                  </ul>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-tnt-black flex items-center gap-3">
                <span className="w-8 h-8 bg-tnt-yellow text-black rounded-full flex items-center justify-center text-sm">04</span>
                有任何意见或建议？
              </h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed pl-11 flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <p className="font-medium text-gray-800 my-0">
                  欢迎联系：<a href="mailto:157557322@qq.com" className="text-tnt-orange font-bold hover:underline transition-colors">157557322@qq.com</a>
                </p>
              </div>
            </div>

          </div>
          
          <div className="bg-gray-50 p-8 text-center">
            <p className="font-serif italic text-gray-500">
              "每一位爆米花的声音，都值得被听见。"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;