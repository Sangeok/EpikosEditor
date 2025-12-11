export interface TextEditRightSideProps {
  selectedTrackId: string | null;
}

export interface DebouncedTextEditState {
  localText: string;
  localFontSize: string;
}

export interface DebouncedTextEditActions {
  handleTextChange: (value: string) => void;
  handleFontSizeChange: (value: string) => void;
}

export interface TextInputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export interface NumericInputFieldProps extends TextInputFieldProps {
  onNumericChange: (value: number) => void;
}

export type FontStyleValue = "normal" | "italic";
