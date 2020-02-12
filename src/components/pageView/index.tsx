import React, { useCallback, useEffect, useState } from 'react';
import { BEM } from '../../common/utils/bem';
import './index.scss';
import { Popover, Button } from 'antd';
import { useGlobalContext } from '../../context/global';

const PageView: React.FC = () => {
  const { ast, astTool } = useGlobalContext();
  const [pageList, setPageList] = useState<ReturnType<typeof astTool.getPageList>>([]);

  const addPage = useCallback(() => {
    astTool.createNewPage({
      name: '123',
      isIndex: true,
      path: '/index',
    });
  }, []);

  useEffect(() => {
    setPageList(astTool.getPageList());
  }, [astTool, ast]);

  return (
    <div className={BEM('content', 'pageView')}>
      <div className={BEM('content', 'pageView-title')}>页面编辑</div>
      <div className={BEM('content', 'pageView-pageItemWrapper')}>
        {pageList?.map(page => {
          return (
            <Popover
              content={
                <div>
                  <div>页面名:{page.name}</div>
                  <div>是否首页:{page.isIndex ? '是' : '否'}</div>
                  <div>路径:{page.path}</div>
                  <div>
                    <Button>修改页面</Button>
                    <Button>删除页面</Button>
                  </div>
                </div>
              }>
              <div className={BEM('content', 'pageView-pageItem')}>{page.name}</div>
            </Popover>
          );
        })}
      </div>
      <Popover content={'新增一个页面'}>
        <div className={BEM('content', 'pageView-addPage')} onClick={addPage}>
          +
        </div>
      </Popover>
    </div>
  );
};

export default PageView;
