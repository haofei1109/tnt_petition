import { Petition } from './types';

// 敏感词库：在此处添加不允许出现的词汇
export const SENSITIVE_WORDS = ["单飞", "df", "解散", "DF", "sf"];

// 初始数据替换为占位符，避免误导用户
export const INITIAL_PETITIONS: Petition[] = [
  {
    id: '1',
    title: '心愿',
    description: '这里是心愿内容的占位描述。',
    imageUrl: null,
    signatures: [],
    createdAt: Date.now(),
    author: '爆米花'
  },
  {
    id: '2',
    title: '心愿',
    description: '这里是心愿内容的占位描述。',
    imageUrl: null,
    signatures: [],
    createdAt: Date.now() - 1000,
    author: '爆米花'
  },
  {
    id: '3',
    title: '心愿',
    description: '这里是心愿内容的占位描述。',
    imageUrl: null,
    signatures: [],
    createdAt: Date.now() - 2000,
    author: '爆米花'
  },
  {
    id: '4',
    title: '心愿',
    description: '这里是心愿内容的占位描述。',
    imageUrl: null,
    signatures: [],
    createdAt: Date.now() - 3000,
    author: '爆米花'
  },
  {
    id: '5',
    title: '心愿',
    description: '这里是心愿内容的占位描述。',
    imageUrl: null,
    signatures: [],
    createdAt: Date.now() - 4000,
    author: '爆米花'
  },
  {
    id: '6',
    title: '心愿',
    description: '这里是心愿内容的占位描述。',
    imageUrl: null,
    signatures: [],
    createdAt: Date.now() - 5000,
    author: '爆米花'
  }
];