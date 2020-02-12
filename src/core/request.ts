import Axios from 'axios';

class Ajax {
  private client: ReturnType<typeof Axios.create>;

  constructor() {
    this.client = Axios.create({
      timeout: 10000,
    });
  }
}

const requestInstance = Axios.create({
  timeout: 10000,
});

requestInstance.interceptors.request.use(value => {
  return value;
});

requestInstance.interceptors.response.use(value => {
  return value;
});

export default requestInstance;
