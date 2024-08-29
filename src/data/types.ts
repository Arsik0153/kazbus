export type AvailableDate = {
    price: string;
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
    from_point: Point;
    to_point: Point;
    from_bus_station: BusStation;
    to_bus_station: BusStation;
    from_datetime: string;
    to_datetime: string;
    price: string;
};

export type Direction = {
    id: number;
    from_point: Point;
    to_point: Point;
    from_bus_station: BusStation;
    to_bus_station: BusStation;
    from_datetime: string;
    to_datetime: string;
    price: string;
};

export type Route = {
    start_city: string;
    end_city: string;
    total_travel_time: string;
};

export type Bus = {
    have_toilet: boolean;
    have_wifi: boolean;
    is_recumbent: boolean;
};

export type GetRequestData = {
    departure_time: string;
    start_date: string;
    end_date: string;
    ticket_price: string;
    frequency: string;
    weekdays: Weekdays;
    status: string;
    route: Route;
    bus: Bus;
    driver: number;
    from_city: string;
    to_city: string;
};
