'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          }
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const path_1 = __importDefault(require('path'));
const lowdb_1 = __importDefault(require('lowdb'));
const FileSync_1 = __importDefault(require('lowdb/adapters/FileSync'));
const utils = __importStar(require('../utils'));
const adapter = new FileSync_1.default(path_1.default.resolve(utils.rcFolder, 'db.json'));
const db = lowdb_1.default(adapter);
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
  userBlocks: [defaultBlock]
};
db.defaults(defaultData).write();
const modelDb = {
  lastImportPath: {
    KEY: 'lastImportPath',
    get() {
      const val = db.get(this.KEY).value();
      return val && val.length > 0 ? val : null;
    },
    set(val) {
      db.set('lastImportPath', val).write();
    }
  },
  dashboard: {
    KEY: 'dashboardId',
    get() {
      return db.get(this.KEY).value();
    },
    set(val) {
      db.set(this.KEY, val).write();
    }
  },
  projectList: {
    KEY: 'projectList',
    get() {
      return db.get(this.KEY).value();
    },
    push(data) {
      if (!this.get()) {
        db.set(this.KEY, []).write();
      }
      if (!data.id) {
        data.id = utils.createId();
      }
      db.get(this.KEY).push(data).write();
    },
    find(findParams) {
      return db.get(this.KEY).find(findParams).value();
    },
    findCurrent() {
      return db
        .get(this.KEY)
        .find({ id: db.get('dashboardId').value() })
        .value();
    },
    remove({ id, name }) {
      return db
        .get(this.KEY)
        .remove((item) => {
          return item.name === name || item.id === id;
        })
        .write();
    }
  },
  userConfig: {
    KEY: 'userConfig',
    get() {
      return db.get(this.KEY).value();
    },
    swagger: {
      KEY: 'userConfig.swagger',
      get() {
        return db.get(this.KEY).value();
      },
      add(data) {
        if (!this.get()) {
          db.set(this.KEY, []).write();
        }
        if (!data.id) {
          data.id = utils.createId();
        }
        return db.get(this.KEY).push(data).write();
      },
      remove(id) {
        if (id) {
          return db
            .get(this.KEY)
            .remove((item) => {
              return item.id === id;
            })
            .write();
        }
        return null;
      },
      findById(id) {
        return db.get(this.KEY).find({ id }).value();
      }
    },
    swaggerConfig: {
      KEY: 'userConfig.swaggerConfig',
      get() {
        return db.get(this.KEY).value();
      },
      set(data) {
        return db.set(this.KEY, data).write();
      }
    },
    private: {
      KEY: 'userConfig.private',
      get() {
        return db.get(this.KEY).value();
      },
      set(data) {
        return db.set(this.KEY, data).write();
      }
    }
  },
  userBlocks: {
    KEY: 'userBlocks',
    get() {
      return db.get(this.KEY).value();
    },
    add(data) {
      if (!this.get()) {
        db.set(this.KEY, []).write();
      }
      if (!data.id) {
        data.id = utils.createId();
      }
      return db.get(this.KEY).push(data).write();
    },
    remove(id) {
      if (id) {
        return db
          .get(this.KEY)
          .remove((item) => {
            return item.id === id;
          })
          .write();
      }
      return null;
    },
    findById(id) {
      return db.get(this.KEY).find({ id }).value();
    }
  }
};
exports.default = modelDb;
