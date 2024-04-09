export interface IItems {
    id: number;
    item: string;
}

export const artistItems: IItems[] = [
    {
        id: 1,
        item: 'Add to play list',
    },
    {
        id: 2,
        item: 'Add to queue',
    },
    {
        id: 3,
        item: 'Next to play',
    },
    {
        id: 4,
        item: 'Share',
    },
    {
        id: 5,
        item: 'Play',
    },
];

export const albumItems: IItems[] = [
    {
        id: 1,
        item: 'Favorite',
    },
    {
        id: 2,
        item: 'Download',
    },
    {
        id: 3,
        item: 'Share',
    },
    {
        id: 4,
        item: 'View Details',
    },
];