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
        id: number | null;
        name: string;
        latitude: string;
        longitude: string;
    };
    from_date: string;
    from_time: string;
    to_point: {
        id: number;
        name: string;
    };
    to_bus_station: {
        id: number | null;
        name: string;
        latitude: string;
        longitude: string;
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
    id: number | null;
    name: string;
    point?: Point;
    latitude?: string;
    longitude?: string;
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

export type Route = {
    start_city: string;
    end_city: string;
    total_travel_time: string;
};

export type GetRequestData = {
    departure_time: string;
    is_always_active: boolean;
    start_date: string | null;
    end_date: string | null;
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
    id: number;
    picture: string | null;
    full_name: string;
    date_of_birth: string;
    license_number: string;
    license_issue_date: string;
    is_active: boolean;
    trip_count: number;
    created_at: string;
    updated_at: string;
};

export type Bus = {
    id?: string;
    name?: string;
    stamp?: string | null;
    model?: string | null;
    model_stamp: string;
    state_number: string;
    VIN?: string;
    count_of_seats: number;
    have_toilet: boolean;
    have_wifi: boolean;
    is_recumbent: boolean;
    floors?: number | null;
    scheme?: string | null;
    seats?: Array<{
        seat_id: number;
        seat_col: number;
        seat_row: number;
        seat_type: 'aisle' | 'passenger' | 'driver';
    }>;
};

export type Stop = {
    id: number;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    travel_time_from_start: string; // Время в формате "HH:MM:SS"
    stop_time: string; // Время в формате "HH:MM:SS"
};
export type Routes = {
    id: number;
    start_city: Point;
    start_address: string;
    start_latitude: string;
    start_longitude: string;
    end_city: Point;
    end_address: string;
    end_latitude: string;
    end_longitude: string;
    total_travel_time: string; // Время в формате "HH:MM:SS"
    created_at: string; // Дата в формате ISO
    stops: Stop[];
};

export type Trips = {
    id: number;
    departure_time: string; // Время в формате "HH:MM:SS"
    is_always_active: boolean;
    start_date: string | null; // Дата в формате "YYYY-MM-DD"
    end_date: string | null; // Дата в формате "YYYY-MM-DD"
    ticket_price: string; // Цена в виде строки
    frequency: string;
    weekdays: Weekdays;
    status: string;
    route: Routes;
    bus: Bus | null;
    driver: Driver | null;
    from_city: string;
    to_city: string;
    status_description?: string;
    come_to_point?: string;
};

export type Passenger = {
    place_num: number;
    place_floor: number;
    passenger: string;
};

export type DirectionNew = {
    id: number;
    departure_time: string; // Время в формате "HH:MM:SS"
    is_always_active: boolean;
    start_date: string | null; // Дата в формате "YYYY-MM-DD"
    end_date: string | null; // Дата в формате "YYYY-MM-DD"
    ticket_price: string; // Цена в виде строки
    frequency: string;
    weekdays: Weekdays;
    status: string;
    route: {
        id: number;
        start_city: Point;
        end_city: Point;
        total_travel_time: string;
        created_at: string; // ISO формат
        stops: Stop[]; // Empty array in this case
    };
    bus: {
        id: string;
        name: string;
        model_stamp: string;
        state_number: string;
        VIN: string;
        count_of_seats: number;
        have_toilet: boolean;
        have_wifi: boolean;
        is_recumbent: boolean;
        scheme: string | null;
        floors: number;
    };
    driver: {
        id: number;
        full_name: string;
        date_of_birth: string; // Дата рождения водителя в формате "YYYY-MM-DD"
        picture: string; // Ссылка на картинку
    };
    from_city: string;
    to_city: string;
    status_description: string;
};

export type TicketDetailed = {
    id: number;
    qr_code: string;
    direction: DirectionNew;
    passengers: Passenger[];
    status: string;
};

export type BusSeat = {
    seat_id: number;
    seat_col: number;
    seat_row: number;
    seat_type: 'aisle' | 'passenger' | 'driver';
    status: 'free' | 'booked' | 'paid';
};

export type BusSeats = {
    bus: string;
    seats: BusSeat[];
};
