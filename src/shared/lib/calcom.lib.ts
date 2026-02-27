// cal.com stub — enable with CALCOM_API_KEY
const CALCOM_API_KEY = process.env.CALCOM_API_KEY;
const CALCOM_EVENT_TYPE_ID = process.env.CALCOM_EVENT_TYPE_ID;

export const createBookingLink = async (name: string, email: string): Promise<string> => {
  if (!CALCOM_API_KEY || !CALCOM_EVENT_TYPE_ID) {
    return `https://cal.com/leadflow/demo?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
  }
  return `https://cal.com/book?eventTypeId=${CALCOM_EVENT_TYPE_ID}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&apiKey=${CALCOM_API_KEY}`;
};
