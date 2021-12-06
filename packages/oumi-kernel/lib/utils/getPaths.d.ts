export declare type IServicePathKeys = 'appPath' | 'absNodeModulesPath' | 'absOutputPath' | 'absSrcPath' | 'absPagesPath' | 'absTmpPath';
declare type IServicePaths = {
    [key in IServicePathKeys]: string;
};
export default function getServicePaths({ appPath, config, env, }: {
    appPath: string;
    config: any;
    env?: string;
}): IServicePaths;
export {};
