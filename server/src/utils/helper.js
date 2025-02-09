export const generateSlots = (workingHours, slotDuration) => {
  const slots = [];

  workingHours.forEach((workingHour) => {
    const { day, startTime, endTime } = workingHour;

    let currentTime = startTime;
    while (currentTime < endTime) {
      // Calculate end time for the current slot
      const [currentHour, currentMinute] = currentTime.split(":").map(Number);
      const endSlotTime = new Date(
        0,
        0,
        0,
        currentHour,
        currentMinute + slotDuration
      );
      const endSlotTimeString = endSlotTime.toTimeString().slice(0, 5);

      // Add the slot to the list
      slots.push({
        day,
        startTime: currentTime,
        endTime: endSlotTimeString,
        isBooked: false, // Initially, all slots are available
      });

      // Move to the next slot
      currentTime = endSlotTimeString;
    }
  });

  return slots;
};
