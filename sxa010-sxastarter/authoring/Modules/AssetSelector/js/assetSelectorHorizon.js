document.addEventListener("DOMContentLoaded", () => {

    var imageSingleAssets = document.querySelectorAll('code[scfieldtype="hdisimagesingleasset"]');
    var allLinksHdisSingleItem = document.querySelectorAll('code[scfieldtype="hdisgenerallink"]');
    var allRichTextElements = document.querySelectorAll('span[scfieldtype="rich text"]');
    var allHdisSingleFiles = document.querySelectorAll('code[scfieldtype="hdisimagesinglefile"]');
    var allMultiAssets = document.querySelectorAll('code[scfieldtype="hdisimagemultiasset"]');
    var allHdisFile = document.querySelectorAll('span[scfieldtype="hdisfile"]');
    var allVideos = document.querySelectorAll('code[scfieldtype="hdisvideosinglefile"]');
    var allLinksWithSearch = document.querySelectorAll('code[scfieldtype="hdisgenerallinksearch"]')

    //Process Image Single Asset
    for (var i = 0; i < imageSingleAssets.length; i++) {

        var parentElement = imageSingleAssets[i].parentElement
        var buttonDoesNotExist = imageSingleAssets[i].querySelector('button[class="md primary asset-selector"') == null;
        var fieldType = "hdisimagesingleasset";
        var codeJObject = JSON.parse(imageSingleAssets[i].innerHTML);
        var inputHiddenField = imageSingleAssets[i].previousElementSibling;
        var image = imageSingleAssets[i].nextElementSibling;

        if (image.innerText != inputHiddenField.value) {
            //this should overide in Image [No Text Field Value] and to prevent autosave
            image.innerText = inputHiddenField.value;
        }

        var sitecoreContextItemId = codeJObject['custom']["contextItem"]["id"];
        var identifier = 'AssetButton-hdisimagesingleasset' + i.toString();

        var button = createButton(identifier, sitecoreContextItemId);

        var totalNumberOfElements = parentElement.children.length;
        var lastElement = parentElement.children[totalNumberOfElements - 1];//this should be closing code
        lastElement.insertAdjacentElement('afterend', button);
    }

    //Process Links
    for (var k = 0; k < allLinksHdisSingleItem.length; k++) {

        var parentElement = allLinksHdisSingleItem[k].parentElement
        var buttonDoesNotExist = parentElement.querySelector('button[class="md primary asset-selector"') == null;
        if (buttonDoesNotExist) {
            var fieldType = "hdisgenerallink";
            var codeJObject = JSON.parse(allLinksHdisSingleItem[k].innerHTML);
            var inputHiddenField = allLinksHdisSingleItem[k].previousElementSibling;
            var link = allLinksHdisSingleItem[k].nextElementSibling;


            var sitecoreContextItemId = codeJObject['custom']["contextItem"]["id"];
            var identifier = 'AssetButton-hdisgenerallink' + k.toString();

            var button = createButton(identifier, sitecoreContextItemId);

            var totalNumberOfElements = parentElement.children.length;
            var lastElement = parentElement.children[totalNumberOfElements - 1];//this should be closing code
            lastElement.insertAdjacentElement('afterend', button);
        }
    }

    //Process RTE
    for (var j = 0; j < allRichTextElements.length; j++) {

        var parentElement = allRichTextElements[j].parentElement;
        var buttonDoesNotExist = parentElement.querySelector('button[class="md primary asset-selector"') == null;
        if (buttonDoesNotExist) {
            var scChromeData = allRichTextElements[j].previousElementSibling;

            if (scChromeData == null) {
                continue;
            }

            var spanJObject = JSON.parse(scChromeData.innerHTML);
            var sitecoreContextItemId = spanJObject['custom']["contextItem"]["id"];
            var identifier = 'AssetButton-rich-text' + j.toString();

            var button = createButton(identifier, sitecoreContextItemId);

            var totalNumberOfElements = parentElement.children.length;
            var lastElement = parentElement.children[totalNumberOfElements - 1];//this should be closing code
            lastElement.insertAdjacentElement('afterend', button);
        }
    }

    //Process Single Files
    for (var l = 0; l < allHdisSingleFiles.length; l++) {

        var parentElement = allHdisSingleFiles[l].parentElement
        var buttonDoesNotExist = allHdisSingleFiles[l].querySelector('button[class="md primary asset-selector"') == null;
        var codeJObject = JSON.parse(allHdisSingleFiles[l].innerHTML);
        var image = allHdisSingleFiles[l].nextElementSibling;


        var sitecoreContextItemId = codeJObject['custom']["contextItem"]["id"];
        var identifier = 'AssetButton-hdisimagesinglefile' + l.toString();

        var button = createButton(identifier, sitecoreContextItemId);

        var totalNumberOfElements = parentElement.children.length;
        var lastElement = parentElement.children[totalNumberOfElements - 1];//this should be closing code
        lastElement.insertAdjacentElement('afterend', button);
    }

    //Process Multi Assets
    for (var m = 0; m < allMultiAssets.length; m++) {

        var parentElement = allMultiAssets[m].parentElement
        var codeJObject = JSON.parse(allMultiAssets[m].innerHTML);

        var sitecoreContextItemId = codeJObject['custom']["contextItem"]["id"];
        var identifier = 'AssetButton-hdisimagemultiasset' + m.toString();

        var button = createButton(identifier, sitecoreContextItemId);

        var totalNumberOfElements = parentElement.children.length;
        var lastElement = parentElement.children[totalNumberOfElements - 1];//this should be closing code
        lastElement.insertAdjacentElement('afterend', button);
    }

    //Process Files
    for (var n = 0; n < allHdisFile.length; n++) {

        var parentElement = allHdisFile[n].parentElement;
        var buttonDoesNotExist = parentElement.querySelector('button[class="md primary asset-selector"') == null;
        if (buttonDoesNotExist) {
            var scChromeData = allHdisFile[n].previousElementSibling;

            if (scChromeData == null) {
                continue;
            }

            var spanJObject = JSON.parse(scChromeData.innerHTML);
            var sitecoreContextItemId = spanJObject['custom']["contextItem"]["id"];
            var identifier = 'AssetButton-hdisfile' + n.toString();

            var button = createButton(identifier, sitecoreContextItemId);

            var totalNumberOfElements = parentElement.children.length;
            var lastElement = parentElement.children[totalNumberOfElements - 1];//this should be closing code
            lastElement.insertAdjacentElement('afterend', button);
        }
    }

    //Process Videos
    for (var o = 0; o < allVideos.length; o++) {

        var parentElement = allVideos[o].parentElement
        var codeJObject = JSON.parse(allVideos[o].innerHTML);

        var sitecoreContextItemId = codeJObject['custom']["contextItem"]["id"];
        var identifier = 'AssetButton-hdisvideosinglefile' + o.toString();

        var button = createButton(identifier, sitecoreContextItemId);

        var totalNumberOfElements = parentElement.children.length;
        var lastElement = parentElement.children[totalNumberOfElements - 1];//this should be closing code
        lastElement.insertAdjacentElement('afterend', button);
    }

    //Process All links with search
    for (var p = 0; p < allLinksWithSearch.length; p++) {

        var parentElement = allLinksWithSearch[p].parentElement
        var buttonDoesNotExist = parentElement.querySelector('button[class="md primary asset-selector"') == null;
        if (buttonDoesNotExist) {

            var codeJObject = JSON.parse(allLinksWithSearch[p].innerHTML);
            var sitecoreContextItemId = codeJObject['custom']["contextItem"]["id"];
            var identifier = 'AssetButton-hdisgenerallinksearch' + p.toString();

            var button = createButton(identifier, sitecoreContextItemId);

            var totalNumberOfElements = parentElement.children.length;
            var lastElement = parentElement.children[totalNumberOfElements - 1];//this should be closing code
            lastElement.insertAdjacentElement('afterend', button);
        }
    }
});

