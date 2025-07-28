// import dotenv from 'dotenv';
import logger from '../config/logger.js';
// dotenv.config();

// export async function updateGHLForm(formID: string, newFormName: string, newFormDescription: string) {
//     const url = `https://services.leadconnectorhq.com/forms/${formID}`;
//     const body = {
//       "name": newFormName,
//       "formData": {
//         "form": {
//           "company": {
//             "domain": "go.thelive.agency",
//             "logoURL": "https://msgsndr-private.storage.googleapis.com/companyPhotos/fc37f7fe-eb52-4aa1-9896-84eb9bd55c53.png",
//             "name": "TheLive.Agency"
//           },
//           "customStyle": "",
//           "fieldCSS": "@import url('https://fonts.googleapis.com/css?family=Inter:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Inter:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Noto Sans JP:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i');\n\n  #_builder-form .form-builder--item input[type=text][class=form-control],#_builder-form .form-builder--item .date-picker-custom-style,#_builder-form .form-builder--item input[type=number]{\n    background-color: #FFFFFFFF !important;\n    color: #2c3345FF !important;\n    border: 1px solid #ACACACFF !important;\n    border-radius: 5px !important;\n    padding: 8px 15px 8px 15px !important;\n    box-shadow: 0px 0px 0px 0px #FFFFFF;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n    background-clip: inherit !important;\n  }\n  #_builder-form textarea {\n    background-color: #FFFFFFFF !important;\n    color: #2c3345FF !important;\n    border: 1px solid #ACACACFF !important;\n    border-radius: 5px !important;\n    padding: 8px 15px 8px 15px !important;\n    box-shadow: 0px 0px 0px 0px #FFFFFF !important;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n    background-clip: inherit !important;\n  }\n  #_builder-form input[type=tel],#_builder-form input[type=email],#_builder-form .multiselect .multiselect__tags{\n    background-color: #FFFFFFFF !important;\n    color: #2c3345FF !important;\n    border: 1px solid #ACACACFF !important; \n    border: 1px solid #ACACACFF !important;\n    border-radius: 5px !important;\n    padding: 8px 15px 8px 15px !important;\n    box-shadow: 0px 0px 0px 0px #FFFFFF;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n    background-clip: inherit !important;\n  }\n  #_builder-form .multi_select_form {\n    border-radius: 5px !important;\n  }\n  #_builder-form .iti--allow-dropdown input, .iti--allow-dropdown input[type=tel]{\n    padding-left: 45px !important;\n  }\n  #_builder-form .countryphone {\n    height: inherit;\n  }\n\n\n  #_builder-form .form-builder--item .date-picker-custom-style input[type=text],  #_builder-form .form-builder--item .multiselect .multiselect__placeholder {\n    padding:0;\n    background-color: #FFFFFFFF;\n    color: #2c3345FF;\n    font-size: 12px;\n  }\n  #_builder-form .form-builder--item .multiselect .multiselect__input{\n    background-color: #FFFFFFFF !important;\n  }\n  #_builder-form .form-builder--item .multiselect .multiselect__select{\n    background: transparent;\n    z-index:10;\n  }\n  #_builder-form .form-builder--item .multiselect ,.multiselect__single{\n    padding:0 !important;\n    margin:0 !important;\n    min-height: 24px;\n    color:  #2c3345FF !important;\n    background-color: #FFFFFFFF !important;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n  }\n  #_builder-form .form-builder--item  .multiselect__placeholder {\n    padding:0 !important;\n    margin:0 !important;\n    min-height: 24px;\n    color: #8c8c8cFF !important;\n    background-color: #FFFFFFFF !important;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n  }\n  #_builder-form .field-container{\n    width:100%;\n    max-width: 900px;\n  }\n  #_builder-form ::-webkit-input-placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */\n    color: #8c8c8cFF;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n    opacity: 1; /* Firefox */\n  }\n  #_builder-form ::placeholder {\n    color: #8c8c8cFF !important;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n  }\n  #_builder-form :-ms-input-placeholder { /* Internet Explorer 10-11 */\n    color: #8c8c8cFF !important;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n  }\n  #_builder-form ::-ms-input-placeholder { /* Microsoft Edge */\n    color: #8c8c8cFF !important;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n  }\n\n  #_builder-form label{ \n    color: #2c3345FF;\n    font-family: 'Inter';\n    font-size: 14px;\n    font-weight: 500;\n  }\n  #_builder-form .short-label{ \n    color: #2c3345FF;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n    -webkit-font-smoothing: auto;\n  }\n  #_builder-form .form-builder--item .payment-suggestion-tag-container {\n    background-color: #FFFFFFFF;\n    color: #2c3345FF !important;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n      box-shadow: 0px 0px 0px 0px #FFFFFF;\n  }\n  #_builder-form .product-summary-amount-large, #order-confirmation .product-summary-amount-large {\n    color: #2c3345FF;\n    font-size: 18px;\n    font-weight: 700;\n    font-family: Inter;\n    line-height: 1.5rem;\n  }\n  #_builder-form .product-summary-amount-normal, #order-confirmation .product-summary-amount-normal {\n    color: #2c3345FF;\n    font-size: 14px;\n    font-weight: 600;\n    font-family: Inter;\n    line-height: 1.5rem;\n  }\n  #_builder-form .product-summary-label-bold, #order-confirmation .product-summary-label-bold{\n    color: #2c3345FF;\n    font-size: 14px;\n    font-weight: 700;\n    font-family: Inter;\n    line-height: 1.5rem;\n  }\n  #_builder-form .crossed-amount {\n    color: #2c3345FF;\n    font-size: 16px;\n    font-weight: 600;\n    font-family: Inter;\n    line-height: 1.5rem;\n  }\n  #_builder-form .product-summary-label-large, #order-confirmation .product-summary-label-large{\n    color: #2c3345FF;\n    font-size: 16px;\n    font-weight: 600;\n    font-family: Inter;\n    line-height: 1.575rem;\n  }\n  #_builder-form .product-summary-label-normal, #order-confirmation .product-summary-label-normal{\n    color: #2c3345FF;\n    font-size: 14px;\n    font-weight: 500;\n    font-family: Inter;\n    line-height: 1.575rem;\n  }\n  #_builder-form .product-summary-label-small, #order-confirmation .product-summary-label-small{\n    color: #2c3345FF;\n    font-size: 12px;\n    font-weight: 500;\n    font-family: Inter;\n    line-height: 1.575rem;\n  }\n  #_builder-form .variant-tag {\n    color: #2c3345FF;\n    font-size: 13px;\n    font-weight: 500;\n    font-family: Inter;\n    line-height: 1.5rem;\n  }\n  #_builder-form .selected-tag {\n    background-color: #009EF426 !important;\n  }\n  #_builder-form .payment-tag, #_builder-form .quantity-container-counter { \n    box-shadow: 0px 0px 0px 0px #FFFFFF;\n    background-color : #FFFFFFFF; \n  }\n  #_builder-form .quantity-container-counter  {\n    padding-top: 6px !important;\n    padding-bottom:  6px !important;\n  }\n  #_builder-form .quantity-text {\n    font-size: 12px !important;\n  }\n  ",
//           "mobileFieldCSS": "@import url('https://fonts.googleapis.com/css?family=Inter:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Inter:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Noto Sans JP:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i');\n\n  #_builder-form .form-builder--item input[type=text][class=form-control],#_builder-form .form-builder--item .date-picker-custom-style,#_builder-form .form-builder--item input[type=number]{\n    background-color: #FFFFFFFF !important;\n    color: #2c3345FF !important;\n    border: 1px solid #ACACACFF !important;\n    border-radius: 5px !important;\n    padding: 8px 15px 8px 15px !important;\n    box-shadow: 0px 0px 0px 0px #FFFFFF;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n    background-clip: inherit !important;\n  }\n  #_builder-form textarea {\n    background-color: #FFFFFFFF !important;\n    color: #2c3345FF !important;\n    border: 1px solid #ACACACFF !important;\n    border-radius: 5px !important;\n    padding: 8px 15px 8px 15px !important;\n    box-shadow: 0px 0px 0px 0px #FFFFFF !important;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n    background-clip: inherit !important;\n  }\n  #_builder-form input[type=tel],#_builder-form input[type=email],#_builder-form .multiselect .multiselect__tags{\n    background-color: #FFFFFFFF !important;\n    color: #2c3345FF !important;\n    border: 1px solid #ACACACFF !important; \n    border: 1px solid #ACACACFF !important;\n    border-radius: 5px !important;\n    padding: 8px 15px 8px 15px !important;\n    box-shadow: 0px 0px 0px 0px #FFFFFF;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n    background-clip: inherit !important;\n  }\n  #_builder-form .multi_select_form {\n    border-radius: 5px !important;\n  }\n  #_builder-form .iti--allow-dropdown input, .iti--allow-dropdown input[type=tel]{\n    padding-left: 45px !important;\n  }\n  #_builder-form .countryphone {\n    height: inherit;\n  }\n\n\n  #_builder-form .form-builder--item .date-picker-custom-style input[type=text],  #_builder-form .form-builder--item .multiselect .multiselect__placeholder {\n    padding:0;\n    background-color: #FFFFFFFF;\n    color: #2c3345FF;\n    font-size: 12px;\n  }\n  #_builder-form .form-builder--item .multiselect .multiselect__input{\n    background-color: #FFFFFFFF !important;\n  }\n  #_builder-form .form-builder--item .multiselect .multiselect__select{\n    background: transparent;\n    z-index:10;\n  }\n  #_builder-form .form-builder--item .multiselect ,.multiselect__single{\n    padding:0 !important;\n    margin:0 !important;\n    min-height: 24px;\n    color:  #2c3345FF !important;\n    background-color: #FFFFFFFF !important;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n  }\n  #_builder-form .form-builder--item  .multiselect__placeholder {\n    padding:0 !important;\n    margin:0 !important;\n    min-height: 24px;\n    color: #8c8c8cFF !important;\n    background-color: #FFFFFFFF !important;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n  }\n  #_builder-form .field-container{\n    width:100%;\n    max-width: 900px;\n  }\n  #_builder-form ::-webkit-input-placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */\n    color: #8c8c8cFF;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n    opacity: 1; /* Firefox */\n  }\n  #_builder-form ::placeholder {\n    color: #8c8c8cFF !important;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n  }\n  #_builder-form :-ms-input-placeholder { /* Internet Explorer 10-11 */\n    color: #8c8c8cFF !important;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n  }\n  #_builder-form ::-ms-input-placeholder { /* Microsoft Edge */\n    color: #8c8c8cFF !important;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n  }\n\n  #_builder-form label{ \n    color: #2c3345FF;\n    font-family: 'Inter';\n    font-size: 14px;\n    font-weight: 500;\n  }\n  #_builder-form .short-label{ \n    color: #2c3345FF;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n    -webkit-font-smoothing: auto;\n  }\n  #_builder-form .form-builder--item .payment-suggestion-tag-container {\n    background-color: #FFFFFFFF;\n    color: #2c3345FF !important;\n    font-family: 'Inter';\n    font-size: 12px;\n    font-weight: 300;\n      box-shadow: 0px 0px 0px 0px #FFFFFF;\n  }\n  #_builder-form .product-summary-amount-large, #order-confirmation .product-summary-amount-large {\n    color: #2c3345FF;\n    font-size: 18px;\n    font-weight: 700;\n    font-family: Inter;\n    line-height: 1.5rem;\n  }\n  #_builder-form .product-summary-amount-normal, #order-confirmation .product-summary-amount-normal {\n    color: #2c3345FF;\n    font-size: 14px;\n    font-weight: 600;\n    font-family: Inter;\n    line-height: 1.5rem;\n  }\n  #_builder-form .product-summary-label-bold, #order-confirmation .product-summary-label-bold{\n    color: #2c3345FF;\n    font-size: 14px;\n    font-weight: 700;\n    font-family: Inter;\n    line-height: 1.5rem;\n  }\n  #_builder-form .crossed-amount {\n    color: #2c3345FF;\n    font-size: 16px;\n    font-weight: 600;\n    font-family: Inter;\n    line-height: 1.5rem;\n  }\n  #_builder-form .product-summary-label-large, #order-confirmation .product-summary-label-large{\n    color: #2c3345FF;\n    font-size: 16px;\n    font-weight: 600;\n    font-family: Inter;\n    line-height: 1.575rem;\n  }\n  #_builder-form .product-summary-label-normal, #order-confirmation .product-summary-label-normal{\n    color: #2c3345FF;\n    font-size: 14px;\n    font-weight: 500;\n    font-family: Inter;\n    line-height: 1.575rem;\n  }\n  #_builder-form .product-summary-label-small, #order-confirmation .product-summary-label-small{\n    color: #2c3345FF;\n    font-size: 12px;\n    font-weight: 500;\n    font-family: Inter;\n    line-height: 1.575rem;\n  }\n  #_builder-form .variant-tag {\n    color: #2c3345FF;\n    font-size: 13px;\n    font-weight: 500;\n    font-family: Inter;\n    line-height: 1.5rem;\n  }\n  #_builder-form .selected-tag {\n    background-color: #009EF426 !important;\n  }\n  #_builder-form .payment-tag, #_builder-form .quantity-container-counter { \n    box-shadow: 0px 0px 0px 0px #FFFFFF;\n    background-color : #FFFFFFFF; \n  }\n  #_builder-form .quantity-container-counter  {\n    padding-top: 6px !important;\n    padding-bottom:  6px !important;\n  }\n  #_builder-form .quantity-text {\n    font-size: 12px !important;\n  }\n  ",
//           "fbPixelId": "",
//           "fieldStyle": {
//             "activeTagBgColor": "009EF426",
//             "bgColor": "FFFFFFFF",
//             "border": {
//               "border": 1,
//               "color": "ACACACFF",
//               "radius": 5,
//               "type": "solid"
//             },
//             "fontColor": "2c3345FF",
//             "labelAlignment": "top",
//             "labelColor": "2c3345FF",
//             "labelFontFamily": "Inter",
//             "labelFontSize": 14,
//             "labelFontWeight": 500,
//             "labelWidth": 200,
//             "padding": {
//               "bottom": 8,
//               "left": 15,
//               "right": 15,
//               "top": 8
//             },
//             "placeholderColor": "8c8c8cFF",
//             "placeholderFontFamily": "Inter",
//             "placeholderFontSize": 12,
//             "placeholderFontWeight": 300,
//             "shadow": {
//               "blur": 0,
//               "color": "FFFFFF",
//               "horizontal": 0,
//               "spread": 0,
//               "vertical": 0
//             },
//             "shortLabel": {
//               "color": "2c3345FF",
//               "fontFamily": "Inter",
//               "fontSize": 12,
//               "fontWeight": 300
//             },
//             "width": 900
//           },
//           "fields": [
//             {
//               "active": false,
//               "align": "left",
//               "bgColor": "FFFFFF",
//               "border": {
//                 "border": 0,
//                 "color": "FFFFFF",
//                 "radius": 0,
//                 "type": "none"
//               },
//               "color": "000000",
//               "fontFamily": "Roboto",
//               "fontSize": 15,
//               "hiddenFieldQueryKey": "header",
//               "label": newFormDescription,
//               "padding": {
//                 "bottom": 0,
//                 "left": 0,
//                 "right": 0,
//                 "top": 0
//               },
//               "placeholder": "header",
//               "shadow": {
//                 "blur": 0,
//                 "color": "FFFFFF",
//                 "horizontal": 0,
//                 "spread": 0,
//                 "vertical": 0
//               },
//               "standard": true,
//               "tag": "header",
//               "type": "h1",
//               "typeLabel": "Text",
//               "weight": 400
//             },
//             {
//               "active": false,
//               "fieldKey": "name",
//               "fieldWidthPercentage": 75,
//               "hiddenFieldQueryKey": "full_name",
//               "label": "Name",
//               "placeholder": "Full Name",
//               "required": false,
//               "standard": true,
//               "tag": "full_name",
//               "type": "text",
//               "typeLabel": "Text"
//             },
//             {
//               "Id": "Ie1KZ2w9Rj3KQk8TtBfb",
//               "active": false,
//               "allowCustomOption": false,
//               "customFieldLabel": "Gender Pronouns",
//               "dataType": "SINGLE_OPTIONS",
//               "dateAdded": "2024-12-09T07:59:49.648Z",
//               "documentType": "field",
//               "edit": false,
//               "fieldKey": "contact.gender_pronouns",
//               "fieldWidthPercentage": 25,
//               "fieldsCount": 0,
//               "hiddenFieldQueryKey": "gender_pronouns",
//               "id": "Ie1KZ2w9Rj3KQk8TtBfb",
//               "label": "Preferred pronouns (Optional)",
//               "locationId": "smmJldAFmnvas9PaqsF5",
//               "model": "contact",
//               "name": "Gender Pronouns",
//               "parentId": "HDf2rXFNh0cuUF0PGMfS",
//               "picklistOptions": [
//                 "He/Him/His",
//                 "She/Her/Hers",
//                 "They/Them/Their"
//               ],
//               "placeholder": "",
//               "position": 1300,
//               "required": false,
//               "showInForms": true,
//               "standard": false,
//               "tag": "Ie1KZ2w9Rj3KQk8TtBfb",
//               "type": "single_options"
//             },
//             {
//               "enableCountryPicker": false,
//               "fieldKey": "phone_number",
//               "fieldWidthPercentage": 50,
//               "hiddenFieldQueryKey": "phone",
//               "label": "Phone number",
//               "placeholder": "Phone",
//               "required": true,
//               "standard": true,
//               "tag": "phone",
//               "type": "text",
//               "typeLabel": "Phone"
//             },
//             {
//               "active": false,
//               "calculatedOptions": [
//                 {
//                   "calculatedValue": "",
//                   "label": "Yes"
//                 },
//                 {
//                   "calculatedValue": "",
//                   "label": "No, Please sign up at https://exploretalen"
//                 }
//               ],
//               "category": "choiceElements",
//               "custom": true,
//               "customEdited": true,
//               "customFieldLabel": "Signed up for Explore Talent?",
//               "dataType": "RADIO",
//               "dateAdded": "2025-06-23T20:23:55.486Z",
//               "documentType": "field",
//               "fieldKey": "contact.signed_up_for_explore_talent",
//               "fieldWidthPercentage": 100,
//               "hiddenFieldQueryKey": "signed_up_for_explore_talent",
//               "id": "brd5DckV8ul8TNe9U86r",
//               "isAllowedCustomOption": false,
//               "label": "Are you over 18 years of age",
//               "locationId": "smmJldAFmnvas9PaqsF5",
//               "model": "contact",
//               "name": "Signed up for Explore Talent?",
//               "parentId": "IvXpIBHFB1P6S3gNUmNB",
//               "picklistOptions": [
//                 "Yes",
//                 "No"
//               ],
//               "placeholder": "",
//               "position": 50,
//               "required": true,
//               "standard": false,
//               "tag": "brd5DckV8ul8TNe9U86r",
//               "type": "radio",
//               "typeLabel": "Radio"
//             },
//             {
//               "active": false,
//               "fieldKey": "please_list_the_closest_major_city_youre_near_e_g_la_nyc_atlanta",
//               "fieldWidthPercentage": 100,
//               "hiddenFieldQueryKey": "current_city",
//               "label": "Please list the closest major city you're near (e.g., LA, NYC, Atlanta)",
//               "placeholder": "Enter your City & State",
//               "preview": "<span style=\"color: #000000;\">Enter your City & State</span>",
//               "required": false,
//               "standard": true,
//               "tag": "city",
//               "title": "City",
//               "type": "text",
//               "typeLabel": "Text"
//             },
//             {
//               "active": false,
//               "category": "other",
//               "custom": true,
//               "customEdited": true,
//               "customFieldLabel": "Recent Image",
//               "dataType": "FILE_UPLOAD",
//               "dateAdded": "2025-06-23T20:23:55.432Z",
//               "documentType": "field",
//               "fieldKey": "contact.recent_image",
//               "hiddenFieldQueryKey": "recent_image",
//               "id": "Th7yrlifsGkaXlfQ4Lbr",
//               "isMultiFileAllowed": false,
//               "isMultipleFile": false,
//               "label": "Attach a clear and recent photo",
//               "locationId": "smmJldAFmnvas9PaqsF5",
//               "model": "contact",
//               "multipleFilesAllowed": false,
//               "name": "Recent Image",
//               "parentId": "IvXpIBHFB1P6S3gNUmNB",
//               "picklistOptions": [
//                 ".png",
//                 ".jpeg",
//                 ".jpg"
//               ],
//               "placeholder": "",
//               "position": 50,
//               "required": true,
//               "standard": false,
//               "tag": "Th7yrlifsGkaXlfQ4Lbr",
//               "type": "file_upload",
//               "typeLabel": "File Upload"
//             },
//             {
//               "Id": "fjbRLRv4IWF8dKemAZ2E",
//               "active": false,
//               "allowCustomOption": false,
//               "customFieldLabel": "Age:",
//               "dataType": "TEXT",
//               "dateAdded": "2022-05-25T11:28:02.108Z",
//               "documentType": "field",
//               "edit": false,
//               "fieldKey": "contact.age",
//               "fieldWidthPercentage": 50,
//               "fieldsCount": 0,
//               "hiddenFieldQueryKey": "age:",
//               "id": "fjbRLRv4IWF8dKemAZ2E",
//               "label": "Age range",
//               "locationId": "smmJldAFmnvas9PaqsF5",
//               "model": "contact",
//               "name": "Age:",
//               "parentId": "6mhptu32dluQn8KBpKy0",
//               "placeholder": "How old do you appear?",
//               "position": 750,
//               "preview": "<span style=\"color: #000000;\">How old do you appear?</span>",
//               "required": false,
//               "showInForms": true,
//               "standard": false,
//               "tag": "fjbRLRv4IWF8dKemAZ2E",
//               "type": "text"
//             },
//             {
//               "Id": "jDPk8VtjoDI1zOm9eGHB",
//               "active": false,
//               "allowCustomOption": false,
//               "customFieldLabel": "height",
//               "dataType": "TEXT",
//               "dateAdded": "2022-05-10T07:28:16.615Z",
//               "documentType": "field",
//               "edit": false,
//               "fieldKey": "contact.height",
//               "fieldWidthPercentage": 25,
//               "fieldsCount": 0,
//               "hiddenFieldQueryKey": "height",
//               "id": "jDPk8VtjoDI1zOm9eGHB",
//               "label": "Height",
//               "locationId": "smmJldAFmnvas9PaqsF5",
//               "model": "contact",
//               "name": "height",
//               "parentId": "ZckahJVhpDWwTRAx0hR7",
//               "picklistOptions": [
//                 ""
//               ],
//               "placeholder": "",
//               "position": 0,
//               "required": false,
//               "showInForms": true,
//               "standard": false,
//               "tag": "jDPk8VtjoDI1zOm9eGHB",
//               "type": "text"
//             },
//             {
//               "Id": "iEJPfEILYujYtokXjLoX",
//               "active": false,
//               "allowCustomOption": false,
//               "customFieldLabel": "Weight",
//               "dataType": "TEXT",
//               "dateAdded": "2024-12-05T07:01:23.812Z",
//               "documentType": "field",
//               "edit": false,
//               "fieldKey": "contact.weight",
//               "fieldWidthPercentage": 25,
//               "fieldsCount": 0,
//               "hiddenFieldQueryKey": "weight",
//               "id": "iEJPfEILYujYtokXjLoX",
//               "label": "weight",
//               "locationId": "smmJldAFmnvas9PaqsF5",
//               "model": "contact",
//               "name": "Weight",
//               "parentId": "YOsjAbDM6IhHepHomfVp",
//               "placeholder": "",
//               "position": 50,
//               "required": false,
//               "showInForms": true,
//               "standard": false,
//               "tag": "iEJPfEILYujYtokXjLoX",
//               "type": "text"
//             },
//             {
//               "Id": "1pXz8Wf0DPLpFv7JWReq",
//               "active": false,
//               "allowCustomOption": false,
//               "customFieldLabel": "Clothing Size",
//               "dataType": "TEXT",
//               "dateAdded": "2025-07-26T01:15:26.914Z",
//               "description": "",
//               "documentType": "field",
//               "edit": false,
//               "fieldKey": "contact.clothing_size",
//               "fieldWidthPercentage": 50,
//               "fieldsCount": 0,
//               "hiddenFieldQueryKey": "clothing_size",
//               "id": "1pXz8Wf0DPLpFv7JWReq",
//               "label": "clothing size",
//               "locationId": "smmJldAFmnvas9PaqsF5",
//               "model": "contact",
//               "name": "Clothing Size",
//               "parentId": "r5rkYWv05jCcLi3R99ZA",
//               "placeholder": "",
//               "position": 600,
//               "required": false,
//               "showInForms": true,
//               "standard": false,
//               "tag": "1pXz8Wf0DPLpFv7JWReq",
//               "type": "text"
//             },
//             {
//               "Id": "mxKe357YLizbtPXhjG0I",
//               "active": false,
//               "allowCustomOption": false,
//               "customFieldLabel": "Shoe Size",
//               "dataType": "TEXT",
//               "dateAdded": "2024-12-03T07:04:32.495Z",
//               "documentType": "field",
//               "edit": false,
//               "fieldKey": "contact.shoe_size",
//               "fieldWidthPercentage": 25,
//               "fieldsCount": 0,
//               "hiddenFieldQueryKey": "shoe_size",
//               "id": "mxKe357YLizbtPXhjG0I",
//               "label": "shoe size",
//               "locationId": "smmJldAFmnvas9PaqsF5",
//               "model": "contact",
//               "name": "Shoe Size",
//               "parentId": "ZckahJVhpDWwTRAx0hR7",
//               "placeholder": "",
//               "position": 617,
//               "required": false,
//               "showInForms": true,
//               "standard": false,
//               "tag": "mxKe357YLizbtPXhjG0I",
//               "type": "text"
//             },
//             {
//               "active": false,
//               "align": "center",
//               "bgColor": "A6993AFF",
//               "border": 0,
//               "borderColor": "FFFFFF",
//               "borderRadius": 6,
//               "borderType": "none",
//               "color": "FFFFFFFF",
//               "fieldWidthPercentage": 100,
//               "fontFamily": "Inter",
//               "fontSize": 18,
//               "fullwidth": true,
//               "hiddenFieldQueryKey": "button",
//               "label": "<p><strong>Click here to submit</strong></p><p></p>",
//               "padding": {
//                 "bottom": 9,
//                 "left": 50,
//                 "right": 50,
//                 "top": 9
//               },
//               "placeholder": "Button",
//               "radius": 5,
//               "shadow": {
//                 "blur": 0,
//                 "color": "FFFFFF",
//                 "horizontal": 0,
//                 "spread": 0,
//                 "vertical": 0
//               },
//               "standard": true,
//               "subTextColor": "000000",
//               "subTextFontFamily": "Inter",
//               "subTextFontSize": 14,
//               "subTextWeight": 200,
//               "submitSubText": "",
//               "tag": "button",
//               "type": "submit",
//               "weight": 400
//             },
//             {
//               "active": false,
//               "align": "left",
//               "bgColor": "FFFFFF",
//               "border": {
//                 "border": 0,
//                 "color": "FFFFFF",
//                 "radius": 0,
//                 "type": "none"
//               },
//               "color": "000000",
//               "fontFamily": "Noto Sans JP",
//               "fontSize": 12,
//               "hiddenFieldQueryKey": "header",
//               "label": "<p>** HEIGHT WEIGHT AND CURRENT CLOTHING SIZES ARE USED FOR COSTUMING PURPOSES ONLY. UNLESS NEEDED FOR THE CASTING OF STAND-INS OR PHOTODOUBLES.</p><p></p>",
//               "padding": {
//                 "bottom": 0,
//                 "left": 0,
//                 "right": 0,
//                 "top": 0
//               },
//               "placeholder": "header",
//               "shadow": {
//                 "blur": 0,
//                 "color": "FFFFFF",
//                 "horizontal": 0,
//                 "spread": 0,
//                 "vertical": 0
//               },
//               "standard": true,
//               "tag": "header",
//               "type": "h1",
//               "typeLabel": "Text",
//               "weight": 400
//             },
//             {
//               "active": false,
//               "align": "left",
//               "bgColor": "FFFFFF",
//               "border": {
//                 "border": 0,
//                 "color": "FFFFFF",
//                 "radius": 0,
//                 "type": "none"
//               },
//               "color": "000000",
//               "fontFamily": "Noto Sans JP",
//               "fontSize": 12,
//               "hiddenFieldQueryKey": "header",
//               "label": "<p>PLEASE NOTE YOU MUST BE ABLE TO PRESENT VALID IDENTIFICATION TO FILL OUT A FEDERAL ID FORM.</p>",
//               "padding": {
//                 "bottom": 0,
//                 "left": 0,
//                 "right": 0,
//                 "top": 0
//               },
//               "placeholder": "header",
//               "shadow": {
//                 "blur": 0,
//                 "color": "FFFFFF",
//                 "horizontal": 0,
//                 "spread": 0,
//                 "vertical": 0
//               },
//               "standard": true,
//               "tag": "header",
//               "type": "h1",
//               "typeLabel": "Text",
//               "weight": 400
//             }
//           ],
//           "payment": null,
//           "address": {
//             "autoCompleteEnabled": true,
//             "children": [
//               {
//                 "category": "address",
//                 "hiddenFieldQueryKey": "city",
//                 "label": "City",
//                 "placeholder": "City",
//                 "required": false,
//                 "standard": true,
//                 "tag": "city",
//                 "title": "City",
//                 "type": "text",
//                 "typeLabel": "Text"
//               },
//               {
//                 "category": "address",
//                 "hiddenFieldQueryKey": "state",
//                 "label": "State",
//                 "placeholder": "State",
//                 "required": false,
//                 "standard": true,
//                 "tag": "state",
//                 "title": "State",
//                 "type": "text",
//                 "typeLabel": "Text"
//               }
//             ],
//             "label": "Address",
//             "placeholder": "Search address",
//             "required": true
//           },
//           "formAction": {
//             "actionType": "2",
//             "redirect_url": "",
//             "thankyouText": "Thank you for taking the time to complete this form.",
//             "headerImageSrc": "",
//             "mobileHeaderImageSrc": ""
//           },
//           "formLabelVisible": true,
//           "formSubmissionEvent": "SubmitApplication",
//           "height": 1452,
//           "layout": 1,
//           "mobileLayout": 1,
//           "inputStyleType": "box",
//           "pageViewEvent": "pageView",
//           "stickyContact": false,
//           "isGDPRCompliant": false,
//           "enableTimezone": true,
//           "conditionalLogic": null,
//           "fullScreenMode": true,
//           "currentThemeId": "6526b8c3b412c83e9edb9c6f",
//           "style": {
//             "fieldSpacing": 16,
//             "ac_branding": false,
//             "bgImage": "",
//             "mobileBgImage": "",
//             "background": "FFFFFFFF",
//             "border": {
//               "border": 1,
//               "color": "FFFFFFFF",
//               "radius": 3,
//               "style": "solid"
//             },
//             "padding": {
//               "bottom": 0,
//               "left": 40,
//               "right": 40,
//               "top": 30
//             },
//             "mobilePadding": {
//               "bottom": 0,
//               "left": 40,
//               "right": 40,
//               "top": 30
//             },
//             "shadow": {
//               "blur": 4,
//               "color": "57647e36",
//               "horizontal": 0,
//               "spread": 0,
//               "vertical": 4
//             }
//           },
//           "submitMessageStyle": {
//             "bgColor": "FFFFFF",
//             "color": "000000",
//             "fontFamily": "roboto",
//             "fontSize": 18
//           },
//           "width": 650,
//           "emailNotificationsConfig": null,
//           "opportunitySettings": null,
//           "autoResponderConfig": null
//         },
//         "emailNotifications": false,
//         "autoResponder": false,
//         "parentFolderId": formID,
//         "parentFolderName": "Form | Dating Reality Show"
//       }
//     }
      
    // const headers = {
    //     'content-type': 'application/json',
    //     accept: 'application/json, text/plain, */*',
    //     'accept-language': 'en-US,en;q=0.5',
    //     baggage: 'sentry-environment=production,sentry-release=0530ae8147fa5c5679bfe937858472b5395c0a17,sentry-public_key=a4b820e23577a8736466697ec2a98798,sentry-trace_id=40a610e3e8c74121875d30bd8c86c729',
    //     channel: 'APP',
    //     origin: 'https://leadgen-apps-form-survey-builder.leadconnectorhq.com',
    //     priority: 'u=1, i',
    //     referer: 'https://leadgen-apps-form-survey-builder.leadconnectorhq.com/',
    //     'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
    //     'sec-ch-ua-mobile': '?0',
    //     'sec-ch-ua-platform': '"Windows"',
    //     'sec-fetch-dest': 'empty',
    //     'sec-fetch-mode': 'cors',
    //     'sec-fetch-site': 'same-site',
    //     'sec-gpc': '1',
    //     'sentry-trace': '40a610e3e8c74121875d30bd8c86c729-993d9b0c461cb7c1',
    //     source: 'WEB_USER',
    //     'token-id': `${process.env.GHL_TOKEN_ID}`,
    //     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    //     version: '2021-07-28'
    // };

    // const options = {
    //     method: 'POST',
    //     headers: headers,
    //     body: JSON.stringify(body)
    // };

    // try {
    //     const response = await fetch(url, options);
    //     const data = await response.json();
    //     console.log(data);
    // } catch (error) {
    //     console.error(error);
    // }
