import { indiaHierarchy } from './countries/india.config.js';
import { kenyaHierarchy } from './countries/kenya.config.js';
import { nigeriaHierarchy } from './countries/nigeria.config.js';
import {rwandaHierarchy} from './countries/rwanda.config.js';

export const fallbackHierarchy = {
  IN: indiaHierarchy,
  KE: kenyaHierarchy,
  NG: nigeriaHierarchy,
  RW: rwandaHierarchy
};

// export const country = process.env.ACTIVE_COUNTRY ;
export const country = (process.env.ACTIVE_COUNTRY || 'IN').toUpperCase();
