import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner, Inject } from '@syncfusion/ej2-react-pdfviewer';

import { SwitchComponent } from '@syncfusion/ej2-react-buttons';

function HandWrittenSignature() {
    let viewer;
    return (<div>
        <div className='control-section'>
            <div className="flex-container">
                <label htmlFor="checked" className="switchLabel"> Standalone PDF Viewer </label>
                <div className="e-message render-mode-info">
                    <span className="e-msg-icon render-mode-info-icon" title="Turn OFF to render the PDF Viewer as server-backed"></span>
                </div>
                <div>
                    <SwitchComponent cssClass="buttonSwitch" id="checked" change={change} checked={true}></SwitchComponent>
                </div>
            </div>
            {/* Render the PDF Viewer */}
            <PdfViewerComponent ref={(scope) => { viewer = scope; }} id="container" documentPath="https://cdn.syncfusion.com/content/pdf/handwritten-signature.pdf" documentLoad={documentLoaded} style={{ 'height': '640px' }}>
                <Inject services={[Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner]}/>
            </PdfViewerComponent>
        </div>
    </div>);
    function documentLoaded() {
        viewer.annotationModule.setAnnotationMode('HandWrittenSignature');
    }
    function change(args) {
        if (args.checked) {
            viewer.serviceUrl = '';
        }
        else {
            viewer.serviceUrl = 'https://ej2services.syncfusion.com/react/development/api/pdfviewer';
        }
        viewer.dataBind();
        viewer.load(viewer.documentPath, null);
    }
}
export default HandWrittenSignature;

const root = createRoot(document.getElementById('sample'));
root.render(<HandWrittenSignature />);