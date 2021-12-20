/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
// import prettier from 'prettier';
// import parserBabel from 'prettier/parser-babel';
// import parserHtml from 'prettier/parser-html';
import { docco, dark, github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Button, message } from 'antd';
import copy from 'copy-to-clipboard';

import './index.less';

export interface IProps {
  isCopy?: boolean;
  code: string | object;
  lang?: 'json' | 'xml' | 'jsx' | 'javascript';
  style?: 'github';
}

export default function (props: IProps) {
  let { code } = props;
  const { style = 'github', lang = 'json', isCopy = false } = props;
  const styleMap = { docco, dark, github };

  if (typeof code !== 'string' && lang === 'json') {
    code = JSON.stringify(code, null, 2);
  }

  try {
    if (typeof code === 'string') {
      if (lang === 'xml') {
        // code = prettier.format(code, { parser: 'html', plugins: [parserHtml] });
      } else if (lang === 'jsx') {
        // code = prettier.format(code, {
        //   parser: 'babel',
        //   plugins: [parserBabel]
        // });
      }
    } else {
      console.error('code 必须是字符串', code);
      code = '{}';
    }
  } catch (e) {
    console.error(e);
  }

  const toCopy = () => {
    copy(typeof code === 'object' ? JSON.stringify(code, null, 2) : code);
    message.success('复制成功');
  };

  return (
    <div className="preview-code" style={{ fontSize: 12 }}>
      {isCopy && (
        <Button className="copy-btn" onClick={toCopy} size="small" type="primary">
          复制
        </Button>
      )}
      <SyntaxHighlighter language={lang} style={styleMap[style] || github} wrapLongLines>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
