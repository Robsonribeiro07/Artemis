# ExpoWallpaper v7

Fluxo:

1. baixa o wallpaper e guarda no cache;
2. antes de abrir o editor, prepara uma versão compatível com a proporção/resolução atual da tela;
3. reaproveita a versão preparada do cache quando ela já existe;
4. abre o editor nativo do Android para o usuário ajustar o enquadramento;
5. o sistema aplica o wallpaper somente depois da confirmação do usuário.

O código não chama mais `WallpaperManager.setStream()` diretamente durante `open()`.
O editor nativo é aberto por `WallpaperManager.getCropAndSetWallpaperIntent(Uri)`.

O URI usado pelo editor é `content://` fornecido pelo `WallpaperFileProvider`.
