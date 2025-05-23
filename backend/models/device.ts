export interface Device {
    id: number;
    name: string;
    type: string;
    ip: string;
    status: 'active' | 'error' | 'inactive';
    location: string;
}
