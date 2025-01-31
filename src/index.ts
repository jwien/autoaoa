import { PDFDocument } from 'pdf-lib';
import aoaPdf from './docs/AOA.pdf';
import mapToPdfFieldNames, { aoaInfo, aoaPropertyInfo } from './mapToPdfFields';


const newAoa: aoaInfo = {
    cadname: "TRAVIS",
    ownername: "John Smith",
    address: "1234 Primo St",
    citystatezip: "San Antonio, TX 78249",
    properties: [],
}

async function modifyPdf(aoa: aoaInfo) {
    const pdfDoc = await PDFDocument.load(aoaPdf);

    const pdfForm = pdfDoc.getForm();

    mapToPdfFieldNames(pdfForm, newAoa);

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true});

    const aoaIframe = <HTMLIFrameElement> document.getElementById('aoa-iframe');
    aoaIframe.className = "d-block";
    console.log(pdfDataUri);
    aoaIframe.src = pdfDataUri;

    aoaIframe.scrollIntoView({ behavior: "smooth" })

}

function handleUserInput() {

    const clientInfoSubmit = <HTMLButtonElement> document.getElementById('clientinfo-submit');
    clientInfoSubmit.addEventListener("click", event => {
        event.preventDefault();

        const clientInfoElement = <HTMLFormElement> document.getElementById('clientinfo');
        const clientInfoFormData = new FormData(clientInfoElement);

        newAoa.cadname = clientInfoFormData.get("inputCadname").toString();
        newAoa.ownername = clientInfoFormData.get("inputOwnername").toString();
        newAoa.address = clientInfoFormData.get("inputHomeaddress").toString();
        newAoa.citystatezip = clientInfoFormData.get("inputCitystatezip").toString();

        console.log("prompt start")
        const needsMoreProperties = confirm("Do you have other properties you would like to protest?");
        console.log("prompt end")
        clientInfoSubmit.removeEventListener("click", null)

        if (needsMoreProperties) {
            const propertyInfoElement = <HTMLFormElement> document.getElementById("propertyinfo");
            propertyInfoElement.className = "d-block";

            propertyInfoElement.scrollIntoView({ behavior: 'smooth' });
            const firstElementField = document.getElementsByName("inputPropaddress0").item(0);
            firstElementField.focus();
    
            const propInfoSubmit = <HTMLButtonElement> document.getElementById('propertyinfo-submit');
            propInfoSubmit.addEventListener("click", event => {
                event.preventDefault();
    
                const propInfoFormData = new FormData(propertyInfoElement);
                
                console.log(propInfoFormData);
                for (let i = 0; i < 4; i++) {
                    const property: aoaPropertyInfo = {
                        situsaddress: propInfoFormData.get("inputPropaddress" + i).toString(),
                        pid: propInfoFormData.get("inputProppid" + i).toString(),
                        legaldescription: propInfoFormData.get("inputProplegaldesc" + i).toString(),
                    }
                    newAoa.properties.push(property);
                }
                modifyPdf(newAoa);
            });
        } else {
            modifyPdf(newAoa);
        }
    }, { once: true });
};

handleUserInput();
