$toolsDir = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
Install-ChocolateyZipPackage 'scenetrack' `
  'https://github.com/Akash911-prog/scenetrack/releases/download/v1.0.4/scenetrack-windows-x64.zip' `
  $toolsDir `
  '5037cb53f2d3a69d96679fcdf72bdd8edc99b184aafa489772f1658bf5887a53' `
  'sha256'