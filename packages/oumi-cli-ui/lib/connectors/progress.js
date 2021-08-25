'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.wrap = exports.remove = exports.set = exports.get = void 0;
const channels_1 = __importDefault(require('./channels'));
const map = new Map();
function get(id) {
  return map.get(id);
}
exports.get = get;
function set(data, context) {
  const { id } = data;
  let progress = get(id);
  if (!progress) {
    progress = data;
    map.set(id, {
      status: null,
      error: null,
      info: null,
      args: null,
      progress: -1,
      ...progress
    });
  } else {
    Object.assign(progress, data);
  }
  context.pubsub.publish(channels_1.default.PROGRESS_CHANGED, { progressChanged: progress });
  return progress;
}
exports.set = set;
function remove(id, context) {
  context.pubsub.publish(channels_1.default.PROGRESS_REMOVED, { progressRemoved: id });
  return map.delete(id);
}
exports.remove = remove;
const wrap = async (id, context, operation) => {
  set({ id }, context);
  let result;
  try {
    result = await operation((data) => {
      set({ id, ...data }, context);
    });
  } catch (error) {
    console.error(error);
    set({ id, error: error.message }, context);
  }
  remove(id, context);
  return result;
};
exports.wrap = wrap;
