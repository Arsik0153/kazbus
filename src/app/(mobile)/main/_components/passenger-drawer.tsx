import Counter from '@/components/counter';
import React from 'react';
import { Drawer } from 'vaul';

const PassengerDrawer = () => {
    return (
        <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-30 mt-24 flex flex-col rounded-t-[10px] bg-white pb-24">
                <div className="flex-1 rounded-t-[10px] bg-white p-4">
                    <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
                    <div className="mx-auto max-w-md">
                        <h4 className="text-center text-2xl font-bold text-[#E74949]">
                            Сколько пассажиров?
                        </h4>

                        <div className="mt-6 flex justify-between">
                            <div className="flex flex-col justify-center">
                                <h1 className="text-xl font-semibold text-[var(--black)]">
                                    Взрослый
                                </h1>
                                <p className="text-sm font-medium text-[#A0A0A0]">
                                    от 12 лет
                                </p>
                            </div>
                            <Counter />
                        </div>

                        <div className="mt-6 flex justify-between">
                            <div className="flex flex-col justify-center">
                                <h1 className="text-xl font-semibold text-[var(--black)]">
                                    Детские
                                </h1>
                                <p className="text-sm font-medium text-[#A0A0A0]">
                                    младше 12 лет
                                </p>
                            </div>
                            <Counter />
                        </div>
                    </div>
                </div>
            </Drawer.Content>
        </Drawer.Portal>
    );
};

export default PassengerDrawer;
