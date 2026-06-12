$root = Get-Location
$f = Get-ChildItem -Directory | Where-Object { $_.Name -like 'Atualiza*' } | Select-Object -First 1
if ($f -eq $null) { Write-Output 'ERROR: Pasta extraída não encontrada'; exit 1 }
Write-Output "FOUND: $($f.FullName)"
$siteDir = Join-Path $f.FullName 'site'
if (Test-Path $siteDir) {
    Write-Output "COPY FROM: $siteDir"
    Copy-Item -Path (Join-Path $siteDir '*') -Destination $root.Path -Recurse -Force
} else {
    Write-Output "COPY FROM: $($f.FullName)"
    Copy-Item -Path (Join-Path $f.FullName '*') -Destination $root.Path -Recurse -Force
}
Write-Output 'COPY_OK'
Write-Output 'REMOVING extras...'
Remove-Item -LiteralPath $f.FullName -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath 'Remova apos utilizar' -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath extract_zip.ps1 -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath git-ls-remote-result.txt -Force -ErrorAction SilentlyContinue
Write-Output 'REMOVE_OK'
Write-Output 'GIT: add/commit/push...'
git add .
$commit = git commit -m "Organizar site: mover arquivos do ZIP para raiz e remover extras" 2>&1
if ($LASTEXITCODE -ne 0) { Write-Output "GIT_COMMIT: no changes or commit failed" }
# push and show output
git push -u origin master --verbose
Write-Output 'DONE'
