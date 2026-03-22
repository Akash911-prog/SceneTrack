$toolsDir = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
Install-ChocolateyZipPackage 'scenetrack' `
  'https://github.com/Akash911-prog/scenetrack/releases/download/v1.3.0/scenetrack-windows-x64.zip' `
  $toolsDir `
  -checksum '5b4fb06fd24e9b0946af9a3fcf5eef742888c07a3300d742beaa1def8965a89e' `
  -checksumType 'sha256'