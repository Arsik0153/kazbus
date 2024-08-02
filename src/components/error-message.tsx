import React from 'react';

type Props = {
    message?: string;
};

const ErrorMessage = (props: Props) => {
    const { message } = props;

    if (message)
        return (
            <p className="my-2 text-sm font-medium text-red-500">{message}</p>
        );

    return null;
};

export default ErrorMessage;
