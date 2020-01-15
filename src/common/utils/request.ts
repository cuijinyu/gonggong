import Axios from 'axios';

const requestInstance = Axios.create({
    timeout: 10000
});

requestInstance.interceptors.request.use(value => {
    return value;
});

requestInstance.interceptors.response.use(value => {
    return value;
});

export default requestInstance;
