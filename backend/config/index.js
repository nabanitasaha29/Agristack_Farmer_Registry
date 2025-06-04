import { indiaHierarchy,indiaConfig } from './countries/india.config.js';
import { ethiopiaHierarchy,ethiopiaConfig } from './countries/ethiopia.config.js';
import { nigeriaHierarchy,nigeriaConfig } from './countries/nigeria.config.js';
import {rwandaHierarchy,rwandaConfig} from './countries/rwanda.config.js';

export const fallbackHierarchy = {
  IN: indiaHierarchy,
  ET: ethiopiaHierarchy,
  NG: nigeriaHierarchy,
  RW: rwandaHierarchy
};

export const countryConfigs = {
  IN: indiaConfig,
  ET: ethiopiaConfig,
  NG: nigeriaConfig,
  RW: rwandaConfig,
};

// export const country = process.env.ACTIVE_COUNTRY ;
export const country = (process.env.ACTIVE_COUNTRY || 'IN').toUpperCase();
