public without sharing class DynamicDataTableHelper {
  @AuraEnabled
  public static DynamicDataTableResponseWrapper getDatableInfo(
    String sobjApiName,
    string columnFields
  ) {
    system.debug(
      'sobjApiName --> ' +
      sobjApiName +
      '  columnFields--> ' +
      columnFields
    );
    Map<String, String> returnMap = new Map<String, String>();
    list<String> columnList = new List<String>();
    DynamicDataTableResponseWrapper response = new DynamicDataTableResponseWrapper();
    List<SObject> lstDataTableRecords = new List<SObject>();
    List<ColumnPropertiesWrapper> lstColumnProperties = new List<ColumnPropertiesWrapper>();

    if (!String.isEmpty(sobjApiName) && !String.isEmpty(columnFields)) {
      SObject obj = (SObject) Type.forName('Account').newInstance();
      Map<String, Schema.SObjectField> fieldMap = obj.getSObjectType()
        .getDescribe()
        .fields.getMap();
      system.System.debug(
        fieldMap.get('look__c').getDescribe().getRelationshipName()
      );

      columnFields += ',Id';
      columnList = columnFields.split(',');
      String columnChildField;
      for (String columnApiName : columnList) {
        if (columnApiName.contains('__r') || columnApiName.contains('.')) {
          columnChildField = columnApiName.substringAfter('.');
          columnApiName = columnApiName.substringBefore('.')
            .replace('__r', '__c');
        }

        if (fieldMap.containsKey(columnApiName.toLowerCase())) {
          String columnChildFieldLabel;
          if (
            String.valueOf(
                fieldMap.get(columnApiName.toLowerCase())
                  .getDescribe()
                  .getType()
              )
              .equalsIgnoreCase('Reference')
          ) {
            Map<String, Schema.SObjectField> referenceFieldMap = fieldMap.get(
                  columnApiName.toLowerCase()
                )
                .getDescribe()
                .getReferenceTo()[0]
              .getDescribe()
              .fields.getMap();

            if (referenceFieldMap.containsKey(columnChildField.toLowerCase())) {
              columnChildFieldLabel = String.valueOf(
                referenceFieldMap.get(columnChildField.toLowerCase())
                  .getDescribe()
                  .getName()
              );
            }

            ColumnPropertiesWrapper columnProperties = new ColumnPropertiesWrapper(
              String.valueOf(
                fieldMap.get(columnApiName.toLowerCase())
                    .getDescribe()
                    .getReferenceTo()[0]
                  .getDescribe()
                  .getLabel() +
                '( ' +
                columnChildFieldLabel +
                ' )'
              ),
              columnApiName + columnChildFieldLabel,
              String.valueOf(
                fieldMap.get(columnApiName.toLowerCase())
                  .getDescribe()
                  .getType()
              )
            );
            lstColumnProperties.add(columnProperties);
          } else {
            ColumnPropertiesWrapper columnProperties = new ColumnPropertiesWrapper(
              String.valueOf(
                fieldMap.get(columnApiName.toLowerCase())
                  .getDescribe()
                  .getLabel()
              ),
              String.valueOf(
                fieldMap.get(columnApiName.toLowerCase())
                  .getDescribe()
                  .getName()
              ),
              String.valueOf(
                fieldMap.get(columnApiName.toLowerCase())
                  .getDescribe()
                  .getType()
              )
            );
            lstColumnProperties.add(columnProperties);
          }
        }
      }

      //prepare SOQL query based on fieldAPIs
      String query = 'SELECT ';
      for (String columnApiName : columnList) {
        if (!columnApiName.equalsIgnoreCase('id')) {
          query += columnApiName + ', ';
        }
      }

      query += 'Id FROM ' + sobjApiName;

      response.lstDataTableRecords = Database.query(
        String.escapeSingleQuotes(query)
      );
      response.lstDataTableColumnProperties = lstColumnProperties;
      system.debug('response ------ >  ' + response);
      return response;
    }
    return null;
  }

  public class ColumnPropertiesWrapper {
    @AuraEnabled
    public String label { get; set; }
    @AuraEnabled
    public String fieldName { get; set; }
    @AuraEnabled
    public String type { get; set; }
    @AuraEnabled
    public boolean sortable { get; set; }

    public ColumnPropertiesWrapper(
      String label,
      String fieldName,
      String type
    ) {
      this.label = label;
      this.fieldName = fieldName;
      this.type = type;
      this.sortable = true;
    }
  }

  public class DynamicDataTableResponseWrapper {
    @AuraEnabled
    public List<sObject> lstDataTableRecords { get; set; }
    @AuraEnabled
    public List<ColumnPropertiesWrapper> lstDataTableColumnProperties {
      get;
      set;
    }
  }
}
