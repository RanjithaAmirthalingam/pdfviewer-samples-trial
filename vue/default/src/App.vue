<template>
    <div>
        <div class="control-section">
            <div class="flex-container">
                <label class="switchLabel" for="checked">Standalone PDF Viewer</label>
                <div class="e-message render-mode-info">
                    <span class="e-msg-icon render-mode-info-icon" title="Turn OFF to render the PDF Viewer as server-backed"></span>
                </div>
                <div>
                    <ejs-switch cssClass="buttonSwitch" id="checked" :change="change" :checked="true"></ejs-switch>
                </div>
            </div>
            
            <ejs-pdfviewer 
                id="pdfviewer" 
                ref="pdfviewer" 
                :documentPath="documentPath">
            </ejs-pdfviewer>
        </div>
 
    </div>
</template>
<style scoped>
	#pdfviewer {
		height: 640px;
	}

.flex-container {
    display: flex;
    justify-content: flex-end;
}

.render-mode-info {
    background: none;
    border: none;
    padding-left: 0px;
}

.render-mode-info .render-mode-info-icon {
    height: 16px;
    width: 16px;
}

.switchLabel {
    font-family: "Segoe UI", "GeezaPro", "DejaVu Serif", sans-serif;        
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.24px;
    text-align: right;
    font-size: 14px;
}

.render-mode-info .render-mode-info-icon::before {
    line-height: 0.5rem;
}

.buttonSwitch {
    Width: 40px;
    Height: 24px;
}

</style>
<script>
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner } from "@syncfusion/ej2-vue-pdfviewer";
import { SwitchComponent } from "@syncfusion/ej2-vue-buttons";

export default {
    components: {
        'ejs-pdfviewer': PdfViewerComponent,
        'ejs-switch': SwitchComponent 
    },
    data: function() {
        return {
			documentPath:'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf'}
    },
	provide: {
      PdfViewer: [Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner]
    },
    methods: {
        // Initialize switchObj within the mounted hook
       change: function (args) {
            var viewer = this.$refs.pdfviewer.ej2Instances;
            if (args.checked) {
                viewer.serviceUrl = "";
            } else {
                viewer.serviceUrl = "https://ej2services.syncfusion.com/vue/development/api/pdfviewer";
            }           
            viewer.dataBind();
            viewer.load(viewer.documentPath, null);
        }
    }
};
</script>