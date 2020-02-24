import Input from './components/input';
import Row from './components/row';
import Col from './components/col';
import 'reflect-metadata';
type MaterialInfoType = {
  name: string;
  icon: string;
  desc: string;
  isLayoutNode: boolean;
  layoutCapacity?: number;
  nodeDemandCapacity: number;
  type: string;
  iconMode?: 'src';
  config?: {
    name: string;
  }[];
};

export const getMetaInfo = (material: any) => {
  const metadata = {} as { [key: string]: any };
  const keys = Reflect.getMetadataKeys(material);
  keys.forEach(key => {
    metadata[key as string] = Reflect.getMetadata(key, material);
  });
  return metadata as MaterialInfoType;
};

export default {
  Input,
  Row,
  Col,
};
