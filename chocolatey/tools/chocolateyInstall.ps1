$toolsDir = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
Install-ChocolateyZipPackage 'scenetrack' `
  'https://github.com/Akash911-prog/scenetrack/releases/download/v1.2.0/scenetrack-windows-x64.zip' `
  $toolsDir `
  -checksum 'a68ee3e26da022091d6ad3cff9f2ce3c58c22009fb9138a17d4f7a94f4d09ade' `
  -checksumType 'sha256'