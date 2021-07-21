/* eslint-disable no-param-reassign */
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const utils = require('../utils');

const adapter = new FileSync(path.resolve(__dirname, './locals.json'));
const db = low(adapter);

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
      return db.get(this.KEY).find(findParams);
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
      }
    }
  }
};

module.exports = modelDb;
