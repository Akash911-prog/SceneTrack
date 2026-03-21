$toolsDir = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
Install-ChocolateyZipPackage 'scenetrack' `
  'https://github.com/Akash911-prog/scenetrack/releases/download/v1.0.6/scenetrack-windows-x64.zip' `
  $toolsDir