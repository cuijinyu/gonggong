import { notification } from 'antd';

class EventManager {
  private events = [];
  constructor() {
    notification.open({
      message: '核心事件总线加载成功',
      duration: 2,
    });
  }
}

export default EventManager;
