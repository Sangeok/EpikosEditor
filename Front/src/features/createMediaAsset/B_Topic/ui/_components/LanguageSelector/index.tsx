import useMediaAssetStore from "@/entities/mediaAsset/useMediaAssetStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/atoms/Select/select";

export function LanguageSelector() {
  const language = useMediaAssetStore((state) => state.initialCreateVideoData.language);

  const setLanguage = useMediaAssetStore((state) => state.setCreateVideoDataByField);

  return (
    <div className="flex flex-col gap-2">
      <h2>Select the Language</h2>
      <Select value={language} onValueChange={(value) => setLanguage("language", value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent className="bg-white text-black">
          <SelectGroup>
            <SelectLabel>Language</SelectLabel>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Korean">Korean</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
