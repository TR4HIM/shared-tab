import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

export interface ListboxOption {
  id: string;
  label: string;
}

export interface ListboxProps {
  options: ListboxOption[];
  selectedIds?: string[];
  onChange: (selectedIds: string[]) => void;
  className?: string;
  disabled?: boolean;
  emptyMessage?: string;
  placeholder?: string;
  label?: string;
  openModal?: boolean;
}

export function ListboxInput({
  options,
  selectedIds,
  onChange,
  className,
  disabled = false,
  emptyMessage = 'No options available',
  placeholder = 'Select options...',
  label = 'Select options...',
  openModal = false,
}: Readonly<ListboxProps>) {
  const [isOpen, setIsOpen] = useState(openModal);
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(
    selectedIds ?? []
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync temp selections with actual selections when they change externally
  useEffect(() => {
    setLocalSelectedIds(selectedIds ?? []);
  }, [selectedIds]);

  // Check if all options are selected (based on temporary selections)
  const allSelected =
    options.length > 0 && localSelectedIds.length === options.length;
  const someSelected = localSelectedIds.length > 0 && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      setLocalSelectedIds([]);
    } else {
      setLocalSelectedIds(options.map((option) => option.id));
    }
  };

  const handleToggleOption = (id: string) => {
    if (localSelectedIds.includes(id)) {
      setLocalSelectedIds(
        localSelectedIds.filter((selectedId) => selectedId !== id)
      );
    } else {
      setLocalSelectedIds([...localSelectedIds, id]);
    }
  };

  const handleApply = () => {
    onChange(localSelectedIds);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalSelectedIds(selectedIds ?? []);
    setIsOpen(false);
  };

  return (
    <>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-black">
          {label} *
        </label>
      )}
      <div
        ref={containerRef}
        className={cn(
          'relative w-full rounded-lg border border-gray-700 bg-white shadow-sm transition-all focus-within:ring-1 focus-within:ring-primary',
          disabled && 'opacity-60',
          className
        )}
      >
        {/* Select trigger button */}
        <button
          className={cn(
            'flex min-h-10 w-full cursor-pointer items-center justify-between px-3 py-2 text-sm'
          )}
          onClick={(e) => {
            e.preventDefault();
            if (!disabled) {
              setIsOpen(!isOpen);
            }
          }}
          type="button"
        >
          <div className="truncate">{placeholder}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              'h-4 w-4 text-gray-500 transition-transform duration-200',
              isOpen && 'rotate-180 transform'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown content */}
        {isOpen && (
          <div className="absolute left-0 right-0 z-20 mt-1 origin-top-right rounded-lg border border-gray-700 bg-white shadow-lg animate-in fade-in-20">
            {/* Select All / None header */}
            {options.length > 0 && (
              <div className="flex items-center border-b border-gray-200 p-3.5">
                <label className="flex cursor-pointer select-none items-center space-x-2">
                  <div className="relative flex h-5 w-5 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = someSelected;
                        }
                      }}
                      onChange={handleSelectAll}
                      disabled={disabled}
                      data-test-id="select-all-checkbox"
                      className="peer h-4 w-4 cursor-pointer rounded border border-gray-400 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/25 focus:ring-offset-0"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </span>
                </label>
              </div>
            )}

            {/* Options list */}
            <div className="scrollbar-thin scrollbar-thumb-gray-300 max-h-60 overflow-auto overscroll-contain p-1">
              {options.length > 0 ? (
                options.map((option) => (
                  <div
                    key={option.id}
                    className="my-0.5 rounded hover:bg-gray-100"
                  >
                    <label className="flex w-full cursor-pointer select-none items-center space-x-2 px-2.5 py-2">
                      <div className="relative flex h-5 w-5 items-center justify-center">
                        <input
                          data-test-id={`select-option-${option.id}`}
                          type="checkbox"
                          checked={localSelectedIds.includes(option.id)}
                          onChange={() => handleToggleOption(option.id)}
                          disabled={disabled}
                          className="peer h-4 w-4 cursor-pointer rounded border border-gray-400 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/25 focus:ring-offset-0"
                        />
                      </div>
                      <span className="text-sm">{option.label}</span>
                    </label>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-400">
                  {emptyMessage}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-200 p-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="text-xs font-medium"
                data-test-id="cancel-button"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleApply}
                className="text-xs font-medium"
                data-test-id="apply-button"
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
