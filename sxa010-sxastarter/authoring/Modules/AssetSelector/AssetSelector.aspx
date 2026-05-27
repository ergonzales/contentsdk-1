<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AssetSelector.aspx.cs" Inherits="Hdis.Connectors.Dam.Bynder.SitecoreXp.AssetSelector.AssetSelector" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Select asset(s) from DAM</title>
</head>

<body>

    <% if (ApiKeyValid != "true")
       {
    %>
        <div style="color: #cc0000; background: #fbc200; font-weight: bold; padding: 5px 15px; font-family: Arial; font-size: 16px;">
            <p>
                API key for <strong>Bynder DAM Connector for Sitecore XP/XM</strong> is missing or has expired.<br />
                Contact your Human Digital representative or send an email to <a href="mailto:hello@humandigital.services">hello@humandigital.services</a>.
            </p>
        </div>
    <% }
       else
       {
    %>

    <script src="<% = ScriptUrl %>"></script>

    <script>
        window.onload = (event) => {
            Hdis.AssetSelector.open({
                language: "<%= Language %>",
                mode: "<%= Mode %>",
                portalUrl: "<%= PortalUrl %>",
                windowed: false,
                dam: "<%= Dam %>",
                assetTypes: <% = AssetTypesJsArray %>,
                preselectedAssets: <% = PreselectedAssetsJsArray %>,
                apiKey: "<% = ApiKey %>",
                enableUpload: <% = EnableUpload.ToLower() %>,
                searchTerm: "<% = DefaultSearchTerm %>",
                hideLimitedUsage: <% = HideLimitedUsage.ToLower() %>,
                remoteLoggingEnabled: <% = RemoteLoggingEnabled %>,
                storeMetaProperties: <% = StoreMetaProperties %>,
                callback: function (result)
                {
                    if (window.radWindow) {
                        window.radWindow.Close(result);
                    }
                    else if (window.frameElement && window.frameElement.radWindow) {
                        window.frameElement.radWindow.Close(result);
                    }
                    else {
                        var json = JSON.stringify(result);
                        window.returnValue = json;
                        window.top.returnValue = json;
                        window.top.dialogClose();
                    }
                }
            });
        }
    </script>

    <% } %>

</body>
</html>
