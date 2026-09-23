"use client";

import { useState } from "react";

function normalizeHex(value) {
  if (!value) {
    return "";
  }

  return value.startsWith("#")
    ? value
    : `#${value}`;
}

export default function BrandingColorPicker({
  label,
  description,
  value,
  onChange,
}) {
  const [inputValue, setInputValue] = useState(value || "");

  function handleTextChange(event) {
    const nextValue = event.target.value;

    setInputValue(nextValue);

    if (/^#[0-9A-Fa-f]{6}$/.test(nextValue)) {
      onChange(nextValue);
    }
  }

  function handleColorChange(event) {
    const nextValue = event.target.value;

    setInputValue(nextValue);
    onChange(nextValue);
  }

  function handleBlur() {
    const normalized = normalizeHex(inputValue);

    if (/^#[0-9A-Fa-f]{6}$/.test(normalized)) {
      setInputValue(normalized);
      onChange(normalized);
      return;
    }

    setInputValue(value || "#000000");
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={
            /^#[0-9A-Fa-f]{6}$/.test(inputValue)
              ? inputValue
              : "#000000"
          }
          onChange={handleColorChange}
          className="
            h-10
            w-12
            cursor-pointer
            rounded-lg
            border
            border-[var(--color-border)]
            bg-transparent
            p-1
          "
          aria-label={`${label} color`}
        />

        <input
          type="text"
          value={inputValue}
          onChange={handleTextChange}
          onBlur={handleBlur}
          placeholder="#FFFFFF"
          maxLength={7}
          className="
            min-w-0
            flex-1
            rounded-lg
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-3
            py-2.5
            font-mono
            text-sm
            uppercase
            text-[var(--color-text)]
            outline-none
            transition
            focus:border-[var(--color-primary)]
          "
        />
      </div>

      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
        {description}
      </p>
    </div>
  );
}