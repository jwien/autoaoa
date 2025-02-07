import { PDFDocument } from "pdf-lib";
import mapToPdfFieldNames, { aoaInfo, aoaPropertyInfo } from "./mapToPdfFields";
import aoaPdf from './docs/AOA.pdf';

export function handleUserInput() {
    const newAoa = <aoaInfo>{};
    newAoa.properties = [];

    // step 1 & 2
    const clientInfoSubmit = <HTMLButtonElement> document.getElementById('clientinfo-submit');
    clientInfoSubmit.addEventListener("click", clientInfoSubmitClick);

    // get additional property info
    const propInfoSubmit = <HTMLButtonElement> document.getElementById('propertyinfo-submit');
    propInfoSubmit.addEventListener("click", propInfoSubmitClick);

    async function clientInfoSubmitClick(event: MouseEvent) {
        event.preventDefault();
    
        const clientInfoElement = <HTMLFormElement> document.getElementById('clientinfo');
        const clientInfoFormData = new FormData(clientInfoElement);
    
        newAoa.cadname = clientInfoFormData.get("inputCadname").toString();
        newAoa.ownername = clientInfoFormData.get("inputOwnername").toString();
        newAoa.address = clientInfoFormData.get("inputHomeaddress").toString();
        newAoa.citystatezip = clientInfoFormData.get("inputCitystatezip").toString();
    
        const needsMoreProperties = booleanModalPrompt("more-properties-prompt");
        await needsMoreProperties.then(need => {
            newAoa.propertyListedBelow = need;
        });
    
        if (newAoa.propertyListedBelow) {
            const includeOwnerInfoProperty = booleanModalPrompt("include-owner-property-prompt");
            await includeOwnerInfoProperty.then(include => {
                newAoa.allPropertyListedAbove = include;
            });
        } else {
            newAoa.allPropertyListedAbove = true;
        }

        if (newAoa.propertyListedBelow) {
            scrollToPropertyInfo();
        } else {
            finalizeModifiedPdf();
        }
    
    }

    async function propInfoSubmitClick(event: MouseEvent) {
        event.preventDefault();

        const propertyInfoElement = <HTMLFormElement> document.getElementById("propertyinfo");
        const propInfoFormData = new FormData(propertyInfoElement);
        
        for (let i = 0; i < 4; i++) {
            const property: aoaPropertyInfo = {
                situsaddress: propInfoFormData.get("inputPropaddress" + i).toString(),
                pid: propInfoFormData.get("inputProppid" + i).toString(),
                legaldescription: propInfoFormData.get("inputProplegaldesc" + i).toString(),
            }
            newAoa.properties.push(property);
        }

        finalizeModifiedPdf();
    }
    
    function booleanModalPrompt(htmlElementId: string): Promise<boolean> {
        const booleanModal = <HTMLElement> document.getElementById(htmlElementId);
        booleanModal.classList.add("show");
        booleanModal.style.display = "block";
        
        return new Promise<boolean>((res, rej) => {
            const promptOptionButtons = booleanModal.querySelectorAll(".modal-option");
            promptOptionButtons.forEach(optionBtn => {
                optionBtn.addEventListener("click", (event) => {
                    if (event.target instanceof HTMLElement) {
                        const value = Boolean(event.target.dataset.val);

                        res(value);
                    }
                    booleanModal.classList.remove("show");
                    booleanModal.style.display = "none";
                });
            });
        });
    }
    
    function scrollToPropertyInfo() {
        const propertyInfoElement = <HTMLFormElement> document.getElementById("propertyinfo");
        propertyInfoElement.className = "d-block";
    
        propertyInfoElement.scrollIntoView({ behavior: 'smooth' });
        const firstElementField = document.getElementsByName("inputPropaddress0").item(0);
        firstElementField.focus();
    
    }

    async function finalizeModifiedPdf() {
        const pdfDoc = await PDFDocument.load(aoaPdf);

        const pdfForm = pdfDoc.getForm();
    
        console.log(newAoa);
        mapToPdfFieldNames(pdfForm, newAoa);
    
        const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true});
    
        const aoaIframe = <HTMLIFrameElement> document.getElementById('aoa-iframe');
        aoaIframe.className = "d-block";
        aoaIframe.src = pdfDataUri;
    
        aoaIframe.scrollIntoView({ behavior: "smooth" })
        return { aoaIframe, pdfDoc }
    }
}

