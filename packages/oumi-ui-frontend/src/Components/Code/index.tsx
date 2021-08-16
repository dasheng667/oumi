/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';
import { docco, dark, github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';

export interface IProps {
  code: string;
  lang?: 'json' | 'xml' | 'jsx';
  style?: 'github';
}

export default function (props: IProps) {
  let { code } = props;
  const { style = 'github', lang = 'json' } = props;
  const styleMap = { docco, dark, github };

  if (typeof code !== 'string' && lang === 'json') {
    code = JSON.stringify(code, null, 2);
  }

  try {
    if (typeof code === 'string') {
      if (lang === 'xml') {
        code = prettier.format(code, { parser: 'html', plugins: [parserHtml] });
      } else if (lang === 'jsx') {
        code = prettier.format(code, {
          parser: 'babel',
          plugins: [parserBabel]
        });
      }
    } else {
      console.error('code 必须是字符串');
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="preview-code" style={{ fontSize: 12 }}>
      <SyntaxHighlighter language={lang} style={styleMap[style] || github} wrapLongLines>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
