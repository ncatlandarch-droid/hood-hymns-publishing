# Download Printful product mockup images for Hood Hymns Publishing
$apiKey = $env:PRINTFUL_API_KEY
$storeId = "18232014"
$outDir = "public\merch-real"

$products = @(
    @{ id = "436109640"; filename = "merch-real-tshirt.png"; name = "Studio Signature Tee" },
    @{ id = "436109641"; filename = "merch-real-character.png"; name = "Harmonies Character Tee" },
    @{ id = "436109642"; filename = "merch-real-b2b-tee.png"; name = "B2B Signature Tee" },
    @{ id = "436109646"; filename = "merch-real-detroit.png"; name = "Detroit Choir Tee" },
    @{ id = "436109647"; filename = "merch-real-hoodie.png"; name = "Hood Hymns Studio Hoodie" },
    @{ id = "436109649"; filename = "merch-real-b2b-hoodie.png"; name = "B2B Logo Hoodie" },
    @{ id = "436109651"; filename = "merch-real-b2b-crewneck.png"; name = "B2B Classic Crewneck" },
    @{ id = "436109837"; filename = "merch-real-snapback.png"; name = "Studio Snapback" },
    @{ id = "436109838"; filename = "merch-real-b2b-cap.png"; name = "B2B Embroidered Cap" }
)

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "X-PF-Store-Id" = $storeId
}

$results = @()

foreach ($p in $products) {
    $url = "https://api.printful.com/store/products/$($p.id)"
    Write-Host "`n--- Fetching: $($p.name) (ID: $($p.id)) ---"
    
    try {
        $resp = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
        
        # Look through sync_variants for preview files
        $previewUrl = $null
        
        foreach ($variant in $resp.result.sync_variants) {
            foreach ($file in $variant.files) {
                if ($file.type -eq "preview") {
                    $previewUrl = $file.preview_url
                    if (-not $previewUrl) {
                        $previewUrl = $file.thumbnail_url
                    }
                    break
                }
            }
            if ($previewUrl) { break }
        }
        
        if (-not $previewUrl) {
            # Fallback: try any file with a preview_url
            foreach ($variant in $resp.result.sync_variants) {
                foreach ($file in $variant.files) {
                    if ($file.preview_url) {
                        $previewUrl = $file.preview_url
                        break
                    }
                }
                if ($previewUrl) { break }
            }
        }
        
        if ($previewUrl) {
            $outPath = Join-Path $outDir $p.filename
            Write-Host "  Downloading preview: $previewUrl"
            Invoke-WebRequest -Uri $previewUrl -OutFile $outPath
            $fileInfo = Get-Item $outPath
            $sizeKB = [math]::Round($fileInfo.Length / 1024, 1)
            Write-Host "  Saved: $outPath ($sizeKB KB)"
            $results += @{ name = $p.name; file = $p.filename; size = "$sizeKB KB"; status = "OK" }
        } else {
            Write-Host "  WARNING: No preview URL found!"
            # Dump file types for debugging
            foreach ($variant in $resp.result.sync_variants) {
                Write-Host "  Variant $($variant.id) files:"
                foreach ($file in $variant.files) {
                    Write-Host "    type=$($file.type) preview_url=$($file.preview_url) thumbnail=$($file.thumbnail_url)"
                }
            }
            $results += @{ name = $p.name; file = $p.filename; size = "N/A"; status = "NO PREVIEW" }
        }
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)"
        $results += @{ name = $p.name; file = $p.filename; size = "N/A"; status = "ERROR: $($_.Exception.Message)" }
    }
    
    # Small delay to avoid rate limiting
    Start-Sleep -Milliseconds 500
}

Write-Host "`n`n=== DOWNLOAD SUMMARY ==="
foreach ($r in $results) {
    Write-Host "$($r.status) | $($r.name) | $($r.file) | $($r.size)"
}
Write-Host "`n=== DONE ==="
