import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Tabs, Spin } from 'antd';
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
  LoadingOutlined
} from '@ant-design/icons';
import request from '../../request';
import { useRequest } from '../../hook';

import { gql, useQuery, useMutation } from '@apollo/client';
import * as GQL from '../../graphql';
import type { ProjectListItem } from '../../global';

import './index.less';

const { TabPane } = Tabs;

type ProjectData = {
  isPackage: boolean;
  currentPath: string[];
  files: string;
};

const Project = ({
  projectList = [],
  removeProject,
  goDashboard
}: {
  projectList: ProjectListItem[];
  removeProject: (item: ProjectListItem) => void;
  goDashboard: ({ id }: { id: string }) => void;
}) => {
  const [openEditor, { data, error, loading }] = useMutation(GQL.FILE_OPEN_IN_EDITOR);

  const onClickOpen = (item: ProjectListItem) => {
    if (loading) return;
    openEditor({ variables: { input: { file: item.path } } });
  };

  return (
    <section className="project-select-list container-center tabs-content-auto">
      {projectList &&
        projectList.map((item) => {
          return (
            <div className="project-select-list-item" key={item.id}>
              <div className="content">
                <div className="content-icon">
                  <ProjectOutlined style={{ fontSize: 22 }} />
                </div>
                <div className="content-left" onClick={() => goDashboard({ id: item.id })}>
                  <div className="name">{item.name}</div>
                  <div className="path">{item.name}</div>
                </div>
                <div className="content-right">
                  <span className="open" onClick={() => onClickOpen(item)}>
                    <CodeOutlined /> 在编辑器中打开 {loading && <LoadingOutlined />}
                  </span>
                  <span className="delete" onClick={() => removeProject(item)}>
                    <CloseOutlined />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      {projectList && projectList.length === 0 && <div className="empty flex-center">没有项目哦，去导入吧~</div>}
    </section>
  );
};

const ImportProject = ({
  projectData,
  requestImportToProject,
  requestFiles
}: {
  projectData: ProjectData;
  requestImportToProject: (data: any) => void;
  requestFiles: (data: any) => void;
}) => {
  const { currentPath = [], isPackage = false, files = [] } = projectData || {};

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
  const { request: requestFindDirs, data: projectData, loading: loading1 } = useRequest<ProjectData>('/api/find/dirs');

  const {
    request: getProjectList,
    data: projectList = [],
    loading: loading2
  } = useRequest<ProjectListItem[]>('/api/project/list');

  const { request: goDashboard, loading: loadingD } = useRequest('/api/project/dashboard', {
    lazy: true,
    onSuccess: () => {
      history.push('/dashboard');
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
      <div className="title">Aimi UI 项目管理器</div>
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
            <Project projectList={projectList} removeProject={removeProject} goDashboard={goDashboard} />
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
            <ImportProject
              requestImportToProject={requestImportToProject}
              projectData={projectData}
              requestFiles={requestFiles}
            />
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
