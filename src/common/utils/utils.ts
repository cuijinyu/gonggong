import shortId from 'shortid';

export default {
    GGLogger(message: any) {
        console.log(`[Gong gong Logger]:${message}`);
    },

    GGErrorLogger(message: any) {
        console.error(`[Gong gong Error]:${message}`)
    },

    uuid() {
        return shortId();
    }
}