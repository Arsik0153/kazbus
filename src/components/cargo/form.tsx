'use client';

import {
    createContext,
    useContext,
    useId,
    useRef,
    useState,
    type ComponentProps,
} from 'react';
import { z } from 'zod';
import { useMask } from '@react-input/mask';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
    cargoValidationErrors,
    formatCargoPhone,
} from '@/lib/cargo-validation';

const Errors = createContext<Record<string, string>>({});
function FieldError({ id, message }: { id: string; message?: string }) {
    return message ? (
        <p id={id} role="alert" className="text-destructive text-sm">
            {message}
        </p>
    ) : null;
}

function PhoneInput(props: ComponentProps<typeof Input>) {
    const ref = useMask({
        mask: '+_ (___) ___-__-__',
        replacement: { _: /[0-9]/ },
        track: ({ inputType, data, value, selectionStart, selectionEnd }) => {
            if (inputType !== 'insert' || !data) return;
            if (!/^[0-9+()\s-]+$/.test(data)) return false;
            const candidate =
                value.slice(0, selectionStart) +
                data +
                value.slice(selectionEnd);
            if (candidate.replace(/[^0-9]/g, '').length > 11) return false;
        },
    });
    return <Input {...props} ref={ref} />;
}

export function CargoInput({ name, ...props }: ComponentProps<typeof Input>) {
    const id = useId();
    const errors = useContext(Errors);
    const error = name ? errors[name] : undefined;
    const phone =
        props.type === 'tel' ||
        name === 'phone_number' ||
        name === 'contact_phone';
    if (props.type === 'checkbox')
        return (
            <input {...props} name={name} className="accent-primary size-4" />
        );
    const Control = phone ? PhoneInput : Input;
    const label =
        props['aria-label'] ??
        props.placeholder ??
        (props.type === 'date' ? 'Дата доставки' : name);
    return (
        <Field data-invalid={!!error}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Control
                {...props}
                name={name}
                id={id}
                type={phone ? 'tel' : props.type}
                inputMode={phone ? 'tel' : props.inputMode}
                defaultValue={
                    phone && typeof props.defaultValue === 'string'
                        ? formatCargoPhone(props.defaultValue)
                        : props.defaultValue
                }
                placeholder={phone ? '+7 (701) 000-00-00' : props.placeholder}
                aria-invalid={!!error}
                aria-describedby={
                    error ? `${id}-error` : props['aria-describedby']
                }
                onBlur={(event) => {
                    if (phone)
                        event.currentTarget.value = formatCargoPhone(
                            event.currentTarget.value
                        );
                    props.onBlur?.(event);
                }}
            />
            <FieldError id={`${id}-error`} message={error} />
        </Field>
    );
}
export function CargoTextarea({
    name,
    ...props
}: ComponentProps<typeof Textarea>) {
    const id = useId();
    const errors = useContext(Errors);
    const error = name ? errors[name] : undefined;
    return (
        <Field data-invalid={!!error}>
            <FieldLabel htmlFor={id}>
                {props['aria-label'] ?? props.placeholder}
            </FieldLabel>
            <Textarea
                {...props}
                name={name}
                id={id}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
            />
            <FieldError id={`${id}-error`} message={error} />
        </Field>
    );
}
export function CargoSelect({ name, ...props }: ComponentProps<'select'>) {
    const id = useId();
    const errors = useContext(Errors);
    const error = name ? errors[name] : undefined;
    return (
        <Field data-invalid={!!error}>
            <FieldLabel htmlFor={id}>
                {props['aria-label'] ??
                    (name === 'driver_id' ? 'Водитель' : 'Машина')}
            </FieldLabel>
            <select
                {...props}
                name={name}
                id={id}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className="border-input bg-background focus-visible:ring-ring aria-invalid:border-destructive h-12 w-full min-w-0 rounded-lg border px-3 text-sm outline-none focus-visible:ring-2"
            />
            <FieldError id={`${id}-error`} message={error} />
        </Field>
    );
}

export function CargoForm({
    children,
    schema,
    serverErrors = {},
    onSubmit,
    ...props
}: ComponentProps<'form'> & {
    schema: z.ZodType<unknown>;
    serverErrors?: Record<string, string>;
}) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pending, setPending] = useState(false);
    const locked = useRef(false);
    return (
        <form
            {...props}
            noValidate
            onSubmit={async (event) => {
                event.preventDefault();
                if (locked.current) return;
                const form = event.currentTarget;
                const parsed = schema.safeParse(
                    Object.fromEntries(new FormData(form))
                );
                if (!parsed.success) {
                    const fields = cargoValidationErrors(parsed.error);
                    setErrors(fields);
                    const control = form.elements.namedItem(
                        Object.keys(fields)[0]
                    );
                    if (control instanceof HTMLElement) control.focus();
                    return;
                }
                setErrors({});
                locked.current = true;
                try {
                    const operation = onSubmit?.(event);
                    setPending(true);
                    await operation;
                } finally {
                    locked.current = false;
                    setPending(false);
                }
            }}
            onChange={(event) => {
                const target = event.target;
                if (
                    target instanceof HTMLInputElement ||
                    target instanceof HTMLSelectElement ||
                    target instanceof HTMLTextAreaElement
                )
                    setErrors((current) => ({ ...current, [target.name]: '' }));
                props.onChange?.(event);
            }}
        >
            <Errors.Provider value={{ ...serverErrors, ...errors }}>
                <fieldset disabled={pending} className="min-w-0">
                    <FieldGroup>{children}</FieldGroup>
                </fieldset>
            </Errors.Provider>
        </form>
    );
}
