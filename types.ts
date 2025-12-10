export interface Signature {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  timestamp: number;
}

export interface Petition {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  signatures: Signature[];
  // targetSignatures removed for open-ended voting
  createdAt: number;
  author: string;
}

export type ViewState = 'HOME' | 'CREATE' | 'DETAIL' | 'ABOUT';

// Type for the AI Studio global object
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}