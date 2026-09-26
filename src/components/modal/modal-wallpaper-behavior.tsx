import { useWallpaperStore } from "@/store/wallpapers/use-wallpapers-store";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "../ui/actionsheet";
import { LoadingProgressDowload } from "./dowload/loading-progress-dowload";
import { PreviewApplyBackground } from "./preview/preview-apply-wallpaper";

export function ModalWappaperBehavior() {
  const { stateModalWallpaper, setStateModal, behavior } = useWallpaperStore();

  return (
    <Actionsheet
      isOpen={stateModalWallpaper}
      onClose={() => setStateModal(false)}
    >
      <ActionsheetBackdrop />

      <ActionsheetContent className="h-[50%]">
        {behavior == "apply" ? (
          <PreviewApplyBackground />
        ) : (
          <LoadingProgressDowload />
        )}
      </ActionsheetContent>
    </Actionsheet>
  );
}
