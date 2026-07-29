import { guests } from "./guests";
import { getMap } from "./map";

export function bookCabana(data) {

    const { guestName, room, cabanaId } = data;

    const guest = guests.find(
        g => g.room === room &&
             g.guestName === guestName
    );


    if (!guest) {
        return {
            success: false,
            message: "Invalid room number or guest name"
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


    return {
        success: true,
        message: "Cabana booked"
    };
}