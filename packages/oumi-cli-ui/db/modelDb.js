/* eslint-disable no-param-reassign */
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const utils = require('../utils');

const adapter = new FileSync(path.resolve(__dirname, './locals.json'));
const db = low(adapter);

// swagger有默认的数据
const defaultData = {
  userConfig: {
    swaggerConfig: {
      json_checked: false,
      mock_checked: true,
      requestLibPath: "import request from '@/api/request';",
      api_fileType: 'ts',
      outputFileType: 'merge',
      outputFileName: 'serve.ts'
    }
  }
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
    }
  }
};

module.exports = modelDb;
