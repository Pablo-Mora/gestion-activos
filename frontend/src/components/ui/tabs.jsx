import * as React from "react"

function Tabs({ defaultValue, value, onValueChange, className, children, ...props }) {
  const [tabValue, setTabValue] = React.useState(value || defaultValue)
  
  React.useEffect(() => {
    if (value !== undefined) {
      setTabValue(value)
    }
  }, [value])
  
  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setTabValue(newValue)
    }
    onValueChange?.(newValue)
  }
  
  const registerTab = (value) => {
    return {
      value,
      selected: tabValue === value,
      onClick: () => handleValueChange(value)
    }
  }
  
  return (
    <div className={className || ""} {...props}>
      <TabsContext.Provider value={{ value: tabValue, registerTab }}>
        {children}
      </TabsContext.Provider>
    </div>
  )
}

function TabsList({ className, children, ...props }) {
  return (
    <div 
      role="tablist" 
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  )
}

function TabsTrigger({ className, value, disabled, children, ...props }) {
  const context = React.useContext(TabsContext)
  const registration = context?.registerTab(value)
  
  return (
    <button
      role="tab"
      aria-selected={registration?.selected}
      data-state={registration?.selected ? "active" : "inactive"}
      disabled={disabled}
      onClick={registration?.onClick}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsContent({ className, value, children, ...props }) {
  const context = React.useContext(TabsContext)
  const isSelected = context?.value === value
  
  if (!isSelected) return null
  
  return (
    <div
      role="tabpanel"
      aria-labelledby={`tab-${value}`}
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Context
const TabsContext = React.createContext(null)

export { Tabs, TabsList, TabsTrigger, TabsContent }