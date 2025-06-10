declare module 'emoji-flags' {
  interface Flag {
    code: string;
    emoji: string;
    unicode: string;
    name: string;
    title: string;
  }

  const flags: Record<string, Flag>;
  export default flags;
} 