// }

export type GHLForm = {
    form: {
        deleted: boolean;
        productType: string;
        _id: string;
        dateAdded: string;
        dateUpdated: string;
        formData: {
            autoResponder: boolean;
            emailNotifications: boolean;
            form: {
                address: {
                    autoCompleteEnabled: boolean;
                    children: Array<{
                        category: string;
                        hiddenFieldQueryKey: string;
                        label: string;
                        placeholder: string;
                        required: boolean;
                        standard: boolean;
                        tag: string;
                        title: string;
                        type: string;
                        typeLabel: string;
                    }>;
                    label: string;
                    placeholder: string;
                    required: boolean;
                };
                autoResponderConfig: any;
                company: {
                    domain: string;
                    logoURL: string;
                    name: string;
                };
                conditionalLogic: any;
                currentThemeId: string;
                customStyle: string;
                emailNotificationsConfig: any;
                enableTimezone: boolean;
                fbPixelId: string;
                fieldCSS: string;
                fieldStyle: {
                    activeTagBgColor: string;
                    bgColor: string;
                    border: {
                        border: number;
                        color: string;
                        radius: number;
                        type: string;
                    };
                    fontColor: string;
                    labelAlignment: string;
                    labelColor: string;
                    labelFontFamily: string;
                    labelFontSize: number;
                    labelFontWeight: number;
                    labelWidth: number;
                    padding: {
                        bottom: number;
                        left: number;
                        right: number;
                        top: number;
                    };
                    placeholderColor: string;
                    placeholderFontFamily: string;
                    placeholderFontSize: number;
                    placeholderFontWeight: number;
                    shadow: {
                        blur: number;
                        color: string;
                        horizontal: number;
                        spread: number;
                        vertical: number;
                    };
                    shortLabel: {
                        color: string;
                        fontFamily: string;
                        fontSize: number;
                        fontWeight: number;
                    };
                    width: number;
                };
                fields: Array<{
                    active?: boolean;
                    align?: string;
                    bgColor?: string;
                    border?: {
                        border: number;
                        color: string;
                        radius: number;
                        type: string;
                    } | number;
                    borderColor?: string;
                    borderRadius?: number;
                    borderType?: string;
                    color?: string;
                    fontFamily?: string;
                    fontSize?: number;
                    hiddenFieldQueryKey: string;
                    label: string;
                    padding?: {
                        bottom: number;
                        left: number;
                        right: number;
                        top: number;
                    };
                    placeholder?: string;
                    preview?: string;
                    radius?: number;
                    shadow?: {
                        blur: number;
                        color: string;
                        horizontal: number;
                        spread: number;
                        vertical: number;
                    };
                    standard: boolean;
                    subTextColor?: string;
                    subTextFontFamily?: string;
                    subTextFontSize?: number;
                    subTextWeight?: number;
                    submitSubText?: string;
                    tag: string;
                    type: string;
                    typeLabel: string;
                    weight?: number;
                    // Custom field properties
                    Id?: string;
                    allowCustomOption?: boolean;
                    calculatedOptions?: Array<{
                        calculatedValue: string;
                        label: string;
                    }>;
                    category?: string;
                    custom?: boolean;
                    customEdited?: boolean;
                    customFieldLabel?: string;
                    dataType?: string;
                    dateAdded?: string;
                    description?: string;
                    documentType?: string;
                    edit?: boolean;
                    enableCountryPicker?: boolean;
                    fieldKey?: string;
                    fieldWidthPercentage?: number;
                    fieldsCount?: number;
                    fullwidth?: boolean;
                    id?: string;
                    isAllowedCustomOption?: boolean;
                    isMultiFileAllowed?: boolean;
                    isMultipleFile?: boolean;
                    locationId?: string;
                    model?: string;
                    multipleFilesAllowed?: boolean;
                    name?: string;
                    parentId?: string;
                    picklistOptions?: string[];
                    position?: number;
                    required?: boolean;
                    showInForms?: boolean;
                    title?: string;
                }>;
                formAction: {
                    actionType: string;
                    headerImageSrc: string;
                    mobileHeaderImageSrc: string;
                    redirectUrl: string;
                    thankyouText: string;
                };
                formLabelVisible: boolean;
                formSubmissionEvent: string;
                fullScreenMode: boolean;
                height: number;
                inputStyleType: string;
                isGDPRCompliant: boolean;
                layout: number;
                mobileFieldCSS: string;
                mobileLayout: number;
                opportunitySettings: any;
                pageViewEvent: string;
                payment: any;
                stickyContact: boolean;
                style: {
                    acBranding: boolean;
                    background: string;
                    bgImage: string;
                    border: {
                        border: number;
                        color: string;
                        radius: number;
                        style: string;
                    };
                    fieldSpacing: number;
                    mobileBgImage: string;
                    mobilePadding: {
                        bottom: number;
                        left: number;
                        right: number;
                        top: number;
                    };
                    padding: {
                        bottom: number;
                        left: number;
                        right: number;
                        top: number;
                    };
                    shadow: {
                        blur: number;
                        color: string;
                        horizontal: number;
                        spread: number;
                        vertical: number;
                    };
                };
                submitMessageStyle: {
                    bgColor: string;
                    color: string;
                    fontFamily: string;
                    fontSize: number;
                };
                width: number;
            };
            parentFolderId: string;
            parentFolderName: string;
        };
        locationId: string;
        name: string;
        updatedBy: string;
        updatedAt: string;
        versionHistory: Array<{
            formDataDownloadUrl: string;
            formDataUrl: string;
            updatedAt: string;
            updatedBy: string;
            updatedByUser: string;
            versionId: string;
        }>;
    };
    traceId: string;
};


