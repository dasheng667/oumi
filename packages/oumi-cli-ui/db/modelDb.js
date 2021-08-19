/* eslint-disable no-param-reassign */
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const utils = require('../utils');

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

  // 项目列表
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

  // 用户配置
  userConfig: {
    KEY: 'userConfig',
    get() {
      return db.get(this.KEY).value();
    },
    // 用户的swagger列表
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

    // 用户的swagger配置
    swaggerConfig: {
      KEY: 'userConfig.swaggerConfig',
      get() {
        return db.get(this.KEY).value();
      },
      set(data) {
        return db.set(this.KEY, data).write();
      }
    },

    // 其他私有配置
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

  // 资产列表
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

module.exports = modelDb;
