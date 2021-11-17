public without sharing class DynamicDataTableHelper {

    @AuraEnabled (cacheable=true)
    public static DynamicDataTableResponseWrapper getDatableInfo(String sobjApiName, string columnFields) {

            Map<String, String> returnMap = new Map<String,String>();
            list<String> columnList = new List<String>();
            DynamicDataTableResponseWrapper response   = new DynamicDataTableResponseWrapper();
            List<SObject> lstDataTableRecords = new List<SObject>();
            List<ColumnPropertiesWrapper> lstColumnProperties = new List<ColumnPropertiesWrapper>();

                if(!String.isEmpty(sobjApiName) &&  !String.isEmpty(columnFields)){

                    SObject obj = (SObject) Type.forName('Account').newInstance();
                    Map<String, Schema.SObjectField> fieldMap = 
                    obj.getSObjectType().getDescribe().fields.getMap();
                    system.System.debug(fieldMap.get('accountsource').getDescribe().getName());

                         columnList = columnFields.split(',');

                         for(String columnApiName : columnList){

                            if(fieldMap.containsKey(columnApiName.toLowerCase())){
                                ColumnPropertiesWrapper columnProperties = new ColumnPropertiesWrapper(
                                String.valueOf(fieldMap.get(columnApiName.toLowerCase()).getDescribe().getLabel()), 
                                String.valueOf(fieldMap.get(columnApiName.toLowerCase()).getDescribe().getName()), 
                                String.valueOf(fieldMap.get(columnApiName.toLowerCase()).getDescribe().getType()));
                                lstColumnProperties.add(columnProperties);
                            }
                         }

                //prepare SOQL query based on fieldAPIs	
                String query = 'SELECT ';
                for(String columnApiName : columnList) {
                    query += columnApiName + ', ';
                    }
                    
                    query += 'Id FROM ' + sobjApiName ;
                            
                     response.lstDataTableRecords = Database.query(String.escapeSingleQuotes(query));
                     response.lstDataTableColumnProperties = lstColumnProperties;

                     return response;

           
            }
            return null;
        
    }

    public class ColumnPropertiesWrapper{

        @AuraEnabled
            public String label {get;set;}
            @AuraEnabled       
            public String fieldName {get;set;}
            @AuraEnabled
            public String type {get;set;}
            public ColumnPropertiesWrapper(String label, String fieldName, String type)
            {
                this.label     = label; 
                this.fieldName = fieldName;
                this.type      = type;          
            }
    }

    public class DynamicDataTableResponseWrapper {
        @AuraEnabled
        public List<sObject> lstDataTableRecords {get;set;}
        @AuraEnabled
        public List<ColumnPropertiesWrapper> lstDataTableColumnProperties{get;set;}    
    }
}