export async function getGHLForm(formID: string) {
  const url = `https://services.leadconnectorhq.com/forms/${formID}`;
  const headers = {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.5',
    baggage: 'sentry-environment=production,sentry-release=0530ae8147fa5c5679bfe937858472b5395c0a17,sentry-public_key=a4b820e23577a8736466697ec2a98798,sentry-trace_id=40745257a71f40de88b2e3ba465136e4,sentry-sample_rate=0.1,sentry-transaction=form-builder-v2,sentry-sampled=false',
    channel: 'APP',
    'if-none-match': 'W/"6479-zQxcjPcmxvVND6llgky2/U6LrRc"',
    origin: 'https://leadgen-apps-form-survey-builder.leadconnectorhq.com',
    priority: 'u=1, i',
    referer: 'https://leadgen-apps-form-survey-builder.leadconnectorhq.com/',
    'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'sec-gpc': '1',
    'sentry-trace': '40745257a71f40de88b2e3ba465136e4-9d65b6ada2641b2c-0',
    source: 'WEB_USER',
    'token-id': `${process.env.GHL_TOKEN}`,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    version: '2021-07-28'
  }
  const options = {
    method: 'GET',
    headers: headers,
  }
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error getting GHL Form:' + error);
    console.error(error);
    throw error;
  }
}

