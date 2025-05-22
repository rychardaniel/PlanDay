import { addMonths, subMonths } from "date-fns";
import { HeaderMounthViewCalendar } from "./header-month-view-calendar";
import { BodyMonthViewCalendar } from "./body-month-view-calendar";

export function MonthViewCalendar() {
    return (
        <>
            <HeaderMounthViewCalendar />
            <div className="h-full overflow-y-auto overflow-x-hidden pb-9">
                <BodyMonthViewCalendar currentDate={subMonths(new Date(), 1)} />
                <BodyMonthViewCalendar currentDate={new Date()} />
                <BodyMonthViewCalendar currentDate={addMonths(new Date(), 1)} />
            </div>
        </>
    );
}
