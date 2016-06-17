define({
    "schema": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "basicMeta",
        "title": "Basic Metadata",
        "type": "object",
        "required": ["title", "creationDate", "characterSet", "metadataStandardName"],
        "properties": {
            "title": {
                "title": "Title",
                "type": "string"
            },
            "creationDate": {
                "title": "Creation Date",
                "format": "date",
                "type": "string"
            },
            "characterSet": {
                "title": "Character-set",
                "default": "106"
            },
            "metadataStandardName": {
                "type": "string",
                "title": "Used metadata standard",
                "default": "FENIX"
            },
            "metadataStandardVersion": {
                "title": "Version of metadata standard",
                "type": "string",
                "default": "1.0"
            },
            "metadataLanguage": {
                "title": "Language(s) used for metadata",
                "type": "string",
                "uniqueItems": true,
                "default": "eng"
            }
        }
    },
    "options": {
        "fields": {
            "title": {
                "helper": "Textual label used as title of the resource."
            },
            "creationDate": {
                "helper": "Creation date of the resource.",
                "picker": {
                    "format": "DD/MM/YYYY"
                }
            },
            "characterSet": {
                "helper": "Full name of the character coding standard used by the resource.",
                "type": "select",
                //"dataSource": "fx-MetaEditor2/config/CL/CL_IANACharacterSet.json"
                "dataSource": "./submodules/fenix-ui-metadata-editor/config/CL/CL_IANACharacterSet.json",
            },
            "metadataStandardName": {
                "helper": "Name of the metadata standard specifications used. In FENIX framework this field would be pre-compiled by \u0027FENIX\u0027.",
            },
            "metadataStandardVersion": {
                "helper": "Version of the metadata standard specifications used.",
            },
            "metadataLanguage": {
                "helper": "Version of the metadata standard specifications used.",
                "type": "select",
                "dataSource": "./submodules/fenix-ui-metadata-editor/config/CL/CL_Languages.json"
            }
        }
    }
});