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

export function IsLayout(isLayoutNode: boolean) {
  return function(constructor: Function) {
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

export function Config<T>(type: string) {
  return function(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {};
}
