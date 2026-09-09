import { z } from 'zod';
import { State } from './model';
const text = z.string();
const unit = z.enum(['шт.', 'коробок', 'паллет', 'кг', 'т']);
const attachment = z.object({ id: text, name: text });
const offer = z.object({
    amount: z.number().nonnegative(),
    eta: text,
    reason: text,
    status: z.enum(['pending', 'accepted', 'declined']),
    kind: z.enum(['initial', 'extra']),
});
const schema = z.object({
    version: z.literal(1),
    profile: z.object({
        name: text,
        company: text,
        phone: text,
        city: text,
        bin: text,
        notifications: z.boolean(),
    }),
    companies: z.array(
        z.object({
            id: text,
            name: text,
            city: text,
            description: text,
            relation: z.enum(['confirmed', 'requested', 'available']),
            phone: text,
        })
    ),
    orders: z.array(
        z.object({
            id: text,
            companyId: text,
            from: text,
            to: text,
            pickup: text,
            date: text,
            cargo: text,
            quantity: z.number().positive(),
            unit,
            weight: text.optional(),
            dimensions: text.optional(),
            comment: text,
            status: z.enum([
                'waiting',
                'offer',
                'planned',
                'transit',
                'delivered',
                'cancelled',
                'rejected',
            ]),
            stages: z.array(
                z.object({
                    id: text,
                    from: text,
                    to: text,
                    transport: text,
                    status: z.enum(['done', 'current', 'next']),
                    date: text,
                    contacts: z.array(
                        z.object({ name: text, role: text, phone: text })
                    ),
                })
            ),
            offer: offer.optional(),
            extra: offer.optional(),
            agreedPrice: z.number().nonnegative().optional(),
            invoice: z
                .object({
                    number: text,
                    amount: z.number().nonnegative(),
                    paid: z.boolean(),
                })
                .optional(),
            delay: text.optional(),
            originalEta: text.optional(),
            updated: text,
            proof: text.optional(),
            files: z.array(attachment),
            issues: z.array(
                z.object({
                    id: text,
                    text,
                    date: text,
                    files: z.array(attachment),
                })
            ),
            supplyId: text.optional(),
            occurrence: text.optional(),
            batchId: text.optional(),
        })
    ),
    supplies: z.array(
        z.object({
            id: text,
            title: text,
            companyId: text,
            from: text,
            to: text,
            fromCity: text.optional(),
            toCity: text.optional(),
            cargo: text,
            quantity: z.number().positive(),
            unit,
            mode: z.enum(['manual', 'weekly', 'monthly']),
            weekdays: z.array(z.number().int().min(0).max(6)),
            monthDay: z.number().int().min(1).max(31),
            automatic: z.boolean(),
            paused: z.boolean(),
            skipped: z.array(text),
            price: z.number().nonnegative(),
            approved: z.boolean(),
        })
    ),
    batches: z.array(
        z.object({
            id: text,
            companyId: text,
            warehouse: text,
            cargo: text,
            unit,
            onHand: z.number().nonnegative(),
            baseReserved: z.number().nonnegative(),
            source: text,
        })
    ),
});
export function restore(raw: string): State {
    return schema.parse(JSON.parse(raw));
}