function createButton(identifier, sitecoreContextItemId) {
    var button = document.createElement('button');
    button.className = 'md primary asset-selector-icon';
    button.id = identifier;
    button.title = 'Edit DAM fields'
    button.setAttribute("data-sitecore-item-id", sitecoreContextItemId);
    button.onclick = function (event) {
        openPopup(event);
    };

    return button;
}

var IsCancelOperation = false;

function getQueryParams(url) {
    var queryParams = {};
    var queryString = url.split('?')[1];
    if (queryString) {
        var pairs = queryString.split('&');
        pairs.forEach(function (pair) {
            var keyValue = pair.split('=');
            queryParams[keyValue[0]] = decodeURIComponent(keyValue[1] || '');
        });
    }
    return queryParams;
}

function onCloseFunction(hdl) {
    if (IsCancelOperation == false) {
        location.reload();
    }

    IsCancelOperation = false;
    //api call to remove hdl from session ?
}

const openPopup = (event) => {
    const url = window.location.protocol + "//" + window.location.hostname;
    var sitecoreContextItemId = event.srcElement.attributes['data-sitecore-item-id'].value;
    fetch(`/api/sitecore/GenerateHandleForUrlHandle/Index?sitecoreItemId=${sitecoreContextItemId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch parameters for DAM');
            }

            return response.json();
        })
        .then(urlParameters => {
          const fullUrl = url + urlParameters;
          var left = (screen.width - 1350) / 2;
          var top = (screen.height - 650) / 4

          // Define the features of the popup window
          const features =
            'width=1350,height=650,' + 'left=' + left + ',top=' + top + ',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes';
          var popup = window.open(fullUrl, '_blank', features);
          var queryParams = getQueryParams(fullUrl);


            popup.addEventListener('beforeunload', function () {
                onCloseFunction(queryParams["hdl"])
            });

            window.addEventListener("message", function (event) {
                if (event.source === popup) {
                    var messageFromPopup = event.data;
                    if (messageFromPopup == 'cancel') {
                        console.log('message action received ..');
                        IsCancelOperation = true;
                    }
                }
            })

        })
        .catch(error => {
            console.log(error);
        });
};
