//filter.ts

export type Filters = {
  roadCondition: string[];
  roadType: string[];
  weather: string[];
  vehicleType: string[];
  severity: string[];
  year?: number;
  month?: number;         
  noc?: number;         
  nof?: number;         
  day?: string;           
  ALD: string[];
};
