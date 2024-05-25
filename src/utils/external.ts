export interface RegisterData {
    name: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface Sport {
    id: string;
    name: string;
}

export interface Player {
    id: string;
    name: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
}

export interface Location {
    id: string;
    name: string;
    address: string;
    city: string;
}

export interface SportEvent {
    id: string;
    name: string;
    eventOwner: Player;
    maxPeople: number;
    currentPeople: number;
    location: Location;
    startTime: string;
    locked: boolean;
    sport: Sport;
    playersViaApp?: Player[];
}

export interface CreateEventInfo {
    name: string;
    maxPeople: number;
    currentPeople: number;
    location: Location;
    startTime: string;
    locked: boolean;
    sport: Sport;
}