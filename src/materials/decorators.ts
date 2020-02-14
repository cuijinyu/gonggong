export function Icon(iconName: string) {
  return function(constructor: Function) {
    Reflect.defineMetadata('icon', iconName, constructor);
  };
}

export function Desc(desc: string) {
  return function(constructor: Function) {
    Reflect.defineMetadata('desc', desc, constructor);
  };
}

export function IsLayout(isLayoutNode: boolean): any;
export function IsLayout(isLayoutNode: boolean, layoutCapacity: number): any;
export function IsLayout(isLayoutNode: boolean, layoutCapacity?: number) {
  return function(constructor: Function) {
    if (isLayoutNode && layoutCapacity) {
      Reflect.defineMetadata('layoutCapacity', layoutCapacity, constructor);
    }
    Reflect.defineMetadata('isLayoutNode', isLayoutNode, constructor);
  };
}

export function Material() {
  return function(constructor: Function) {
    const type = constructor.name.replace('Material', '');
    Reflect.defineMetadata('type', type, constructor);
  };
}

export function NodeDC(dc: number) {
  return function(constructor: Function) {
    Reflect.defineMetadata('nodeDemandCapacity', dc, constructor);
  };
}

// TODO: config装饰器的设计
export function Config() {
  return function(target: any, propertyName: string) {
    const prevConfig = Reflect.getMetadata('config', target) || [];
    const nextConfig = [
      ...prevConfig,
      {
        name: propertyName,
      },
    ];
    Reflect.defineMetadata('config', nextConfig, target.constructor);
  };
}
