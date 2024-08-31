export type AvailableDate = {
    price: string;
    date: string;
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
    status: string;
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
    route: Route;
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


export type Driver = {
    full_name: string;
    date_of_birth: string;
};

export type Bus = {
    id: number;
    model_stamp: string;
    state_number: string;
    count_of_seats: number;
    have_toilet: boolean;
    have_wifi: boolean;
    is_recumbent: boolean;
};

export type Stop = {
    id: number;
    name: string;
    travel_time_from_start: string; // Время в формате "HH:MM:SS"
    stop_time: string; // Время в формате "HH:MM:SS"
};
export type City = {
    id: number;
    name: string;
    region: string;
};
export type Route = {
    id: number;
    start_city: string;
    end_city: string;
    total_travel_time: string; // Время в формате "HH:MM:SS"
    created_at: string; // Дата в формате ISO
    stops: Stop[];
};


export type Trips = {
    id: number;
    departure_time: string; // Время в формате "HH:MM:SS"
    start_date: string; // Дата в формате "YYYY-MM-DD"
    end_date: string; // Дата в формате "YYYY-MM-DD"
    ticket_price: string; // Цена в виде строки
    frequency: string;
    weekdays: Weekdays;
    status: string;
    route: Route;
    bus: Bus;
    driver: number; // ID водителя
    from_city: string;
    to_city: string;
};
