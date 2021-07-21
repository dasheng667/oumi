import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { CaretDownOutlined, CaretRightOutlined, LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';

const SwaggerList = (props: any) => {
  const { swaggerList, expandData = {}, expandCacheId, loadingId, onClickSwaggerHead, setSelectId, selectId } = props;

  // console.log('props', props)

  const onAllChange = (e: React.MouseEvent, item: any) => {
    const all = Object.keys(expandData[item.id] || {});

    if (selectId.includes(all[0])) {
      setSelectId(selectId.filter((k: string) => !all.includes(k)));
    } else {
      setSelectId([...selectId, ...all]);
    }

    e.stopPropagation();
    e.preventDefault();
  };

  const onChange = (key: string) => {
    if (selectId.includes(key)) {
      setSelectId(selectId.filter((k: string) => k !== key));
    } else {
      setSelectId([...selectId, key]);
    }
  };

  return (
    <div className="swagger-list">
      {swaggerList &&
        swaggerList.map((item: any) => {
          return (
            <div className="swagger-list-item" key={item.id}>
              <div className="heading" onClick={() => onClickSwaggerHead(item)}>
                <div className="options">
                  {(() => {
                    if (loadingId === item.id) {
                      return <LoadingOutlined />;
                    }
                    if (expandCacheId.includes(item.id)) {
                      return <CaretDownOutlined />;
                    }
                    return <CaretRightOutlined />;
                  })()}
                  {expandCacheId.includes(item.id) && (
                    <span className="all" onClick={(e) => onAllChange(e, item)}>
                      全选
                    </span>
                  )}
                </div>
                <h3>{item.name}</h3>
              </div>

              {expandCacheId.includes(item.id) && (
                <div className="content">
                  <ul className="content-list">
                    {/* <Checkbox.Group onChange={onChange}> */}
                    {expandData &&
                      expandData[item.id] &&
                      Object.keys(expandData[item.id]).map((key) => {
                        const value = expandData[item.id][key];
                        return (
                          <li className={`${value.methods || 'get'}`} key={key}>
                            <span className="checkbox">
                              <Checkbox value={key} onChange={() => onChange(key)} checked={selectId.includes(key)} />
                            </span>
                            <span className="methods">{(value.methods || 'get').toLocaleUpperCase()}</span>
                            <span className="path">{key}</span>
                            <span className="desc" title={value.description}>
                              {value.description}
                            </span>
                          </li>
                        );
                      })}
                    {/* </Checkbox.Group> */}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default SwaggerList;
