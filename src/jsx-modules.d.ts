// Type declarations for JSX modules (hybrid TypeScript + JSX approach)
declare module '*.jsx' {
  import { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}
