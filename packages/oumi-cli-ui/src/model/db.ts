/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { URL } from 'url';
import path from 'path';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import * as utils from '../utils';
import { readConfigFile } from '../utils/file';
import type { SwaggerItem, BlocksItem, GlobalRequestParams } from '../../typings';

type EnvType = 'envList' | 'var' | 'params';

const adapter = new FileSync(path.resolve(utils.rcFolder, 'db.json'));
const db = low(adapter);

// DB默认数据
const defaultBlock = {
  id: '1',
  name: 'pro-blocks',
  href: 'https://github.com/ant-design/pro-blocks/blob/master/umi-block.json',
  default: true
};
const defaultData = {
  userConfig: {
    swaggerConfig: {
      json_checked: false,
      mock_checked: true,
      mock_fileType: 'js',
      requestLibPath: "import request from '@/api/request';",
      api_fileType: 'ts',
      outputFileType: 'merge',
      outputFileName: 'serve.ts'
    }
  },
  userBlocks: [defaultBlock],
  debugger: {
    currentEnv: 'dev',
    global: [], // 全局配置
    envList: [], // 环境配置列表
    list: [] // 用户保存的列表
  }
};

db.defaults(defaultData).write();

const loop = (data: any, key: string, callback: any) => {
  if (!Array.isArray(data)) return;
  for (let i = 0; i < data.length; i++) {
    if (data[i].key === key) {
      callback(data[i], i, data);
      return;
    }
    if (data[i].children) {
      loop(data[i].children, key, callback);
    }
  }
};

