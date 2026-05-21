// Shared mock Type factories for emitter unit testing.
// Import from '@specodec/typespec-emitter-core/test-utils'

export interface MockScalarType { kind: "Scalar"; name: string; }
export interface MockEnumType { kind: "Enum"; name: string; members: { name: string; value?: number }[]; }
export interface MockModelType { kind: "Model"; name: string; indexer?: { key: { name: string }; value: any }; properties?: Map<string, any>; }
export type MockType = MockScalarType | MockModelType | MockEnumType;

export function mkScalar(name: string): MockScalarType { return { kind: "Scalar", name }; }
export function mkModel(name: string, props?: Record<string, any>): MockModelType {
  const properties = new Map<string, any>();
  if (props) for (const [k, v] of Object.entries(props)) {
    if (v && 'kind' in v) properties.set(k, { type: v, name: k });
    else if (v && 'type' in v) properties.set(k, v);
  }
  return { kind: "Model", name, properties };
}
export function mkEnum(name: string, members: string[]): MockEnumType {
  return { kind: "Enum", name, members: members.map((m, i) => ({ name: m, value: i })) };
}
export function mkArray(elem: MockType): MockModelType {
  return { kind: "Model", name: "Array", indexer: { key: { name: "integer" }, value: elem } };
}
export function mkRecord(val: MockType): MockModelType {
  return { kind: "Model", name: "Record", indexer: { key: { name: "string" }, value: val } };
}
export const ALL_SCALARS = ["string","boolean","bytes","int8","int16","int32","int64","uint8","uint16","uint32","uint64","float32","float64","float","decimal","integer"] as const;
