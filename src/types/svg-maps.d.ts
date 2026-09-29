declare module "@svg-maps/india" {
  export interface Location {
    id: string;
    name: string;
    path: string;
  }

  export interface MapData {
    label: string;
    viewBox: string;
    locations: Location[];
  }

  const India: MapData;
  export default India;
}
