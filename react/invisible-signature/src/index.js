import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
import { PdfViewerComponent, FormDesigner, FormFields, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Inject } from '@syncfusion/ej2-react-pdfviewer';
import { MessageComponent } from '@syncfusion/ej2-react-notifications';
import { ToolbarComponent, ItemsDirective, ItemDirective } from '@syncfusion/ej2-react-navigations';

import { useState } from 'react';

function InvisibleDigitalSignature() {
    const [successVisible, setVisible] = useState(false);
    const [errorVisible, seterrorVisible] = useState(false);
    const [warningVisible, setwarningVisible] = useState(false);
    let viewer;
    let toolbar;
    let fileName = '';
    //Specifies the visibility of the complete signing.
    let buttonVisiblity = true;
    //Specifies the visibility of the download icon
    let downloadVisiblity = true;
    let msgWarning = "The document has been digitally signed and at least one signature has problem ";
    let msgError = "The document has been digitally signed, but it has been modified since it was signed and at least one signature is invalid";
    let msgSuccess = "The document has been digitally signed and all the signatures are valid";
    let documentData;
    // Specifies whether the document has a digital signature or not.
    let hasDigitalSignature = false;
    return (<div>
        <div className='control-section'>
            <div>
                <div className='e-pdf-toolbar'>
                    <ToolbarComponent ref={(scope) => { toolbar = scope; }} clicked={clickHandler.bind(this)}>
                        <ItemsDirective>
                                <ItemDirective prefixIcon='e-pv-open-document-icon' id='file_Open' tooltipText='Open' cssClass='e-pv-button-container'></ItemDirective>
                                <ItemDirective text="Complete Signing" id='pdfviewer_sign' tooltipText='Finish Signing' disabled={buttonVisiblity} align="Right"></ItemDirective>
                                <ItemDirective prefixIcon='e-pv-download-document-icon' tooltipText="Download" id='download' disabled={downloadVisiblity} align="Right" cssClass='e-pv-download-document-container'></ItemDirective>
                        </ItemsDirective>
                    </ToolbarComponent>
                </div>
               <div>
                   <MessageComponent id="msg_success" content={msgSuccess} visible={successVisible} severity="Success"></MessageComponent>
                   <MessageComponent id="msg_warning" content={msgWarning} visible={warningVisible} severity="Warning"></MessageComponent>
                   <MessageComponent id="msg_error" content={msgError} visible={errorVisible} severity="Error"></MessageComponent>
                </div>
                {/* Render the PDF Viewer */}
                <PdfViewerComponent id="container" ref={(scope) => { viewer = scope; }} enableToolbar={false} enableNavigationToolbar={false} documentLoad={documentLoaded} serviceUrl='https://ej2services.syncfusion.com/react/development/api/pdfviewer' documentPath="InvisibleDigitalSignature.pdf" addSignature={addSignature} style={{ 'display': 'block', 'height': '640px' }}>
                    <Inject services={[Magnification, FormFields, FormDesigner, Navigation, LinkAnnotation, BookmarkView,
            ThumbnailView, Print, TextSelection, TextSearch]}/>
                </PdfViewerComponent>
                <input type="file" id="fileUpload" accept=".pdf" onChange={readFile.bind(this)} style={{ 'display': 'block', 'visibility': 'hidden', 'width': '0', 'height': '0' }}/>
            </div>
        </div>
        

    </div>);
    //This method will get invoked while clicking the toolbar items.
    function clickHandler(args) {
        switch (args.item.id) {
            case 'file_Open':
                document.getElementById('fileUpload').click();
                break;
            case 'pdfviewer_sign':
                viewer.serverActionSettings.download = 'AddSignature';
                let data;
                let base64data;
                viewer.saveAsBlob().then((value) => {
                    data = value;
                    var reader = new FileReader();
                    reader.readAsDataURL(data);
                    reader.onload = () => {
                        base64data = reader.result;
                        documentData = base64data;
                        viewer.load(base64data, null);
                        downloadVisiblity = false;
                        buttonVisiblity = true;
                        toolbar.items[1].disabled = true;
                        toolbar.items[2].disabled = false;
                        viewer.fileName = fileName;
                        viewer.downloadFileName = fileName;
                    };
                });
                viewer.serverActionSettings.download = 'Download';
                break;
            //Downloads the PDF document being loaded in the PDFViewer.
            case 'download':
                viewer.download();
                break;
        }
    }
    function documentLoaded(args) {
        fileName = args.documentName;
        const postData = {
            documentData: documentData
        };
        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        };
        const apiUrl = 'https://ej2services.syncfusion.com/react/development/api/pdfviewer/ValidateSignature';
        fetch(apiUrl, options)
            .then(response => response.json())
            .then(body => {
            if (body.successVisible || body.warningVisible || body.errorVisible)
                toolbar.items[1].disabled = true;
            if (!body.downloadVisibility)
                toolbar.items[2].disabled = false;
            if ((body.successVisible)) {
                setTimeout(() => {
                    msgSuccess = body.message;
                    setVisible(true);
                }, 1000);
                setTimeout(() => {
                    setVisible(false);
                }, 5000);
            }
            if ((body.warningVisible)) {
                msgWarning = body.message;
                setwarningVisible(true);
            }
            if (body.errorVisible) {
                msgError = body.message;
                seterrorVisible(false);
            }
        });
    }
    function readFile(evt) {
        let uploadedFiles = evt.target.files;
        let uploadedFile = uploadedFiles[0];
        fileName = uploadedFile.name;
        let reader = new FileReader();
        reader.readAsDataURL(uploadedFile);
        let uploadedFileName = fileName;
        reader.onload = function (e) {
            toolbar.items[2].disabled = true;
            let uploadedFileUrl = e.currentTarget.result;
            documentData = uploadedFileUrl;
            viewer.load(uploadedFileUrl, null);
            viewer.fileName = fileName;
            viewer.downloadFileName = fileName;
        };
    }
    //Triggers while adding the signature in signature field.
    function addSignature() {
        let field;
        // To retrieve the form fields in the loaded PDF Document.
        field = viewer.retrieveFormFields();
        let signatureFieldCount = 0;
        let signaturesCount = 0;
        for (let i = 0; i < field.Count; i++) {
            if (field[i].Type.ToString() === "SignatureField") {
                signatureFieldCount++;
            }
            if (field[i].Value !== "" && field[i].Value !== null && field[i].Type.ToString() === "SignatureField") {
                signaturesCount++;
            }
        }
        // Checks whether all the signature fields are signed or not.
        if (signatureFieldCount === signaturesCount) {
            // Checks whether the document has a digital signature or not.
            if (!hasDigitalSignature) {
                buttonVisiblity = false;
                toolbar.items[1].disabled = false;
            }
        }
    }
}
export default InvisibleDigitalSignature;

const root = createRoot(document.getElementById('sample'));
root.render(<InvisibleDigitalSignature />);