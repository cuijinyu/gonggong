import Axios from 'axios';
import { notification } from 'antd';
import Util from '../common/utils/utils';
import { isProd } from '../common/utils/prod';

const { uuid } = Util;

type clientType = ReturnType<typeof Axios.create>;
type reqInter = Parameters<typeof Axios.interceptors.request.use>[0];
type repInter = Parameters<typeof Axios.interceptors.response.use>[0];

class Ajax {
  private client: clientType;
  private isProdMode: boolean = false;
  private reqInters: reqInter[] = [];
  private repInters: repInter[] = [];

  constructor() {
    this.client = Axios.create({
      timeout: 10000,
    });
    this.isProdMode = isProd();

    this.repInters.push(rep => {
      return rep;
    });

    this.reqInters.push(req => {
      return req;
    });

    notification.open({
      message: '请求引擎加载成功',
    });
  }

  private reInitClient() {
    this.client = Axios.create({
      timeout: 10000,
    });
    this.reqInters.forEach(ri => {
      this.client.interceptors.request.use(ri);
    });
    this.repInters.forEach(ri => {
      this.client.interceptors.response.use(ri);
    });
  }

  addReqInters(req: { elementId: string; inter: reqInter }) {
    const interId = uuid();
    this.reqInters.push(req.inter);
    this.reInitClient();
  }

  addRepInters(rep: { elementId: string; inter: repInter }) {
    const interId = uuid();
    this.repInters.push(rep.inter);
    this.reInitClient();
  }

  getClient() {
    return this.client;
  }
}

export default new Ajax();
