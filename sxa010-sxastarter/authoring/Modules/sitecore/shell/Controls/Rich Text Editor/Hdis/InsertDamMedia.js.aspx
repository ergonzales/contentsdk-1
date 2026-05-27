<%@ Page Language="C#" AutoEventWireup="true" Inherits="Hdis.Connectors.Dam.Bynder.SitecoreXp.sitecore.shell.Controls.Rich_Text_Editor.Hdis.ConfigurableFile" %>

var scEditor = null;

Telerik.Web.UI.Editor.CommandList["InsertHdisDamMedia"] = function (commandName, editor, args)
{
  var d = Telerik.Web.UI.Editor.CommandList._getLinkArgument(editor);
  Telerik.Web.UI.Editor.CommandList._getDialogArguments(d, "A", editor, "DocumentManager");

  scEditor = editor;

  editor.showExternalDialog(
    "/AssetSelector/AssetSelector.aspx?mode=SingleSelectFile&assetTypes=image,video&language=<% = Configuration.Remote.Bynder.AssetSelector.Language %>&portalUrl=<% = Configuration.PortalUrlEncoded %>&dam=<% = Configuration.Remote.Bynder.AssetSelector.Dam %>&apiKey=<% = Configuration.ApiKey %>&apiKeyValid=<% = Configuration.ApiKeyValid %>",
    null,
    1100,
    600,
    scInsertHdisDamMedia,
    null,
    "Insert DAM media",
    true,
    Telerik.Web.UI.WindowBehaviors.Close + Telerik.Web.UI.WindowBehaviors.Move,
    false,
    true
  );

  document.getElementsByClassName('rwCloseButton')[0].style.left = '0px';
  document.getElementsByClassName('rwIcon')[0].style.marginLeft = '5px';
};

function scInsertHdisDamMedia(sender, json)
{
  if (json && json.file && json.assets && json.assets.length > 0) {
    var asset = json.assets[0];
    var file = json.file;

    var wh = (file.width != 0 && file.height != 0)
        ? `width="${file.width}" height="${file.height}"`
        : '';

    if (asset.assetType.toLowerCase() == "image") {
      scEditor.pasteHtml(`<img alt="${asset.description}" src="${file.url}" ${wh} data-damid="${asset.id}">`, "DocumentManager");
    }
    else if (asset.assetType.toLowerCase() == "video") {
      scEditor.pasteHtml(`<video alt="${asset.description}" controls="controls" ${wh} data-damid="${asset.id}"><source src="${file.url}"></video>`, "DocumentManager");
    }
    else {
      alert(`Asset type ${asset.assetType} not supported.`);
    }
  }
}
