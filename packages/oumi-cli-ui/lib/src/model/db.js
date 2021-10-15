"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const lowdb_1 = __importDefault(require("lowdb"));
const FileSync_1 = __importDefault(require("lowdb/adapters/FileSync"));
const utils = __importStar(require("../utils"));
const file_1 = require("../utils/file");
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
    userBlocks: [defaultBlock],
    debugger: {
        currentEnv: 'dev',
        global: [],
        envList: [],
        list: []
    }
};
db.defaults(defaultData).write();
const loop = (data, key, callback) => {
    if (!Array.isArray(data))
        return;
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
        collection(id, collect) {
            return db.get(this.KEY).find({ id }).assign({ collection: !!collect }).write();
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
            readConfig() {
                const find = modelDb.projectList.findCurrent();
                if (find && find.path) {
                    const file = file_1.readConfigFile(find.path);
                    if (file && Array.isArray(file.swaggerList)) {
                        return file.swaggerList.map((v) => ({ ...v, default: true }));
                    }
                }
                return [];
            },
            get() {
                const res = db.get(this.KEY).value() || [];
                return [...this.readConfig(), ...res];
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
                const dbFind = db.get(this.KEY).find({ id }).value();
                if (dbFind)
                    return dbFind;
                return this.readConfig().find((v) => v.id === id);
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
    },
    debugger: {
        KEY: 'debugger',
        LIST_KEY: 'debugger.list',
        createId() {
            return utils.createId(10);
        },
        pushNode(data) {
            const data2 = { ...data };
            if (!data2.key) {
                data2.key = this.createId();
            }
            data2._mid = modelDb.getCurrProjectId();
            db.get(this.LIST_KEY).push(data2).write();
            return data2;
        },
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
        findByKey(key) {
            if (key) {
                return db.get(this.LIST_KEY).find({ key }).value();
            }
            return null;
        },
        updateByKey(key, data) {
            return db
                .get(this.LIST_KEY)
                .find({ key })
                .assign({ ...data })
                .write();
        },
        removeByKey(key) {
            return db
                .get(this.LIST_KEY)
                .remove((item) => {
                return item.key === key;
            })
                .write();
        }
    },
    debuggerGlobal: {
        getKeyByType() {
            return 'debugger.global';
        },
        getList() {
            const key = this.getKeyByType();
            const id = modelDb.getCurrProjectId();
            return db.get(key).filter({ _mid: id }).value();
        },
        save(data) {
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
        update(type, mid, data) {
            const key = this.getKeyByType();
            return db
                .get(key)
                .find({ type, _mid: mid })
                .assign({ ...data })
                .write();
        },
        getGlobalParams() {
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
        save(envName, data) {
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
        update(mid, envName, data) {
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
        setCurrentEnv(env) {
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
exports.default = modelDb;
