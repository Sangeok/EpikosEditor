"use client";

import Input from "@/shared/ui/atoms/Input/ui/Input";
import { TextInputFieldProps } from "@/features/editFeatures/ui/editor-rightSidebar/ui/_component/TextEditRightSide/model/types";

export default function TextInputField({ label, placeholder, value, onChange }: TextInputFieldProps) {
  return (
    <>
      <h1>{label}</h1>
      <Input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </>
  );
}