export async function updateGHLForm(formID: string, newFormDescription: string) {
  let form: GHLForm = await getGHLForm(formID);
  // console.log(form);
  // process.exit(0);
  form.form.formData.form.fields[0].label = newFormDescription

  const url = `https://services.leadconnectorhq.com/forms/${formID}`;
  const headers = {
    'content-type': 'application/json',
    accept: 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.5',
    baggage: 'sentry-environment=production,sentry-release=0530ae8147fa5c5679bfe937858472b5395c0a17,sentry-public_key=a4b820e23577a8736466697ec2a98798,sentry-trace_id=40a610e3e8c74121875d30bd8c86c729',
    channel: 'APP',
    origin: 'https://leadgen-apps-form-survey-builder.leadconnectorhq.com',
    priority: 'u=1, i',
    referer: 'https://leadgen-apps-form-survey-builder.leadconnectorhq.com/',
    'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'sec-gpc': '1',
    'sentry-trace': '40a610e3e8c74121875d30bd8c86c729-993d9b0c461cb7c1',
    source: 'WEB_USER',
    'token-id': `${process.env.GHL_TOKEN}`,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    version: '2021-07-28'
  };

  // Send the correct structure that matches the API expectation
  const body = {
    name: form.form.name,
    formData: {
      form: form.form.formData.form,
      emailNotifications: form.form.formData.emailNotifications,
      autoResponder: form.form.formData.autoResponder,
      parentFolderId: form.form.formData.parentFolderId,
      parentFolderName: form.form.formData.parentFolderName
    }
  };

  const options = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error updating GHL Form:' + error);
    console.error(error);
    throw error;
  }
}
