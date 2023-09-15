import { createContext, FC, ReactNode, useState } from "react";

const SidebarContext = createContext({
  isSidebarOpen: true,
  toggleSidebarOpen: () => {},
});

const SidebarContextProvider: FC<{ children: ReactNode }> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebarOpen = () => setIsSidebarOpen((isOpen) => !isOpen);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebarOpen }}>
      {props.children}
    </SidebarContext.Provider>
  );
};

export { SidebarContext, SidebarContextProvider };
