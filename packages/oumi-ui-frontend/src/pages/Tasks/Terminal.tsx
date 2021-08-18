import React, { useRef, useEffect } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { useEventListener } from '../../hook';

import 'xterm/css/xterm.css';

const defaultTheme = {
  foreground: '#2c3e50',
  background: '#fff',
  cursor: 'rgba(0, 0, 0, .4)',
  selection: 'rgba(0, 0, 0, 0.3)',
  black: '#000000',
  red: '#e83030',
  brightRed: '#e83030',
  green: '#42b983',
  brightGreen: '#42b983',
  brightYellow: '#ea6e00',
  yellow: '#ea6e00',
  magenta: '#e83030',
  brightMagenta: '#e83030',
  cyan: '#03c2e6',
  brightBlue: '#03c2e6',
  brightCyan: '#03c2e6',
  blue: '#03c2e6',
  white: '#d0d0d0',
  brightBlack: '#808080'
};

const darkTheme = {
  ...defaultTheme,
  foreground: '#fff',
  background: '#1d2935',
  cursor: 'rgba(255, 255, 255, .4)',
  selection: 'rgba(255, 255, 255, 0.3)',
  magenta: '#e83030',
  brightMagenta: '#e83030'
};

export const term = new Terminal({
  theme: defaultTheme,
  cols: 100,
  rows: 100
});

export const fitAddon = new FitAddon();
const webLinksAddon = new WebLinksAddon();

term.loadAddon(fitAddon);
term.loadAddon(webLinksAddon);

const setContent = (value: string, ln = true) => {
  if (value.indexOf('\n') !== -1) {
    value.split('\n').forEach((t) => setContent(t));
    return;
  }
  if (typeof value === 'string') {
    term[ln ? 'writeln' : 'write'](value);
  } else {
    term.writeln('');
  }
};

const addLog = (log: any) => {
  setContent(log.text, log.type === 'stdout');
};

export default function RenderTerminal() {
  const xtermRef: any = useRef(null);

  useEventListener(
    'resize',
    () => {
      fitAddon.fit();
    },
    { target: window }
  );

  useEffect(() => {
    if (xtermRef) {
      term.open(xtermRef.current);
    }
  }, []);

  return <div className="xterm-render" ref={xtermRef} />;
}
