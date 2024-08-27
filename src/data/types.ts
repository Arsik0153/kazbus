export type AvailableDate = {
    price: number;
    date: string;
};

export type City = {
    id: number;
    name: string;
    region: string;
};

export type Ticket = {
    id: number;
    from_point: {
        id: number;
        name: string;
    };
    from_bus_station: {
        id: number;
        name: string;
    };
    from_date: string;
    from_time: string;
    to_point: {
        id: number;
        name: string;
    };
    to_bus_station: {
        id: number;
        name: string;
    };
    to_date: string;
    to_time: string;
    price: string;
    free_places_count: number;
    bus: {
        have_toilet: boolean;
        have_wifi: boolean;
        is_recumbent: boolean;
    };
    taxi_park: string;
};

export type Point = {
    id: number;
    name: string;
    region: string;
};

export type BusStation = {
    id: number;
    name: string;
    point: Point;
};

type Weekdays = {
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
    Sunday: boolean;
};

export type Trip = {
    id: number;
    departure_time: string;
    start_date: string; // "YYYY-MM-DD" format
    end_date: string; // "YYYY-MM-DD" format
    ticket_price: string; // assuming it's a string representing a decimal
    frequency: string; // e.g., "Daily"
    weekdays: Weekdays;
    status: string; // e.g., "active", "inactive"
    route: number;
    bus: string;
    driver: number;
};
