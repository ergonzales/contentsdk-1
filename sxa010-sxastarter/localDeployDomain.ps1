<# Description: This script automates the deployment process for a Vercel project and assigns a custom domain to the deployment.
 Usage: Run the script with the required parameters to deploy the project and assign a custom domain.
     .EXAMPLE
         # Example for production deployment
         From the root of the project directory, run the following command: (staged deployment for DEV environment & Production for other environments)
         pwsh ./localDeployDomain.ps1 -alias "dev.chartwell.com" -projectName "cw-dev" -deploymentType "prod"
         # Example for non-production deployment
         From the root of the project directory, run the following command: (preview deployment)
         pwsh ./localDeployDomain.ps1 -alias "dev.chartwell.com" -projectName "cw-dev" -deploymentType ""
        .PARAMETER alias
            The custom domain alias to assign to the deployment.
        .PARAMETER projectName
            The name of the Vercel project to deploy.
        .PARAMETER deploymentType
            The type of deployment to perform. Possible values are "prod" for production deployment and "" for preview deployment.

This script can be run from any shell that supports PowerShell scripts. (bash, cmd, tmux etc. on WSL, macOS, or Linux)
#>
param (
    [string]$alias,
    [string]$projectName,
    [string]$deploymentType = "",
    [string]$token = "KArMQ0YHui05PsNECgS9fU1m",
    [string]$scope = "chartwell-rr"
)

try {
    function Watch-Deployment {
        $progress = 0
        $progressIncrement = 1
        $deployCommand = "vercel deploy --prod --archive=tgz --force --token '$token' --scope $scope > deployment-url.txt 2> error.txt"

        if ($deploymentType -eq "preview") {
            Write-Host "Deploying PREVIEW build" -ForegroundColor Green
            $deployCommand = "vercel deploy --prebuilt --archive=tgz --token '$token' --scope $scope > deployment-url.txt 2> error.txt"
        }
        else {
            Write-Host "Deploying PROD build" -ForegroundColor Green
        }

        $deployJob = Start-Job -ScriptBlock {
            Invoke-Expression $using:deployCommand
        }

        while ($deployJob.State -eq 'Running') {
            Start-Sleep -Seconds 2.75
            $progress += $progressIncrement
            Write-Progress -Activity "Deployment in progress" -Status "$progress% complete" -PercentComplete $progress
            if ($progress -ge 100) {
                $progress = 0
                Write-Host "Deployment is taking longer than expected. Please wait..." -ForegroundColor Yellow
            }
        }

        Receive-Job -Job $deployJob
        Remove-Job -Job $deployJob
        Write-Progress -Completed -Activity "Deployment completed" -Status "100% complete" -PercentComplete 100

        $deploymentUrl = if (Test-Path "deployment-url.txt") { Get-Content -Path "deployment-url.txt" } else { "" }
        $errorMessage = if (Test-Path "error.txt") { Get-Content -Path "error.txt" } else { "" }

        return $deploymentUrl, $errorMessage
    }
}
catch {
    Write-Host "An error occurred in Watch-Deployment: $_" -ForegroundColor Red
    exit 1
}

function Deploy {
    $startTime = Get-Date

    # Helper function to execute a command with error handling
    function Invoke-Command {
        param (
            [string]$command,
            [string]$errorMessage
        )
        try {
            Invoke-Expression $command
        }
        catch {
            Write-Host "${errorMessage}: $_" -ForegroundColor Red
            exit 1
        }
    }

    # Link Vercel project
    Write-Host "======================" -ForegroundColor Yellow
    Write-Host "Linking Vercel project" -ForegroundColor Green
    Write-Host "======================" -ForegroundColor Yellow
    Invoke-Command -command "vercel link --token $token --scope $scope --yes --project $projectName" -errorMessage "Failed to link Vercel project"

    # Get the current git branch name
    if ($env:BUILD_SOURCEBRANCHNAME) {
        $branchName = $env:BUILD_SOURCEBRANCHNAME
    }
    else {
        $branchName = git rev-parse --abbrev-ref HEAD
    }
    Write-Host "============================" -ForegroundColor Yellow
    Write-Host "Current Git branch: $branchName" -ForegroundColor Cyan
    Write-Host "============================" -ForegroundColor Yellow

    # Pull latest project config
    Write-Host "=============================" -ForegroundColor Yellow
    Write-Host "Pulling latest project config" -ForegroundColor Green
    Write-Host "=============================" -ForegroundColor Yellow
    Invoke-Command -command "vercel pull --yes --token $token --scope $scope" -errorMessage "Failed to pull latest project config"

    # Create build artifacts if deploying to production
    if ($deploymentType -eq "preview") {
        Write-Host "===================================" -ForegroundColor Yellow
        Write-Host "Creating PREVIEW build artifacts" -ForegroundColor Green
        Write-Host "===================================" -ForegroundColor Yellow
        Invoke-Command -command "vercel build --token $token --scope $scope" -errorMessage "Failed to create production build artifacts"
    }
    # else {
    #     Write-Host "================================" -ForegroundColor Yellow
    #     Write-Host "Creating PROD build artifacts" -ForegroundColor Green
    #     Write-Host "================================" -ForegroundColor Yellow
    #     Invoke-Command -command "vercel build --prod --token $token --scope $scope" -errorMessage "Failed to create preview build artifacts"
    # }

    # Call Watch-Deployment function to handle the deployment process
    Write-Host "===================" -ForegroundColor Yellow
    Write-Host "Starting Deployment" -ForegroundColor Green
    Write-Host "===================" -ForegroundColor Yellow
    $deploymentUrl, $errorMessage = Watch-Deployment

    # Check the exit code and handle the deployment URL
    if ($LASTEXITCODE -eq 0) {
        Write-Host "======================================================" -ForegroundColor Yellow
        Write-Host "Deployment URL: $deploymentUrl" -ForegroundColor Cyan
        Write-Host "======================================================" -ForegroundColor Yellow
        #Invoke-Command -command "vercel alias $deploymentUrl $alias --token $token --scope $scope" -errorMessage "Failed to create alias"
    }
    else {
        Write-Host "====================" -ForegroundColor Yellow
        Write-Host "There was an error: $errorMessage" -ForegroundColor Red
        Write-Host "====================" -ForegroundColor Yellow
    }

    # Calculate and display the duration of the deployment process
    $endTime = Get-Date
    $duration = $endTime - $startTime
    Write-Host "====================" -ForegroundColor Yellow
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build / Deployment failed due to errors." -ForegroundColor Red
    }
    else {
        Write-Host "Build / Deployment and domain assignment completed in $([math]::Round($duration.TotalMinutes, 0)) minutes and $($duration.Seconds) seconds." -ForegroundColor Green
    }
    Write-Host "====================" -ForegroundColor Yellow
}

Deploy

# Clean up deployment artifacts
if (Test-Path "deployment-url.txt") { Remove-Item "deployment-url.txt" } 
if (Test-Path "error.txt") { Remove-Item "error.txt" }
