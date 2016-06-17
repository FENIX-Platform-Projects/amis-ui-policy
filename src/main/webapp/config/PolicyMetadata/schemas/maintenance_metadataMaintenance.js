define({
    "schema": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "maintenance_metadataMaintenance",
        "title": "Metadata Maintenance",
        "type": "object",
        "properties": {
            "metadataLastUpdate": {
                "title": "Metadata last update",
                "format": "date"
            }
        }
    },
    "options": {
        "helper": "This section involves maintenance operations concerning the periodic update of metadata to ensure that the resource is properly described.",
        "fields": {
            "metadataLastUpdate": {
                "helper": "Most recent date of update of the metadata.",
                "picker": {
                    "format": "DD/MM/YYYY"
                }
            }
        }
    }
});
