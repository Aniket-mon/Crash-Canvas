export type Filters = {
  roadCondition: string;
  roadType: string;
  weather: string;
  driverGender: string;
  vehicleType: never[];
  severity: never[];
  year?: number;
  month?: number;         
  day?: string;           
  region: string;
  state?: string;
};
