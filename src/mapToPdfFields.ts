import { PDFForm, PDFTextField, PDFCheckBox } from "pdf-lib";

export interface aoaPropertyInfo {
    pid: string,
    situsaddress: string,
    legaldescription: string
}

export interface aoaInfo {
    cadname: string,
    ownername: string,
    address: string,
    citystatezip: string,
    properties: aoaPropertyInfo[],
}


const mapToPdfFieldNames = (pdfForm: PDFForm, newAoaData: aoaInfo) => {
    pdfForm.getFields().forEach(field => console.log(field.getName()));
    const cadnameField = <PDFTextField> pdfForm.getField("Appraisal District Name");
    const ownernameField = <PDFTextField> pdfForm.getField("Name");
    const addressField = <PDFTextField> pdfForm.getField("Address");
    const citystatezipField = <PDFTextField> pdfForm.getField("City State Zip Code");
    const propertiesListedAboveCheck = pdfForm.getCheckBox("all property listed for me at the above address");
    const propertiesListedBelowCheck = pdfForm.getCheckBox("the property(ies) listed below:");
    const prop1PidField = <PDFTextField> pdfForm.getField("Appraisal District Account Number_2");
    const prop1SitusaddressField = <PDFTextField> pdfForm.getField("Physical or Situs Address of Property_2");
    const prop1LegaldiscriptionField = <PDFTextField> pdfForm.getField("Legal Description_2");
    const prop2PidField = <PDFTextField> pdfForm.getField("Appraisal District Account Number_3");
    const prop2SitusaddressField = <PDFTextField> pdfForm.getField("Physical or Situs Address of Property_3");
    const prop2LegaldiscriptionField = <PDFTextField> pdfForm.getField("Legal Description_3");
    const prop3PidField = <PDFTextField> pdfForm.getField("Appraisal District Account Number_4");
    const prop3SitusaddressField = <PDFTextField> pdfForm.getField("Physical or Situs Address of Property_4");
    const prop3LegaldiscriptionField = <PDFTextField> pdfForm.getField("Legal Description_4");
    const prop4PidField = <PDFTextField> pdfForm.getField("Appraisal District Account Number_5");
    const prop4SitusaddressField = <PDFTextField> pdfForm.getField("Physical or Situs Address of Property_5");
    const prop4LegaldiscriptionField = <PDFTextField> pdfForm.getField("Legal Description_5");

    cadnameField.setText(newAoaData.cadname);
    ownernameField.setText(newAoaData.ownername);
    addressField.setText(newAoaData.address);
    citystatezipField.setText(newAoaData.citystatezip);

    if (newAoaData.properties.length === 0) {
        propertiesListedAboveCheck.check();
        return;
    } else {
        propertiesListedBelowCheck.check();
    }

    if (newAoaData.properties.length >= 4) {
        prop4PidField.setText(newAoaData.properties[3].pid.toString());
        prop4SitusaddressField.setText(newAoaData.properties[3].situsaddress);
        prop4LegaldiscriptionField.setText(newAoaData.properties[3].legaldescription);
    } 
    if (newAoaData.properties.length >= 3) {
        prop3PidField.setText(newAoaData.properties[2].pid.toString());
        prop3SitusaddressField.setText(newAoaData.properties[2].situsaddress);
        prop3LegaldiscriptionField.setText(newAoaData.properties[2].legaldescription);
    } 
    if (newAoaData.properties.length >= 2) {
        prop2PidField.setText(newAoaData.properties[1].pid.toString());
        prop2SitusaddressField.setText(newAoaData.properties[1].situsaddress);
        prop2LegaldiscriptionField.setText(newAoaData.properties[1].legaldescription);
    } 
    if (newAoaData.properties.length >= 1) {
        prop1PidField.setText(newAoaData.properties[0].pid.toString());
        prop1SitusaddressField.setText(newAoaData.properties[0].situsaddress);
        prop1LegaldiscriptionField.setText(newAoaData.properties[0].legaldescription);
    }
}

export default mapToPdfFieldNames