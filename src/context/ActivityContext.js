import { createContext, useState } from "react";
import { initialActivities } from "../data/mockData";

export const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [allActivities, setAllActivities] = useState(initialActivities);

  return (
    <ActivityContext.Provider value={{ allActivities, setAllActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};
