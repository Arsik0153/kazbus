'use server';

import { Driver } from '@/data/types';
import { createServerAction } from 'zsa';
import { driverSchema } from '@/data/schemas';
import { z } from "zod";


export const getDriversAction = createServerAction().handler(async () => {
    const response = await fetch(`${process.env.API_URL}/drivers/`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        console.log(response);
        throw 'Произошла ошибка при получении списка водителей';
    }
    const result = (await response.json()) as Driver[];
    return result;
});
export const postDriversAction = createServerAction()
    .input(driverSchema, {type: "formData",})
    .handler(async ({ input }) => {
        const response = await fetch(
            `${process.env.API_URL}/drivers/`, {
            method: 'POST',
            body: JSON.stringify({
                full_name: input.full_name,
                date_of_birth: input.date_of_birth,
                license_number: input.license_number,
                license_issue_date: input.license_issue_date,
                picture: input.picture,
            }
            ),

            headers: {
                'Content-Type': 'application/json',
            },
        }
        );
        if (!response.ok) {
            throw new Error('Failed to save driver');
        }
        return await response.json();
    }
    );