const modelDb = {
  getCurrProjectId() {
    return db.get('dashboardId').value();
  },

  lastImportPath: {
    KEY: 'lastImportPath',
    get() {
      const val = db.get(this.KEY).value();
      return val && val.length > 0 ? val : null;
    },
    set(val: any) {
      db.set('lastImportPath', val).write();
    }
  },

  dashboard: {
    KEY: 'dashboardId',
    get() {
      return db.get(this.KEY).value();
    },
    set(val: any) {
      db.set(this.KEY, val).write();
    }
  },

  /** 项目列表 */
  projectList: {
    KEY: 'projectList',
    get() {
      return db.get(this.KEY).value();
    },
    push(data: any) {
      if (!this.get()) {
        db.set(this.KEY, []).write();
      }
      if (!data.id) {
        data.id = utils.createId();
      }
      db.get(this.KEY).push(data).write();
    },
    find(findParams: any) {
      return db.get(this.KEY).find(findParams).value();
    },
    collection(id: string, collect) {
      return db.get(this.KEY).find({ id }).assign({ collection: !!collect }).write();
    },
    findCurrent() {
      return db
        .get(this.KEY)
        .find({ id: db.get('dashboardId').value() })
        .value();
    },
    remove({ id, name }: any) {
      return db
        .get(this.KEY)
        .remove((item: any) => {
          return item.name === name || item.id === id;
        })
        .write();
    }
  },

  /** 用户配置 */
  userConfig: {
    KEY: 'userConfig',
    get() {
      return db.get(this.KEY).value();
    },
    // 用户的swagger列表
    swagger: {
      KEY: 'userConfig.swagger',
      readConfig(): SwaggerItem[] {
        const find = modelDb.projectList.findCurrent();
        if (find && find.path) {
          const file = readConfigFile(find.path);
          if (file && Array.isArray(file.swaggerList)) {
            return (file.swaggerList as SwaggerItem[]).map((v) => ({ ...v, default: true }));
          }
        }
        return [];
      },
      get(): SwaggerItem[] {
        const res = db.get(this.KEY).value() || [];
        return [...this.readConfig(), ...res];
      },
      add(data: SwaggerItem) {
        if (!this.get()) {
          db.set(this.KEY, []).write();
        }
        if (!data.id) {
          data.id = utils.createId();
        }
        return db.get(this.KEY).push(data).write();
      },
      remove(id: string) {
        if (id) {
          return db
            .get(this.KEY)
            .remove((item: any) => {
              return item.id === id;
            })
            .write();
        }
        return null;
      },
      findById(id: string): SwaggerItem | null {
        const dbFind = db.get(this.KEY).find({ id }).value();
        if (dbFind) return dbFind;
        return this.readConfig().find((v) => v.id === id);
      }
    },

    /** 用户的swagger配置 */
    swaggerConfig: {
      KEY: 'userConfig.swaggerConfig',
      get() {
        return db.get(this.KEY).value();
      },
      set(data: any) {
        return db.set(this.KEY, data).write();
      }
    },

    /** 其他私有配置 */
    private: {
      KEY: 'userConfig.private',
      get() {
        return db.get(this.KEY).value();
      },
      set(data: any) {
        return db.set(this.KEY, data).write();
      }
    }
  },

  /** 资产列表 */
  userBlocks: {
    KEY: 'userBlocks',
    get() {
      return db.get(this.KEY).value();
    },
    add(data: BlocksItem) {
      if (!this.get()) {
        db.set(this.KEY, []).write();
      }
      if (!data.id) {
        data.id = utils.createId();
      }
      return db.get(this.KEY).push(data).write();
    },
    remove(id: string) {
      if (id) {
        return db
          .get(this.KEY)
          .remove((item: BlocksItem) => {
            return item.id === id;
          })
          .write();
      }
      return null;
    },
    findById(id: string): BlocksItem | null {
      return db.get(this.KEY).find({ id }).value();
    }
  },

  /** api接口调试 */
  debugger: {
    KEY: 'debugger',
    LIST_KEY: 'debugger.list',
    // write() {
    //   db.get(this.LIST_KEY).write();
    // },
    createId() {
      return utils.createId(10);
    },

    // 追加一个节点
    pushNode(data: any) {
      const data2 = { ...data };
      if (!data2.key) {
        data2.key = this.createId();
      }
      data2._mid = modelDb.getCurrProjectId();
      db.get(this.LIST_KEY).push(data2).write();
      return data2;
    },

    // findListByKey(key: string) {
    //   return db.get(this.LIST_KEY).find({ key }).value();
    // },
    getListAll() {
      const id = modelDb.getCurrProjectId();
      return db.get(this.LIST_KEY).filter({ _mid: id }).value();
    },
    getList() {
      const res = this.getListAll();
      if (Array.isArray(res)) {
        return res.map((item, i) => {
          const item2 = { ...item };
          delete item2.request;
          delete item2.requestPost;
          delete item2._mid;
          return item2;
        });
      }
      return [];
    },
    findByKey(key: string) {
      if (key) {
        return db.get(this.LIST_KEY).find({ key }).value();
      }
      return null;
    },
    updateByKey(key: string, data: any) {
      return db
        .get(this.LIST_KEY)
        .find({ key })
        .assign({ ...data })
        .write();
    },
    removeByKey(key: string) {
      return db
        .get(this.LIST_KEY)
        .remove((item) => {
          return item.key === key;
        })
        .write();
    }
  },

  // 全局调试器
  debuggerGlobal: {
    getKeyByType() {
      return 'debugger.global';
    },
    getList() {
      const key = this.getKeyByType();
      const id = modelDb.getCurrProjectId();

      return db.get(key).filter({ _mid: id }).value();
    },
    save(data: any) {
      const mid = modelDb.getCurrProjectId();
      const key = this.getKeyByType();

      const find = db.get(key).find({ type: data.type, _mid: mid }).value();
      if (find) {
        return this.update(data.type, mid, data);
      }

      db.get(key)
        .push({ _mid: mid, ...data })
        .write();
      return data;
    },
    update(type: EnvType, mid: string, data: any) {
      const key = this.getKeyByType();
      return db
        .get(key)
        .find({ type, _mid: mid })
        .assign({ ...data })
        .write();
    },
    getGlobalParams(): GlobalRequestParams {
      const type = 'params';
      const mid = modelDb.getCurrProjectId();
      const find = db.get(this.getKeyByType()).find({ type, _mid: mid }).value();
      if (find && find.data) {
        const { query, header, cookie, bodyFormData } = find.data;
        return {
          query: utils.dataTransform(query),
          header: utils.dataTransform(header),
          cookie: utils.dataTransform(cookie),
          bodyFormData: utils.dataTransform(bodyFormData)
        };
      }
      return {
        query: null,
        header: null,
        cookie: null,
        bodyFormData: null
      };
    }
  },

  debuggerEnvList: {
    getKeyByType() {
      return 'debugger.envList';
    },
    getList() {
      const key = this.getKeyByType();
      const id = modelDb.getCurrProjectId();
      return db.get(key).filter({ _mid: id }).value();
    },
    save(envName: string, data: any) {
      const mid = modelDb.getCurrProjectId();
      const key = this.getKeyByType();

      const find = db.get(key).find({ _mid: mid, envName }).value();
      if (find) {
        return this.update(mid, envName, data);
      }
      data._mid = modelDb.getCurrProjectId();
      db.get(key)
        .push({ _mid: mid, envName, ...data })
        .write();
      return data;
    },
    update(mid: string, envName: string, data: any) {
      const key = this.getKeyByType();
      return db
        .get(key)
        .find({ _mid: mid, envName })
        .assign({ ...data })
        .write();
    },
    getCurrentEnv() {
      return db.get('debugger.currentEnv').value();
    },
    setCurrentEnv(env: string) {
      db.set('debugger.currentEnv', env).write();
      return env;
    },
    getCurrentEnvConfig() {
      const mid = modelDb.getCurrProjectId();
      const envName = this.getCurrentEnv();
      const find = db.get(this.getKeyByType()).find({ envName, _mid: mid }).value();
      if (find && find.form) {
        return find.form;
      }
      return null;
    }
  }
};

export default modelDb;
