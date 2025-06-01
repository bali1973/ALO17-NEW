$token = "WdtSYtBMkHbAhuADA2a70rL6"
$projectId = "balis-projects-49521e17"
$teamId = "balis-projects-49521e17"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$envVars = @(
    @{
        key = "DATABASE_URL"
        value = "postgresql://postgres:postgres@localhost:5432/alo17"
        type = "encrypted"
        target = @("production", "preview", "development")
    },
    @{
        key = "NEXTAUTH_SECRET"
        value = "alo17_secret_key_2024"
        type = "encrypted"
        target = @("production", "preview", "development")
    },
    @{
        key = "NEXTAUTH_URL"
        value = "https://balis-projects-49521e17.vercel.app"
        type = "encrypted"
        target = @("production", "preview", "development")
    },
    @{
        key = "GOOGLE_CLIENT_ID"
        value = "your_google_client_id"
        type = "encrypted"
        target = @("production", "preview", "development")
    },
    @{
        key = "GOOGLE_CLIENT_SECRET"
        value = "your_google_client_secret"
        type = "encrypted"
        target = @("production", "preview", "development")
    },
    @{
        key = "APPLE_ID"
        value = "your_apple_id"
        type = "encrypted"
        target = @("production", "preview", "development")
    },
    @{
        key = "APPLE_SECRET"
        value = "your_apple_secret"
        type = "encrypted"
        target = @("production", "preview", "development")
    }
)

foreach ($envVar in $envVars) {
    try {
        $body = $envVar | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "https://api.vercel.com/v2/projects/$projectId/env" -Method Post -Headers $headers -Body $body
        Write-Host "Added $($envVar.key)"
    } catch {
        Write-Host "Error adding $($envVar.key): $_"
    }
} 