import { guests } from "./guests";
import { getMap } from "./map";

const bookedByGuest = new Set<string>();

function normalizeName(name: string): string[] {
    return name
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);
}

function namesMatch(inputName: string, guestName: string): boolean {
    const inputParts = normalizeName(inputName);
    const guestParts = normalizeName(guestName);

    if (inputParts.length !== 2 || guestParts.length !== 2) {
        return false;
    }

    const normalOrder = 
        inputParts[0] === guestParts[0] &&
        inputParts[1] === guestParts[1];

    const reverseOrder =
        inputParts[0] === guestParts[1] &&
        inputParts[1] === guestParts[0];

    return normalOrder || reverseOrder;
}

export function bookCabana(data) {

    const { guestName, room, cabanaId } = data;

    const guest = guests.find(
        g => g.room === room &&
             namesMatch(guestName, g.guestName)
    );


    if (!guest) {
        return {
            success: false,
            message: "Invalid room number or guest name"
        };
    }

    if (bookedByGuest.has(room)) {
        return {
            success: false,
            message: "You have already booked a cabana"
        };
    }

    const cabana = getMap()
        .rows
        .flat()
        .find(
            tile =>
                tile.type === "cabana" &&
                tile.id === cabanaId
        );


    if (!cabana) {
        return {
            success: false,
            message: "Cabana not found"
        };
    }

    if (!cabana.available) {
        return {
            success: false,
            message: "Cabana is already booked"
        };
    }

    cabana.available = false;

    bookedByGuest.add(room);

    return {
        success: true,
        message: "Cabana booked"
    };
}