type Tab<T extends string = string> = {
  label: string;
  value: T;
};

type TabListProps<T extends string = string> = {
  tabs: ReadonlyArray<Tab<T>>; // ReadonlyArray対応
  activeTab: T;
  onChange: (value: T) => void;
  className?: string;
};

export const TabList = <T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className = "",
}: TabListProps<T>) => {
  return (
    <div
      role="tablist"
      className={`text-muted-foreground grid h-10 w-full grid-cols-${tabs.length} items-center justify-center rounded-md bg-blue-50 p-1 ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.value}
          className={`ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
            activeTab === tab.value
              ? "bg-white font-bold text-blue-700"
              : "bg-blue-50 text-gray-500"
          } `}
          onClick={() => onChange(tab.value)}
          id={`edit-tab-${tab.value}`}
          aria-controls={`edit-panel-${tab.value}`}
          tabIndex={activeTab === tab.value ? 0 : -1}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
