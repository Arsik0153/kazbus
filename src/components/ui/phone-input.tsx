'use client';

import * as React from 'react';
import { useMask } from '@react-input/mask';
import { Input } from '@/components/ui/input';

const PhoneInput = React.forwardRef<
    HTMLInputElement,
    React.ComponentPropsWithoutRef<typeof Input>
>((props, forwardedRef) => {
    const maskRef = useMask({
        mask: '+7 (___) ___-__-__',
        replacement: { _: /\d/ },
    });

    const setRef = React.useCallback(
        (node: HTMLInputElement | null) => {
            maskRef.current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
        },
        [forwardedRef, maskRef]
    );

    return <Input ref={setRef} type="tel" inputMode="numeric" {...props} />;
});

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
