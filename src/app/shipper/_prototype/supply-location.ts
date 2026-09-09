import { cities } from '@/static/city';

export const supplyCities = Array.from(
    new Set([
        ...cities.map((city) => city.name),
        'Шымкент',
        'Москва',
        'Саратов',
        'Петропавл',
    ])
).sort((a, b) => a.localeCompare(b, 'ru'));

// Old supplies stored the complete location in one field. Split only a known
// city prefix; an address such as "Шалгынды, 13а" must remain untouched.
export function splitSupplyLocation(location: string, savedCity?: string) {
    const city =
        savedCity ??
        supplyCities.find((name) =>
            location
                .toLocaleLowerCase('ru')
                .startsWith(`${name.toLocaleLowerCase('ru')},`)
        ) ??
        '';
    const prefix = `${city},`;
    const address =
        city &&
        location
            .toLocaleLowerCase('ru')
            .startsWith(prefix.toLocaleLowerCase('ru'))
            ? location.slice(prefix.length).trim()
            : location;
    return { city, address };
}

export function fullSupplyLocation(city: string, address: string) {
    return `${city.trim()}, ${address.trim()}`;
}
