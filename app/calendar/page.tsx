import { Header } from "@/components/header";
import { Body } from "@/components/body";

export default function Calendar() {
    return (
        <div className="min-h-screen w-screen flex flex-col">
            <Header />
            <Body />
        </div>
    );
}
