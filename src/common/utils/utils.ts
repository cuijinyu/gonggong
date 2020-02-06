import shortId from 'shortid';

export default {
  GGLogger(message: any) {
    console.log(`[Gong gong] ${message}`);
  },

  GGErrorLogger(message: any) {
    console.error(`[Gong gong] ${message}`);
  },

  GGWarnLogger(message: any) {
    console.warn(`[Gong gong] ${message}`);
  },

  uuid() {
    return shortId();
  },
};
