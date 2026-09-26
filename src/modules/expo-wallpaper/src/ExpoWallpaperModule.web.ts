import { NativeModule, registerWebModule } from "expo";

class ExpoWallpaperModule extends NativeModule<{}> {}

export default registerWebModule(ExpoWallpaperModule, "ExpoWallpaper");
