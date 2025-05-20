import * as React from "react"
import { Button } from "./button"

const Dialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = React.useState(open || false)
  
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])
  
  const handleOpenChange = (newOpen) => {
    if (open === undefined) {
      setIsOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }
  
  if (!isOpen) return null
  
  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {children}
      </div>
    </DialogContext.Provider>
  )
}

const DialogTrigger = ({ children, asChild, ...props }) => {
  const context = React.useContext(DialogContext)
  
  const handleClick = () => {
    context?.onOpenChange(true)
  }
  
  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      onClick: handleClick
    })
  }
  
  return <Button onClick={handleClick} {...props}>{children}</Button>
}

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const context = React.useContext(DialogContext)
  
  return (
    <div
      ref={ref}
      className={`relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full ${className || ""}`}
      {...props}
    >
      {children}
      <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none" />
    </div>
  )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, children, ...props }) => {
  return (
    <div className={`flex flex-col space-y-2 text-center sm:text-left ${className || ""}`} {...props}>
      {children}
    </div>
  )
}

const DialogTitle = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={`text-lg font-semibold leading-none tracking-tight ${className || ""}`}
      {...props}
    >
      {children}
    </h2>
  )
})
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm text-muted-foreground ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  )
})
DialogDescription.displayName = "DialogDescription"

const DialogFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  )
}

const DialogClose = React.forwardRef(({ className, children, ...props }, ref) => {
  const context = React.useContext(DialogContext)
  
  const handleClick = () => {
    context?.onOpenChange(false)
  }
  
  return (
    <button
      ref={ref}
      className={className || ""}
      onClick={handleClick}
      {...props}
    >
      {children || (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
        </svg>
      )}
    </button>
  )
})
DialogClose.displayName = "DialogClose"

// Context
const DialogContext = React.createContext(null)

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose
}