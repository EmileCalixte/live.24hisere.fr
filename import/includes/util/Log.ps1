function Log($message, $backgroundColor, $foregroundColor) {
    $time = Get-Date -Format "HH:mm:ss"

    if ($null -eq $backgroundColor -and $null -eq $foregroundColor) {
        Write-Host "[$time] $message"
        return
    }

    if ($null -eq $backgroundColor) {
        Write-Host "[$time] $message" -ForegroundColor $foregroundColor
        return
    }

    if ($null -eq $foregroundColor) {
        Write-Host "[$time] $message" -BackgroundColor $backgroundColor
        return
    }

    Write-Host "[$time] $message" -BackgroundColor $backgroundColor -ForegroundColor $foregroundColor
}
