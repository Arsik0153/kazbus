import Button from "@/components/button";
import React from "react";
import FullPageSelector from "@/components/fullpageselector";
import ArrowRightIcon from "../../public/assets/arrow-right-icon";

export default function Home() {
    return (
        <main className="bg-sky-500/100 flex min-h-screen flex-col items-center justify-between p-10">
            <FullPageSelector icon={<ArrowRightIcon/>} text={"Откуда вы направляетесь?"}/>
        </main>
    );
}
