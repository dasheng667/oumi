// Subs
import channels from './channels';
import type { SocketContext } from '../../typings/index';

const map = new Map();

export type ISetProgress = (func: (data: { status: string; args: string[] }) => void) => Promise<any>;

export function get(id: string) {
  return map.get(id);
}

export function set(data: any, context: SocketContext) {
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
  context.pubsub.publish(channels.PROGRESS_CHANGED, { progressChanged: progress });
  return progress;
}

export function remove(id: string, context: SocketContext) {
  context.pubsub.publish(channels.PROGRESS_REMOVED, { progressRemoved: id });
  return map.delete(id);
}

export const wrap = async (id: string, context: SocketContext, operation: ISetProgress) => {
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
