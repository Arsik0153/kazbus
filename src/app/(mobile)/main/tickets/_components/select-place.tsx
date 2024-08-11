import React from 'react';
import { Steps } from '../page';
import BusLayout from './bus-layout';

type Props = {
    setStep: (step: Steps) => void;
};

const SelectPlace = (props: Props) => {
    const { setStep } = props;

    return (
        <div className="p-4">
            <div>SelectPlace</div>
            <BusLayout />
        </div>
    );
};

export default SelectPlace;
