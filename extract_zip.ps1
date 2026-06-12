$pwd = Get-Location
Write-Output "PWD: $pwd"
Write-Output "ZIP FILES:"
Get-ChildItem -Filter *.zip -File -Force | ForEach-Object { Write-Output $_.Name }
$z = Get-ChildItem -Filter *.zip -File -Force | Select-Object -First 1
if ($z -ne $null) {
    Expand-Archive -LiteralPath $z.FullName -DestinationPath $pwd.Path -Force
    Write-Output "EXTRACTED: $($z.Name)"
} else {
    Write-Output "NO_ZIP_FOUND"
}
