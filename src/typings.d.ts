/* SystemJS module definition */
declare var nodeModule: NodeModule;
interface NodeModule {
  id: string;
}

declare var windowx: Window;
interface Window {
  process: any;
  require: any;
}
