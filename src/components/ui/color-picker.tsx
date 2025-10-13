import * as React from "react"
import { cn } from "@/lib/utils"

export interface ColorPickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="flex items-center gap-3">
          <input
            type="color"
            className={cn(
              "h-10 w-20 border border-gray-300 rounded cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent",
              className
            )}
            ref={ref}
            {...props}
          />
          <input
            type="text"
            value={props.value || '#000000'}
            onChange={(e) => {
              const newValue = e.target.value
              if (/^#[0-9A-Fa-f]{6}$/.test(newValue) || /^#[0-9A-Fa-f]{3}$/.test(newValue)) {
                props.onChange?.({
                  target: { ...e.target, value: newValue }
                } as React.ChangeEvent<HTMLInputElement>)
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
            placeholder="#000000"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>
      </div>
    )
  }
)
ColorPicker.displayName = "ColorPicker"

export { ColorPicker }