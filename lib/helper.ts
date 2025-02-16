export const currentIsFirstParticipant = (currentUserId: string, otherEndUserId: string) => {
    return currentUserId < otherEndUserId;
}

type DayOfTheWeek =
    | "Sunday"
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday";

const daysOfTheWeek: DayOfTheWeek[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

/**
 * If the target is within the same day then time is returned.
 * If it is within one week then the day is returned.
 * Otherwise the date is returned
 * @param targetDateInstance
 * @returns
 */
export const getProperTimeUpdated = (targetDateInstance: Date) => {
    const targetDay = targetDateInstance.getDay();
    const targetDate = targetDateInstance.getDate();
    const targetMonth = targetDateInstance.getMonth() + 1;
    const targetYear = targetDateInstance.getFullYear();

    const currentDateInstance = new Date();
    const currentDay = currentDateInstance.getDay();
    const currentDate = currentDateInstance.getDate();
    const currentMonth = currentDateInstance.getMonth() + 1;
    const currentYear = currentDateInstance.getFullYear();

    const daysAreSimilar = targetDay === currentDay;
    const targetIsWithinSameDay =
        daysAreSimilar &&
        targetDate === currentDate &&
        targetMonth === currentMonth &&
        targetYear === currentYear;

    if (targetIsWithinSameDay)
        return targetDateInstance.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    const yesterday = new Date(currentDateInstance);
    yesterday.setDate(currentDate - 1);

    if (targetDateInstance.getTime() > yesterday.getTime()) return "Yesterday";

    const sevenDaysAgo = new Date(currentDateInstance);
    sevenDaysAgo.setDate(currentDate - 7);

    if (!daysAreSimilar && targetDateInstance.getTime() > sevenDaysAgo.getTime())
        return daysOfTheWeek[targetDay];

    return `${targetYear}-${targetMonth}-${targetDate}`;
};