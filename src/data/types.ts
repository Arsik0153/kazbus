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

export type Trip = {
    id: number;
    from_point: Point;
    to_point: Point;
    from_bus_station: BusStation;
    to_bus_station: BusStation;
    from_datetime: string;
    to_datetime: string;
    bus: string;
    price: string;
};

export type Driver = {
    full_name: string;
    date_of_birth: string;
};

export type Bus = {
    model_stamp: string;
    state_number: string;
    count_of_seats: number;
};
export type Stop = {
    id: number;
    name: string;
    travel_time_from_start: string; // Время в формате "HH:MM:SS"
    stop_time: string; // Время в формате "HH:MM:SS"
};

export type Routes = {
    id: number;
    start_city: string;
    end_city: string;
    total_travel_time: string; // Время в формате "HH:MM:SS"
    created_at: string; // Дата в формате ISO
    stops: Stop[];
};
