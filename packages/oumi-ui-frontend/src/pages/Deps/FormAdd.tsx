import React, { useState } from 'react';
import { LinkOutlined } from '@ant-design/icons';
import { Input, AutoComplete } from 'antd';
import type { SelectProps } from 'antd/es/select';
import { useRequest } from '@src/hook';

interface OptionItem {
  name: string;
  version: string;
  description: string;
  link: string;
}

interface Props {
  installPackage: (name: string, version?: string) => void;
}

function debounce(fun: any, wait = 300) {
  let timeout: any = null;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // eslint-disable-next-line prefer-spread
      fun.apply(null, args);
    }, wait);
  };
}

const searchResult = (val: OptionItem[]) =>
  val.map((_, idx) => {
    const { link, name, description, version } = _;
    return {
      value: name,
      label: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span>
            {name}
            <small>
              &nbsp;&nbsp;
              <a href={link} target="_blank" rel="noopener noreferrer">
                <LinkOutlined />
              </a>
            </small>
          </span>
          <span>{version}</span>
        </div>
      )
    };
  });

export default (props: Props) => {
  const { installPackage } = props;
  const { request, data } = useRequest('/api/npm/search', { lazy: true });

  const [options, setOptions] = useState<SelectProps<object>['options']>([]);
  const [list, setList] = useState<OptionItem[]>([]);

  const handleSearch = async (value: string) => {
    // console.log('value', value);
    if (!value || value.length < 2) {
      return;
    }
    const res = await request({ name: value });
    if (Array.isArray(res)) {
      const searchOptions: OptionItem[] = [];
      res.forEach((item: any) => {
        searchOptions.push({
          name: item.name,
          version: item.version,
          description: item.description,
          link: item.links && item.links.homepage
        });
      });
      setList(searchOptions);
      setOptions(searchResult(searchOptions));
    }
  };

  const onSelect = (value: string) => {
    const find = list.find((item) => item.name === value);
    installPackage(value, find?.version);
  };

  return (
    <div className="">
      <AutoComplete
        dropdownMatchSelectWidth={252}
        style={{ width: 300 }}
        options={options}
        onSelect={onSelect}
        onSearch={debounce(handleSearch)}
      >
        <Input.Search size="middle" allowClear placeholder="安装依赖" enterButton />
      </AutoComplete>
    </div>
  );
};
