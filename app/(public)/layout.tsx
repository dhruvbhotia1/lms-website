import React from "react";
import {Navbar} from "@/app/(public)/_components/Navbar";
import "@/app/globals.css"


interface Props {

    children: React.ReactNode
}


export default async function HomeLayout ({children}: Props) {



    return (
        <div>

            <Navbar />

            <main className={"container mx-auto px-4 md:px-6 lg:px-8"}>
                {children}
            </main>
        </div>
    )
}