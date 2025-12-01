"use client";

import Preview from "@/features/createMediaAsset/Preview/ui/Preview";
import MediaAssetCreatePageHeader from "./_components/MediaAssetCreatePageHeader";
import { MediaAssetConfiguration } from "@/widgets/mediaAssetConfiguration/ui";

export default function CreateMediaAssetPage() {
  return (
    <div>
      <MediaAssetCreatePageHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-x-7">
        <MediaAssetConfiguration />

        <div>
          <Preview />
        </div>
      </div>
    </div>
  );
}
