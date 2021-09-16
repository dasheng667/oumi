import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Tabs, Spin, Input } from 'antd';
import {
  UnorderedListOutlined,
  CodeOutlined,
  CloseOutlined,
  ExportOutlined,
  ProjectOutlined,
  ArrowLeftOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  FileOutlined,
  EditOutlined,
  LoadingOutlined,
  RightCircleOutlined,
  StarOutlined,
  StarFilled
} from '@ant-design/icons';
import request from '@src/request';
import { useRequest } from '@src/hook';
import type { ListItem } from '@src/global';

import './index.less';

const { TabPane } = Tabs;

type ProjectData = {
  isPackage: boolean;
  currentPath: string[];
  files: string;
};

/**
 * 项目列表
 * @param param0
 * @returns
 */
const Project = ({
  projectList = [],
  getProjectList,
  removeProject,
  goDashboard
}: {
  projectList: ListItem[];
  getProjectList: any;
  removeProject: (item: ListItem) => void;
  goDashboard: ({ id }: { id: string }) => void;
}) => {
  const [current, setCurrent] = useState<ListItem | null>(null);
  const { request: requestOpen, loading } = useRequest('/api/openInEditor', { lazy: true });
  const { request: requestCollect } = useRequest('/api/project/collect', { lazy: true });

  if (!Array.isArray(projectList)) return null;

  const onClickOpen = (item: ListItem) => {
    if (loading) return;
    setCurrent(item);
    requestOpen({ input: { file: item.path } });
  };

  const collectProject = async (e: React.MouseEvent, item: ListItem, isCollect?: boolean) => {
    e.stopPropagation();
    e.preventDefault();
    await requestCollect({ id: item.id, collect: !isCollect });
    getProjectList();
  };

  const list1 = projectList.filter((v) => v.collection);
  const list2 = projectList.filter((v) => !v.collection);

  function renderList(list: ListItem[], isCollect?: boolean) {
    if (!Array.isArray(list)) return null;
    return list.map((item) => {
      return (
        <div className="project-select-list-item" key={item.id}>
          <div className="content">
            <div className="content-icon cur" onClick={(e) => collectProject(e, item, isCollect)}>
              {!isCollect && <StarOutlined style={{ fontSize: 22 }} />}
              {isCollect && <StarFilled style={{ fontSize: 22, color: '#1890ff' }} />}
            </div>
            <div className="content-left" onClick={() => goDashboard({ id: item.id })}>
              <div className="name">{item.name}</div>
              <div className="path">{item.path}</div>
            </div>
            <div className="content-right">
              <span className="open" onClick={() => onClickOpen(item)}>
                <CodeOutlined /> 在编辑器中打开 {loading && item === current && <LoadingOutlined />}
              </span>
              <span className="delete" onClick={() => removeProject(item)}>
                <CloseOutlined />
              </span>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <section className="project-select-list container-center tabs-content-auto">
      {list1.length > 0 && <div className="project-select-list__title">收藏项目</div>}
      {renderList(list1, true)}
      <div className="project-select-list__title">更多项目</div>
      {renderList(list2)}
      {projectList && projectList.length === 0 && <div className="empty flex-center">没有项目哦，去导入吧~</div>}
    </section>
  );
};

/**
 * 导入项目
 * @param param0
 * @returns
 */
const ImportProject = ({
  projectData,
  requestImportToProject,
  requestFiles
}: {
  projectData: ProjectData;
  requestImportToProject: (data: any) => void;
  requestFiles: (data: any) => void;
}) => {
  const input = useRef(null);
  const [isEdit, setISEdit] = useState(false);
  const { currentPath = [], isPackage = false, files = [] } = projectData || {};

  const { request: requestVerifyDirs } = useRequest('/api/project/verifyDirs', { lazy: true });

  const onClickPath = (path: string, index: number) => {
    if (index === currentPath.length - 1 || !path) return;
    const newPath = [...currentPath].splice(0, index + 1);
    requestFiles({ rootPathArr: newPath });
  };

  const goNextFile = (file: string) => {
    const next = [...currentPath, file];
    requestFiles({ rootPathArr: next });
  };

  const goBack = () => {
    const back = [...currentPath];
    back.pop();
    if (back.length > 1) {
      requestFiles({ rootPathArr: back });
    }
  };

  const onClickImport = () => {
    if (isPackage) {
      requestImportToProject({ importPath: currentPath });
    }
  };

  const onPressEnter = (e: any) => {
    const arrPath = e.target.value.split('/');
    requestVerifyDirs({ targetPath: arrPath })
      .then(() => {
        setISEdit(false);
        requestFiles({ rootPathArr: arrPath });
      })
      .catch(() => {
        setISEdit(false);
      });
  };

  const onEnterJump = () => {
    const $input = document.getElementById('search-input') as any;
    if ($input && $input.value) {
      const { value } = $input;
      onPressEnter({ target: { value } });
    }
    setISEdit(!isEdit);
  };

  return (
    <div className="project-import container-center tabs-content-auto">
      <div className="toolbar">
        <div className="back flex-center" onClick={goBack}>
          <ArrowLeftOutlined />
        </div>
        <div className="current-path">
          {currentPath.map((path: string, index: number) => (
            <div key={path} className="path-part flex-center" onClick={() => onClickPath(path, index)}>
              {path}
            </div>
          ))}
          {isEdit && (
            <div className="edit-path">
              <Input id="search-input" defaultValue={currentPath.join('/')} onPressEnter={onPressEnter} />
            </div>
          )}
        </div>
        <div className="edit flex-center" onClick={onEnterJump}>
          {!isEdit && <EditOutlined />}
          {isEdit && <RightCircleOutlined />}
        </div>
      </div>
      <div className="folders">
        <RenderFiles files={files} goNextFile={goNextFile} />
      </div>
      <div className="import-btn">
        <button className={`${isPackage ? '' : 'disabled'}`} onClick={onClickImport}>
          <FolderOpenOutlined /> 导入这个文件夹
        </button>
      </div>
    </div>
  );
};

const RenderFiles = ({ files, goNextFile }: any) => {
  return (
    <div>
      {files &&
        files.map((file: string) => {
          return (
            <div className="folder-explorer-item" key={file} onClick={() => goNextFile(file)}>
              <div className="icon flex-center">
                {(() => {
                  const fontSize = { fontSize: 18 };
                  const style = { ...fontSize, color: '#168bff' };
                  if (file.includes('.json')) {
                    return <FileOutlined style={{ ...fontSize }} />;
                  }
                  return <FolderOutlined style={style} />;
                })()}
              </div>
              <div className="folder-name">{file}</div>
            </div>
          );
        })}
      {files && files.length === 0 && <div className="empty flex-center">该目录没有文件~</div>}
    </div>
  );
};

export default () => {
  const [activeKey, setActiveKey] = useState<'1' | '2'>('1');
  const history = useHistory();
  const {
    request: requestFindDirs,
    data: projectData,
    loading: loading1
  } = useRequest<ProjectData>('/api/user/folder', { errorMsg: false });

  const { request: getProjectList, data: projectList = [], loading: loading2 } = useRequest<ListItem[]>('/api/project/list');

  const { request: goDashboard, loading: loadingD } = useRequest('/api/project/dashboard', {
    lazy: true,
    onSuccess: () => {
      history.push('/');
    }
  });

  const { request: removeProject, loading: loadingR } = useRequest('/api/project/remove', {
    lazy: true,
    onSuccess: () => {
      requestProjectList();
    }
  });

  const requestFiles = (options?: { rootPathArr: string[] }) => {
    requestFindDirs(options);
  };

  const requestProjectList = (options?: { importPath: string[] }) => {
    getProjectList(options);
  };

  const requestImportToProject = (options?: { importPath: string[] }) => {
    request.post('/api/project/import', { ...options }).then((res: any) => {
      requestProjectList();
      setActiveKey('1');
    });
  };

  return (
    <section className="ui-container">
      <div className="title">Oumi UI 项目管理器</div>
      <div className="ui-tabs">
        <Tabs defaultActiveKey="1" activeKey={activeKey} onChange={(key) => setActiveKey(key as any)}>
          <TabPane
            key="1"
            tab={
              <span>
                <UnorderedListOutlined />
                项目
              </span>
            }
          >
            <Project projectList={projectList} getProjectList={getProjectList} removeProject={removeProject} goDashboard={goDashboard} />
          </TabPane>

          <TabPane
            key="2"
            tab={
              <span>
                <ExportOutlined />
                导入
              </span>
            }
          >
            <ImportProject requestImportToProject={requestImportToProject} projectData={projectData} requestFiles={requestFiles} />
          </TabPane>
        </Tabs>

        {(loading1 || loading2) && (
          <div className="loading flex-center">
            <Spin />
          </div>
        )}
      </div>
    </section>
  );
};
