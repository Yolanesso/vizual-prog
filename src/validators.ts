import { QueryStage } from './types';

export function getAllowedNextStage(current?: QueryStage): QueryStage[] {
  if (!current) return ['where', 'groupBy', 'having', 'sort'];
  
  switch (current) {
    case 'where': 
      return ['where', 'groupBy', 'sort'];
    case 'groupBy': 
      return ['groupBy', 'having', 'sort'];
    case 'having': 
      return ['having', 'sort'];
    case 'sort': 
      return ['sort'];
    default: 
      return [];
  }
}

export function validateSequence(stages: QueryStage[]): boolean {
  let lastStage: QueryStage | undefined = undefined;
  
  for (const stage of stages) {
    const allowed = getAllowedNextStage(lastStage);
    if (!allowed.includes(stage)) {
      throw new Error(
        `Неверный порядок операций: ${lastStage || 'начало'} -> ${stage}. ` +
        `Допустимо: ${allowed.join(' -> ')}`
      );
    }
    lastStage = stage;
  }
  
  return true;
}

export function validateTypes(data: any[], operation: any): boolean {
  if (operation.type === 'groupBy' || operation.type === 'having') {
    return Array.isArray(data) && data.every(item => 'key' in item && 'items' in item);
  }
  return Array.isArray(data);
}